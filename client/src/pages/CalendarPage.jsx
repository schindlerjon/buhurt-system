import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <div>
      <h1>Events Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}

export default CalendarPage;