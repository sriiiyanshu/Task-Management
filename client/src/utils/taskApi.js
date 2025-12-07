import api from "./api";

/**
 * Task API service functions
 */

/**
 * Get all tasks with optional filters
 * @param {Object} filters - Query parameters
 * @param {string} filters.status - Filter by status
 * @param {string} filters.priority - Filter by priority
 * @param {string} filters.search - Search query
 * @returns {Promise} API response
 */
export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.search) params.append("search", filters.search);

  const queryString = params.toString();
  const url = queryString ? `/api/tasks?${queryString}` : "/api/tasks";

  const response = await api.get(url);
  // Backend returns { success, count, tasks }
  return response.data.tasks || [];
};

/**
 * Get a single task by ID
 * @param {number} id - Task ID
 * @returns {Promise} Task object
 */
export const getTask = async (id) => {
  const response = await api.get(`/api/tasks/${id}`);
  // Backend returns { success, task }
  return response.data.task;
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} taskData.description - Task description
 * @param {string} taskData.dueDate - Due date (ISO 8601)
 * @param {string} taskData.priority - Priority (Low, Medium, High)
 * @param {string} taskData.status - Status (To Do, In Progress, Done)
 * @returns {Promise} Created task object
 */
export const createTask = async (taskData) => {
  const response = await api.post("/api/tasks", taskData);
  // Backend returns { success, message, task }
  return response.data.task;
};

/**
 * Update an existing task
 * @param {number} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Updated task object
 */
export const updateTask = async (id, updates) => {
  const response = await api.put(`/api/tasks/${id}`, updates);
  // Backend returns { success, message, task }
  return response.data.task;
};

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {Promise} Success response
 */
export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  // Backend returns { success, message }
  return response.data;
};

/**
 * Get current user info
 * @returns {Promise} User object
 */
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  // Backend returns { success, user }
  return response.data.user;
};

/**
 * Logout user
 * @returns {Promise} Success response
 */
export const logout = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};
