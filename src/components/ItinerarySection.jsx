import { useState } from 'react';
import { ChevronDown, ChevronUp, IndianRupee, DollarSign, Users, Coffee, UtensilsCrossed, Moon } from 'lucide-react';

const ITINERARY_THEMES = {
  budget: {
    gradient: 'from-green-400 to-emerald-600',
    light: 'bg-green-50',
    badge: 'bg-green-100 text-green-700',
    border: 'border-green-200',
    day: 'bg-green-500',
  },
  moderate: {
    gradient: 'from-sky-400 to-blue-600',
    light: 'bg-sky-50',
    badge: 'bg-sky-100 text-sky-700',
    border: 'border-sky-200',
    day: 'bg-sky-500',
  },
  luxury: {
    gradient: 'from-purple-400 to-violet-600',
    light: 'bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
    day: 'bg-purple-500',
  },
};

function DayPlan({ day: dayData, theme }) {
  const [expanded, setExpanded] = useState(false);
  const t = ITINERARY_THEMES[theme] || ITINERARY_THEMES.moderate;

  return (
    <div className={`border ${t.border} rounded-xl overflow-hidden`}>
      <button
        className={`w-full flex items-center justify-between p-4 ${t.light} hover:opacity-90 transition-opacity`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-full ${t.day} text-white text-sm font-bold flex items-center justify-center`}>
            {dayData.day}
          </span>
          <div className="text-left">
            <p className="font-semibold text-gray-800">{dayData.title || `Day ${dayData.day}`}</p>
            {dayData.estimated_cost_usd && (
              <p className="text-gray-500 text-xs">${dayData.estimated_cost_usd}/person</p>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="p-4 space-y-4 bg-white">
          {/* Activities */}
          {dayData.activities && dayData.activities.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">🎯 Activities</p>
              <ul className="space-y-1">
                {dayData.activities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-sky-500 mt-0.5">•</span>
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meals */}
          {dayData.meals && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">🍽️ Meals</p>
              <div className="grid grid-cols-3 gap-2">
                {dayData.meals.breakfast && (
                  <div className="bg-yellow-50 rounded-lg p-2">
                    <p className="text-xs font-semibold text-yellow-700 mb-1 flex items-center gap-1">
                      <Coffee className="w-3 h-3" /> Breakfast
                    </p>
                    <p className="text-xs text-gray-600">{dayData.meals.breakfast}</p>
                  </div>
                )}
                {dayData.meals.lunch && (
                  <div className="bg-orange-50 rounded-lg p-2">
                    <p className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
                      <UtensilsCrossed className="w-3 h-3" /> Lunch
                    </p>
                    <p className="text-xs text-gray-600">{dayData.meals.lunch}</p>
                  </div>
                )}
                {dayData.meals.dinner && (
                  <div className="bg-indigo-50 rounded-lg p-2">
                    <p className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Dinner
                    </p>
                    <p className="text-xs text-gray-600">{dayData.meals.dinner}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          {dayData.tips && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <span className="font-semibold">💡 Tip: </span>
                {dayData.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItineraryCard({ itinerary }) {
  const [showAllDays, setShowAllDays] = useState(false);
  const theme = itinerary.type || 'moderate';
  const t = ITINERARY_THEMES[theme] || ITINERARY_THEMES.moderate;
  const days = itinerary.daily_plans || [];
  const visibleDays = showAllDays ? days : days.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${t.gradient} p-5 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{itinerary.emoji}</span>
            <h3 className="text-xl font-bold">{itinerary.title}</h3>
          </div>
          <span className={`${t.badge} text-xs font-bold px-3 py-1 rounded-full capitalize bg-white/20 text-white border border-white/30`}>
            {theme}
          </span>
        </div>
        <p className="text-white/80 text-sm">{itinerary.description}</p>
        <div className="flex items-center gap-2 mt-2 text-white/70 text-sm">
          <span>📅 {itinerary.duration_days} Days</span>
          {itinerary.best_for && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {itinerary.best_for}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Costs */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold mb-1">
              <DollarSign className="w-3 h-3" /> Total (USD)
            </div>
            <p className="text-blue-800 font-bold">
              ${itinerary.total_cost_per_person_usd?.min?.toLocaleString()} – ${itinerary.total_cost_per_person_usd?.max?.toLocaleString()}
            </p>
            <p className="text-blue-500 text-xs">per person</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold mb-1">
              <IndianRupee className="w-3 h-3" /> Total (INR)
            </div>
            <p className="text-orange-800 font-bold">
              ₹{itinerary.total_cost_per_person_inr?.min?.toLocaleString()} – ₹{itinerary.total_cost_per_person_inr?.max?.toLocaleString()}
            </p>
            <p className="text-orange-500 text-xs">per person</p>
          </div>
        </div>

        {/* Accommodation */}
        {itinerary.accommodation && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <span>🏨</span>
            <span>{itinerary.accommodation}</span>
            {itinerary.accommodation_per_night_usd && (
              <span className="text-gray-400">• ~${itinerary.accommodation_per_night_usd}/night</span>
            )}
          </div>
        )}

        {/* Highlights */}
        {itinerary.highlights && itinerary.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {itinerary.highlights.map((h, i) => (
                <span key={i} className={`${t.badge} text-xs px-2 py-1 rounded-lg`}>
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Daily Plans */}
        {days.length > 0 && (
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 mb-3">📅 Day-by-Day Plan:</p>
            <div className="space-y-2">
              {visibleDays.map((day, i) => (
                <DayPlan key={i} day={day} theme={theme} />
              ))}
            </div>

            {days.length > 2 && (
              <button
                onClick={() => setShowAllDays(!showAllDays)}
                className={`mt-3 w-full py-2 text-sm font-medium rounded-xl border-2 ${t.border} ${t.light} text-gray-600 hover:opacity-80 transition-all flex items-center justify-center gap-2`}
              >
                {showAllDays ? (
                  <><ChevronUp className="w-4 h-4" /> Show Less</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> View All {days.length} Days</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ItinerarySection({ itineraries }) {
  if (!itineraries || itineraries.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-children">
      {itineraries.map((itin, i) => (
        <ItineraryCard key={i} itinerary={itin} />
      ))}
    </div>
  );
}
