import React, { useState } from 'react';
import type { Crop, TourBooking } from '../types';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Mail, 
  Phone, 
  User, 
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadICS, getGoogleCalendarUrl } from '../utils/calendarSync';
import { sendEmailNotification, createBookingEmailContent } from '../utils/notifications';

interface TourBookingProps {
  crops: Crop[];
  selectedCropFromCatalog?: string | null;
  onBookingCreated: (booking: TourBooking) => void;
}

export const TourBookingComponent: React.FC<TourBookingProps> = ({
  crops,
  selectedCropFromCatalog,
  onBookingCreated
}) => {
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    selectedCropFromCatalog ? [selectedCropFromCatalog] : ['Roma Tomatoes', 'Hass Avocados']
  );

  const defaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [visitDate, setVisitDate] = useState<string>(defaultDate());
  const [timeSlot, setTimeSlot] = useState<string>('09:30 AM - Morning Dew & Harvest Walk');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TourBooking | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const availableSlots = [
    { time: '09:30 AM - Morning Dew & Harvest Walk', desc: 'Best for crisp leafy greens tasting and cool morning breeze.' },
    { time: '11:30 AM - Greenhouse & Organic Composting Tour', desc: 'Learn drip irrigation, bio-soil preparation, and solar greenhouses.' },
    { time: '03:30 PM - Sunset Orchard & Honeycomb Walk', desc: 'Visit our hillside fruit trees, avocado groves, and herb spiral.' }
  ];

  const toggleCropSelection = (cropName: string) => {
    if (selectedCrops.includes(cropName)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter(c => c !== cropName));
      }
    } else {
      setSelectedCrops([...selectedCrops, cropName]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !visitDate) return;

    setIsSubmitting(true);

    const newBooking: TourBooking = {
      id: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || 'Not provided',
      visitDate,
      timeSlot,
      cropsToView: selectedCrops,
      guestCount,
      notes,
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    onBookingCreated(newBooking);
    setConfirmedBooking(newBooking);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    const emailBody = createBookingEmailContent(newBooking);
    const result = await sendEmailNotification({
      toEmail: email,
      toName: name,
      subject: `🌱 Confirmed: Mama Ada Farm Tour Booking (${visitDate})`,
      message: emailBody
    });

    setNotificationMsg(result.message);
    setIsSubmitting(false);
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Farm Visit & Guided Crop Walk Reservations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Choose a Date to View Crops in the Field
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Pick your preferred day and check the exact crops you want to inspect, taste, or learn about with our master agronomists.
        </p>
      </div>

      {confirmedBooking ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-lg max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700">Booking Confirmed</span>
              <h3 className="text-xl font-bold text-stone-900">We look forward to hosting you!</h3>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Booking Ref:</span>
              <span className="font-mono font-bold text-stone-800">{confirmedBooking.id}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Visit Date:</span>
              <strong className="text-stone-900">{confirmedBooking.visitDate}</strong>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Time Slot:</span>
              <span className="text-stone-800 font-medium">{confirmedBooking.timeSlot}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Visitors:</span>
              <span className="text-stone-800">{confirmedBooking.guestCount} Guest(s)</span>
            </div>
            <div className="pt-1">
              <span className="text-stone-500 block mb-1">Crops you will inspect:</span>
              <div className="flex flex-wrap gap-1.5">
                {confirmedBooking.cropsToView.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Live Notification Dispatched</p>
              <p className="text-emerald-700 mt-0.5">
                Confirmation sent to <strong>{confirmedBooking.customerEmail}</strong>. {notificationMsg}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              Sync With Your Personal Calendar
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => downloadICS(confirmedBooking)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download .ics Calendar File</span>
              </button>

              <a
                href={getGoogleCalendarUrl(confirmedBooking)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold text-xs shadow-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                <span>Add to Google Calendar</span>
              </a>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setConfirmedBooking(null)}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Book another farm tour
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
                <span>Select Your Visit Date & Slot</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Choose Farm Tour Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">Tours run Tuesday through Sunday</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Number of Visitors
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                      className="w-full text-sm p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                    <span className="text-xs text-stone-500 shrink-0 flex items-center gap-1">
                      <Users className="w-4 h-4 text-stone-400" />
                      Guests
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Select Arrival Time Window
                </label>
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <label
                      key={slot.time}
                      className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        timeSlot === slot.time
                          ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        checked={timeSlot === slot.time}
                        onChange={() => setTimeSlot(slot.time)}
                        className="mt-1 accent-emerald-600"
                      />
                      <div className="text-xs">
                        <strong className="block text-stone-900 font-semibold">{slot.time}</strong>
                        <span className="text-stone-500">{slot.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">2</span>
                  <span>Crops You Wish to View & Inspect</span>
                </div>
                <span className="text-xs text-emerald-700 font-medium">
                  {selectedCrops.length} selected
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Click to tag the crops you want our guides to prioritize during your walk:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {crops.map((crop) => {
                  const isSelected = selectedCrops.includes(crop.name);
                  return (
                    <button
                      type="button"
                      key={crop.id}
                      onClick={() => toggleCropSelection(crop.name)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                        <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate">{crop.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">3</span>
                <span>Visitor Contact Details</span>
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
                      placeholder="e.g. Mary Wanjiku / David Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (for Invite & Reminders) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number (SMS / WhatsApp Day-of Alerts)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. +254 700 000 000 or (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Requests or Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Interested in organic pest control, bringing children, wheelchair access..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Farm Entrance Fee:</span>
                  <span className="font-semibold text-emerald-700">Free / Complimentary Walk</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Guided Tour Duration:</span>
                  <span>~75 Minutes</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming & Dispatching Notification...' : 'Confirm Booking & Get Calendar Invite 📅'}
              </button>

              <p className="text-[11px] text-stone-400 text-center">
                Instant .ics calendar download and email confirmation upon booking.
              </p>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};
