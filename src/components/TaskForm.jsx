import { useState } from "react";

export default function TaskForm({
  subjects, editingTask, defaultSubjectId, onSave, onCancel,
}) {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [subjectId, setSubjectId] = useState(
    editingTask?.subjectId ?? (defaultSubjectId === "all" ? "" : defaultSubjectId)
  );
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? "");
  const [priority, setPriority] = useState(editingTask?.priority ?? "Medium");
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (title.trim().length < 3) next.title = "Task title needs at least 3 characters.";
    if (!subjectId) next.subjectId = "Choose a subject for this task.";
    if (!dueDate) next.dueDate = "Pick a due date.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ title: title.trim(), subjectId: Number(subjectId), dueDate, priority });
    if (!editingTask) {
      setTitle("");
      setDueDate("");
      setPriority("Medium");
    }
  }

  const noSubjects = subjects.length === 0;

  return (
    <section className="panel">
      <h2>{editingTask ? "Edit task" : "Add a task"}</h2>
      {noSubjects && (
        <p className="text-muted mb-0">Add a subject first, then you can create tasks for it.</p>
      )}
      {!noSubjects && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="task-title" className="form-label">Task</label>
              <input
                id="task-title"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to do?"
              />
              <div className="invalid-feedback">{errors.title}</div>
            </div>
            <div className="col-md-4">
              <label htmlFor="task-subject" className="form-label">Subject</label>
              <select
                id="task-subject"
                className={`form-select ${errors.subjectId ? "is-invalid" : ""}`}
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">Choose…</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.subjectId}</div>
            </div>
            <div className="col-md-4">
              <label htmlFor="task-due" className="form-label">Due date</label>
              <input
                id="task-due"
                type="date"
                className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <div className="invalid-feedback">{errors.dueDate}</div>
            </div>
            <div className="col-md-4">
              <label htmlFor="task-priority" className="form-label">Priority</label>
              <select
                id="task-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary" type="submit">
              {editingTask ? "Save changes" : "Add task"}
            </button>
            {editingTask && (
              <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
