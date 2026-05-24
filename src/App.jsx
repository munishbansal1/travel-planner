import { useState } from 'react';
import HeroSearch from './components/HeroSearch';
import LoadingScreen from './components/LoadingScreen';
import ResultsPage from './components/ResultsPage';
import StatsPage from './components/StatsPage';

// stage: 'search' | 'preview-loading' | 'preview-ready' | 'results' | 'stats'

export default function App() {
  const [stage, setStage] = useState('search');
  const [travelData, setTravelData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);
  const [fullLoadProgress, setFullLoadProgress] = useState(0);

  const handleSearch = async (params) => {
    setSearchParams(params);
    setPreviewData(null);
    setTravelData(null);
    setError(null);
    setFullLoadProgress(0);
    setStage('preview-loading');

    // ── Phase 1: Quick preview (~5-8 s) ──────────────────────────────────────
    let preview = null;
    try {
      const previewRes = await fetch('/api/travel-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: params.from, to: params.to, departDate: params.departDate }),
      });
      if (previewRes.ok) {
        preview = await previewRes.json();
        setPreviewData(preview);
        setStage('preview-ready');
      }
    } catch {
      // preview failed silently — stay on loading screen, full plan will still load
    }

    // ── Phase 2: Full plan (~25-40 s) ─────────────────────────────────────────
    // Simulate progress while waiting
    const progressInterval = setInterval(() => {
      setFullLoadProgress((p) => (p >= 85 ? p : p + Math.random() * 4));
    }, 800);

    try {
      const res = await fetch('/api/travel-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      clearInterval(progressInterval);
      setFullLoadProgress(100);

      if (!res.ok) {
        const errData = await res.json();
        const msg = errData.details ? `${errData.error} — ${errData.details}` : errData.error || 'Failed to generate travel plan';
        throw new Error(msg);
      }

      const data = await res.json();
      // Merge preview overview if full plan overview is missing
      if (preview && !data.destination_overview) {
        data.destination_overview = preview.destination_overview;
      }
      setTravelData(data);
      setStage('results');
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message);
      setStage('search');
    }
  };

  const handleReset = () => {
    setStage('search');
    setTravelData(null);
    setPreviewData(null);
    setSearchParams(null);
    setError(null);
    setFullLoadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {stage === 'search' && (
        <HeroSearch onSearch={handleSearch} error={error} onShowStats={() => setStage('stats')} />
      )}
      {(stage === 'preview-loading' || stage === 'preview-ready') && (
        <LoadingScreen
          from={searchParams?.from}
          to={searchParams?.to}
          previewData={previewData}
          progress={fullLoadProgress}
        />
      )}
      {stage === 'results' && travelData && (
        <ResultsPage
          data={travelData}
          searchParams={searchParams}
          onReset={handleReset}
        />
      )}
      {stage === 'stats' && (
        <StatsPage onBack={() => setStage('search')} />
      )}
    </div>
  );
}
