import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DUTSE_LOCATION,
  DutsePrayerTimes,
  DutseHijriDate,
  PrayerSlotInfo,
  calculateAstronomicalDutseTimes,
  fetchDutsePrayerTimesFromAPI,
  timeStringToMinutes
} from '../utils/dutsePrayerTimes';

export function useDutsePrayerTimes() {
  // Start with mathematically calculated exact astronomical times for Dutse for immediate 0ms load
  const [prayerTimes, setPrayerTimes] = useState<DutsePrayerTimes>(() =>
    calculateAstronomicalDutseTimes(new Date())
  );

  const [hijriDate, setHijriDate] = useState<DutseHijriDate>({
    readable: '1447 / 1448 AH',
    day: '',
    monthEn: 'Hijri',
    monthAr: '',
    year: '1448 AH',
    weekdayEn: '',
    weekdayAr: ''
  });

  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Live ticking clock updating every 1000ms
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch from Aladhan API for Dutse
  const loadPrayerTimes = useCallback(async (forcedDate?: Date) => {
    setIsLoading(true);
    setSyncError(null);
    const targetDate = forcedDate || new Date();

    // 1. Calculate astronomical fallback first
    const astronomical = calculateAstronomicalDutseTimes(targetDate);
    setPrayerTimes(astronomical);

    // 2. Fetch live official adhan timetable from Aladhan
    try {
      const data = await fetchDutsePrayerTimesFromAPI(targetDate);
      if (data?.times) {
        setPrayerTimes(data.times);
        if (data.hijri) {
          setHijriDate(data.hijri);
        }
        setIsLiveSynced(true);
      }
    } catch (err) {
      console.warn('Aladhan API unavailable, using high-precision astronomical engine for Dutse:', err);
      setSyncError('Using high-precision local calculation for Dutse');
      setIsLiveSynced(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  // Compute live slots, current prayer, next prayer, and second-by-second countdown
  const prayerState = useMemo(() => {
    const isFriday = currentTime.getDay() === 5;
    const currentTotalSeconds =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();
    const currentMinutes = Math.floor(currentTotalSeconds / 60);

    const baseSlots: PrayerSlotInfo[] = [
      {
        id: 'fajr',
        name: 'Fajr',
        time12: prayerTimes.fajr,
        time24: prayerTimes.fajr24,
        minutesOfDay: timeStringToMinutes(prayerTimes.fajr),
        isPrayer: true
      },
      {
        id: 'sunrise',
        name: 'Sunrise',
        time12: prayerTimes.sunrise,
        time24: prayerTimes.sunrise24,
        minutesOfDay: timeStringToMinutes(prayerTimes.sunrise),
        isPrayer: false
      },
      {
        id: 'dhuhr',
        name: isFriday ? "Jumu'ah" : 'Dhuhr',
        time12: prayerTimes.dhuhr,
        time24: prayerTimes.dhuhr24,
        minutesOfDay: timeStringToMinutes(prayerTimes.dhuhr),
        isPrayer: true,
        isJumuah: isFriday
      },
      {
        id: 'asr',
        name: 'Asr',
        time12: prayerTimes.asr,
        time24: prayerTimes.asr24,
        minutesOfDay: timeStringToMinutes(prayerTimes.asr),
        isPrayer: true
      },
      {
        id: 'maghrib',
        name: 'Maghrib',
        time12: prayerTimes.maghrib,
        time24: prayerTimes.maghrib24,
        minutesOfDay: timeStringToMinutes(prayerTimes.maghrib),
        isPrayer: true
      },
      {
        id: 'isha',
        name: 'Isha',
        time12: prayerTimes.isha,
        time24: prayerTimes.isha24,
        minutesOfDay: timeStringToMinutes(prayerTimes.isha),
        isPrayer: true
      }
    ];

    // Identify which slot is currently active and which prayer is next
    const prayerOnlySlots = baseSlots.filter((s) => s.isPrayer);

    let nextSlotIndex = 0;
    let secondsToNext = 24 * 3600;

    for (let i = 0; i < prayerOnlySlots.length; i++) {
      const slotSec = prayerOnlySlots[i].minutesOfDay * 60;
      if (currentTotalSeconds < slotSec) {
        nextSlotIndex = i;
        secondsToNext = slotSec - currentTotalSeconds;
        break;
      }
      if (i === prayerOnlySlots.length - 1) {
        // After Isha, next is tomorrow's Fajr
        nextSlotIndex = 0;
        const tomorrowFajrSec = 24 * 3600 + prayerOnlySlots[0].minutesOfDay * 60;
        secondsToNext = tomorrowFajrSec - currentTotalSeconds;
      }
    }

    const nextPrayerSlot = prayerOnlySlots[nextSlotIndex];

    // Current prayer slot (the one whose adhan has already taken place)
    const currentPrayerIndex =
      (nextSlotIndex - 1 + prayerOnlySlots.length) % prayerOnlySlots.length;
    const currentPrayerSlot = prayerOnlySlots[currentPrayerIndex];

    // Calculate progress percentage through the current window
    let windowDuration = 0;
    let windowElapsed = 0;

    if (nextSlotIndex === 0 && currentTotalSeconds >= prayerOnlySlots[prayerOnlySlots.length - 1].minutesOfDay * 60) {
      // Between Isha and tomorrow Fajr
      const ishaSec = prayerOnlySlots[prayerOnlySlots.length - 1].minutesOfDay * 60;
      const tomorrowFajrSec = 24 * 3600 + prayerOnlySlots[0].minutesOfDay * 60;
      windowDuration = tomorrowFajrSec - ishaSec;
      windowElapsed = currentTotalSeconds - ishaSec;
    } else {
      const prevSec = currentPrayerSlot.minutesOfDay * 60;
      const nextSec = nextPrayerSlot.minutesOfDay * 60;
      windowDuration = nextSec > prevSec ? nextSec - prevSec : 24 * 3600 - prevSec + nextSec;
      windowElapsed = currentTotalSeconds >= prevSec ? currentTotalSeconds - prevSec : currentTotalSeconds + (24 * 3600 - prevSec);
    }

    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round((windowElapsed / (windowDuration || 1)) * 100))
    );

    // Format countdown: "1h 45m 12s" or "45m 12s"
    const hours = Math.floor(secondsToNext / 3600);
    const minutes = Math.floor((secondsToNext % 3600) / 60);
    const seconds = secondsToNext % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    const countdownTimer = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    const countdownHuman =
      hours > 0
        ? `in ${hours}h ${minutes}m ${seconds}s`
        : `in ${minutes}m ${seconds}s`;

    // Mark slot states
    const slotsWithState: PrayerSlotInfo[] = baseSlots.map((slot) => ({
      ...slot,
      isNext: slot.name === nextPrayerSlot.name,
      isCurrent: slot.name === currentPrayerSlot.name
    }));

    return {
      slots: slotsWithState,
      currentPrayer: currentPrayerSlot,
      nextPrayer: nextPrayerSlot,
      secondsToNext,
      countdownTimer,
      countdownHuman,
      progressPercent
    };
  }, [prayerTimes, currentTime]);

  // Dutse local formatted time (West Africa Time, WAT)
  const dutseLocalTimeString = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: DUTSE_LOCATION.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }, [currentTime]);

  const dutseDateString = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      timeZone: DUTSE_LOCATION.timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [currentTime]);

  return {
    location: DUTSE_LOCATION,
    prayerTimes,
    hijriDate,
    currentTime,
    dutseLocalTimeString,
    dutseDateString,
    isLiveSynced,
    isLoading,
    syncError,
    refresh: () => loadPrayerTimes(),
    ...prayerState
  };
}
