
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Pages
import Home from './pages/Home';
import FactoryView from './pages/FactoryView';
import CapacityPlanning from './pages/CapacityPlanning';
import Scheduling from './pages/Scheduling';
import ShopFloor from './pages/ShopFloor';
import Maintenance from './pages/Maintenance';
import Quality from './pages/Quality';
import Scrap from './pages/Scrap';
import Workforce from './pages/Workforce';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Page Wrapper for Animations
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Main Layout with Sidebar and Header
const MainLayout = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  // Map route paths to titles
  const getPageTitle = () => {
    const path = location.pathname.substring(1) || 'home';
    const titles = {
      home: t('header.title'),
      factoryLayout: t('nav.factoryLayout'),
      capacityPlanning: t('nav.capacityPlanning'),
      scheduling: t('nav.scheduling'),
      shopFloor: t('nav.shopFloor'),
      maintenanceDashboard: t('nav.maintenanceDashboard'),
      qualityControl: t('nav.qualityControl'),
      scrapManagement: t('nav.scrapManagement'),
      workforceManagement: t('nav.workforceManagement'),
      analytics: t('nav.analytics'),
      settings: t('common.settings'),
    };
    return titles[path] || t('header.title');
  };

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <Sidebar currentPage={location.pathname.substring(1) || 'home'} onNavigate={setCurrentPage} />

      <main className={`transition-all duration-300 ${isRTL ? 'mr-[280px]' : 'ml-[280px]'}`}>
        <Header title={getPageTitle()} subtitle={t('header.subtitle')} />
        <AnimatePresence mode="wait">
          <PageWrapper key={location.pathname}>
            {children}
          </PageWrapper>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Root App Component - No Authentication Required
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <DataProvider>
            <Routes>
            {/* Public Routes - No Login Required */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/factoryLayout" element={<MainLayout><FactoryView /></MainLayout>} />
            <Route path="/capacityPlanning" element={<MainLayout><CapacityPlanning /></MainLayout>} />
            <Route path="/scheduling" element={<MainLayout><Scheduling /></MainLayout>} />
            <Route path="/shopFloor" element={<MainLayout><ShopFloor /></MainLayout>} />
            <Route path="/maintenanceDashboard" element={<MainLayout><Maintenance /></MainLayout>} />
            <Route path="/qualityControl" element={<MainLayout><Quality /></MainLayout>} />
            <Route path="/scrapManagement" element={<MainLayout><Scrap /></MainLayout>} />
            <Route path="/workforceManagement" element={<MainLayout><Workforce /></MainLayout>} />
            <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
