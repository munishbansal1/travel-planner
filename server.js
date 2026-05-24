import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setTimeout(180000);
  next();
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── In-memory analytics ───────────────────────────────────────────────────────
const analytics = {
  totalSearches: 0,
  todaySearches: 0,
  lastReset: new Date().toDateString(),
  popularRoutes: {},   // "From → To": count
  startedAt: new Date().toISOString(),
};

function trackSearch(from, to) {
  const today = new Date().toDateString();
  if (analytics.lastReset !== today) {
    analytics.todaySearches = 0;
    analytics.lastReset = today;
  }
  analytics.totalSearches++;
  analytics.todaySearches++;
  const key = `${from} → ${to}`;
  analytics.popularRoutes[key] = (analytics.popularRoutes[key] || 0) + 1;
}

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKey: process.env.ANTHROPIC_API_KEY ? 'set' : 'MISSING' });
});

// ── Analytics endpoint ────────────────────────────────────────────────────────
app.get('/api/analytics', (req, res) => {
  const topRoutes = Object.entries(analytics.popularRoutes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([route, count]) => ({ route, count }));

  res.json({
    totalSearches: analytics.totalSearches,
    todaySearches: analytics.todaySearches,
    topRoutes,
    serverUpSince: analytics.startedAt,
  });
});

