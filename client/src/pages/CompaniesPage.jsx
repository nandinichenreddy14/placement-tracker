import { useEffect, useState } from "react";
import api from "../api/client.js";
import CompanyForm from "../components/CompanyForm.jsx";
import CompanyCard from "../components/CompanyCard.jsx";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  async function fetchCompanies() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/companies", { params });
      setCompanies(res.data);
    } catch {
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  function openCreateForm() {
    setEditingCompany(null);
    setShowForm(true);
  }

  function openEditForm(company) {
    setEditingCompany(company);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingCompany(null);
  }

  async function handleSubmit(data) {
    if (editingCompany) {
      await api.put(`/companies/${editingCompany.id}`, data);
    } else {
      await api.post("/companies", data);
    }
    closeForm();
    await fetchCompanies();
  }

  async function handleDelete(id) {
    await api.delete(`/companies/${id}`);
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="page">
      <h1>Companies</h1>

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="WISHLIST">WISHLIST</option>
          <option value="APPLIED">APPLIED</option>
          <option value="OA">OA</option>
          <option value="INTERVIEW">INTERVIEW</option>
          <option value="OFFER">OFFER</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <button type="button" onClick={openCreateForm}>
          Add Company
        </button>
      </div>

      {showForm && (
        <CompanyForm
          key={editingCompany?.id || "new"}
          initialValues={editingCompany}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && companies.length === 0 && <p>No companies yet.</p>}

      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default CompaniesPage;
