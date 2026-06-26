import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(username, email, password, role);
      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>Hospital Management System</h2>
        <h3>Register</h3>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <input style={styles.input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input style={styles.input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select style={styles.input} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">User</option>
          <option value="DOCTOR">Doctor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button style={styles.button} type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f4f8" },
  form: { background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "320px" },
  input: { display: "block", width: "100%", padding: "10px", margin: "10px 0", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" },
  button: { width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  error: { color: "red" },
  success: { color: "green" },
};
