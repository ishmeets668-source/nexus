import React, { useState, useEffect } from 'react';

const HoloTerminal = () => {
  const [lines, setLines] = useState(['Initializing System...', 'Connecting to Neural Bridge...', 'Scanning Core Components...']);
  const [input, setInput] = useState('');

  const commands = {
    help: 'Available: HELP, STATUS, CLEAR, REBOOT',
    status: 'SYSTEM: ACTIVE | BATTERY: 98% | LATENCY: 2ms',
    clear: '',
    reboot: 'System Rebooting...'
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toLowerCase().trim();
      let response = commands[cmd] || `Unknown Command: ${cmd}`;
      
      if (cmd === 'clear') {
        setLines([]);
      } else {
        setLines(prev => [...prev, `> ${input}`, response]);
      }
      setInput('');
    }
  };

  useEffect(() => {
    const handleInterlink = () => {
      setLines(prev => [
        ...prev, 
        '>> GLOBAL_INTERLINK_REQUEST_DETECTED',
        '>> SYNCING_NEURAL_CORE...',
        '>> ACCESSING_SENSOR_ARRAYS...',
        '>> OPTIMIZING_PULSE_WIDTH...',
        '>> INTERLINK_ESTABLISHED_SUCCESSFULLY'
      ]);
    };

    window.addEventListener('system-interlink', handleInterlink);
    return () => window.removeEventListener('system-interlink', handleInterlink);
  }, []);

  useEffect(() => {
    const handleLaunch = (e) => {
      setLines(prev => [
        ...prev, 
        `>> REQUEST_EXTERNAL_EXE: ${e.detail}`,
        `>> BYPASSING_SECURITY_PROTOCOLS...`,
        `>> RESOURCE_ALLOCATED`,
        `>> EXECUTION_SUCCESSFUL: ${e.detail}.EXE`
      ]);
    };

    window.addEventListener('app-launch', handleLaunch);
    return () => window.removeEventListener('app-launch', handleLaunch);
  }, []);

  return (
    <div className="glass-card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.startsWith('>') ? 'var(--neon-blue)' : '#fff', marginBottom: '4px' }}>
            {line}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
        <span style={{ color: 'var(--neon-blue)', marginRight: '10px' }}>$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#fff', 
            outline: 'none', 
            width: '100%',
            fontFamily: 'inherit'
          }}
          placeholder="Enter Command..."
        />
      </div>
    </div>
  );
};

export default HoloTerminal;
