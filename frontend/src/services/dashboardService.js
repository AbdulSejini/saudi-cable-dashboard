/**
 * Dashboard Service
 * API calls for dashboard overview and aggregated data
 */

import api from './api';

const dashboardService = {
  // ============== Dashboard Overview ==============

  /**
   * Get complete dashboard overview
   * Includes machines, KPIs, workforce, and scrap data
   */
  getDashboardOverview: async () => {
    return api.get('/dashboard/overview');
  },

  /**
   * Get plant capacity information
   */
  getPlantCapacity: async (plantId = null) => {
    const params = plantId ? { plant_id: plantId } : {};
    return api.get('/dashboard/capacity', params);
  },

  /**
   * Get all plants
   */
  getPlants: async () => {
    return api.get('/dashboard/plants');
  },

  /**
   * Create a new plant
   */
  createPlant: async (plantData) => {
    return api.post('/dashboard/plants', plantData);
  },

  // ============== Workforce ==============

  /**
   * Get workforce records
   */
  getWorkforceRecords: async (params = {}) => {
    return api.get('/dashboard/workforce', params);
  },

  /**
   * Create workforce record
   */
  createWorkforceRecord: async (recordData) => {
    return api.post('/dashboard/workforce', recordData);
  },

  /**
   * Get workforce summary
   */
  getWorkforceSummary: async (params = {}) => {
    return api.get('/dashboard/workforce/summary', params);
  },

  // ============== Production Trends ==============

  /**
   * Get hourly production data
   */
  getHourlyProduction: async (params = {}) => {
    return api.get('/dashboard/production/hourly', params);
  },

  /**
   * Get daily production summary
   */
  getDailyProduction: async (params = {}) => {
    return api.get('/dashboard/production/daily', params);
  },

  /**
   * Get weekly production trends
   */
  getWeeklyTrends: async (params = {}) => {
    return api.get('/dashboard/production/weekly', params);
  },

  // ============== KPIs ==============

  /**
   * Get overall KPIs
   */
  getKPIs: async () => {
    return api.get('/dashboard/kpis');
  },

  /**
   * Get OEE by area/plant
   */
  getOEEByArea: async () => {
    return api.get('/dashboard/oee/by-area');
  },
};

export default dashboardService;
