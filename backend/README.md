# Wayfarer Backend

Spring Boot + MySQL backend for the Wayfarer trip booking frontend, with JWT authentication.
Built to match the API contract used by `src/services/mockApi.js` in the React app, so you can
swap the mock service for real HTTP calls with minimal changes.

## Stack
- Java 17, Spring Boot 3.3.2
- Spring Web, Spring Data JPA, Spring Security
- MySQL 8
- JWT (jjwt 0.12.6)
- No Lombok, no Builder pattern — explicit constructors/getters/setters throughout

## Setup

1. Create a MySQL database (or let it auto-create):
   ```sql
   CREATE DATABASE wayfarer_db;
   ```
2. Update `src/main/resources/application.properties` with your MySQL username/password and,
   for production, a strong `app.jwt.secret` (32+ characters, ideally loaded from an env var).
3. Run:
   ```
   mvn spring-boot:run
   ```
   The API starts on **http://localhost:8085**.

On first run, `DataSeeder` populates the database with:
- An admin account: `admin@trip.com` / `admin123` (override via `app.seed.admin-email` /
  `app.seed.admin-password`)
- The same demo packages, offers, destinations, reviews, users, bookings, and contacts that
  ship in the frontend's `src/data/*.json` seed files, so the UI looks identical to the mock-API
  version on first load.

Set `app.seed.enabled=false` to skip demo-data seeding (the admin account is always seeded).

## Auth

- `POST /api/auth/register` — `{ name, email, password, phone }` → `{ token, role, user }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, role, user }`

Send the token on subsequent requests: `Authorization: Bearer <token>`.

## Endpoints

| Resource      | Public                                  | Admin-only (`ROLE_ADMIN`)                     |
|---------------|------------------------------------------|------------------------------------------------|
| Packages      | GET /api/packages, GET /api/packages/{id} | POST / PUT / DELETE /api/packages              |
| Offers        | GET /api/offers, GET /api/offers/{id}     | POST / PUT / DELETE /api/offers                |
| Destinations  | GET /api/destinations, GET /{id}          | — (read-only, matches frontend)                |
| Reviews       | GET /api/reviews?packageId={id}           | — (read-only, matches frontend)                |
| Bookings      | POST /api/bookings (anyone can book)      | GET, PUT /{id}/status, DELETE /api/bookings     |
| Contacts      | POST /api/contacts (anyone can submit)    | GET, PUT /{id}/read, DELETE /api/contacts       |
| Users         | —                                        | GET / DELETE /api/users                        |

This mirrors `mockApi.js` exactly: only `login`, `register`, `createBooking`, and `createContact`
are callable without being signed in; every admin CRUD action requires the ADMIN role.

## Notes
- IDs are auto-incrementing `Long` values (the mock API used generated string IDs like `p1`,
  `u_172...`); update the frontend to treat `id` as a number, or stringify it locally if needed.
- Booking `status` accepts `Pending`, `Confirmed`, `Cancelled` (same casing as the mock data).
- CORS is open to `http://localhost:5173` and `http://localhost:3000` by default — adjust
  `app.cors.allowed-origins` for your deployment.
- Security is fully self-contained in this service (JWT + BCrypt), unlike the ServiceEverZ
  microservices where auth lives in a separate service — this is a standalone project.
