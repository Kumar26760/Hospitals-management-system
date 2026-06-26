import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const emptyForm = { name: "", specialization: "", email: "", phone: "", department: "", available: true };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadDoctors = async () => {
    const res = await api.get("/doctors");
    setDoctors(res.data);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/doctors/${editingId}`, form);
      } else {
        await api.post("/doctors", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadDoctors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save doctor");
    }
  };

  const handleEdit = (doctor) => {
    setForm({ ...doctor });
    setEditingId(doctor.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await api.delete(`/doctors/${id}`);
    loadDoctors();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Doctors</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={styles.row}>
            <input style={styles.input} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input style={styles.input} name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} />
            <input style={styles.input} name="department" placeholder="Department" value={form.department} onChange={handleChange} />
          </div>
          <div style={styles.row}>
            <input style={styles.input} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input style={styles.input} name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Available
            </label>
          </div>
          <button style={styles.button} type="submit">{editingId ? "Update Doctor" : "Add Doctor"}</button>
          {editingId && (
            <button type="button" style={styles.cancelButton} onClick={() => { setForm(emptyForm); setEditingId(null); }}>
              Cancel
            </button>
          )}
        </form>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th><th>Specialization</th><th>Department</th><th>Email</th><th>Phone</th><th>Available</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.specialization}</td>
                <td>{d.department}</td>
                <td>{d.email}</td>
                <td>{d.phone}</td>
                <td>{d.available ? "Yes" : "No"}</td>
                <td>
                  <button style={styles.smallButton} onClick={() => handleEdit(d)}>Edit</button>
                  <button style={styles.smallDeleteButton} onClick={() => handleDelete(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px" },
  form: { background: "white", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  row: { display: "flex", gap: "1rem", alignItems: "center" },
  input: { flex: 1, padding: "8px", margin: "6px 0", borderRadius: "4px", border: "1px solid #ccc" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" },
  button: { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" },
  cancelButton: { padding: "8px 16px", background: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  smallButton: { marginRight: "6px", padding: "4px 10px", background: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  smallDeleteButton: { padding: "4px 10px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
};
