import React from 'react';
import { Calendar, Truck, ArrowRight, Heart, Sparkles, MapPin, CheckCircle } from 'lucide-react';

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
    <div className="relative overflow-hidden bg-gradient-to-br from-[#012f1f] via-[#023c28] to-[#011e14] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 rounded-3xl mx-2 sm:mx-6 lg:mx-8 my-5 shadow-2xl border border-emerald-800/40">
      
      {/* Background glow and subtle motif */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand Story & CTA */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          {/* Logo Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/30 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Mama Ada Farm & Foods® • Fresh Organic Harvests</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
            Grown with Love, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-200">
              Harvested for Your Health.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto lg:mx-0 text-stone-200 text-sm sm:text-base leading-relaxed">
            Welcome to <strong>Mama Ada Farm & Foods</strong>. Explore our real-time planting calendar to see what's currently growing in our soils, reserve a guided walk to view and inspect our crops, or schedule recurring home deliveries directly from our harvest beds.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onExploreCrops}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-400/25 hover:scale-105"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              <span>View Planting Calendar</span>
            </button>

            <button
              onClick={onBookTour}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
            >
              <span>Book Crop Walk</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={onScheduleDelivery}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:scale-105 border border-emerald-400/30"
            >
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Schedule Deliveries</span>
            </button>
          </div>

          {/* Verified Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 border-t border-white/10 text-xs text-stone-300">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-amber-400" /> 100% Organically Nourished
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-amber-400" /> Guided Visitor Tours
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-amber-400" /> Farm-to-Door Delivery
            </span>
          </div>

        </div>

        {/* Right Column: Authentic Logo & Farm Photo Mosaic */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-sm sm:max-w-md">
            
            {/* Primary Real Farm Photo Card */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-700/60 shadow-2xl bg-black">
              <img
                src="/images/farm/farm-photo-3.jpg"
                alt="Mama Ada Farm lush beds"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Field Inspection
                  </span>
                  <h4 className="text-sm font-bold">Thriving Crop Canopy</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                  Live Farm
                </span>
              </div>
            </div>

            {/* Official Logo Floating Badge */}
            <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#012f1f] p-1.5 border-2 border-amber-400 shadow-2xl hover:scale-105 transition-transform">
              <img
                src="/images/logo.png"
                alt="Mama Ada Farm & Foods"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Secondary Real Farm Thumbnail Floating Card */}
            <div className="absolute -bottom-5 -right-3 sm:-right-5 w-36 sm:w-44 rounded-2xl overflow-hidden border-2 border-emerald-600/70 shadow-2xl bg-stone-900">
              <img
                src="/images/farm/farm-photo-1.jpg"
                alt="Mama Ada Farm produce"
                className="w-full h-24 sm:h-28 object-cover"
              />
              <div className="p-1.5 bg-stone-950/90 text-white text-[10px] font-medium flex items-center justify-between">
                <span className="truncate">Fresh Harvest</span>
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
