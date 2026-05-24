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
      <div className="bg-white border-t border-gray-200 mt-8 py-8 text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand + action */}
            <div className="text-center sm:text-left">
              <p className="font-bold text-gray-800 text-base mb-1">✈️ TravelAI</p>
              <p className="text-gray-500">Powered by Claude AI · Prices are approximate estimates</p>
              <button
                onClick={onReset}
                className="mt-3 btn-primary inline-flex items-center gap-2 text-sm py-2"
              >
                <Plane className="w-4 h-4" />
                Plan Another Trip
              </button>
            </div>

            {/* Owner contact */}
            <div className="text-center sm:text-right">
              <p className="font-semibold text-gray-700 mb-2">Built by Munish Bansal</p>
              <div className="flex items-center justify-center sm:justify-end gap-4">
                <a
                  href="mailto:munishbansal.mb@gmail.com"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-sky-600 transition-colors"
                  title="Email"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="hidden sm:inline">munishbansal.mb@gmail.com</span>
                  <span className="sm:hidden">Email</span>
                </a>
                <a
                  href="https://github.com/munishbansal1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                  title="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/munish-bansal-66b7844/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
              <p className="text-gray-400 text-xs mt-3">© {new Date().getFullYear()} Munish Bansal · All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