// ── Phase 1: Quick destination preview (~5-8 seconds) ─────────────────────────
app.post('/api/travel-preview', async (req, res) => {
  const { from, to, departDate } = req.body;
  if (!from || !to) return res.status(400).json({ error: 'Origin and destination required' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(401).json({ error: 'API key missing' });

  const prompt = `Give me a quick travel preview for a trip from "${from}" to "${to}"${departDate ? ` departing ${departDate}` : ''}.

Return ONLY this JSON (no markdown, no extra text):
{
  "destination_overview": {
    "name": "full destination name",
    "country": "country",
    "description": "2 engaging sentences about the destination",
    "best_time_to_visit": "best months/season",
    "local_currency": "currency name and code",
    "language": "primary language",
    "timezone": "timezone",
    "weather": "weather for this travel period",
    "emergency_number": "local emergency number",
    "flag": "country flag emoji"
  },
  "top_places": [
    {
      "name": "place name",
      "emoji": "relevant emoji",
      "type": "Beach/Temple/Museum/etc",
      "one_liner": "one exciting sentence about this place",
      "must_see": true
    }
  ],
  "visa_info": "brief visa info for Indian passport holders",
  "quick_tip": "single most important travel tip"
}

Include exactly 4 top places. Return ONLY valid JSON.`;

  try {
    console.log(`\n⚡ Quick preview: ${from} → ${to}`);
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      system: 'You are a travel expert. Respond with valid JSON only, no markdown.',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content.filter(b => b.type === 'text').map(b => b.text).join('');
    let preview;
    try {
      preview = JSON.parse(text.trim());
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON in preview response');
      preview = JSON.parse(match[0]);
    }

    console.log(`✅ Preview ready for ${preview.destination_overview?.name}`);
    res.json(preview);
  } catch (error) {
    console.error('Preview error:', error.message);
    res.status(500).json({ error: 'Preview failed', details: error.message });
  }
});

// ── Phase 2: Full travel plan (~25-40 seconds) ────────────────────────────────
app.post('/api/travel-plan', async (req, res) => {
  const { from, to, departDate, returnDate, travelers, budget } = req.body;

  if (!from || !to) return res.status(400).json({ error: 'Origin and destination are required' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(401).json({ error: 'API key missing' });

  trackSearch(from, to);

  const encodedFrom = encodeURIComponent(from);
  const encodedTo = encodeURIComponent(to);
  const fromSlug = from.toLowerCase().replace(/\s+/g, '-');
  const toSlug = to.toLowerCase().replace(/\s+/g, '-');

  const prompt = `You are an expert travel planner. Create a comprehensive travel plan for a trip from "${from}" to "${to}".

Trip Details:
- Travel Dates: ${departDate ? `Departing ${departDate}` : 'Flexible'}${returnDate ? `, Returning ${returnDate}` : ''}
- Number of Travelers: ${travelers || 1}
- Budget Level: ${budget || 'moderate'}

Return ONLY this JSON (no markdown, no extra text):

{
  "destination_overview": {
    "name": "full destination name",
    "country": "country name",
    "description": "2-3 sentence description",
    "best_time_to_visit": "best months/seasons",
    "local_currency": "currency name and code",
    "language": "primary language(s)",
    "timezone": "timezone",
    "weather": "weather for travel period",
    "emergency_number": "local emergency number",
    "flag": "country flag emoji"
  },
  "transport_options": [
    {
      "type": "Flight",
      "icon": "✈️",
      "duration": "approximate travel time",
      "frequency": "Multiple daily flights",
      "approximate_cost_usd": { "min": 200, "max": 800 },
      "approximate_cost_inr": { "min": 16000, "max": 65000 },
      "airlines": ["airline1", "airline2"],
      "notes": "important notes",
      "booking_links": [
        {"name": "Google Flights", "url": "https://www.google.com/travel/flights?q=flights+from+${encodedFrom}+to+${encodedTo}", "type": "search"},
        {"name": "Skyscanner", "url": "https://www.skyscanner.co.in/transport/flights/${fromSlug}/${toSlug}/", "type": "search"},
        {"name": "MakeMyTrip", "url": "https://www.makemytrip.com/flights/", "type": "booking"},
        {"name": "Cleartrip", "url": "https://www.cleartrip.com/flights/", "type": "booking"}
      ]
    },
    {
      "type": "Train",
      "icon": "🚂",
      "duration": "travel time",
      "frequency": "frequency",
      "approximate_cost_usd": { "min": 50, "max": 200 },
      "approximate_cost_inr": { "min": 4000, "max": 16000 },
      "operators": ["operator names"],
      "notes": "notes",
      "booking_links": [
        {"name": "IRCTC", "url": "https://www.irctc.co.in/", "type": "booking"},
        {"name": "Rail Europe", "url": "https://www.raileurope.com/", "type": "booking"}
      ]
    }
  ],
  "places_to_visit": [
    {
      "name": "place name",
      "type": "Museum/Temple/Beach/Park/etc",
      "emoji": "relevant emoji",
      "description": "2-3 sentence description",
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "entry_fee": "free or price range",
      "best_time": "best time to visit",
      "duration_suggested": "1-2 hours",
      "rating": 4.5,
      "must_see": true,
      "booking_link": "https://www.getyourguide.com/s/?q=${encodedTo}+tour",
      "viator_link": "https://www.viator.com/searchResults/all?text=${encodedTo}+attractions"
    }
  ],
  "itineraries": [
    {
      "title": "Budget Explorer",
      "emoji": "💰",
      "type": "budget",
      "duration_days": 5,
      "description": "Perfect for budget-conscious travelers",
      "total_cost_per_person_usd": { "min": 500, "max": 800 },
      "total_cost_per_person_inr": { "min": 40000, "max": 65000 },
      "accommodation": "hostels or budget hotels",
      "accommodation_per_night_usd": 30,
      "daily_plans": [
        {
          "day": 1,
          "title": "Day title",
          "activities": ["activity1", "activity2", "activity3"],
          "meals": {"breakfast": "suggestion", "lunch": "suggestion", "dinner": "suggestion"},
          "estimated_cost_usd": 80,
          "tips": "helpful tip"
        }
      ],
      "highlights": ["highlight 1", "highlight 2"],
      "best_for": "solo travelers, backpackers"
    },
    {
      "title": "Comfortable Explorer",
      "emoji": "🏨",
      "type": "moderate",
      "duration_days": 5,
      "description": "Perfect balance of comfort and value",
      "total_cost_per_person_usd": { "min": 1200, "max": 1800 },
      "total_cost_per_person_inr": { "min": 98000, "max": 148000 },
      "accommodation": "3-star hotels",
      "accommodation_per_night_usd": 100,
      "daily_plans": [
        {
          "day": 1,
          "title": "Day title",
          "activities": ["activity1", "activity2", "activity3"],
          "meals": {"breakfast": "hotel breakfast", "lunch": "restaurant", "dinner": "local restaurant"},
          "estimated_cost_usd": 200,
          "tips": "helpful tip"
        }
      ],
      "highlights": ["highlight 1", "highlight 2"],
      "best_for": "couples, families"
    },
    {
      "title": "Luxury Escape",
      "emoji": "✨",
      "type": "luxury",
      "duration_days": 5,
      "description": "Indulge in the finest experiences",
      "total_cost_per_person_usd": { "min": 3000, "max": 5000 },
      "total_cost_per_person_inr": { "min": 246000, "max": 410000 },
      "accommodation": "5-star luxury hotels",
      "accommodation_per_night_usd": 300,
      "daily_plans": [
        {
          "day": 1,
          "title": "Day title",
          "activities": ["activity1", "activity2", "activity3"],
          "meals": {"breakfast": "hotel breakfast", "lunch": "fine dining", "dinner": "signature restaurant"},
          "estimated_cost_usd": 500,
          "tips": "VIP tip"
        }
      ],
      "highlights": ["highlight 1", "highlight 2"],
      "best_for": "honeymoon, special occasions"
    }
  ],
  "travel_tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "visa_info": "visa requirements for Indian passport holders",
  "hotel_booking_links": [
    {"name": "Booking.com", "url": "https://www.booking.com/searchresults.html?ss=${encodedTo}", "logo": "🏨"},
    {"name": "Hotels.com", "url": "https://www.hotels.com/search.do?q-destination=${encodedTo}", "logo": "🏩"},
    {"name": "Airbnb", "url": "https://www.airbnb.com/s/${encodedTo}/homes", "logo": "🏠"},
    {"name": "MakeMyTrip Hotels", "url": "https://www.makemytrip.com/hotels/hotel-listing/?checkin=${departDate || ''}&checkout=${returnDate || ''}&city=${encodedTo}", "logo": "🏪"}
  ]
}

Rules:
- Include 8-10 places_to_visit
- All 3 itineraries must have ALL 5 days filled in completely
- Return ONLY valid JSON, no markdown, no extra text`;

  try {
    console.log(`\n🌍 Full plan: ${from} → ${to} (${budget}, ${travelers} travellers)`);

    const stream = await client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system: 'You are an expert travel planner. Respond with valid JSON only. No markdown, no code blocks, just raw JSON.',
      messages: [{ role: 'user', content: prompt }],
    });

    const message = await stream.finalMessage();
    const fullText = message.content.filter(b => b.type === 'text').map(b => b.text).join('');

    console.log(`   Response: ${fullText.length} chars`);
    if (!fullText.trim()) throw new Error('Empty response from Claude');

    let travelData;
    try {
      travelData = JSON.parse(fullText.trim());
    } catch {
      const match = fullText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`No JSON found. Got: ${fullText.substring(0, 200)}`);
      travelData = JSON.parse(match[0]);
    }

    console.log(`✅ Full plan ready — places: ${travelData.places_to_visit?.length}, itineraries: ${travelData.itineraries?.length}`);
    res.json(travelData);

  } catch (error) {
    console.error('❌ Full plan error:', error.message);
    if (error.status === 401 || error.message?.includes('API key') || error.message?.includes('authentication')) {
      return res.status(401).json({ error: 'Invalid or missing API key.', details: 'Check your ANTHROPIC_API_KEY.' });
    }
    if (error.status === 529 || error.message?.includes('overloaded')) {
      return res.status(503).json({ error: 'Claude API is temporarily overloaded.', details: 'Please try again in a moment.' });
    }
    res.status(500).json({ error: 'Failed to generate travel plan.', details: error.message });
  }
});

// ── Serve built frontend ──────────────────────────────────────────────────────
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(join(distPath, 'index.html')));
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌍 Travel Planner Server → http://0.0.0.0:${PORT}`);
  console.log(`🔑 API Key: ${process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`📊 Analytics: http://localhost:${PORT}/api/analytics\n`);
});
