import { useState } from 'react';
import { ArrowLeft, ExternalLink, Globe, Phone, Clock, CreditCard, Languages, Plane, MapPin, Calendar, Info } from 'lucide-react';
import TransportOptions from './TransportOptions';
import PlacesSection from './PlacesSection';
import ItinerarySection from './ItinerarySection';

const TABS = [
  { id: 'overview', label: 'Overview', emoji: '🌍' },
  { id: 'transport', label: 'Flights & Transport', emoji: '✈️' },
  { id: 'places', label: 'Places to Visit', emoji: '🗺️' },
  { id: 'itineraries', label: 'Itineraries', emoji: '📅' },
  { id: 'hotels', label: 'Hotels', emoji: '🏨' },
];

function OverviewCard({ overview }) {
  if (!overview) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
      {/* Destination hero */}
      <div className="md:col-span-2 bg-gradient-to-br from-sky-500 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black mb-1">{overview.name}</h2>
            <p className="text-sky-200 text-lg">{overview.country}</p>
          </div>
          <span className="text-5xl">🌍</span>
        </div>
        <p className="mt-4 text-sky-100 leading-relaxed">{overview.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {overview.weather && (
            <span className="glass px-3 py-1.5 rounded-full text-sm">
              🌤️ {overview.weather}
            </span>
          )}
          {overview.best_time_to_visit && (
            <span className="glass px-3 py-1.5 rounded-full text-sm">
              📅 Best: {overview.best_time_to_visit}
            </span>
          )}
        </div>
      </div>

      {/* Info cards */}
      {[
        { icon: <CreditCard className="w-5 h-5" />, label: 'Currency', value: overview.local_currency, color: 'green' },
        { icon: <Languages className="w-5 h-5" />, label: 'Language', value: overview.language, color: 'purple' },
        { icon: <Clock className="w-5 h-5" />, label: 'Timezone', value: overview.timezone, color: 'blue' },
        { icon: <Phone className="w-5 h-5" />, label: 'Emergency', value: overview.emergency_number, color: 'red' },
      ].map((item) => (
        <div key={item.label} className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4`}>
          <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center flex-shrink-0`}>
            {item.icon}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{item.label}</p>
            <p className="text-gray-800 font-semibold">{item.value || 'N/A'}</p>
          </div>
        </div>
      ))}

      {/* Visa Info */}
      {overview.visa_info !== undefined && (
        <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🛂</span>
            <div>
              <p className="font-bold text-amber-800 mb-1">Visa Information</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                {typeof overview.visa_info === 'string' ? overview.visa_info : 'Check official embassy website for visa requirements.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HotelBooking({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div>
      <p className="text-gray-600 mb-4">Book your stay through these trusted platforms:</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center hover:border-sky-400 hover:shadow-md transition-all duration-200 card-hover flex flex-col items-center gap-2"
          >
            <span className="text-3xl">{link.logo}</span>
            <span className="font-semibold text-gray-800 text-sm">{link.name}</span>
            <span className="text-sky-500 text-xs flex items-center gap-1">
              Search Hotels <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function TravelTips({ tips, visaInfo }) {
  if (!tips || tips.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>💡</span> Travel Tips & Essentials
      </h3>
      <div className="space-y-3 mb-6">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
      {visaInfo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-semibold text-amber-800 text-sm mb-1 flex items-center gap-2">
            🛂 Visa Requirements
          </p>
          <p className="text-amber-700 text-sm">{visaInfo}</p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage({ data, searchParams, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');

  const overview = data.destination_overview;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              New Search
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span className="font-semibold text-gray-800">{searchParams?.from}</span>
              <span>→</span>
              <span className="font-semibold text-gray-800">{searchParams?.to}</span>
              {searchParams?.departDate && (
                <>
                  <span className="text-gray-400">|</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{searchParams.departDate}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                ✅ Plan Ready
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-sky-600 border-sky-500'
                    : 'text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="section-title">Destination Overview</h2>
              <p className="section-subtitle">Everything you need to know about your destination</p>
            </div>
            <OverviewCard overview={overview} />
            <TravelTips tips={data.travel_tips} visaInfo={data.visa_info} />
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div>
              <h2 className="section-title">Flights & Transport Options</h2>
              <p className="section-subtitle">Best ways to get from {searchParams?.from} to {searchParams?.to}</p>
            </div>
            <TransportOptions transport={data.transport_options} />
          </div>
        )}

        {activeTab === 'places' && (
          <div className="space-y-6">
            <div>
              <h2 className="section-title">Places to Visit</h2>
              <p className="section-subtitle">Top attractions and hidden gems in {overview?.name || searchParams?.to}</p>
            </div>
            <PlacesSection places={data.places_to_visit} />
          </div>
        )}

        {activeTab === 'itineraries' && (
          <div className="space-y-6">
            <div>
              <h2 className="section-title">Travel Itineraries</h2>
              <p className="section-subtitle">Three curated plans for every budget — pick what suits you best</p>
            </div>
            <ItinerarySection itineraries={data.itineraries} />
          </div>
        )}

        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div>
              <h2 className="section-title">Book Your Stay</h2>
              <p className="section-subtitle">Find the perfect accommodation in {overview?.name || searchParams?.to}</p>
            </div>
            <HotelBooking links={data.hotel_booking_links} />

            {/* Quick tip */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
              <h3 className="font-bold text-sky-800 mb-3">🏨 Accommodation Tips</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {data.itineraries?.map((itin) => (
                  <div key={itin.type} className="bg-white rounded-xl p-3 border border-sky-100">
                    <p className="font-semibold text-gray-800 mb-1">{itin.emoji} {itin.title}</p>
                    <p className="text-gray-600">{itin.accommodation}</p>
                    {itin.accommodation_per_night_usd && (
                      <p className="text-sky-600 font-medium mt-1">~${itin.accommodation_per_night_usd}/night</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-8 py-6 text-center text-gray-500 text-sm">
        <p>✈️ <strong>TravelAI</strong> — Powered by Claude AI • Prices are approximate estimates</p>
        <button
          onClick={onReset}
          className="mt-3 btn-primary inline-flex items-center gap-2 text-sm py-2"
        >
          <Plane className="w-4 h-4" />
          Plan Another Trip
        </button>
      </div>
    </div>
  );
}
