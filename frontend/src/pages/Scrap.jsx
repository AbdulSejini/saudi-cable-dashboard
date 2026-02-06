/**
 * Scrap Page
 * Scrap tracking, financial valuation, and analysis
 * Saudi Cable Company - Real Factory Data
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Package,
  Scale,
  Coins,
  RefreshCcw,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Factory,
} from 'lucide-react';

// Animation variants
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

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label, colors, isDark }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
      active ? 'text-white' : ''
    }`}
    style={{
      background: active
        ? 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)'
        : isDark ? colors.bgTertiary : '#F5F5F5',
      color: active ? '#FFFFFF' : colors.textSecondary,
      border: `1px solid ${active ? 'transparent' : colors.border}`,
    }}
  >
    <Icon className="w-4 h-4" />
    {label}
  </motion.button>
);

const Scrap = () => {
  const { t, isRTL } = useLanguage();
  const { isDark, colors } = useTheme();
  const { kpiData } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lmePrice, setLmePrice] = useState(8500);

  // Scrap data from KPI (Target: 2.5%)
  const scrapTarget = kpiData.kpis.find(k => k.name === 'Scrap (Production)')?.target2023 || 2.5;
  const scrapActual2022 = kpiData.kpis.find(k => k.name === 'Scrap (Production)')?.actual2022 || 2.43;

  // Summary data
  const [summary, setSummary] = useState({
    totalWeight: 1250,
    copperContent: 875,
    financialValue: 7437.50,
    scrapRate: 2.35,
    monthlyTarget: scrapTarget,
    recoveryRate: 70,
  });

  // Scrap entries
  const [scrapEntries, setScrapEntries] = useState([
    { id: 'SC-001', time: '10:45 AM', date: '2024-02-05', machine: 'BC-1', type: 'Cable Ends', weight: 45, copper: 32, operator: 'Ahmed Ali' },
    { id: 'SC-002', time: '10:30 AM', date: '2024-02-05', machine: 'XT-12', type: 'Insulation Strip', weight: 28, copper: 20, operator: 'Mohammed Hassan' },
    { id: 'SC-003', time: '10:15 AM', date: '2024-02-05', machine: 'XL-3', type: 'Setup Waste', weight: 35, copper: 25, operator: 'Khalid Omar' },
    { id: 'SC-004', time: '09:45 AM', date: '2024-02-05', machine: 'BC-2', type: 'Damaged Sections', weight: 52, copper: 36, operator: 'Saeed Ahmed' },
    { id: 'SC-005', time: '09:30 AM', date: '2024-02-05', machine: 'AR-2', type: 'Cable Ends', weight: 38, copper: 27, operator: 'Faisal Nasser' },
  ]);

  // Scrap by type
  const scrapByType = [
    { type: isRTL ? 'أطراف الكابلات' : 'Cable Ends', weight: 450, color: '#3B82F6' },
    { type: isRTL ? 'شرائح العزل' : 'Insulation Strip', weight: 380, color: '#8B5CF6' },
    { type: isRTL ? 'أقسام تالفة' : 'Damaged Sections', weight: 280, color: '#EF4444' },
    { type: isRTL ? 'هدر الإعداد' : 'Setup Waste', weight: 140, color: '#F39200' },
  ];

  // Scrap by machine
  const scrapByMachine = [
    { machine: 'BC-1', weight: 320, percentage: 25.6 },
    { machine: 'BC-2', weight: 280, percentage: 22.4 },
    { machine: 'XT-12', weight: 240, percentage: 19.2 },
    { machine: 'XL-3', weight: 210, percentage: 16.8 },
    { machine: 'AR-2', weight: 120, percentage: 9.6 },
    { machine: 'Others', weight: 80, percentage: 6.4 },
  ];

  // Monthly trend
  const monthlyTrend = [
    { month: 'Jan', scrap: 2.45, target: 2.5, value: 7200 },
    { month: 'Feb', scrap: 2.38, target: 2.5, value: 6800 },
    { month: 'Mar', scrap: 2.52, target: 2.5, value: 7500 },
    { month: 'Apr', scrap: 2.41, target: 2.5, value: 7100 },
    { month: 'May', scrap: 2.35, target: 2.5, value: 6900 },
    { month: 'Jun', scrap: 2.30, target: 2.5, value: 6700 },
  ];

  // Calculate financial value
  const calculateFinancialValue = (copperKg) => {
    return ((copperKg * lmePrice) / 1000).toFixed(2);
  };

  // Add new scrap entry
  const handleAddScrap = (data) => {
    const newEntry = {
      id: `SC-${String(scrapEntries.length + 1).padStart(3, '0')}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      ...data,
    };
    setScrapEntries([newEntry, ...scrapEntries]);
    setShowAddModal(false);
  };

  // Overview Tab
  const OverviewTab = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: isRTL ? 'إجمالي الوزن اليوم' : 'Total Weight Today',
            value: `${summary.totalWeight.toLocaleString()} kg`,
            icon: Scale,
            color: '#3B82F6',
            subtitle: isRTL ? 'مواد خردة مختلطة' : 'Mixed scrap materials'
          },
          {
            title: isRTL ? 'محتوى النحاس' : 'Copper Content',
            value: `${summary.copperContent.toLocaleString()} kg`,
            icon: Package,
            color: '#F39200',
            subtitle: `~${summary.recoveryRate}% ${isRTL ? 'نسبة النحاس' : 'copper ratio'}`
          },
          {
            title: isRTL ? 'القيمة المالية' : 'Financial Value',
            value: `$${summary.financialValue.toLocaleString()}`,
            icon: Coins,
            color: '#10B981',
            subtitle: `LME $${lmePrice.toLocaleString()}/MT`
          },
          {
            title: isRTL ? 'معدل الهدر' : 'Scrap Rate',
            value: `${summary.scrapRate}%`,
            icon: TrendingDown,
            color: summary.scrapRate <= scrapTarget ? '#10B981' : '#EF4444',
            subtitle: `${isRTL ? 'الهدف:' : 'Target:'} ${scrapTarget}%`
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            className="p-5 rounded-2xl"
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-3 rounded-xl"
                style={{ background: `${card.color}20` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              {card.title.includes('Rate') && (
                <span className={`text-sm ${
                  summary.scrapRate <= scrapTarget ? 'text-green-500' : 'text-red-500'
                }`}>
                  {summary.scrapRate <= scrapTarget ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </span>
              )}
            </div>
            <h3 className="text-sm mb-1" style={{ color: colors.textSecondary }}>{card.title}</h3>
            <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>{card.value}</p>
            <p className="text-xs mt-2" style={{ color: colors.textMuted }}>{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* LME Price Card */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-2xl flex items-center justify-between"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl"
            style={{ background: 'rgba(243, 146, 0, 0.2)' }}
          >
            <DollarSign className="w-6 h-6" style={{ color: '#F39200' }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {isRTL ? 'سعر نحاس LME الحالي' : 'Current LME Copper Price'}
            </p>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              ${lmePrice.toLocaleString()} / MT
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {isRTL ? 'آخر تحديث' : 'Last Updated'}
          </p>
          <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scrap Rate Trend */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            {isRTL ? 'اتجاه معدل الهدر' : 'Scrap Rate Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="month" stroke={colors.textSecondary} />
              <YAxis domain={[2, 3]} stroke={colors.textSecondary} />
              <Tooltip
                contentStyle={{
                  background: colors.bgCard,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="scrap"
                stroke="#F39200"
                strokeWidth={3}
                dot={{ fill: '#F39200', strokeWidth: 2 }}
                name={isRTL ? 'معدل الهدر %' : 'Scrap Rate %'}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={isRTL ? 'الهدف' : 'Target'}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Scrap by Type */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            {isRTL ? 'الهدر حسب النوع' : 'Scrap by Type'}
          </h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={scrapByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="weight"
                  nameKey="type"
                >
                  {scrapByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {scrapByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {item.type}
                    </span>
                  </div>
                  <span className="font-semibold" style={{ color: colors.textPrimary }}>
                    {item.weight} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scrap by Machine */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
          {isRTL ? 'الهدر حسب الماكينة' : 'Scrap by Machine'}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={scrapByMachine}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="machine" stroke={colors.textSecondary} />
            <YAxis stroke={colors.textSecondary} />
            <Tooltip
              contentStyle={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
              }}
            />
            <Bar
              dataKey="weight"
              fill="#F39200"
              radius={[4, 4, 0, 0]}
              name={isRTL ? 'الوزن (كجم)' : 'Weight (kg)'}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );

  // Entries Tab
  const EntriesTab = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Search and Filter */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-4 items-center justify-between"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1 max-w-md"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Search className="w-5 h-5" style={{ color: colors.textMuted }} />
          <input
            type="text"
            placeholder={isRTL ? 'البحث عن سجل...' : 'Search entries...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: colors.textPrimary }}
          />
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: colors.bgTertiary,
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
            }}
          >
            <Filter className="w-4 h-4" />
            {isRTL ? 'تصفية' : 'Filter'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: colors.bgTertiary,
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
            }}
          >
            <Download className="w-4 h-4" />
            {isRTL ? 'تصدير' : 'Export'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
          >
            <Plus className="w-4 h-4" />
            {isRTL ? 'تسجيل هدر' : 'Log Scrap'}
          </motion.button>
        </div>
      </motion.div>

      {/* Entries Table */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl overflow-hidden"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: colors.bgTertiary }}>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'رقم السجل' : 'Entry ID'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'الوقت' : 'Time'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'الماكينة' : 'Machine'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'النوع' : 'Type'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'الوزن (كجم)' : 'Weight (kg)'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'النحاس (كجم)' : 'Copper (kg)'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'القيمة ($)' : 'Value ($)'}
              </th>
            </tr>
          </thead>
          <tbody>
            {scrapEntries
              .filter(e =>
                e.machine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.operator.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t"
                  style={{ borderColor: colors.border }}
                >
                  <td className="px-6 py-4 font-medium" style={{ color: colors.textPrimary }}>
                    {entry.id}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textMuted }}>
                    {entry.time}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textPrimary }}>
                    {entry.machine}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textSecondary }}>
                    {entry.type}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textPrimary }}>
                    {entry.weight}
                  </td>
                  <td className="px-6 py-4" style={{ color: '#3B82F6' }}>
                    {entry.copper}
                  </td>
                  <td className="px-6 py-4" style={{ color: '#10B981' }}>
                    ${calculateFinancialValue(entry.copper)}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );

  // Analysis Tab
  const AnalysisTab = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Comparison */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isRTL ? 'تحليل هدر الإنتاج' : 'Production Scrap Analysis'}
            </h2>
            <p className="text-white/80 mt-1">
              {isRTL ? `الهدف: ${scrapTarget}% | الفعلي 2022: ${scrapActual2022}%` : `Target: ${scrapTarget}% | Actual 2022: ${scrapActual2022}%`}
            </p>
          </div>
          <Trash2 className="w-16 h-16 text-white/30" />
        </div>
      </motion.div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: isRTL ? 'الهدف 2023' : 'Target 2023',
            value: `${scrapTarget}%`,
            color: '#10B981',
            subtitle: isRTL ? 'الحد الأقصى للهدر' : 'Maximum scrap rate',
          },
          {
            title: isRTL ? 'الفعلي 2022' : 'Actual 2022',
            value: `${scrapActual2022}%`,
            color: '#3B82F6',
            subtitle: isRTL ? 'أداء العام الماضي' : 'Last year performance',
          },
          {
            title: isRTL ? 'الحالي' : 'Current',
            value: `${summary.scrapRate}%`,
            color: summary.scrapRate <= scrapTarget ? '#10B981' : '#EF4444',
            subtitle: summary.scrapRate <= scrapTarget
              ? (isRTL ? 'ضمن الهدف' : 'Within target')
              : (isRTL ? 'يتجاوز الهدف' : 'Exceeds target'),
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            className="p-5 rounded-2xl text-center"
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3 className="text-sm mb-2" style={{ color: colors.textSecondary }}>{card.title}</h3>
            <p className="text-4xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-sm mt-2" style={{ color: colors.textMuted }}>{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Financial Value Trend */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
          {isRTL ? 'اتجاه القيمة المالية' : 'Financial Value Trend'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="month" stroke={colors.textSecondary} />
            <YAxis stroke={colors.textSecondary} />
            <Tooltip
              contentStyle={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
              }}
              formatter={(value) => [`$${value}`, isRTL ? 'القيمة' : 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              fill="rgba(16, 185, 129, 0.2)"
              strokeWidth={2}
              name={isRTL ? 'القيمة ($)' : 'Value ($)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Improvement Recommendations */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
          {isRTL ? 'توصيات التحسين' : 'Improvement Recommendations'}
        </h3>
        <div className="space-y-3">
          {[
            { priority: 'high', text: isRTL ? 'تقليل هدر الإعداد في ماكينة BC-1' : 'Reduce setup waste on BC-1 machine', saving: '$450/month' },
            { priority: 'medium', text: isRTL ? 'تحسين عملية قطع أطراف الكابلات' : 'Improve cable end cutting process', saving: '$320/month' },
            { priority: 'medium', text: isRTL ? 'تدريب المشغلين على تقليل الهدر' : 'Train operators on waste reduction', saving: '$280/month' },
            { priority: 'low', text: isRTL ? 'مراجعة معايير الجودة للأقسام التالفة' : 'Review quality standards for damaged sections', saving: '$150/month' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: colors.bgTertiary }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  item.priority === 'high' ? 'bg-red-500' :
                  item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span style={{ color: colors.textPrimary }}>{item.text}</span>
              </div>
              <span className="text-sm font-medium" style={{ color: '#10B981' }}>
                {item.saving}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Recovery Tab
  const RecoveryTab = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Recovery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: isRTL ? 'إجمالي المواد المستردة' : 'Total Recovered', value: '875 kg', color: '#10B981' },
          { title: isRTL ? 'نحاس مُعاد تدويره' : 'Recycled Copper', value: '720 kg', color: '#F39200' },
          { title: isRTL ? 'ألمنيوم مُعاد تدويره' : 'Recycled Aluminum', value: '95 kg', color: '#3B82F6' },
          { title: isRTL ? 'PVC مُعاد تدويره' : 'Recycled PVC', value: '60 kg', color: '#8B5CF6' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className="p-5 rounded-2xl"
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3 className="text-sm mb-2" style={{ color: colors.textSecondary }}>{stat.title}</h3>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recovery Process */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
          {isRTL ? 'عملية الاسترداد' : 'Recovery Process'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: isRTL ? 'جمع' : 'Collection', icon: Package, status: 'active' },
            { step: 2, title: isRTL ? 'فرز' : 'Sorting', icon: Filter, status: 'active' },
            { step: 3, title: isRTL ? 'معالجة' : 'Processing', icon: RefreshCcw, status: 'pending' },
            { step: 4, title: isRTL ? 'إعادة استخدام' : 'Reuse', icon: Factory, status: 'pending' },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-xl relative"
              style={{
                background: item.status === 'active'
                  ? 'rgba(243, 146, 0, 0.1)'
                  : colors.bgTertiary,
                border: `1px solid ${item.status === 'active' ? '#F39200' : colors.border}`,
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: item.status === 'active' ? '#F39200' : colors.textMuted }}
              >
                {item.step}
              </div>
              <div className="pt-4">
                <item.icon className="w-8 h-8 mx-auto mb-2"
                  style={{ color: item.status === 'active' ? '#F39200' : colors.textMuted }}
                />
                <p className="font-medium" style={{ color: colors.textPrimary }}>{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Environmental Impact */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4 text-white">
          {isRTL ? 'الأثر البيئي' : 'Environmental Impact'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/10">
            <p className="text-white/70 text-sm">{isRTL ? 'توفير CO2' : 'CO2 Saved'}</p>
            <p className="text-2xl font-bold text-white">2.5 tons</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10">
            <p className="text-white/70 text-sm">{isRTL ? 'توفير الطاقة' : 'Energy Saved'}</p>
            <p className="text-2xl font-bold text-white">15,000 kWh</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10">
            <p className="text-white/70 text-sm">{isRTL ? 'توفير المياه' : 'Water Saved'}</p>
            <p className="text-2xl font-bold text-white">500 m³</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Add Scrap Modal
  const AddScrapModal = () => {
    const [formData, setFormData] = useState({
      machine: '',
      type: 'Cable Ends',
      weight: '',
      copperPercentage: 70,
      operator: '',
      notes: '',
    });

    const copperWeight = formData.weight
      ? (parseFloat(formData.weight) * formData.copperPercentage / 100).toFixed(2)
      : 0;

    const estimatedValue = copperWeight
      ? calculateFinancialValue(parseFloat(copperWeight))
      : 0;

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAddScrap({
        ...formData,
        weight: parseFloat(formData.weight),
        copper: parseFloat(copperWeight),
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowAddModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg rounded-2xl p-6"
          style={{ background: colors.bgCard }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {isRTL ? 'تسجيل هدر جديد' : 'New Scrap Entry'}
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 rounded-lg hover:bg-gray-500/20"
            >
              <X className="w-5 h-5" style={{ color: colors.textMuted }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'الماكينة' : 'Machine'}
                </label>
                <select
                  value={formData.machine}
                  onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                  className="w-full p-3 rounded-xl"
                  style={{
                    background: colors.bgTertiary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                  required
                >
                  <option value="">{isRTL ? 'اختر الماكينة' : 'Select Machine'}</option>
                  <option value="BC-1">BC-1 - Bunching 1</option>
                  <option value="BC-2">BC-2 - Bunching 2</option>
                  <option value="XT-12">XT-12 - Stranding</option>
                  <option value="XL-3">XL-3 - Extrusion</option>
                  <option value="AR-2">AR-2 - Armoring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'النوع' : 'Type'}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 rounded-xl"
                  style={{
                    background: colors.bgTertiary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                >
                  <option value="Cable Ends">Cable Ends</option>
                  <option value="Insulation Strip">Insulation Strip</option>
                  <option value="Damaged Sections">Damaged Sections</option>
                  <option value="Setup Waste">Setup Waste</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                {isRTL ? 'الوزن (كجم)' : 'Weight (kg)'}
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full p-3 rounded-xl"
                style={{
                  background: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                placeholder="0.0"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                {isRTL ? `نسبة النحاس (${formData.copperPercentage}%)` : `Copper % (${formData.copperPercentage}%)`}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.copperPercentage}
                onChange={(e) => setFormData({ ...formData, copperPercentage: parseInt(e.target.value) })}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'محتوى النحاس' : 'Copper Content'}
                </label>
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#3B82F6',
                  }}
                >
                  {copperWeight} kg
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'القيمة المقدرة' : 'Estimated Value'}
                </label>
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10B981',
                  }}
                >
                  ${estimatedValue}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                {isRTL ? 'المشغل' : 'Operator'}
              </label>
              <input
                type="text"
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                className="w-full p-3 rounded-xl"
                style={{
                  background: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                placeholder={isRTL ? 'اسم المشغل' : 'Operator name'}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl font-medium"
                style={{
                  background: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
              >
                {isRTL ? 'تسجيل' : 'Submit'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'entries':
        return <EntriesTab />;
      case 'analysis':
        return <AnalysisTab />;
      case 'recovery':
        return <RecoveryTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {t('scrap.title')}
          </h1>
          <p style={{ color: colors.textSecondary }}>
            {isRTL ? 'تتبع الهدر والتقييم المالي' : 'Scrap tracking and financial valuation'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={BarChart3}
            label={isRTL ? 'نظرة عامة' : 'Overview'}
            colors={colors}
            isDark={isDark}
          />
          <TabButton
            active={activeTab === 'entries'}
            onClick={() => setActiveTab('entries')}
            icon={Trash2}
            label={isRTL ? 'السجلات' : 'Entries'}
            colors={colors}
            isDark={isDark}
          />
          <TabButton
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
            icon={PieChartIcon}
            label={isRTL ? 'التحليل' : 'Analysis'}
            colors={colors}
            isDark={isDark}
          />
          <TabButton
            active={activeTab === 'recovery'}
            onClick={() => setActiveTab('recovery')}
            icon={RefreshCcw}
            label={isRTL ? 'الاسترداد' : 'Recovery'}
            colors={colors}
            isDark={isDark}
          />
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && <AddScrapModal />}
      </AnimatePresence>
    </div>
  );
};

export default Scrap;
