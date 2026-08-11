import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="site-nav">
      <Link to="/">Home</Link>
      <Link to="/map">Team Map</Link>
      <Link to="/calendar">Events</Link>
    </nav>
  );
}

export default NavBar;