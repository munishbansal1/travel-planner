import { useState, useEffect } from 'react';
import HeroSearch from './components/HeroSearch';
import LoadingScreen from './components/LoadingScreen';
import ResultsPage from './components/ResultsPage';
import StatsPage from './components/StatsPage';

// stage: 'search' | 'redirecting-to-payment' | 'preview-loading' | 'preview-ready' | 'results' | 'stats'

// ── Customer state helpers ─────────────────────────────────────────────────────
function getCustomerState() {
  try {
    const saved = localStorage.getItem('travelCustomer');
    if (saved) return JSON.parse(saved);
  } catch {}
  // First visit — create a unique client ID
  const clientId = 'cl_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const state = { clientId, trialUsed: false, paidCustomer: false, stripeCustomerId: null };
  localStorage.setItem('travelCustomer', JSON.stringify(state));
  return state;
}

function saveCustomerState(updates) {
  const current = getCustomerState();
  const next = { ...current, ...updates };
  localStorage.setItem('travelCustomer', JSON.stringify(next));
  return next;
}

function deriveCustomerType(cs) {
  if (!cs.trialUsed) return 'trial';        // first-ever plan → free
  if (cs.paidCustomer) return 'returning';  // has paid before → ₹49
  return 'new';                             // trial used, never paid → ₹99
}

export default function App() {
  const [stage, setStage] = useState('search');
  const [travelData, setTravelData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);
  const [fullLoadProgress, setFullLoadProgress] = useState(0);
  const [customerType, setCustomerType] = useState('trial'); // 'trial' | 'new' | 'returning'

  // Compute customer type on first render
  useEffect(() => {
    setCustomerType(deriveCustomerType(getCustomerState()));
  }, []);

  // ── On mount: check if returning from Stripe ──────────────────────────────
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paid = urlParams.get('paid');
    const sessionId = urlParams.get('session_id');

    if (paid === 'true' && sessionId) {
      window.history.replaceState({}, '', '/');

      // Verify payment & update customer state
      fetch(`/api/verify-payment/${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paid) {
            const updates = { trialUsed: true, paidCustomer: true };
            if (data.stripeCustomerId) updates.stripeCustomerId = data.stripeCustomerId;
            const next = saveCustomerState(updates);
            setCustomerType(deriveCustomerType(next));
          }
        })
        .catch(() => {});

      // Retrieve saved travel params and run plan
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

  // ── Step 1: User submits the wizard form ──────────────────────────────────
  const handleSearch = async (params) => {
    setError(null);
    setSearchParams(params);

    const cs = getCustomerState();

    // ── FREE TRIAL (first plan ever) ─────────────────────────────────────────
    if (!cs.trialUsed) {
      runTravelPlan({ ...params, trial: true, clientId: cs.clientId });
      return;
    }

    // ── PAID FLOW ─────────────────────────────────────────────────────────────
    sessionStorage.setItem('travelParams', JSON.stringify(params));
    setStage('redirecting-to-payment');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: params.from,
          to: params.to,
          returning: cs.paidCustomer, // true → ₹49 loyalty price
        }),
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

  // ── Step 2: Two-phase plan generation ────────────────────────────────────
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

    // Phase 2: Full plan
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

        // If server says trial already used (e.g. server restarted & lost memory),
        // sync local state so the user gets the paid flow next time.
        if (errData.code === 'TRIAL_USED') {
          const next = saveCustomerState({ trialUsed: true });
          setCustomerType(deriveCustomerType(next));
        }

        throw new Error(errData.details ? `${errData.error} — ${errData.details}` : errData.error);
      }

      const data = await res.json();

      // Mark trial as used after the plan is successfully generated
      if (params.trial) {
        const next = saveCustomerState({ trialUsed: true });
        setCustomerType(deriveCustomerType(next));
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
    setCustomerType(deriveCustomerType(getCustomerState()));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {(stage === 'search' || stage === 'redirecting-to-payment') && (
        <HeroSearch
          onSearch={handleSearch}
          error={error}
          onShowStats={() => setStage('stats')}
          isRedirecting={stage === 'redirecting-to-payment'}
          customerType={customerType}
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
