import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const emptyForm = { name: "", age: "", gender: "", email: "", phone: "", address: "", bloodGroup: "" };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/patients/${editingId}`, form);
      } else {
        await api.post("/patients", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save patient");
    }
  };

  const handleEdit = (patient) => {
    setForm({ ...patient });
    setEditingId(patient.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    await api.delete(`/patients/${id}`);
    loadPatients();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Patients</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={styles.row}>
            <input style={styles.input} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input style={styles.input} name="age" placeholder="Age" type="number" value={form.age} onChange={handleChange} />
            <input style={styles.input} name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
          </div>
          <div style={styles.row}>
            <input style={styles.input} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input style={styles.input} name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <input style={styles.input} name="bloodGroup" placeholder="Blood Group" value={form.bloodGroup} onChange={handleChange} />
          </div>
          <input style={styles.input} name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <button style={styles.button} type="submit">{editingId ? "Update Patient" : "Add Patient"}</button>
          {editingId && (
            <button type="button" style={styles.cancelButton} onClick={() => { setForm(emptyForm); setEditingId(null); }}>
              Cancel
            </button>
          )}
        </form>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th><th>Age</th><th>Gender</th><th>Email</th><th>Phone</th><th>Blood Group</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.bloodGroup}</td>
                <td>
                  <button style={styles.smallButton} onClick={() => handleEdit(p)}>Edit</button>
                  <button style={styles.smallDeleteButton} onClick={() => handleDelete(p.id)}>Delete</button>
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
  row: { display: "flex", gap: "1rem" },
  input: { flex: 1, padding: "8px", margin: "6px 0", borderRadius: "4px", border: "1px solid #ccc" },
  button: { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" },
  cancelButton: { padding: "8px 16px", background: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  smallButton: { marginRight: "6px", padding: "4px 10px", background: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  smallDeleteButton: { padding: "4px 10px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
};
