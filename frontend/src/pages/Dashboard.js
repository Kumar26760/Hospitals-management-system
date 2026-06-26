import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Dashboard() {
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [p, d, a] = await Promise.all([
          api.get("/patients"),
          api.get("/doctors"),
          api.get("/appointments"),
        ]);
        setCounts({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length });
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Dashboard</h2>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>{counts.patients}</h3>
            <p>Patients</p>
          </div>
          <div style={styles.card}>
            <h3>{counts.doctors}</h3>
            <p>Doctors</p>
          </div>
          <div style={styles.card}>
            <h3>{counts.appointments}</h3>
            <p>Appointments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px" },
  cards: { display: "flex", gap: "1.5rem", marginTop: "1.5rem" },
  card: { background: "white", padding: "1.5rem 2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center", minWidth: "150px" },
};
