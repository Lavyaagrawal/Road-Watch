# RoadWatch 📍

**Smart Civic Infrastructure — Real-Time Road Hazard Reporting & Management System**

RoadWatch is a beautiful full-stack web application designed for citizens to report dangerous road hazards (potholes, broken signals, waterlogging, cracks) in real-time. City administrators can view the reports on an interactive map, track coordinates, navigate directly via Google Maps integration, and manage their repair statuses (Pending, In Progress, Resolved).

---

## 🚀 Key Features

* **Real-Time GPS Geolocation**: Queries the browser's HTML5 Geolocation API on report creation to capture highly accurate coordinates, falling back gracefully to mock locations near Pune if denied.
* **Interactive Live Map**: Renders all reported incidents on a beautiful dark-themed **React Leaflet** map, complete with custom popups showing pictures and descriptions.
* **Admin Dashboard Control**: Displays complete incident report metadata, user emails, captured coordinates, and one-click status transitions.
* **Google Maps Integration**: Deep-links reports directly to Google Maps coordinates so field maintenance crews can route to the hazard instantly.
* **Free Hybrid Persistence Layer**: Uses a lightweight **SQLite database file** (`roadwatch.db`) locally in development, and automatically scales to a cloud **PostgreSQL pool** when deployed in production.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite 8, Tailwind CSS, React Leaflet (OpenStreetMap).
* **Backend**: Node.js, Express.
* **Database**: SQLite (Development) / PostgreSQL (Production via `pg`).
* **Authentication**: Firebase Authentication (Spark Plan - 100% Free Tier).
* **Process Management**: `concurrently` (boots both frontend & backend with one script).

---

## 📦 How to Run Locally

We have configured a concurrent startup script so you can spin up the full-stack architecture with a single command.

### Step 1: Install Dependencies
Ensure you have all dependencies installed for both the React frontend and the backend Express server:
```bash
# Install frontend packages (Vite, Leaflet, concurrently, Tailwind)
npm install

# Install server packages (Express, SQLite3, PostgreSQL driver)
cd server
npm install
cd ..
```

### Step 2: Boot Up Both Servers
Run the main development script in the root directory:
```bash
npm run dev
```
*This single command starts your **Vite React frontend** on `http://localhost:5173` and the **Express backend server** on `http://localhost:5001` (avoiding default macOS AirPlay port conflicts), automatically creating the SQLite `roadwatch.db` file in `/server`.*

---

## ☁️ Cloud Deployment Configuration

This project is pre-configured and cloud-ready for **Vercel** (frontend) and **Render** (backend):

1. **Frontend (Vercel)**:
   * Connect your GitHub repository to Vercel.
   * Select the root folder as `roadwatch` and configure the **Framework Preset** as `Vite`.
   * Set the environment variable `VITE_API_URL` to point to your deployed Render API (e.g. `https://your-app.onrender.com/api/issues`).
   * *The root `vercel.json` file is pre-configured to handle Single Page Application (SPA) client routes on reload.*

2. **Backend API & Database (Render)**:
   * Create a free **PostgreSQL database** on Render and copy its External Database Connection string.
   * Create a free **Web Service** on Render, set the root directory as `roadwatch/server`, and configure the environment variable `DATABASE_URL` pointing to your database connection string.
   * *The server will automatically detect `DATABASE_URL`, connect to the cloud Postgres instance, and auto-migrate the table schema.*

