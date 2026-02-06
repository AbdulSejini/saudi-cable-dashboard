/**
 * Maintenance Service
 * API calls for maintenance operations
 */

import api from './api';

const maintenanceService = {
  // ============== Maintenance Tasks ==============

  /**
   * Get maintenance tasks with optional filtering
   */
  getMaintenanceTasks: async (params = {}) => {
    return api.get('/maintenance/tasks', params);
  },

  /**
   * Get a specific maintenance task
   */
  getMaintenanceTask: async (taskId) => {
    return api.get(`/maintenance/tasks/${taskId}`);
  },

  /**
   * Create a new maintenance task
   */
  createMaintenanceTask: async (taskData) => {
    return api.post('/maintenance/tasks', taskData);
  },

  /**
   * Update a maintenance task
   */
  updateMaintenanceTask: async (taskId, updateData) => {
    return api.put(`/maintenance/tasks/${taskId}`, updateData);
  },

  /**
   * Get maintenance summary statistics
   */
  getMaintenanceSummary: async (params = {}) => {
    return api.get('/maintenance/tasks/summary', params);
  },

  // ============== Emulsion Logs ==============

  /**
   * Get emulsion logs with optional filtering
   */
  getEmulsionLogs: async (params = {}) => {
    return api.get('/maintenance/emulsion', params);
  },

  /**
   * Create a new emulsion log entry
   */
  createEmulsionLog: async (logData) => {
    return api.post('/maintenance/emulsion', logData);
  },

  /**
   * Get latest emulsion readings for all machines
   */
  getLatestEmulsionReadings: async () => {
    return api.get('/maintenance/emulsion/latest');
  },
};

export default maintenanceService;
