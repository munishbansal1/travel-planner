import { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Users, Globe, Clock } from 'lucide-react';

export default function StatsPage({ onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const upSince = stats?.serverUpSince ? new Date(stats.serverUpSince).toLocaleString() : '—';

  return (
    <div className="min-h-screen hero-gradient relative">
      <div className="absolute inset-0 hero-pattern opacity-20" />

      {/* Owner bar */}
      <div className="relative z-10 w-full bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-white/30">·</span>
          <span className="text-white font-semibold text-sm">TravelAI — Site Analytics</span>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">📊 Site Analytics</h1>
          <p className="text-sky-200">Live stats for TravelAI</p>
        </div>

        {loading ? (
          <div className="text-center text-white/50">Loading stats...</div>
        ) : stats ? (
          <>
            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <Globe className="w-5 h-5" />, label: 'Total Trips Planned', value: stats.totalSearches.toLocaleString(), color: 'from-sky-500 to-blue-600' },
                { icon: <TrendingUp className="w-5 h-5" />, label: 'Trips Today', value: stats.todaySearches.toLocaleString(), color: 'from-green-500 to-emerald-600' },
                { icon: <Users className="w-5 h-5" />, label: 'Popular Routes', value: Object.keys(stats.popularRoutes || {}).length.toString(), color: 'from-purple-500 to-violet-600' },
                { icon: <Clock className="w-5 h-5" />, label: 'Server Up Since', value: upSince.split(',')[0], color: 'from-orange-500 to-amber-600' },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15 text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-3`}>
                    {item.icon}
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{item.value}</p>
                  <p className="text-white/50 text-xs">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Top routes */}
            {stats.topRoutes && stats.topRoutes.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-6">
                <h3 className="text-white font-bold mb-4">🔥 Most Popular Routes</h3>
                <div className="space-y-3">
                  {stats.topRoutes.map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-white/40 text-sm font-bold w-5">#{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">{r.route}</span>
                          <span className="text-white/60 text-xs">{r.count} {r.count === 1 ? 'search' : 'searches'}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                            style={{ width: `${Math.min((r.count / (stats.topRoutes[0]?.count || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-white/30 text-xs mt-8">
              ⚠️ Stats reset on server restart · Built by Munish Bansal
            </p>
          </>
        ) : (
          <div className="text-center text-white/50">Could not load stats.</div>
        )}
      </div>
    </div>
  );
}
