import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initial machine data based on factory layout - Real Saudi Cable Factory Data
const initialMachines = {
  // ========== LV CABLE SECTION - PCP-1 (6 Machines) ==========
  'DT-1': { id: 'DT-1', name: 'Drawing Unit 1', area: 'PCP-1', section: 'LV-Cable', type: 'drawing', status: 'running', speed: 28.5, targetSpeed: 32, temperature: 45, oee: 78, operator: 'Ahmed Ali' },
  'DT-2': { id: 'DT-2', name: 'Drawing Unit 2', area: 'PCP-1', section: 'LV-Cable', type: 'drawing', status: 'running', speed: 30.2, targetSpeed: 32, temperature: 43, oee: 82, operator: 'Mohammed Hassan' },
  'DT-4': { id: 'DT-4', name: 'Drawing Unit 4', area: 'PCP-1', section: 'LV-Cable', type: 'drawing', status: 'idle', speed: 0, targetSpeed: 32, temperature: 25, oee: 0, operator: null },
  'BC-1': { id: 'BC-1', name: 'Bunching 1', area: 'PCP-1', section: 'LV-Cable', type: 'bunching', status: 'running', speed: 850, targetSpeed: 900, temperature: 38, oee: 75, operator: 'Khalid Omar' },
  'BC-2': { id: 'BC-2', name: 'Bunching 2', area: 'PCP-1', section: 'LV-Cable', type: 'bunching', status: 'maintenance', speed: 0, targetSpeed: 900, temperature: 25, oee: 0, operator: null },
  'AR-2': { id: 'AR-2', name: 'Armoring 2', area: 'PCP-1', section: 'LV-Cable', type: 'armoring', status: 'running', speed: 15.5, targetSpeed: 18, temperature: 42, oee: 71, operator: 'Saeed Ahmed' },

  // ========== LV CABLE SECTION - PCP-2 (14 Machines) ==========
  'AR-3': { id: 'AR-3', name: 'Armoring 3', area: 'PCP-2', section: 'LV-Cable', type: 'armoring', status: 'running', speed: 17.2, targetSpeed: 18, temperature: 40, oee: 85, operator: 'Faisal Nasser' },
  'XL-1': { id: 'XL-1', name: 'Extrusion Line 1', area: 'PCP-2', section: 'LV-Cable', type: 'extrusion', status: 'running', speed: 120, targetSpeed: 150, temperature: 185, oee: 68, operator: 'Yusuf Ibrahim' },
  'XL-2': { id: 'XL-2', name: 'Extrusion Line 2', area: 'PCP-2', section: 'LV-Cable', type: 'extrusion', status: 'running', speed: 145, targetSpeed: 150, temperature: 190, oee: 88, operator: 'Tariq Saleh' },
  'XT-1': { id: 'XT-1', name: 'Stranding XT-1', area: 'PCP-2', section: 'LV-Cable', type: 'stranding', status: 'running', speed: 45, targetSpeed: 50, temperature: 35, oee: 80, operator: 'Bandar Fahad' },
  'XT-3': { id: 'XT-3', name: 'Stranding XT-3', area: 'PCP-2', section: 'LV-Cable', type: 'stranding', status: 'running', speed: 48, targetSpeed: 50, temperature: 36, oee: 84, operator: 'Majed Turki' },
  'XT-6': { id: 'XT-6', name: 'Stranding XT-6', area: 'PCP-2', section: 'LV-Cable', type: 'stranding', status: 'idle', speed: 0, targetSpeed: 50, temperature: 25, oee: 0, operator: null },
  'XT-7': { id: 'XT-7', name: 'Stranding XT-7', area: 'PCP-2', section: 'LV-Cable', type: 'stranding', status: 'running', speed: 42, targetSpeed: 50, temperature: 34, oee: 76, operator: 'Saud Abdullah' },
  'XT-11': { id: 'XT-11', name: 'Stranding XT-11', area: 'PCP-2', section: 'LV-Cable', type: 'stranding', status: 'maintenance', speed: 0, targetSpeed: 50, temperature: 25, oee: 0, operator: null },
  'REW-1': { id: 'REW-1', name: 'Rewinding 1', area: 'PCP-2', section: 'LV-Cable', type: 'rewinding', status: 'running', speed: 200, targetSpeed: 250, temperature: 30, oee: 75, operator: 'Omar Saeed' },
  'REW-2': { id: 'REW-2', name: 'Rewinding 2', area: 'PCP-2', section: 'LV-Cable', type: 'rewinding', status: 'running', speed: 230, targetSpeed: 250, temperature: 32, oee: 82, operator: 'Nabil Hassan' },
  'REW-10': { id: 'REW-10', name: 'Rewinding 10', area: 'PCP-2', section: 'LV-Cable', type: 'rewinding', status: 'running', speed: 215, targetSpeed: 250, temperature: 31, oee: 78, operator: 'Hussain Khalid' },
  'MT-1': { id: 'MT-1', name: 'Testing MT-1', area: 'PCP-2', section: 'LV-Cable', type: 'testing', status: 'running', speed: 100, targetSpeed: 100, temperature: 25, oee: 92, operator: 'Ali Salman' },
  'LX-3': { id: 'LX-3', name: 'Extrusion LX-3', area: 'PCP-2', section: 'LV-Cable', type: 'extrusion', status: 'running', speed: 95, targetSpeed: 120, temperature: 175, oee: 72, operator: 'Nawaf Sultan' },

  // ========== BSI CABLE SECTION - PCP-1 (8 Machines) ==========
  'DT-5': { id: 'DT-5', name: 'Drawing Unit 5', area: 'PCP-1', section: 'BSI-Cable', type: 'drawing', status: 'running', speed: 29.8, targetSpeed: 32, temperature: 44, oee: 79, operator: 'Shahid Iqbal' },
  'DT-8': { id: 'DT-8', name: 'Drawing Unit 8', area: 'PCP-1', section: 'BSI-Cable', type: 'drawing', status: 'running', speed: 31.5, targetSpeed: 32, temperature: 42, oee: 86, operator: 'Essa Awaab' },
  'DT-9': { id: 'DT-9', name: 'Drawing Unit 9', area: 'PCP-1', section: 'BSI-Cable', type: 'drawing', status: 'idle', speed: 0, targetSpeed: 32, temperature: 25, oee: 0, operator: null },
  'PS-1': { id: 'PS-1', name: 'Processing PS-1', area: 'PCP-1', section: 'BSI-Cable', type: 'processing', status: 'running', speed: 22, targetSpeed: 25, temperature: 165, oee: 74, operator: 'Noshad Ahmed' },
  'PS-2': { id: 'PS-2', name: 'Processing PS-2', area: 'PCP-1', section: 'BSI-Cable', type: 'processing', status: 'running', speed: 24.5, targetSpeed: 25, temperature: 170, oee: 82, operator: 'Abdul Qadir' },
  'PS-3': { id: 'PS-3', name: 'Processing PS-3', area: 'PCP-1', section: 'BSI-Cable', type: 'processing', status: 'stopped', speed: 0, targetSpeed: 25, temperature: 25, oee: 0, operator: null },
  'PS-4': { id: 'PS-4', name: 'Processing PS-4', area: 'PCP-1', section: 'BSI-Cable', type: 'processing', status: 'running', speed: 23.8, targetSpeed: 25, temperature: 168, oee: 78, operator: 'Kamal Saqr' },
  'XT-9': { id: 'XT-9', name: 'Stranding XT-9', area: 'PCP-1', section: 'BSI-Cable', type: 'stranding', status: 'running', speed: 44, targetSpeed: 50, temperature: 36, oee: 80, operator: 'Salem Ahmad' },

  // ========== BSI CABLE SECTION - PCP-2 (15 Machines) ==========
  'XT-10': { id: 'XT-10', name: 'Stranding XT-10', area: 'PCP-2', section: 'BSI-Cable', type: 'stranding', status: 'running', speed: 46, targetSpeed: 50, temperature: 35, oee: 83, operator: 'Rashid Nasser' },
  'XT-12': { id: 'XT-12', name: 'Stranding XT-12', area: 'PCP-2', section: 'BSI-Cable', type: 'stranding', status: 'running', speed: 47, targetSpeed: 50, temperature: 37, oee: 81, operator: 'Waleed Fahad' },
  'JKT-4': { id: 'JKT-4', name: 'Jacketing JKT-4', area: 'PCP-2', section: 'BSI-Cable', type: 'jacketing', status: 'running', speed: 18, targetSpeed: 20, temperature: 155, oee: 81, operator: 'Talal Al-Farmi' },
  'XT-13': { id: 'XT-13', name: 'Stranding XT-13', area: 'PCP-2', section: 'BSI-Cable', type: 'stranding', status: 'idle', speed: 0, targetSpeed: 50, temperature: 25, oee: 0, operator: null },
  'ARM-4': { id: 'ARM-4', name: 'Armoring ARM-4', area: 'PCP-2', section: 'BSI-Cable', type: 'armoring', status: 'running', speed: 16.2, targetSpeed: 18, temperature: 41, oee: 77, operator: 'Hassan Mahmoud' },
  'CAB-2': { id: 'CAB-2', name: 'Cabling CAB-2', area: 'PCP-2', section: 'BSI-Cable', type: 'cabling', status: 'running', speed: 35, targetSpeed: 40, temperature: 38, oee: 79, operator: 'Yasser Omar' },
  'CAB-4': { id: 'CAB-4', name: 'Cabling CAB-4', area: 'PCP-2', section: 'BSI-Cable', type: 'cabling', status: 'running', speed: 38, targetSpeed: 40, temperature: 39, oee: 85, operator: 'Adel Khalid' },
  'CAB-5': { id: 'CAB-5', name: 'Cabling CAB-5', area: 'PCP-2', section: 'BSI-Cable', type: 'cabling', status: 'maintenance', speed: 0, targetSpeed: 40, temperature: 25, oee: 0, operator: null },
  'TWI-1': { id: 'TWI-1', name: 'Twisting TWI-1', area: 'PCP-2', section: 'BSI-Cable', type: 'twisting', status: 'running', speed: 55, targetSpeed: 60, temperature: 32, oee: 76, operator: 'Fares Abdullah' },
  'TWI-2': { id: 'TWI-2', name: 'Twisting TWI-2', area: 'PCP-2', section: 'BSI-Cable', type: 'twisting', status: 'running', speed: 58, targetSpeed: 60, temperature: 33, oee: 82, operator: 'Mazen Saeed' },
  'REW-4': { id: 'REW-4', name: 'Rewinding 4', area: 'PCP-2', section: 'BSI-Cable', type: 'rewinding', status: 'running', speed: 210, targetSpeed: 250, temperature: 30, oee: 77, operator: 'Sami Turki' },
  'REW-5': { id: 'REW-5', name: 'Rewinding 5', area: 'PCP-2', section: 'BSI-Cable', type: 'rewinding', status: 'running', speed: 225, targetSpeed: 250, temperature: 31, oee: 80, operator: 'Ibrahim Majed' },
  'DTA': { id: 'DTA', name: 'Drawing DTA', area: 'PCP-2', section: 'BSI-Cable', type: 'drawing', status: 'running', speed: 30.5, targetSpeed: 32, temperature: 43, oee: 84, operator: 'Khalid Mansour' },
  'DTU': { id: 'DTU', name: 'Drawing DTU', area: 'PCP-2', section: 'BSI-Cable', type: 'drawing', status: 'running', speed: 29.2, targetSpeed: 32, temperature: 44, oee: 78, operator: 'Nayef Sultan' },

  // ========== CV Line Area ==========
  'CV-1': { id: 'CV-1', name: 'CV Line 1', area: 'CV-Line', section: 'CV', type: 'cv-line', status: 'running', speed: 8.5, targetSpeed: 10, temperature: 320, oee: 72, operator: 'Fahad Nasser' },
  'CV-2': { id: 'CV-2', name: 'CV Line 2', area: 'CV-Line', section: 'CV', type: 'cv-line', status: 'running', speed: 9.2, targetSpeed: 10, temperature: 315, oee: 78, operator: 'Abdulrahman Saleh' },

  // ========== Storage & Support ==========
  'SILO-1': { id: 'SILO-1', name: 'Silo 1', area: 'Storage', section: 'Support', type: 'storage', status: 'running', speed: 0, targetSpeed: 0, temperature: 22, oee: 95, operator: null },
  'SILO-2': { id: 'SILO-2', name: 'Silo 2', area: 'Storage', section: 'Support', type: 'storage', status: 'running', speed: 0, targetSpeed: 0, temperature: 23, oee: 90, operator: null },
};

