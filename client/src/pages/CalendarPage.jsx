import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useAuth } from "../context/AuthContext";
import AddEventForm from "../components/AddEventForm";
import "./CalendarPage.css";

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  function loadEvents() {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => {
        const formatted = data.map((event) => ({
          title: event.team_name ? `${event.title} (${event.team_name})` : event.title,
          start: event.start_time,
          end: event.end_time,
        }));
        setEvents(formatted);
      })
      .catch((error) => console.error("Failed to load events:", error));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div>
      <h1>Events Calendar</h1>

      {user?.role === "admin" && <AddEventForm onEventCreated={loadEvents} />}

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}

export default CalendarPage;