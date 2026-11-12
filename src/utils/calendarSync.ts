import type { TourBooking, ScheduledShipment } from '../types';

/**
 * Generates an .ics file string for direct download into Apple Calendar, Outlook, Google Calendar, or Mobile
 */
export function generateICSFile(booking: TourBooking): string {
  // Parse visit date and time slot
  const dateClean = booking.visitDate.replace(/-/g, '');
  
  let startHour = 9;
  let startMin = 0;
  if (booking.timeSlot.includes('11:30')) {
    startHour = 11;
    startMin = 30;
  } else if (booking.timeSlot.includes('02:30') || booking.timeSlot.includes('03:30')) {
    startHour = 14;
    startMin = 30;
  }

  const dtStart = `${dateClean}T${String(startHour).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;
  const dtEnd = `${dateClean}T${String(startHour + 2).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;

  const cropsList = booking.cropsToView.join(', ');
  const description = `Mama Ada Farm Crop Viewing Tour\\nVisitor: ${booking.customerName} (${booking.guestCount} guests)\\nCrops to inspect: ${cropsList}\\nBooking Ref: ${booking.id}\\nContact Phone: ${booking.customerPhone}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mama Ada Farm//Crop Tour Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@mamaadafarm.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:🌱 Farm Tour at Mama Ada Farm (Crops: ${cropsList})`,
    `DESCRIPTION:${description}`,
    `LOCATION:Mama Ada Farm, Organic Valley Ridge`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Your Mama Ada Farm Tour is tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Triggers browser download of the .ics calendar file
 */
export function downloadICS(booking: TourBooking) {
  const icsData = generateICSFile(booking);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `mama-ada-farm-tour-${booking.visitDate}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generates a one-click Google Calendar Event link
 */
export function getGoogleCalendarUrl(booking: TourBooking): string {
  const dateClean = booking.visitDate.replace(/-/g, '');
  const dtStart = `${dateClean}T090000Z`;
  const dtEnd = `${dateClean}T110000Z`;

  const title = encodeURIComponent(`🌱 Mama Ada Farm Tour - ${booking.cropsToView.slice(0, 2).join(' & ')}`);
  const details = encodeURIComponent(
    `Mama Ada Farm Tour & Crop Inspection\nBooking Ref: ${booking.id}\nVisitor: ${booking.customerName}\nCrops: ${booking.cropsToView.join(', ')}\nGuests: ${booking.guestCount}\nDirections: Mama Ada Farm Gate 1`
  );
  const location = encodeURIComponent('Mama Ada Farm, Organic Agricultural Belt');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
}

/**
 * Calculates upcoming calendar dates for scheduled deliveries
 */
export function calculateDeliveryDates(
  preferredDay: string,
  count: number,
  startDate?: string
): ScheduledShipment[] {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = daysOfWeek.findIndex(d => d.toLowerCase() === preferredDay.toLowerCase());

  const shipments: ScheduledShipment[] = [];
  const current = startDate ? new Date(startDate) : new Date();

  while (current.getDay() !== (targetDayIndex === -1 ? 3 : targetDayIndex)) {
    current.setDate(current.getDate() + 1);
  }

  if (current.toDateString() === new Date().toDateString() && new Date().getHours() >= 12) {
    current.setDate(current.getDate() + 7);
  }

  for (let i = 1; i <= count; i++) {
    const formattedDate = current.toISOString().split('T')[0];
    shipments.push({
      deliveryIndex: i,
      date: formattedDate,
      status: 'Scheduled'
    });
    current.setDate(current.getDate() + 7);
  }

  return shipments;
}
