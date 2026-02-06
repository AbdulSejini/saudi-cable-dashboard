import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const OEEGauge = ({ value = 0, size = 200, title = 'OEE', showBreakdown = true }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { isDark, colors: themeColors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  const getGaugeColor = (val) => {
    if (val >= 85) return { stroke: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (val >= 60) return { stroke: '#F39200', bg: 'rgba(243, 146, 0, 0.1)' };
    return { stroke: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const gaugeColors = getGaugeColor(animatedValue);

  // Simulated breakdown values
  const availability = Math.min(100, value * 1.1);
  const performance = Math.min(100, value * 0.95);
  const quality = Math.min(100, value * 1.05);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Outer glow */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gaugeColors.stroke} stopOpacity="1" />
              <stop offset="100%" stopColor={gaugeColors.stroke} stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={themeColors.border}
            strokeWidth="12"
          />

          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            filter="url(#glow)"
          />

          {/* Tick marks */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = size / 2 + (radius - 15) * Math.cos(angle);
            const y1 = size / 2 + (radius - 15) * Math.sin(angle);
            const x2 = size / 2 + (radius - 8) * Math.cos(angle);
            const y2 = size / 2 + (radius - 8) * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={themeColors.borderHover}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color: themeColors.textPrimary }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {animatedValue.toFixed(1)}
          </motion.span>
          <span className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>%</span>
          <span className="text-xs mt-1" style={{ color: themeColors.textMuted }}>{title}</span>
        </div>

        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${themeColors.bgTertiary}` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 w-full max-w-xs space-y-3"
        >
          <BreakdownBar
            label="Availability"
            value={availability}
            color="from-blue-500 to-blue-600"
            delay={0.9}
          />
          <BreakdownBar
            label="Performance"
            value={performance}
            color="from-green-500 to-green-600"
            delay={1.0}
          />
          <BreakdownBar
            label="Quality"
            value={quality}
            color="from-purple-500 to-purple-600"
            delay={1.1}
          />
        </motion.div>
      )}
    </div>
  );
};

const BreakdownBar = ({ label, value, color, delay }) => {
  const { colors: themeColors } = useTheme();

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span style={{ color: themeColors.textSecondary }}>{label}</span>
        <span className="font-medium" style={{ color: themeColors.textPrimary }}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: themeColors.border }}>
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default OEEGauge;
