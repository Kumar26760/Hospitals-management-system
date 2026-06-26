import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const emptyForm = { patientId: "", doctorId: "", appointmentDateTime: "", reason: "" };

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadData = async () => {
    const [a, p, d] = await Promise.all([
      api.get("/appointments"),
      api.get("/patients"),
      api.get("/doctors"),
    ]);
    setAppointments(a.data);
    setPatients(p.data);
    setDoctors(d.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/appointments", {
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        appointmentDateTime: form.appointmentDateTime,
        reason: form.reason,
      });
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    }
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await api.delete(`/appointments/${id}`);
    loadData();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Appointments</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={styles.row}>
            <select style={styles.input} name="patientId" value={form.patientId} onChange={handleChange} required>
              <option value="">Select Patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select style={styles.input} name="doctorId" value={form.doctorId} onChange={handleChange} required>
              <option value="">Select Doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input style={styles.input} name="appointmentDateTime" type="datetime-local" value={form.appointmentDateTime} onChange={handleChange} required />
          </div>
          <input style={styles.input} name="reason" placeholder="Reason for visit" value={form.reason} onChange={handleChange} />
          <button style={styles.button} type="submit">Book Appointment</button>
        </form>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Patient</th><th>Doctor</th><th>Date/Time</th><th>Reason</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.patient?.name}</td>
                <td>{a.doctor?.name}</td>
                <td>{a.appointmentDateTime ? a.appointmentDateTime.replace('T', ' ').substring(0, 16) : ''}</td>
                <td>{a.reason}</td>
                <td>
                  <select value={a.status} onChange={(e) => handleStatusChange(a.id, e.target.value)}>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td>
                  <button style={styles.smallDeleteButton} onClick={() => handleDelete(a.id)}>Delete</button>
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
  button: { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  smallDeleteButton: { padding: "4px 10px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
};
