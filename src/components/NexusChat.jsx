import React, { useState, useEffect, useRef } from 'react';
import './NexusChat.css';

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
      } else if (lowerInput.includes('commands')) {
        nexusMsgText = "AVAILABLE_COMMANDS: [HEY NEXUS, INTERLINK, OPEN NOTEPAD, OPEN EXCEL, OPEN CODE, OPEN BROWSER, SYSTEM STATUS].";
      } else {
        nexusMsgText = `PROCESSING_QUERY: "${finalInput}" ... [RESULT]: I am Nexus, your tactical neural interface. All systems are operational.`;
      }

      const nexusMsg = { role: 'nexus', text: nexusMsgText };
      setMessages(prev => [...prev, nexusMsg]);
      speak(nexusMsgText);
    }, 1500);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/PROCESSING_QUERY:.*\[RESULT\]:/, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 0.8;
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleJarvisMode = () => {
    if (!recognition.current) return;
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
    <div className="nexus-chat-container">
      <div className="card-corner corner-tl"></div>
      <div className="card-corner corner-tr"></div>
      <div className="card-corner corner-bl"></div>
      <div className="card-corner corner-br"></div>

      <div className="chat-header" style={{ justifyContent: 'center' }}>
        <div style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>COMMAND_INTERFACE</div>
      </div>

      <div ref={scrollRef} className="messages-window no-scrollbar">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`message-bubble ${msg.role === 'nexus' ? 'message-nexus' : 'message-user'}`}
          >
            <div className="message-meta">
              <span style={{ color: msg.role === 'nexus' ? 'var(--neon-blue)' : 'var(--neon-purple)' }}>
                {msg.role.toUpperCase()} // ID_{Math.floor(1000 + Math.random() * 9000)}
              </span>
              <span style={{ opacity: 0.5 }}>{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#e0faff' }}>
              {msg.role === 'nexus' && <span style={{ color: 'var(--neon-blue)', marginRight: '8px' }}>&gt;&gt;</span>}
              {msg.text}
            </div>
            <div className="pkt-info">PKT_LEN: {msg.text.length}B</div>
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--neon-blue)', fontSize: '0.7rem', padding: '10px', letterSpacing: '2px' }}>
            NEXUS_IS_THINKING<span className="dot-flashing">...</span>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="SEND_COMMAND_TO_NEXUS..."
          className="chat-input"
        />
        <button 
          onClick={toggleJarvisMode}
          className="glow-btn"
          style={{ 
            borderColor: isAutoMode ? 'var(--neon-purple)' : 'var(--neon-blue)',
            color: isAutoMode ? 'var(--neon-purple)' : 'var(--neon-blue)',
            animation: (isListening || isAutoMode) ? 'pulse 1s infinite' : 'none'
          }}
        >
          <span style={{ fontSize: '0.6rem' }}>{isAutoMode ? 'ACTIVE' : 'START'}</span>
        </button>
      </div>
    </div>
  );
};

export default NexusChat;
