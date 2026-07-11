# auth-service

A minimal, standalone Spring Boot skeleton that does exactly one job: **login and logout with JWT**, backed by MySQL. No Lombok, no Builder pattern — explicit constructors, getters, and setters throughout, consistent with the rest of the ServiceEverZ/Wayfarer backend services.

## Stack

- Spring Boot 3.2.5, Java 17
- Spring Security (stateless, JWT-based)
- Spring Data JPA + MySQL
- JJWT 0.12.5 for token generation/validation
- No Lombok, no Builder pattern

## What's in scope (and what isn't)

This is a **skeleton** — it only handles authentication:

- `POST /api/auth/login` — validates credentials against MySQL, returns a JWT
- `POST /api/auth/logout` — blacklists the current JWT so it can't be reused before it expires

It does **not** include registration, password reset, or role/permission management endpoints — wire those into this service or call it from your other microservices as needed. The `User` entity and `UserRepository` are there to build on.

## Setup

1. Create the database (or let Hibernate do it — `createDatabaseIfNotExist=true` is already set):
   ```sql
   CREATE DATABASE wayfarer_auth;
   ```
   `schema-reference.sql` is included if you'd rather hand this to a DBA or run it by hand; `ddl-auto=update` will create/update the tables automatically either way.

2. Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

3. **Replace the JWT secret** before running this anywhere beyond your laptop:
   ```properties
   app.jwt.secret=CHANGE_ME_this_is_a_placeholder_secret_key_replace_before_deploying_32bytes_min
   ```

4. Run it:
   ```bash
   mvn spring-boot:run
   ```
   Service starts on `http://localhost:8081`.

## Seeded accounts

On first startup, `DataSeeder` creates two accounts if they don't already exist:

| Username | Password  | Role  |
|----------|-----------|-------|
| `admin`  | `admin123`| ADMIN |
| `demo`   | `demo1234`| USER  |

## Trying it out

**Login**
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresInSeconds": 3600,
  "username": "admin",
  "role": "ADMIN"
}
```

**Logout** (requires the token from login)
```bash
curl -X POST http://localhost:8081/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

Response:
```json
{ "message": "Logged out successfully" }
```

Once a token is used to log out, `JwtAuthenticationFilter` will reject it on any subsequent request even though it hasn't naturally expired yet — it's checked against the `blacklisted_tokens` table.

## Folder structure

```
src/main/java/com/wayfarer/authservice/
 ├── config/          SecurityConfig, DataSeeder
 ├── controller/       AuthController
 ├── service/         AuthService
 ├── entity/          User, Role, BlacklistedToken
 ├── repository/       UserRepository, BlacklistedTokenRepository
 ├── dto/              LoginRequest, LoginResponse, MessageResponse, ApiErrorResponse
 ├── security/        JwtUtil, JwtAuthenticationFilter, AuthenticatedUser,
 │                     UserDetailsServiceImpl, TokenBlacklistService
 └── exception/        InvalidCredentialsException, GlobalExceptionHandler
```

## Notes on how logout works with JWT

JWTs are stateless by design, so "logging out" isn't a native concept — the token stays valid until it expires whether or not the server "remembers" the session. This skeleton handles that the standard way: a `blacklisted_tokens` table in MySQL records tokens that have been explicitly logged out, and `JwtAuthenticationFilter` checks every incoming token against that table in addition to checking its signature and expiry. A scheduled job (`TokenBlacklistService.purgeExpiredTokens`, hourly) deletes blacklisted rows once their token would have expired naturally anyway, so the table doesn't grow forever.
