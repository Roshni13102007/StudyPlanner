import { useState } from "react";

export default function SubjectPanel({
  subjects, tasks, selectedId, onSelect, onAdd, onEdit, onDelete,
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0f766e");
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  function resetForm() {
    setName("");
    setColor("#0f766e");
    setEditingId(null);
    setFormError("");
  }

  function startEdit(subject) {
    setEditingId(subject.id);
    setName(subject.name);
    setColor(subject.color);
    setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setFormError("Subject name needs at least 2 characters.");
      return;
    }
    const duplicate = subjects.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase() && s.id !== editingId
    );
    if (duplicate) {
      setFormError("A subject with this name already exists.");
      return;
    }
    if (editingId) onEdit(editingId, { name: trimmed, color });
    else onAdd({ name: trimmed, color });
    resetForm();
  }

  function handleDelete(subject) {
    const count = tasks.filter((t) => t.subjectId === subject.id).length;
    const ok = window.confirm(
      count > 0
        ? `Delete "${subject.name}" and its ${count} task(s)?`
        : `Delete "${subject.name}"?`
    );
    if (ok) onDelete(subject.id);
  }

  return (
    <section className="panel">
      <h2>Subjects</h2>

      <ul className="subject-list">
        <li>
          <button
            className={`subject-btn ${selectedId === "all" ? "active" : ""}`}
            onClick={() => onSelect("all")}
          >
            <span className="subject-name">All subjects</span>
            <span className="count">{tasks.length}</span>
          </button>
        </li>
        {subjects.map((s) => (
          <li key={s.id} className="subject-row">
            <button
              className={`subject-btn ${selectedId === s.id ? "active" : ""}`}
              onClick={() => onSelect(s.id)}
            >
              <span className="swatch" style={{ background: s.color }} />
              <span className="subject-name">{s.name}</span>
              <span className="count">
                {tasks.filter((t) => t.subjectId === s.id).length}
              </span>
            </button>
            <button className="icon-btn" onClick={() => startEdit(s)} aria-label={`Edit ${s.name}`}>
              Edit
            </button>
            <button className="icon-btn danger" onClick={() => handleDelete(s)} aria-label={`Delete ${s.name}`}>
              Delete
            </button>
          </li>
        ))}
        {subjects.length === 0 && (
          <li className="empty">No subjects yet. Add your first one below.</li>
        )}
      </ul>

      <form onSubmit={handleSubmit} noValidate className="subject-form">
        <label htmlFor="subject-name" className="form-label">
          {editingId ? "Rename subject" : "New subject"}
        </label>
        <div className="d-flex gap-2">
          <input
            id="subject-name"
            className={`form-control ${formError ? "is-invalid" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Operating Systems"
          />
          <input
            type="color"
            className="form-control form-control-color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Subject colour"
          />
        </div>
        {formError && <div className="text-danger small mt-1">{formError}</div>}
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-primary btn-sm" type="submit">
            {editingId ? "Save subject" : "Add subject"}
          </button>
          {editingId && (
            <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
