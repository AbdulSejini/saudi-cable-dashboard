/**
 * Workforce Page
 * Saudi Cable Company - Real Manpower Data with Input Forms
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
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
} from 'recharts';
import {
  Users,
  UserPlus,
  Building2,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  Plus,
  X,
  Save,
  Edit3,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const COLORS = ['#F39200', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'];

const Workforce = () => {
  const { t, isRTL } = useLanguage();
  const { isDark, colors } = useTheme();
  const { manpowerData, machineStatusData, rainImpactData } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'departments', label: 'By Department', icon: Building2 },
    { id: 'manufacturing', label: 'Manufacturing', icon: Target },
    { id: 'planning', label: 'Capacity Planning', icon: TrendingUp },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate hiring needs
  const hiringNeeds26K = manpowerData.totals.target26K - manpowerData.totals.current;
  const hiringNeeds40K = manpowerData.totals.target40K - manpowerData.totals.current;

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
            {isRTL ? 'إدارة القوى العاملة' : 'Workforce Management'}
          </h1>
          <p style={{ color: colors.textSecondary }}>
            {isRTL ? `البيانات حتى ${manpowerData.asOfDate}` : `Data as of ${manpowerData.asOfDate}`}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium"
          style={{
            background: 'linear-gradient(135deg, #F39200, #CC7A00)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(243, 146, 0, 0.3)',
          }}
        >
          <UserPlus className="w-4 h-4" />
          {isRTL ? 'إضافة موظف' : 'Add Employee'}
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #F39200, #CC7A00)' }}
        >
          <div className="relative z-10">
            <p className="text-white/80 text-sm">Current Manpower</p>
            <motion.p
              className="text-4xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {manpowerData.totals.current}
            </motion.p>
            <p className="text-white/60 text-sm mt-1">Total Employees</p>
          </div>
          <Users className="absolute -bottom-2 -right-2 w-20 h-20 text-white/20" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
        >
          <div className="relative z-10">
            <p className="text-white/80 text-sm">Target (26K MT)</p>
            <p className="text-4xl font-bold text-white">{manpowerData.totals.target26K}</p>
            <p className="text-white/60 text-sm mt-1">
              Need: <span className="text-yellow-300">+{hiringNeeds26K}</span>
            </p>
          </div>
          <Target className="absolute -bottom-2 -right-2 w-20 h-20 text-white/20" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
        >
          <div className="relative z-10">
            <p className="text-white/80 text-sm">Target (40K MT)</p>
            <p className="text-4xl font-bold text-white">{manpowerData.totals.target40K}</p>
            <p className="text-white/60 text-sm mt-1">
              Need: <span className="text-yellow-300">+{hiringNeeds40K}</span>
            </p>
          </div>
          <TrendingUp className="absolute -bottom-2 -right-2 w-20 h-20 text-white/20" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.2))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.1))',
            border: '1px solid rgba(239,68,68,0.3)'
          }}
        >
          <div className="relative z-10">
            <p style={{ color: '#EF4444' }} className="text-sm">Hiring Gap</p>
            <p className="text-4xl font-bold" style={{ color: '#EF4444' }}>
              {Math.round((manpowerData.totals.current / manpowerData.totals.target40K) * 100)}%
            </p>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Staffing Level
            </p>
          </div>
          <AlertTriangle className="absolute -bottom-2 -right-2 w-20 h-20 text-red-500/20" />
        </motion.div>
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
              whileHover={{ scale: 1.02 }}
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

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <OverviewTab
            key="overview"
            manpowerData={manpowerData}
            colors={colors}
            isDark={isDark}
            itemVariants={itemVariants}
          />
        )}
        {activeTab === 'departments' && (
          <DepartmentsTab
            key="departments"
            manpowerData={manpowerData}
            colors={colors}
            isDark={isDark}
            onEdit={(dept) => { setSelectedDepartment(dept); setShowEditForm(true); }}
          />
        )}
        {activeTab === 'manufacturing' && (
          <ManufacturingTab
            key="manufacturing"
            manpowerData={manpowerData}
            colors={colors}
            isDark={isDark}
          />
        )}
        {activeTab === 'planning' && (
          <PlanningTab
            key="planning"
            manpowerData={manpowerData}
            colors={colors}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddEmployeeModal
            onClose={() => setShowAddForm(false)}
            colors={colors}
            isDark={isDark}
            departments={manpowerData.byDepartment}
          />
        )}
      </AnimatePresence>

      {/* Edit Department Modal */}
      <AnimatePresence>
        {showEditForm && selectedDepartment && (
          <EditDepartmentModal
            department={selectedDepartment}
            onClose={() => { setShowEditForm(false); setSelectedDepartment(null); }}
            colors={colors}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ manpowerData, colors, isDark, itemVariants }) => {
  const chartData = manpowerData.byDepartment.map(d => ({
    name: d.department.length > 15 ? d.department.substring(0, 15) + '...' : d.department,
    fullName: d.department,
    Current: d.current,
    '26K Target': d.target26K,
    '40K Target': d.target40K,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Chart */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
          Manpower by Department
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
            <XAxis dataKey="name" stroke={colors.textSecondary} fontSize={11} angle={-15} textAnchor="end" height={60} />
            <YAxis stroke={colors.textSecondary} />
            <Tooltip
              contentStyle={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
              }}
              labelStyle={{ color: colors.textPrimary }}
            />
            <Legend />
            <Bar dataKey="Current" fill="#F39200" radius={[4, 4, 0, 0]} />
            <Bar dataKey="26K Target" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="40K Target" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {manpowerData.byDepartment.map((dept, idx) => {
          const fillPercent = (dept.current / dept.target40K) * 100;
          return (
            <motion.div
              key={dept.department}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl p-5"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
                {dept.department}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: colors.textSecondary }}>Current</span>
                  <span className="font-bold" style={{ color: '#F39200' }}>{dept.current}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: colors.textSecondary }}>26K Target</span>
                  <span style={{ color: colors.textPrimary }}>{dept.target26K}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: colors.textSecondary }}>40K Target</span>
                  <span style={{ color: colors.textPrimary }}>{dept.target40K}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: fillPercent >= 70 ? '#10B981' : fillPercent >= 50 ? '#F39200' : '#EF4444' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(fillPercent, 100)}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                  {fillPercent.toFixed(0)}% of 40K target
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Departments Tab
const DepartmentsTab = ({ manpowerData, colors, isDark, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div className="p-4" style={{ background: isDark ? 'rgba(243,146,0,0.1)' : 'rgba(243,146,0,0.05)' }}>
          <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
            Product Types & Manpower
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: colors.bgTertiary }}>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.textPrimary }}>Department</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: colors.textPrimary }}>Current</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#3B82F6' }}>26K</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#10B981' }}>40K</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#F39200' }}>Gap (40K)</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: colors.textPrimary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {manpowerData.byDepartment.map((dept, idx) => (
                <motion.tr
                  key={dept.department}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  <td className="py-4 px-4 font-medium" style={{ color: colors.textPrimary }}>{dept.department}</td>
                  <td className="py-4 px-4 text-center font-mono font-bold" style={{ color: '#F39200' }}>{dept.current}</td>
                  <td className="py-4 px-4 text-center font-mono" style={{ color: colors.textPrimary }}>{dept.target26K}</td>
                  <td className="py-4 px-4 text-center font-mono" style={{ color: colors.textPrimary }}>{dept.target40K}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-sm font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                      +{dept.target40K - dept.current}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(dept)}
                      className="p-2 rounded-lg"
                      style={{ background: colors.bgTertiary }}
                    >
                      <Edit3 className="w-4 h-4" style={{ color: '#F39200' }} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
              <tr style={{ background: isDark ? 'rgba(243,146,0,0.15)' : 'rgba(243,146,0,0.1)' }}>
                <td className="py-4 px-4 font-bold" style={{ color: '#F39200' }}>TOTAL</td>
                <td className="py-4 px-4 text-center font-mono font-bold" style={{ color: '#F39200' }}>{manpowerData.totals.current}</td>
                <td className="py-4 px-4 text-center font-mono font-bold" style={{ color: '#F39200' }}>{manpowerData.totals.target26K}</td>
                <td className="py-4 px-4 text-center font-mono font-bold" style={{ color: '#F39200' }}>{manpowerData.totals.target40K}</td>
                <td className="py-4 px-4 text-center font-bold" style={{ color: '#EF4444' }}>
                  +{manpowerData.totals.target40K - manpowerData.totals.current}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Manufacturing Tab
