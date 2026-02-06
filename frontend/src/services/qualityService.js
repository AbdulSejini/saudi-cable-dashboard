/**
 * Quality Service
 * API calls for quality control operations
 */

import api from './api';

const qualityService = {
  // ============== Quality Checks ==============

  /**
   * Get quality checks with optional filtering
   */
  getQualityChecks: async (params = {}) => {
    return api.get('/quality/checks', params);
  },

  /**
   * Get a specific quality check
   */
  getQualityCheck: async (checkId) => {
    return api.get(`/quality/checks/${checkId}`);
  },

  /**
   * Create a new quality check
   */
  createQualityCheck: async (checkData) => {
    return api.post('/quality/checks', checkData);
  },

  /**
   * Get quality summary statistics
   */
  getQualitySummary: async (params = {}) => {
    return api.get('/quality/checks/summary', params);
  },

  // ============== Scrap Entries ==============

  /**
   * Get scrap entries with optional filtering
   */
  getScrapEntries: async (params = {}) => {
    return api.get('/quality/scrap', params);
  },

  /**
   * Get a specific scrap entry
   */
  getScrapEntry: async (entryId) => {
    return api.get(`/quality/scrap/${entryId}`);
  },

  /**
   * Create a new scrap entry
   */
  createScrapEntry: async (entryData) => {
    return api.post('/quality/scrap', entryData);
  },

  /**
   * Get scrap summary with financial valuation
   */
  getScrapSummary: async (params = {}) => {
    return api.get('/quality/scrap/summary', params);
  },

  /**
   * Get current LME copper price
   */
  getLMEPrice: async () => {
    return api.get('/quality/lme-price');
  },
};

export default qualityService;