// Initial work orders
const initialWorkOrders = [
  { id: 'WO-2024-001', customer: 'Saudi Electricity', product: 'LV Cable 4x70mm', machine: 'XL-1', priority: 'high', status: 'in-progress', progress: 65, dueDate: '2024-02-10', color: 'black' },
  { id: 'WO-2024-002', customer: 'SABIC', product: 'Control Cable 12x2.5mm', machine: 'XL-2', priority: 'medium', status: 'in-progress', progress: 40, dueDate: '2024-02-12', color: 'white' },
  { id: 'WO-2024-003', customer: 'Aramco', product: 'Armored Cable 3x185mm', machine: 'AR-2', priority: 'high', status: 'in-progress', progress: 25, dueDate: '2024-02-08', color: 'red' },
  { id: 'WO-2024-004', customer: 'Ma\'aden', product: 'Instrumentation Cable', machine: 'PS-1', priority: 'low', status: 'pending', progress: 0, dueDate: '2024-02-15', color: 'blue' },
  { id: 'WO-2024-005', customer: 'SWCC', product: 'Submersible Cable', machine: 'CV-1', priority: 'high', status: 'in-progress', progress: 80, dueDate: '2024-02-07', color: 'yellow' },
];

// Initial maintenance data
const initialMaintenance = [
  { id: 'MT-001', machine: 'BC-2', type: 'preventive', description: 'Bearing replacement', status: 'in-progress', assignee: 'Maintenance Team A', startTime: '2024-02-05T08:00', estimatedEnd: '2024-02-05T14:00' },
  { id: 'MT-002', machine: 'XT-11', type: 'corrective', description: 'Motor overheating issue', status: 'in-progress', assignee: 'Electrical Team', startTime: '2024-02-05T09:30', estimatedEnd: '2024-02-05T16:00' },
  { id: 'MT-003', machine: 'XL-4', type: 'predictive', description: 'Vibration anomaly detected', status: 'pending', assignee: 'Maintenance Team B', startTime: null, estimatedEnd: null },
];

