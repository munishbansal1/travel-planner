import { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, Plane, ArrowRight, Globe, Star, Zap } from 'lucide-react';

const BUDGET_OPTIONS = [
  { value: 'budget', label: '💰 Budget', desc: 'Hostels & street food' },
  { value: 'moderate', label: '🏨 Moderate', desc: '3-star hotels & restaurants' },
  { value: 'luxury', label: '✨ Luxury', desc: '5-star & fine dining' },
];

const POPULAR_ROUTES = [
  { from: 'Mumbai', to: 'Goa', emoji: '🏖️' },
  { from: 'Delhi', to: 'Manali', emoji: '🏔️' },
  { from: 'Bangalore', to: 'Bali', emoji: '🌴' },
  { from: 'Mumbai', to: 'Paris', emoji: '🗼' },
  { from: 'Delhi', to: 'Dubai', emoji: '🌆' },
  { from: 'Chennai', to: 'Singapore', emoji: '🦁' },
];

export default function HeroSearch({ onSearch, error }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState('moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    setIsSubmitting(true);
    await onSearch({ from: from.trim(), to: to.trim(), departDate, returnDate, travelers, budget });
    setIsSubmitting(false);
  };

  const fillRoute = (route) => {
    setFrom(route.from);
    setTo(route.to);
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern opacity-30" />

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Zap className="w-4 h-4 text-yellow-300" />
            AI-Powered Travel Planning
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
            Your Perfect Trip,
            <br />
            <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-400">
              Planned by AI ✈️
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Tell us where you want to go — we'll handle flights, hotels, places to visit, and complete itineraries.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Couldn't generate your travel plan</p>
                <p className="mt-1 text-red-600">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1 text-sky-500" />
                  From
                </label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Mumbai, Delhi, London..."
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Swap button */}
              <button
                type="button"
                onClick={swapLocations}
                className="absolute left-1/2 top-9 -translate-x-1/2 z-10 w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors hidden sm:flex"
                title="Swap locations"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1 text-red-500" />
                  To
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Goa, Paris, Bali..."
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1 text-sky-500" />
                  Depart Date <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1 text-sky-500" />
                  Return Date <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Travelers & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1 text-sky-500" />
                  Travelers
                </label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1 text-sky-500" />
                  Budget Level
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800 bg-white"
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label} — {opt.desc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !from.trim() || !to.trim()}
              className="w-full btn-primary flex items-center justify-center gap-3 text-lg py-4 rounded-2xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Plane className="w-5 h-5" />
                  Plan My Trip
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Popular Routes */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm mb-4">✨ Popular Routes</p>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                onClick={() => fillRoute(route)}
                className="glass text-white text-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
              >
                <span>{route.emoji}</span>
                {route.from} → {route.to}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '✈️', label: 'Flight Options' },
            { icon: '🗺️', label: '10+ Places to Visit' },
            { icon: '📅', label: 'Full Itineraries' },
            { icon: '💸', label: 'Cost Estimates' },
          ].map((f) => (
            <div key={f.label} className="glass text-center py-3 px-2 rounded-2xl">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-white/80 text-sm font-medium">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
