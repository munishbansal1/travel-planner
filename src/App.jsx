import { useState } from 'react';
import HeroSearch from './components/HeroSearch';
import LoadingScreen from './components/LoadingScreen';
import ResultsPage from './components/ResultsPage';

export default function App() {
  const [stage, setStage] = useState('search'); // 'search' | 'loading' | 'results'
  const [travelData, setTravelData] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (params) => {
    setSearchParams(params);
    setStage('loading');
    setError(null);

    try {
      const response = await fetch('/api/travel-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json();
        const msg = errData.details
          ? `${errData.error} — ${errData.details}`
          : errData.error || 'Failed to generate travel plan';
        throw new Error(msg);
      }

      const data = await response.json();
      setTravelData(data);
      setStage('results');
    } catch (err) {
      setError(err.message);
      setStage('search');
    }
  };

  const handleReset = () => {
    setStage('search');
    setTravelData(null);
    setSearchParams(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {stage === 'search' && (
        <HeroSearch onSearch={handleSearch} error={error} />
      )}
      {stage === 'loading' && (
        <LoadingScreen from={searchParams?.from} to={searchParams?.to} />
      )}
      {stage === 'results' && travelData && (
        <ResultsPage
          data={travelData}
          searchParams={searchParams}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
