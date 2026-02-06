import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({
  title,
  value,
  unit,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
  onClick,
  animate = true,
  size = 'default'
}) => {
  const { isDark, colors: themeColors } = useTheme();

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'from-blue-500 to-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'from-green-500 to-green-600',
      text: 'text-green-600'
    },
    yellow: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'from-amber-500 to-orange-500',
      text: 'text-amber-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'from-orange-500 to-orange-600',
      text: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'from-red-500 to-red-600',
      text: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'from-purple-500 to-purple-600',
      text: 'text-purple-600'
    },
    cyan: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      icon: 'from-cyan-500 to-cyan-600',
      text: 'text-cyan-600'
    }
  };

  const sizeClasses = {
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const getTrendIcon = () => {
    if (changeType === 'increase') return <TrendingUp className="w-4 h-4" />;
    if (changeType === 'decrease') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (changeType === 'increase') return 'text-green-600';
    if (changeType === 'decrease') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -5 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300
        shadow-sm hover:shadow-lg
      `}
      style={{
        background: themeColors.bgCard,
        border: `1px solid ${themeColors.border}`
      }}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br ${colors.icon} rounded-full blur-3xl opacity-10`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.icon} shadow-lg`}>
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 ${getTrendColor()} text-sm font-medium`}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>{title}</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
              style={{ color: themeColors.textPrimary }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </motion.span>
            {unit && <span className="text-sm" style={{ color: themeColors.textSecondary }}>{unit}</span>}
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.icon}`}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  );
};

export default StatCard;
