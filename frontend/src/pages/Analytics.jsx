/**
 * Analytics Page
 * Saudi Cable Company - Advanced Analytics & Business Intelligence
 * With Real Factory Data and Animated Visualizations
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Factory,
  Package,
  Truck,
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  ArrowRight,
  Calendar,
  FileText,
} from 'lucide-react';

const COLORS = ['#F39200', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#F59E0B', '#EC4899'];

const Analytics = () => {
  const { t, isRTL } = useLanguage();
  const { isDark, colors } = useTheme();
  const { volumeDistribution, actualTransferData, wipMetalsData, factoryOutputData, capacityData } = useData();
  const [activeTab, setActiveTab] = useState('volume');
  const [selectedYear, setSelectedYear] = useState('y2025');

  // Volume Distribution Chart Data
  const volumeChartData = volumeDistribution.products.map(p => ({
    name: p.bpName,
    fullName: p.name,
    '2024': p.y2024,
    '2025': p.y2025,
    '2026': p.y2026,
    '2027': p.y2027,
  }));

  // Actual Transfer Chart Data
  const transferChartData = actualTransferData.products.map(p => ({
    name: p.name,
    CU: p.actual.cu,
    AL: p.actual.al,
    Total: p.actual.total,
  }));

  // Capacity Utilization Data
  const capacityChartData = [
    { name: 'LV', capacity: capacityData['LV'].designCapacity, actual: capacityData['LV'].actualProduction, fill: '#F39200' },
    { name: 'BSI', capacity: capacityData['BSI'].designCapacity, actual: capacityData['BSI'].actualProduction, fill: '#3B82F6' },
    { name: 'MV', capacity: capacityData['MV'].designCapacity, actual: capacityData['MV'].actualProduction, fill: '#10B981' },
    { name: 'HV', capacity: capacityData['HV'].designCapacity, actual: capacityData['HV'].actualProduction, fill: '#8B5CF6' },
    { name: 'PVC', capacity: capacityData['PVC'].designCapacity, actual: capacityData['PVC'].actualProduction, fill: '#EF4444' },
    { name: 'BW', capacity: capacityData['BW'].designCapacity, actual: capacityData['BW'].actualProduction, fill: '#06B6D4' },
  ];

  // WIP Data
  const wipChartData = wipMetalsData.workInProcess.aluminum.map((item, idx) => ({
    name: item.product,
    Aluminum: item.mt,
    Copper: wipMetalsData.workInProcess.copper[idx].mt,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl p-4 shadow-xl"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
          }}
        >
          <p className="font-semibold mb-2" style={{ color: colors.textPrimary }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span style={{ color: colors.textSecondary }}>{entry.name}:</span>
              <span className="font-medium" style={{ color: colors.textPrimary }}>
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value} MT
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'volume', label: 'Volume Distribution', icon: BarChart3 },
    { id: 'transfer', label: 'Actual Transfer', icon: Truck },
    { id: 'capacity', label: 'Capacity Analysis', icon: Factory },
    { id: 'wip', label: 'WIP & Metals', icon: Layers },
    { id: 'requirements', label: 'Requirements', icon: FileText },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {isRTL ? 'التحليلات والتقارير' : 'Analytics & Reports'}
          </h1>
          <p style={{ color: colors.textSecondary }}>
            {isRTL ? 'تحليلات متقدمة وذكاء الأعمال' : 'Advanced Analytics & Business Intelligence'}
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          {['2024', '2025', '2026', '2027'].map((year) => (
            <motion.button
              key={year}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedYear(`y${year}`)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={selectedYear === `y${year}` ? {
                background: 'linear-gradient(135deg, #F39200, #CC7A00)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(243, 146, 0, 0.3)'
              } : {
                background: colors.bgTertiary,
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`
              }}
            >
              {year}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              style={activeTab === tab.id ? {
                background: 'linear-gradient(135deg, #F39200, #CC7A00)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(243, 146, 0, 0.35)'
              } : {
                background: colors.bgCard,
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* Volume Distribution Tab */}
        {activeTab === 'volume' && (
          <motion.div
            key="volume"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: '2024 Total', value: volumeDistribution.totals.y2024, icon: Calendar, color: '#F39200' },
                { label: '2025 Target', value: volumeDistribution.totals.y2025, icon: Target, color: '#3B82F6' },
                { label: '2026 Plan', value: volumeDistribution.totals.y2026, icon: TrendingUp, color: '#10B981' },
                { label: '2027 Vision', value: volumeDistribution.totals.y2027, icon: Activity, color: '#8B5CF6' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="rounded-2xl p-5 relative overflow-hidden"
                    style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                      <div className="w-full h-full rounded-full" style={{ background: item.color }} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg" style={{ background: `${item.color}20` }}>
                          <Icon className="w-4 h-4" style={{ color: item.color }} />
                        </div>
                        <span className="text-sm" style={{ color: colors.textSecondary }}>{item.label}</span>
                      </div>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1, type: 'spring' }}
                        className="text-2xl font-bold"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.value.toLocaleString()} <span className="text-sm font-normal" style={{ color: colors.textMuted }}>MT</span>
                      </motion.p>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Main Chart */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  Volume Distribution by Product (MT)
                </h3>
                <div className="flex items-center gap-4">
                  {['2024', '2025', '2026', '2027'].map((year, idx) => (
                    <div key={year} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx] }} />
                      <span className="text-sm" style={{ color: colors.textSecondary }}>{year}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={volumeChartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                  <XAxis dataKey="name" stroke={colors.textSecondary} fontSize={12} />
                  <YAxis stroke={colors.textSecondary} fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="2024" fill="#F39200" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2025" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2026" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2027" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Product Details Table */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6 overflow-hidden"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Product Volume Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.textPrimary }}>BP Name</th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.textPrimary }}>Product</th>
                      <th className="text-right py-3 px-4 font-semibold" style={{ color: '#F39200' }}>2024</th>
                      <th className="text-right py-3 px-4 font-semibold" style={{ color: '#3B82F6' }}>2025</th>
                      <th className="text-right py-3 px-4 font-semibold" style={{ color: '#10B981' }}>2026</th>
                      <th className="text-right py-3 px-4 font-semibold" style={{ color: '#8B5CF6' }}>2027</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volumeDistribution.products.map((product, idx) => (
                      <motion.tr
                        key={product.bpName}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-opacity-50 transition-colors"
                        style={{ borderBottom: `1px solid ${colors.border}` }}
                        onMouseEnter={(e) => e.currentTarget.style.background = isDark ? 'rgba(243,146,0,0.1)' : 'rgba(243,146,0,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="py-3 px-4 font-medium" style={{ color: colors.textPrimary }}>{product.bpName}</td>
                        <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{product.name}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: colors.textPrimary }}>{product.y2024.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: colors.textPrimary }}>{product.y2025.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: colors.textPrimary }}>{product.y2026.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: colors.textPrimary }}>{product.y2027.toLocaleString()}</td>
                      </motion.tr>
                    ))}
                    <tr style={{ background: isDark ? 'rgba(243,146,0,0.15)' : 'rgba(243,146,0,0.1)' }}>
                      <td colSpan={2} className="py-3 px-4 font-bold" style={{ color: '#F39200' }}>TOTAL</td>
                      <td className="py-3 px-4 text-right font-bold font-mono" style={{ color: '#F39200' }}>{volumeDistribution.totals.y2024.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold font-mono" style={{ color: '#F39200' }}>{volumeDistribution.totals.y2025.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold font-mono" style={{ color: '#F39200' }}>{volumeDistribution.totals.y2026.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold font-mono" style={{ color: '#F39200' }}>{volumeDistribution.totals.y2027.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Actual Transfer Tab */}
        {activeTab === 'transfer' && (
          <motion.div
            key="transfer"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Transfer Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6 text-center"
                style={{ background: 'linear-gradient(135deg, #F39200, #CC7A00)' }}
              >
                <p className="text-white/80 mb-2">Copper (CU) Total</p>
                <motion.p
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  {actualTransferData.totals.actual.cu} MT
                </motion.p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6 text-center"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
              >
                <p className="text-white/80 mb-2">Aluminum (AL) Total</p>
                <motion.p
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                >
                  {actualTransferData.totals.actual.al} MT
                </motion.p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6 text-center"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                <p className="text-white/80 mb-2">Grand Total</p>
                <motion.p
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.4 }}
                >
                  {actualTransferData.totals.actual.total} MT
                </motion.p>
              </motion.div>
            </div>

            {/* Transfer Chart */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
                Actual Transfer - Month of {actualTransferData.month}
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={transferChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                  <XAxis dataKey="name" stroke={colors.textSecondary} fontSize={11} angle={-20} textAnchor="end" height={60} />
                  <YAxis stroke={colors.textSecondary} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="CU" fill="#F39200" radius={[4, 4, 0, 0]} name="Copper (CU)" />
                  <Bar dataKey="AL" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Aluminum (AL)" />
                  <Line type="monotone" dataKey="Total" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 5 }} name="Total" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {/* Capacity Analysis Tab */}
        {activeTab === 'capacity' && (
          <motion.div
            key="capacity"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Capacity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(243,146,0,0.15)' }}>
                    <Factory className="w-6 h-6" style={{ color: '#F39200' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>LV & BSI Total</p>
                    <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>45,000 MT</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.textSecondary }}>LV: 30,000 MT</span>
                    <span style={{ color: colors.textSecondary }}>BSI: 7,900 MT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.textSecondary }}>Bare Copper: 7,100 MT</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.15)' }}>
                    <Activity className="w-6 h-6" style={{ color: '#3B82F6' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>MV/HV Total</p>
                    <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>15,000 MT</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.textSecondary }}>MV: 8,100 MT</span>
                    <span style={{ color: colors.textSecondary }}>HV: 6,900 MT</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <Package className="w-6 h-6" style={{ color: '#10B981' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>PVC Plant</p>
                    <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>22,000 MT</p>
                  </div>
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Material Production Capacity
                </div>
              </motion.div>
            </div>

            {/* Capacity Utilization Chart */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
                Capacity Utilization by Section
              </h3>
              <div className="space-y-4">
                {capacityChartData.map((item, idx) => {
                  const utilization = (item.actual / item.capacity) * 100;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium" style={{ color: colors.textPrimary }}>{item.name}</span>
                        <span style={{ color: colors.textSecondary }}>
                          {item.actual.toLocaleString()} / {item.capacity.toLocaleString()} MT ({utilization.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-6 rounded-full overflow-hidden relative" style={{ background: colors.border }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.fill }}
                          initial={{ width: 0 }}
                          animate={{ width: `${utilization}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white drop-shadow-md">{utilization.toFixed(1)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Free Capacity */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6 text-center"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))'
                  : 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))',
                border: '1px solid rgba(16,185,129,0.3)'
              }}
            >
              <p className="text-lg mb-2" style={{ color: '#10B981' }}>Available Free Capacity</p>
              <motion.p
                className="text-5xl font-bold"
                style={{ color: '#10B981' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                33%
              </motion.p>
              <p className="mt-2" style={{ color: colors.textSecondary }}>Ready for additional orders</p>
            </motion.div>
          </motion.div>
        )}

        {/* WIP & Metals Tab */}
        {activeTab === 'wip' && (
          <motion.div
            key="wip"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Stock Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6"
                style={{ background: 'linear-gradient(135deg, #6B7280, #4B5563)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-white/20">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80">Stock of Aluminum</p>
                    <motion.p
                      className="text-4xl font-bold text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {wipMetalsData.stockOfMetals.aluminum} MT
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6"
                style={{ background: 'linear-gradient(135deg, #F39200, #CC7A00)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-white/20">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80">Stock of Copper</p>
                    <motion.p
                      className="text-4xl font-bold text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {wipMetalsData.stockOfMetals.copper} MT
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* WIP Chart */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
                Work In Process by Product
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={wipChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                  <XAxis type="number" stroke={colors.textSecondary} />
                  <YAxis dataKey="name" type="category" stroke={colors.textSecondary} width={120} fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Aluminum" fill="#6B7280" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Copper" fill="#F39200" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <h4 className="font-semibold mb-4" style={{ color: colors.textPrimary }}>WIP Totals</h4>
                <div className="flex justify-between items-center py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ color: colors.textSecondary }}>Aluminum Total</span>
                  <span className="font-bold text-lg" style={{ color: colors.textPrimary }}>{wipMetalsData.workInProcess.totals.aluminum} MT</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span style={{ color: colors.textSecondary }}>Copper Total</span>
                  <span className="font-bold text-lg" style={{ color: '#F39200' }}>{wipMetalsData.workInProcess.totals.copper} MT</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-2xl p-6"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <h4 className="font-semibold mb-4" style={{ color: colors.textPrimary }}>Data Info</h4>
                <p style={{ color: colors.textSecondary }}>
                  As of: <span className="font-medium" style={{ color: colors.textPrimary }}>{wipMetalsData.asOfDate}</span>
                </p>
                <p className="mt-2" style={{ color: colors.textSecondary }}>
                  Metals Received: <span className="font-medium" style={{ color: colors.textPrimary }}>
                    AL: {wipMetalsData.metalsReceived.aluminum} MT | CU: {wipMetalsData.metalsReceived.copper} MT
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <motion.div
            key="requirements"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Total Requirements */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              }}
            >
              <p className="text-white/80 mb-2">Total Financial Requirements</p>
              <motion.p
                className="text-5xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {(factoryOutputData.totalRequirements / 1000000).toFixed(1)} MSR
              </motion.p>
              <p className="text-white/60 mt-2">Saudi Riyals (Million)</p>
            </motion.div>

            {/* Requirements List */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
                Detailed Requirements
              </h3>
              <div className="space-y-4">
                {factoryOutputData.requirements.map((req, idx) => (
                  <motion.div
                    key={req.item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: colors.bgTertiary }}
                  >
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: colors.textPrimary }}>{req.item}</p>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{req.by}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{ color: '#F39200' }}>
                        {(req.req / 1000000).toFixed(1)} MSR
                      </p>
                      <p className="text-sm" style={{ color: colors.textMuted }}>Due: {req.sr}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Potential Orders */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
                Potential Orders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {factoryOutputData.potential.map((order, idx) => (
                  <motion.div
                    key={order.customer}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl flex items-center justify-between"
                    style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}` }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: colors.textPrimary }}>{order.customer}</p>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{order.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl" style={{ color: '#10B981' }}>{order.mt.toLocaleString()}</p>
                      <p className="text-sm" style={{ color: colors.textMuted }}>MT</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl" style={{ background: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)' }}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold" style={{ color: '#10B981' }}>Total Potential</span>
                  <span className="text-2xl font-bold" style={{ color: '#10B981' }}>
                    {factoryOutputData.potential.reduce((sum, o) => sum + o.mt, 0).toLocaleString()} MT
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Backlog Summary */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
                Order Backlog
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl" style={{ background: colors.bgTertiary }}>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>SEC & Others</p>
                  <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{factoryOutputData.backlog.secOthers.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: colors.bgTertiary }}>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>JCC</p>
                  <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{factoryOutputData.backlog.jcc.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: colors.bgTertiary }}>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>LV & BW Items</p>
                  <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{factoryOutputData.backlog.lvbwItems.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(243,146,0,0.15)' }}>
                  <p className="text-sm" style={{ color: '#F39200' }}>Total Plan 2023</p>
                  <p className="text-2xl font-bold" style={{ color: '#F39200' }}>{factoryOutputData.backlog.totalPlan2023.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analytics;
