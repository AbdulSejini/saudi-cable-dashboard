/**
 * Services Index
 * Central export for all API services
 */

import api from './api';
import machineService from './machineService';
import productionService from './productionService';
import qualityService from './qualityService';
import maintenanceService from './maintenanceService';
import dashboardService from './dashboardService';

export {
  api,
  machineService,
  productionService,
  qualityService,
  maintenanceService,
  dashboardService,
};

export default {
  api,
  machines: machineService,
  production: productionService,
  quality: qualityService,
  maintenance: maintenanceService,
  dashboard: dashboardService,
};
