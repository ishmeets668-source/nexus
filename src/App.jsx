import React, { useState, useEffect } from 'react';
import HoloTerminal from './components/HoloTerminal';
import AIHeart from './components/AIHeart';
import NexusChat from './components/NexusChat';
import TacticalCursor from './components/TacticalCursor';
import BiometricOverlay from './components/BiometricOverlay';
import SystemMonitor from './components/SystemMonitor';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isInterlinking, setIsInterlinking] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);

    const handleInterlink = () => {
      setIsInterlinking(true);
      setTimeout(() => setIsInterlinking(false), 500);
    };

    window.addEventListener('system-interlink', handleInterlink);
    return () => {
      clearInterval(timer);
      window.removeEventListener('system-interlink', handleInterlink);
    };
  }, []);

  return (
    <div className="app-root" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div className={`app-container ${!isLoading ? 'app-entry' : ''} ${isInterlinking ? 'interlink-active' : ''}`} style={{ height: '100%' }}>
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

        <TacticalCursor />

        {/* Header Section */}
        <header className="glass-panel" style={{ padding: '0.8rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
          <div className="logo-group">
            <h1 className="glitch" data-text="NEURAL_NEXUS" style={{ fontSize: '1.8rem', letterSpacing: '4px' }}>NEURAL_NEXUS</h1>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <span className="status-badge" style={{ fontSize: '0.55rem', padding: '2px 8px' }}>
                CORE_STABLE
              </span>
              <span className="status-badge" style={{ fontSize: '0.55rem', padding: '2px 8px', color: 'var(--neon-purple)', borderColor: 'rgba(157, 0, 255, 0.3)' }}>
                ENCRYPT_AES_256
              </span>
            </div>
          </div>

          <div className="nav-group" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', color: 'var(--neon-blue)', fontFamily: 'Orbitron', fontWeight: 'bold', letterSpacing: '1px' }}>{systemTime}</div>
              <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>NEURAL_LINK_77_A</div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="main-layout" style={{ height: 'calc(100% - 140px)' }}>
          {/* Left Column: Diagnostics */}
          <aside className="side-column left-sidebar">
            <div className="glass-panel" style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 style={{ fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>SYSTEM_DIAGNOSTICS</h4>
              <SystemMonitor />
              <div className="glass-panel" style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', fontSize: '0.7rem' }}>
                <div style={{ color: 'var(--neon-blue)', marginBottom: '10px' }}>ACTIVE_PROCESSES:</div>
                <div style={{ overflowY: 'auto', height: '150px', fontFamily: 'Share Tech Mono' }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ marginBottom: '5px', opacity: 0.7 }}>
                      {`> PID_${Math.floor(Math.random() * 9000 + 1000)} ... RUNNING`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Center Column: AI Heart and Chat */}
          <div className="center-column">
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'radial-gradient(circle at center, rgba(0, 243, 255, 0.1), transparent)' }}>
              <AIHeart />
            </div>
            <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <NexusChat />
            </div>
          </div>

          {/* Right Column: Terminal and Logs */}
          <aside className="side-column right-sidebar">
             <div className="glass-panel" style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h4 style={{ fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>COMMAND_INTERFACE</h4>
               <HoloTerminal />
               <div className="glass-panel" style={{ padding: '0.8rem', fontSize: '0.65rem', background: 'rgba(255, 0, 85, 0.05)', borderColor: 'var(--neon-pink)' }}>
                 <div style={{ color: 'var(--neon-pink)', fontWeight: 'bold', marginBottom: '5px' }}>THREAT_ALERT: NONE</div>
                 <div style={{ opacity: 0.7 }}>Encrypted data flow monitoring active. No suspicious packets detected in the last 24ms.</div>
               </div>
             </div>
          </aside>
        </main>

        {/* Footer HUD */}
        <footer style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6rem', color: 'var(--text-dim)', padding: '0 1rem' }}>
          <div>ARCH_ROBOTICS // UNIT_NEXUS_01 // SECURE_SHELL_ACTIVE</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>LATENCY: 14ms</span>
            <span>PACKETS: 100% SUCCESS</span>
            <span>AUTH: SHA-512</span>
          </div>
        </footer>

        <BiometricOverlay 
          isOpen={isSecurityOpen} 
          onClose={() => setIsSecurityOpen(false)}
          onAuthenticated={() => {
            console.log("Authenticated");
          }}
        />
      </div>

      {/* Loading Overlay - Fixed over the app */}
      {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
    </div>
  );
}

export default App;
