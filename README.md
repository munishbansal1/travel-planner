# ✈️ TravelAI — Smart Travel Planner

> **Built by [Munish Bansal](https://www.linkedin.com/in/munish-bansal-66b7844/)**  
> 📧 [munishbansal.mb@gmail.com](mailto:munishbansal.mb@gmail.com) · 🐙 [github.com/munishbansal1](https://github.com/munishbansal1) · 💼 [linkedin.com/in/munish-bansal-66b7844](https://www.linkedin.com/in/munish-bansal-66b7844/)

An AI-powered travel planning website built with React + Express + Claude AI. Just enter your origin and destination, and get a complete travel plan including flights, places to visit, full itineraries, and booking links.

## Features

- 🔍 **Smart Search** — Enter any origin & destination worldwide
- ✈️ **Transport Options** — Flights, trains with real booking links (Google Flights, Skyscanner, MakeMyTrip, IRCTC)
- 🗺️ **Places to Visit** — 8-10 curated attractions with ratings, hours, booking links (GetYourGuide, Viator)
- 📅 **3 Itineraries** — Budget / Moderate / Luxury, each with 5-day day-by-day plans + cost estimates in USD & INR
- 🏨 **Hotel Booking** — Direct links to Booking.com, Hotels.com, Airbnb, MakeMyTrip Hotels
- 💡 **Travel Tips** — Visa info, local tips, emergency numbers, currency

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your API key
```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
```

Get your key at: https://console.anthropic.com/

### 3. Run the app
```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173) simultaneously.

Open: **http://localhost:5173**

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide Icons
- **Backend:** Express.js + Anthropic SDK
- **AI:** Claude Opus 4.7 with Adaptive Thinking + Streaming
- **Styling:** Tailwind CSS with custom animations

## Project Structure

```
travel-planner/
├── server.js              # Express backend + Claude API
├── src/
│   ├── App.jsx            # Main app with state management
│   ├── main.jsx           # React entry point
│   ├── index.css          # Tailwind + custom styles
│   └── components/
│       ├── HeroSearch.jsx       # Landing page search form
│       ├── LoadingScreen.jsx    # Animated loading while AI thinks
│       ├── ResultsPage.jsx      # Tabbed results container
│       ├── TransportOptions.jsx # Flight/train cards with booking
│       ├── PlacesSection.jsx    # Attractions grid
│       └── ItinerarySection.jsx # Day-by-day itinerary cards
├── public/plane.svg       # Favicon
├── .env.example           # Environment template
└── vite.config.js         # Vite + proxy config
```

## Notes

- Travel plan generation takes 20–40 seconds (Claude is thinking!)
- Prices shown are AI estimates — actual prices may vary
- Booking links open real travel sites pre-filled with your destination

---

## Author & License

**© 2025 Munish Bansal** · All rights reserved

| | |
|---|---|
| Email | [munishbansal.mb@gmail.com](mailto:munishbansal.mb@gmail.com) |
| GitHub | [github.com/munishbansal1](https://github.com/munishbansal1) |
| LinkedIn | [linkedin.com/in/munish-bansal-66b7844](https://www.linkedin.com/in/munish-bansal-66b7844/) |
