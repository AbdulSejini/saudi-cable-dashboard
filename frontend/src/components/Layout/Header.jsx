/**
 * Header Component
 * Saudi Cable Company Dashboard Header - Light Mode Theme
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  User,
  Globe,
  LogOut,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Sun,
  Moon,
} from 'lucide-react';

const Header = ({ title, subtitle }) => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { alerts, setAlerts } = useData();
  const { isDark, toggleTheme, colors } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadAlerts = alerts.filter(a => !a.read);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" style={{ color: '#F39200' }} />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <header
      className="sticky top-0 z-40 px-4 md:px-6 py-3 md:py-4"
      style={{
        background: isDark ? 'rgba(46, 45, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
        boxShadow: isDark ? '0 2px 12px rgba(0, 0, 0, 0.2)' : '0 2px 12px rgba(46, 45, 44, 0.06)',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-2xl font-bold"
            style={{ color: isDark ? colors.textPrimary : '#2E2D2C' }}
          >
            {title || t('header.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm hidden sm:block"
            style={{ color: isDark ? colors.textSecondary : '#666564' }}
          >
            {subtitle || t('header.subtitle')}
          </motion.p>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 ${isRTL ? 'right-4' : 'left-4'}`} style={{ color: isDark ? colors.textMuted : '#9CA3AF' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className={`w-full rounded-xl py-3 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
              style={{
                background: isDark ? colors.bgSecondary : '#F5F5F5',
                border: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
                color: isDark ? colors.textPrimary : '#2E2D2C',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#F39200';
                e.target.style.boxShadow = '0 0 0 3px rgba(243, 146, 0, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? colors.border : '#EAEAEA';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 md:p-3 rounded-xl transition-all"
            style={{
              background: isDark ? colors.bgSecondary : '#F5F5F5',
              border: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
            }}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#F39200' }} />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#666564' }} />
            )}
          </motion.button>

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="p-2 md:p-3 rounded-xl transition-all"
            style={{
              background: isDark ? colors.bgSecondary : '#F5F5F5',
              border: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
            }}
            title={t('header.language')}
          >
            <Globe className="w-4 h-4 md:w-5 md:h-5" style={{ color: isDark ? colors.textSecondary : '#666564' }} />
            <span className="sr-only">{language === 'en' ? 'العربية' : 'English'}</span>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 md:p-3 rounded-xl transition-all relative"
              style={{
                background: isDark ? colors.bgSecondary : '#F5F5F5',
                border: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
              }}
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5" style={{ color: isDark ? colors.textSecondary : '#666564' }} />
              {unreadAlerts.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#F39200' }}
                >
                  {unreadAlerts.length}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute top-full mt-2 w-80 rounded-xl shadow-2xl overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}
                  style={{
                    background: isDark ? colors.bgCard : 'white',
                    border: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
                  }}
                >
                  <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${isDark ? colors.border : '#EAEAEA'}` }}>
                    <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('header.notifications')}</h3>
                    {unreadAlerts.length > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs hover:underline"
                        style={{ color: '#F39200' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="p-4 text-center" style={{ color: colors.textSecondary }}>
                        {t('common.noData')}
                      </div>
                    ) : (
                      alerts.slice(0, 5).map((alert) => (
                        <div
                          key={alert.id}
                          className="p-4 transition-colors"
                          style={{
                            borderBottom: `1px solid ${isDark ? colors.border : '#F5F5F5'}`,
                            background: !alert.read ? 'rgba(243, 146, 0, 0.08)' : 'transparent'
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{alert.title}</p>
                              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{alert.message}</p>
                              <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile - Hidden on small mobile */}
          <div className="relative hidden sm:block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-xl transition-all"
              style={{
                background: isDark ? colors.bgSecondary : '#F5F5F5',
                border: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
              }}
            >
              <div
                className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)' }}
              >
                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>Admin User</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Operations Manager</p>
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" style={{ color: colors.textSecondary }} />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute top-full mt-2 w-48 rounded-xl shadow-2xl overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}
                  style={{
                    background: isDark ? colors.bgCard : 'white',
                    border: `1px solid ${isDark ? colors.border : '#EAEAEA'}`,
                  }}
                >
                  <button
                    className="w-full p-3 flex items-center gap-3 transition-colors"
                    style={{ color: colors.textSecondary }}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">{t('header.profile')}</span>
                  </button>
                  <button
                    className="w-full p-3 flex items-center gap-3 transition-colors text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">{t('header.logout')}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
