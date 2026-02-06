import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import OEEGauge from '../components/Dashboard/OEEGauge';
import ProductionChart from '../components/Charts/ProductionChart';
import {
  Factory,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  Clock
} from 'lucide-react';

const CapacityPlanning = () => {
  const { t } = useLanguage();
  const { capacityData, workforceData, calculateAreaOEE, getMachinesByArea } = useData();
  const { isDark, colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ];

  const plants = [
    {
      id: 'PCP-1',
      name: 'PCP-1 (LV Cables)',
      designCapacity: 36000,
      actualProduction: 9000,
      color: '#3B82F6',
      workforce: workforceData['PCP-1'],
    },
    {
      id: 'PCP-2',
      name: 'PCP-2 (BSI Cables)',
      designCapacity: 7800,
      actualProduction: 1950,
      color: '#10B981',
      workforce: workforceData['PCP-2'],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{t('capacity.title')}</h1>
          <p style={{ color: colors.textSecondary }}>Monitor and optimize production capacity utilization</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          {periods.map((period) => (
            <motion.button
              key={period.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPeriod(period.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedPeriod === period.id ? 'rgba(59, 130, 246, 0.2)' : colors.bgTertiary,
                color: selectedPeriod === period.id ? '#3B82F6' : colors.textSecondary,
                border: selectedPeriod === period.id ? '1px solid rgba(59, 130, 246, 0.3)' : `1px solid ${colors.border}`,
              }}
            >
              {period.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <SummaryCard
          icon={<Factory className="w-6 h-6 text-blue-400" />}
          title="Total Capacity"
          value="43,800"
          unit="MT/Year"
          color="blue"
          colors={colors}
        />
        <SummaryCard
          icon={<TrendingUp className="w-6 h-6 text-green-400" />}
          title="Actual Production"
          value="10,950"
          unit="MT/Year"
          color="green"
          change={5.2}
          changeType="increase"
          colors={colors}
        />
        <SummaryCard
          icon={<Target className="w-6 h-6 text-yellow-400" />}
          title="Utilization Rate"
          value="25%"
          color="yellow"
          change={-2.1}
          changeType="decrease"
          colors={colors}
        />
        <SummaryCard
          icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
          title="Capacity Gap"
          value="32,850"
          unit="MT/Year"
          color="red"
          colors={colors}
        />
      </motion.div>

      {/* Plant Capacity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plants.map((plant) => {
          const utilization = (plant.actualProduction / plant.designCapacity) * 100;
          const oee = calculateAreaOEE(plant.id);
          const machines = getMachinesByArea(plant.id);
          const runningMachines = machines.filter(m => m.status === 'running').length;

          return (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              {/* Header */}
              <div
                className="p-6"
                style={{
                  background: `linear-gradient(135deg, ${plant.color}15, transparent)`,
                  borderBottom: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{plant.name}</h3>
                    <p style={{ color: colors.textSecondary }}>Production Plant</p>
                  </div>
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: `${plant.color}20` }}
                  >
                    <Factory className="w-8 h-8" style={{ color: plant.color }} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Capacity Bars */}
                <div className="space-y-4 mb-6">
                  <CapacityIndicator
                    label={t('capacity.designCapacity')}
                    value={plant.designCapacity}
                    max={plant.designCapacity}
                    color={plant.color}
                    unit="MT"
                    colors={colors}
                  />
                  <CapacityIndicator
                    label={t('capacity.actualProduction')}
                    value={plant.actualProduction}
                    max={plant.designCapacity}
                    color={plant.color}
                    unit="MT"
                    colors={colors}
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatBox
                    label="Utilization"
                    value={`${utilization.toFixed(1)}%`}
                    icon={<PieChart className="w-4 h-4" />}
                    colors={colors}
                  />
                  <StatBox
                    label="OEE"
                    value={`${oee.toFixed(1)}%`}
                    icon={<BarChart3 className="w-4 h-4" />}
                    colors={colors}
                  />
                  <StatBox
                    label="Machines"
                    value={`${runningMachines}/${machines.length}`}
                    icon={<Zap className="w-4 h-4" />}
                    colors={colors}
                  />
                </div>

                {/* Workforce */}
                <div className="p-4 rounded-xl" style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5" style={{ color: colors.textMuted }} />
                    <span className="font-medium" style={{ color: colors.textPrimary }}>Workforce Status</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>Total</p>
                      <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>{plant.workforce.total}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>On Shift</p>
                      <p className="text-lg font-bold text-green-500">{plant.workforce.onShift}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>Vacancies</p>
                      <p className="text-lg font-bold text-red-500">{plant.workforce.vacancies}</p>
                    </div>
                  </div>
                </div>

                {/* Loss Analysis */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-3" style={{ color: colors.textSecondary }}>Capacity Loss Breakdown</h4>
                  <div className="space-y-2">
                    <LossBar label="Workforce Shortage" value={35} color="red" colors={colors} />
                    <LossBar label="Equipment Downtime" value={20} color="yellow" colors={colors} />
                    <LossBar label="Material Availability" value={10} color="orange" colors={colors} />
                    <LossBar label="Quality Issues" value={10} color="purple" colors={colors} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* OEE Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>PCP-1 OEE</h3>
          <OEEGauge value={calculateAreaOEE('PCP-1')} size={160} showBreakdown={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Combined OEE</h3>
          <OEEGauge
            value={(calculateAreaOEE('PCP-1') + calculateAreaOEE('PCP-2')) / 2}
            size={180}
            showBreakdown
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>PCP-2 OEE</h3>
          <OEEGauge value={calculateAreaOEE('PCP-2')} size={160} showBreakdown={false} />
        </motion.div>
      </div>

      {/* Production Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionChart type="area" title="Production Trend (Today)" />
        <ProductionChart type="bar" title="Weekly Comparison" />
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
          <Zap className="w-5 h-5 text-yellow-400" />
          Recommendations for Capacity Improvement
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RecommendationCard
            priority="high"
            title="Address Workforce Shortage"
            description="Fill critical vacancies in PCP-1 and PCP-2 to increase operational capacity by up to 20%."
            impact="+7,200 MT/Year"
            colors={colors}
          />
          <RecommendationCard
            priority="medium"
            title="Reduce Unplanned Downtime"
            description="Implement predictive maintenance to reduce equipment failures and improve availability."
            impact="+4,380 MT/Year"
            colors={colors}
          />
          <RecommendationCard
            priority="low"
            title="Optimize Changeover Time"
            description="Apply SMED methodology to reduce setup times and increase productive hours."
            impact="+2,190 MT/Year"
            colors={colors}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, title, value, unit, color, change, changeType, colors }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ background: colors?.bgTertiary || 'rgba(255,255,255,0.1)' }}>{icon}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            changeType === 'increase' ? 'text-green-500' : 'text-red-500'
          }`}>
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm mb-1" style={{ color: colors?.textSecondary || '#666564' }}>{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{value}</span>
        {unit && <span className="text-sm" style={{ color: colors?.textSecondary || '#666564' }}>{unit}</span>}
      </div>
    </motion.div>
  );
};

// Capacity Indicator Component
const CapacityIndicator = ({ label, value, max, color, unit, colors }) => {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span style={{ color: colors?.textSecondary || '#666564' }}>{label}</span>
        <span className="font-medium" style={{ color: colors?.textPrimary || '#2E2D2C' }}>
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: colors?.border || '#EAEAEA' }}>
        <motion.div
          className="h-full rounded-full progress-bar"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Stat Box Component
const StatBox = ({ label, value, icon, colors }) => (
  <div className="p-3 rounded-lg text-center" style={{ background: colors?.bgTertiary || '#F5F5F5' }}>
    <div className="flex items-center justify-center mb-1" style={{ color: colors?.textMuted || '#9C9A99' }}>{icon}</div>
    <p className="text-xs" style={{ color: colors?.textSecondary || '#666564' }}>{label}</p>
    <p className="text-lg font-bold" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{value}</p>
  </div>
);

// Loss Bar Component
const LossBar = ({ label, value, color, colors }) => {
  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-32 truncate" style={{ color: colors?.textSecondary || '#666564' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: colors?.border || '#EAEAEA' }}>
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs w-8" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{value}%</span>
    </div>
  );
};

// Recommendation Card Component
const RecommendationCard = ({ priority, title, description, impact, colors }) => {
  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    low: 'border-green-500/30 bg-green-500/5',
  };

  const priorityBadgeColors = {
    high: 'bg-red-500/20 text-red-500',
    medium: 'bg-yellow-500/20 text-yellow-600',
    low: 'bg-green-500/20 text-green-500',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border ${priorityColors[priority]} transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${priorityBadgeColors[priority]} capitalize`}>
          {priority} Priority
        </span>
        <span className="text-sm font-medium text-green-500">{impact}</span>
      </div>
      <h4 className="font-medium mb-2" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{title}</h4>
      <p className="text-sm" style={{ color: colors?.textSecondary || '#666564' }}>{description}</p>
    </motion.div>
  );
};

export default CapacityPlanning;
