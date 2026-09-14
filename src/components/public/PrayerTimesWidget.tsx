import React, { useState } from 'react';
import { useDutsePrayerTimes } from '../../hooks/useDutsePrayerTimes';
import {
  Clock,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Volume2,
  Calendar,
  Sparkles,
  ChevronRight,
  RotateCw,
  CheckCircle2,
  Bell
} from 'lucide-react';

interface PrayerTimesWidgetProps {
  variant?: 'card' | 'banner' | 'compact';
  onExploreEvents?: () => void;
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
  variant = 'card',
  onExploreEvents
}) => {
  const {
    location,
    slots,
    nextPrayer,
    currentPrayer,
    countdownHuman,
    countdownTimer,
    dutseLocalTimeString,
    dutseDateString,
    hijriDate,
    isLiveSynced,
    isLoading,
    refresh,
    progressPercent
  } = useDutsePrayerTimes();

  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false);

  const getSlotIcon = (id: string) => {
    switch (id) {
      case 'fajr':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'sunrise':
        return <Sunrise className="w-4 h-4 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'asr':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'maghrib':
        return <Sunset className="w-4 h-4 text-rose-400" />;
      case 'isha':
        return <Moon className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleToggleNotification = () => {
    if (!notificationEnabled && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationEnabled(true);
        }
      });
    } else {
      setNotificationEnabled(!notificationEnabled);
    }
  };

  // BANNER VARIANT (Used on Homepage)
  if (variant === 'banner') {
    return (
      <div className="w-full bg-[#072E1B] border border-emerald-800/80 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Background Islamic Geometric Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Header & Live Location Badges */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Dutse Adhan Sync</span>
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                {hijriDate.readable || '1448 AH'}
              </span>

              <button
                onClick={() => setUse24Hour(!use24Hour)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors font-mono cursor-pointer"
                title="Toggle between 12-hour and 24-hour time display"
              >
                {use24Hour ? '24H' : '12H'}
              </button>

              <button
                onClick={refresh}
                disabled={isLoading}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-colors cursor-pointer"
                title="Refresh Dutse prayer times"
                aria-label="Refresh prayer times"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">
                {location.city}, {location.state}
              </span>
              <span className="text-emerald-300/70 hidden sm:inline">•</span>
              <span className="text-emerald-200 text-xs hidden sm:inline font-mono">
                {location.campus} (WAT: UTC+1)
              </span>
            </div>

            {/* Live Clock & Countdown indicator */}
            <div className="flex items-center gap-3 pt-1">
              <div className="font-mono text-sm sm:text-base font-extrabold text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{dutseLocalTimeString}</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="text-xs text-emerald-100 font-medium">
                Next: <strong className="text-white font-bold">{nextPrayer.name}</strong>{' '}
                <span className="text-amber-300 font-mono font-bold">({countdownHuman})</span>
              </div>
            </div>
          </div>

          {/* Slots Horizontal Matrix */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 w-full lg:w-auto">
            {slots.map((slot) => {
              const displayTime = use24Hour ? slot.time24 : slot.time12;
              return (
                <div
                  key={slot.id}
                  className={`p-2.5 sm:p-3 rounded-2xl text-center transition-all relative ${
                    slot.isNext
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-lg scale-[1.03] ring-2 ring-amber-300'
                      : slot.isCurrent
                      ? 'bg-emerald-800/80 border border-emerald-500/50 text-white'
                      : 'bg-black/30 border border-emerald-900/60 text-emerald-100 hover:bg-black/40'
                  }`}
                >
                  {slot.isNext && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-950 text-amber-300 text-[8px] font-black uppercase rounded-full tracking-wider shadow-xs">
                      Next
                    </span>
                  )}
                  {slot.isCurrent && !slot.isNext && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-full tracking-wider shadow-xs">
                      Current
                    </span>
                  )}

                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className={slot.isNext ? 'text-slate-900' : ''}>
                      {getSlotIcon(slot.id)}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wide ${
                        slot.isNext ? 'text-slate-950' : 'text-slate-200'
                      }`}
                    >
                      {slot.name}
                    </span>
                  </div>

                  <div
                    className={`font-mono text-xs sm:text-sm font-black ${
                      slot.isNext ? 'text-slate-950' : 'text-white'
                    }`}
                  >
                    {displayTime}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Progress Bar through Current Prayer Window */}
        <div className="mt-4 pt-3 border-t border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-200/80">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-emerald-300">
              Window Progress: {progressPercent}%
            </span>
            <div className="w-24 sm:w-36 h-1.5 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-700/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-emerald-200 text-xs">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Iqamah holds 10 mins after Adhan at FUD Mosque</span>
            </span>

            {onExploreEvents && (
              <button
                onClick={onExploreEvents}
                className="text-amber-300 hover:text-amber-200 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Halqah Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CARD VARIANT
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">
                  Dutse Prayer Schedule
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Live</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{location.city}, {location.state} (FUD Central Mosque)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Next Prayer
            </span>
            <span className="text-xs font-black text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mt-0.5">
              {nextPrayer.name} ({countdownHuman})
            </span>
          </div>

          <button
            onClick={() => setUse24Hour(!use24Hour)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-colors cursor-pointer"
            title="Toggle 12h / 24h format"
          >
            {use24Hour ? '24H' : '12H'}
          </button>

          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Sync latest timings"
            aria-label="Sync prayer timings"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-800' : ''}`} />
          </button>
        </div>
      </div>

      {/* Date banner & current time */}
      <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold text-slate-700">{dutseDateString}</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-emerald-800">{hijriDate.readable || '1448 AH'}</span>
        </div>
        <div className="font-mono font-bold text-slate-900">
          WAT: {dutseLocalTimeString}
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const displayTime = use24Hour ? slot.time24 : slot.time12;
          return (
            <div
              key={slot.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                slot.isNext
                  ? 'bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/30'
                  : slot.isCurrent
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    slot.isNext
                      ? 'text-amber-300'
                      : slot.isCurrent
                      ? 'text-emerald-900'
                      : 'text-slate-500'
                  }`}
                >
                  {slot.name}
                </span>
                <div
                  className={`p-1.5 rounded-lg ${
                    slot.isNext
                      ? 'bg-white/15 text-amber-300'
                      : slot.isCurrent
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white text-slate-600 shadow-2xs'
                  }`}
                >
                  {getSlotIcon(slot.id)}
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span
                  className={`font-mono text-base sm:text-lg font-black ${
                    slot.isNext ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {displayTime}
                </span>

                {slot.isNext && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                    Next
                  </span>
                )}
                {slot.isCurrent && !slot.isNext && (
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded-full uppercase">
                    Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Iqamah holds 10 mins after Adhan at FUD Campus Mosque</span>
        </div>

        {onExploreEvents && (
          <button
            onClick={onExploreEvents}
            className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Campus Halqah & Usrah Times</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
