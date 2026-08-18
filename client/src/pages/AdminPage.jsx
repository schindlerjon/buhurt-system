import { useState, useEffect } from "react";
import "./AdminPage.css";
import "../components/Button.css";

function AdminPage() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTeam, setNewTeam] = useState({ name: "", city: "", state: "", latitude: "", longitude: "" });
  const [message, setMessage] = useState("");

  function loadTeams() {
    fetch("/api/teams").then((r) => r.json()).then(setTeams);
  }

  function loadUsers() {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }

  useEffect(() => {
    loadTeams();
    loadUsers();
  }, []);

  async function handleCreateTeam() {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newTeam,
        latitude: parseFloat(newTeam.latitude),
        longitude: parseFloat(newTeam.longitude),
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Team created.");
      setNewTeam({ name: "", city: "", state: "", latitude: "", longitude: "" });
      loadTeams();
    } else {
      setMessage(data.error);
    }
  }

  async function handleDeleteTeam(id) {
    await fetch(`/api/teams/${id}`, { method: "DELETE" });
    loadTeams();
  }

  async function handleRoleChange(userId, newRole) {
    await fetch(`/api/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    loadUsers();
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Teams</h2>
        <div className="admin-form">
          <input placeholder="Name" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} />
          <input placeholder="City" value={newTeam.city} onChange={(e) => setNewTeam({ ...newTeam, city: e.target.value })} />
          <input placeholder="State" value={newTeam.state} onChange={(e) => setNewTeam({ ...newTeam, state: e.target.value })} />
          <input placeholder="Latitude" value={newTeam.latitude} onChange={(e) => setNewTeam({ ...newTeam, latitude: e.target.value })} />
          <input placeholder="Longitude" value={newTeam.longitude} onChange={(e) => setNewTeam({ ...newTeam, longitude: e.target.value })} />
          <button className="btn-ember" onClick={handleCreateTeam}>Add Team</button>
        </div>
        {message && <p className="admin-message">{message}</p>}

        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>City</th><th>State</th><th></th></tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.city}</td>
                <td>{team.state}</td>
                <td><button onClick={() => handleDeleteTeam(team.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Users</h2>
        <table className="admin-table">
          <thead>
            <tr><th>Email</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                    <option value="member">member</option>
                    <option value="captain">captain</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminPage;