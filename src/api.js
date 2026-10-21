const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

const send = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  // Subjects
  getSubjects: () => request("/subjects"),
  createSubject: (data) => request("/subjects", send("POST", data)),
  updateSubject: (id, data) => request(`/subjects/${id}`, send("PUT", data)),
  // _dependent removes the subject's tasks too, so no orphan tasks remain
  deleteSubject: (id) => request(`/subjects/${id}?_dependent=tasks`, { method: "DELETE" }),

  // Tasks
  getTasks: () => request("/tasks"),
  createTask: (data) => request("/tasks", send("POST", data)),
  updateTask: (id, data) => request(`/tasks/${id}`, send("PUT", data)),
  patchTask: (id, data) => request(`/tasks/${id}`, send("PATCH", data)),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
