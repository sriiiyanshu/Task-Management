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

  return api.get(url);
};

/**
 * Get a single task by ID
 * @param {number} id - Task ID
 * @returns {Promise} API response
 */
export const getTask = async (id) => {
  return api.get(`/api/tasks/${id}`);
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} taskData.description - Task description
 * @param {string} taskData.dueDate - Due date (ISO 8601)
 * @param {string} taskData.priority - Priority (Low, Medium, High)
 * @param {string} taskData.status - Status (To Do, In Progress, Done)
 * @returns {Promise} API response
 */
export const createTask = async (taskData) => {
  return api.post("/api/tasks", taskData);
};

/**
 * Update an existing task
 * @param {number} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} API response
 */
export const updateTask = async (id, updates) => {
  return api.put(`/api/tasks/${id}`, updates);
};

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {Promise} API response
 */
export const deleteTask = async (id) => {
  return api.delete(`/api/tasks/${id}`);
};

/**
 * Get current user info
 * @returns {Promise} API response
 */
export const getCurrentUser = async () => {
  return api.get("/auth/me");
};

/**
 * Logout user
 * @returns {Promise} API response
 */
export const logout = async () => {
  return api.get("/auth/logout");
};
