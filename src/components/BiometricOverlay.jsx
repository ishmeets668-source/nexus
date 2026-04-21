import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import './BiometricOverlay.css';

const Typewriter = ({ text, delay = 0, speed = 0.05 }) => {
  return (
    <div className="typewriter-text" style={{ display: 'inline' }}>
      {text.split("").map((char, index) => (
        <motion.span
          key={text + index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: delay + (index * speed),
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="terminal-cursor"
        style={{
          display: 'inline-block',
          width: '8px',
          height: '14px',
          background: 'var(--neon-blue)',
          marginLeft: '4px',
          verticalAlign: 'middle'
        }}
      />
    </div>
  );
};

const BiometricOverlay = ({ isOpen, onClose, onAuthenticated }) => {
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success, error
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setScanStatus('idle');
      setProgress(0);
    }
  }, [isOpen]);

  const startScan = () => {
    if (scanStatus === 'scanning' || scanStatus === 'success') return;
    
    setScanStatus('scanning');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus('success');
          setTimeout(() => {
            onAuthenticated();
            onClose();
          }, 1500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="biometric-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="biometric-modal"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
          >
            <div className="modal-header">
              <Lock size={16} className="cyan" />
              <Typewriter text="SECURITY_PROTOCOL_v4.2" delay={0.2} />
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="scan-container">
              <div className={`fingerprint-wrapper ${scanStatus}`}>
                <Fingerprint size={80} className="fingerprint-icon" />
                <motion.div 
                  className="scan-line"
                  animate={scanStatus === 'scanning' ? { top: ['0%', '100%', '0%'] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {scanStatus === 'success' && (
                  <motion.div 
                    className="success-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ShieldCheck size={40} />
                  </motion.div>
                )}
              </div>

              <div className="scan-info">
                <h3>
                  {scanStatus === 'scanning' && <Typewriter text="ANALYZING_BIOMETRICS..." />}
                  {scanStatus === 'success' && <Typewriter text="ACCESS_GRANTED" />}
                  {scanStatus === 'idle' && <Typewriter text="WAITING_FOR_INPUT" />}
                </h3>
                <p>PLACE_IDENTITY_MARKER_ON_SENSOR</p>
              </div>

              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
                <div className="progress-text">{progress}%</div>
              </div>

              <button 
                className={`glow-btn ${scanStatus === 'scanning' ? 'disabled' : ''}`}
                onClick={startScan}
                disabled={scanStatus === 'scanning'}
              >
                {scanStatus === 'success' ? 'AUTHORIZED' : 'INITIALIZE_SCAN'}
              </button>
            </div>

            <div className="modal-footer">
              <div className="status-item">
                <span className="label">ENCRYPTION:</span>
                <span className="value">AES-256-BIT</span>
              </div>
              <div className="status-item">
                <span className="label">LOCATION:</span>
                <span className="value">NODE_SEC_7</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BiometricOverlay;
