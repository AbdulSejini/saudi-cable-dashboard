/**
 * Settings Page
 * Configure dashboard preferences
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, colors, theme, setTheme: setAppTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Common styles
  const cardStyle = {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
  };

  const selectStyle = {
    background: colors.bgTertiary,
    border: `1px solid ${colors.border}`,
    color: colors.textPrimary,
  };

  const inputStyle = {
    background: colors.bgTertiary,
    border: `1px solid ${colors.border}`,
    color: colors.textPrimary,
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8"
        style={{ background: colors.bgCard }}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {t('common.settings')}
        </h1>
        <p className="mb-6" style={{ color: colors.textSecondary }}>
          Configure your dashboard preferences
        </p>

        <div className="space-y-6">
          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
              Language / اللغة
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: colors.textSecondary }}>Current language</p>
                <p className="font-medium" style={{ color: colors.textPrimary }}>
                  {language === 'en' ? 'English' : 'العربية'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="px-6 py-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400
                          hover:bg-blue-500/30 transition-all"
              >
                {language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
              </motion.button>
            </div>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
              Appearance
            </h3>
            <div className="flex gap-4">
              {['dark', 'light', 'system'].map((themeOption) => (
                <motion.button
                  key={themeOption}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAppTheme(themeOption)}
                  className="flex-1 px-4 py-3 rounded-lg border capitalize transition-all"
                  style={{
                    background: theme === themeOption ? 'rgba(59, 130, 246, 0.2)' : colors.bgTertiary,
                    borderColor: theme === themeOption ? '#3B82F6' : colors.border,
                    color: theme === themeOption ? '#60A5FA' : colors.textSecondary,
                  }}
                >
                  {themeOption === 'dark' ? '🌙' : themeOption === 'light' ? '☀️' : '💻'} {themeOption}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
              Notifications
            </h3>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive alerts via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ color: colors.textPrimary }}>{item.label}</p>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{item.desc}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNotifications({
                      ...notifications,
                      [item.key]: !notifications[item.key]
                    })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      notifications[item.key] ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                      style={{
                        left: notifications[item.key] ? 'calc(100% - 22px)' : '2px'
                      }}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Auto Refresh Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
              Data Refresh
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: colors.textPrimary }}>Auto Refresh</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Automatically refresh dashboard data
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    autoRefresh ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                    style={{
                      left: autoRefresh ? 'calc(100% - 22px)' : '2px'
                    }}
                  />
                </motion.button>
              </div>

              {autoRefresh && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                    Refresh interval: {refreshInterval} seconds
                  </p>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="10"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textMuted }}>
                    <span>10s</span>
                    <span>60s</span>
                    <span>120s</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Display Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
              Display Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                  Default View
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={selectStyle}
                >
                  <option value="dashboard" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    Dashboard Overview
                  </option>
                  <option value="factory" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    Factory Layout
                  </option>
                  <option value="production" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    Production View
                  </option>
                  <option value="analytics" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    Analytics
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                  Date Format
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={selectStyle}
                >
                  <option value="dd/mm/yyyy" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    DD/MM/YYYY
                  </option>
                  <option value="mm/dd/yyyy" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    MM/DD/YYYY
                  </option>
                  <option value="yyyy-mm-dd" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    YYYY-MM-DD
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                  Time Format
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={selectStyle}
                >
                  <option value="24" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    24-hour
                  </option>
                  <option value="12" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    12-hour (AM/PM)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                  Number Format
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg"
                  style={selectStyle}
                >
                  <option value="en" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    1,234.56
                  </option>
                  <option value="ar" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
                    ١٬٢٣٤٫٥٦
                  </option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* API Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
              API Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                  API Endpoint
                </label>
                <input
                  type="text"
                  defaultValue={process.env.REACT_APP_API_URL || 'http://localhost:8000'}
                  className="w-full px-4 py-2 rounded-lg"
                  style={inputStyle}
                  disabled
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500
                      text-white font-medium text-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
