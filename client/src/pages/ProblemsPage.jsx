import { useEffect, useState } from "react";
import api from "../api/client.js";
import ProblemForm from "../components/ProblemForm.jsx";
import ProblemCard from "../components/ProblemCard.jsx";

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  async function fetchProblems() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (difficultyFilter) params.difficulty = difficultyFilter;
      if (statusFilter) params.status = statusFilter;
      if (topicFilter) params.topic = topicFilter;
      const res = await api.get("/problems", { params });
      setProblems(res.data);
    } catch {
      setError("Failed to load problems");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyFilter, statusFilter, topicFilter]);

  function openCreateForm() {
    setEditingProblem(null);
    setShowForm(true);
  }

  function openEditForm(problem) {
    setEditingProblem(problem);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProblem(null);
  }

  async function handleSubmit(data) {
    if (editingProblem) {
      await api.put(`/problems/${editingProblem.id}`, data);
    } else {
      await api.post("/problems", data);
    }
    closeForm();
    await fetchProblems();
  }

  async function handleDelete(id) {
    await api.delete(`/problems/${id}`);
    setProblems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="page">
      <h1>Problems</h1>

      <div className="filters">
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option value="">All difficulties</option>
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="SOLVED">SOLVED</option>
          <option value="REVISIT">REVISIT</option>
        </select>
        <input
          placeholder="Filter by topic"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        />
        <button type="button" onClick={openCreateForm}>
          Add Problem
        </button>
      </div>

      {showForm && (
        <ProblemForm
          key={editingProblem?.id || "new"}
          initialValues={editingProblem}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && problems.length === 0 && <p>No problems yet.</p>}

      {problems.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default ProblemsPage;
