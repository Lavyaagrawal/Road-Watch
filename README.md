# RoadWatch 📍

**Smart Civic Infrastructure — Real-Time Road Hazard Reporting & Management System**

RoadWatch is a full-stack web application designed for citizens to report dangerous road hazards (potholes, broken signals, waterlogging, cracks) in real-time. City administrators can view reports on an interactive map, track coordinates, navigate via Google Maps integration, and manage repair statuses.

🌐 **Live Deployed App**: [https://road-watch-pi.vercel.app/](https://road-watch-pi.vercel.app/)

---

## 🚀 Key Features

* **Real-Time GPS Geolocation**: Captures coordinates via the HTML5 Geolocation API on report creation, with a fallback near Pune.
* **Interactive Live Map**: Renders reported incidents on a dark-themed **React Leaflet** map with custom popups showing images and descriptions.
* **Admin Dashboard**: Displays complete incident metadata, reporter email, captured coordinates, and one-click status transitions.
* **Google Maps Integration**: Deep-links reports to Google Maps for field crews to route to the hazard instantly.
* **Hybrid Database Support**: SQLite for local development and PostgreSQL for production.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite 8, Tailwind CSS, React Leaflet (OpenStreetMap)
* **Backend**: Node.js, Express
* **Database**: SQLite (Development) / PostgreSQL (Production)
* **Authentication**: Firebase Authentication
* **Process Management**: `concurrently` (boots both frontend & backend with one script)

---

## 📦 How to Run Locally

### Step 1: Install Dependencies
```bash
# Install frontend packages
npm install

# Install server packages
cd server
npm install
cd ..
```

### Step 2: Run Development Servers
```bash
npm run dev
```
Starts the Vite frontend on `http://localhost:5173` and the Express server on `http://localhost:5001`.
