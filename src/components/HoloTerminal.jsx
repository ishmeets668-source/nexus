import React, { useState, useEffect, useRef } from 'react';
import './HoloTerminal.css';

const HoloTerminal = () => {
  const [lines, setLines] = useState([
    { type: 'sys', content: '>> NEURAL_NEXUS KERNEL 4.0.1_X64' },
    { type: 'sys', content: '>> ENCRYPTION_LAYER: ACTIVE' },
    { type: 'res', content: '>> SYSTEM READY. STANDING BY.' }
  ]);
  const [input, setInput] = useState('');
  const [metrics, setMetrics] = useState({ pps: 0, decrypt: 0 });
  const scrollRef = useRef(null);

  const commands = {
    help: 'CORE: STATUS, CLEAR, REBOOT, SYNC, NETWORK, LOGS',
    status: 'OS: NEURAL_NEXUS | CPU: 1.8% | RAM: 2.1GB | TMP: 31C',
    clear: '',
    reboot: 'REBOOT_SEQUENCE_INITIATED...',
    sync: 'NODE_SYNCHRONIZATION_COMPLETE',
    network: 'LATENCY: 4ms | PACKETS: 144/sec | UPLINK: STABLE',
    logs: 'FETCHING_NEURAL_LOGS... [OK]'
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setMetrics({
            pps: Math.floor(Math.random() * 50) + 120,
            decrypt: Math.floor(Math.random() * 1000) + 4000
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toLowerCase().trim();
      let response = commands[cmd];
      let type = 'res';
      
      if (!response) {
        response = `CRITICAL_ERROR: UNKNOWN_COMMAND [${cmd}]`;
        type = 'err';
      }
      
      if (cmd === 'clear') {
        setLines([]);
      } else {
        setLines(prev => [...prev, 
          { type: 'cmd', content: input }, 
          { type, content: `>> ${response}` }
        ]);
      }
      setInput('');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const handleInterlink = () => {
      setLines(prev => [
        ...prev, 
        { type: 'err', content: '>> ALERT: EXTERNAL_INTERLINK_REQUEST' },
        { type: 'sys', content: '>> CALIBRATING_PULSE_WIDTH...' },
        { type: 'res', content: '>> SYNC_ESTABLISHED' }
      ]);
    };
    window.addEventListener('system-interlink', handleInterlink);
    return () => window.removeEventListener('system-interlink', handleInterlink);
  }, []);

  useEffect(() => {
    const handleLaunch = (e) => {
      const appName = e.detail.toUpperCase();
      setLines(prev => [
        ...prev, 
        { type: 'sys', content: `>> EXECUTE: ${appName}.EXE` },
        { type: 'res', content: `>> THREAD_ALLOCATION: SUCCESS` }
      ]);
      fetch(`/nexus/api/launcher?app=${appName.toLowerCase()}`).catch(() => {});
    };
    window.addEventListener('app-launch', handleLaunch);
    return () => window.removeEventListener('app-launch', handleLaunch);
  }, []);

  return (
    <div className="holo-terminal-v3">
      <div className="terminal-scanline"></div>
      
      <div className="terminal-stats">
          <span>TX: {metrics.pps} p/s</span>
          <span>DECRYPT_HASH: {metrics.decrypt}</span>
          <span>PORT: 8080</span>
      </div>

      <div ref={scrollRef} className="terminal-scroll-area no-scrollbar">
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line line-${line.type}`}>
            {line.type === 'cmd' ? `λ ${line.content}` : line.content}
          </div>
        ))}
      </div>

      <div className="terminal-input-wrapper">
        <span className="terminal-prompt">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="terminal-input"
          placeholder="ENTER_CMD"
          autoFocus
        />
      </div>
    </div>
  );
};

export default HoloTerminal;
