import API from "./api";

export const getTasks = async () => {
  const response = await API.get("/tasks", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

export const createTask = async (taskData) => {
  const response = await API.post("/tasks", taskData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await API.put(`/tasks/${id}`, taskData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};