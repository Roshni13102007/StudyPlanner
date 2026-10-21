import { useEffect, useState } from "react";
import { api } from "./api.js";
import SubjectPanel from "./components/SubjectPanel.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

export default function App() {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    Promise.all([api.getSubjects(), api.getTasks()])
      .then(([s, t]) => {
        setSubjects(s);
        setTasks(t);
      })
      .catch(() =>
        setError("Could not reach the server. Start it with: npm run server")
      )
      .finally(() => setLoading(false));
  }, []);

  // Wraps every API call so failures show one consistent message.
  async function run(action, failMessage) {
    try {
      setError("");
      await action();
    } catch {
      setError(failMessage);
    }
  }

  // ---- Subjects ----
  const addSubject = (data) =>
    run(async () => {
      const created = await api.createSubject(data);
      setSubjects((prev) => [...prev, created]);
    }, "Could not add the subject. Please try again.");

  const editSubject = (id, data) =>
    run(async () => {
      const updated = await api.updateSubject(id, data);
      setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
    }, "Could not update the subject. Please try again.");

  const removeSubject = (id) =>
    run(async () => {
      await api.deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setTasks((prev) => prev.filter((t) => t.subjectId !== id));
      if (selectedSubjectId === id) setSelectedSubjectId("all");
    }, "Could not delete the subject. Please try again.");

  // ---- Tasks ----
  const saveTask = (data) =>
    run(async () => {
      if (editingTask) {
        const updated = await api.updateTask(editingTask.id, {
          ...editingTask,
          ...data,
        });
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await api.createTask({ ...data, done: false });
        setTasks((prev) => [...prev, created]);
      }
    }, "Could not save the task. Please try again.");

  const toggleTask = (task) =>
    run(async () => {
      const updated = await api.patchTask(task.id, { done: !task.done });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }, "Could not update the task. Please try again.");

  const removeTask = (id) =>
    run(async () => {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask && editingTask.id === id) setEditingTask(null);
    }, "Could not delete the task. Please try again.");

  const visibleTasks =
    selectedSubjectId === "all"
      ? tasks
      : tasks.filter((t) => t.subjectId === selectedSubjectId);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Study Planner</h1>
        <p>Plan what to study, subject by subject.</p>
      </header>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between" role="alert">
          <span>{error}</span>
          <button className="btn-close" aria-label="Dismiss" onClick={() => setError("")} />
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading your plan…</p>
      ) : (
        <div className="row g-4">
          <aside className="col-lg-4">
            <SubjectPanel
              subjects={subjects}
              tasks={tasks}
              selectedId={selectedSubjectId}
              onSelect={setSelectedSubjectId}
              onAdd={addSubject}
              onEdit={editSubject}
              onDelete={removeSubject}
            />
          </aside>
          <main className="col-lg-8">
            <TaskForm
              key={editingTask ? editingTask.id : "new"}
              subjects={subjects}
              editingTask={editingTask}
              defaultSubjectId={selectedSubjectId}
              onSave={saveTask}
              onCancel={() => setEditingTask(null)}
            />
            <TaskList
              tasks={visibleTasks}
              subjects={subjects}
              onToggle={toggleTask}
              onEdit={setEditingTask}
              onDelete={removeTask}
            />
          </main>
        </div>
      )}
    </div>
  );
}
