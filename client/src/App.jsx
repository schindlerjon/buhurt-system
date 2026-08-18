import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import CalendarPage from "./pages/CalendarPage";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
		<Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;