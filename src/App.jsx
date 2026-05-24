import { useState, useEffect } from 'react';
import HeroSearch from './components/HeroSearch';
import LoadingScreen from './components/LoadingScreen';
import ResultsPage from './components/ResultsPage';
import StatsPage from './components/StatsPage';

// stage: 'search' | 'redirecting-to-payment' | 'preview-loading' | 'preview-ready' | 'results' | 'stats'

export default function App() {
  const [stage, setStage] = useState('search');
  const [travelData, setTravelData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);
  const [fullLoadProgress, setFullLoadProgress] = useState(0);

  // ── On mount: check if returning from Stripe payment ──────────────────────
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paid = urlParams.get('paid');
    const sessionId = urlParams.get('session_id');

    if (paid === 'true' && sessionId) {
      // Clean URL immediately
      window.history.replaceState({}, '', '/');

      // Retrieve saved travel params from sessionStorage
      const saved = sessionStorage.getItem('travelParams');
      if (saved) {
        const params = JSON.parse(saved);
        sessionStorage.removeItem('travelParams');
        runTravelPlan({ ...params, session_id: sessionId });
      } else {
        setError('Session expired. Please search again.');
      }
    }
  }, []);

  // ── Step 1: User submits form → go to Stripe ─────────────────────────────
  const handleSearch = async (params) => {
    setError(null);
    setSearchParams(params);

    // Save params in sessionStorage so we can retrieve them after Stripe redirect
    sessionStorage.setItem('travelParams', JSON.stringify(params));

    setStage('redirecting-to-payment');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: params.from, to: params.to }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Could not create payment session');
      }

      const { url } = await res.json();
      window.location.href = url; // → Stripe Checkout
    } catch (err) {
      setError(err.message);
      setStage('search');
    }
  };

  // ── Step 2: After payment → run two-phase plan generation ─────────────────
  const runTravelPlan = async (params) => {
    setSearchParams(params);
    setPreviewData(null);
    setTravelData(null);
    setFullLoadProgress(0);
    setStage('preview-loading');

    // Phase 1: Quick preview (~5-8s) — free, shown while full plan loads
    try {
      const previewRes = await fetch('/api/travel-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: params.from, to: params.to, departDate: params.departDate }),
      });
      if (previewRes.ok) {
        const preview = await previewRes.json();
        setPreviewData(preview);
        setStage('preview-ready');
      }
    } catch {
      // preview fails silently — full plan continues
    }

    // Phase 2: Full plan with payment session_id
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
        throw new Error(errData.details ? `${errData.error} — ${errData.details}` : errData.error);
      }

      const data = await res.json();
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
      {(stage === 'search' || stage === 'redirecting-to-payment') && (
        <HeroSearch
          onSearch={handleSearch}
          error={error}
          onShowStats={() => setStage('stats')}
          isRedirecting={stage === 'redirecting-to-payment'}
        />
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
        <ResultsPage data={travelData} searchParams={searchParams} onReset={handleReset} />
      )}
      {stage === 'stats' && (
        <StatsPage onBack={() => setStage('search')} />
      )}
    </div>
  );
}
