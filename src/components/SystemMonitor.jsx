import React, { useState, useEffect, useRef, memo } from 'react';
import './SystemMonitor.css';

const SystemMonitor = () => {
  const [stats, setStats] = useState({
    ram: 4.2,
    net: 124,
    temp: 42,
    cpu: 65,
    disk: 28,
    uptime: '04:12:08'
  });
  const [history, setHistory] = useState(new Array(20).fill(0));
  const [events, setEvents] = useState([
    { time: '11:54:10', msg: 'NEURAL_LINK_ESTABLISHED' },
    { time: '11:55:02', msg: 'CORE_SYNC_COMPLETE' },
    { time: '11:56:15', msg: 'MEM_BUFFER_CLEARED' }
  ]);
  
  const logRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRam = (4.0 + Math.random() * 0.8).toFixed(1);
      const newCpu = Math.floor(40 + Math.random() * 40);
      const newTemp = Math.floor(38 + Math.random() * 12);
      
      setStats(prev => ({
        ...prev,
        ram: newRam,
        net: Math.floor(80 + Math.random() * 120),
        temp: newTemp,
        cpu: newCpu,
      }));
      
      setHistory(prev => [...prev.slice(1), Math.random() * 40]);

      // Occasional random events
      if (Math.random() > 0.85) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const possibleMsgs = [
          'SEC_PROTOCOL_ACTIVE',
          'DAEMON_NODE_RESTART',
          'PACKET_FILTER_SCAN',
          'GHOST_SHELL_DETECTED',
          'BUFFER_OVERFLOW_PREVENTED'
        ];
        const newMsg = possibleMsgs[Math.floor(Math.random() * possibleMsgs.length)];
        setEvents(prev => [...prev.slice(-10), { time: timeStr, msg: newMsg }]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="glass-card sys-monitor-v2">
      <div className="card-corner corner-tl"></div>
      <div className="card-corner corner-tr"></div>
      <div className="card-corner corner-bl"></div>
      <div className="card-corner corner-br"></div>
      
      <div className="monitor-header">
        <div className="header-icon">
            <div className="pulse-dot"></div>
        </div>
        <div className="header-text-group">
          <h4 className="monitor-title">SYSTEM_DIAGNOSTIC_v4.2</h4>
          <span className="monitor-subtitle">ARCH_NEXUS // CORE_NODE_01</span>
        </div>
        <div className="header-line"></div>
      </div>
      
      <div className="monitor-grid">
        <div className="stats-column">
          <StatItem label="MEM_ALLOCATION" value={`${stats.ram}GB`} sub="DDR5_NEXUS" color="var(--neon-blue)" />
          <StatItem label="LINK_LATENCY" value={`${stats.net}MS`} sub="UPLINK_STABLE" color="var(--neon-purple)" />
          
          <div className="core-breakdown">
            <div className="breakdown-header">NEURAL_CORES_LOAD</div>
            <div className="core-bars">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="core-bar">
                  <div 
                    className="core-fill" 
                    style={{ 
                      height: `${Math.max(10, (stats.cpu * (0.8 + Math.random() * 0.4))).toFixed(0)}%`,
                      backgroundColor: i % 3 === 0 ? 'var(--neon-purple)' : 'var(--neon-blue)'
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="core-ring-container">
            <ProgressRing percentage={stats.cpu} label="CPU_LOAD" color="var(--neon-blue)" />
            <ProgressRing percentage={stats.disk} label="IO_STABLE" color="var(--neon-purple)" />
          </div>
        </div>

        <div className="graph-column">
            <div className="graph-header">
              <span>REAL_TIME_FLUX</span>
              <span className="flux-fps">60 FPS</span>
            </div>
            <div className="graph-container">
                <div className="scanline-overlay"></div>
                <svg viewBox="0 0 200 60" className="flux-graph">
                    <defs>
                        <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--neon-blue)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polyline
                        fill="none"
                        stroke="var(--neon-blue)"
                        strokeWidth="1.5"
                        points={history.map((val, i) => `${(i * 10.5)},${50 - val}`).join(' ')}
                    />
                    <path
                        fill="url(#graphGradient)"
                        d={`M 0 60 ${history.map((val, i) => `L ${(i * 10.5)} ${50 - val}`).join(' ')} L 200 60 Z`}
                    />
                </svg>
            </div>
            
            <div className="event-log-container">
              <div className="log-header">DIAGNOSTIC_LOG_STREAM</div>
              <div className="event-log" ref={logRef}>
                  {events.map((ev, i) => (
                      <div key={i} className="log-entry">
                          <span className="log-time">[{ev.time}]</span>
                          <span className="log-msg">{ev.msg}</span>
                      </div>
                  ))}
              </div>
            </div>

            <div className="graph-footer">
                <span>0ms</span>
                <span className="sync-status">NODE_SYNC_OK</span>
                <span>1.5s</span>
            </div>
        </div>
      </div>

      <div className="threat-status enhanced">
        <div className="status-header">
            <span className="status-label">NEURAL_SYNC_FIDELITY</span>
            <span className="status-percent">99.8%</span>
        </div>
        <div className="fidelity-bars">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`fidelity-bar ${i < 18 ? 'active' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatItem = memo(({ label, value, sub, color }) => (
  <div className="stat-item" style={{ borderLeftColor: color }}>
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color }}>{value}</div>
    <div className="stat-sub">{sub}</div>
  </div>
));

const ProgressRing = memo(({ percentage, label, color }) => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="ring-item">
            <svg className="ring-svg">
                <circle className="ring-bg" cx="30" cy="30" r={radius} />
                <circle 
                    className="ring-progress" 
                    cx="30" cy="30" r={radius} 
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    stroke={color}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <text 
                    x="50%" y="50%" 
                    textAnchor="middle" 
                    dy=".3em" 
                    fill="white" 
                    fontSize="10" 
                    transform="rotate(90 30 30)"
                >
                    {percentage}%
                </text>
            </svg>
            <span className="ring-label">{label}</span>
        </div>
    );
});

export default SystemMonitor;

