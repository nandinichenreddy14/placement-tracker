import { useEffect, useState } from "react";
import api from "../api/client.js";

function StatList({ title, rows, labelKey }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <div className="stat-list">
          {rows.map((row) => (
            <div className="stat-row" key={row[labelKey]}>
              <span>{row[labelKey]}</span>
              <span>{row.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {data && (
        <div className="stats-grid">
          <StatList
            title="Problems by Difficulty"
            rows={data.problemsByDifficulty}
            labelKey="difficulty"
          />
          <StatList title="Problems by Topic" rows={data.problemsByTopic} labelKey="topic" />
          <StatList
            title="Companies by Status"
            rows={data.companiesByStatus}
            labelKey="status"
          />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
