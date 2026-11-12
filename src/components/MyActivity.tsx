import React from 'react';
import type { TourBooking, DeliveryOrder } from '../types';
import { Calendar, Truck, Download, ExternalLink, UserCheck, Trash2 } from 'lucide-react';
import { downloadICS, getGoogleCalendarUrl } from '../utils/calendarSync';

interface MyActivityProps {
  bookings: TourBooking[];
  orders: DeliveryOrder[];
  onClearActivity: () => void;
  onNavigateToBooking: () => void;
  onNavigateToDelivery: () => void;
}

export const MyActivity: React.FC<MyActivityProps> = ({
  bookings,
  orders,
  onClearActivity,
  onNavigateToBooking,
  onNavigateToDelivery
}) => {
  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Customer Portal & Local Activity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            My Booked Farm Tours & Scheduled Deliveries
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Persisted in your browser storage. Access calendar invites, view upcoming delivery shipments, and check arrival dates.
          </p>
        </div>

        {(bookings.length > 0 || orders.length > 0) && (
          <button
            onClick={onClearActivity}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-600 transition-colors p-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Saved Data</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-stone-900">
            Guided Crop Tours ({bookings.length})
          </h3>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-stone-300">
            <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No Farm Tours Booked Yet</p>
            <p className="text-xs text-stone-400 mt-1 mb-4">Choose a date to come and view our crops in person.</p>
            <button
              onClick={onNavigateToBooking}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              Book a Farm Tour
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {b.id}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">{b.visitDate}</h4>
                    <p className="text-xs text-stone-500">{b.timeSlot}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-stone-600 border-t border-stone-100 pt-2">
                  <p><strong>Visitor:</strong> {b.customerName} ({b.guestCount} guests)</p>
                  <p><strong>Email:</strong> {b.customerEmail}</p>
                  <div>
                    <span className="text-stone-400 block mb-1">Crops to inspect:</span>
                    <div className="flex flex-wrap gap-1">
                      {b.cropsToView.map((crop, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px]">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => downloadICS(b)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .ics</span>
                  </button>

                  <a
                    href={getGoogleCalendarUrl(b)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Cal</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-stone-900">
            Scheduled Produce Deliveries ({orders.length})
          </h3>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-stone-300">
            <Truck className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No Produce Deliveries Scheduled</p>
            <p className="text-xs text-stone-400 mt-1 mb-4">Set up a weekly delivery day and recurring farm shipments.</p>
            <button
              onClick={onNavigateToDelivery}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors"
            >
              Schedule Deliveries
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                      {ord.id}
                    </span>
                    <h4 className="font-bold text-stone-900 text-base mt-1">
                      {ord.totalDeliveriesCount}x Deliveries (Every {ord.preferredDayOfWeek})
                    </h4>
                    <p className="text-xs text-stone-500">Destination: {ord.deliveryAddress}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Total Investment</span>
                    <span className="font-mono font-bold text-emerald-700 text-lg">
                      ${ord.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-stone-700 block mb-1">Items in each harvest box:</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {ord.items.map((it, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                        {it.cropName}: <strong>{it.quantity} {it.unit}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-stone-700 block mb-2">Upcoming Delivery Shipments:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ord.shipments.map((s) => (
                      <div key={s.deliveryIndex} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-stone-800">#{s.deliveryIndex}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                            {s.status}
                          </span>
                        </div>
                        <p className="font-mono text-stone-700">{s.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
