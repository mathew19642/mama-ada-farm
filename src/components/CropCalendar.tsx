import { useState } from 'react';
import type { Crop, CropCategory, GrowthStage } from '../types';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Eye, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Sprout, 
  Clock, 
  Info,
  Sparkles
} from 'lucide-react';

interface CropCalendarProps {
  crops: Crop[];
  onSelectCropForTour: (cropName: string) => void;
  onAddCropToDelivery: (crop: Crop) => void;
}

export const CropCalendar = ({
  crops,
  onSelectCropForTour,
  onAddCropToDelivery
}: CropCalendarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingCrop, setInspectingCrop] = useState<Crop | null>(null);

  const categories: (string | CropCategory)[] = [
    'All',
    'Leafy Greens',
    'Fruits & Orchards',
    'Root Vegetables',
    'Herbs & Aromatics',
    'Legumes & Grains'
  ];

  const stages: (string | GrowthStage)[] = [
    'All',
    'Harvest Ready',
    'Flowering / Fruiting',
    'Vegetative',
    'Seedling'
  ];

  const getDaysRemaining = (harvestDateStr: string): number => {
    const today = new Date();
    const harvest = new Date(harvestDateStr);
    const diffTime = harvest.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStageBadgeColor = (stage: GrowthStage) => {
    switch (stage) {
      case 'Harvest Ready':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Flowering / Fruiting':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Vegetative':
        return 'bg-lime-100 text-lime-800 border-lime-300';
      case 'Seedling':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const filteredCrops = crops.filter(crop => {
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesStage = selectedStage === 'All' || crop.growthStage === selectedStage;
    const matchesSearch = 
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStage && matchesSearch;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Mama Ada Farm Live Planting Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Current Crops & Planting Schedules
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Real-time tracking of what's growing in our beds, greenhouses, and orchards. Book a visit to see them in person or schedule home deliveries.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-2xs"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-100 p-2 rounded-2xl">
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium hidden sm:inline">Stage:</span>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-white border border-stone-200 text-stone-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage === 'All' ? 'All Growth Stages' : stage}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCrops.map((crop) => {
          const daysLeft = getDaysRemaining(crop.expectedHarvestDate);

          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${getStageBadgeColor(crop.growthStage)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {crop.growthStage}
                  </span>
                </div>

                {crop.isAvailableForTour && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-900/80 text-amber-300 backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Tour Open
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">
                    {crop.category}
                  </p>
                  <h3 className="text-lg font-bold leading-snug drop-shadow-xs">
                    {crop.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-1 italic">
                    {crop.variety}
                  </p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {crop.farmSection}
                  </span>
                  <span className="font-bold text-stone-900 text-sm">
                    ${crop.unitPrice.toFixed(2)} <span className="text-xs font-normal text-stone-500">/ {crop.unit}</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                      Planting: <span className="font-medium text-stone-700">{crop.plantingDate}</span>
                    </span>
                    <span className="font-bold text-emerald-700 font-mono text-[11px]">
                      {crop.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        crop.progressPercent >= 90
                          ? 'bg-emerald-500'
                          : crop.progressPercent >= 60
                          ? 'bg-lime-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${crop.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-stone-500">
                    <span>Expected Harvest: <strong className="text-stone-700">{crop.expectedHarvestDate}</strong></span>
                    <span className="font-medium text-stone-700 flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Harvesting Now'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectCropForTour(crop.name)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Book Walk</span>
                    </button>

                    <button
                      onClick={() => onAddCropToDelivery(crop)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Order Fresh</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setInspectingCrop(crop)}
                    className="w-full flex items-center justify-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 transition-colors py-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>View Farming Notes & Nutrition</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
          <Sprout className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-stone-700">No crops found</h3>
          <p className="text-xs text-stone-500 mt-1">Try resetting the category filter or searching with a different term.</p>
        </div>
      )}

      {inspectingCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-48 bg-stone-100">
              <img
                src={inspectingCrop.imageUrl}
                alt={inspectingCrop.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setInspectingCrop(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors text-sm"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {inspectingCrop.category}
                </span>
                <h3 className="text-xl font-bold">{inspectingCrop.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-stone-600 leading-relaxed">
                {inspectingCrop.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Nutritional & Organic Highlights
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingCrop.nutritionalHighlights.map((hl, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {hl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-stone-600 border-t border-stone-100">
                <div>
                  <span className="text-stone-400 block">Section:</span>
                  <strong className="text-stone-800">{inspectingCrop.farmSection}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Harvest Window:</span>
                  <strong className="text-stone-800">{inspectingCrop.expectedHarvestDate}</strong>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    const name = inspectingCrop.name;
                    setInspectingCrop(null);
                    onSelectCropForTour(name);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-colors"
                >
                  Book Walk to View This Crop
                </button>
                <button
                  onClick={() => {
                    onAddCropToDelivery(inspectingCrop);
                    setInspectingCrop(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 transition-colors"
                >
                  Add to Delivery Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
