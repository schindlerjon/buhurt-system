const button = document.getElementById("helloButton");

button.addEventListener("click", () => {

    alert("Welcome to the Buhurt Management System!");

});

const loggedOutView = document.getElementById("logged-out-view");
const loggedInView = document.getElementById("logged-in-view");
const authMessage = document.getElementById("auth-message");

// Checks the server for current login status and updates the page accordingly
async function checkAuthStatus() {
    const response = await fetch("/api/me");
    const data = await response.json();

    if (data.user) {
        loggedOutView.style.display = "none";
        loggedInView.style.display = "block";
        document.getElementById("user-email").textContent = data.user.email;
        document.getElementById("user-role").textContent = data.user.role;
    } else {
        loggedOutView.style.display = "block";
        loggedInView.style.display = "none";
    }
}

document.getElementById("register-btn").addEventListener("click", async () => {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;

    const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        authMessage.textContent = "Registered! Now log in.";
    } else {
        authMessage.textContent = data.error;
    }
});

document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        checkAuthStatus();
    } else {
        authMessage.textContent = data.error;
    }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    checkAuthStatus();
});

// Run this once when the page first loads, to reflect whether you're already logged in
checkAuthStatus();



// Initialize the map, centered roughly on Texas, zoomed out enough to see the whole state
const map = L.map("map").setView([31.0, -99.0], 6);

// Fix Leaflet's default marker icons not loading correctly from the CDN
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
    iconUrl: "leaflet/images/marker-icon.png",
    shadowUrl: "leaflet/images/marker-shadow.png",
});

// Add the actual visual map tiles (the imagery itself) from OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Fetch team data from our own server's API, then place a marker for each team
fetch("/api/teams")
    .then((response) => response.json())
    .then((teams) => {
        teams.forEach((team) => {
            L.marker([team.latitude, team.longitude])
                .addTo(map)
                .bindPopup(`<strong>${team.name}</strong><br>${team.city}, ${team.state}`);
        });
    })
    .catch((error) => {
        console.error("Failed to load teams:", error);
    });
	
	