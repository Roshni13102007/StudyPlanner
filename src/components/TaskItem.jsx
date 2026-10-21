export default function TaskItem({ task, subject, onToggle, onEdit, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  const overdue = !task.done && task.dueDate < today;
  const dueLabel = new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"?`)) onDelete(task.id);
  }

  return (
    <li className={`task ${task.done ? "done" : ""}`}>
      <span className="task-bar" style={{ background: subject?.color ?? "#9aa5a1" }} />
      <input
        type="checkbox"
        className="form-check-input task-check"
        checked={task.done}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.done ? "not done" : "done"}`}
      />
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span>{subject?.name ?? "Unknown subject"}</span>
          <span className={overdue ? "overdue" : ""}>
            {overdue ? "Overdue, was due " : "Due "}
            {dueLabel}
          </span>
          <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span>
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)}>Edit</button>
        <button className="icon-btn danger" onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
}
