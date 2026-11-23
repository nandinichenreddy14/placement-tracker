import { useState } from "react";

const STATUSES = ["WISHLIST", "APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"];

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function CompanyForm({ initialValues, onSubmit, onCancel }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [role, setRole] = useState(initialValues?.role || "");
  const [status, setStatus] = useState(initialValues?.status || "WISHLIST");
  const [interviewDate, setInterviewDate] = useState(
    toDateInputValue(initialValues?.interviewDate),
  );
  const [notes, setNotes] = useState(initialValues?.notes || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        role,
        status,
        interviewDate: interviewDate || null,
        notes: notes || undefined,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save company");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Role
        <input value={role} onChange={(e) => setRole(e.target.value)} required />
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
        Interview date
        <input
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          type="date"
        />
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

export default CompanyForm;
