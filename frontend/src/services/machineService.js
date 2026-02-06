/**
 * Machine Service
 * API calls for machine-related operations
 */

import api from './api';

const machineService = {
  /**
   * Get all machines with optional filtering
   * @param {Object} params - Filter parameters
   * @param {string} params.area - Filter by area (PCP-1, PCP-2, etc.)
   * @param {string} params.status - Filter by status
   * @param {string} params.type - Filter by machine type
   */
  getAll: async (params = {}) => {
    return api.get('/machines', params);
  },

  /**
   * Get a specific machine by ID
   * @param {string} machineId - Machine ID
   */
  getById: async (machineId) => {
    return api.get(`/machines/${machineId}`);
  },

  /**
   * Get machine statistics
   */
  getStats: async () => {
    return api.get('/machines/stats');
  },

  /**
   * Get OEE for a specific area
   * @param {string} area - Area name (PCP-1, PCP-2, CV-Line, etc.)
   */
  getAreaOEE: async (area) => {
    return api.get(`/machines/oee/${area}`);
  },

  /**
   * Create a new machine
   * @param {Object} machineData - Machine data
   */
  create: async (machineData) => {
    return api.post('/machines', machineData);
  },

  /**
   * Update a machine
   * @param {string} machineId - Machine ID
   * @param {Object} updateData - Update data
   */
  update: async (machineId, updateData) => {
    return api.put(`/machines/${machineId}`, updateData);
  },

  /**
   * Update machine status
   * @param {string} machineId - Machine ID
   * @param {Object} statusData - Status update data
   */
  updateStatus: async (machineId, statusData) => {
    return api.put(`/machines/${machineId}/status`, statusData);
  },

  /**
   * Delete a machine
   * @param {string} machineId - Machine ID
   */
  delete: async (machineId) => {
    return api.delete(`/machines/${machineId}`);
  },
};

export default machineService;
