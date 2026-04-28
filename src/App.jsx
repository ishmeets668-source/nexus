import React, { useState, useEffect, Suspense, lazy } from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { UI_STRINGS } from './config/constants';

// Lazy load heavy components
const AIHeart = lazy(() => import('./components/AIHeart'));
const NexusChat = lazy(() => import('./components/NexusChat'));
const TacticalCursor = lazy(() => import('./components/TacticalCursor'));
const BiometricOverlay = lazy(() => import('./components/BiometricOverlay'));
const SystemMonitor = lazy(() => import('./components/SystemMonitor'));
const LoadingScreen = lazy(() => import('./components/LoadingScreen'));

import { isMobile } from './utils/device';

const ComponentLoader = () => (
  <div className="component-placeholder glass-panel">
    <div className="loader-pulse">INIT_COMPONENT...</div>
  </div>
);

function DashboardContent() {
  const { isInterlinking, latency, systemStatus } = useSystem();
  const [isLoading, setIsLoading] = useState(true);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);

    const handleAppLaunch = async (e) => {
      const app = e.detail;
      console.log(`[Nexus] Launching ${app}...`);
      try {
        // Use relative path for Vite proxy/middleware compatibility
        const response = await fetch(`/api/launcher?app=${app.toLowerCase()}`);
        if (!response.ok) throw new Error('BRIDGE_OFFLINE');
      } catch (err) {
        console.warn('SYSTEM_BRIDGE_UNAVAILABLE: Are you on mobile or is the dev server stopped?');
      }
    };

    window.addEventListener('app-launch', handleAppLaunch);

    return () => {
      clearInterval(timer);
      window.removeEventListener('app-launch', handleAppLaunch);
    };
  }, []);

  return (
    <div className="app-root">
      <div className={`app-container ${!isLoading ? 'app-entry' : ''} ${isInterlinking ? 'interlink-active' : ''}`}>
        {/* Persistent Background Elements */}
        <div className="circuit-bg"></div>
        <div className="circuit-pattern"></div>
        <div className="energy-line" style={{ animationDelay: '0s', left: '10%' }}></div>
        <div className="energy-line" style={{ animationDelay: '2s', left: '30%' }}></div>
        <div className="energy-line" style={{ animationDelay: '5s', left: '70%' }}></div>
        <div className="scanlines"></div>
        <div className="hud-frame">
          <div className="hud-corner tl"></div>
          <div className="hud-corner tr"></div>
          <div className="hud-corner bl"></div>
          <div className="hud-corner br"></div>
        </div>

        {!isMobile() && (
          <Suspense fallback={null}>
            <TacticalCursor />
          </Suspense>
        )}

        {/* Header Section */}
        <header className="main-header glass-panel">
          <div className="logo-group">
            <h1 className="glitch" data-text={UI_STRINGS.TITLE}>{UI_STRINGS.TITLE}</h1>
            <div className="status-group">
              <span className="status-badge">{systemStatus}</span>
              <span className="status-badge secure">{UI_STRINGS.ENCRYPTION}</span>
            </div>
          </div>

          <div className="nav-group">
            <div className="time-display">
              <div className="system-time">{systemTime}</div>
              <div className="system-link">{UI_STRINGS.NEURAL_LINK}</div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="main-layout">
          {/* Left Column: Diagnostics */}
          <aside className="side-column left-sidebar">
            <div className="glass-panel diag-panel">
              <h4 className="panel-title">SYSTEM_DIAGNOSTICS</h4>
              <Suspense fallback={<ComponentLoader />}>
                <SystemMonitor />
              </Suspense>
              <div className="glass-panel process-panel">
                <div className="process-header system-font">ACTIVE_PROCESSES:</div>
                <div className="process-list">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="process-item">
                      {`> PID_${Math.floor(Math.random() * 9000 + 1000)} ... RUNNING`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Center Column: AI Heart and Chat */}
          <div className="center-column">
            <div className="glass-panel heart-container">
              <Suspense fallback={<ComponentLoader />}>
                <AIHeart />
              </Suspense>
            </div>
          </div>

          {/* Right Column: Terminal and Logs */}
          <aside className="side-column right-sidebar">
            <div className="glass-panel chat-container">
              <Suspense fallback={<ComponentLoader />}>
                <NexusChat />
              </Suspense>
            </div>
          </aside>
        </main>

        {/* Footer HUD */}
        <footer className="main-footer">
          <div>{UI_STRINGS.FOOTER_BRAND}</div>
          <div className="footer-stats">
            <span>LATENCY: {latency}ms</span>
            <span>PACKETS: 100% SUCCESS</span>
            <span>AUTH: SHA-512</span>
          </div>
        </footer>

        <Suspense fallback={null}>
          <BiometricOverlay 
            isOpen={isSecurityOpen} 
            onClose={() => setIsSecurityOpen(false)}
            onAuthenticated={() => console.log("Authenticated")}
          />
        </Suspense>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <Suspense fallback={null}>
          <LoadingScreen onFinished={() => setIsLoading(false)} />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  return (
    <SystemProvider>
      <DashboardContent />
    </SystemProvider>
  );
}

export default App;
