# Hospital Management System

Full-stack Hospital Management System built with **Spring Boot** (backend) and **React** (frontend), with JWT-based authentication.

## Features
- User registration & login (JWT auth, roles: ADMIN, DOCTOR, USER)
- Patient management (CRUD)
- Doctor management (CRUD)
- Appointment booking (linking patients & doctors, status tracking)
- Dashboard with summary counts
- All API routes (except /api/auth/**) require a valid JWT token

## Tech Stack
- **Backend:** Spring Boot 3.3, Spring Security, Spring Data JPA, MySQL, JWT (jjwt)
- **Frontend:** React 18, React Router, Axios

---

## 1. Backend Setup

### Prerequisites
- Java 17+
- Maven
- MySQL running locally

### Steps
1. Create the database (or let it auto-create — see config below):
   ```sql
   CREATE DATABASE hospital_db;
   ```
2. Open `backend/src/main/resources/application.properties` and update:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Run the app:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. Backend runs at: `http://localhost:8080`

Tables are auto-created via `spring.jpa.hibernate.ddl-auto=update` — no manual schema needed.

---

## 2. Frontend Setup

### Prerequisites
- Node.js 18+ and npm

### Steps
```bash
cd frontend
npm install
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 3. Using the App

1. Go to `http://localhost:3000/register` and create an account (choose role: USER, DOCTOR, or ADMIN).
2. Log in at `http://localhost:3000/login`.
3. You'll land on the Dashboard. Use the navbar to manage Patients, Doctors, and Appointments.

---

## API Endpoints (for reference)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login, returns JWT |
| GET/POST | /api/patients | List / create patients |
| PUT/DELETE | /api/patients/{id} | Update / delete a patient |
| GET/POST | /api/doctors | List / create doctors |
| PUT/DELETE | /api/doctors/{id} | Update / delete a doctor |
| GET/POST | /api/appointments | List / create appointments |
| PUT | /api/appointments/{id}/status | Update appointment status |
| DELETE | /api/appointments/{id} | Delete an appointment |

All endpoints except `/api/auth/**` require header:
```
Authorization: Bearer <token>
```

## Project Structure
```
hospital-management/
├── backend/      # Spring Boot REST API
└── frontend/     # React app
```
