/**
 * Home Page
 * Saudi Cable Company Dashboard - Light/Dark Mode Theme
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/Dashboard/StatCard';
import MachineCard from '../components/Dashboard/MachineCard';
import OEEGauge from '../components/Dashboard/OEEGauge';
import ProductionChart from '../components/Charts/ProductionChart';
import ManualEntryForm from '../components/Forms/ManualEntryForm';
import {
  Factory,
  Activity,
  Wrench,
  AlertTriangle,
  Users,
  Package,
  Clock,
  Zap,
  Target,
  ChevronRight,
  Plus
} from 'lucide-react';

const Home = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { isDark, colors } = useTheme();
  const {
    machines,
    workOrders,
    maintenance,
    getMachineStats,
    calculateAreaOEE,
    capacityData,
    workforceData
  } = useData();

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryType, setEntryType] = useState('production');

  const stats = getMachineStats();
  const pcp1OEE = calculateAreaOEE('PCP-1');
  const pcp2OEE = calculateAreaOEE('PCP-2');
  const overallOEE = (pcp1OEE + pcp2OEE) / 2;

  // Active alerts count
  const activeAlerts = Object.values(machines).filter(
    m => m.status === 'stopped' || m.status === 'maintenance'
  ).length;

  // Urgent work orders
  const urgentOrders = workOrders.filter(wo => wo.priority === 'high' && wo.status !== 'completed');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #2E2D2C 0%, #1A1918 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #FEF5E6 100%)',
          border: `1px solid ${colors.border}`,
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(243, 146, 0, 0.08)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 60 60" className="w-full h-full">
            <circle cx="30" cy="30" r="28" fill={isDark ? '#F39200' : '#2E2D2C'} />
            <circle cx="30" cy="18" r="5.5" fill="#F39200" />
            <circle cx="20" cy="26" r="5.5" fill="#F39200" />
            <circle cx="40" cy="26" r="5.5" fill="#F39200" />
            <circle cx="18" cy="38" r="5.5" fill="#F39200" />
            <circle cx="30" cy="38" r="5.5" fill="#F39200" />
            <circle cx="42" cy="38" r="5.5" fill="#F39200" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {t('header.title')}
            </h1>
            <p style={{ color: colors.textSecondary }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEntryType('production'); setShowEntryForm(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(243, 146, 0, 0.3)',
              }}
            >
              <Plus className="w-4 h-4" />
              Production Log
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEntryType('downtime'); setShowEntryForm(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                background: 'rgba(243, 146, 0, 0.1)',
                color: '#CC7A00',
                border: '1px solid rgba(243, 146, 0, 0.3)',
              }}
            >
              <Clock className="w-4 h-4" />
              Downtime Log
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEntryType('scrap'); setShowEntryForm(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#DC2626',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <Package className="w-4 h-4" />
              Scrap Entry
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Running Machines"
            value={stats.running}
            unit={`/ ${stats.total}`}
            icon={Factory}
            color="green"
            change={5}
            changeType="increase"
            onClick={() => onNavigate('shopFloor')}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Overall OEE"
            value={overallOEE.toFixed(1)}
            unit="%"
            icon={Activity}
            color="orange"
            change={2.3}
            changeType="increase"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Maintenance Tasks"
            value={maintenance.filter(m => m.status === 'in-progress').length}
            unit="active"
            icon={Wrench}
            color="purple"
            onClick={() => onNavigate('maintenanceDashboard')}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Active Alerts"
            value={activeAlerts}
            unit="issues"
            icon={AlertTriangle}
            color={activeAlerts > 3 ? 'red' : 'yellow'}
            change={activeAlerts > 0 ? 10 : 0}
            changeType={activeAlerts > 0 ? 'increase' : 'neutral'}
          />
        </motion.div>
      </motion.div>

      {/* OEE and Capacity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OEE Gauges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 rounded-2xl p-6"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 2px 12px rgba(0, 0, 0, 0.2)' : '0 2px 12px rgba(46, 45, 44, 0.06)',
          }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
            Overall Equipment Effectiveness
          </h3>
          <div className="flex justify-center">
            <OEEGauge value={overallOEE} size={180} title="Overall OEE" />
          </div>
        </motion.div>

        {/* Capacity Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 2px 12px rgba(0, 0, 0, 0.2)' : '0 2px 12px rgba(46, 45, 44, 0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{t('capacity.title')}</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('capacityPlanning')}
              className="flex items-center gap-1 text-sm"
              style={{ color: '#F39200' }}
            >
              View Details <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-6">
            {/* PCP-1 */}
            <CapacityBar
              label="PCP-1 (LV Cables)"
              current={capacityData['PCP-1'].actualProduction}
              max={capacityData['PCP-1'].designCapacity}
              color="orange"
              oee={pcp1OEE}
              colors={colors}
            />
            {/* PCP-2 */}
            <CapacityBar
              label="PCP-2 (BSI Cables)"
              current={capacityData['PCP-2'].actualProduction}
              max={capacityData['PCP-2'].designCapacity}
              color="dark"
              oee={pcp2OEE}
              colors={colors}
            />
          </div>

          {/* Workforce Summary */}
          <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${colors.border}` }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: colors.bgTertiary }}>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(243, 146, 0, 0.15)' }}>
                  <Users className="w-5 h-5" style={{ color: '#F39200' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Total On Shift</p>
                  <p className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    {workforceData['PCP-1'].onShift + workforceData['PCP-2'].onShift}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF5E6' }}>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Total Vacancies</p>
                  <p className="text-xl font-bold text-red-500">
                    {workforceData['PCP-1'].vacancies + workforceData['PCP-2'].vacancies}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Production Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionChart type="area" title="Today's Production" />
        <ProductionChart type="bar" title="Weekly Overview" />
      </div>

      {/* Urgent Orders & Machine Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-6"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 2px 12px rgba(0, 0, 0, 0.2)' : '0 2px 12px rgba(46, 45, 44, 0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <Target className="w-5 h-5" style={{ color: '#F39200' }} />
              Urgent Orders
            </h3>
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(243, 146, 0, 0.15)', color: '#F39200' }}
            >
              {urgentOrders.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {urgentOrders.slice(0, 4).map((order) => (
              <motion.div
                key={order.id}
                whileHover={{ scale: 1.02, borderColor: '#F39200' }}
                className="p-4 rounded-xl cursor-pointer transition-colors"
                style={{
                  background: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                }}
                onClick={() => onNavigate('scheduling')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: colors.textPrimary }}>{order.id}</span>
                  <span className="text-xs" style={{ color: '#F39200' }}>{order.dueDate}</span>
                </div>
                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{order.product}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #F39200, #FFB84D)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${order.progress}%` }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>{order.progress}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Critical Machines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 2px 12px rgba(0, 0, 0, 0.2)' : '0 2px 12px rgba(46, 45, 44, 0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <Zap className="w-5 h-5" style={{ color: '#F39200' }} />
              Critical Machine Status
            </h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('shopFloor')}
              className="flex items-center gap-1 text-sm"
              style={{ color: '#F39200' }}
            >
              View All <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(machines)
              .filter(m => m.status !== 'running')
              .slice(0, 4)
              .map((machine) => (
                <MachineCard
                  key={machine.id}
                  machine={machine}
                  onViewDetails={(m) => setSelectedMachine(m)}
                  onStatusChange={(m) => {
                    setSelectedMachine(m);
                    setEntryType('downtime');
                    setShowEntryForm(true);
                  }}
                />
              ))}
          </div>
        </motion.div>
      </div>

      {/* Machine Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          boxShadow: isDark ? '0 2px 12px rgba(0, 0, 0, 0.2)' : '0 2px 12px rgba(46, 45, 44, 0.06)',
        }}
      >
        <ProductionChart type="pie" title="Machine Status Distribution" />
      </motion.div>

      {/* Manual Entry Form Modal */}
      <AnimatePresence>
        {showEntryForm && (
          <ManualEntryForm
            type={entryType}
            machine={selectedMachine}
            onClose={() => {
              setShowEntryForm(false);
              setSelectedMachine(null);
            }}
            onSubmit={(data) => {
              console.log('Form submitted:', data);
              setShowEntryForm(false);
              setSelectedMachine(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Capacity Bar Component - Saudi Cable Theme
const CapacityBar = ({ label, current, max, color, oee, colors }) => {
  const percentage = (current / max) * 100;

  const colorStyles = {
    orange: { gradient: 'linear-gradient(90deg, #F39200, #FFB84D)', text: '#F39200' },
    dark: { gradient: 'linear-gradient(90deg, #2E2D2C, #4A4948)', text: colors?.textPrimary || '#2E2D2C' },
    green: { gradient: 'linear-gradient(90deg, #10B981, #34D399)', text: '#10B981' },
  };

  const style = colorStyles[color] || colorStyles.orange;

  // Determine text color based on position relative to progress bar
  // If percentage is high enough that text would be on the bar, use red
  // Otherwise use black
  const getTextColor = () => {
    if (percentage >= 45) {
      // Text is covered by the bar - use red
      return '#EF4444';
    } else {
      // Text is on the background (not covered) - use black
      return '#000000';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{label}</span>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: colors?.textSecondary || '#666564' }}>
            {current.toLocaleString()} / {max.toLocaleString()} MT
          </span>
          <span className="text-sm font-medium" style={{ color: style.text }}>
            OEE: {oee.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-4 rounded-full overflow-hidden relative" style={{ background: colors?.border || '#EAEAEA' }}>
        <motion.div
          className="h-full rounded-full progress-bar"
          style={{ background: style.gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xs font-bold"
            style={{
              color: getTextColor(),
              textShadow: percentage >= 45 ? '0 1px 2px rgba(255,255,255,0.5)' : 'none'
            }}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
