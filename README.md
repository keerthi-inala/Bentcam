# Bentcam Monorepo

This repository contains:
- `client/` — React frontend (Create React App)
- `backend/` — Java Spring Boot API

## Prerequisites
- Node.js 16+
- Java 17+
- Maven 3.9+

## Run locally
### Database (PostgreSQL)
You can run Postgres locally via Docker:
```powershell
docker run --name bentcam-postgres -e POSTGRES_PASSWORD=devpass -e POSTGRES_USER=bentcam -e POSTGRES_DB=bentcam -p 5442:5432 -d postgres:16
```
Connection defaults (override in env for prod/CI):
```
JDBC URL: jdbc:postgresql://localhost:5442/bentcam
Username: bentcam
Password: devpass
```

### Backend
```powershell
cd backend
mvn spring-boot:run
```
API base: `http://localhost:8080`
- Health: `GET /api/health`

### Backend Stack & Architecture
- Java: 17 (see [backend/pom.xml](backend/pom.xml)).
- Frameworks: Spring Boot 3.3.4 (Web, Data JPA, Validation).
- Database: PostgreSQL; connection in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).
- Migrations: Flyway (see [backend/src/main/resources/db/migration](backend/src/main/resources/db/migration)).
- Security: BCrypt hashing via spring-security-crypto; simple in-memory token service (no Spring Security filters).
- CORS: Allows http://localhost:3000 (see [backend/src/main/java/com/bentcam/config/CorsConfig.java](backend/src/main/java/com/bentcam/config/CorsConfig.java)).
- Static files: /uploads/** served from local uploads/ directory (see [backend/src/main/java/com/bentcam/config/StaticResourceConfig.java](backend/src/main/java/com/bentcam/config/StaticResourceConfig.java)).

### Configuration
- Port: 8080.
- Datasource: jdbc:postgresql://localhost:5442/bentcam, user bentcam, password devpass.
- JPA: hibernate.ddl-auto=validate (schema from Flyway).
- Flyway: enabled, location classpath:db/migration.
- Admin bootstrap (dev): app.admin.email, app.admin.password used by DataInitializer.

#### Auth Endpoints
- Register: `POST /api/auth/register`
	- Request JSON:
		```json
		{ "email": "user@example.com", "password": "Secret123", "name": "User" }
		```
	- Responses:
		- `201 Created`: `{ "id": 1, "email": "user@example.com", "name": "User", "role": "user" }`
		- `409 Conflict`: `{ "message": "Email already registered" }`

- Login: `POST /api/auth/login`
	- Request JSON:
		```json
		{ "email": "user@example.com", "password": "Secret123" }
		```
	- Responses:
		- `200 OK`: `{ "message": "Login successful", "token": "...", "user": { "id": 1, "email": "user@example.com", "name": "User", "role": "user" } }`
		- `401 Unauthorized`: `{ "message": "Invalid credentials" }`

- Logout: `POST /api/auth/logout`
	- Requires header: `Authorization: Bearer <token>`
	- Responses:
		- `204 No Content` (revoked)
		- `401 Unauthorized` (missing/invalid header)

Token expiry: UUID tokens expire after `app.auth.token-ttl-minutes` (default `120`). Expired tokens are invalidated automatically.

#### Admin Product CRUD
- Requires header: `Authorization: Bearer <token>` (token returned from login for admin users)

- Create: `POST /api/admin/products`
	- Body:
		```json
		{ "name": "Motor X", "part": "PART-001", "price": 199.99, "description": "High torque", "imageUrl": "https://...", "menu": "motors-components" }
		```
	- Responses:
		- `201 Created`: product JSON
		- `401 Unauthorized`: `{ "message": "Unauthorized" }`
		- `409 Conflict`: `{ "message": "Part already exists" }`

- Update: `PUT /api/admin/products/{id}`
	- Body: any subset of fields above
	- Responses: `200 OK` with updated product or `404 Not found`

- Delete: `DELETE /api/admin/products/{id}`
	- Responses: `204 No Content` or `404 Not found`

- Public list: `GET /api/products`
- Public detail: `GET /api/products/{id}`
 - Products support a `menu` field which is a category slug (e.g., `motors-components`).

#### Menus & Categories
- Menus:
  - Public: `GET /api/menus`
  - Admin: `POST /api/admin/menus`, `PUT /api/admin/menus/{id}`, `DELETE /api/admin/menus/{id}`
- Categories:
  - Public: `GET /api/menus/{slug}/categories`
  - Admin: `POST /api/admin/menus/{slug}/categories`, `PUT /api/admin/categories/{id}`, `DELETE /api/admin/categories/{id}`

#### Uploads
- Admin: `POST /api/admin/upload` (multipart `file`) → returns `{ "url": "/uploads/{filename}", "filename": "..." }`
- Static files served at `/uploads/**`.

## End-to-End Demo (Quickstart)
1. Start PostgreSQL (Docker):
	```powershell
	docker run --name bentcam-postgres -e POSTGRES_PASSWORD=devpass -e POSTGRES_USER=bentcam -e POSTGRES_DB=bentcam -p 5442:5432 -d postgres:16
	```
2. Start Backend (Maven or VS Code Task):
	```powershell
	mvn -f backend/pom.xml spring-boot:run
	```
3. Health check:
	```powershell
	curl http://localhost:8080/api/health
	```
4. Login as admin (seeded via properties):
	```powershell
	curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"AdminSecret123"}'
	```
	Save the `token` from response.
5. Create menu, category, upload image, create product:
	```powershell
	$TOKEN="paste-token"
	curl -X POST http://localhost:8080/api/admin/menus -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"Motors","slug":"motors"}'
	curl -X POST http://localhost:8080/api/admin/menus/motors/categories -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"Fan Motors","slug":"fan-motors"}'
	curl -X POST http://localhost:8080/api/admin/upload -H "Authorization: Bearer $TOKEN" -F "file=@c:\\path\\to\\image.avif"
	# Use returned URL as imageUrl
	curl -X POST http://localhost:8080/api/admin/products -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"E205492IN","part":"E205492IN","price":199.99,"menu":"motors","category":"fan-motors","imageUrl":"/uploads/xyz.avif"}'
	```
6. Public reads:
	```powershell
	curl http://localhost:8080/api/menus
	curl http://localhost:8080/api/menus/motors/categories
	curl http://localhost:8080/api/products
	```

### Frontend
```powershell
cd client
npm install
npm start
```
Runs on `http://localhost:3000`. CRA proxy forwards `/api/*` to backend.

Login/Register pages call the backend auth APIs via the proxy.

### Test health via frontend proxy
Open `http://localhost:3000/api/health`

## Notes
- CORS is configured to allow `http://localhost:3000`.
- Update `CorsConfig` for additional origins.
