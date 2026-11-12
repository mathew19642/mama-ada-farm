import React from 'react';
import { Calendar, Truck, ArrowRight, Sun, Droplets, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onExploreCrops: () => void;
  onBookTour: () => void;
  onScheduleDelivery: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCrops,
  onBookTour,
  onScheduleDelivery
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-xl">
      {/* Subtle organic pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        
        {/* Farm Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-sm">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Real-Time Planting Schedules & Direct Farm Visits</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Watch What We Plant, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-200">
            Taste What We Harvest.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed">
          Welcome to <strong className="text-white">Mama Ada Farm</strong>. Track our crop planting cycles in real time, reserve guided harvest walks to inspect your favorite produce, and set up customizable weekly deliveries straight from our fields to your door.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onExploreCrops}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
          >
            <Calendar className="w-4 h-4 text-stone-950" />
            <span>View Planting Calendar</span>
          </button>

          <button
            onClick={onBookTour}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
          >
            <span>Book Crop Viewing Walk</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onScheduleDelivery}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
          >
            <Truck className="w-4 h-4 text-stone-950" />
            <span>Schedule Deliveries</span>
          </button>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-3xl mx-auto text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Rainwater Catchment</h4>
              <p className="text-[11px] sm:text-xs text-stone-400">Pure, zero-chemical drip irrigation.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Live Growth Stages</h4>
              <p className="text-[11px] sm:text-xs text-stone-400">Know exactly when crops peak in sweetness.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Verified Reminders</h4>
              <p className="text-[11px] sm:text-xs text-stone-400">Automatic calendar invites and email alerts.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

