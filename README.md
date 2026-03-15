# PINT MVP - YouTube Sourcing & Analysis Dashboard

A professional dashboard for discovering and benchmarking rapidly growing YouTube channels.

## Core Features
- **Rising Dashboard**: Get a bird's eye view of today's market movers.
- **Velocity Search**: Find channels with the highest growth-to-subscriber ratio.
- **Trend Analytics**: Visual sparklines for 7-day performance.
- **Benchmarking Workspace**: Save channels and record strategic notes.
- **AI-lite Insights**: Qualitative analysis of thumbnail and hook patterns.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Recharts, Lucide Icons
- **Backend**: Express, YouTube Data API v3 (Proxy with LRU Cache)
- **Styling**: Vanilla CSS (Financial/SaaS Aesthetic)

## Getting Started
1. `npm install`
2. Set your `VITE_YOUTUBE_API_KEY` in `.env.local`
3. `npm start`
