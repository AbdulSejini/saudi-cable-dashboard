/**
 * Planning Department Portal
 * Central hub connecting Sales, Production, and Supply Chain
 * Based on Saudi Cable Company workflow documentation
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import {
  FileText,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings,
  Search,
  Plus,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Clipboard,
  Send,
  RefreshCw,
  Filter,
  Download,
  Eye,
  Edit,
  Printer,
  AlertCircle,
  XCircle,
  ArrowRight,
  Zap,
  Users,
  Factory,
  Box,
  Scissors,
  BookOpen,
  Target,
  ShieldAlert
} from 'lucide-react';

const Planning = () => {
  const { t, language } = useLanguage();
  const { isDark, colors } = useTheme();
  const { machines, workOrders, capacityData } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);
  const [showCuttingForm, setShowCuttingForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);

  // Tabs configuration
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', labelAr: 'لوحة المعلومات', icon: BarChart3 },
    { id: 'orders', label: 'Sales Orders', labelAr: 'أوامر البيع', icon: FileText },
    { id: 'workorders', label: 'Work Orders', labelAr: 'أوامر العمل', icon: Clipboard },
    { id: 'capacity', label: 'Capacity', labelAr: 'السعة', icon: Activity },
    { id: 'materials', label: 'Materials', labelAr: 'المواد', icon: Package },
    { id: 'tools', label: 'Tools', labelAr: 'الأدوات', icon: Settings },
  ];

  // Sample Sales Orders Data (Jeddah Cable style)
  const salesOrders = [
    { id: 'SO-2021213', customer: 'Jeddah Cable', invoices: 10, totalKM: 299.902, totalValue: 869715.80, status: 'in-progress', priority: 'high', dueDate: '2024-03-15' },
    { id: 'SO-2024-001', customer: 'Saudi Electricity', invoices: 5, totalKM: 150.5, totalValue: 520000, status: 'pending', priority: 'high', dueDate: '2024-02-28' },
    { id: 'SO-2024-002', customer: 'SABIC', invoices: 8, totalKM: 420.3, totalValue: 1250000, status: 'in-progress', priority: 'medium', dueDate: '2024-03-20' },
    { id: 'SO-2024-003', customer: 'Aramco', invoices: 12, totalKM: 680.0, totalValue: 2100000, status: 'delayed', priority: 'critical', dueDate: '2024-02-15' },
    { id: 'SO-2024-004', customer: 'Ma\'aden', invoices: 3, totalKM: 85.2, totalValue: 320000, status: 'completed', priority: 'low', dueDate: '2024-02-10' },
  ];

  // KPI Data
  const kpiData = {
    delayedOrders: { value: 12, percentage: 8.5, trend: 'down', target: 5 },
    deliveryBacklog: { value: 2450, unit: 'MT', trend: 'up', change: 15 },
    scheduleAdherence: { value: 87.5, unit: '%', trend: 'up', target: 95 },
    materialAlerts: { value: 3, critical: 1, warning: 2 },
    pendingWorkOrders: { value: 28, urgent: 8 },
    productionEfficiency: { value: 78.2, unit: '%', trend: 'up' },
  };

  // Material Status Data
  const materialStatus = [
    { id: 'CU-ROD', name: 'Copper Rod', stock: 97, unit: 'MT', reorderPoint: 150, status: 'critical' },
    { id: 'AL-ROD', name: 'Aluminum Rod', stock: 114, unit: 'MT', reorderPoint: 100, status: 'warning' },
    { id: 'PVC-COMP', name: 'PVC Compound', stock: 450, unit: 'MT', reorderPoint: 200, status: 'good' },
    { id: 'XLPE', name: 'XLPE Material', stock: 85, unit: 'MT', reorderPoint: 80, status: 'warning' },
    { id: 'STEEL-WIRE', name: 'Steel Wire', stock: 320, unit: 'MT', reorderPoint: 150, status: 'good' },
  ];

  // Machine Capacity Data
  const machineCapacity = useMemo(() => {
    const machineList = Object.values(machines);
    return {
      total: machineList.length,
      running: machineList.filter(m => m.status === 'running').length,
      idle: machineList.filter(m => m.status === 'idle').length,
      maintenance: machineList.filter(m => m.status === 'maintenance').length,
      stopped: machineList.filter(m => m.status === 'stopped').length,
      utilization: Math.round((machineList.filter(m => m.status === 'running').length / machineList.length) * 100),
    };
  }, [machines]);

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
            {language === 'ar' ? 'بوابة قسم التخطيط' : 'Planning Department Portal'}
          </h1>
          <p style={{ color: colors.textSecondary }}>
            {language === 'ar'
              ? 'حلقة الوصل بين المبيعات والإنتاج وسلاسل الإمداد'
              : 'Connecting Sales, Production & Supply Chain'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWorkOrderForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #F39200, #FFB84D)' }}
          >
            <Plus className="w-5 h-5" />
            {language === 'ar' ? 'أمر عمل جديد' : 'New Work Order'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 rounded-xl"
            style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}` }}
          >
            <RefreshCw className="w-5 h-5" style={{ color: colors.textSecondary }} />
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 p-1 rounded-xl overflow-x-auto"
        style={{ background: colors.bgTertiary }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap"
              style={{
                background: isActive ? colors.bgCard : 'transparent',
                color: isActive ? '#F39200' : colors.textSecondary,
                boxShadow: isActive ? (isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)') : 'none',
              }}
            >
              <Icon className="w-4 h-4" />
              {language === 'ar' ? tab.labelAr : tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <DashboardTab
            key="dashboard"
            kpiData={kpiData}
            materialStatus={materialStatus}
            machineCapacity={machineCapacity}
            salesOrders={salesOrders}
            colors={colors}
            isDark={isDark}
            language={language}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersTab
            key="orders"
            salesOrders={salesOrders}
            colors={colors}
            isDark={isDark}
            language={language}
            onSelectOrder={setSelectedOrder}
          />
        )}
        {activeTab === 'workorders' && (
          <WorkOrdersTab
            key="workorders"
            colors={colors}
            isDark={isDark}
            language={language}
            onShowForm={() => setShowWorkOrderForm(true)}
          />
        )}
        {activeTab === 'capacity' && (
          <CapacityTab
            key="capacity"
            machines={machines}
            machineCapacity={machineCapacity}
            colors={colors}
            isDark={isDark}
            language={language}
          />
        )}
        {activeTab === 'materials' && (
          <MaterialsTab
            key="materials"
            materialStatus={materialStatus}
            colors={colors}
            isDark={isDark}
            language={language}
            onShowReservation={() => setShowReservationForm(true)}
          />
        )}
        {activeTab === 'tools' && (
          <ToolsTab
            key="tools"
            colors={colors}
            isDark={isDark}
            language={language}
            onShowCuttingForm={() => setShowCuttingForm(true)}
          />
        )}
      </AnimatePresence>

      {/* Work Order Form Modal */}
      <AnimatePresence>
        {showWorkOrderForm && (
          <WorkOrderFormModal
            onClose={() => setShowWorkOrderForm(false)}
            colors={colors}
            isDark={isDark}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* Cutting Instruction Form Modal */}
      <AnimatePresence>
        {showCuttingForm && (
          <CuttingInstructionModal
            onClose={() => setShowCuttingForm(false)}
            colors={colors}
            isDark={isDark}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* Material Reservation Form Modal */}
      <AnimatePresence>
        {showReservationForm && (
          <MaterialReservationModal
            onClose={() => setShowReservationForm(false)}
            colors={colors}
            isDark={isDark}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== DASHBOARD TAB ====================
const DashboardTab = ({ kpiData, materialStatus, machineCapacity, salesOrders, colors, isDark, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title={language === 'ar' ? 'الطلبات المتأخرة' : 'Delayed Orders'}
          value={kpiData.delayedOrders.value}
          suffix="%"
          subValue={`${kpiData.delayedOrders.percentage}%`}
          trend={kpiData.delayedOrders.trend}
          target={kpiData.delayedOrders.target}
          icon={<Clock className="w-5 h-5" />}
          color="red"
          colors={colors}
        />
        <KPICard
          title={language === 'ar' ? 'تراكم التسليمات' : 'Delivery Backlog'}
          value={kpiData.deliveryBacklog.value.toLocaleString()}
          suffix=" MT"
          trend={kpiData.deliveryBacklog.trend}
          change={kpiData.deliveryBacklog.change}
          icon={<Truck className="w-5 h-5" />}
          color="yellow"
          colors={colors}
        />
        <KPICard
          title={language === 'ar' ? 'دقة الجدولة' : 'Schedule Adherence'}
          value={kpiData.scheduleAdherence.value}
          suffix="%"
          target={kpiData.scheduleAdherence.target}
          trend={kpiData.scheduleAdherence.trend}
          icon={<Target className="w-5 h-5" />}
          color="green"
          colors={colors}
        />
        <KPICard
          title={language === 'ar' ? 'تنبيهات المواد' : 'Material Alerts'}
          value={kpiData.materialAlerts.value}
          subValue={`${kpiData.materialAlerts.critical} ${language === 'ar' ? 'حرج' : 'critical'}`}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
          colors={colors}
        />
        <KPICard
          title={language === 'ar' ? 'أوامر العمل المعلقة' : 'Pending Work Orders'}
          value={kpiData.pendingWorkOrders.value}
          subValue={`${kpiData.pendingWorkOrders.urgent} ${language === 'ar' ? 'عاجل' : 'urgent'}`}
          icon={<Clipboard className="w-5 h-5" />}
          color="blue"
          colors={colors}
        />
        <KPICard
          title={language === 'ar' ? 'كفاءة الإنتاج' : 'Production Efficiency'}
          value={kpiData.productionEfficiency.value}
          suffix="%"
          trend={kpiData.productionEfficiency.trend}
          icon={<Zap className="w-5 h-5" />}
          color="purple"
          colors={colors}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Capacity Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {language === 'ar' ? 'حالة الماكينات' : 'Machine Status'}
            </h3>
            <span className="text-2xl font-bold" style={{ color: '#F39200' }}>
              {machineCapacity.utilization}%
            </span>
          </div>

          <div className="space-y-4">
            <StatusBar label={language === 'ar' ? 'تعمل' : 'Running'} value={machineCapacity.running} total={machineCapacity.total} color="#10B981" colors={colors} />
            <StatusBar label={language === 'ar' ? 'خامدة' : 'Idle'} value={machineCapacity.idle} total={machineCapacity.total} color="#F59E0B" colors={colors} />
            <StatusBar label={language === 'ar' ? 'صيانة' : 'Maintenance'} value={machineCapacity.maintenance} total={machineCapacity.total} color="#3B82F6" colors={colors} />
            <StatusBar label={language === 'ar' ? 'متوقفة' : 'Stopped'} value={machineCapacity.stopped} total={machineCapacity.total} color="#EF4444" colors={colors} />
          </div>
        </motion.div>

        {/* Material Alerts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {language === 'ar' ? 'حالة المخزون' : 'Stock Status'}
            </h3>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="space-y-3">
            {materialStatus.slice(0, 4).map((material) => (
              <MaterialStatusRow key={material.id} material={material} colors={colors} language={language} />
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {language === 'ar' ? 'أحدث الطلبات' : 'Recent Orders'}
            </h3>
            <FileText className="w-5 h-5" style={{ color: colors.textSecondary }} />
          </div>

          <div className="space-y-3">
            {salesOrders.slice(0, 4).map((order) => (
              <OrderRow key={order.id} order={order} colors={colors} language={language} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Production Schedule - Gantt Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            {language === 'ar' ? 'جدول الإنتاج (اليوم)' : 'Production Schedule (Today)'}
          </h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-sm" style={{ background: colors.bgTertiary, color: colors.textSecondary }}>
              {language === 'ar' ? 'يوم' : 'Day'}
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm" style={{ background: colors.bgTertiary, color: colors.textSecondary }}>
              {language === 'ar' ? 'أسبوع' : 'Week'}
            </button>
          </div>
        </div>

        <ProductionScheduleGantt colors={colors} isDark={isDark} language={language} />
      </motion.div>
    </motion.div>
  );
};

// ==================== ORDERS TAB ====================
const OrdersTab = ({ salesOrders, colors, isDark, language, onSelectOrder }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = salesOrders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl w-64"
              style={{
                background: colors.bgTertiary,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl"
            style={{
              background: colors.bgTertiary,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary
            }}
          >
            <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
            <option value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
            <option value="delayed">{language === 'ar' ? 'متأخر' : 'Delayed'}</option>
            <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textSecondary }}>
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: colors.bgTertiary }}>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {language === 'ar' ? 'رقم الطلب' : 'Order ID'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {language === 'ar' ? 'العميل' : 'Customer'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {language === 'ar' ? 'الكمية (KM)' : 'Qty (KM)'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {language === 'ar' ? 'القيمة (SAR)' : 'Value (SAR)'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {language === 'ar' ? 'تاريخ التسليم' : 'Due Date'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {language === 'ar' ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="transition-colors"
                  style={{
                    borderTop: `1px solid ${colors.border}`,
                    background: index % 2 === 0 ? 'transparent' : colors.bgTertiary + '40'
                  }}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium" style={{ color: '#F39200' }}>{order.id}</span>
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textPrimary }}>{order.customer}</td>
                  <td className="px-6 py-4" style={{ color: colors.textPrimary }}>{order.totalKM.toLocaleString()}</td>
                  <td className="px-6 py-4" style={{ color: colors.textPrimary }}>{order.totalValue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} language={language} />
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.textSecondary }}>{order.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-green-500/10 transition-colors">
                        <Send className="w-4 h-4 text-green-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== WORK ORDERS TAB ====================
const WorkOrdersTab = ({ colors, isDark, language, onShowForm }) => {
  const workOrdersList = [
    { id: 'WO-2024-001', product: 'LV Cable 4x70mm', machine: 'XL-1', qty: 5000, unit: 'M', status: 'in-progress', progress: 65, operator: 'Ahmed Ali' },
    { id: 'WO-2024-002', product: 'Control Cable 12x2.5mm', machine: 'XL-2', qty: 8000, unit: 'M', status: 'in-progress', progress: 40, operator: 'Mohammed Hassan' },
    { id: 'WO-2024-003', product: 'Armored Cable 3x185mm', machine: 'AR-2', qty: 3000, unit: 'M', status: 'pending', progress: 0, operator: '-' },
    { id: 'WO-2024-004', product: 'Instrumentation Cable', machine: 'PS-1', qty: 10000, unit: 'M', status: 'completed', progress: 100, operator: 'Khalid Omar' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث عن أمر عمل...' : 'Search work order...'}
              className="pl-10 pr-4 py-2 rounded-xl w-64"
              style={{
                background: colors.bgTertiary,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary
              }}
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShowForm}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #F39200, #FFB84D)' }}
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'أمر عمل جديد' : 'New Work Order'}
        </motion.button>
      </div>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workOrdersList.map((wo) => (
          <WorkOrderCard key={wo.id} workOrder={wo} colors={colors} isDark={isDark} language={language} />
        ))}
      </div>
    </motion.div>
  );
};

// ==================== CAPACITY TAB ====================
const CapacityTab = ({ machines, machineCapacity, colors, isDark, language }) => {
  const machineList = Object.values(machines);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CapacityCard
          title={language === 'ar' ? 'إجمالي الماكينات' : 'Total Machines'}
          value={machineCapacity.total}
          icon={<Factory className="w-6 h-6" />}
          color="blue"
          colors={colors}
        />
        <CapacityCard
          title={language === 'ar' ? 'تعمل' : 'Running'}
          value={machineCapacity.running}
          icon={<Activity className="w-6 h-6" />}
          color="green"
          colors={colors}
        />
        <CapacityCard
          title={language === 'ar' ? 'متاحة' : 'Available'}
          value={machineCapacity.idle}
          icon={<CheckCircle className="w-6 h-6" />}
          color="yellow"
          colors={colors}
        />
        <CapacityCard
          title={language === 'ar' ? 'نسبة الاستخدام' : 'Utilization'}
          value={`${machineCapacity.utilization}%`}
          icon={<PieChart className="w-6 h-6" />}
          color="purple"
          colors={colors}
        />
      </div>

      {/* Machine List by Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MachineAreaCard
          area="PCP-1"
          machines={machineList.filter(m => m.area === 'PCP-1')}
          colors={colors}
          isDark={isDark}
          language={language}
        />
        <MachineAreaCard
          area="PCP-2"
          machines={machineList.filter(m => m.area === 'PCP-2')}
          colors={colors}
          isDark={isDark}
          language={language}
        />
      </div>
    </motion.div>
  );
};

// ==================== MATERIALS TAB ====================
const MaterialsTab = ({ materialStatus, colors, isDark, language, onShowReservation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
          {language === 'ar' ? 'حالة المواد الخام' : 'Raw Material Status'}
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShowReservation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}
        >
          <Box className="w-5 h-5" />
          {language === 'ar' ? 'حجز مواد' : 'Reserve Material'}
        </motion.button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materialStatus.map((material) => (
          <MaterialCard key={material.id} material={material} colors={colors} isDark={isDark} language={language} />
        ))}
      </div>
    </motion.div>
  );
};

// ==================== TOOLS TAB ====================
const ToolsTab = ({ colors, isDark, language, onShowCuttingForm }) => {
  const tools = [
    {
      id: 'cutting',
      title: language === 'ar' ? 'تعليمات التقصيص' : 'Cutting Instructions',
      description: language === 'ar' ? 'نموذج رقمي لتعليمات تقصيص البكرات' : 'Digital form for reel cutting instructions',
      icon: Scissors,
      color: '#F39200',
      onClick: onShowCuttingForm,
    },
    {
      id: 'simulator',
      title: language === 'ar' ? 'محاكي الجدولة' : 'Schedule Simulator',
      description: language === 'ar' ? 'محاكاة تأثير الطلبات الجديدة على الجدول' : 'Simulate impact of new orders on schedule',
      icon: Activity,
      color: '#3B82F6',
    },
    {
      id: 'risk',
      title: language === 'ar' ? 'سجل المخاطر' : 'Risk Log',
      description: language === 'ar' ? 'تسجيل ومتابعة المخاطر التشغيلية' : 'Log and track operational risks',
      icon: ShieldAlert,
      color: '#EF4444',
    },
    {
      id: 'offload',
      title: language === 'ar' ? 'طلب تحويل' : 'Offloading Request',
      description: language === 'ar' ? 'طلب تحويل المنتجات لمصنع آخر' : 'Request to transfer products to another plant',
      icon: ArrowRight,
      color: '#10B981',
    },
    {
      id: 'bom',
      title: language === 'ar' ? 'فحص BOM' : 'BOM Check',
      description: language === 'ar' ? 'التحقق من توفر هيكل المنتج' : 'Verify product structure availability',
      icon: Layers,
      color: '#8B5CF6',
    },
    {
      id: 'reports',
      title: language === 'ar' ? 'التقارير' : 'Reports',
      description: language === 'ar' ? 'تقارير التخطيط والأداء' : 'Planning and performance reports',
      icon: BookOpen,
      color: '#EC4899',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={tool.onClick}
            className="p-6 rounded-2xl cursor-pointer transition-all"
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${tool.color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: tool.color }} />
            </div>
            <h4 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>{tool.title}</h4>
            <p className="text-sm" style={{ color: colors.textSecondary }}>{tool.description}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ==================== COMPONENTS ====================

// KPI Card Component
const KPICard = ({ title, value, suffix, subValue, trend, target, change, icon, color, colors }) => {
  const colorMap = {
    red: '#EF4444',
    yellow: '#F59E0B',
    green: '#10B981',
    orange: '#F39200',
    blue: '#3B82F6',
    purple: '#8B5CF6',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      className="p-4 rounded-xl"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${colorMap[color]}20` }}
        >
          <div style={{ color: colorMap[color] }}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change && <span>{change}%</span>}
          </div>
        )}
      </div>
      <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold" style={{ color: colors.textPrimary }}>{value}</span>
        {suffix && <span className="text-sm" style={{ color: colors.textSecondary }}>{suffix}</span>}
      </div>
      {subValue && <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{subValue}</p>}
      {target && <p className="text-xs mt-1" style={{ color: colors.textMuted }}>Target: {target}%</p>}
    </motion.div>
  );
};

// Status Bar Component
const StatusBar = ({ label, value, total, color, colors }) => {
  const percentage = (value / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span style={{ color: colors.textSecondary }}>{label}</span>
        <span style={{ color: colors.textPrimary }}>{value}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Material Status Row
const MaterialStatusRow = ({ material, colors, language }) => {
  const statusColors = {
    critical: '#EF4444',
    warning: '#F59E0B',
    good: '#10B981',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: colors.bgTertiary }}>
      <div className="flex items-center gap-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: statusColors[material.status] }}
        />
        <span className="text-sm" style={{ color: colors.textPrimary }}>{material.name}</span>
      </div>
      <span className="text-sm font-medium" style={{ color: statusColors[material.status] }}>
        {material.stock} {material.unit}
      </span>
    </div>
  );
};

// Order Row Component
const OrderRow = ({ order, colors, language }) => {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-opacity-80"
      style={{ background: colors.bgTertiary }}
    >
      <div>
        <p className="font-medium" style={{ color: '#F39200' }}>{order.id}</p>
        <p className="text-xs" style={{ color: colors.textSecondary }}>{order.customer}</p>
      </div>
      <StatusBadge status={order.status} language={language} small />
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, language, small = false }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', label: language === 'ar' ? 'معلق' : 'Pending' },
    'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-600', label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress' },
    delayed: { bg: 'bg-red-500/20', text: 'text-red-600', label: language === 'ar' ? 'متأخر' : 'Delayed' },
    completed: { bg: 'bg-green-500/20', text: 'text-green-600', label: language === 'ar' ? 'مكتمل' : 'Completed' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`${config.bg} ${config.text} ${small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} rounded-full font-medium`}>
      {config.label}
    </span>
  );
};

// Work Order Card
const WorkOrderCard = ({ workOrder, colors, isDark, language }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold" style={{ color: '#F39200' }}>{workOrder.id}</span>
        <StatusBadge status={workOrder.status} language={language} small />
      </div>
      <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>{workOrder.product}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: colors.textSecondary }}>{language === 'ar' ? 'الماكينة' : 'Machine'}:</span>
          <span style={{ color: colors.textPrimary }}>{workOrder.machine}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: colors.textSecondary }}>{language === 'ar' ? 'الكمية' : 'Quantity'}:</span>
          <span style={{ color: colors.textPrimary }}>{workOrder.qty.toLocaleString()} {workOrder.unit}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: colors.textSecondary }}>{language === 'ar' ? 'المشغل' : 'Operator'}:</span>
          <span style={{ color: colors.textPrimary }}>{workOrder.operator}</span>
        </div>
      </div>
      {workOrder.status === 'in-progress' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: colors.textSecondary }}>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
            <span style={{ color: colors.textPrimary }}>{workOrder.progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #F39200, #FFB84D)' }}
              initial={{ width: 0 }}
              animate={{ width: `${workOrder.progress}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Capacity Card
const CapacityCard = ({ title, value, icon, color, colors }) => {
  const colorMap = {
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#8B5CF6',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${colorMap[color]}20` }}
      >
        <div style={{ color: colorMap[color] }}>{icon}</div>
      </div>
      <p className="text-sm" style={{ color: colors.textSecondary }}>{title}</p>
      <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{value}</p>
    </motion.div>
  );
};

// Machine Area Card
const MachineAreaCard = ({ area, machines, colors, isDark, language }) => {
  const running = machines.filter(m => m.status === 'running').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold" style={{ color: colors.textPrimary }}>{area}</h4>
        <span className="text-sm" style={{ color: colors.textSecondary }}>
          {running}/{machines.length} {language === 'ar' ? 'تعمل' : 'running'}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {machines.slice(0, 12).map((machine) => {
          const statusColors = {
            running: '#10B981',
            idle: '#F59E0B',
            stopped: '#EF4444',
            maintenance: '#3B82F6',
          };
          return (
            <div
              key={machine.id}
              className="p-2 rounded-lg text-center text-xs"
              style={{
                background: `${statusColors[machine.status]}20`,
                border: `1px solid ${statusColors[machine.status]}40`
              }}
            >
              <div className="font-medium" style={{ color: statusColors[machine.status] }}>{machine.id}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Material Card
const MaterialCard = ({ material, colors, isDark, language }) => {
  const statusColors = {
    critical: '#EF4444',
    warning: '#F59E0B',
    good: '#10B981',
  };
  const percentage = (material.stock / material.reorderPoint) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl"
      style={{
        background: colors.bgCard,
        border: `1px solid ${material.status === 'critical' ? '#EF444440' : colors.border}`
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium" style={{ color: colors.textPrimary }}>{material.name}</h4>
        <div
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${statusColors[material.status]}20`,
            color: statusColors[material.status]
          }}
        >
          {material.status === 'critical' ? (language === 'ar' ? 'حرج' : 'Critical') :
           material.status === 'warning' ? (language === 'ar' ? 'تحذير' : 'Warning') :
           (language === 'ar' ? 'جيد' : 'Good')}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span style={{ color: colors.textSecondary }}>{language === 'ar' ? 'المخزون' : 'Stock'}:</span>
          <span className="font-medium" style={{ color: colors.textPrimary }}>{material.stock} {material.unit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: colors.textSecondary }}>{language === 'ar' ? 'حد الطلب' : 'Reorder Point'}:</span>
          <span style={{ color: colors.textSecondary }}>{material.reorderPoint} {material.unit}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: statusColors[material.status] }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Production Schedule Gantt
const ProductionScheduleGantt = ({ colors, isDark, language }) => {
  const hours = Array.from({ length: 12 }, (_, i) => 6 + i);
  const scheduleData = [
    { machine: 'XL-1', jobs: [{ start: 6, end: 10, order: 'WO-001', color: '#F39200' }, { start: 11, end: 16, order: 'WO-005', color: '#3B82F6' }] },
    { machine: 'XL-2', jobs: [{ start: 6, end: 14, order: 'WO-002', color: '#10B981' }] },
    { machine: 'AR-2', jobs: [{ start: 8, end: 12, order: 'WO-003', color: '#8B5CF6' }, { start: 13, end: 17, order: 'WO-007', color: '#EC4899' }] },
    { machine: 'PS-1', jobs: [{ start: 6, end: 11, order: 'WO-004', color: '#F59E0B' }] },
    { machine: 'CV-1', jobs: [{ start: 7, end: 15, order: 'WO-006', color: '#EF4444' }] },
  ];

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: '800px' }}>
        {/* Time Header */}
        <div className="flex items-center border-b pb-2 mb-4" style={{ borderColor: colors.border }}>
          <div className="w-20 flex-shrink-0"></div>
          <div className="flex-1 flex">
            {hours.map(hour => (
              <div key={hour} className="flex-1 text-center text-xs" style={{ color: colors.textSecondary }}>
                {hour}:00
              </div>
            ))}
          </div>
        </div>

        {/* Machines */}
        {scheduleData.map((row) => (
          <div key={row.machine} className="flex items-center h-10 mb-2">
            <div className="w-20 flex-shrink-0 text-sm font-medium" style={{ color: colors.textPrimary }}>
              {row.machine}
            </div>
            <div className="flex-1 relative h-8 rounded-lg" style={{ background: colors.bgTertiary }}>
              {row.jobs.map((job, idx) => {
                const left = ((job.start - 6) / 12) * 100;
                const width = ((job.end - job.start) / 12) * 100;
                return (
                  <motion.div
                    key={idx}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="absolute h-6 top-1 rounded flex items-center justify-center text-xs text-white font-medium"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: job.color,
                      transformOrigin: 'left'
                    }}
                  >
                    {job.order}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== MODALS ====================

// Work Order Form Modal
const WorkOrderFormModal = ({ onClose, colors, isDark, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: colors.bgCard }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {language === 'ar' ? 'إصدار أمر عمل جديد' : 'Generate Work Order'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-500/10">
            <XCircle className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'رقم أمر البيع' : 'Sales Order #'}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                placeholder="SO-2024-XXX"
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'كود المنتج' : 'Product Code'}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                placeholder="Enter item code"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'الكمية' : 'Quantity'}
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'الوحدة' : 'Unit'}
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              >
                <option>Meters (M)</option>
                <option>Kilometers (KM)</option>
                <option>Metric Ton (MT)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'الماكينة المخصصة' : 'Assigned Machine'}
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              >
                <option>XL-1 - Extrusion Line 1</option>
                <option>XL-2 - Extrusion Line 2</option>
                <option>AR-2 - Armoring 2</option>
                <option>PS-1 - Processing PS-1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'تاريخ التسليم المطلوب' : 'Required Due Date'}
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
              {language === 'ar' ? 'ملاحظات' : 'Notes'}
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 rounded-xl resize-none"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            />
          </div>

          {/* BOM Check Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed"
            style={{ borderColor: '#3B82F6', color: '#3B82F6' }}
          >
            <Layers className="w-5 h-5" />
            {language === 'ar' ? 'فحص توفر BOM والمواد' : 'Check BOM & Material Availability'}
          </motion.button>

          <div className="flex items-center gap-4 pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl text-white font-medium"
              style={{ background: 'linear-gradient(135deg, #F39200, #FFB84D)' }}
            >
              {language === 'ar' ? 'إصدار أمر العمل' : 'Generate Work Order'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl"
              style={{ background: colors.bgTertiary, color: colors.textSecondary }}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Cutting Instruction Modal
const CuttingInstructionModal = ({ onClose, colors, isDark, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl rounded-2xl p-6"
        style={{ background: colors.bgCard }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {language === 'ar' ? 'تعليمات التقصيص' : 'Cutting Instructions'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-500/10">
            <XCircle className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
          {language === 'ar'
            ? 'نموذج رقمي بديل عن النموذج الورقي 130-FRM-REEL-BBCI'
            : 'Digital form replacing paper form 130-FRM-REEL-BBCI'}
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
              {language === 'ar' ? 'رقم أمر الإنتاج' : 'Production Order #'}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'مقاس البكرة' : 'Reel Size'}
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              >
                <option>Small (S)</option>
                <option>Medium (M)</option>
                <option>Large (L)</option>
                <option>Extra Large (XL)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'عدد القطع' : 'Number of Cuts'}
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
              {language === 'ar' ? 'السماكة المطلوبة' : 'Required Thickness'}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              placeholder="e.g., 2.5mm"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
              style={{ background: colors.bgTertiary, color: colors.textPrimary, border: `1px solid ${colors.border}` }}
            >
              <Printer className="w-5 h-5" />
              {language === 'ar' ? 'طباعة الملصق' : 'Print Label'}
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium"
              style={{ background: 'linear-gradient(135deg, #F39200, #FFB84D)' }}
            >
              <Send className="w-5 h-5" />
              {language === 'ar' ? 'إرسال للمنشار' : 'Send to Saw'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Material Reservation Modal
const MaterialReservationModal = ({ onClose, colors, isDark, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl rounded-2xl p-6"
        style={{ background: colors.bgCard }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {language === 'ar' ? 'حجز المواد الخام' : 'Raw Material Reservation'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-500/10">
            <XCircle className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
          {language === 'ar'
            ? 'نموذج رقمي بديل عن النموذج الورقي 132-FRM-PD-RMR'
            : 'Digital form replacing paper form 132-FRM-PD-RMR'}
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
              {language === 'ar' ? 'رقم أمر الإنتاج' : 'Production Order #'}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
              {language === 'ar' ? 'نوع المادة' : 'Material Type'}
            </label>
            <select
              className="w-full px-4 py-2 rounded-xl"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            >
              <option>Copper Rod</option>
              <option>Aluminum Rod</option>
              <option>PVC Compound</option>
              <option>XLPE Material</option>
              <option>Steel Wire</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'الكمية المطلوبة' : 'Required Quantity'}
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                {language === 'ar' ? 'الوحدة' : 'Unit'}
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl"
                style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              >
                <option>Metric Ton (MT)</option>
                <option>Kilograms (KG)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
              {language === 'ar' ? 'تاريخ الحاجة' : 'Required Date'}
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-xl"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl text-white font-medium"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}
            >
              {language === 'ar' ? 'حجز المواد' : 'Reserve Materials'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl"
              style={{ background: colors.bgTertiary, color: colors.textSecondary }}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Planning;
