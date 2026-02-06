import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  AlertTriangle,
  Clock,
  Package,
  User,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download
} from 'lucide-react';

const GanttChart = () => {
  const { t } = useLanguage();
  const { workOrders, machines, setWorkOrders } = useData();
  const { isDark, colors } = useTheme();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // day, week, month
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterArea, setFilterArea] = useState('all');

  // Generate time slots based on view mode
  const timeSlots = useMemo(() => {
    const slots = [];
    if (viewMode === 'day') {
      for (let i = 0; i < 24; i++) {
        slots.push(`${i.toString().padStart(2, '0')}:00`);
      }
    } else if (viewMode === 'week') {
      const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      days.forEach(day => slots.push(day));
    }
    return slots;
  }, [viewMode]);

  // Get unique machines from work orders
  const scheduledMachines = useMemo(() => {
    const machineIds = [...new Set(workOrders.map(wo => wo.machine))];
    return machineIds.map(id => machines[id]).filter(Boolean);
  }, [workOrders, machines]);

  // Filter machines by area
  const filteredMachines = useMemo(() => {
    if (filterArea === 'all') return scheduledMachines;
    return scheduledMachines.filter(m => m.area === filterArea);
  }, [scheduledMachines, filterArea]);

  // Get work orders for a specific machine
  const getOrdersForMachine = (machineId) => {
    return workOrders.filter(wo => wo.machine === machineId);
  };

  // Priority colors
  const priorityColors = {
    high: { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-400' },
    medium: { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-400' },
    low: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-400' },
  };

  // Status colors
  const statusColors = {
    'pending': 'from-gray-500 to-gray-600',
    'in-progress': 'from-blue-500 to-cyan-500',
    'completed': 'from-green-500 to-emerald-500',
    'delayed': 'from-red-500 to-orange-500',
  };

  // Color sequence warning
  const checkColorSequence = (currentColor, previousColor) => {
    const darkColors = ['black', 'blue', 'red', 'green'];
    const lightColors = ['white', 'yellow', 'orange'];

    if (darkColors.includes(previousColor) && lightColors.includes(currentColor)) {
      return true; // Warning: dark to light transition
    }
    return false;
  };

  // Handle drag and drop reorder
  const handleReorder = (machineId, newOrder) => {
    setWorkOrders(prev => {
      const otherOrders = prev.filter(wo => wo.machine !== machineId);
      return [...otherOrders, ...newOrder];
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="rounded-xl p-4" style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - (viewMode === 'week' ? 7 : 1));
                setCurrentDate(newDate);
              }}
              className="p-2 rounded-lg transition-colors"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}` }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </motion.button>

            <span className="font-medium min-w-[150px] text-center" style={{ color: colors.textPrimary }}>
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + (viewMode === 'week' ? 7 : 1));
                setCurrentDate(newDate);
              }}
              className="p-2 rounded-lg transition-colors"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}` }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </motion.button>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            {['day', 'week'].map((mode) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode(mode)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: viewMode === mode ? 'rgba(59, 130, 246, 0.2)' : colors.bgTertiary,
                  color: viewMode === mode ? '#3B82F6' : colors.textSecondary,
                  border: viewMode === mode ? '1px solid rgba(59, 130, 246, 0.3)' : `1px solid ${colors.border}`,
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: colors.textMuted }} />
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              style={{
                background: colors.bgTertiary,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            >
              <option value="all" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>All Areas</option>
              <option value="PCP-1" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>PCP-1</option>
              <option value="PCP-2" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>PCP-2</option>
              <option value="CV-Line" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>CV-Line</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-500 text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Order
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 rounded-lg transition-colors"
              style={{ background: colors.bgTertiary, border: `1px solid ${colors.border}` }}
            >
              <Download className="w-5 h-5" style={{ color: colors.textMuted }} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="rounded-xl overflow-hidden" style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
        {/* Timeline Header */}
        <div className="flex" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <div className="w-48 flex-shrink-0 p-4" style={{ borderRight: `1px solid ${colors.border}` }}>
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Machine</span>
          </div>
          <div className="flex-1 flex overflow-x-auto">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="flex-1 min-w-[60px] p-2 text-center text-xs"
                style={{ color: colors.textMuted, borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        {/* Machine Rows */}
        <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          {filteredMachines.map((machine) => (
            <div key={machine.id} className="flex" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
              {/* Machine Info */}
              <div
                className="w-48 flex-shrink-0 p-4"
                style={{ borderRight: `1px solid ${colors.border}`, background: colors.bgTertiary }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      machine.status === 'running' ? 'bg-green-500' :
                      machine.status === 'idle' ? 'bg-yellow-500' :
                      machine.status === 'maintenance' ? 'bg-purple-500' :
                      'bg-red-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{machine.id}</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>{machine.type}</p>
                  </div>
                </div>
              </div>

              {/* Orders Timeline */}
              <div className="flex-1 relative min-h-[80px] p-2">
                <Reorder.Group
                  axis="x"
                  values={getOrdersForMachine(machine.id)}
                  onReorder={(newOrder) => handleReorder(machine.id, newOrder)}
                  className="flex gap-2 h-full items-center"
                >
                  {getOrdersForMachine(machine.id).map((order, index) => {
                    const prevOrder = getOrdersForMachine(machine.id)[index - 1];
                    const hasColorWarning = prevOrder && checkColorSequence(order.color, prevOrder.color);

                    return (
                      <Reorder.Item
                        key={order.id}
                        value={order}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedOrder(order)}
                          className={`
                            relative rounded-lg overflow-hidden
                            bg-gradient-to-r ${statusColors[order.status]}
                            min-w-[120px] h-14
                            ${selectedOrder?.id === order.id ? 'ring-2 ring-white' : ''}
                          `}
                        >
                          {/* Progress Bar */}
                          <div
                            className="absolute bottom-0 left-0 h-1 bg-white/30"
                            style={{ width: `${order.progress}%` }}
                          />

                          {/* Content */}
                          <div className="p-2 flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-white/50" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white truncate">{order.id}</p>
                              <p className="text-[10px] text-white/70 truncate">{order.product}</p>
                            </div>
                          </div>

                          {/* Priority Indicator */}
                          <div className={`absolute top-0 right-0 w-2 h-2 rounded-bl ${priorityColors[order.priority].bg}`} />

                          {/* Color Warning */}
                          {hasColorWarning && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -left-1 p-1 rounded-full bg-yellow-500"
                            >
                              <AlertTriangle className="w-3 h-3 text-yellow-900" />
                            </motion.div>
                          )}
                        </motion.div>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>

                {getOrdersForMachine(machine.id).length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs" style={{ color: colors.textMuted }}>No scheduled orders</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Detail Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-xl p-6"
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{selectedOrder.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[selectedOrder.priority].bg} text-white`}>
                    {selectedOrder.priority.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: colors.textSecondary }}>{selectedOrder.product}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg transition-colors"
                style={{ background: colors.bgTertiary, color: colors.textMuted }}
              >
                ×
              </motion.button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard icon={<User className="w-4 h-4" />} label="Customer" value={selectedOrder.customer} colors={colors} />
              <InfoCard icon={<Package className="w-4 h-4" />} label="Machine" value={selectedOrder.machine} colors={colors} />
              <InfoCard icon={<Clock className="w-4 h-4" />} label="Due Date" value={selectedOrder.dueDate} colors={colors} />
              <InfoCard
                label="Progress"
                colors={colors}
                value={
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: colors.border }}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${selectedOrder.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{selectedOrder.progress}%</span>
                  </div>
                }
              />
            </div>

            {/* Color Sequence Info */}
            <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{ background: colors.bgTertiary }}>
              <div
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: selectedOrder.color, border: `2px solid ${colors.border}` }}
              />
              <div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Product Color</p>
                <p className="font-medium capitalize" style={{ color: colors.textPrimary }}>{selectedOrder.color}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="rounded-xl p-4" style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: colors.textSecondary }}>Priority:</span>
            {Object.entries(priorityColors).map(([key, colorSet]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colorSet.bg}`} />
                <span className="text-xs capitalize" style={{ color: colors.textPrimary }}>{key}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-yellow-500 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Color sequence warning (dark → light)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon, label, value, colors }) => (
  <div className="p-4 rounded-lg" style={{ background: colors?.bgTertiary || '#F5F5F5' }}>
    <div className="flex items-center gap-2 mb-1" style={{ color: colors?.textSecondary || '#666564' }}>
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <div className="font-medium" style={{ color: colors?.textPrimary || '#2E2D2C' }}>{value}</div>
  </div>
);

export default GanttChart;
