import { ExternalLink, Clock, Ticket, Star, MapPin } from 'lucide-react';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating?.toFixed(1)}</span>
    </div>
  );
}

function PlaceCard({ place }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{place.emoji || '📍'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{place.name}</h3>
                {place.must_see && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Must See!
                  </span>
                )}
              </div>
              <span className="inline-block bg-sky-50 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                {place.type}
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        {place.rating && <StarRating rating={place.rating} />}

        {/* Description */}
        <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
          {place.description}
        </p>
      </div>

      {/* Highlights */}
      {place.highlights && place.highlights.length > 0 && (
        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-1">
            {place.highlights.map((h, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">
                ✓ {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info row */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {place.entry_fee && (
            <div className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" />
              <span>{place.entry_fee}</span>
            </div>
          )}
          {place.duration_suggested && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{place.duration_suggested}</span>
            </div>
          )}
          {place.best_time && (
            <div className="flex items-center gap-1">
              <span>🕐</span>
              <span>{place.best_time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Booking links */}
      <div className="px-5 py-3 flex gap-2 flex-wrap">
        {place.booking_link && (
          <a
            href={place.booking_link}
            target="_blank"
            rel="noopener noreferrer"
            className="booking-badge bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs"
          >
            GetYourGuide
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {place.viator_link && (
          <a
            href={place.viator_link}
            target="_blank"
            rel="noopener noreferrer"
            className="booking-badge bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs"
          >
            Viator
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function PlacesSection({ places }) {
  if (!places || places.length === 0) return null;

  const mustSee = places.filter((p) => p.must_see);
  const others = places.filter((p) => !p.must_see);

  return (
    <div>
      {mustSee.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🌟</span> Must-See Attractions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {mustSee.map((place, i) => (
              <PlaceCard key={i} place={place} />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📍</span> More Places to Explore
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {others.map((place, i) => (
              <PlaceCard key={i} place={place} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