// Capacity data - Real Saudi Cable Factory Data (Full Production Capacity)
const capacityData = {
  // LV & BSI Section - 45,000 MT Total
  'LV': { designCapacity: 30000, actualProduction: 5600, unit: 'MT/year', dailyOutput: 42 },
  'BSI': { designCapacity: 7900, actualProduction: 1950, unit: 'MT/year', dailyOutput: 15 },
  'BareCopper': { designCapacity: 7100, actualProduction: 1700, unit: 'MT/year', dailyOutput: 15 },
  'LV-BSI-Total': { designCapacity: 45000, actualProduction: 9250, unit: 'MT/year', category: 'FINAL CABLE' },

  // MV/HV Section - 15,000 MT Total
  'MV': { designCapacity: 8100, actualProduction: 4700, unit: 'MT/year' },
  'HV': { designCapacity: 6900, actualProduction: 1190, unit: 'MT/year' },
  'MV-HV-Total': { designCapacity: 15000, actualProduction: 5890, unit: 'MT/year', category: 'FINAL CABLE' },

  // PVC Plant - 22,000 MT
  'PVC': { designCapacity: 22000, actualProduction: 14680, unit: 'MT/year', dailyOutput: 76, category: 'MATERIAL' },

  // Building Wires
  'BW': { designCapacity: 1700, actualProduction: 400, unit: 'MT/year', dailyOutput: 15 },

  // CV Lines
  'CV-Line': { designCapacity: 5696, actualProduction: 1500, unit: 'MT/year', dailyOutput: 10 },

  // Total Capacity
  'Total': { designCapacity: 27676, actualProduction: 9175, unit: 'MT/year', freeCapacity: '33%' },

  // Legacy compatibility
  'PCP-1': { designCapacity: 21900, actualProduction: 5475, unit: 'MT/year' },
  'PCP-2': { designCapacity: 21900, actualProduction: 5475, unit: 'MT/year' },
  'LV-Cable': { designCapacity: 36000, capacity25: 9000, actualProduction: 9000, unit: 'MT/year', machinesPCP1: 6, machinesPCP2: 14 },
  'BSI-Cable': { designCapacity: 7800, capacity25: 1950, actualProduction: 1950, unit: 'MT/year', machinesPCP1: 8, machinesPCP2: 15 },
};

