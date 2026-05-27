import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import MapPage from "./pages/MapPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={<Admin />}
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;