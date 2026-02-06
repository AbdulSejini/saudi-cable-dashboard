import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Activity,
  Thermometer,
  Gauge,
  User,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Wrench,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MachineCard = ({ machine, onStatusChange, onViewDetails }) => {
  const { t } = useLanguage();
  const { isDark, colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    running: {
      color: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: Play,
      label: t('machines.running'),
      pulse: true
    },
    idle: {
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: Pause,
      label: t('machines.idle'),
      pulse: true
    },
    stopped: {
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertTriangle,
      label: t('machines.stopped'),
      pulse: false
    },
    maintenance: {
      color: 'from-purple-500 to-violet-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: Wrench,
      label: t('machines.maintenance'),
      pulse: true
    }
  };

  const config = statusConfig[machine.status] || statusConfig.stopped;
  const StatusIcon = config.icon;

  const speedPercentage = machine.targetSpeed > 0
    ? (machine.speed / machine.targetSpeed) * 100
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-sm hover:shadow-lg"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`
      }}
    >
      {/* Status Indicator Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.color}`} />

      {/* Pulse Effect for Running/Active Machines */}
      {config.pulse && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-5`}
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{machine.id}</h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>{machine.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={config.pulse ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}
            >
              <StatusIcon className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Speed Gauge */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span style={{ color: colors.textSecondary }}>{t('machines.speed')}</span>
            <span className="font-semibold" style={{ color: colors.textPrimary }}>
              {machine.speed.toFixed(1)} / {machine.targetSpeed} m/s
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
            <motion.div
              className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(speedPercentage, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg" style={{ background: colors.bgTertiary }}>
            <Thermometer className="w-4 h-4 mx-auto mb-1" style={{ color: '#F39200' }} />
            <p className="text-xs" style={{ color: colors.textSecondary }}>{t('machines.temperature')}</p>
            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{machine.temperature}°C</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: colors.bgTertiary }}>
            <Gauge className="w-4 h-4 mx-auto mb-1" style={{ color: '#3B82F6' }} />
            <p className="text-xs" style={{ color: colors.textSecondary }}>{t('machines.oee')}</p>
            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{machine.oee}%</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: colors.bgTertiary }}>
            <Activity className="w-4 h-4 mx-auto mb-1" style={{ color: '#10B981' }} />
            <p className="text-xs" style={{ color: colors.textSecondary }}>{t('machines.efficiency')}</p>
            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{speedPercentage.toFixed(0)}%</p>
          </div>
        </div>

        {/* Operator Info */}
        {machine.operator && (
          <div className="flex items-center gap-2 p-2 rounded-lg mb-3" style={{ background: colors.bgTertiary }}>
            <User className="w-4 h-4" style={{ color: colors.textSecondary }} />
            <span className="text-sm" style={{ color: colors.textPrimary }}>{machine.operator}</span>
          </div>
        )}

        {/* Expand Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg transition-colors"
          style={{ background: colors.bgTertiary, color: colors.textSecondary }}
        >
          <span className="text-sm">{isExpanded ? 'Less Details' : 'More Details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.button>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Area</span>
                  <span className="text-sm" style={{ color: colors.textPrimary }}>{machine.area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Type</span>
                  <span className="text-sm capitalize" style={{ color: colors.textPrimary }}>{machine.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Status</span>
                  <span
                    className="text-sm px-2 py-1 rounded-full capitalize"
                    style={{
                      background: isDark ? 'rgba(243, 146, 0, 0.15)' : config.bg.replace('bg-', ''),
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary
                    }}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onViewDetails?.(machine)}
                    className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#3B82F6'
                    }}
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onStatusChange?.(machine)}
                    className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: colors.bgTertiary,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary
                    }}
                  >
                    Log Entry
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MachineCard;