// Volume Distribution Data (MT) - Business Plan
const volumeDistribution = {
  products: [
    { bpName: 'CU BW', name: 'Building Wire & THHN', y2024: 3597.53, y2025: 3995.00, y2026: 4200.00, y2027: 6000.00 },
    { bpName: 'CU LV', name: 'CU Low Voltage', y2024: 12247.98, y2025: 21600.00, y2026: 27000.00, y2027: 32400.00 },
    { bpName: 'CU MV', name: 'CU Med. Voltage', y2024: 2230.62, y2025: 2005.00, y2026: 2495.00, y2027: 2500.00 },
    { bpName: 'CU HV', name: 'CU High Voltage', y2024: 1561.29, y2025: 3995.00, y2026: 5000.00, y2027: 9000.00 },
    { bpName: 'Instrument', name: 'Instrumentation', y2024: 581.71, y2025: 805.00, y2026: 995.00, y2027: 960.00 },
    { bpName: 'Control & Special', name: 'Control & Speciality Cable', y2024: 300.00, y2025: 500.00, y2026: 600.00, y2027: 600.00 },
    { bpName: 'AL LV', name: 'AL Low Voltage', y2024: 927.21, y2025: 2400.00, y2026: 3000.00, y2027: 1800.00 },
    { bpName: 'AL MV', name: 'AL Med. Voltage', y2024: 4582.65, y2025: 3994.80, y2026: 4999.75, y2027: 4000.00 },
    { bpName: 'AL HV', name: 'AL High Voltage', y2024: 380.73, y2025: 805.00, y2026: 995.00, y2027: 1000.00 },
  ],
  totals: { y2024: 26409.70, y2025: 40099.81, y2026: 49284.76, y2027: 58260.00 }
};

