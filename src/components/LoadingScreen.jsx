import React, { useState, useEffect, useRef, useMemo } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [bootSequence, setBootSequence] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState('SCANNING');
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const logs = useMemo(() => [
    "KERNEL_BOOT_INITIATED",
    "LOADING_SYNAPTIC_DRIVERS...",
    "MAPPING_NEURAL_PATHWAYS...",
    "CALIBRATING_OPTICAL_SENSORS...",
    "SYNCING_QUANTUM_CORE...",
    "DECRYPTING_BIO_METRICS...",
    "ESTABLISHING_SECURE_UPLINK...",
    "CHECKING_HARDWARE_INTEGRITY...",
    "NEURAL_NEXUS_OS_v4.2.0_LOADED",
    "AUTHENTICATING_USER_ID...",
    "SYSTEM_STABLE_READY_FOR_ENTRY"
  ], []);

  const dataStreams = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 12}s`,
      content: Array.from({ length: 30 }).map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('')
    })), []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoordinates({
        x: Math.floor((e.clientX / window.innerWidth) * 1000),
        y: Math.floor((e.clientY / window.innerHeight) * 1000)
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "01ABCDEF";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 243, 255, 0.08)';
      ctx.font = `${fontSize}px Share Tech Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logs.length) {
        setBootSequence(prev => [...prev, logs[currentLog]]);
        if (logs[currentLog].includes("AUTHENTICATING")) {
            setTimeout(() => setBiometricStatus('AUTHORIZED'), 800);
        }
        currentLog++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onFinished, 1500);
          }, 1000);
          return 100;
        }
        const step = Math.random() > 0.95 ? 15 : 2;
        return Math.min(100, prev + step * Math.random());
      });
    }, 120);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onFinished, logs]);

  return (
    <div className={`loading-overlay ${isExiting ? 'exit' : ''}`}>
      <div className="noise-overlay"></div>
      <div className="hex-grid-bg"></div>
      <canvas ref={canvasRef} className="matrix-bg" />
      <div className="robotic-grid"></div>
      <div className="loading-vignette"></div>
      
      <div className="tech-numbers">
          {[...Array(10)].map((_, i) => (
              <div key={i} className="tech-number">
                  {Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}
              </div>
          ))}
      </div>

      <div className="radar-container">
          <div className="radar-sweep"></div>
          <div className="radar-blip" style={{ top: '30%', left: '40%' }}></div>
          <div className="radar-blip" style={{ top: '60%', left: '70%', animationDelay: '0.5s' }}></div>
          <div className="radar-blip" style={{ top: '20%', left: '80%', animationDelay: '1.2s' }}></div>
      </div>

      {dataStreams.map(stream => (
        <div 
          key={stream.id} 
          className="data-stream" 
          style={{ left: stream.left, animationDelay: stream.delay, animationDuration: stream.duration }}
        >
          {stream.content}
        </div>
      ))}

      <div className="loading-content-wrapper">
        <div className="hud-header">
            <div className="hud-line"></div>
            <div className="hud-text-group">
                <span className="hud-label">COORDS:</span>
                <span className="hud-value">X:{coordinates.x} Y:{coordinates.y}</span>
            </div>
            <div className="hud-text-group">
                <span className="hud-label">CORE_TEMP:</span>
                <span className="hud-value">{32 + Math.floor(progress / 5)}°C</span>
            </div>
            <div className="hud-text-group">
                <span className="hud-label">PROJECT:</span>
                <span className="hud-value">NEURAL_NEXUS</span>
            </div>
            <div className="hud-line"></div>
        </div>

        <div className="main-display">
            <div className="side-hud left">
                <div className="hud-box">
                    <div className="box-title">NEURAL_LOAD</div>
                    <div className="bars">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="bar" style={{ 
                                height: `${Math.random() * 80 + 20}px`, 
                                animationDelay: `${i * 0.03}s`,
                                background: progress > (i * 6) ? 'var(--neon-blue)' : 'rgba(0, 243, 255, 0.05)'
                            }}></div>
                        ))}
                    </div>
                </div>
                <div className="hud-box">
                    <div className="box-title">BOOT_STAGES</div>
                    <div className="boot-stage-indicator">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={`stage-dot ${progress >= s * 25 ? 'active' : ''}`}></div>
                        ))}
                    </div>
                    <div style={{ fontSize: '0.7rem', marginTop: '15px', color: 'var(--neon-blue)', letterSpacing: '2px' }}>
                        PHASE_{Math.floor(progress/25) + 1}_INITIALIZING
                    </div>
                </div>
            </div>

            <div className="center-visual">
                <div className="scanner-container">
                    <div className="core-ring ring-outer" style={{ borderStyle: 'dotted', borderWidth: '4px' }}></div>
                    <div className="nexus-core-v2" style={{ transform: `scale(${1 + progress/200})` }}>
                        <div className="orbit-1"></div>
                        <div className="orbit-2"></div>
                        <div className="core-glow"></div>
                        <div className="biometric-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.3">
                                <circle cx="12" cy="12" r="11" />
                                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                                <circle cx="12" cy="12" r="5" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h1 className="nexus-title-v2">
                    <span className="glitch-text" data-text="NEXUS">NEXUS</span> NEURAL<span className="glitch-text" data-text="NEXUS">NEXUS</span>
                </h1>
                <div className={`bio-status ${biometricStatus.toLowerCase()}`}>
                    {biometricStatus === 'SCANNING' ? 'SCANNING_NEURAL_SIGNATURE...' : 'NEURAL_NEXUS_ACCESS_GRANTED'}
                </div>
            </div>

            <div className="side-hud right">
                <div className="hud-box">
                    <div className="box-title">NEURAL_NEXUS_LOGS</div>
                    <div className="compact-logs" style={{ maxHeight: '200px', overflow: 'hidden' }}>
                        {bootSequence.slice(-8).map((log, i) => (
                            <div key={i} className="compact-log" style={{ opacity: (i + 1) / 8, fontSize: '0.7rem' }}>
                                <span className="arrow" style={{ color: 'var(--neon-purple)' }}>»</span> {log}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hud-box">
                    <div className="box-title">MESH_NETWORK</div>
                    <div className="node-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className={`node ${progress > (i+1)*6 ? 'active' : ''}`} style={{ width: '15px', height: '15px' }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="footer-hud">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="hud-label">UPLINK_STRENGTH</span>
                    <span className="hud-value" style={{ fontSize: '1.2rem' }}>{Math.min(100, Math.floor(progress * 1.2))}%</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="hud-label">TOTAL_LOAD</span>
                    <span className="hud-value" style={{ fontSize: '1.2rem' }}>{Math.round(progress)}%</span>
                </div>
            </div>
            <div className="progress-bar-v2" style={{ height: '10px' }}>
                <div className="progress-fill" style={{ width: `${progress}%` }}>
                    <div className="progress-flare"></div>
                </div>
            </div>
            <div className="progress-footer-text" style={{ marginTop: '10px' }}>
                <span>INTEGRITY: 100%</span>
                <span>OS_KERNEL: NEXUS_CORE_v4</span>
                <span>THREAT_LEVEL: ZERO</span>
                <span>ENCRYPTION: AES-256-QUANTUM</span>
            </div>
        </div>
      </div>

      <div className="corner-bracket tl" style={{ width: '100px', height: '100px' }}></div>
      <div className="corner-bracket tr" style={{ width: '100px', height: '100px' }}></div>
      <div className="corner-bracket bl" style={{ width: '100px', height: '100px' }}></div>
      <div className="corner-bracket br" style={{ width: '100px', height: '100px' }}></div>
    </div>
  );
};

export default LoadingScreen;


