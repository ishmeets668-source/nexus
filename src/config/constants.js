/**
 * Global Configuration for Neural Nexus Interface
 */

export const SYSTEM_CONFIG = {
  VERSION: '1.0.4-PROD',
  CODENAME: 'NEXUS_ALPHA',
  SECURITY_LEVEL: 'AES_256_GCM',
  ANIMATION_SPEED: {
    FAST: 0.3,
    NORMAL: 0.5,
    SLOW: 2.0
  },
  THEME: {
    PRIMARY: '#00f3ff',
    SECONDARY: '#9d00ff',
    ACCENT: '#ff0055',
    BACKGROUND: '#02040a'
  },
  ENDPOINTS: {
    CORE_API: import.meta.env.VITE_CORE_API || 'https://api.nexus-core.internal',
    WEBSOCKET: import.meta.env.VITE_WS_URL || 'ws://socket.nexus-core.internal'
  }
};

export const UI_STRINGS = {
  TITLE: 'NEURAL_NEXUS',
  STATUS_STABLE: 'CORE_STABLE',
  ENCRYPTION: 'ENCRYPT_AES_256',
  NEURAL_LINK: 'NEURAL_LINK_77_A',
  FOOTER_BRAND: 'ARCH_ROBOTICS // UNIT_NEXUS_01 // SECURE_SHELL_ACTIVE'
};