// Actual Transfer Data (Month of October example)
const actualTransferData = {
  month: 'October',
  products: [
    { name: 'Building wires', plan: { cu: 0, al: 0, total: 0 }, actual: { cu: 8.5, al: 0, total: 8.5 }, balance: { cu: 0, al: 0, total: 0 } },
    { name: 'Low Voltage', plan: { cu: 0, al: 0, total: 0 }, actual: { cu: 37.4, al: 16.4, total: 53.8 }, balance: { cu: 0, al: 0, total: 0 } },
    { name: 'Specialty', plan: { cu: 0, al: 0, total: 0 }, actual: { cu: 1.9, al: 0, total: 1.9 }, balance: { cu: 0, al: 0, total: 0 } },
    { name: 'Medium Voltage', plan: { cu: 0, al: 0, total: 0 }, actual: { cu: 4.7, al: 17.0, total: 21.7 }, balance: { cu: 0, al: 0, total: 0 } },
    { name: 'High Voltage', plan: { cu: 0, al: 0, total: 0 }, actual: { cu: 11.9, al: 0, total: 11.9 }, balance: { cu: 0, al: 0, total: 0 } },
    { name: 'Instrumentations', plan: { cu: 0, al: 0, total: 0 }, actual: { cu: 0, al: 0, total: 0 }, balance: { cu: 0, al: 0, total: 0 } },
  ],
  totals: { plan: { cu: 0, al: 0, total: 0 }, actual: { cu: 64.4, al: 33.4, total: 97.8 }, balance: { cu: 0, al: 0, total: 0 } },
  qcTransfer: { cu: 0, al: 0, total: 0 },
  grandTotal: { cu: 0, al: 0, total: 0 }
};

// WIP & Metals Status
const wipMetalsData = {
  workInProcess: {
    aluminum: [
      { product: 'Building wires', mt: 0 },
      { product: 'Low Voltage', mt: 0 },
      { product: 'Speciality', mt: 0 },
      { product: 'Medium Voltage', mt: 140 },
      { product: 'High Voltage', mt: 0 },
      { product: 'Instrumentations', mt: 0 },
    ],
    copper: [
      { product: 'Building wires', mt: 0 },
      { product: 'Low Voltage', mt: 2.6 },
      { product: 'Speciality', mt: 0 },
      { product: 'Medium Voltage', mt: 2.3 },
      { product: 'High Voltage', mt: 3.2 },
      { product: 'Instrumentations', mt: 0 },
    ],
    totals: { aluminum: 140, copper: 8.1 }
  },
  stockOfMetals: { aluminum: 114, copper: 97 },
  metalsReceived: { aluminum: 0, copper: 0 },
  asOfDate: '22/11/2023'
};

