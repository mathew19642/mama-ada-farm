import { useState } from 'react';
import { Camera, MapPin, Eye, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface FarmShowcaseProps {
  onBookTour: () => void;
  onExploreCrops: () => void;
}

export const FarmShowcase = ({ onBookTour, onExploreCrops }: FarmShowcaseProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const farmGalleries = [
    {
      title: 'Mama Ada Living Fields & Canopy',
      category: 'Open Bed Cultivation',
      location: 'Plot Alpha • Terraced Rows',
      description: 'Expansive lush green beds nurtured with nutrient-rich organic compost and natural irrigation. Notice the dense, healthy foliage and companion vegetation.',
      imageUrl: '/images/farm/farm-photo-3.jpg',
      highlights: ['100% Pesticide-Free', 'High mineral soil fertility', 'Tour viewing open daily']
    },
    {
      title: 'Freshly Harvested Produce',
      category: 'Harvest Dispatch',
      location: 'Central Harvest Station',
      description: 'Hand-picked daily at first daylight to preserve crisp texture, moisture, and peak vitamin concentrations before cold packing.',
      imageUrl: '/images/farm/farm-photo-1.jpg',
      highlights: ['Picked same morning', 'Zero synthetic preservatives', 'Direct farm-to-table delivery']
    },
    {
      title: 'Crop Bed Alignment & Growth Rows',
      category: 'Field Architecture',
      location: 'Field Sector 2',
      description: 'Carefully measured rows designed for optimal sun exposure, rainwater infiltration, and easy walking paths for visitors on guided tours.',
      imageUrl: '/images/farm/farm-photo-2.jpg',
      highlights: ['Wide visitor trails', 'Natural weed suppression', 'Drip-line efficiency']
    },
    {
      title: 'Vegetative Growth & Leafy Canopy',
      category: 'Active Seasonality',
      location: 'Nursery & Growth Blocks',
      description: 'Vigorous crop leaves capturing abundant sunlight. Customers can check our live calendar to see when these exact beds transition into harvest-ready stages.',
      imageUrl: '/images/farm/farm-photo-5.jpg',
      highlights: ['Active growth monitoring', 'Organic bio-fertilizer', 'Tasting walks available']
    },
    {
      title: 'Farm Perimeter & Sustainable Ecology',
      category: 'Regenerative Agriculture',
      location: 'Terrace Ridges',
      description: 'Surrounded by natural biodiversity, flowering pollinator plants, and agroforestry boundaries that shield delicate crops from harsh winds.',
      imageUrl: '/images/farm/farm-photo-6.jpg',
      highlights: ['Integrated pest habitat', 'Windbreak border trees', 'Soil moisture retention']
    },
    {
      title: 'Field Prep & Organic Bed Renewal',
      category: 'Soil Management',
      location: 'Compost Preparation Zone',
      description: 'Continuous organic enrichment using seasoned plant residues and nitrogen-fixing green manure to prepare beds for upcoming seasonal seedings.',
      imageUrl: '/images/farm/farm-photo-4.jpg',
      highlights: ['Living soil microbiome', 'Compost mound rotation', 'Year-round planting schedule']
    }
  ];

  const currentGallery = farmGalleries[activeImageIndex];

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-2 border border-emerald-200">
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span>Real Farm Gallery • Mama Ada Farm & Foods®</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            See What Mama Ada Farm Looks Like
          </h2>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Real photos from our fields, active crop beds, and harvest operations. Book a visit to walk through these exact rows!
          </p>
        </div>

        <button
          onClick={onBookTour}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs shrink-0"
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Book a Farm Tour Walk</span>
        </button>
      </div>

      {/* Main Showcase Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-stone-900 text-white">
        {/* Large Featured Photo */}
        <div className="relative h-72 sm:h-96 lg:h-[460px] w-full overflow-hidden bg-black">
          <img
            src={currentGallery.imageUrl}
            alt={currentGallery.title}
            className="w-full h-full object-cover transition-all duration-700 hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#012f1f]/90 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {currentGallery.category}
            </span>
          </div>

          {/* Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentGallery.location}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {currentGallery.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 max-w-3xl leading-relaxed">
              {currentGallery.description}
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentGallery.highlights.map((hl, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-[11px] font-medium text-emerald-100 border border-white/20"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  {hl}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Thumbnail Selector (All 6 Real Photos) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {farmGalleries.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`text-left p-2 rounded-2xl border transition-all flex flex-col justify-between ${
              activeImageIndex === idx
                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/40 shadow-xs'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2 bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {activeImageIndex === idx && (
                <div className="absolute inset-0 bg-amber-500/10 border-2 border-amber-500 rounded-xl" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                {item.category}
              </span>
              <strong className="text-xs text-stone-900 block truncate font-semibold">
                {item.title}
              </strong>
            </div>
          </button>
        ))}
      </div>

      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-[#012f1f] via-[#023c28] to-[#011e14] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-emerald-800/40">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base sm:text-lg font-bold text-amber-300">Come visit our actual beds & crops!</h4>
          <p className="text-xs text-stone-300">
            Book a 75-minute guided walking tour to inspect what's growing in each field section.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onBookTour}
            className="px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-xs"
          >
            Reserve Your Visit Date
          </button>
          <button
            onClick={onExploreCrops}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-1"
          >
            <span>View Planting Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
