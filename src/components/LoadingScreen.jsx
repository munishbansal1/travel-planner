import { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  { emoji: '🔍', text: 'Searching for the best routes...' },
  { emoji: '✈️', text: 'Finding available flights...' },
  { emoji: '🏨', text: 'Discovering perfect hotels...' },
  { emoji: '🗺️', text: 'Exploring places to visit...' },
  { emoji: '🍽️', text: 'Finding local restaurants...' },
  { emoji: '📸', text: 'Uncovering hidden gems...' },
  { emoji: '💰', text: 'Calculating costs and budgets...' },
  { emoji: '📅', text: 'Creating personalized itineraries...' },
  { emoji: '🌍', text: 'Checking visa requirements...' },
  { emoji: '✨', text: 'Putting it all together...' },
];

export default function LoadingScreen({ from, to }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 3;
      });
    }, 500);

    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  const current = LOADING_MESSAGES[messageIndex];

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern opacity-20" />

      {/* Floating clouds */}
      <div className="absolute top-20 left-0 text-6xl opacity-20 animate-pulse">☁️</div>
      <div className="absolute top-32 right-10 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute bottom-32 left-20 text-5xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>

      {/* Flying plane */}
      <div className="absolute top-1/3 fly-plane text-4xl">✈️</div>

      <div className="relative z-10 text-center max-w-lg mx-auto px-4">
        {/* Main loading animation */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-spin-slow" />
            {/* Middle ring */}
            <div className="absolute inset-3 rounded-full border-4 border-sky-300/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
            {/* Center */}
            <div className="absolute inset-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl animate-bounce-slow">
              {current.emoji}
            </div>
          </div>
        </div>

        {/* Route display */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="glass text-white font-bold text-lg px-4 py-2 rounded-xl">
            📍 {from || 'Origin'}
          </div>
          <div className="text-white text-2xl animate-pulse">→</div>
          <div className="glass text-white font-bold text-lg px-4 py-2 rounded-xl">
            🎯 {to || 'Destination'}
          </div>
        </div>

        {/* Status message */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Crafting Your Dream Trip
        </h2>
        <p className="text-sky-200 text-lg mb-8 h-7 transition-all duration-500">
          {current.text}{dots}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-300 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 90)}%` }}
          />
        </div>
        <p className="text-white/60 text-sm">
          Claude AI is analyzing thousands of travel options...
        </p>

        {/* Loading steps */}
        <div className="mt-8 flex justify-center gap-6">
          {LOADING_MESSAGES.slice(0, 5).map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                i === messageIndex % 5 ? 'opacity-100 scale-110' : 'opacity-40 scale-90'
              }`}
            >
              <span className="text-2xl">{msg.emoji}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-white/50 text-xs">
          This may take 20-40 seconds while AI generates your complete travel plan
        </p>
      </div>
    </div>
  );
}
