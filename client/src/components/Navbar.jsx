import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/problems">Problems</Link>
      <Link to="/companies">Companies</Link>
      <span className="navbar-spacer" />
      <span className="navbar-email">{user.email}</span>
      <button type="button" className="secondary" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
