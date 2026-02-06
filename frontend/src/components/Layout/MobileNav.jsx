/**
 * Mobile Bottom Navigation Component
 * Shows only on mobile devices (< 768px)
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Map,
  Factory,
  Wrench,
  BarChart3,
  Menu,
  X,
  Calendar,
  CheckCircle,
  Trash2,
  Users,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

// All menu items for the expanded menu
const allMenuItems = [
  { id: 'home', icon: Home, path: '/', labelEn: 'Home', labelAr: 'الرئيسية' },
  { id: 'factoryLayout', icon: Map, path: '/factoryLayout', labelEn: 'Factory', labelAr: 'المصنع' },
  { id: 'capacityPlanning', icon: BarChart3, path: '/capacityPlanning', labelEn: 'Capacity', labelAr: 'الطاقة' },
  { id: 'scheduling', icon: Calendar, path: '/scheduling', labelEn: 'Schedule', labelAr: 'الجدولة' },
  { id: 'shopFloor', icon: Factory, path: '/shopFloor', labelEn: 'Shop Floor', labelAr: 'أرضية الإنتاج' },
  { id: 'maintenanceDashboard', icon: Wrench, path: '/maintenanceDashboard', labelEn: 'Maintenance', labelAr: 'الصيانة' },
  { id: 'qualityControl', icon: CheckCircle, path: '/qualityControl', labelEn: 'Quality', labelAr: 'الجودة' },
  { id: 'scrapManagement', icon: Trash2, path: '/scrapManagement', labelEn: 'Scrap', labelAr: 'السكراب' },
  { id: 'workforceManagement', icon: Users, path: '/workforceManagement', labelEn: 'Workforce', labelAr: 'القوى العاملة' },
  { id: 'analytics', icon: LayoutDashboard, path: '/analytics', labelEn: 'Analytics', labelAr: 'التحليلات' },
  { id: 'settings', icon: Settings, path: '/settings', labelEn: 'Settings', labelAr: 'الإعدادات' },
];

// Main 4 items for bottom bar (most used)
const mainMenuItems = [
  { id: 'home', icon: Home, path: '/', labelEn: 'Home', labelAr: 'الرئيسية' },
  { id: 'factoryLayout', icon: Map, path: '/factoryLayout', labelEn: 'Factory', labelAr: 'المصنع' },
  { id: 'maintenanceDashboard', icon: Wrench, path: '/maintenanceDashboard', labelEn: 'Maintenance', labelAr: 'الصيانة' },
  { id: 'analytics', icon: LayoutDashboard, path: '/analytics', labelEn: 'Analytics', labelAr: 'التحليلات' },
];

const MobileNav = () => {
  const { isRTL } = useLanguage();
  const { isDark, colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentPath = location.pathname;

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar - Fixed at bottom on mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #2E2D2C 0%, #1A1918 100%)'
            : 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
          borderTop: `1px solid ${colors.border}`,
          boxShadow: isDark
            ? '0 -4px 20px rgba(0, 0, 0, 0.3)'
            : '0 -4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {/* Main Menu Items */}
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center justify-center px-3 py-2 rounded-xl min-w-[60px]"
                style={isActive ? {
                  background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)',
                } : {}}
              >
                <Icon
                  className="w-5 h-5 mb-1"
                  style={{ color: isActive ? '#FFFFFF' : colors.textMuted }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? '#FFFFFF' : colors.textMuted }}
                >
                  {isRTL ? item.labelAr : item.labelEn}
                </span>
              </motion.button>
            );
          })}

          {/* More Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center px-3 py-2 rounded-xl min-w-[60px]"
          >
            <Menu className="w-5 h-5 mb-1" style={{ color: colors.textMuted }} />
            <span className="text-[10px] font-medium" style={{ color: colors.textMuted }}>
              {isRTL ? 'المزيد' : 'More'}
            </span>
          </motion.button>
        </div>
      </nav>

      {/* Full Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
              style={{
                background: isDark
                  ? 'linear-gradient(180deg, #2E2D2C 0%, #1A1918 100%)'
                  : 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
                maxHeight: '80vh',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div
                  className="w-12 h-1 rounded-full"
                  style={{ background: colors.border }}
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {isRTL ? 'القائمة' : 'Menu'}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full"
                  style={{ background: colors.bgTertiary }}
                >
                  <X className="w-5 h-5" style={{ color: colors.textPrimary }} />
                </motion.button>
              </div>

              {/* Menu Items Grid */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                <div className="grid grid-cols-3 gap-3">
                  {allMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNavigate(item.path)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl"
                        style={isActive ? {
                          background: 'linear-gradient(135deg, #F39200 0%, #CC7A00 100%)',
                          boxShadow: '0 4px 14px rgba(243, 146, 0, 0.35)',
                        } : {
                          background: colors.bgTertiary,
                        }}
                      >
                        <Icon
                          className="w-6 h-6 mb-2"
                          style={{ color: isActive ? '#FFFFFF' : '#F39200' }}
                        />
                        <span
                          className="text-xs font-medium text-center"
                          style={{ color: isActive ? '#FFFFFF' : colors.textPrimary }}
                        >
                          {isRTL ? item.labelAr : item.labelEn}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
