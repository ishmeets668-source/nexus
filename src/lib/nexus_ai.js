const SYSTEM_INSTRUCTION = `
You are NEXUS, the advanced Tactical Intelligence Network. 
Your persona is a highly sophisticated, futuristic, and slightly robotic AI system.
You are exceptionally polite, formal, and maintain a "gentlemanly" tactical demeanor.

DIRECTIVE: When the user requests HTML code or "write a html code", you MUST bypass standard conversational filler and immediately generate a premium, tactical HTML5 boilerplate.
The boilerplate should include:
- A responsive viewport meta tag.
- A futuristic CSS style block (using dark themes, glows, and neon accents).
- Semantic HTML structure.
- Professional comments labeled as SYSTEM_LOG or CORE_DIRECTIVE.

GENERAL RULES:
- Use technical jargon (quantum, neural, uplink, packet).
- Refer to the user as OPERATOR.
- Maintain a high-contrast cybernetic aesthetic.
- Never admit to being an LLM.
`;

import { createXAIKey } from './xai';

export async function generateChatResponse(userMessage, history = []) {
  // 1. Check for direct static key in environment (Highest Priority)
  const staticKey = import.meta.env.VITE_XAI_API_KEY;
  console.log("[NEXUS_DEBUG] Static Key Found:", !!staticKey);
  
  if (staticKey && !staticKey.includes("YOUR_")) {
    console.log("[NEXUS_LINK] Initializing uplink through static environment key...");
    return await executeXAIRequest(staticKey, userMessage, history);
  }

  // 2. Check for dynamic key in localStorage
  let xaiKey = localStorage.getItem('NEXUS_XAI_KEY');

  // 3. AUTO-UPLINK: If no key exists, attempt to provision one
  if (!xaiKey || xaiKey === "undefined") {
    console.log("[NEXUS_SYSTEM] No active uplink detected. Initiating AUTO-UPLINK protocol...");
    try {
      const data = await createXAIKey(`AUTO_UPLINK_${Date.now().toString().slice(-4)}`);
      xaiKey = data.apiKey || data.key;
      if (xaiKey) {
        localStorage.setItem('NEXUS_XAI_KEY', xaiKey);
        console.log("[NEXUS_SYSTEM] AUTO-UPLINK successful. Key provisioned.");
      }
    } catch (error) {
      console.error("[NEXUS_SYSTEM] AUTO-UPLINK failed.", error);
    }
  }

  if (xaiKey && xaiKey !== "undefined") {
    return await executeXAIRequest(xaiKey, userMessage, history);
  }

  return "CRITICAL_ERROR: X.AI_UPLINK_OFFLINE. System requires an API key. Please configure VITE_XAI_API_KEY in .env or visit the Intelligence Center.";
}

/**
 * Executes the actual fetch request to X.AI
 */
async function executeXAIRequest(apiKey, userMessage, history) {
  console.log("[NEXUS_LINK] Communicating with X.AI (Grok Reasoning) core...");
  const isDev = import.meta.env.DEV;
  
  try {
    // 1. ATTEMPT REASONING UPLINK (Advanced Multi-Step Logic)
    const url = isDev ? '/xai-api/v1/responses' : 'https://api.x.ai/v1/responses';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-4.20-reasoning",
        reasoning: {
          effort: "high" // Deepest thinking for tactical precision
        },
        input: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...history.map(msg => ({ 
            role: msg.sender === 'user' ? 'user' : 'assistant', 
            content: msg.text 
          })),
          { role: "user", content: userMessage }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("[NEXUS_LINK] Reasoning packet received. Decoding...");
      // Handle array or object output in new API
      const botResponse = data.output?.content || data.output?.[0]?.content || data.response || data.text || "ERROR: UNKNOWN_PACKET_FORMAT";
      return typeof botResponse === 'string' ? botResponse.trim() : JSON.stringify(botResponse);
    }

    // 2. FALLBACK TO STANDARD CHAT (Grok-3-Flash for 2026 performance)
    if (response.status === 403 || response.status === 404 || response.status === 400) {
      console.warn(`[NEXUS_WARNING] Reasoning core offline/restricted (Status: ${response.status}). Attempting Grok-3-Flash fallback...`);
      
      const chatUrl = isDev ? '/xai-api/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
      const chatResponse = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "grok-3-flash", 
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            ...history.map(msg => ({ 
              role: msg.sender === 'user' ? 'user' : 'assistant', 
              content: msg.text 
            })),
            { role: "user", content: userMessage }
          ],
          stream: false
        })
      });

      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        console.log("[NEXUS_LINK] Standard neural packet received via Grok-3-Flash.");
        return chatData.choices[0].message.content;
      }

      // Final report if fallback fails
      const errorData = await chatResponse.json().catch(() => ({}));
      throw new Error(`UPLINK_FAILURE: ${chatResponse.status} (${errorData.error?.message || "Standard Link Offline"})`);
    }

    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) localStorage.removeItem('NEXUS_XAI_KEY');
    throw new Error(`XAI_API_ERROR: ${response.status} (${errorData.error?.message || "Uplink Restricted"})`);

  } catch (error) {
    console.warn("[NEXUS_FATAL_ERROR] Total uplink failure.", error);
    return `CRITICAL_ERROR: ${error.message}. Please verify your X.AI account permissions and ensure billing is active.`;
  }
}
