import { ExternalLink, Clock, RefreshCw, IndianRupee, DollarSign } from 'lucide-react';

const TYPE_COLORS = {
  Flight: 'from-sky-500 to-blue-600',
  Train: 'from-green-500 to-emerald-600',
  Bus: 'from-orange-500 to-amber-600',
  Car: 'from-purple-500 to-violet-600',
  Ferry: 'from-teal-500 to-cyan-600',
};

const LINK_COLORS = {
  search: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200',
  booking: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200',
};

export default function TransportOptions({ transport }) {
  if (!transport || transport.length === 0) return null;

  return (
    <div className="stagger-children space-y-6">
      {transport.map((option, idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
          {/* Header */}
          <div className={`bg-gradient-to-r ${TYPE_COLORS[option.type] || 'from-gray-500 to-gray-600'} p-5 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{option.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{option.type}</h3>
                  {option.airlines && option.airlines.length > 0 && (
                    <p className="text-white/80 text-sm">{option.airlines.join(' • ')}</p>
                  )}
                  {option.operators && option.operators.length > 0 && (
                    <p className="text-white/80 text-sm">{option.operators.join(' • ')}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white/90 text-sm">
                  <Clock className="w-4 h-4" />
                  {option.duration}
                </div>
                <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                  <RefreshCw className="w-3 h-3" />
                  {option.frequency}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold mb-1">
                  <DollarSign className="w-3 h-3" />
                  USD (approx.)
                </div>
                <p className="text-blue-800 font-bold text-lg">
                  ${option.approximate_cost_usd?.min?.toLocaleString()} – ${option.approximate_cost_usd?.max?.toLocaleString()}
                </p>
                <p className="text-blue-500 text-xs">per person</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3">
                <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold mb-1">
                  <IndianRupee className="w-3 h-3" />
                  INR (approx.)
                </div>
                <p className="text-orange-800 font-bold text-lg">
                  ₹{option.approximate_cost_inr?.min?.toLocaleString()} – ₹{option.approximate_cost_inr?.max?.toLocaleString()}
                </p>
                <p className="text-orange-500 text-xs">per person</p>
              </div>
            </div>

            {/* Notes */}
            {option.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-amber-800 text-sm">
                  <span className="font-semibold">💡 Note: </span>
                  {option.notes}
                </p>
              </div>
            )}

            {/* Booking Links */}
            {option.booking_links && option.booking_links.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">🔗 Book / Search:</p>
                <div className="flex flex-wrap gap-2">
                  {option.booking_links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`booking-badge ${LINK_COLORS[link.type] || LINK_COLORS.booking} flex items-center gap-1.5`}
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
