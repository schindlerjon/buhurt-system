const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();

const PORT = 4000;

app.use(express.json()); // lets Express read JSON sent from the browser (needed for login/register forms)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // session lasts 24 hours
}));

// Role-Checking Gatekeeper
/*
 TODO: Add Admin ONLY Functions
app.delete("/api/teams/:id", requireRole("admin"), async (req, res) => {
  // ...
});
*/

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not logged in" });
    }
    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    next();
  };
}


// -- PATHS/ROUTES -- 

// Register a new user (defaults to role "member")
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role",
      [email, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") { // Postgres code for "unique violation"
      return res.status(409).json({ error: "Email already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Log in an existing user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store minimal info in the session - never the password hash
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ message: "Logged in", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Log out
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

// Check who's currently logged in (useful for your frontend later)
app.get("/api/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

app.get("/hello", (req, res) => {

    res.send("Hello from the server!");

});

app.get("/about", (req, res) => {

    res.send("Welcome to the Buhurt Management System API");

});

app.get("/api/teams", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM teams");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});


// Get all events (public - anyone can view the calendar)
app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT events.*, teams.name AS team_name FROM events LEFT JOIN teams ON events.team_id = teams.id ORDER BY start_time"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Create a new event (admin only, for now)
app.post("/api/events", requireRole("admin"), async (req, res) => {
  const { title, description, location, start_time, end_time, team_id } = req.body;

  if (!title || !start_time) {
    return res.status(400).json({ error: "Title and start time are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO events (title, description, location, start_time, end_time, team_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, location, start_time, end_time || null, team_id || null, req.session.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});





app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});