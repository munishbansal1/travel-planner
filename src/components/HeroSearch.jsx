import { useState } from 'react';
import { ArrowRight, ArrowLeft, Plane, MapPin, Calendar, Users, DollarSign, Zap, Check } from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const POPULAR_ORIGINS = [
  { city: 'Mumbai', emoji: '🌊' },
  { city: 'Delhi', emoji: '🏛️' },
  { city: 'Bangalore', emoji: '🌿' },
  { city: 'Chennai', emoji: '🎭' },
  { city: 'Hyderabad', emoji: '💎' },
  { city: 'Kolkata', emoji: '🎨' },
  { city: 'London', emoji: '🎡' },
  { city: 'New York', emoji: '🗽' },
];

const POPULAR_DESTINATIONS = [
  { city: 'Goa', emoji: '🏖️' },
  { city: 'Manali', emoji: '🏔️' },
  { city: 'Bali', emoji: '🌴' },
  { city: 'Paris', emoji: '🗼' },
  { city: 'Dubai', emoji: '🌆' },
  { city: 'Singapore', emoji: '🦁' },
  { city: 'Bangkok', emoji: '🛕' },
  { city: 'Maldives', emoji: '🐠' },
  { city: 'Tokyo', emoji: '⛩️' },
  { city: 'London', emoji: '🎡' },
  { city: 'New York', emoji: '🗽' },
  { city: 'Rome', emoji: '🏛️' },
];

const BUDGET_OPTIONS = [
  { value: 'budget', emoji: '💰', label: 'Budget', desc: 'Hostels & street food', color: 'border-green-400 bg-green-50 text-green-800' },
  { value: 'moderate', emoji: '🏨', label: 'Moderate', desc: '3-star hotels & restaurants', color: 'border-sky-400 bg-sky-50 text-sky-800' },
  { value: 'luxury', emoji: '✨', label: 'Luxury', desc: '5-star & fine dining', color: 'border-purple-400 bg-purple-50 text-purple-800' },
];

const TRAVELER_OPTIONS = [
  { value: 1, label: 'Solo', emoji: '🧑', desc: 'Just me' },
  { value: 2, label: 'Couple', emoji: '👫', desc: '2 people' },
  { value: 3, label: 'Small Group', emoji: '👨‍👩‍👦', desc: '3–4 people', actualValue: 3 },
  { value: 5, label: 'Large Group', emoji: '👨‍👩‍👧‍👦', desc: '5+ people', actualValue: 5 },
];

// ── Step indicator ────────────────────────────────────────────────────────────

function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current
              ? 'w-6 h-2 bg-white'
              : i === current
              ? 'w-8 h-2 bg-white'
              : 'w-2 h-2 bg-white/30'
          }`}
        />
      ))}
    </div>
  );
}

// ── Chip button ───────────────────────────────────────────────────────────────

function Chip({ emoji, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
        selected
          ? 'border-sky-400 bg-sky-500 text-white scale-105 shadow-lg'
          : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:border-white/40'
      }`}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}

// ── Individual steps ──────────────────────────────────────────────────────────

