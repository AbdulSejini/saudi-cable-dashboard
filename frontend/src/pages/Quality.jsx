/**
 * Quality Page
 * Quality inspection, defect tracking, and KPI management
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
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  FileText,
  Plus,
  X,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ClipboardCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Package,
  Wrench,
  Eye,
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

// KPI Status Badge Component
const KPIStatusBadge = ({ status }) => {
  const statusConfig = {
    good: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'On Track' },
    warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Warning' },
    critical: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Critical' },
    pending: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Pending' },
  };
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
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

const Quality = () => {
  const { t, isRTL } = useLanguage();
  const { isDark, colors } = useTheme();
  const { kpiData } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Quality inspection data
  const [inspections, setInspections] = useState([
    { id: 'QC-001', machine: 'XL-1', product: 'LV Cable 4x70mm', result: 'pass', inspector: 'Ahmed Ali', time: '10:45 AM', defects: 0 },
    { id: 'QC-002', machine: 'XL-2', product: 'Control Cable 12x2.5mm', result: 'pass', inspector: 'Mohammed Hassan', time: '10:30 AM', defects: 0 },
    { id: 'QC-003', machine: 'AR-2', product: 'Armored Cable 3x185mm', result: 'fail', inspector: 'Khalid Omar', time: '10:15 AM', defects: 2 },
    { id: 'QC-004', machine: 'BC-1', product: 'Building Wire 2.5mm', result: 'pass', inspector: 'Saeed Ahmed', time: '10:00 AM', defects: 0 },
    { id: 'QC-005', machine: 'CV-1', product: 'HV Cable 120mm', result: 'pass', inspector: 'Faisal Nasser', time: '09:45 AM', defects: 0 },
  ]);

  // Quality metrics
  const qualityMetrics = {
    qualityRate: 97.5,
    firstPassYield: 96.8,
    defectsToday: 12,
    totalChecked: 2450,
    ncrRate: 0.75,
    customerComplaints: 8,
  };

  // Defect breakdown data
  const defectData = [
    { type: 'Surface', count: 5, percentage: 42, color: '#3B82F6' },
    { type: 'Dimensional', count: 4, percentage: 33, color: '#F39200' },
    { type: 'Electrical', count: 3, percentage: 25, color: '#8B5CF6' },
  ];

  // Monthly quality trend
  const monthlyTrend = [
    { month: 'Jan', quality: 96.2, target: 97 },
    { month: 'Feb', quality: 96.8, target: 97 },
    { month: 'Mar', quality: 97.1, target: 97 },
    { month: 'Apr', quality: 96.5, target: 97 },
    { month: 'May', quality: 97.3, target: 97 },
    { month: 'Jun', quality: 97.5, target: 97 },
  ];

  // KPI chart data
  const kpiChartData = kpiData.kpis.map(kpi => ({
    name: kpi.name.length > 15 ? kpi.name.substring(0, 15) + '...' : kpi.name,
    fullName: kpi.name,
    actual2022: typeof kpi.actual2022 === 'number' ? kpi.actual2022 : 0,
    target2023: typeof kpi.target2023 === 'number' ? kpi.target2023 : 0,
  }));

  // Add new inspection
  const handleAddInspection = (data) => {
    const newInspection = {
      id: `QC-${String(inspections.length + 1).padStart(3, '0')}`,
      ...data,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setInspections([newInspection, ...inspections]);
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
            title: isRTL ? 'معدل الجودة' : 'Quality Rate',
            value: `${qualityMetrics.qualityRate}%`,
            icon: Award,
            color: '#10B981',
            change: '+0.3%',
            trend: 'up'
          },
          {
            title: isRTL ? 'العائد الأول' : 'First Pass Yield',
            value: `${qualityMetrics.firstPassYield}%`,
            icon: CheckCircle,
            color: '#3B82F6',
            change: '+0.5%',
            trend: 'up'
          },
          {
            title: isRTL ? 'العيوب اليوم' : 'Defects Today',
            value: qualityMetrics.defectsToday,
            icon: AlertTriangle,
            color: '#EF4444',
            change: '-2',
            trend: 'down'
          },
          {
            title: isRTL ? 'شكاوى العملاء' : 'Customer Complaints',
            value: qualityMetrics.customerComplaints,
            icon: FileText,
            color: '#F39200',
            change: '-10%',
            trend: 'down'
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
              <div className={`flex items-center gap-1 text-sm ${
                card.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {card.change}
              </div>
            </div>
            <h3 className="text-sm mb-1" style={{ color: colors.textSecondary }}>{card.title}</h3>
            <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend Chart */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            {isRTL ? 'اتجاه الجودة الشهري' : 'Monthly Quality Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="month" stroke={colors.textSecondary} />
              <YAxis domain={[95, 100]} stroke={colors.textSecondary} />
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
                dataKey="quality"
                stroke="#F39200"
                strokeWidth={3}
                dot={{ fill: '#F39200', strokeWidth: 2 }}
                name={isRTL ? 'الجودة الفعلية' : 'Actual Quality'}
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

        {/* Defect Distribution */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            {isRTL ? 'توزيع العيوب' : 'Defect Distribution'}
          </h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={defectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="type"
                >
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {defectData.map((defect, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: defect.color }}
                    />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {defect.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ color: colors.textPrimary }}>
                      {defect.count}
                    </span>
                    <span className="text-xs" style={{ color: colors.textMuted }}>
                      ({defect.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Inspections */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            {isRTL ? 'الفحوصات الأخيرة' : 'Recent Inspections'}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
          >
            <Plus className="w-4 h-4" />
            {isRTL ? 'فحص جديد' : 'New Inspection'}
          </motion.button>
        </div>
        <div className="space-y-3">
          {inspections.slice(0, 5).map((inspection, index) => (
            <motion.div
              key={inspection.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: colors.bgTertiary }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    inspection.result === 'pass' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  {inspection.result === 'pass' ? (
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <ThumbsDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium" style={{ color: colors.textPrimary }}>
                    {inspection.product}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {inspection.machine} • {inspection.inspector}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {inspection.time}
                  </p>
                  {inspection.defects > 0 && (
                    <p className="text-xs text-red-500">{inspection.defects} defects</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    inspection.result === 'pass'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {inspection.result === 'pass' ? 'Passed' : 'Failed'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // KPI Tab
  const KPITab = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Header */}
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
              {isRTL ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
            </h2>
            <p className="text-white/80 mt-1">
              {isRTL ? `سنة التصنيع ${kpiData.year}` : `Manufacturing Year ${kpiData.year}`}
            </p>
          </div>
          <Target className="w-16 h-16 text-white/30" />
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.kpis.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            variants={itemVariants}
            className="p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg"
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
            }}
            onClick={() => {
              setSelectedKPI(kpi);
              setShowDetailModal(true);
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                {kpi.name}
              </h3>
              <KPIStatusBadge status={kpi.status} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'الفعلي 2022' : 'Actual 2022'}
                </span>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>
                  {kpi.actual2022} {kpi.unit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'الهدف 2023' : 'Target 2023'}
                </span>
                <span className="font-semibold" style={{ color: '#F39200' }}>
                  {kpi.target2023} {kpi.unit}
                </span>
              </div>

              {/* Progress Bar */}
              {typeof kpi.actual2022 === 'number' && typeof kpi.target2023 === 'number' && kpi.target2023 > 0 && (
                <div className="pt-2">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((kpi.actual2022 / kpi.target2023) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  {isRTL ? 'المعايير:' : 'Criteria:'} {kpi.criteria.join(', ')}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${colors.border}` }}>
              <button
                className="flex items-center gap-2 text-sm"
                style={{ color: '#F39200' }}
              >
                <Eye className="w-4 h-4" />
                {isRTL ? 'عرض التفاصيل' : 'View Details'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPI Comparison Chart */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
          {isRTL ? 'مقارنة مؤشرات الأداء' : 'KPI Comparison'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={kpiChartData.filter(k => k.actual2022 > 0 || k.target2023 > 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="name" stroke={colors.textSecondary} />
            <YAxis stroke={colors.textSecondary} />
            <Tooltip
              contentStyle={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
              }}
              labelFormatter={(value, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullName;
                }
                return value;
              }}
            />
            <Legend />
            <Bar
              dataKey="actual2022"
              fill="#3B82F6"
              name={isRTL ? 'الفعلي 2022' : 'Actual 2022'}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="target2023"
              fill="#F39200"
              name={isRTL ? 'الهدف 2023' : 'Target 2023'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );

  // Inspections Tab
  const InspectionsTab = () => (
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
            placeholder={isRTL ? 'البحث عن فحص...' : 'Search inspections...'}
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
          >
            <Plus className="w-4 h-4" />
            {isRTL ? 'فحص جديد' : 'New Inspection'}
          </motion.button>
        </div>
      </motion.div>

      {/* Inspections Table */}
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
                {isRTL ? 'رقم الفحص' : 'Inspection ID'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'الماكينة' : 'Machine'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'المنتج' : 'Product'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'المفتش' : 'Inspector'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'النتيجة' : 'Result'}
              </th>
              <th className="text-left px-6 py-4 font-semibold" style={{ color: colors.textPrimary }}>
                {isRTL ? 'الوقت' : 'Time'}
              </th>
            </tr>
          </thead>
          <tbody>
            {inspections
              .filter(i =>
                i.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.machine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.inspector.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((inspection, index) => (
                <motion.tr
                  key={inspection.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t"
                  style={{ borderColor: colors.border }}
                >
                  <td className="px-6 py-4 font-medium" style={{ color: colors.textPrimary }}>
                    {inspection.id}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textSecondary }}>
                    {inspection.machine}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textSecondary }}>
                    {inspection.product}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textSecondary }}>
                    {inspection.inspector}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      inspection.result === 'pass'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {inspection.result === 'pass' ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textMuted }}>
                    {inspection.time}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );

  // NCR Tab (Non-Conformance Reports)
  const NCRTab = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* NCR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: isRTL ? 'تقارير NCR المفتوحة' : 'Open NCRs', value: 5, color: '#EF4444' },
          { title: isRTL ? 'قيد المراجعة' : 'Under Review', value: 3, color: '#F39200' },
          { title: isRTL ? 'تم الإغلاق هذا الشهر' : 'Closed This Month', value: 12, color: '#10B981' },
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
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* NCR List */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            {isRTL ? 'تقارير عدم المطابقة' : 'Non-Conformance Reports'}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
          >
            <Plus className="w-4 h-4" />
            {isRTL ? 'تقرير جديد' : 'New NCR'}
          </motion.button>
        </div>
        <div className="space-y-3">
          {[
            { id: 'NCR-2024-001', product: 'LV Cable 4x70mm', issue: 'Insulation thickness below spec', status: 'open', priority: 'high' },
            { id: 'NCR-2024-002', product: 'Control Cable', issue: 'Color code mismatch', status: 'review', priority: 'medium' },
            { id: 'NCR-2024-003', product: 'Armored Cable', issue: 'Armor tape overlap issue', status: 'open', priority: 'high' },
            { id: 'NCR-2024-004', product: 'Building Wire', issue: 'Printing quality', status: 'review', priority: 'low' },
            { id: 'NCR-2024-005', product: 'HV Cable', issue: 'Jacket thickness variation', status: 'closed', priority: 'high' },
          ].map((ncr, index) => (
            <motion.div
              key={ncr.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: colors.bgTertiary }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  ncr.status === 'closed' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <AlertCircle className={`w-5 h-5 ${
                    ncr.status === 'closed' ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: colors.textPrimary }}>
                    {ncr.id} - {ncr.product}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {ncr.issue}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ncr.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                  ncr.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {ncr.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ncr.status === 'open' ? 'bg-red-500/20 text-red-500' :
                  ncr.status === 'review' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {ncr.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Add Inspection Modal
  const AddInspectionModal = () => {
    const [formData, setFormData] = useState({
      machine: '',
      product: '',
      result: 'pass',
      inspector: '',
      defects: 0,
      notes: '',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAddInspection(formData);
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
              {isRTL ? 'فحص جديد' : 'New Inspection'}
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 rounded-lg hover:bg-gray-500/20"
            >
              <X className="w-5 h-5" style={{ color: colors.textMuted }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <option value="XL-1">XL-1 - Extrusion Line 1</option>
                <option value="XL-2">XL-2 - Extrusion Line 2</option>
                <option value="AR-2">AR-2 - Armoring 2</option>
                <option value="BC-1">BC-1 - Bunching 1</option>
                <option value="CV-1">CV-1 - CV Line 1</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                {isRTL ? 'المنتج' : 'Product'}
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full p-3 rounded-xl"
                style={{
                  background: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                placeholder={isRTL ? 'اسم المنتج' : 'Product name'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                {isRTL ? 'المفتش' : 'Inspector'}
              </label>
              <input
                type="text"
                value={formData.inspector}
                onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                className="w-full p-3 rounded-xl"
                style={{
                  background: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                placeholder={isRTL ? 'اسم المفتش' : 'Inspector name'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                {isRTL ? 'النتيجة' : 'Result'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    value="pass"
                    checked={formData.result === 'pass'}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    className="accent-green-500"
                  />
                  <span style={{ color: colors.textPrimary }}>{isRTL ? 'ناجح' : 'Pass'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    value="fail"
                    checked={formData.result === 'fail'}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    className="accent-red-500"
                  />
                  <span style={{ color: colors.textPrimary }}>{isRTL ? 'فاشل' : 'Fail'}</span>
                </label>
              </div>
            </div>

            {formData.result === 'fail' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'عدد العيوب' : 'Number of Defects'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.defects}
                  onChange={(e) => setFormData({ ...formData, defects: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 rounded-xl"
                  style={{
                    background: colors.bgTertiary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                {isRTL ? 'ملاحظات' : 'Notes'}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 rounded-xl"
                style={{
                  background: colors.bgTertiary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                rows="3"
                placeholder={isRTL ? 'ملاحظات إضافية' : 'Additional notes'}
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
                {isRTL ? 'إضافة الفحص' : 'Add Inspection'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // KPI Detail Modal
  const KPIDetailModal = () => {
    if (!selectedKPI) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowDetailModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md rounded-2xl p-6"
          style={{ background: colors.bgCard }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {selectedKPI.name}
            </h2>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 rounded-lg hover:bg-gray-500/20"
            >
              <X className="w-5 h-5" style={{ color: colors.textMuted }} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: colors.bgTertiary }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: colors.textSecondary }}>{isRTL ? 'الوحدة' : 'Unit'}</span>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>{selectedKPI.unit}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: colors.textSecondary }}>{isRTL ? 'الفعلي 2022' : 'Actual 2022'}</span>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>{selectedKPI.actual2022}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: colors.textSecondary }}>{isRTL ? 'الهدف 2023' : 'Target 2023'}</span>
                <span className="font-semibold" style={{ color: '#F39200' }}>{selectedKPI.target2023}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: colors.bgTertiary }}>
              <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>
                {isRTL ? 'معايير القياس' : 'Measurement Criteria'}
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedKPI.criteria.map((criterion, index) => (
                  <li key={index} className="text-sm" style={{ color: colors.textSecondary }}>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: colors.bgTertiary }}>
              <span style={{ color: colors.textSecondary }}>{isRTL ? 'الحالة' : 'Status'}</span>
              <KPIStatusBadge status={selectedKPI.status} />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDetailModal(false)}
            className="w-full mt-6 py-3 rounded-xl font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
          >
            {isRTL ? 'إغلاق' : 'Close'}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'kpi':
        return <KPITab />;
      case 'inspections':
        return <InspectionsTab />;
      case 'ncr':
        return <NCRTab />;
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
            {t('quality.title')}
          </h1>
          <p style={{ color: colors.textSecondary }}>
            {isRTL ? 'مراقبة الجودة ومؤشرات الأداء' : 'Quality Control & Performance Indicators'}
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
            active={activeTab === 'kpi'}
            onClick={() => setActiveTab('kpi')}
            icon={Target}
            label={isRTL ? 'مؤشرات الأداء' : 'KPIs'}
            colors={colors}
            isDark={isDark}
          />
          <TabButton
            active={activeTab === 'inspections'}
            onClick={() => setActiveTab('inspections')}
            icon={ClipboardCheck}
            label={isRTL ? 'الفحوصات' : 'Inspections'}
            colors={colors}
            isDark={isDark}
          />
          <TabButton
            active={activeTab === 'ncr'}
            onClick={() => setActiveTab('ncr')}
            icon={AlertCircle}
            label={isRTL ? 'تقارير NCR' : 'NCR'}
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

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && <AddInspectionModal />}
        {showDetailModal && <KPIDetailModal />}
      </AnimatePresence>
    </div>
  );
};

export default Quality;
