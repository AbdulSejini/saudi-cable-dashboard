
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Pages
import Login from './pages/Login';
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

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
    <div className="min-h-screen bg-[#0f1115]"> {/* Dark background matching theme */}
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

// Root App Component
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout><Home /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/factoryLayout" element={
                <ProtectedRoute>
                  <MainLayout><FactoryView /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/capacityPlanning" element={
                <ProtectedRoute>
                  <MainLayout><CapacityPlanning /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/scheduling" element={
                <ProtectedRoute>
                  <MainLayout><Scheduling /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/shopFloor" element={
                <ProtectedRoute>
                  <MainLayout><ShopFloor /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/maintenanceDashboard" element={
                <ProtectedRoute>
                  <MainLayout><Maintenance /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/qualityControl" element={
                <ProtectedRoute>
                  <MainLayout><Quality /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/scrapManagement" element={
                <ProtectedRoute>
                  <MainLayout><Scrap /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/workforceManagement" element={
                <ProtectedRoute>
                  <MainLayout><Workforce /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <MainLayout><Analytics /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout><Settings /></MainLayout>
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
