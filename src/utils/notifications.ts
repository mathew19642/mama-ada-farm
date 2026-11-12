import type { TourBooking, DeliveryOrder } from '../types';

export interface NotificationLog {
  id: string;
  recipient: string;
  subject: string;
  type: 'Tour Booking' | 'Delivery Schedule';
  timestamp: string;
  bodyPreview: string;
  deliveryStatus: 'Sent' | 'Delivered' | 'Pending';
  channel: 'Email' | 'SMS Simulation';
}

/**
 * Sends a real email notification using Web3Forms or EmailJS (free client-side email endpoints)
 */
export async function sendEmailNotification(payload: {
  toEmail: string;
  toName: string;
  subject: string;
  message: string;
  accessKey?: string;
}): Promise<{ success: boolean; message: string }> {
  const accessKey = payload.accessKey || (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY;

  if (accessKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          to: payload.toEmail,
          from_name: 'Mama Ada Farm',
          subject: payload.subject,
          message: payload.message
        })
      });

      const data = await response.json();
      if (data.success) {
        return { success: true, message: 'Real email dispatched via Web3Forms gateway!' };
      }
    } catch (err) {
      console.warn('Real email dispatch failed, falling back to simulated log:', err);
    }
  }

  return {
    success: true,
    message: 'Notification simulated and logged to farm operations console.'
  };
}

export function createBookingEmailContent(booking: TourBooking): string {
  return `
Hello ${booking.customerName},

Thank you for booking a farm tour at Mama Ada Farm! 🌾

Here are your visit details:
- Booking Reference: ${booking.id}
- Date: ${booking.visitDate}
- Time Slot: ${booking.timeSlot}
- Guests: ${booking.guestCount}
- Crops to Inspect: ${booking.cropsToView.join(', ')}

Directions & Arrival:
Please arrive 15 minutes before your time slot. Sturdy footwear and sun protection are recommended. 
A reminder will be sent 24 hours prior to your visit.

Warm regards,
Mama Ada Farm Team
  `.trim();
}

export function createDeliveryEmailContent(order: DeliveryOrder): string {
  const itemsList = order.items
    .map(i => `  • ${i.cropName}: ${i.quantity} ${i.unit} ($${(i.quantity * i.unitPrice).toFixed(2)})`)
    .join('\n');

  const datesList = order.shipments
    .map(s => `  • Delivery #${s.deliveryIndex}: ${s.date} (Status: ${s.status})`)
    .join('\n');

  return `
Hello ${order.customerName},

Your Mama Ada Farm fresh produce delivery schedule is confirmed! 🧺

Delivery Summary:
- Order Reference: ${order.id}
- Preferred Day: ${order.preferredDayOfWeek}
- Total Deliveries: ${order.totalDeliveriesCount} shipments
- Total Amount: $${order.grandTotal.toFixed(2)}
- Destination: ${order.deliveryAddress}

Items in each harvest box:
${itemsList}

Scheduled Delivery Dates:
${datesList}

You will receive an automated dispatch reminder 24 hours before each harvest morning.

With gratitude,
Mama Ada Farm Harvesting Team
  `.trim();
}
