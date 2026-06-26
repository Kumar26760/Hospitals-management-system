import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🏥 HMS</div>
      <div style={styles.links}>
        <Link style={styles.link} to="/dashboard">Dashboard</Link>
        <Link style={styles.link} to="/patients">Patients</Link>
        <Link style={styles.link} to="/doctors">Doctors</Link>
        <Link style={styles.link} to="/appointments">Appointments</Link>
      </div>
      <div>
        <span style={{ marginRight: "1rem" }}>{user?.username} ({user?.role})</span>
        <button style={styles.button} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#1e3a8a", color: "white" },
  brand: { fontWeight: "bold", fontSize: "1.2rem" },
  links: { display: "flex", gap: "1.5rem" },
  link: { color: "white", textDecoration: "none" },
  button: { padding: "6px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
};
