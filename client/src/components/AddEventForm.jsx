import { useState } from "react";

function AddEventForm({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    if (!title || !startTime) {
      setMessage("Title and start time are required.");
      return;
    }

    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        location,
        start_time: startTime,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Event created!");
      setTitle("");
      setLocation("");
      setStartTime("");
      onEventCreated(); // tell the parent page to refresh its event list
    } else {
      setMessage(data.error);
    }
  }

  return (
    <div className="add-event-form">
      <h3>Add New Event</h3>
      <input
        type="text"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <button onClick={handleSubmit}>Create Event</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddEventForm;