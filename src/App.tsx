import { useState, useEffect } from 'react';
import type { Crop, TourBooking, DeliveryOrder, DeliveryItem, GrowthStage } from './types';
import { INITIAL_CROPS } from './data/initialCrops';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FarmShowcase } from './components/FarmShowcase';
import { CropCalendar } from './components/CropCalendar';
import { TourBookingComponent } from './components/TourBooking';
import { DeliveryScheduler } from './components/DeliveryScheduler';
import { MyActivity } from './components/MyActivity';
import { FarmAdmin } from './components/FarmAdmin';
import { Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'crops' | 'booking' | 'delivery' | 'activity' | 'admin'>('crops');
  
  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem('mama_ada_crops');
    return saved ? JSON.parse(saved) : INITIAL_CROPS;
  });

  const [bookings, setBookings] = useState<TourBooking[]>(() => {
    const saved = localStorage.getItem('mama_ada_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    const saved = localStorage.getItem('mama_ada_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [basket, setBasket] = useState<DeliveryItem[]>(() => {
    const saved = localStorage.getItem('mama_ada_basket');
    return saved ? JSON.parse(saved) : [
      { cropId: 'crop-1', cropName: 'Roma Tomatoes', unitPrice: 2.80, unit: 'kg', quantity: 2 },
      { cropId: 'crop-2', cropName: 'Curly Kale (Sukuma Wiki)', unitPrice: 1.50, unit: 'bunch', quantity: 3 }
    ];
  });

  const [targetCropForTour, setTargetCropForTour] = useState<string | null>(null);

  const [web3FormsKey, setWeb3FormsKey] = useState<string>(() => {
    return localStorage.getItem('mama_ada_w3key') || '';
  });

  useEffect(() => {
    localStorage.setItem('mama_ada_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('mama_ada_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('mama_ada_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mama_ada_basket', JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    localStorage.setItem('mama_ada_w3key', web3FormsKey);
  }, [web3FormsKey]);

  const handleSelectCropForTour = (cropName: string) => {
    setTargetCropForTour(cropName);
    setActiveTab('booking');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleAddCropToDelivery = (crop: Crop) => {
    setBasket(prev => {
      const existing = prev.find(i => i.cropId === crop.id);
      if (existing) {
        return prev.map(i => i.cropId === crop.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        cropId: crop.id,
        cropName: crop.name,
        unitPrice: crop.unitPrice,
        unit: crop.unit,
        quantity: 1
      }];
    });
    setActiveTab('delivery');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleBookingCreated = (newBooking: TourBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleOrderCreated = (newOrder: DeliveryOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateCropStage = (cropId: string, stage: GrowthStage, progress: number) => {
    setCrops(prev => prev.map(c => c.id === cropId ? { ...c, growthStage: stage, progressPercent: progress } : c));
  };

  const handleAddCrop = (newCrop: Crop) => {
    setCrops(prev => [newCrop, ...prev]);
  };

  const handleClearActivity = () => {
    if (confirm('Clear your saved bookings and delivery orders from this browser?')) {
      setBookings([]);
      setOrders([]);
      localStorage.removeItem('mama_ada_bookings');
      localStorage.removeItem('mama_ada_orders');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activityCount={bookings.length + orders.length}
        deliveryBasketCount={basket.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'crops' && (
          <Hero
            onExploreCrops={() => {
              setActiveTab('crops');
              const el = document.getElementById('crops-calendar-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onBookTour={() => {
              setActiveTab('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onScheduleDelivery={() => {
              setActiveTab('delivery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        <div className="pt-6 space-y-12">
          {activeTab === 'crops' && (
            <>
              {/* Interactive Crop Planting Calendar */}
              <div id="crops-calendar-section">
                <CropCalendar
                  crops={crops}
                  onSelectCropForTour={handleSelectCropForTour}
                  onAddCropToDelivery={handleAddCropToDelivery}
                />
              </div>

              {/* Real Farm Visual Tour Gallery */}
              <FarmShowcase
                onBookTour={() => {
                  setActiveTab('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreCrops={() => {
                  const el = document.getElementById('crops-calendar-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </>
          )}

          {activeTab === 'booking' && (
            <TourBookingComponent
              crops={crops}
              selectedCropFromCatalog={targetCropForTour}
              onBookingCreated={handleBookingCreated}
            />
          )}

          {activeTab === 'delivery' && (
            <DeliveryScheduler
              crops={crops}
              basket={basket}
              setBasket={setBasket}
              onOrderCreated={handleOrderCreated}
            />
          )}

          {activeTab === 'activity' && (
            <MyActivity
              bookings={bookings}
              orders={orders}
              onClearActivity={handleClearActivity}
              onNavigateToBooking={() => setActiveTab('booking')}
              onNavigateToDelivery={() => setActiveTab('delivery')}
            />
          )}

          {activeTab === 'admin' && (
            <FarmAdmin
              crops={crops}
              onUpdateCropStage={handleUpdateCropStage}
              onAddCrop={handleAddCrop}
              web3FormsKey={web3FormsKey}
              setWeb3FormsKey={setWeb3FormsKey}
            />
          )}
        </div>
      </main>

      <footer className="bg-[#012217] text-stone-300 border-t border-emerald-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-auto rounded-xl overflow-hidden bg-black/40 p-0.5 border border-amber-400/30">
                <img src="/images/logo.png" alt="Mama Ada Farm & Foods" className="h-full w-auto object-contain" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">Mama Ada Farm</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Living organic farm practicing regenerative soil management, rainwater conservation, and direct farm-to-table relationships.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Farm Features</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>• Real-Time Crop Planting Schedules</li>
              <li>• Guided Crop Walk & Tasting Reservations</li>
              <li>• Custom Delivery Day & Frequency Planning</li>
              <li>• Automated 24h SMS/Email Notifications</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Visit & Contact</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Organic Valley Ridge, Farm Gate 1</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+254 700 000 000 / (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>hello@mamaadafarm.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Live Notifications</h4>
            <p className="text-stone-400 leading-relaxed">
              Equipped with instant <strong>.ics calendar download</strong>, <strong>Google Calendar links</strong>, and <strong>Web3Forms live email dispatch</strong>.
            </p>
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Configure Live Notification Key</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-emerald-950 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Mama Ada Farm & Foods®. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Grown with love & regenerative care <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
