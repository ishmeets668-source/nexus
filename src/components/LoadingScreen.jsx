import React, { useState, useEffect, useRef, useMemo } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [bootSequence, setBootSequence] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState('WAITING_FOR_CAMERA');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentModule, setCurrentModule] = useState('KERNEL_INIT');
  const [faceMatch, setFaceMatch] = useState(0);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const logs = useMemo(() => [
    "[ OK ] INITIALIZING_NEURAL_BUS_v8.4",
    "[ OK ] LOADING_SYNAPTIC_DRIVERS...",
    "[ OK ] MAPPING_NEURAL_PATHWAYS_LEVEL_1",
    "[ OK ] MAPPING_NEURAL_PATHWAYS_LEVEL_2",
    "[ WAIT ] CALIBRATING_OPTICAL_SENSORS...",
    "[ OK ] OPTICAL_SENSORS_STABLE",
    "[ OK ] SYNCING_QUANTUM_CORE_RESONANCE",
    "[ WAIT ] REQUESTING_FACIAL_AUTH_UPLINK...",
    "[ OK ] CAMERA_LINK_ESTABLISHED",
    "[ SCAN ] ANALYZING_FACIAL_STRUCTURE...",
    "[ SCAN ] VERIFYING_RETINAL_PATTERN...",
    "[ OK ] FACIAL_MATCH_99.8%_FOUND",
    "[ OK ] NEURAL_NEXUS_OS_v5.0.0_LOADED",
    "[ AUTH ] AUTHENTICATING_OPERATOR_CREDENTIALS...",
    "[ OK ] SYSTEM_STABLE_READY_FOR_ENTRY"
  ], []);

  // Handle Webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setBiometricStatus('SCANNING');
        }
      } catch (err) {
        console.error("Webcam access denied", err);
        setBiometricStatus('BYPASS_ACTIVE'); // Fallback if no camera
      }
    };
    
    // Start camera after a small delay
    const timer = setTimeout(startCamera, 2000);
    return () => {
        clearTimeout(timer);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logs.length) {
        // Only progress logs if camera is ready or bypassed
        if (logs[currentLog].includes("CAMERA_LINK") && biometricStatus === 'WAITING_FOR_CAMERA') return;
        
        setBootSequence(prev => [...prev, logs[currentLog]]);
        
        if (logs[currentLog].includes("FACIAL_MATCH")) {
            setBiometricStatus('MATCH_FOUND');
            setTimeout(() => setBiometricStatus('AUTHORIZED'), 1000);
        }
        currentLog++;
      } else {
        clearInterval(logInterval);
      }
    }, 350);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Pause progress during facial scanning
        if (prev > 45 && prev < 70 && biometricStatus === 'SCANNING') {
            setFaceMatch(f => Math.min(100, f + Math.random() * 5));
            return prev + 0.1; 
        }

        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onFinished, 1800);
          }, 1200);
          return 100;
        }
        const step = Math.random() > 0.9 ? 12 : 1.5;
        const next = Math.min(100, prev + step * Math.random());
        
        if (next < 25) setCurrentModule('KERNEL_INIT');
        else if (next < 50) setCurrentModule('NEURAL_MAPPING');
        else if (next < 75) setCurrentModule('FACIAL_SCAN');
        else setCurrentModule('SYSTEM_AUTH');
        
        return next;
      });
    }, 100);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onFinished, logs, biometricStatus]);

  return (
    <div className={`loading-overlay ${isExiting ? 'exit' : ''}`}>
      <div className="noise-overlay"></div>
      <div className="vignette-overlay"></div>
      <div className="parallax-grid" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px) perspective(1000px) rotateX(${mousePos.y * 0.1}deg) rotateY(${mousePos.x * -0.1}deg)` }}></div>
      <div className="parallax-hex" style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}></div>

      <div className="hud-container">
        <header className="hud-top-bar">
          <div className="corner-tag">NEXUS_OS // FACIAL_AUTH_MODE</div>
          <div className="header-status-group">
            <div className="status-indicator">
              <span className="label">SIGNAL</span>
              <div className="signal-bars">
                {[1, 2, 3, 4, 5].map(b => (
                  <div key={b} className={`sig-bar ${progress > b * 15 ? 'active' : ''}`}></div>
                ))}
              </div>
            </div>
            <div className="status-indicator">
              <span className="label">FACIAL_SYNC</span>
              <span className="value">{faceMatch.toFixed(1)}%</span>
            </div>
          </div>
          <div className="time-group">
            <span className="current-time">{new Date().toLocaleTimeString([], { hour12: false })}</span>
            <span className="date-stamp">SECURE_SHELL_v5</span>
          </div>
        </header>

        <main className="hud-main-grid">
          <aside className="hud-side left">
            <div className="hud-panel panel-diagonal">
              <div className="panel-header">NEURAL_FLUX</div>
              <div className="flux-bars">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flux-bar-group">
                    <div className="flux-bar-fill" style={{ 
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`,
                      backgroundColor: progress > (i * 8) ? 'var(--neon-blue)' : 'rgba(255,255,255,0.05)'
                    }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hud-panel circular-panel">
               <svg viewBox="0 0 100 100" className="gauge-svg">
                  <circle className="gauge-bg" cx="50" cy="50" r="45" />
                  <circle className="gauge-progress" cx="50" cy="50" r="45" style={{ strokeDashoffset: 283 - (283 * progress / 100) }} />
                  <text x="50" y="55" className="gauge-text">{Math.round(progress)}%</text>
               </svg>
               <div className="gauge-label">UPLINK_STABILITY</div>
            </div>
          </aside>

          <section className="hud-center">
            <div className="face-unlock-container">
              <div className="camera-frame">
                <video ref={videoRef} autoPlay playsInline muted className="webcam-feed" />
                <div className="camera-overlay">
                  {/* Face Mesh Overlay (Simulated) */}
                  <svg className="face-mesh" viewBox="0 0 200 200">
                    <path d="M100 40 Q140 40 160 80 Q170 120 100 160 Q30 120 40 80 Q60 40 100 40" fill="none" stroke="var(--neon-blue)" strokeWidth="0.5" opacity="0.4" />
                    <circle cx="70" cy="80" r="5" fill="none" stroke="var(--neon-blue)" strokeWidth="0.5" />
                    <circle cx="130" cy="80" r="5" fill="none" stroke="var(--neon-blue)" strokeWidth="0.5" />
                    <path d="M80 130 Q100 140 120 130" fill="none" stroke="var(--neon-blue)" strokeWidth="0.5" />
                    {/* Scanning Points */}
                    {[...Array(12)].map((_, i) => (
                      <circle 
                        key={i} 
                        cx={100 + Math.cos(i) * 60} 
                        cy={100 + Math.sin(i) * 60} 
                        r="1" 
                        fill="var(--neon-blue)"
                      >
                        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" delay={`${i * 0.2}s`} />
                      </circle>
                    ))}
                  </svg>
                  <div className="scan-laser"></div>
                  <div className="target-corners">
                    <div className="corner t-l"></div>
                    <div className="corner t-r"></div>
                    <div className="corner b-l"></div>
                    <div className="corner b-r"></div>
                  </div>
                </div>
              </div>

              <div className="title-block">
                <h1 className="main-title">NEXUS<span className="alt-title">OS</span></h1>
              </div>

              <div className={`biometric-readout ${biometricStatus.toLowerCase()}`}>
                <div className="readout-text">
                  {biometricStatus === 'WAITING_FOR_CAMERA' && 'INITIALIZING_OPTICAL_LINK...'}
                  {biometricStatus === 'SCANNING' && `ANALYZING_FACIAL_GEOMETRY: ${faceMatch.toFixed(1)}%`}
                  {biometricStatus === 'MATCH_FOUND' && 'FACIAL_MATCH_CONFIRMED // OPERATOR_01'}
                  {biometricStatus === 'AUTHORIZED' && 'NEURAL_ACCESS_GRANTED'}
                  {biometricStatus === 'BYPASS_ACTIVE' && 'CAMERA_OFFLINE // BYPASSING_TO_MANUAL_AUTH'}
                </div>
              </div>
            </div>
          </section>

          <aside className="hud-side right">
             <div className="hud-panel panel-diagonal">
                <div className="panel-header">BOOT_SEQUENCE</div>
                <div className="boot-logs-v2">
                  {bootSequence.slice(-10).map((log, i) => (
                    <div key={i} className="log-row" style={{ opacity: (i + 1) / 10 }}>
                      <span className="log-prefix">»</span>
                      <span className="log-content">{log}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="hud-panel panel-compact">
                <div className="panel-header">AUTHENTICATION_METRICS</div>
                <div className="metric-bars">
                  {['BIOMETRIC', 'NEURAL', 'SECURITY'].map(m => (
                    <div key={m} className="metric-row">
                      <span className="m-name">{m}</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${progress}%` }}></div></div>
                    </div>
                  ))}
                </div>
             </div>
          </aside>
        </main>

        <footer className="hud-bottom-bar">
          <div className="footer-left">
            <div className="stat-box">
              <span className="stat-label">MODE</span>
              <span className="stat-value">FACIAL_RECOGNITION</span>
            </div>
          </div>
          
          <div className="footer-center">
            <div className="global-progress-container">
              <div className="progress-track">
                <div className="progress-fill-v3" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-markers">
                <span>0%</span>
                <span>SYSTEM_INITIALIZING</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="footer-right">
             <div className="integrity-check">
                <span className="label">SECURITY_STATUS</span>
                <div className="integrity-value" style={{ color: biometricStatus === 'AUTHORIZED' ? '#00ff88' : 'var(--neon-blue)' }}>
                  {biometricStatus === 'AUTHORIZED' ? 'SECURE' : 'AUTHENTICATING'}
                </div>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoadingScreen;
