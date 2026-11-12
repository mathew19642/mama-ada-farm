import React, { useState } from 'react';
import type { Crop, GrowthStage, CropCategory } from '../types';
import { ShieldCheck, Plus, CheckCircle2, Key, Send, RefreshCw } from 'lucide-react';
import { sendEmailNotification } from '../utils/notifications';

interface FarmAdminProps {
  crops: Crop[];
  onUpdateCropStage: (cropId: string, stage: GrowthStage, progress: number) => void;
  onAddCrop: (newCrop: Crop) => void;
  web3FormsKey: string;
  setWeb3FormsKey: (key: string) => void;
}

export const FarmAdmin: React.FC<FarmAdminProps> = ({
  crops,
  onUpdateCropStage,
  onAddCrop,
  web3FormsKey,
  setWeb3FormsKey
}) => {
  const [testEmail, setTestEmail] = useState<string>('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  // New crop form state
  const [name, setName] = useState<string>('');
  const [variety, setVariety] = useState<string>('');
  const [category, setCategory] = useState<CropCategory>('Leafy Greens');
  const [imageUrl] = useState<string>('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
  const [plantingDate, setPlantingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<string>('');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Seedling');
  const [unitPrice, setUnitPrice] = useState<number>(2.50);
  const [unit, setUnit] = useState<string>('kg');
  const [farmSection, setFarmSection] = useState<string>('Open Field East');

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !expectedHarvestDate) return;

    const newCrop: Crop = {
      id: `crop-${Date.now()}`,
      name,
      variety: variety || 'Standard Organic Variety',
      category,
      imageUrl,
      plantingDate,
      expectedHarvestDate,
      growthStage,
      progressPercent: growthStage === 'Harvest Ready' ? 100 : growthStage === 'Flowering / Fruiting' ? 75 : growthStage === 'Vegetative' ? 50 : 20,
      unitPrice,
      unit,
      isAvailableForTour: true,
      farmSection,
      description: `Locally grown ${name} on Mama Ada Farm beds.`,
      nutritionalHighlights: ['Organically Grown', 'Fresh Pick']
    };

    onAddCrop(newCrop);
    setName('');
    setVariety('');
    setExpectedHarvestDate('');
    alert(`Added ${name} to the public Planting Calendar!`);
  };

  const handleTestNotification = async () => {
    if (!testEmail) {
      alert('Please enter an email address to send the test notification to.');
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);

    const res = await sendEmailNotification({
      toEmail: testEmail,
      toName: 'Farm Tester',
      subject: '🌱 Test Alert: Mama Ada Farm Notification Gateway',
      message: 'Greetings! This is a genuine test notification from Mama Ada Farm verifying that your live email dispatch pipeline is operating cleanly.',
      accessKey: web3FormsKey
    });

    setTestResult(res.message);
    setIsSendingTest(false);
  };

  return (
    <section className="space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Farm Operations & Live Settings</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Farm Manager Console
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Manage crop growth stages, add new planting entries, and test live email notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Key className="w-5 h-5 text-amber-600" />
            <span>Live Email Gateway (Web3Forms / Free Key)</span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            To make emails land in real inboxes without building a custom backend, obtain a free access key at{' '}
            <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">
              web3forms.com
            </a>{' '}
            (no credit card required) and paste it below.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Web3Forms Access Key
              </label>
              <input
                type="text"
                placeholder="e.g. 1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6"
                value={web3FormsKey}
                onChange={(e) => setWeb3FormsKey(e.target.value)}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Send a Live Test Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your personal email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                />
                <button
                  type="button"
                  disabled={isSendingTest}
                  onClick={handleTestNotification}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTest ? 'Sending...' : 'Test Send'}</span>
                </button>
              </div>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{testResult}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleCreateCrop} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Plus className="w-5 h-5 text-emerald-600" />
            <span>Add New Planting Schedule Entry</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Crop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Butternut Squash"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Variety</label>
              <input
                type="text"
                placeholder="e.g. Waltham Heirloom"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CropCategory)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
              >
                <option value="Leafy Greens">Leafy Greens</option>
                <option value="Fruits & Orchards">Fruits & Orchards</option>
                <option value="Root Vegetables">Root Vegetables</option>
                <option value="Herbs & Aromatics">Herbs & Aromatics</option>
                <option value="Legumes & Grains">Legumes & Grains</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Initial Growth Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
              >
                <option value="Seedling">Seedling</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering / Fruiting">Flowering / Fruiting</option>
                <option value="Harvest Ready">Harvest Ready</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Planting Date</label>
              <input
                type="date"
                required
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Expected Harvest Date *</label>
              <input
                type="date"
                required
                value={expectedHarvestDate}
                onChange={(e) => setExpectedHarvestDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Price & Unit</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="0.10"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-20 p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="kg / bunch"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Farm Section</label>
              <input
                type="text"
                placeholder="e.g. Terrace Plot 4"
                value={farmSection}
                onChange={(e) => setFarmSection(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Publish Crop to Live Calendar
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <RefreshCw className="w-5 h-5 text-emerald-600" />
            <span>Update Growth Stages of Planted Crops</span>
          </div>
          <span className="text-xs text-stone-500">{crops.length} active crops</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Crop</th>
                <th className="p-3">Category</th>
                <th className="p-3">Planting Date</th>
                <th className="p-3">Harvest Target</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3">Quick Stage Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {crops.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/50">
                  <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                    <img src={c.imageUrl} alt={c.name} className="w-7 h-7 rounded-md object-cover" />
                    <span>{c.name}</span>
                  </td>
                  <td className="p-3 text-stone-600">{c.category}</td>
                  <td className="p-3 text-stone-600 font-mono">{c.plantingDate}</td>
                  <td className="p-3 text-stone-600 font-mono">{c.expectedHarvestDate}</td>
                  <td className="p-3 font-bold text-emerald-700">{c.growthStage} ({c.progressPercent}%)</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onUpdateCropStage(c.id, 'Vegetative', 50)}
                        className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-[10px]"
                      >
                        Vegetative
                      </button>
                      <button
                        onClick={() => onUpdateCropStage(c.id, 'Flowering / Fruiting', 75)}
                        className="px-2 py-1 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 text-[10px]"
                      >
                        Fruiting
                      </button>
                      <button
                        onClick={() => onUpdateCropStage(c.id, 'Harvest Ready', 100)}
                        className="px-2 py-1 rounded bg-emerald-100 text-emerald-900 hover:bg-emerald-200 text-[10px] font-bold"
                      >
                        Ready!
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
