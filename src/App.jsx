import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

import { 
  Terminal, 
  Cpu, 
  Activity, 
  Crosshair, 
  Database, 
  Network,
  ShieldAlert,
  ChevronRight,
  Power,
  X,
  ArrowLeft,
  RefreshCw,
  Key
} from 'lucide-react';
import CyberScene from './components/CyberScene';
import NeuralBackground from './components/NeuralBackground';
import { generateChatResponse } from './lib/nexus_ai';
import { createXAIKey } from './lib/xai';

const MessageContent = ({ content }) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    parts.push({ 
      type: 'code', 
      lang: match[1] || 'text', 
      value: match[2].trim() 
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {parts.map((part, index) => (
        part.type === 'text' ? (
          <div key={index} style={{ whiteSpace: 'pre-wrap' }}>{part.value}</div>
        ) : (
          <div key={index} className="data-terminal" style={{ margin: '10px 0', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0, 212, 255, 0.3)', background: 'rgba(0, 0, 0, 0.6)' }}>
            <div style={{ background: 'rgba(0, 212, 255, 0.1)', padding: '8px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--border-neon)', borderRadius: '50%', boxShadow: '0 0 5px var(--border-neon)' }}></div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{part.lang}_MODULE.exe</span>
              </div>
              <button 
                onClick={() => handleCopy(part.value)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.target.style.color = 'var(--border-neon)'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-dim)'}
              >
                [ COPY_DATA ]
              </button>
            </div>
            <pre style={{ padding: '15px', margin: 0, overflowX: 'auto', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#00ff41', background: 'rgba(0,0,0,0.3)', lineHeight: '1.5' }}>
              <code>{part.value}</code>
            </pre>
          </div>
        )
      ))}
    </div>
  );
};

const FooterCard = ({ icon: Icon, title, description, details, delay = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="footer-card"
      onClick={() => details && setIsExpanded(!isExpanded)}
      style={{ cursor: details ? 'pointer' : 'default' }}
    >
      <div className="tracing-border"></div>
      <div className="footer-card-icon">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <AnimatePresence>
        {isExpanded && details && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 15 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px dashed rgba(0, 212, 255, 0.3)', paddingTop: '15px' }}>
              {details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChatBot = ({ externalCommand, clearExternalCommand, onClose, hideClose = false, height = '420px', dragControls }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "System initialized. How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef(null);



  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (externalCommand) {
      const newMsg = { id: Date.now(), text: externalCommand, sender: "user" };
      setMessages(prev => [...prev, newMsg]);
      setIsTyping(true);
      
      setTimeout(async () => {
        setIsTyping(false);
        const botResponse = await generateChatResponse(externalCommand, messages);
        setMessages(prev => [...prev, { id: Date.now(), text: botResponse, sender: "bot" }]);
      }, 1000);
      
      clearExternalCommand();
    }
  }, [externalCommand, clearExternalCommand]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(async () => {
      setIsTyping(false);
      const botResponse = await generateChatResponse(input, messages);
      setMessages(prev => [...prev, { id: Date.now(), text: botResponse, sender: "bot" }]);
    }, 1000);
  };

  return (
    <div className="chatbot-container scanline-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: height, 
      padding: '0', 
      background: 'transparent', 
      backdropFilter: 'none', 
      border: 'none', 
      borderRadius: '8px',
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: 'none'
    }}>
      <div className="hud-corner tl"></div>
      <div className="hud-corner tr"></div>
      <div className="hud-corner bl"></div>
      <div className="hud-corner br"></div>
      
      {/* Header */}
      <div 
        onPointerDown={(e) => dragControls?.start(e)}
        style={{ 
          background: 'none', 
          borderBottom: '1px solid rgba(0, 212, 255, 0.15)', 
          padding: '15px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: dragControls ? 'grab' : 'default',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Terminal size={24} color="var(--border-neon)" />
            <span style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, background: '#00ff41', borderRadius: '50%', boxShadow: '0 0 8px #00ff41', animation: 'blink 2s infinite' }}></span>
          </div>
          <div>
            <div className="nexus-hover-text" style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '1px' }}>NEXUS_ASSISTANT</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Neural Link: ACTIVE</div>
          </div>
        </div>
        {!hideClose && (
          <X 
            size={20} 
            color="var(--text-secondary)" 
            style={{ cursor: 'pointer', transition: 'color 0.2s' }} 
            onClick={onClose}
            onMouseOver={(e) => e.target.style.color = 'var(--border-neon)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
          />
        )}
      </div>
      
      {/* Messages Area */}
      <div ref={scrollContainerRef} style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px', fontFamily: 'var(--font-mono)', padding: '0 4px' }}>
                {msg.sender === 'user' ? 'GUEST_USER' : 'SYS_CORE'}
              </div>
              <div className={`terminal-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px', opacity: 0.1, pointerEvents: 'none' }}>
                  <Cpu size={40} />
                </div>
                <MessageContent content={msg.text} />
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '15px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px 18px 18px 0', border: '1px solid rgba(255,255,255,0.1)' }}
             >
               <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, background: 'var(--border-neon)', borderRadius: '50%' }} />
               <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, background: 'var(--border-neon)', borderRadius: '50%' }} />
               <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, background: 'var(--border-neon)', borderRadius: '50%' }} />
             </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Input Area */}
      <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(0, 212, 255, 0.15)', background: 'none' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{'>'}</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Transmit command sequence..."
              style={{ 
                width: '100%',
                background: 'rgba(0, 0, 0, 0.1)', 
                border: '1px solid rgba(0, 212, 255, 0.3)', 
                color: '#fff',
                padding: '14px 20px 14px 35px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.3s',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--border-neon)';
                e.target.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.2), inset 0 2px 5px rgba(0,0,0,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                e.target.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.5)';
              }}
            />
          </div>
          <button type="submit" className="premium-btn" style={{ padding: '0 25px', height: '45px', flexShrink: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>
            <div className="premium-btn-accent top-left"></div>
            <div className="premium-btn-accent bottom-right"></div>
            <span>TRANSMIT</span>
          </button>

        </form>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const textRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [externalCommand, setExternalCommand] = useState("");
  const dragControls = useDragControls();

  const handleUplink = () => {
    setIsChatOpen(true);
    setExternalCommand("Initialize Uplink");
  };

  useGSAP(() => {
    gsap.fromTo(".arise-text", 
      { y: 80, opacity: 0, rotationX: -60, filter: "blur(15px)" }, 
      { 
        y: 0, 
        opacity: 1, 
        rotationX: 0, 
        filter: "blur(0px)",
        duration: 1.5, 
        stagger: 0.25, 
        ease: "expo.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play reverse play reverse"
        }
      }
    );
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--border-neon)', marginBottom: '10px' }}>
              <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
              ACCESS GRANTED
            </div>
            <h1 className="font-display glitch" data-text="TACTICAL_INTEL_NETWORK" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '0.9', marginBottom: '20px' }}>
              TACTICAL <br />
              <span className="highlight">INTELLIGENCE</span> <br />
              NETWORK
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{ width: '40px', height: '2px', background: 'var(--border-neon)', boxShadow: '0 0 10px var(--border-neon)' }}></div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>NEURAL_INTERFACE_v2.0</div>
            </div>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '600px', background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.05), transparent)', padding: '20px', borderLeft: '2px solid var(--border-neon)', backdropFilter: 'blur(5px)' }}>
              Deploying neural processing capabilities across distributed edge nodes. 
              Synchronize mission-critical data with sub-millisecond latency. 
              Welcome to the next evolution of autonomous infrastructure.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button className="premium-btn" onClick={handleUplink}>
                <div className="premium-btn-accent top-left"></div>
                <div className="premium-btn-accent bottom-right"></div>
                <Power size={18} />
                <span>INITIALIZE UPLINK</span>
              </button>
              <button className="premium-btn" onClick={() => navigate('/intelligence')} style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                <div className="premium-btn-accent top-left" style={{ borderColor: 'var(--accent-cyan)' }}></div>
                <div className="premium-btn-accent bottom-right" style={{ borderColor: 'var(--accent-cyan)' }}></div>
                <Database size={18} />
                <span>INTELLIGENCE</span>
              </button>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-visuals"
          style={{ minHeight: '600px', position: 'relative' }}
        >
          {/* Background Data Stream */}
          <AnimatePresence>
            {!isChatOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
              >
                <motion.div 
                  animate={{ y: [-1000, 0] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.6rem', 
                    color: 'var(--border-neon)', 
                    lineHeight: '1', 
                    whiteSpace: 'pre',
                    textShadow: '0 0 5px var(--border-neon)'
                  }}
                >
                  {Array(100).fill(0).map(() => Math.random().toString(16).substring(2, 15)).join('\n')}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isChatOpen ? (
              <motion.div 
                key="robot-scene"
                initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ position: 'absolute', inset: 0, zIndex: 1 }}
              >
                <CyberScene />

              </motion.div>
            ) : (
              <motion.div
                key="chatbot-scene"
                drag
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 420, bottom: window.innerHeight - 450 }}
                dragElastic={0.1}
                dragMomentum={false}
                style={{ 
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  zIndex: 9999,
                  width: '420px',
                }}
                whileDrag={{ scale: 1.02 }}
                initial={{ opacity: 0, x: window.innerWidth - 460, y: window.innerHeight - 500, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: window.innerWidth - 460, y: window.innerHeight - 500, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
              >
                <ChatBot externalCommand={externalCommand} clearExternalCommand={() => setExternalCommand("")} onClose={() => setIsChatOpen(false)} dragControls={dragControls} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <section ref={textRef} style={{ padding: '80px 20px', textAlign: 'center', perspective: '1200px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="arise-text" style={{ display: 'inline-block', padding: '4px 12px', border: '1px solid rgba(0, 212, 255, 0.4)', borderRadius: '20px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '15px', background: 'rgba(0, 212, 255, 0.05)' }}>
          SYSTEM DIRECTIVE...............
        </div>
        <h2 className="arise-text" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '20px', letterSpacing: '2px', textShadow: '0 0 30px rgba(0, 212, 255, 0.4)' }}>
          BEYOND ARTIFICIAL <span style={{ color: 'var(--border-neon)' }}>INTELLIGENCE</span>
        </h2>
        <p className="arise-text" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', margin: '0 auto 8px', lineHeight: '1.7' }}>
          We are pioneering the synthesis of quantum mechanics and deep neural architectures. 
        </p>
        <p className="arise-text" style={{ fontSize: '1.15rem', color: 'var(--text-dim)', margin: '0 auto 30px', lineHeight: '1.7' }}>
          Welcome to the threshold of true machine consciousness, where raw data is forged into actionable tactical foresight.
        </p>
        <div className="arise-text" style={{ width: '150px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--border-neon), transparent)', margin: '0 auto', boxShadow: '0 0 20px var(--border-neon)' }}></div>
      </section>

      <section id="footer-cards-section">
        <div className="footer-cards-container">
          <FooterCard 
            icon={Cpu}
            title="QUANTUM COMPUTE"
            description="Harness specialized tensor processing units to execute multi-layered neural networks in parallel. Click for details."
            details={
              <>
                <div style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--border-neon)' }}>AI PROCESSOR:</strong> Utilizing state-of-the-art quantum-accelerated Tensor Processing Units (TPUs) to evaluate deep neural network heuristics in real-time.</div>
                <div style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--border-neon)' }}>MACHINE LEARNING:</strong> Our AI models leverage unsupervised reinforcement learning to autonomously adapt to tactical intelligence scenarios and predict optimal deployment strategies.</div>
                <div><strong style={{ color: 'var(--border-neon)' }}>THROUGHPUT:</strong> Capable of analyzing over 5.4 petabytes of streaming unstructured data per second through adaptive cognitive algorithms.</div>
              </>
            }
            delay={0.1}
          />
          <FooterCard 
            icon={Network}
            title="NEURAL MESH"
            description="Establish self-healing connectivity across redundant edge nodes to guarantee zero downtime. Click for details."
            details={
              <>
                <div style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--border-neon)' }}>AI ORCHESTRATION:</strong> The mesh employs swarm intelligence algorithms to dynamically route data, ensuring maximum efficiency and bypassing degraded nodes autonomously.</div>
                <div style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--border-neon)' }}>EDGE INFERENCE:</strong> AI models are distributed directly to edge terminals, eliminating cloud-latency and enabling instant, localized decision-making protocols.</div>
                <div><strong style={{ color: 'var(--border-neon)' }}>SECURITY:</strong> Features an AI-driven predictive firewall that identifies and isolates anomalous network behaviors before they can establish an intrusion payload.</div>
              </>
            }
            delay={0.2}
          />
          <FooterCard 
            icon={Database}
            title="DATA VAULT"
            description="Encrypted long-term storage array with multi-factor biometric access protocols. Click for details."
            details={
              <>
                <div style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--border-neon)' }}>SYSTEM ARCHITECTURE:</strong> NEXUS is a high-performance, cybernetic-grade edge dashboard engineered to process distributed neural operations with zero latency. It interfaces directly with secure backend kernel modules to provide a seamless tactical overlay for deep-data analytics.</div>

                <div><strong style={{ color: 'var(--border-neon)' }}>FRAMEWORK:</strong> Built on a React core with Framer Motion for liquid-smooth UI transitions, rendering via a hardware-accelerated Vite server.</div>
              </>
            }
            delay={0.3}
          />
        </div>
      </section>
      
      <div style={{ height: '60px' }}></div>
    </main>
  );
};


const XAIControlPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await createXAIKey(`NEXUS_KEY_${Date.now().toString().slice(-4)}`);
      const key = data.apiKey || data.key || "KEY_GENERATED_SUCCESSFULLY";
      setGeneratedKey(key);
      // Save for chatbot to use
      localStorage.setItem('NEXUS_XAI_KEY', key);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="terminal-bubble"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', background: 'rgba(0, 212, 255, 0.02)', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}
    >
      <div className="hud-corner tl" style={{ borderColor: 'var(--border-neon)' }}></div>
      <div className="hud-corner br" style={{ borderColor: 'var(--border-neon)' }}></div>
      
      <div style={{ fontSize: '0.8rem', color: 'var(--border-neon)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>
        <Key size={16} /> X.AI_MANAGEMENT
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '4px', border: '1px dashed rgba(0, 212, 255, 0.2)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>COMMAND_BUFFER:</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
            Authorize neural downlink to X.AI infrastructure. System will provision a new API key with model & endpoint permissions.
          </p>
        </div>

        {generatedKey && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(0, 255, 65, 0.05)', padding: '12px', border: '1px solid rgba(0, 255, 65, 0.2)', borderRadius: '4px' }}
          >
            <div style={{ fontSize: '0.55rem', color: '#00ff41', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>ACCESS_KEY_GRANTED:</div>
            <div style={{ fontSize: '0.8rem', color: '#fff', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '2px' }}>
              {generatedKey}
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(generatedKey);
                alert("KEY_COPIED_TO_CLIPBOARD");
              }}
              style={{ background: 'none', border: 'none', color: '#00ff41', fontSize: '0.6rem', cursor: 'pointer', marginTop: '5px', fontFamily: 'var(--font-mono)' }}
            >
              [ COPY_TO_MEMORY ]
            </button>
          </motion.div>
        )}

        {error && (
          <div style={{ background: 'rgba(255, 0, 0, 0.05)', padding: '12px', border: '1px solid rgba(255, 0, 0, 0.2)', borderRadius: '4px', color: '#ff4b4b', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.55rem', marginBottom: '5px' }}>UPLINK_FAILURE:</div>
            {error}
          </div>
        )}
      </div>

      <button 
        className="premium-btn" 
        onClick={handleGenerateKey} 
        disabled={isGenerating}
        style={{ width: '100%', justifyContent: 'center', opacity: isGenerating ? 0.5 : 1 }}
      >
        <div className="premium-btn-accent top-left"></div>
        <div className="premium-btn-accent bottom-right"></div>
        {isGenerating ? <RefreshCw size={14} className="spin" /> : <Power size={14} />}
        <span>{isGenerating ? 'GENERATING...' : 'GENERATE_NEW_KEY'}</span>
      </button>

      <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
        SECURE_CHANNEL_v4.2 // RSA_ENCRYPTED
      </div>
    </motion.div>
  );
};

const IntelligencePage = () => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '0', flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
    >


      {/* Immersive Neural Background */}
      <NeuralBackground />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto', width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              className="premium-btn"
              onClick={() => navigate('/')} 
              style={{ fontSize: '0.7rem', padding: '8px 16px' }}
            >
              <div className="premium-btn-accent top-left"></div>
              <div className="premium-btn-accent bottom-right"></div>
              <ArrowLeft size={14} />
              <span>TERMINATE_SESSION</span>
            </button>
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div style={{ color: 'var(--border-neon)', fontSize: '1.2rem', letterSpacing: '4px', fontWeight: '900' }}>INTELLIGENCE_CENTER</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.6rem', letterSpacing: '2px' }}>CORE_KERNEL_REVISION_v2.0.42</div>
          </div>
        </header>

        <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '20px', overflow: 'hidden' }}>
          {/* Left Sidebar - Metrics */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="terminal-bubble"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', background: 'transparent', border: 'none' }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--border-neon)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={16} /> SYSTEM_METRICS
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'NEURAL_LOAD', value: 42, unit: '%', color: 'var(--border-neon)', icon: Cpu, status: 'STABLE' },
                { label: 'QUANTUM_ENTROPY', value: 68, unit: 'mQ', color: 'var(--accent-cyan)', icon: Activity, status: 'OPTIMAL' },
                { label: 'CORE_TEMP', value: 31, unit: '°C', color: 'var(--accent-orange)', icon: Activity, status: 'STABLE' },
                { label: 'NETWORK_LATENCY', value: 12, unit: 'ms', color: '#00ff41', icon: Network, status: 'NOMINAL' }
              ].map((m, i) => {
                const [liveValue, setLiveValue] = useState(m.value);
                useEffect(() => {
                  const interval = setInterval(() => {
                    setLiveValue(m.value + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2));
                  }, 2000 + Math.random() * 3000);
                  return () => clearInterval(interval);
                }, [m.value]);

                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    style={{ fontFamily: 'var(--font-mono)', padding: '10px', borderLeft: `2px solid ${m.color}`, background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <m.icon size={12} color={m.color} />
                        <span style={{ fontSize: '0.65rem', color: '#fff', letterSpacing: '1px' }}>{m.label}</span>
                      </div>
                      <span style={{ fontSize: '0.55rem', color: m.color, opacity: 0.7 }}>// {m.status}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flexGrow: 1, display: 'flex', gap: '3px' }}>
                        {Array(20).fill(0).map((_, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0.1 }}
                            animate={{ 
                              opacity: (idx / 20) * 100 <= liveValue ? 1 : 0.1,
                              boxShadow: (idx / 20) * 100 <= liveValue ? `0 0 8px ${m.color}` : 'none'
                            }}
                            transition={{ duration: 0.5 }}
                            style={{ 
                              height: '6px', 
                              flexGrow: 1, 
                              background: m.color,
                              borderRadius: '1px'
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ minWidth: '45px', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: m.color, fontWeight: '700' }}>{liveValue.toFixed(i === 1 ? 5 : 1)}</span>
                        <span style={{ fontSize: '0.5rem', color: 'var(--text-dim)', marginLeft: '2px' }}>{m.unit}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content - Chat */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ChatBot externalCommand="" clearExternalCommand={() => {}} onClose={() => {}} hideClose={true} height="100%" />
          </div>

          {/* Right Sidebar - XAI Control Panel */}
          <XAIControlPanel />
        </div>
      </div>
    </motion.div>
  );
};


const EntryPage = ({ onEnter }) => {
  return (
    <div className="entry-page">
      <div className="entry-background">
        <CyberScene />
      </div>
      
      <div className="entry-content">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="entry-logo-container"
        >
          <div className="entry-logo glitch" data-text="NEXUS" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>NEXUS</div>
          <div className="entry-sub-logo" style={{ fontSize: '0.85rem' }}>ADVANCED_TACTICAL_INTERFACE</div>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="premium-btn entry-btn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="premium-btn-accent top-left"></div>
          <div className="premium-btn-accent bottom-right"></div>
          <span>INITIALIZE SYSTEM</span>
        </motion.button>

        <div className="entry-footer">
          <div className="entry-status-line">
            <span className="status-label">UPLINK_STATUS:</span>
            <span className="status-value blink">READY</span>
          </div>
          <div className="entry-status-line">
            <span className="status-label">ENCRYPTION:</span>
            <span className="status-value">AES-256_ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};


function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEntered, setIsEntered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="noise-overlay"></div>
      <div className="hud-frame">
        <div className="hud-corner tl"></div>
        <div className="hud-corner tr"></div>
        <div className="hud-corner bl"></div>
        <div className="hud-corner br"></div>
      </div>
      <AnimatePresence mode="wait">
        {!isEntered ? (
          <EntryPage key="entry" onEnter={() => setIsEntered(true)} />
        ) : (
          <motion.div
            key="main-app"
            className="app-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {location.pathname === '/' && (
              <header className="cyber-header">
                <div className="logo-container">
                  <Terminal color="var(--border-neon)" size={24} />
                  <div className="logo-text nexus-hover-text" onClick={() => setIsEntered(false)} style={{ cursor: 'pointer', fontSize: '1.2rem' }}>NEXUS</div>
                  {location.pathname === '/intelligence' && (
                    <div className="logo-version">v.2.0</div>
                  )}
                </div>
                
                  <div className="sys-status">
                    <motion.div 
                      className="status-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>DATA_SYNC:</span> 
                      <span style={{ color: 'var(--border-neon)' }}>{currentTime.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                    </motion.div>
                    <motion.div 
                      className="status-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>CHRONO:</span> 
                      <span style={{ color: 'var(--border-neon)', width: '75px', display: 'inline-block' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                    </motion.div>

                    <motion.div 
                      className="status-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>UPLINK:</span> 
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="blink" style={{ color: 'var(--border-neon)' }}>ACTIVE</span>
                        <div style={{ width: '4px', height: '4px', background: 'var(--border-neon)', borderRadius: '50%', boxShadow: '0 0 8px var(--border-neon)' }}></div>
                      </div>
                    </motion.div>
                  </div>
              </header>
            )}

            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
