import React from 'react';
import { MessageSquare, Instagram, Camera, Map, Settings, BatteryCharging } from 'lucide-react';

const SystemSidebar = () => {
  const mobileApps = [
    { icon: <MessageSquare size={20} />, name: 'WhatsApp', color: 'var(--neon-blue)' },
    { icon: <Instagram size={20} />, name: 'Instagram', color: 'var(--neon-purple)' },
    { icon: <Camera size={20} />, name: 'Camera', color: 'var(--neon-blue)' },
    { icon: <Map size={20} />, name: 'Maps', color: 'var(--neon-purple)' },
    { icon: <Settings size={20} />, name: 'Settings', color: 'var(--neon-blue)' },
    { icon: <BatteryCharging size={20} />, name: 'Battery', color: 'var(--neon-blue)' }
  ];

  return (
    <div className="system-sidebar">
      {mobileApps.map((app, i) => (
        <div 
          key={i} 
          className="glass-card" 
          title={app.name}
          style={{ 
            padding: '12px', 
            cursor: 'pointer', 
            borderColor: app.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = `0 0 15px ${app.color}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ color: app.color }}>{app.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default SystemSidebar;
