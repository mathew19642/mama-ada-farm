import React, { useState } from 'react';
import type { Crop, DeliveryItem, DeliveryOrder } from '../types';
import { 
  Truck, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateDeliveryDates } from '../utils/calendarSync';
import { sendEmailNotification, createDeliveryEmailContent } from '../utils/notifications';

interface DeliverySchedulerProps {
  crops: Crop[];
  basket: DeliveryItem[];
  setBasket: React.Dispatch<React.SetStateAction<DeliveryItem[]>>;
  onOrderCreated: (order: DeliveryOrder) => void;
}

export const DeliveryScheduler: React.FC<DeliverySchedulerProps> = ({
  crops,
  basket,
  setBasket,
  onOrderCreated
}) => {
  const [preferredDay, setPreferredDay] = useState<string>('Wednesday');
  const [deliveryCount, setDeliveryCount] = useState<number>(4);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<DeliveryOrder | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const days = [
    { name: 'Wednesday', desc: 'Mid-week morning harvest (Picked 6:00 AM)' },
    { name: 'Friday', desc: 'Weekend prep harvest (Picked 6:30 AM)' },
    { name: 'Saturday', desc: 'Saturday family basket dispatch' }
  ];

  const frequencyPresets = [
    { count: 1, label: '1 Single Delivery', desc: 'One-off farm box trial' },
    { count: 2, label: '2 Deliveries', desc: 'Fortnightly fresh box' },
    { count: 4, label: '4 Deliveries (1 Month)', desc: 'Weekly regular fresh supply (5% off)' },
    { count: 8, label: '8 Deliveries (2 Months)', desc: 'Bi-monthly season pass (10% off)' }
  ];

  const subtotalPerDelivery = basket.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountRate = deliveryCount >= 8 ? 0.10 : deliveryCount >= 4 ? 0.05 : 0;
  const deliveryFee = 3.50;
  const totalPerDelivery = (subtotalPerDelivery * (1 - discountRate)) + (subtotalPerDelivery > 0 ? deliveryFee : 0);
  const grandTotal = totalPerDelivery * deliveryCount;

  const calculatedShipments = calculateDeliveryDates(preferredDay, deliveryCount);

  const updateQuantity = (cropId: string, delta: number) => {
    setBasket(prev => {
      return prev
        .map(item => {
          if (item.cropId === cropId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as DeliveryItem[];
    });
  };

  const removeBasketItem = (cropId: string) => {
    setBasket(prev => prev.filter(item => item.cropId !== cropId));
  };

  const addCropDirectly = (crop: Crop) => {
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
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (basket.length === 0 || !name || !email || !address) return;

    setIsSubmitting(true);

    const newOrder: DeliveryOrder = {
      id: `MAF-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || 'Not provided',
      deliveryAddress: address,
      deliveryNotes,
      items: basket,
      preferredDayOfWeek: preferredDay,
      totalDeliveriesCount: deliveryCount,
      frequency: deliveryCount === 1 ? 'Once' : 'Weekly',
      totalAmountPerDelivery: totalPerDelivery,
      grandTotal,
      shipments: calculatedShipments,
      createdAt: new Date().toISOString()
    };

    onOrderCreated(newOrder);
    setConfirmedOrder(newOrder);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    const emailBody = createDeliveryEmailContent(newOrder);
    const result = await sendEmailNotification({
      toEmail: email,
      toName: name,
      subject: `🧺 Confirmed: Mama Ada Farm Produce Deliveries (${deliveryCount}x ${preferredDay}s)`,
      message: emailBody
    });

    setNotificationMsg(result.message);
    setIsSubmitting(false);
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 mb-2">
          <Truck className="w-3.5 h-3.5" />
          <span>Scheduled Farm-to-Door Delivery Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Select Your Delivery Day & Number of Shipments
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Pick which crops to receive, choose your preferred weekly harvest day, and set how many deliveries you want.
        </p>
      </div>

      {confirmedOrder ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-lg max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <PackageCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700">Delivery Schedule Active</span>
              <h3 className="text-xl font-bold text-stone-900">Your Fresh Produce Deliveries Are Booked!</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 block mb-1">Order Details</span>
              <div className="flex justify-between border-b border-stone-200 pb-1">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-mono font-bold text-stone-800">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1">
                <span className="text-stone-500">Deliveries Scheduled:</span>
                <strong className="text-stone-900">{confirmedOrder.totalDeliveriesCount} shipments</strong>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1">
                <span className="text-stone-500">Preferred Day:</span>
                <span className="text-stone-800">Every {confirmedOrder.preferredDayOfWeek}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">Total Investment:</span>
                <span className="font-bold text-emerald-700 font-mono text-base">${confirmedOrder.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 block mb-1">Destination & Notes</span>
              <p className="text-stone-700 leading-snug">
                <strong>Recipient:</strong> {confirmedOrder.customerName}<br />
                <strong>Address:</strong> {confirmedOrder.deliveryAddress}<br />
                <strong>Contact:</strong> {confirmedOrder.customerPhone}
              </p>
              {confirmedOrder.deliveryNotes && (
                <p className="text-stone-500 text-xs italic">
                  Note: {confirmedOrder.deliveryNotes}
                </p>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Live Notification Dispatched</p>
              <p className="text-emerald-700 mt-0.5">
                Delivery confirmation sent to <strong>{confirmedOrder.customerEmail}</strong>. {notificationMsg}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Your Scheduled Delivery Timeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {confirmedOrder.shipments.map((s) => (
                <div key={s.deliveryIndex} className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-emerald-800">Delivery #{s.deliveryIndex}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-200 text-emerald-900">
                      {s.status}
                    </span>
                  </div>
                  <p className="font-mono text-stone-800 font-medium">{s.date}</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Morning 08:00 - 12:00</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setConfirmedOrder(null);
                setBasket([]);
              }}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Configure another delivery order
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">1</span>
                  <span>Items in Your Harvest Box</span>
                </div>
                <span className="text-xs text-stone-500">
                  {basket.length} {basket.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {basket.length === 0 ? (
                <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                  <Truck className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-600 font-medium">Your delivery basket is empty.</p>
                  <p className="text-[11px] text-stone-400">Click below to add popular in-season crops:</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {crops.slice(0, 4).map(c => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => addCropDirectly(c)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-emerald-500 text-stone-700 transition-colors"
                      >
                        + {c.name} (${c.unitPrice.toFixed(2)})
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {basket.map((item) => (
                    <div key={item.cropId} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-stone-900 block font-semibold">{item.cropName}</strong>
                        <span className="text-stone-500 font-mono">
                          ${item.unitPrice.toFixed(2)} / {item.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cropId, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold font-mono text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cropId, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="w-16 text-right font-mono font-bold text-stone-900">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeBasketItem(item.cropId)}
                          className="text-stone-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 block mb-1.5">Add more available crops to this basket:</span>
                <div className="flex flex-wrap gap-1.5">
                  {crops.map(c => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => addCropDirectly(c)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-stone-50 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 border border-stone-200 transition-colors"
                    >
                      + {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">2</span>
                <span>Select Your Preferred Delivery Day</span>
              </div>
              <p className="text-xs text-stone-500">
                Choose the day of the week you would like your recurring harvest shipments delivered:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {days.map((d) => (
                  <label
                    key={d.name}
                    className={`flex flex-col justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      preferredDay === d.name
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs text-stone-900 font-bold">{d.name}</strong>
                      <input
                        type="radio"
                        name="preferredDay"
                        checked={preferredDay === d.name}
                        onChange={() => setPreferredDay(d.name)}
                        className="accent-amber-600"
                      />
                    </div>
                    <span className="text-[11px] text-stone-500 leading-tight">{d.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">3</span>
                  <span>Number of Deliveries</span>
                </div>
                <span className="font-mono font-bold text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                  {deliveryCount} {deliveryCount === 1 ? 'Shipment' : 'Weekly Shipments'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {frequencyPresets.map(preset => (
                  <button
                    type="button"
                    key={preset.count}
                    onClick={() => setDeliveryCount(preset.count)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      deliveryCount === preset.count
                        ? 'border-amber-500 bg-amber-50 font-bold text-amber-900'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                    }`}
                  >
                    <span className="block font-semibold">{preset.label}</span>
                    <span className="text-[10px] text-stone-500 font-normal">{preset.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Custom number of deliveries:</span>
                  <span className="font-bold text-stone-800">{deliveryCount} shipments</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={deliveryCount}
                  onChange={(e) => setDeliveryCount(parseInt(e.target.value) || 1)}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>1 (One-off)</span>
                  <span>4 (Monthly)</span>
                  <span>8 (Bi-monthly)</span>
                  <span>12 (Quarterly)</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                  Calendar Schedule for your {deliveryCount} Deliveries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {calculatedShipments.map((s) => (
                    <span key={s.deliveryIndex} className="px-2 py-1 rounded-md bg-white border border-stone-200 text-[11px] font-mono text-stone-700">
                      #{s.deliveryIndex}: <strong>{s.date}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">4</span>
                <span>Delivery Address & Recipient</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email (for Delivery Notifications & Dispatch Alerts) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number (Driver Contact) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+254 700 000 000 or (555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Address / Drop-off Point *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Street address, building, apartment/house number..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Delivery Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave at front porch, ring gate bell..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Produce Subtotal (per box):</span>
                  <span className="font-mono font-medium">${subtotalPerDelivery.toFixed(2)}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Subscription Discount ({discountRate * 100}%):</span>
                    <span className="font-mono">-${(subtotalPerDelivery * discountRate).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Cold-Chain Packaging & Delivery:</span>
                  <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-800 font-semibold pt-1 border-t border-stone-200">
                  <span>Price per Delivery:</span>
                  <span className="font-mono">${totalPerDelivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-1 border-t border-stone-200">
                  <span>Grand Total ({deliveryCount} Deliveries):</span>
                  <span className="font-mono text-emerald-700 text-base">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || basket.length === 0}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? 'Scheduling & Dispatching Email...' : 'Schedule Deliveries & Enable Live Alerts 📦'}
              </button>

              <p className="text-[11px] text-stone-400 text-center">
                Automated email alerts sent 24h before each {preferredDay} harvest morning.
              </p>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};
