import { useEffect, useState } from 'react';

const LOADING_MSGS_PREVIEW = [
  '🔍 Identifying your destination...',
  '🌍 Fetching destination info...',
  '📍 Locating top attractions...',
];

const LOADING_MSGS_FULL = [
  '✈️ Searching best flights & routes...',
  '🏨 Scouting hotels for every budget...',
  '🗺️ Curating must-see attractions...',
  '🍽️ Finding the best local food spots...',
  '📅 Building your 5-day itineraries...',
  '💰 Calculating costs & budgets...',
  '🌤️ Checking weather & travel tips...',
  '✨ Putting the finishing touches...',
];

function DestinationPreviewCard({ preview, progress }) {
  const { destination_overview: ov, top_places = [], quick_tip, visa_info } = preview;

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Destination hero */}
      <div className="bg-white/15 backdrop-blur-sm rounded-3xl border border-white/25 overflow-hidden mb-4">
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {ov.flag && <span className="text-3xl">{ov.flag}</span>}
                <h2 className="text-2xl sm:text-3xl font-black text-white">{ov.name}</h2>
              </div>
              <p className="text-sky-200 text-sm">{ov.country} · {ov.timezone}</p>
            </div>
            <span className="bg-green-400/20 border border-green-400/40 text-green-300 text-xs font-bold px-3 py-1 rounded-full">
              ✓ Destination found
            </span>
          </div>

          <p className="text-white/80 text-sm leading-relaxed mb-4">{ov.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {ov.weather && <span className="glass px-3 py-1 rounded-full text-xs text-white/80">🌤️ {ov.weather}</span>}
            {ov.best_time_to_visit && <span className="glass px-3 py-1 rounded-full text-xs text-white/80">📅 Best: {ov.best_time_to_visit}</span>}
            {ov.local_currency && <span className="glass px-3 py-1 rounded-full text-xs text-white/80">💱 {ov.local_currency}</span>}
            {ov.language && <span className="glass px-3 py-1 rounded-full text-xs text-white/80">🗣️ {ov.language}</span>}
          </div>

          {quick_tip && (
            <div className="bg-amber-400/15 border border-amber-400/30 rounded-xl px-4 py-2.5 text-amber-200 text-sm">
              💡 <strong>Quick tip:</strong> {quick_tip}
            </div>
          )}
        </div>

        {/* Top 4 places teaser */}
        {top_places.length > 0 && (
          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-3">Top Attractions</p>
            <div className="grid grid-cols-2 gap-2">
              {top_places.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <span className="text-xl">{p.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                    <p className="text-white/50 text-xs">{p.type}</p>
                  </div>
                  {p.must_see && <span className="ml-auto text-yellow-400 text-xs">⭐</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full plan loading progress */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/80 text-sm font-semibold">⚙️ Building your complete travel plan...</p>
          <span className="text-white/50 text-xs">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
        <p className="text-white/40 text-xs mt-2">Generating flights, itineraries & booking links...</p>
      </div>
    </div>
  );
}

export default function LoadingScreen({ from, to, previewData, progress = 0 }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState('');

  const messages = previewData ? LOADING_MSGS_FULL : LOADING_MSGS_PREVIEW;

  useEffect(() => {
    const msgInterval = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 2500);
    const dotsInterval = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 500);
    return () => { clearInterval(msgInterval); clearInterval(dotsInterval); };
  }, [previewData]);

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center relative overflow-hidden px-4 py-10">
      <div className="absolute inset-0 hero-pattern opacity-20" />
      <div className="absolute top-20 left-0 text-6xl opacity-10 animate-pulse">☁️</div>
      <div className="absolute top-28 right-12 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute top-1/4 fly-plane text-3xl">✈️</div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Route badge */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="glass text-white font-bold px-4 py-2 rounded-xl text-sm">📍 {from || 'Origin'}</div>
          <div className="text-white text-xl">→</div>
          <div className="glass text-white font-bold px-4 py-2 rounded-xl text-sm">🎯 {to || 'Destination'}</div>
        </div>

        {previewData ? (
          /* ── Preview is ready — show destination card ─────────── */
          <DestinationPreviewCard preview={previewData} progress={progress} />
        ) : (
          /* ── Still fetching preview ───────────────────────────── */
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-spin-slow" />
              <div className="absolute inset-3 rounded-full border-4 border-sky-300/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
              <div className="absolute inset-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl animate-bounce-slow">
                🌍
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Exploring your destination{dots}</h2>
            <p className="text-sky-200 text-base h-6 transition-all duration-500">{messages[msgIndex % messages.length]}</p>
            <div className="mt-6 w-48 mx-auto bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-white/60 rounded-full animate-pulse" style={{ width: '40%' }} />
            </div>
          </div>
        )}

        <p className="text-center text-white/30 text-xs mt-6">
          {previewData
            ? 'Your full plan will be ready in 20-30 seconds'
            : 'Destination info arriving in a few seconds...'}
        </p>
      </div>
    </div>
  );
}
