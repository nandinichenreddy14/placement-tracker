import { useState } from "react";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const STATUSES = ["SOLVED", "REVISIT"];

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function ProblemForm({ initialValues, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [platform, setPlatform] = useState(initialValues?.platform || "");
  const [difficulty, setDifficulty] = useState(initialValues?.difficulty || "EASY");
  const [topic, setTopic] = useState(initialValues?.topic || "");
  const [status, setStatus] = useState(initialValues?.status || "SOLVED");
  const [link, setLink] = useState(initialValues?.link || "");
  const [notes, setNotes] = useState(initialValues?.notes || "");
  const [date, setDate] = useState(toDateInputValue(initialValues?.date));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        platform,
        difficulty,
        topic,
        status,
        link: link || undefined,
        notes: notes || undefined,
        ...(date ? { date } : {}),
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save problem");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Platform
        <input
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="LeetCode, GFG, ..."
          required
        />
      </label>
      <label>
        Difficulty
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label>
        Topic
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Arrays, DP, ..."
          required
        />
      </label>
      <label>
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Link
        <input value={link} onChange={(e) => setLink(e.target.value)} type="url" />
      </label>
      <label>
        Date
        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
      </label>
      <label>
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </label>
      {error && <p className="error-text">{error}</p>}
      <div className="card-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProblemForm;
