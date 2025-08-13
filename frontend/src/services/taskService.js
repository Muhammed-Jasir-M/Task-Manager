const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TaskService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    if (filters.priority) {
      queryParams.append('priority', filters.priority);
    }

    const queryString = queryParams.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async getTask(id) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, updates) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods for common operations
  async markTaskComplete(id) {
    return this.updateTask(id, { status: 'Done' });
  }

  async markTaskInProgress(id) {
    return this.updateTask(id, { status: 'In Progress' });
  }

  async markTaskTodo(id) {
    return this.updateTask(id, { status: 'To Do' });
  }

  async changePriority(id, priority) {
    return this.updateTask(id, { priority });
  }
}

export const taskService = new TaskService();