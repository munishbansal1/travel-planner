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

// Increase default response timeout to 3 minutes for long AI responses
app.use((req, res, next) => {
  res.setTimeout(180000);
  next();
});

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKey: process.env.ANTHROPIC_API_KEY ? 'set' : 'MISSING' });
});

// Main travel planning endpoint
app.post('/api/travel-plan', async (req, res) => {
  const { from, to, departDate, returnDate, travelers, budget } = req.body;

  if (!from || !to) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(401).json({ error: 'ANTHROPIC_API_KEY is not set in .env file' });
  }

  const encodedFrom = encodeURIComponent(from);
  const encodedTo = encodeURIComponent(to);
  const fromSlug = from.toLowerCase().replace(/\s+/g, '-');
  const toSlug = to.toLowerCase().replace(/\s+/g, '-');

  const prompt = `You are an expert travel planner. Create a comprehensive travel plan for a trip from "${from}" to "${to}".

Trip Details:
- Travel Dates: ${departDate ? `Departing ${departDate}` : 'Flexible'}${returnDate ? `, Returning ${returnDate}` : ''}
- Number of Travelers: ${travelers || 1}
- Budget Level: ${budget || 'moderate'}

Please provide a detailed JSON response with EXACTLY this structure (no extra text, just valid JSON):

{
  "destination_overview": {
    "name": "full destination name",
    "country": "country name",
    "description": "2-3 sentence description of the destination",
    "best_time_to_visit": "best months/seasons",
    "local_currency": "currency name and code",
    "language": "primary language(s)",
    "timezone": "timezone",
    "weather": "brief weather description for travel period",
    "emergency_number": "local emergency number"
  },
  "transport_options": [
    {
      "type": "Flight",
      "icon": "✈️",
      "duration": "approximate travel time",
      "frequency": "how often (e.g., Multiple daily flights)",
      "approximate_cost_usd": {
        "min": 200,
        "max": 800
      },
      "approximate_cost_inr": {
        "min": 16000,
        "max": 65000
      },
      "airlines": ["airline1", "airline2"],
      "notes": "important notes about this option",
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
      "duration": "approximate travel time if applicable",
      "frequency": "frequency if applicable",
      "approximate_cost_usd": {
        "min": 50,
        "max": 200
      },
      "approximate_cost_inr": {
        "min": 4000,
        "max": 16000
      },
      "operators": ["operator names"],
      "notes": "notes about train travel",
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
      "total_cost_per_person_usd": {
        "min": 500,
        "max": 800
      },
      "total_cost_per_person_inr": {
        "min": 40000,
        "max": 65000
      },
      "accommodation": "hostels or budget hotels",
      "accommodation_per_night_usd": 30,
      "daily_plans": [
        {
          "day": 1,
          "title": "Day title",
          "activities": ["activity1", "activity2", "activity3"],
          "meals": {"breakfast": "suggestion", "lunch": "suggestion", "dinner": "suggestion"},
          "estimated_cost_usd": 80,
          "tips": "helpful tip for this day"
        }
      ],
      "highlights": ["key highlight 1", "key highlight 2"],
      "best_for": "solo travelers, backpackers"
    },
    {
      "title": "Comfortable Explorer",
      "emoji": "🏨",
      "type": "moderate",
      "duration_days": 5,
      "description": "The perfect balance of comfort and value",
      "total_cost_per_person_usd": {
        "min": 1200,
        "max": 1800
      },
      "total_cost_per_person_inr": {
        "min": 98000,
        "max": 148000
      },
      "accommodation": "3-star hotels",
      "accommodation_per_night_usd": 100,
      "daily_plans": [
        {
          "day": 1,
          "title": "Day title",
          "activities": ["activity1", "activity2", "activity3"],
          "meals": {"breakfast": "hotel breakfast", "lunch": "restaurant", "dinner": "local restaurant"},
          "estimated_cost_usd": 200,
          "tips": "helpful tip for this day"
        }
      ],
      "highlights": ["key highlight 1", "key highlight 2"],
      "best_for": "couples, families"
    },
    {
      "title": "Luxury Escape",
      "emoji": "✨",
      "type": "luxury",
      "duration_days": 5,
      "description": "Indulge in the finest experiences",
      "total_cost_per_person_usd": {
        "min": 3000,
        "max": 5000
      },
      "total_cost_per_person_inr": {
        "min": 246000,
        "max": 410000
      },
      "accommodation": "5-star luxury hotels",
      "accommodation_per_night_usd": 300,
      "daily_plans": [
        {
          "day": 1,
          "title": "Day title",
          "activities": ["activity1", "activity2", "activity3"],
          "meals": {"breakfast": "hotel breakfast", "lunch": "fine dining", "dinner": "signature restaurant"},
          "estimated_cost_usd": 500,
          "tips": "VIP tip for this day"
        }
      ],
      "highlights": ["key highlight 1", "key highlight 2"],
      "best_for": "honeymoon, special occasions"
    }
  ],
  "travel_tips": [
    "important travel tip 1",
    "important travel tip 2",
    "important travel tip 3",
    "important travel tip 4",
    "important travel tip 5"
  ],
  "visa_info": "brief visa requirements for Indian passport holders",
  "hotel_booking_links": [
    {"name": "Booking.com", "url": "https://www.booking.com/searchresults.html?ss=${encodedTo}", "logo": "🏨"},
    {"name": "Hotels.com", "url": "https://www.hotels.com/search.do?q-destination=${encodedTo}", "logo": "🏩"},
    {"name": "Airbnb", "url": "https://www.airbnb.com/s/${encodedTo}/homes", "logo": "🏠"},
    {"name": "MakeMyTrip Hotels", "url": "https://www.makemytrip.com/hotels/hotel-listing/?checkin=${departDate || ''}&checkout=${returnDate || ''}&city=${encodedTo}", "logo": "🏪"}
  ]
}

IMPORTANT:
- Include at least 8-10 places to visit
- Make all itineraries have 5 days with COMPLETE daily plans (all 5 days filled in)
- Generate REAL airline names, specific prices based on actual distances
- All URLs should be real and functional
- Costs should be realistic based on current travel prices
- Provide specific, useful travel tips
- Return ONLY valid JSON, no markdown code blocks, no extra text`;

  try {
    console.log(`\n🌍 Generating travel plan: ${from} → ${to}`);
    console.log(`   Budget: ${budget}, Travelers: ${travelers}`);
    console.log(`   Calling Claude API...`);

    // Use streaming for long responses to avoid timeout
    const stream = await client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system: 'You are an expert travel planner with deep knowledge of destinations worldwide. Always respond with valid JSON only. No markdown code blocks, no backticks, no extra text — just the raw JSON object starting with { and ending with }.',
      messages: [{ role: 'user', content: prompt }],
    });

    // Use finalMessage() to get complete response after streaming finishes
    const message = await stream.finalMessage();

    // Extract text blocks (skip thinking blocks)
    const fullText = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    console.log(`   Raw response length: ${fullText.length} chars`);
    console.log(`   First 200 chars: ${fullText.substring(0, 200)}`);

    if (!fullText.trim()) {
      throw new Error('Claude returned an empty response. The model may have only produced thinking blocks.');
    }

    // Parse JSON — handle both raw JSON and JSON wrapped in markdown code blocks
    let travelData;
    try {
      // First try direct parse (cleanest case)
      travelData = JSON.parse(fullText.trim());
    } catch {
      // Try extracting JSON from markdown code block or surrounding text
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Could not find JSON in response. Full response:', fullText.substring(0, 500));
        throw new Error(`Response did not contain valid JSON. Got: ${fullText.substring(0, 200)}`);
      }
      travelData = JSON.parse(jsonMatch[0]);
    }

    console.log('✅ Travel plan generated successfully');
    console.log(`   Places: ${travelData.places_to_visit?.length || 0}, Itineraries: ${travelData.itineraries?.length || 0}`);

    res.json(travelData);

  } catch (error) {
    console.error('\n❌ Error generating travel plan:', error);
    console.error('   Error type:', error.constructor.name);
    console.error('   Error message:', error.message);
    if (error.status) console.error('   HTTP status:', error.status);
    if (error.error) console.error('   API error:', JSON.stringify(error.error));

    if (error.status === 401 || error.message?.includes('API key') || error.message?.includes('authentication')) {
      return res.status(401).json({
        error: 'Invalid or missing API key.',
        details: 'Please check your ANTHROPIC_API_KEY in the .env file.'
      });
    }

    if (error.status === 529 || error.message?.includes('overloaded')) {
      return res.status(503).json({
        error: 'Claude API is temporarily overloaded.',
        details: 'Please wait a moment and try again.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate travel plan. Please try again.',
      details: error.message || 'Unknown error'
    });
  }
});

// Serve the built React frontend in production
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  // Catch-all: send index.html for any non-API route (React Router support)
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
  console.log(`📦 Serving static frontend from: ${distPath}`);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌍 Travel Planner Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔑 API Key: ${process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing — add ANTHROPIC_API_KEY to .env file'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});
