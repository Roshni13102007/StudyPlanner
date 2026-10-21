import { useState } from "react";
import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, subjects, onToggle, onEdit, onDelete }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const shown = tasks
    .filter((t) => (status === "all" ? true : status === "done" ? t.done : !t.done))
    .filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <section className="panel">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Tasks</h2>
        <div className="d-flex gap-2">
          <input
            className="form-control form-control-sm"
            placeholder="Search tasks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search tasks"
          />
          <select
            className="form-select form-select-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="empty">
          {tasks.length === 0
            ? "No tasks yet. Add one above to get started."
            : "No tasks match your search or filter."}
        </p>
      ) : (
        <ul className="task-list">
          {shown.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              subject={subjects.find((s) => s.id === t.subjectId)}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
