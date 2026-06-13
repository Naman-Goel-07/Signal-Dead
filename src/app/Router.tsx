import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useLocationStore } from '@/store/locationStore';
import { AppLayout } from '@/components/layout/AppLayout';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { ConsolePage } from '@/pages/ConsolePage';
import { MissionStatusPage } from '@/pages/MissionStatusPage';
import { TelemetryPage } from '@/pages/TelemetryPage';
import { ForecastPage } from '@/pages/ForecastPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { location } = useLocationStore();
  const currentPath = useLocation().pathname;
  
  if (!location) {
    return <Navigate to="/" state={{ from: currentPath }} replace />;
  }
  
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/console" element={
          <ProtectedRoute>
            <ConsolePage />
          </ProtectedRoute>
        } />
        
        <Route path="/console/status" element={
          <ProtectedRoute>
            <MissionStatusPage />
          </ProtectedRoute>
        } />
        
        <Route path="/console/telemetry" element={
          <ProtectedRoute>
            <TelemetryPage />
          </ProtectedRoute>
        } />
        
        <Route path="/console/advisory" element={
          <ProtectedRoute>
            <AdvisoryPage />
          </ProtectedRoute>
        } />
        
        <Route path="/console/forecast" element={
          <ProtectedRoute>
            <ForecastPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};
