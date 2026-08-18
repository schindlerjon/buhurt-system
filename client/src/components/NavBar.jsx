import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function NavBar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="site-nav">
	 <span className="brand">TEXAS BUHURT</span>
		<div>
			<Link to="/">Home</Link>
			<Link to="/map">Team Map</Link>
			<Link to="/calendar">Events</Link>

			{!loading && (
				<div className="nav-auth">
				{user ? (
					<>
					<span>{user.email} ({user.role}) </span>
					{user.role === "admin" && <Link to="/admin">Admin</Link>}
					<button onClick={logout}>Log Out</button>
					</>
				) : (
					<Link to="/login">Log In / Register</Link>
				)}
				</div>
			)}
		</div>		
    </nav>
  );
}

export default NavBar;