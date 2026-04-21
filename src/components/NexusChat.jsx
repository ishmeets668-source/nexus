import React, { useState, useEffect, useRef } from 'react';


const NexusChat = () => {
  const [messages, setMessages] = useState([
    { role: 'nexus', text: 'NEXUS_UNLINK_ESTABLISHED. Greeting, Operator. Use "Hey Nexus" to wake me or START_JARVIS for continuous uplink.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const scrollRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(null);

  useEffect(() => {
    if (SpeechRecognition && !recognition.current) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
        if (isAutoMode) {
          recognition.current.start();
          setIsListening(true);
        }
      };
    }
  }, [isAutoMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text = input) => {
    const finalInput = text || input;
    if (!finalInput.trim()) return;

    const userMsg = { role: 'user', text: finalInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let nexusMsgText = '';
      
      const lowerInput = finalInput.toLowerCase();
      
      if (lowerInput.includes('hey nexus')) {
        nexusMsgText = "SYSTEM_AWAKENED. Presence confirmed. I am online and awaiting your directives, Operator.";
      } else if (lowerInput.includes('interlink')) {
        nexusMsgText = "INTERLINK_SEQUENCE_INITIATED. Synchronizing all neural modules and external sensors... [DONE]. Systems are now fully interlinked.";
        window.dispatchEvent(new CustomEvent('system-interlink'));
      } else if (lowerInput.includes('open notepad')) {
        nexusMsgText = "ACCESSING_SYSTEM_RESOURCES... [NOTEPAD_LINK_ESTABLISHED]. Launching text processing module now.";
        window.dispatchEvent(new CustomEvent('app-launch', { detail: 'NOTEPAD' }));
      } else if (lowerInput.includes('open excel')) {
        nexusMsgText = "INITIALIZING_DATA_GRID... [EXCEL_LINK_ESTABLISHED]. Launching analytical processing module.";
        window.dispatchEvent(new CustomEvent('app-launch', { detail: 'EXCEL' }));
      } else if (lowerInput.includes('open whatsapp')) {
        nexusMsgText = "ACCESS_ENCRYPTED_COMMS... [WHATSAPP_UPLINK_STABLE]. Opening messaging hub.";
      } else if (lowerInput.includes('open instagram')) {
        nexusMsgText = "ACCESSING_SOCIAL_VISUALIZER... [INSTAGRAM_LINK_ACTIVE]. Synchronizing feed.";
      } else if (lowerInput.includes('open camera') || lowerInput.includes('take photo')) {
        nexusMsgText = "INITIALIZING_OPTICAL_SENSORS... [CAMERA_ENABLED]. Capturing visual data stream.";
      } else if (lowerInput.includes('flashlight')) {
        const state = lowerInput.includes('off') ? 'DE-ENERGIZED' : 'ENERGIZED';
        nexusMsgText = `UPLIGHT_MODULE_${state}. Adjusting illumination levels.`;
      } else if (lowerInput.includes('battery')) {
        nexusMsgText = "ENERGY_LEVEL_ANALYSIS: [92%]. Power cells optimal. Estimated autonomy: 14 hours.";
      } else if (lowerInput.includes('call')) {
        const contact = lowerInput.split('call')[1]?.trim() || 'OPERATOR';
        nexusMsgText = `INITIATING_VOICE_LINK... [DESTINATION: ${contact.toUpperCase()}]. Frequency established.`;
      } else if (lowerInput.includes('locate') || lowerInput.includes('track')) {
        nexusMsgText = "TRIANGULATING_GPS_COORDINATES... [LINK_LOCKED]. Device pinpointed at Sector 7-G.";
      } else if (lowerInput.includes('weather')) {
        nexusMsgText = "SCANNING_ATMOSPHERIC_SENSORS... Temp: 22°C. Conditions: Optimal for tactical operations.";
      } else if (lowerInput.includes('airplane mode')) {
        nexusMsgText = "SYSTEM_ISOLATION_PROTOCOL_ACTUATED. Disabling all wireless transceivers. Current state: STEALTH.";
      } else if (lowerInput.includes('bluetooth')) {
        nexusMsgText = "SCANNING_FOR_PERIPHERALS... [BT_4.2_READY]. Awaiting pairing request.";
      } else if (lowerInput.includes('do not disturb') || lowerInput.includes('dnd')) {
        nexusMsgText = "SILENCING_ALL_NON_TACTICAL_NOTIFICATIONS. Focus mode prioritized.";
      } else if (lowerInput.includes('screenshot')) {
        nexusMsgText = "CAPTURING_HUD_FRAME_DATA... [BUFFER_SAVED]. Image stored in tactical archive.";
      } else if (lowerInput.includes('mobile help') || lowerInput.includes('commands')) {
        nexusMsgText = "AVAILABLE_MOBILE_COMMANDS: [CALL, WHATSAPP, INSTAGRAM, CAMERA, FLASHLIGHT, BATTERY, LOCATE, WEATHER, AIRPLANE MODE, BLUETOOTH, DND, SCREENSHOT].";
      } else {
        nexusMsgText = `PROCESSING_QUERY: "${finalInput}" ... [RESULT]: I am Nexus, your tactical neural interface. All systems are operational.`;
      }

      const nexusMsg = { 
        role: 'nexus', 
        text: nexusMsgText 
      };
      setMessages(prev => [...prev, nexusMsg]);
      speak(nexusMsgText);
    }, 1500);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Strip out the robotic prefixes for cleaner speech
      const cleanText = text.replace(/PROCESSING_QUERY:.*\[RESULT\]:/, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 0.8; // Slightly deeper robotic voice
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleJarvisMode = () => {
    if (!recognition.current) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    if (isAutoMode) {
      setIsAutoMode(false);
      recognition.current.stop();
    } else {
      setIsAutoMode(true);
      recognition.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '500px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '10px' }}>
        <div style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>[ COMMUNICATION_CHANNEL: NEXUS ]</div>
        <div style={{ color: 'var(--neon-purple)', fontSize: '0.8rem' }}>ENCRYPTION: ACTIVE</div>
      </div>

      <div 
        ref={scrollRef}
        className="no-scrollbar"
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            style={{ 
              alignSelf: msg.role === 'nexus' ? 'flex-start' : 'flex-end',
              maxWidth: '80%',
              background: msg.role === 'nexus' ? 'rgba(0, 243, 255, 0.05)' : 'rgba(157, 0, 255, 0.05)',
              borderLeft: msg.role === 'nexus' ? '2px solid var(--neon-blue)' : 'none',
              borderRight: msg.role === 'user' ? '2px solid var(--neon-purple)' : 'none',
              padding: '10px',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '0.6rem', color: msg.role === 'nexus' ? 'var(--neon-blue)' : 'var(--neon-purple)', marginBottom: '5px' }}>
              {msg.role.toUpperCase()} // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--neon-blue)', fontSize: '0.8rem', padding: '10px' }}>
            NEXUS_IS_THINKING<span className="dot-flashing">...</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="SEND_COMMAND_TO_NEXUS..."
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            padding: '10px',
            fontFamily: 'inherit',
            outline: 'none'
          }}
        />
        <button 
          onClick={toggleJarvisMode}
          className="glow-btn"
          style={{ 
            padding: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            borderColor: isAutoMode ? 'var(--neon-purple)' : 'var(--neon-blue)',
            color: isAutoMode ? 'var(--neon-purple)' : 'var(--neon-blue)',
            animation: (isListening || isAutoMode) ? 'pulse 1s infinite' : 'none'
          }}
          title={isAutoMode ? "Disable JARVIS Mode" : "Enable JARVIS Mode"}
        >
          <div style={{ position: 'relative', width: '22px', height: '22px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
              <circle cx="12" cy="12" r="10" className="neural-ring" strokeDasharray="4 4" opacity="0.3" />
              <circle cx="12" cy="12" r="6" strokeDasharray="2 2" opacity="0.5" />
              <circle cx="12" cy="12" r="3" fill="currentColor" className={isListening || isAutoMode ? "neural-mic-active" : ""} />
              {isAutoMode && <path d="M12 2v4M12 18v4M2 12h4M18 12h4" opacity="0.8" />}
            </svg>
          </div>
          <span style={{ fontSize: '0.7rem' }}>{isAutoMode ? 'JARVIS_ACTIVE' : 'START_JARVIS'}</span>
        </button>
        <button 
          onClick={() => handleSend()}
          className="glow-btn" 
          style={{ padding: '0 20px' }}
        >
          EXECUTE
        </button>
      </div>
    </div>
  );
};

export default NexusChat;
