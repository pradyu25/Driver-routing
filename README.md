
# Full-Stack Trip Planner & ELD Log Generator

A comprehensive logistics application for commercial drivers that automates route planning and FMCSA HOS (Hours of Service) compliance logging.

## Features

- **Interactive Route Planning**: Inputs for Start, Pickup, Dropoff locations.
- **Optimized Routing**: Uses OpenRouteService for HGV-aware routing.
- **Automated ELD Logs**: Generates 24-hour log grids compliant with FMCSA rules (11h drive, 14h duty, 10h rest).
- **Mandatory Stops**: Automatically inserts fuel stops every 1,000 miles and required rest breaks.
- **Visual Map**: Leaflet-based map with custom markers for all key events.
- **Log Visualization**: SVG-based daily log sheets.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Leaflet, Axios, Lucide Icons.
- **Backend**: Python 3.11, Django 4.2, Django REST Framework.
- **Database**: SQLite (Local), PostgreSQL (Production ready).
- **Routing API**: OpenRouteService (Free tier).
- **Hosting**: Vercel (Monorepo support for both Frontend & Backend).

## Prerequisites

- Python 3.11+
- Node.js 18+
- OpenRouteService API Key (Free)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd driver-routing
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   # source venv/bin/activate
   
   pip install -r requirements.txt
   
   # Setup Environment
   cp .env.example .env
   # Edit .env and add your MAP_API_KEY
   
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   # Open new terminal
   cd frontend
   npm install
   npm run dev
   ```

4. **Access App**
   Open http://localhost:5173

## Deployment

The project is configured for Vercel.

1. Install Vercel CLI or connect GitHub repo to Vercel.
2. Ensure `vercel.json` is at root.
3. Set Environment Variables in Vercel:
   - `SECRET_KEY`
   - `MAP_API_KEY`
   - `DATABASE_URL` (Optional, defaults to SQLite which is ephemeral on Serverless)
   - `VITE_API_URL` (Set to `/api` or full URL)

## Architecture

- **Routing Engine**: `backend/trips/services/routing.py` handles geocoding and pathfinding.
- **ELD Engine**: `backend/trips/services/eld_engine.py` simulates driving logs based on route segments and HOS rules.
- **Frontend**: React SPA consuming Django REST API. Markers and Logs are rendered client-side based on API JSON response.

## Assumptions

- Driver starts Day 1 at 08:00 AM (or strictly after 10h rest).
- Average driving speed 60 mph used for log timeline calculations.
- Fuel stops take 30 mins ON-DUTY.
- Loading/Unloading takes 1 hour ON-DUTY.
