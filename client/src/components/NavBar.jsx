import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./NavBar.css";

function NavBar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="site-nav">
      <Link to="/">Home</Link>
      <Link to="/map">Team Map</Link>
      <Link to="/calendar">Events</Link>

      {!loading && (
        <div className="nav-auth">
          {user ? (
            <>
              <span>{user.email} ({user.role})</span>
              <button onClick={logout}>Log Out</button>
            </>
          ) : (
            <Link to="/login">Log In / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;