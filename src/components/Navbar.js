import { Link, NavLink, useNavigate } from "react-router-dom"; 
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("role"); // set on login

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>KenmaticsStore</Link>

      <nav className={styles.nav}>
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Home
        </NavLink>

        {/* Login / Register for guests */}
        {!token && (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Login
          </NavLink>
        )}

        {!token && (
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Register
          </NavLink>
        )}

        {/* User Dashboard */}
        {token && role === "user" && (
          <NavLink
            to="/user-dashboard"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            My Dashboard
          </NavLink>
        )}

        {/* Admin Dashboard */}
        {token && role === "admin" && (
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Admin
          </NavLink>
        )}

        {/* Manager Dashboard */}
        {token && role === "manager" && (
          <NavLink
            to="/manager-dashboard"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Manager
          </NavLink>
        )}

        {/* Checkout → ONLY visible for logged-in USER */}
        {token && role === "user" && (
          <NavLink
            to="/checkout"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Checkout
          </NavLink>
        )}
      </nav>

      {/* Logout / CTA */}
      {token ? (
        <button onClick={logout} className={styles.logoutBtn}>
          Logout
        </button>
      ) : (
        <Link to="/login" className={styles.cta}>
          Shop Now
        </Link>
      )}
    </header>
  );
}
