/**
 * Real-time Islamic Prayer Times Service & Astronomical Engine
 * Configured specifically for Dutse, Jigawa State, Nigeria
 * Coordinates: Latitude 11.7562° N, Longitude 9.3389° E
 * Timezone: Africa/Lagos (UTC+1 / West Africa Time)
 * Primary Adhan calculation standard: Muslim World League (MWL) / Maliki juristic shadow method
 */

export const DUTSE_LOCATION = {
  city: 'Dutse',
  state: 'Jigawa State',
  country: 'Nigeria',
  campus: 'Federal University Dutse (Central Mosque)',
  latitude: 11.7562,
  longitude: 9.3389,
  elevation: 430, // meters above sea level
  timezone: 'Africa/Lagos',
  utcOffset: 1 // WAT is UTC+1
};

export interface DutsePrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajr24: string;
  sunrise24: string;
  dhuhr24: string;
  asr24: string;
  maghrib24: string;
  isha24: string;
}

export interface DutseHijriDate {
  readable: string;
  day: string;
  monthEn: string;
  monthAr: string;
  year: string;
  weekdayEn: string;
  weekdayAr: string;
}

export interface PrayerSlotInfo {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  time12: string;
  time24: string;
  minutesOfDay: number;
  isPrayer: boolean; // false for sunrise
  isCurrent?: boolean;
  isNext?: boolean;
  isJumuah?: boolean;
}

/**
 * Astronomical Calculation Engine for Dutse, Jigawa State
 * Provides 100% offline & instantaneous solar calculation
 */
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fixHour(hour: number): number {
  hour = hour - 24 * Math.floor(hour / 24);
  return hour < 0 ? hour + 24 : hour;
}

function fixAngle(angle: number): number {
  angle = angle - 360 * Math.floor(angle / 360);
  return angle < 0 ? angle + 360 : angle;
}

function calculateJulianDate(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

function calculateSunPosition(jd: number): { declination: number; equationOfTime: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g)));

  const e = 23.439 - 0.00000036 * D;
  const RA = toDegrees(
    Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))
  ) / 15;

  const declination = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
  const equationOfTime = q / 15 - fixHour(RA);

  return { declination, equationOfTime };
}

/**
 * Computes mathematically exact prayer times for Dutse on a given date
 */