const ManufacturingTab = ({ manpowerData, colors, isDark }) => {
  const { manufacturing } = manpowerData;

  const pieData = manufacturing.departments.map((dept, idx) => ({
    name: dept,
    value: manufacturing.totalManpower[idx],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5 text-center"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <p style={{ color: colors.textSecondary }}>Production Total</p>
          <p className="text-3xl font-bold mt-2" style={{ color: '#F39200' }}>{manufacturing.productionTotal}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-5 text-center"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <p style={{ color: colors.textSecondary }}>Indirect Total</p>
          <p className="text-3xl font-bold mt-2" style={{ color: '#3B82F6' }}>{manufacturing.productionTotalIndirect}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5 text-center"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <p style={{ color: colors.textSecondary }}>Indirect %</p>
          <p className="text-3xl font-bold mt-2" style={{ color: '#10B981' }}>{manufacturing.percentageOfIndirect}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-6"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Distribution by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Role Breakdown Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-6"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Manpower by Role
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                  <th className="text-left py-2 px-2" style={{ color: colors.textSecondary }}>Role</th>
                  {manufacturing.departments.map(dept => (
                    <th key={dept} className="text-center py-2 px-2" style={{ color: colors.textSecondary }}>{dept}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {manufacturing.roles.map((role, idx) => (
                  <tr key={role.role} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td className="py-2 px-2" style={{ color: colors.textPrimary }}>{role.role}</td>
                    {role.values.map((val, i) => (
                      <td key={i} className="text-center py-2 px-2 font-mono" style={{ color: colors.textPrimary }}>{val}</td>
                    ))}
                  </tr>
                ))}
                <tr style={{ background: isDark ? 'rgba(243,146,0,0.1)' : 'rgba(243,146,0,0.05)' }}>
                  <td className="py-2 px-2 font-bold" style={{ color: '#F39200' }}>Indirect Total</td>
                  {manufacturing.indirectTotal.map((val, i) => (
                    <td key={i} className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#F39200' }}>{val}</td>
                  ))}
                </tr>
                <tr style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)' }}>
                  <td className="py-2 px-2 font-bold" style={{ color: '#3B82F6' }}>Total Manpower</td>
                  {manufacturing.totalManpower.map((val, i) => (
                    <td key={i} className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#3B82F6' }}>{val}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Planning Tab
const PlanningTab = ({ manpowerData, colors, isDark }) => {
  const planningData = manpowerData.byDepartment.map(dept => ({
    department: dept.department,
    current: dept.current,
    gap26K: dept.target26K - dept.current,
    gap40K: dept.target40K - dept.current,
    priority: dept.target40K - dept.current > 30 ? 'high' : dept.target40K - dept.current > 15 ? 'medium' : 'low',
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Hiring Priority */}
      <motion.div
        className="rounded-2xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
          Hiring Priority Analysis
        </h3>
        <div className="space-y-4">
          {planningData.sort((a, b) => b.gap40K - a.gap40K).map((item, idx) => (
            <motion.div
              key={item.department}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl flex items-center justify-between"
              style={{ background: colors.bgTertiary }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  item.priority === 'high' ? 'bg-red-500' :
                  item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="font-medium" style={{ color: colors.textPrimary }}>{item.department}</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Current: {item.current} employees
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs" style={{ color: colors.textSecondary }}>Need for 26K</p>
                  <p className="font-bold" style={{ color: '#3B82F6' }}>+{item.gap26K}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: colors.textSecondary }}>Need for 40K</p>
                  <p className="font-bold" style={{ color: '#10B981' }}>+{item.gap40K}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  item.priority === 'high' ? 'bg-red-100 text-red-600' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                }`}>
                  {item.priority}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        className="rounded-2xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <h3 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
          Hiring Timeline Recommendation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <p className="text-sm" style={{ color: '#EF4444' }}>Q1 2024</p>
            <p className="text-2xl font-bold mt-2" style={{ color: '#EF4444' }}>+60</p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Critical Positions</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: isDark ? 'rgba(243,146,0,0.1)' : 'rgba(243,146,0,0.05)', border: '1px solid rgba(243,146,0,0.3)' }}>
            <p className="text-sm" style={{ color: '#F39200' }}>Q2 2024</p>
            <p className="text-2xl font-bold mt-2" style={{ color: '#F39200' }}>+80</p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Production Expansion</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-sm" style={{ color: '#10B981' }}>Q3-Q4 2024</p>
            <p className="text-2xl font-bold mt-2" style={{ color: '#10B981' }}>+94</p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Full Capacity</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add Employee Modal
const AddEmployeeModal = ({ onClose, colors, isDark, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    role: '',
    startDate: '',
    shift: 'A',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Employee:', formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Add New Employee</h3>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ background: colors.bgTertiary }}>
            <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              required
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.department} value={d.department}>{d.department}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              required
            >
              <option value="">Select Role</option>
              <option value="Production Engineer">Production Engineer</option>
              <option value="Sr. Supervisor">Sr. Supervisor</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Operator">Operator</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              >
                <option value="A">Shift A (6AM-2PM)</option>
                <option value="B">Shift B (2PM-10PM)</option>
                <option value="C">Shift C (10PM-6AM)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg font-medium"
              style={{ background: colors.bgTertiary, color: colors.textSecondary, border: `1px solid ${colors.border}` }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F39200, #CC7A00)', color: 'white' }}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Edit Department Modal
const EditDepartmentModal = ({ department, onClose, colors, isDark }) => {
  const [formData, setFormData] = useState({
    current: department.current,
    target26K: department.target26K,
    target40K: department.target40K,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Department:', { ...department, ...formData });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Edit: {department.department}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ background: colors.bgTertiary }}>
            <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Current Manpower</label>
            <input
              type="number"
              value={formData.current}
              onChange={(e) => setFormData({ ...formData, current: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Target (26K MT)</label>
            <input
              type="number"
              value={formData.target26K}
              onChange={(e) => setFormData({ ...formData, target26K: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Target (40K MT)</label>
            <input
              type="number"
              value={formData.target40K}
              onChange={(e) => setFormData({ ...formData, target40K: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg font-medium"
              style={{ background: colors.bgTertiary, color: colors.textSecondary, border: `1px solid ${colors.border}` }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F39200, #CC7A00)', color: 'white' }}
            >
              <CheckCircle className="w-4 h-4" />
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Workforce;
