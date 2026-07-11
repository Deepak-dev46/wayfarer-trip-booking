# Wayfarer — Trip Booking Website (Frontend Only)

A production-style, mock-data-driven trip booking platform built with React (Vite), MUI, Framer Motion, Swiper, React Hook Form, and Context API.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Logins

**Admin**
- Email: `admin@trip.com`
- Password: `admin123`

**User**
- Register any account from the Register page, or use:
- Email: `demo@wayfarer.com`
- Password: `demo123`

## What's inside

- Full public site: Home, Packages, Package Details, Offers, Destinations, About, Contact, Booking + Confirmation, Login/Register
- Admin dashboard: Packages, Offers, Bookings, Contacts, Users CRUD (all mock, in-memory + localStorage-backed via Context)
- Adding an Offer in Admin instantly appears in the Home page carousel and Offers page
- Adding/editing/deleting a Package in Admin instantly reflects on the public Packages/Home pages
- All "API calls" are simulated in `src/services/mockApi.js` with artificial network delay over the JSON files in `src/data/`

## Design

Coastal editorial theme — deep marine blue, warm sand accent, glass panels over a soft sky gradient. Display type is Fraunces (serif, a little characterful), body/UI type is Manrope.
