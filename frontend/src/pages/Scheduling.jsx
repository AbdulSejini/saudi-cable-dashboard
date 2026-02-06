/**
 * Scheduling Page
 * Gantt chart interface for work order scheduling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import GanttChart from '../components/Scheduling/GanttChart';

const Scheduling = () => {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{t('scheduling.title')}</h1>
        <p style={{ color: colors.textSecondary }}>Drag and drop to reschedule work orders</p>
      </motion.div>
      <GanttChart />
    </div>
  );
};

export default Scheduling;
