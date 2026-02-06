import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Sample production data
const dailyProduction = [
  { time: '06:00', pcp1: 12, pcp2: 8, target: 15 },
  { time: '08:00', pcp1: 18, pcp2: 12, target: 20 },
  { time: '10:00', pcp1: 24, pcp2: 15, target: 25 },
  { time: '12:00', pcp1: 28, pcp2: 18, target: 30 },
  { time: '14:00', pcp1: 35, pcp2: 22, target: 35 },
  { time: '16:00', pcp1: 42, pcp2: 26, target: 40 },
  { time: '18:00', pcp1: 48, pcp2: 30, target: 45 },
  { time: '20:00', pcp1: 52, pcp2: 33, target: 50 },
  { time: '22:00', pcp1: 58, pcp2: 36, target: 55 },
];

const weeklyData = [
  { day: 'Sat', production: 320, target: 400, scrap: 25 },
  { day: 'Sun', production: 380, target: 400, scrap: 18 },
  { day: 'Mon', production: 420, target: 400, scrap: 22 },
  { day: 'Tue', production: 390, target: 400, scrap: 30 },
  { day: 'Wed', production: 410, target: 400, scrap: 15 },
  { day: 'Thu', production: 350, target: 400, scrap: 28 },
  { day: 'Fri', production: 0, target: 0, scrap: 0 },
];

const machineDistribution = [
  { name: 'Running', value: 18 },
  { name: 'Idle', value: 5 },
  { name: 'Stopped', value: 3 },
  { name: 'Maintenance', value: 2 },
];

const CustomTooltip = ({ active, payload, label, colors }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-3"
        style={{
          background: colors?.bgCard || 'white',
          border: `1px solid ${colors?.border || '#EAEAEA'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <p className="font-medium mb-2" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: colors?.textSecondary || '#666564' }}>{entry.name}:</span>
            <span className="font-medium" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ProductionChart = ({ type = 'area', title }) => {
  const [timeRange, setTimeRange] = useState('day');
  const { isDark, colors } = useTheme();

  const gridStroke = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(46,45,44,0.1)';
  const axisStroke = colors.textSecondary;

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyProduction}>
              <defs>
                <linearGradient id="colorPcp1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPcp2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="time"
                stroke={axisStroke}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke={axisStroke}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip colors={colors} />} />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#6B7280"
                strokeDasharray="5 5"
                fill="none"
                strokeWidth={2}
                name="Target"
              />
              <Area
                type="monotone"
                dataKey="pcp1"
                stroke="#3B82F6"
                fill="url(#colorPcp1)"
                strokeWidth={2}
                name="PCP-1"
              />
              <Area
                type="monotone"
                dataKey="pcp2"
                stroke="#10B981"
                fill="url(#colorPcp2)"
                strokeWidth={2}
                name="PCP-2"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="day"
                stroke={axisStroke}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke={axisStroke}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip colors={colors} />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span style={{ color: colors.textPrimary }}>{value}</span>}
              />
              <Bar
                dataKey="production"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Production"
              />
              <Bar
                dataKey="scrap"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                name="Scrap"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={machineDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {machineDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip colors={colors} />} />
              <Legend
                formatter={(value) => <span style={{ color: colors.textPrimary }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{title}</h3>
        <div className="flex items-center gap-2">
          {['day', 'week', 'month'].map((range) => (
            <motion.button
              key={range}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeRange(range)}
              className="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              style={timeRange === range
                ? { background: 'rgba(243, 146, 0, 0.15)', color: '#F39200', border: '1px solid rgba(243, 146, 0, 0.3)' }
                : { background: colors.bgTertiary, color: colors.textSecondary, border: `1px solid ${colors.border}` }
              }
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
      {renderChart()}
    </motion.div>
  );
};

export default ProductionChart;
