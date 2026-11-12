import React from 'react';
import { Sprout, Calendar, Truck, Clock, UserCheck, ShieldCheck } from 'lucide-react';

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
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                  Mama Ada Farm
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  Organic Living
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Crop Planting Calendars • Farm Visits • Scheduled Produce
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('crops')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'crops'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Crops Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'booking'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Book Visit</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'delivery'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Schedule Deliveries</span>
              {deliveryBasketCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {deliveryBasketCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden md:inline">My Activity</span>
              {activityCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                  {activityCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              title="Farm Manager Console"
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-stone-800 text-white'
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

