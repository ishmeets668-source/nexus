import React from 'react';
import HoloTerminal from './components/HoloTerminal';
import AIHeart from './components/AIHeart';
import SystemSidebar from './components/SystemSidebar';
import NexusChat from './components/NexusChat';
import RobotCursor from './components/RobotCursor';
import BiometricOverlay from './components/BiometricOverlay';

function App() {
  const [isInterlinking, setIsInterlinking] = React.useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = React.useState(false);

  React.useEffect(() => {
    const handleInterlink = () => {
      setIsInterlinking(true);
      setTimeout(() => setIsInterlinking(false), 500);
    };
    window.addEventListener('system-interlink', handleInterlink);
    return () => window.removeEventListener('system-interlink', handleInterlink);
  }, []);

  return (
    <div className={`app-container ${isInterlinking ? 'interlink-active' : ''}`}>
      <RobotCursor />
      <div className="scanline"></div>
      <div className="grid-bg"></div>
      <SystemSidebar />

      <nav className="main-nav">
        <h1 className="glitch logo">CYBER_OS v2.0</h1>
        <div className="nav-links">
          <button className="glow-btn">Modules</button>
          <button className="glow-btn">Uplink</button>
          <button 
            className="glow-btn secondary"
            onClick={() => setIsSecurityOpen(true)}
          >
            Security
          </button>
        </div>
      </nav>

      <main className="main-content">
        <section className="chat-section">
          <header className="section-header">
            <h2 className="title-large">NEURAL_<span className="cyan">NEXUS</span></h2>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">CORE_INTELLIGENCE_ONLINE</span>
            </div>
          </header>
          
          <NexusChat />
        </section>

        <section className="dashboard-section">
          <div className="glass-card viz-card">
            <h3 className="section-title">NEURAL_VISUALIZATION</h3>
            <AIHeart />
          </div>
          <HoloTerminal />
        </section>
      </main>

      <footer className="main-footer">
        &copy; 2026 ARCH_ROBOTICS_COLLECTIVE // ALL RIGHTS RESERVED
      </footer>

      {/* Decorative HUD Elements */}
      <div className="hud-element bottom-right">
        SECURE_CONNECTION_ESTABLISHED // NODE_77
      </div>
      <div className="hud-element bottom-left">
        SCANNING_AREA_B4 // NO_THREATS_DETECTED
      </div>
      <div className="bg-deco">
        A113
      </div>

      <BiometricOverlay 
        isOpen={isSecurityOpen} 
        onClose={() => setIsSecurityOpen(false)}
        onAuthenticated={() => {
          console.log("Authenticated");
          // Add any follow-up logic here (e.g., unlocking a dashboard section)
        }}
      />
    </div>
  );
}

export default App;
