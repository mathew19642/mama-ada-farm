export type CropCategory = 'Leafy Greens' | 'Fruits & Orchards' | 'Root Vegetables' | 'Herbs & Aromatics' | 'Legumes & Grains';

export type GrowthStage = 'Seedling' | 'Vegetative' | 'Flowering / Fruiting' | 'Harvest Ready' | 'Harvested';

export interface Crop {
  id: string;
  name: string;
  variety: string;
  category: CropCategory;
  imageUrl: string;
  plantingDate: string; // YYYY-MM-DD
  expectedHarvestDate: string; // YYYY-MM-DD
  growthStage: GrowthStage;
  progressPercent: number; // 0 - 100
  unitPrice: number;
  unit: string; // e.g. "kg", "bunch", "basket", "crate"
  isAvailableForTour: boolean;
  farmSection: string; // e.g. "Greenhouse A", "Orchard North", "Field 3"
  description: string;
  nutritionalHighlights: string[];
}

export interface TourBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  visitDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM - 10:30 AM"
  cropsToView: string[]; // crop names or IDs
  guestCount: number;
  notes?: string;
  createdAt: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface DeliveryItem {
  cropId: string;
  cropName: string;
  unitPrice: number;
  unit: string;
  quantity: number;
}

export interface ScheduledShipment {
  deliveryIndex: number;
  date: string; // YYYY-MM-DD
  status: 'Scheduled' | 'Dispatched' | 'Delivered';
}

export interface DeliveryOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  items: DeliveryItem[];
  preferredDayOfWeek: string; // e.g. "Wednesday"
  totalDeliveriesCount: number; // 1, 2, 4, 8, etc.
  frequency: 'Once' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
  totalAmountPerDelivery: number;
  grandTotal: number;
  shipments: ScheduledShipment[];
  createdAt: string;
}

