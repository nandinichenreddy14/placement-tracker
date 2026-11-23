function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString();
}

function CompanyCard({ company, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-row">
        <div>
          <h3>{company.name}</h3>
          <p>
            {company.role} · {company.status}
            {company.interviewDate && ` · Interview: ${formatDate(company.interviewDate)}`}
          </p>
          {company.notes && <p>{company.notes}</p>}
        </div>
        <div className="card-actions">
          <button type="button" className="secondary" onClick={() => onEdit(company)}>
            Edit
          </button>
          <button type="button" className="danger" onClick={() => onDelete(company.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyCard;
