function ProblemCard({ problem, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-row">
        <div>
          <h3>
            {problem.link ? (
              <a href={problem.link} target="_blank" rel="noreferrer">
                {problem.title}
              </a>
            ) : (
              problem.title
            )}
          </h3>
          <p>
            {problem.platform} · {problem.difficulty} · {problem.topic} · {problem.status}
          </p>
          {problem.notes && <p>{problem.notes}</p>}
        </div>
        <div className="card-actions">
          <button type="button" className="secondary" onClick={() => onEdit(problem)}>
            Edit
          </button>
          <button type="button" className="danger" onClick={() => onDelete(problem.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemCard;