export function calculateAstronomicalDutseTimes(date: Date = new Date()): DutsePrayerTimes {
  const jd = calculateJulianDate(date);
  const { declination, equationOfTime } = calculateSunPosition(jd);
  const lat = DUTSE_LOCATION.latitude;
  const lng = DUTSE_LOCATION.longitude;
  const timezone = DUTSE_LOCATION.utcOffset; // +1 for Nigeria WAT

  // Solar noon in hours (Dhuhr)
  const dhuhrHour = fixHour(12 + timezone - lng / 15 - equationOfTime);

  // Helper for Hour Angle
  const computeHourAngle = (angle: number): number => {
    const sinAngle = Math.sin(toRadians(-angle));
    const sinLat = Math.sin(toRadians(lat));
    const sinDec = Math.sin(toRadians(declination));
    const cosLat = Math.cos(toRadians(lat));
    const cosDec = Math.cos(toRadians(declination));

    const cosH = (sinAngle - sinLat * sinDec) / (cosLat * cosDec);
    if (cosH > 1 || cosH < -1) return 0; // Extreme latitudes
    return toDegrees(Math.acos(cosH)) / 15;
  };

  // Asr hour angle (Standard / Maliki: shadow length = 1)
  const computeAsrHourAngle = (): number => {
    const shadowFactor = 1;
    const tanDiff = Math.abs(lat - declination);
    const angle = toDegrees(Math.atan(1 / (shadowFactor + Math.tan(toRadians(tanDiff)))));
    const sinAngle = Math.sin(toRadians(angle));
    const sinLat = Math.sin(toRadians(lat));
    const sinDec = Math.sin(toRadians(declination));
    const cosLat = Math.cos(toRadians(lat));
    const cosDec = Math.cos(toRadians(declination));

    const cosH = (sinAngle - sinLat * sinDec) / (cosLat * cosDec);
    if (cosH > 1 || cosH < -1) return 0;
    return toDegrees(Math.acos(cosH)) / 15;
  };

  // Angles:
  // Fajr: 18° below horizon (MWL convention)
  // Sunrise: 0.833° below horizon + elevation correction (approx 0.833)
  // Maghrib: 0.833° below horizon
  // Isha: 17° below horizon (MWL convention)
  const fajrHA = computeHourAngle(18);
  const sunriseHA = computeHourAngle(0.833 + 0.0347 * Math.sqrt(DUTSE_LOCATION.elevation));
  const asrHA = computeAsrHourAngle();
  const maghribHA = computeHourAngle(0.833 + 0.0347 * Math.sqrt(DUTSE_LOCATION.elevation));
  const ishaHA = computeHourAngle(17);

  const formatHours = (hoursDec: number): { time12: string; time24: string } => {
    let totalMinutes = Math.round(hoursDec * 60);
    totalMinutes = (totalMinutes + 24 * 60) % (24 * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    const h24Str = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const time24 = `${h24Str}:${mStr}`;

    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const h12Str = String(h12).padStart(2, '0');
    const time12 = `${h12Str}:${mStr} ${period}`;

    return { time12, time24 };
  };

  const fFajr = formatHours(dhuhrHour - fajrHA);
  const fSunrise = formatHours(dhuhrHour - sunriseHA);
  const fDhuhr = formatHours(dhuhrHour + 0.02); // 1-2 min past zenith for precautionary Zawal
  const fAsr = formatHours(dhuhrHour + asrHA);
  const fMaghrib = formatHours(dhuhrHour + maghribHA);
  const fIsha = formatHours(dhuhrHour + ishaHA);

  return {
    fajr: fFajr.time12,
    sunrise: fSunrise.time12,
    dhuhr: fDhuhr.time12,
    asr: fAsr.time12,
    maghrib: fMaghrib.time12,
    isha: fIsha.time12,
    fajr24: fFajr.time24,
    sunrise24: fSunrise.time24,
    dhuhr24: fDhuhr.time24,
    asr24: fAsr.time24,
    maghrib24: fMaghrib.time24,
    isha24: fIsha.time24
  };
}

/**
 * Converts "05:18 AM" or "17:40" to minutes of day
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  if (clean.includes('AM') || clean.includes('PM')) {
    const [t, mod] = clean.split(' ');
    const [rawH, rawM] = t.split(':').map(Number);
    let h = rawH;
    if (mod === 'PM' && h < 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return h * 60 + (rawM || 0);
  } else {
    const [h, m] = clean.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }
}

/**
 * Format a 24h string ("05:02") into 12h format ("05:02 AM")
 */
export function to12HourFormat(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr.slice(0, 2)} ${period}`;
}

/**
 * Fetch real-time prayer times and Hijri date from Aladhan API for Dutse
 */
export async function fetchDutsePrayerTimesFromAPI(
  date: Date = new Date()
): Promise<{ times: DutsePrayerTimes; hijri: DutseHijriDate }> {
  const timestamp = Math.floor(date.getTime() / 1000);
  const cacheKey = `mssn_dutse_prayer_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;

  // Check cached response for today to prevent unnecessary network spam
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.times && parsed?.hijri) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }

  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${DUTSE_LOCATION.latitude}&longitude=${DUTSE_LOCATION.longitude}&method=3`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Aladhan API responded with status ${response.status}`);
  }

  const json = await response.json();
  if (json.code !== 200 || !json.data?.timings) {
    throw new Error(json.data || 'Invalid response from prayer API');
  }

  const timings = json.data.timings;
  const hijriRaw = json.data.date?.hijri || {};

  const clean24 = (raw: string) => {
    // e.g. "05:02 (WAT)" -> "05:02"
    return raw.split(' ')[0].trim();
  };

  const times: DutsePrayerTimes = {
    fajr: to12HourFormat(clean24(timings.Fajr)),
    sunrise: to12HourFormat(clean24(timings.Sunrise)),
    dhuhr: to12HourFormat(clean24(timings.Dhuhr)),
    asr: to12HourFormat(clean24(timings.Asr)),
    maghrib: to12HourFormat(clean24(timings.Maghrib)),
    isha: to12HourFormat(clean24(timings.Isha)),
    fajr24: clean24(timings.Fajr),
    sunrise24: clean24(timings.Sunrise),
    dhuhr24: clean24(timings.Dhuhr),
    asr24: clean24(timings.Asr),
    maghrib24: clean24(timings.Maghrib),
    isha24: clean24(timings.Isha)
  };

  const hijri: DutseHijriDate = {
    readable: `${hijriRaw.day || ''} ${hijriRaw.month?.en || ''} ${hijriRaw.year || ''} AH`.trim(),
    day: hijriRaw.day || '',
    monthEn: hijriRaw.month?.en || 'Hijri',
    monthAr: hijriRaw.month?.ar || '',
    year: hijriRaw.year ? `${hijriRaw.year} AH` : '',
    weekdayEn: hijriRaw.weekday?.en || '',
    weekdayAr: hijriRaw.weekday?.ar || ''
  };

  const result = { times, hijri };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // Ignore storage quota
  }

  return result;
}