function StepFrom({ value, onChange, onNext }) {
  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">📍</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Where are you flying from?</h2>
        <p className="text-sky-200">Enter your departure city or airport</p>
      </div>

      <div className="relative mb-6">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 w-5 h-5" />
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value.trim() && onNext()}
          placeholder="e.g. Mumbai, Delhi, London..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg bg-white/15 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/20 transition-all"
        />
      </div>

      <div className="mb-8">
        <p className="text-white/50 text-xs mb-3 text-center">POPULAR CITIES</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {POPULAR_ORIGINS.map((o) => (
            <Chip key={o.city} emoji={o.emoji} label={o.city} selected={value === o.city} onClick={() => onChange(o.city)} />
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!value.trim()}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg rounded-2xl disabled:opacity-40"
      >
        Continue <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function StepTo({ value, onChange, onNext, onBack }) {
  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🌍</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Where do you want to go?</h2>
        <p className="text-sky-200">Pick your dream destination</p>
      </div>

      <div className="relative mb-6">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value.trim() && onNext()}
          placeholder="e.g. Goa, Paris, Bali..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg bg-white/15 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/20 transition-all"
        />
      </div>

      <div className="mb-8">
        <p className="text-white/50 text-xs mb-3 text-center">POPULAR DESTINATIONS</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {POPULAR_DESTINATIONS.map((d) => (
            <Chip key={d.city} emoji={d.emoji} label={d.city} selected={value === d.city} onClick={() => onChange(d.city)} />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!value.trim()}
          className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg rounded-2xl disabled:opacity-40"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function StepDates({ departDate, returnDate, onChangeDepart, onChangeReturn, onNext, onBack, onSkip }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">When are you travelling?</h2>
        <p className="text-sky-200">Add dates for more accurate flight prices</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-white/70 text-sm font-semibold mb-2">✈️ Departure date</label>
          <input
            type="date"
            value={departDate}
            min={today}
            onChange={(e) => onChangeDepart(e.target.value)}
            className="w-full px-4 py-4 rounded-2xl text-lg bg-white/15 backdrop-blur-sm border-2 border-white/20 text-white focus:outline-none focus:border-sky-400 focus:bg-white/20 transition-all [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm font-semibold mb-2">🔄 Return date <span className="font-normal text-white/40">(optional)</span></label>
          <input
            type="date"
            value={returnDate}
            min={departDate || today}
            onChange={(e) => onChangeReturn(e.target.value)}
            className="w-full px-4 py-4 rounded-2xl text-lg bg-white/15 backdrop-blur-sm border-2 border-white/20 text-white focus:outline-none focus:border-sky-400 focus:bg-white/20 transition-all [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg rounded-2xl"
        >
          {departDate ? 'Continue' : 'Skip'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function StepTravelers({ travelers, budget, onChangeTravelers, onChangeBudget, onNext, onBack }) {
  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎒</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Who's travelling & what's your budget?</h2>
        <p className="text-sky-200">We'll tailor the itinerary just for you</p>
      </div>

      {/* Traveler selector */}
      <div className="mb-6">
        <p className="text-white/70 text-sm font-semibold mb-3">👥 Number of travellers</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRAVELER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeTravelers(opt.value)}
              className={`flex flex-col items-center gap-1 py-4 rounded-2xl border-2 transition-all duration-200 ${
                travelers === opt.value
                  ? 'border-sky-400 bg-sky-500/30 scale-105 shadow-lg'
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-white font-bold text-sm">{opt.label}</span>
              <span className="text-white/50 text-xs">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Budget selector */}
      <div className="mb-8">
        <p className="text-white/70 text-sm font-semibold mb-3">💳 Budget level</p>
        <div className="grid grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeBudget(opt.value)}
              className={`flex flex-col items-center gap-1 py-4 rounded-2xl border-2 transition-all duration-200 ${
                budget === opt.value
                  ? 'border-sky-400 bg-sky-500/30 scale-105 shadow-lg'
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-white font-bold text-sm">{opt.label}</span>
              <span className="text-white/50 text-xs text-center leading-tight">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg rounded-2xl"
        >
          Preview my trip <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function StepSummary({ from, to, departDate, returnDate, travelers, budget, onSubmit, onBack, isSubmitting }) {
  const budgetInfo = BUDGET_OPTIONS.find((b) => b.value === budget);
  const travelerInfo = TRAVELER_OPTIONS.find((t) => t.value === travelers);

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">Almost there!</h2>
        <p className="text-sky-200">Review your trip details & pay to generate</p>
      </div>

      {/* Trip summary */}
      <div className="bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 p-4 mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2.5 text-center">
            <p className="text-white/50 text-xs mb-0.5">FROM</p>
            <p className="text-white font-bold">📍 {from}</p>
          </div>
          <div className="text-white text-xl">→</div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2.5 text-center">
            <p className="text-white/50 text-xs mb-0.5">TO</p>
            <p className="text-white font-bold">🎯 {to}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-white/10 rounded-xl px-2 py-2">
            <p className="text-white/50 text-xs">DATES</p>
            <p className="text-white font-medium">{departDate || 'Flexible'}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-2 py-2">
            <p className="text-white/50 text-xs">TRAVELLERS</p>
            <p className="text-white font-medium">{travelerInfo?.emoji} {travelerInfo?.label}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-2 py-2">
            <p className="text-white/50 text-xs">BUDGET</p>
            <p className="text-white font-medium">{budgetInfo?.emoji} {budgetInfo?.label}</p>
          </div>
        </div>
      </div>

      {/* Pricing card */}
      <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-black text-2xl">₹99</p>
            <p className="text-yellow-200 text-xs">one-time · instant plan</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs line-through">₹499</p>
            <p className="text-yellow-300 text-xs font-bold">80% OFF Launch Price</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {[
            '✈️ Flights & transport with booking links',
            '🗺️ 10+ curated places to visit',
            '📅 3 full 5-day itineraries (Budget/Moderate/Luxury)',
            '🏨 Hotel booking links',
            '💡 Local tips & visa info',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
              <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Pay button */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-black text-lg shadow-xl transition-all active:scale-95 disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              Redirecting to payment...
            </div>
          ) : (
            <>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                Pay ₹99 & Get My Plan
              </span>
              <span className="text-xs font-normal opacity-70">Secured by Stripe</span>
            </>
          )}
        </button>
      </div>

      <p className="text-center text-white/30 text-xs mt-3">
        🔒 Secure payment · Your plan generates instantly after payment
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

export default function HeroSearch({ onSearch, error, onShowStats, isRedirecting }) {
  const [step, setStep] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState('moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch analytics on mount
  useState(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  });

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSearch({ from: from.trim(), to: to.trim(), departDate, returnDate, travelers, budget });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 hero-pattern opacity-30" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Owner top bar */}
      <div className="relative z-20 w-full bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">Built by</span>
            <span className="text-white font-semibold text-sm">Munish Bansal</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:munishbansal.mb@gmail.com" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="hidden sm:inline">munishbansal.mb@gmail.com</span>
              <span className="sm:hidden">Email</span>
            </a>
            <a href="https://github.com/munishbansal1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/munish-bansal-66b7844/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-44px)] px-4 py-10">
        {/* Brand */}
        {step === 0 && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-300" />
              AI-Powered Travel Planning
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-3">
              ✈️ TravelAI
            </h1>
            <p className="text-sky-200 text-lg">Plan your perfect trip in 60 seconds</p>

            {/* Live stats badge */}
            {stats && (
              <div className="mt-4 inline-flex items-center gap-3 glass px-4 py-2 rounded-full text-sm">
                <span className="flex items-center gap-1.5 text-white/80">
                  🌍 <strong className="text-white">{stats.totalSearches.toLocaleString()}</strong> trips planned
                </span>
                {stats.todaySearches > 0 && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="text-white/60 text-xs">{stats.todaySearches} today</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step dots */}
        <StepDots current={step} total={TOTAL_STEPS} />

        {/* Error */}
        {error && (
          <div className="w-full max-w-lg mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-2xl text-white text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Step content */}
        <div className="w-full max-w-lg">
          {step === 0 && <StepFrom value={from} onChange={setFrom} onNext={next} />}
          {step === 1 && <StepTo value={to} onChange={setTo} onNext={next} onBack={back} />}
          {step === 2 && (
            <StepDates
              departDate={departDate} returnDate={returnDate}
              onChangeDepart={setDepartDate} onChangeReturn={setReturnDate}
              onNext={next} onBack={back}
            />
          )}
          {step === 3 && (
            <StepTravelers
              travelers={travelers} budget={budget}
              onChangeTravelers={setTravelers} onChangeBudget={setBudget}
              onNext={next} onBack={back}
            />
          )}
          {step === 4 && (
            <StepSummary
              from={from} to={to} departDate={departDate} returnDate={returnDate}
              travelers={travelers} budget={budget}
              onSubmit={handleSubmit} onBack={back} isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Step counter + stats link */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <p className="text-white/30 text-xs">Step {step + 1} of {TOTAL_STEPS}</p>
          {onShowStats && (
            <>
              <span className="text-white/15">·</span>
              <button
                onClick={onShowStats}
                className="text-white/30 hover:text-white/60 text-xs transition-colors flex items-center gap-1"
              >
                📊 View site stats
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
