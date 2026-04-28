import React, { createContext, useContext, useState, useEffect } from 'react';
import { SYSTEM_CONFIG } from '../config/constants';

const SystemContext = createContext();

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

export const SystemProvider = ({ children }) => {
  const [isInterlinking, setIsInterlinking] = useState(false);
  const [systemStatus, setSystemStatus] = useState('STABLE');
  const [latency, setLatency] = useState(14);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Simulate periodic latency fluctuations
    const interval = setInterval(() => {
      setLatency(prev => Math.max(8, Math.min(45, prev + (Math.random() * 4 - 2))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerInterlink = () => {
    setIsInterlinking(true);
    setTimeout(() => setIsInterlinking(false), 500);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    isInterlinking,
    systemStatus,
    latency: Math.floor(latency),
    isLiteMode,
    setIsLiteMode,
    theme,
    toggleTheme,
    triggerInterlink,
    version: SYSTEM_CONFIG.VERSION
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};
