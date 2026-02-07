
# Demo Video Script

## Introduction (0:00 - 0:45)
- "Hi, I'm the AI Engineer. I've built a Full-Stack Trip Planner and ELD Log Generator."
- "The goal is to help property-carrying commercial drivers plan compliant trips instantly."
- "The app uses Django REST Framework for the backend logistics engine and React for the interactive frontend."

## Architecture Overview (0:45 - 1:30)
- "Let's look at the robust architecture."
- "Backend: Organized into modular services. `routing.py` handles OpenRouteService API, and `eld_engine.py` implements the complex FMCSA Hours-of-Service constraints (11h drive, 14h window)."
- "Frontend: A modern Vite + React app using Tailwind for styling and Leaflet for maps."
- "Deployment: Configured for Vercel acting as a unified host for both API and UI."

## Feature Walkthrough (1:30 - 3:30)
- **Start the Demo**: "Let's plan a trip from New York to Los Angeles."
- **Input**: Enter locations and 'Current Cycle Used' (e.g., 10 hours).
- **Processing**: "When I hit generate, the backend Geocodes the points, calculates the route, and simulations the drive day-by-day."
- **Results Page**:
  - **Map**: "Here you see the route polyline. Notice the orange markers? Those are automatically inserted fuel stops every 1,000 miles."
  - **Markers**: "Green is Pickup, Red is Dropoff. All localized securely."
  - **Logs**: "Scroll down to the ELD Grid. This SVG chart visualizes the driver's status. see the blocks for Driving, On-Duty (Fuel/Load), and mandatory 10-hour Rest breaks."
  - "The system automatically splits logs across multiple days if the trip is long."

## Code Highlights (3:30 - 4:30)
- Show `eld_engine.py`: "The simulation logic accounts for duty windows and remaining cycle hours."
- Show `LogGrid.jsx`: "We render the log grid dynamically using SVG paths for pixel-perfect accuracy."

## Conclusion (4:30 - 5:00)
- "This application demonstrates production-ready code structure, complex logic encapsulation, and a polished user experience."
- "Thank you."
