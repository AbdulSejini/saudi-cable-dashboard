import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import FactoryLayout from '../components/Factory/FactoryLayout';
import MachineCard from '../components/Dashboard/MachineCard';
import ManualEntryForm from '../components/Forms/ManualEntryForm';
import {
  X,
  Activity,
  Thermometer,
  Gauge,
  User,
  Clock,
  AlertTriangle,
  TrendingUp,
  Package,
  Settings,
  BarChart3
} from 'lucide-react';

const FactoryView = () => {
  const { t } = useLanguage();
  const { machines, getMachinesByArea, calculateAreaOEE } = useData();
  const { isDark, colors } = useTheme();

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedArea, setSelectedArea] = useState('all');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryType, setEntryType] = useState('production');

  const areas = [
    { id: 'all', name: 'All Areas', color: '#6B7280' },
    { id: 'PCP-1', name: 'PCP-1 (LV Cables)', color: '#3B82F6' },
    { id: 'PCP-2', name: 'PCP-2 (BSI Cables)', color: '#10B981' },
    { id: 'CV-Line', name: 'CV-Line Area', color: '#06B6D4' },
    { id: 'PVC-Reel', name: 'PVC & Reel Plants', color: '#8B5CF6' },
  ];

  const filteredMachines = selectedArea === 'all'
    ? Object.values(machines)
    : getMachinesByArea(selectedArea);

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
  };

  const handleLogEntry = (type) => {
    setEntryType(type);
    setShowEntryForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{t('nav.factoryLayout')}</h1>
          <p style={{ color: colors.textSecondary }}>Interactive factory floor visualization</p>
        </div>

        {/* Area Filter */}
        <div className="flex items-center gap-2">
          {areas.map((area) => (
            <motion.button
              key={area.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedArea(area.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedArea === area.id ? `${area.color}20` : (isDark ? colors.bgTertiary : '#F5F5F5'),
                border: `1px solid ${selectedArea === area.id ? area.color : colors.border}`,
                color: selectedArea === area.id ? area.color : colors.textSecondary,
              }}
            >
              {area.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Area Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {areas.slice(1).map((area) => {
          const areaMachines = getMachinesByArea(area.id);
          const running = areaMachines.filter(m => m.status === 'running').length;
          const oee = calculateAreaOEE(area.id);

          return (
            <motion.div
              key={area.id}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedArea(area.id)}
              className="rounded-xl p-4 cursor-pointer transition-all"
              style={{
                background: colors.bgCard,
                border: `1px solid ${selectedArea === area.id ? area.color : colors.border}`,
                boxShadow: selectedArea === area.id ? `0 0 0 2px ${area.color}30` : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: area.color }}
                />
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{area.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>Running</p>
                  <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    {running}/{areaMachines.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>OEE</p>
                  <p className="text-lg font-bold" style={{ color: area.color }}>
                    {oee.toFixed(1)}%
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Factory Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2"
        >
          <FactoryLayout onMachineClick={handleMachineClick} />
        </motion.div>

        {/* Machine Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {selectedMachine ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                {/* Header */}
                <div
                  className="p-6"
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{selectedMachine.id}</h3>
                      <p style={{ color: colors.textSecondary }}>{selectedMachine.name}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedMachine(null)}
                      className="p-2 rounded-lg"
                      style={{ background: colors.bgTertiary }}
                    >
                      <X className="w-5 h-5" style={{ color: colors.textMuted }} />
                    </motion.button>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="p-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={selectedMachine.status === 'running' ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`w-4 h-4 rounded-full ${
                        selectedMachine.status === 'running' ? 'bg-green-500' :
                        selectedMachine.status === 'idle' ? 'bg-yellow-500' :
                        selectedMachine.status === 'maintenance' ? 'bg-purple-500' :
                        'bg-red-500'
                      }`}
                    />
                    <span className="font-medium capitalize" style={{ color: colors.textPrimary }}>{selectedMachine.status}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="p-6 space-y-4">
                  <MetricRow
                    icon={<Gauge className="w-5 h-5 text-blue-400" />}
                    label="Speed"
                    value={`${selectedMachine.speed.toFixed(1)} / ${selectedMachine.targetSpeed} m/s`}
                    percentage={(selectedMachine.speed / selectedMachine.targetSpeed) * 100}
                    color="blue"
                    colors={colors}
                  />
                  <MetricRow
                    icon={<Thermometer className="w-5 h-5 text-orange-400" />}
                    label="Temperature"
                    value={`${selectedMachine.temperature}°C`}
                    percentage={Math.min((selectedMachine.temperature / 200) * 100, 100)}
                    color="orange"
                    colors={colors}
                  />
                  <MetricRow
                    icon={<Activity className="w-5 h-5 text-green-400" />}
                    label="OEE"
                    value={`${selectedMachine.oee}%`}
                    percentage={selectedMachine.oee}
                    color="green"
                    colors={colors}
                  />

                  {/* Operator */}
                  {selectedMachine.operator && (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: colors.bgTertiary }}>
                      <User className="w-5 h-5" style={{ color: colors.textMuted }} />
                      <div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Operator</p>
                        <p style={{ color: colors.textPrimary }}>{selectedMachine.operator}</p>
                      </div>
                    </div>
                  )}

                  {/* Machine Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ background: colors.bgTertiary }}>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>Area</p>
                      <p style={{ color: colors.textPrimary }}>{selectedMachine.area}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: colors.bgTertiary }}>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>Type</p>
                      <p className="capitalize" style={{ color: colors.textPrimary }}>{selectedMachine.type}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 space-y-3" style={{ borderTop: `1px solid ${colors.border}` }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLogEntry('production')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-500 font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Log Production
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLogEntry('downtime')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-600 font-medium hover:bg-yellow-500/30 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    Log Downtime
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLogEntry('quality')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-600 font-medium hover:bg-green-500/30 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Quality Check
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl p-8 text-center"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: colors.bgTertiary }}
                >
                  <Settings className="w-8 h-8" style={{ color: colors.textMuted }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>Select a Machine</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Click on any machine in the factory layout to view its details and log entries.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Machine List */}
          <div className="rounded-2xl p-4" style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              {selectedArea === 'all' ? 'All Machines' : `${selectedArea} Machines`}
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredMachines.map((machine) => (
                <motion.div
                  key={machine.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedMachine(machine)}
                  className="p-3 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: selectedMachine?.id === machine.id
                      ? 'rgba(59, 130, 246, 0.15)'
                      : colors.bgTertiary,
                    border: `1px solid ${selectedMachine?.id === machine.id ? '#3B82F6' : 'transparent'}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          machine.status === 'running' ? 'bg-green-500 status-running' :
                          machine.status === 'idle' ? 'bg-yellow-500' :
                          machine.status === 'maintenance' ? 'bg-purple-500' :
                          'bg-red-500'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{machine.id}</p>
                        <p className="text-xs" style={{ color: colors.textMuted }}>{machine.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm" style={{ color: colors.textPrimary }}>{machine.oee}%</p>
                      <p className="text-xs" style={{ color: colors.textMuted }}>OEE</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Manual Entry Form Modal */}
      <AnimatePresence>
        {showEntryForm && (
          <ManualEntryForm
            type={entryType}
            machine={selectedMachine}
            onClose={() => setShowEntryForm(false)}
            onSubmit={(data) => {
              console.log('Form submitted:', data);
              setShowEntryForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Metric Row Component
const MetricRow = ({ icon, label, value, percentage, color, colors }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-yellow-500',
    red: 'from-red-500 to-rose-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm" style={{ color: colors?.textSecondary || '#666564' }}>{label}</span>
        </div>
        <span className="text-sm font-medium" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{value}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: colors?.border || '#EAEAEA' }}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default FactoryView;