// Factory Monthly Output Data
const factoryOutputData = {
  asOf: '05/02/2026',
  mvhv: {
    cv1: { months: ['MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], outputMT: [0, 0, 0, 0, 208, 292, 292, 292, 292, 0], outputKM: [0, 0, 0, 0, 192, 216, 216, 216, 216, 0] },
    cv2: { outputMT: [86, 525, 292, 219, 292, 234, 234, 234, 234, 0], outputKM: [80, 50, 216, 162, 216, 234, 234, 234, 234, 0] },
    cv3: { outputMT: [114, 243, 182, 136, 182, 182, 292, 292, 292, 0], outputKM: [105, 180, 168, 126, 168, 168, 216, 216, 216, 0] },
  },
  pvcPlant: { outputMT: [0, 0, 1835, 1835, 1835, 1835, 1835, 1835, 1835, 1835] },
  lv: { outputMT: [0, 0, 400, 400, 400, 400, 1000, 1000, 1000, 1000] },
  bw: { outputMT: [0, 103, 103, 103, 103, 103, 322, 322, 322, 322] },
  salesOrder: { total: 9175, freeCapacity: '33%' },
  backlog: {
    secOthers: 4082,
    jcc: 1614,
    lvbwItems: 7300,
    potential: 0,
    totalPlan2023: 12996
  },
  potential: [
    { customer: 'L&T', mt: 2000, type: 'Sales Order' },
    { customer: 'New SEC order', mt: 2000, type: 'Sales Order' },
    { customer: 'Nesma', mt: 90, type: 'Sales Order' },
    { customer: 'Riyadh Cable', mt: 980, type: 'Sales Order (Offload)' },
  ],
  requirements: [
    { item: 'SEC 60KM Urgent Batch', req: 5000000, sr: '28.02.2023', by: 'Bank facilities 5MSR' },
    { item: 'Milfer Part', req: 2000000, sr: '15.03.2023', by: '24 MSR Cache' },
    { item: 'Utility', req: 500000, sr: '15.03.2023', by: '24 MSR Cache' },
    { item: 'Souq Items 1000 MT', req: 35000000, sr: '15.03.2023', by: 'Bank facilities 75MSR to arrange Copper' },
    { item: 'SEC & WABRAN Backlog', req: 40000000, sr: '30.03.2023', by: 'Bank facilities 75MSR' },
    { item: 'Raw Material', req: 5000000, sr: '30.03.2023', by: '60 MSR Cache' },
    { item: 'Transportation', req: 3000000, sr: '30.03.2023', by: '60 MSR Cache' },
  ],
  totalRequirements: 90500000
};

// Workforce data - Real Saudi Cable Factory Data
const workforceData = {
  'LV-Cable': {
    direct: { total: 78, vacancies: 55 },
    indirect: { total: 12, vacancies: 0 },
    managers: { total: 4, vacancies: 0 },
    forkLiftDrivers: { total: 6, vacancies: 0 },
    totalHeadcount: 100,
    totalVacancies: 55
  },
  'BSI-Cable': {
    direct: { total: 85, vacancies: 59 },
    indirect: { total: 10, vacancies: 0 },
    managers: { total: 3, vacancies: 0 },
    forkLiftDrivers: { total: 5, vacancies: 0 },
    totalHeadcount: 103,
    totalVacancies: 59
  },
  // Combined for backward compatibility
  'PCP-1': { total: 120, onShift: 85, vacancies: 55 },
  'PCP-2': { total: 80, onShift: 52, vacancies: 59 },
};

// Equipment & Forklifts Data
const equipmentData = {
  forklifts: [
    { id: 'FL-LV-1', section: 'LV-Cable', capacity: '16 TONS', status: 'operational' },
    { id: 'FL-LV-2', section: 'LV-Cable', capacity: '10 TONS', status: 'operational' },
    { id: 'FL-LV-3', section: 'LV-Cable', capacity: '10 TONS', status: 'maintenance' },
    { id: 'FL-LV-4', section: 'LV-Cable', capacity: '16 TONS', status: 'operational' },
    { id: 'FL-BSI-1', section: 'BSI-Cable', capacity: '16 TONS', status: 'operational' },
    { id: 'FL-BSI-2', section: 'BSI-Cable', capacity: '10 TONS', status: 'operational' },
    { id: 'FL-BSI-3', section: 'BSI-Cable', capacity: '10 TONS', status: 'operational' },
  ]
};

// Manpower Data - Real Factory Data (as of 21.11.2023)
const manpowerData = {
  asOfDate: '21.11.2023',
  byDepartment: [
    { department: 'Drawing/Stranding', current: 29, target26K: 39, target40K: 69 },
    { department: 'Low Voltage/BSI', current: 105, target26K: 148, target40K: 169 },
    { department: 'Medium & High Voltage', current: 40, target26K: 84, target40K: 84 },
    { department: 'PVC & Reel Plants', current: 16, target26K: 25, target40K: 26 },
    { department: 'Maintenance & Support', current: 84, target26K: 158, target40K: 160 },
  ],
  totals: { current: 274, target26K: 454, target40K: 508 },
  manufacturing: {
    departments: ['MV/HV/EHV', 'LV/BSI', 'DR/ST', 'PVC/REEL'],
    roles: [
      { role: 'Production Engineer', values: [0, 1, 0, 0] },
      { role: 'Formulation Specialist', values: [0, 0, 0, 0] },
      { role: 'Sr. Supervisor', values: [1, 1, 1, 0] },
      { role: 'Coordinator', values: [1, 1, 0, 1] },
      { role: 'Supervisor', values: [6, 6, 3, 2] },
    ],
    indirectTotal: [8, 9, 4, 3],
    totalManpower: [41, 105, 28, 16],
    percentageEachDept: ['20%', '9%', '14%', '19%'],
    productionTotalIndirect: 24,
    productionTotal: 190,
    percentageOfIndirect: '13%'
  }
};

// Machine Status Data - Real Factory Data
const machineStatusData = {
  categories: ['Still Active', 'Active with B.D.', 'In-Active', 'Write off', 'Sale'],
  bySection: [
    { section: 'DRW/STR', stillActive: 22, activeWithBD: 7, inActive: 1, writeOff: 4, sale: 0, total: 34 },
    { section: 'LV / BSI', stillActive: 24, activeWithBD: 5, inActive: 3, writeOff: 2, sale: 0, total: 34 },
    { section: 'ADD TO LV/BSI FROM TCP', stillActive: 15, activeWithBD: 0, inActive: 0, writeOff: 29, sale: 7, total: 51 },
    { section: 'MV/HV', stillActive: 18, activeWithBD: 1, inActive: 1, writeOff: 2, sale: 0, total: 22 },
    { section: 'SUPPORT PLANT', stillActive: 1, activeWithBD: 1, inActive: 1, writeOff: 0, sale: 0, total: 3 },
  ],
  totals: { stillActive: 80, activeWithBD: 14, inActive: 6, writeOff: 37, sale: 7, total: 144 }
};

// KPI Data - Manufacturing KPIs Year 2023
const kpiData = {
  year: 2023,
  kpis: [
    {
      id: 1,
      name: 'Monthly Transfer',
      unit: '%',
      actual2022: 3,
      target2023: 90,
      criteria: ['Std. Capacity', 'Actual', '%'],
      currentValue: 0,
      status: 'pending'
    },
    {
      id: 2,
      name: 'Scrap (Production)',
      unit: '%',
      actual2022: 2.43,
      target2023: 2.5,
      criteria: ['Scrap', 'Transfer', '%'],
      currentValue: 0,
      status: 'good'
    },
    {
      id: 3,
      name: 'NCR (QC)',
      unit: '%',
      actual2022: 0.75,
      target2023: 2.5,
      criteria: ['NCR', 'Transferred Reels', '%'],
      currentValue: 0,
      status: 'good'
    },
    {
      id: 4,
      name: 'Customers Complaints',
      unit: 'EA',
      actual2022: 10,
      target2023: '-10% of prev.year',
      criteria: ['Number of Customer Complaints'],
      currentValue: 0,
      status: 'pending'
    },
    {
      id: 5,
      name: 'Overtime without CV\'s',
      unit: 'SAR',
      actual2022: 0,
      target2023: '-10%',
      criteria: ['No Budget'],
      currentValue: 0,
      status: 'good'
    },
  ]
};

// Rain Impact Data - Affected Machines due to recent rain
const rainImpactData = {
  affectedArea: 'PCP2',
  reason: 'Post rain water entered inside the plant, removed the water and cleaned entire area',
  rootCause: 'Defective roof',
  affectedMachines: [
    { id: 'DT1', issue: 'Changed hydraulic oil', status: 'resolved', color: '#4A5568' },
    { id: 'DT2', issue: 'Changed hydraulic oil', status: 'resolved', color: '#10B981' },
    { id: 'IW5', issue: 'Water in filter sump', status: 'resolved', color: '#6B7280' },
    { id: 'DT5', issue: 'Motor damaged', status: 'in-progress', color: '#EF4444' },
    { id: 'CW5', issue: 'Trenches overflow', status: 'resolved', color: '#F39200' },
    { id: 'CW2', issue: 'Overflow spooler/trenches', status: 'resolved', color: '#3B82F6' },
  ],
  reportDate: '2023-11-26',
  totalAffected: 6,
  resolved: 5,
  inProgress: 1
};

export const DataProvider = ({ children }) => {
  const [machines, setMachines] = useState(initialMachines);
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [alerts, setAlerts] = useState([]);
  const [scrapData, setScrapData] = useState([]);
  const [productionLogs, setProductionLogs] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].status === 'running') {
            // Simulate small fluctuations
            const speedVariation = (Math.random() - 0.5) * 2;
            const tempVariation = (Math.random() - 0.5) * 1;
            updated[key] = {
              ...updated[key],
              speed: Math.max(0, updated[key].speed + speedVariation),
              temperature: Math.max(20, updated[key].temperature + tempVariation),
            };
          }
        });
        return updated;
      });
    }, 30000); // Update every 30 seconds instead of 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Add production log
  const addProductionLog = useCallback((log) => {
    setProductionLogs(prev => [{
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    }, ...prev]);
  }, []);

  // Add scrap entry
  const addScrapEntry = useCallback((entry) => {
    setScrapData(prev => [{
      id: `SCRAP-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    }, ...prev]);
  }, []);

  // Update machine status
  const updateMachineStatus = useCallback((machineId, updates) => {
    setMachines(prev => ({
      ...prev,
      [machineId]: { ...prev[machineId], ...updates }
    }));
  }, []);

  // Add alert
  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: `ALERT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...alert
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  // Calculate OEE for area
  const calculateAreaOEE = useCallback((area) => {
    const areaMachines = Object.values(machines).filter(m => m.area === area && m.status === 'running');
    if (areaMachines.length === 0) return 0;
    return areaMachines.reduce((sum, m) => sum + m.oee, 0) / areaMachines.length;
  }, [machines]);

  // Get machines by area
  const getMachinesByArea = useCallback((area) => {
    return Object.values(machines).filter(m => m.area === area);
  }, [machines]);

  // Get machine statistics
  const getMachineStats = useCallback(() => {
    const all = Object.values(machines);
    return {
      total: all.length,
      running: all.filter(m => m.status === 'running').length,
      idle: all.filter(m => m.status === 'idle').length,
      stopped: all.filter(m => m.status === 'stopped').length,
      maintenance: all.filter(m => m.status === 'maintenance').length,
    };
  }, [machines]);

  // Get machines by section (LV-Cable or BSI-Cable)
  const getMachinesBySection = useCallback((section) => {
    return Object.values(machines).filter(m => m.section === section);
  }, [machines]);

  // Get section statistics
  const getSectionStats = useCallback((section) => {
    const sectionMachines = getMachinesBySection(section);
    return {
      total: sectionMachines.length,
      running: sectionMachines.filter(m => m.status === 'running').length,
      idle: sectionMachines.filter(m => m.status === 'idle').length,
      stopped: sectionMachines.filter(m => m.status === 'stopped').length,
      maintenance: sectionMachines.filter(m => m.status === 'maintenance').length,
      averageOEE: sectionMachines.filter(m => m.status === 'running').reduce((sum, m) => sum + m.oee, 0) /
                  (sectionMachines.filter(m => m.status === 'running').length || 1)
    };
  }, [getMachinesBySection]);

  const value = {
    machines,
    workOrders,
    maintenance,
    alerts,
    scrapData,
    productionLogs,
    capacityData,
    workforceData,
    equipmentData,
    volumeDistribution,
    actualTransferData,
    wipMetalsData,
    factoryOutputData,
    manpowerData,
    machineStatusData,
    kpiData,
    rainImpactData,
    setMachines,
    setWorkOrders,
    setMaintenance,
    setAlerts,
    addProductionLog,
    addScrapEntry,
    updateMachineStatus,
    addAlert,
    calculateAreaOEE,
    getMachinesByArea,
    getMachinesBySection,
    getMachineStats,
    getSectionStats,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
