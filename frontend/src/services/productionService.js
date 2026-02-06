/**
 * Production Service
 * API calls for production-related operations
 */

import api from './api';

const productionService = {
  // ============== Work Orders ==============

  /**
   * Get work orders with optional filtering
   */
  getWorkOrders: async (params = {}) => {
    return api.get('/production/work-orders', params);
  },

  /**
   * Get a specific work order
   */
  getWorkOrder: async (orderId) => {
    return api.get(`/production/work-orders/${orderId}`);
  },

  /**
   * Create a new work order
   */
  createWorkOrder: async (orderData) => {
    return api.post('/production/work-orders', orderData);
  },

  /**
   * Update a work order
   */
  updateWorkOrder: async (orderId, updateData) => {
    return api.put(`/production/work-orders/${orderId}`, updateData);
  },

  // ============== Production Logs ==============

  /**
   * Get production logs with optional filtering
   */
  getProductionLogs: async (params = {}) => {
    return api.get('/production/logs', params);
  },

  /**
   * Create a new production log entry
   */
  createProductionLog: async (logData) => {
    return api.post('/production/logs', logData);
  },

  /**
   * Get production summary
   */
  getProductionSummary: async (params = {}) => {
    return api.get('/production/logs/summary', params);
  },

  // ============== Downtime Logs ==============

  /**
   * Get downtime logs with optional filtering
   */
  getDowntimeLogs: async (params = {}) => {
    return api.get('/production/downtime', params);
  },

  /**
   * Create a new downtime log entry
   */
  createDowntimeLog: async (logData) => {
    return api.post('/production/downtime', logData);
  },

  /**
   * Get downtime summary
   */
  getDowntimeSummary: async (params = {}) => {
    return api.get('/production/downtime/summary', params);
  },
};

export default productionService;
