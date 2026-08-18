import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import CalendarPage from "./pages/CalendarPage";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" 		element={<Home />} />
        <Route path="/map" 		element={<MapPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
		<Route path="/login" 	element={<Login />} />
		<Route path="/admin" 	element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;