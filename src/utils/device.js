/**
 * Utility to detect mobile devices for performance optimizations
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || (window.innerWidth <= 768);
};

export const checkBridgeStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    // We try to ping the local launcher to see if we are in a 'linked' environment
    const response = await fetch('/api/launcher?ping=true', { 
      signal: controller.signal,
      mode: 'no-cors' // We don't care about the response, just if it exists
    });
    clearTimeout(timeoutId);
    return true;
  } catch (e) {
    return false;
  }
};
