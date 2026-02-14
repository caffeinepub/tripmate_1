# Specification

## Summary
**Goal:** Build the TripMate MVP flow for authenticated trip planning with deterministic itinerary generation and promoted business listings, with a cohesive travel-themed UI.

**Planned changes:**
- Create a Trip Details form (trip type, destination, start/end dates, notes/interests) that saves a Trip in the backend and routes to a Trip Plan view.
- Implement a deterministic (non-LLM) itinerary generator that produces overview, day-by-day itinerary, route guidance text, stay/food category suggestions, and a packing/checklist; allow regenerating after editing inputs.
- Add Internet Identity authentication with a basic account model (traveler vs owner) and enforce per-user access to trips/listings; allow public browsing of promoted listings.
- Build promoted listings: owner CRUD (name, category, destination/area, description, contact info, optional promo text); traveler browse + filter; inject matching listings into trip plans as “Sponsored suggestions”.
- Implement backend persistence in a single Motoko actor for user profiles, trips, generated plans, and promoted listings, with the required query/update methods.
- Add frontend navigation/pages: Home/Landing, Trip Planner (new trip + my trips), Trip Plan detail, Explore Promoted Listings, Owner Dashboard (owner-only).
- Apply a consistent earthy travel-themed UI (avoid blue/purple) including a landing hero section with primary CTA to plan a trip.
- Add and render generated static branding assets (logo + hero illustration) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can sign in with Internet Identity, create and revisit trips that persist, view/regenerate an end-to-end trip plan, browse promoted listings, and (as owners) manage promoted listings that appear as sponsored suggestions in matching trip plans.
