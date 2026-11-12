import React from 'react';
import { Calendar, Truck, Clock, UserCheck, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'crops' | 'booking' | 'delivery' | 'activity' | 'admin';
  setActiveTab: (tab: 'crops' | 'booking' | 'delivery' | 'activity' | 'admin') => void;
  activityCount: number;
  deliveryBasketCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activityCount,
  deliveryBasketCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Farm Branding */}
          <div 
            onClick={() => setActiveTab('crops')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-11 sm:h-14 w-auto rounded-xl overflow-hidden shadow-xs border border-emerald-900/10 group-hover:scale-105 transition-transform bg-[#023c28]">
              <img
                src="/images/logo.png"
                alt="Mama Ada Farm & Foods Logo"
                className="h-full w-auto object-contain p-0.5"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                  Mama Ada Farm
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Farm & Foods®
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Crop Planting Calendars • Guided Farm Visits • Fresh Deliveries
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('crops')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'crops'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Crops Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'booking'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Book Visit</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'delivery'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Schedule Deliveries</span>
              {deliveryBasketCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                  {deliveryBasketCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'activity'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">My Activity</span>
              {activityCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  {activityCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              title="Farm Manager Console"
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-400 hover:text-stone-800 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
