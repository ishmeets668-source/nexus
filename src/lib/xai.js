const MANAGEMENT_KEY = import.meta.env.VITE_XAI_MANAGEMENT_KEY;
const TEAM_ID = import.meta.env.VITE_XAI_TEAM_ID;

/**
 * Creates a new API key via x.ai Management API
 * @param {string} name - Name of the API key
 * @returns {Promise<Object>} - The created API key data
 */
export async function createXAIKey(name = "Nexus Managed Key") {
  console.log(`[XAI_LINK] Initiating key generation for: ${name}`);

  if (!MANAGEMENT_KEY || !TEAM_ID || MANAGEMENT_KEY.includes("YOUR_")) {
    throw new Error("XAI_CREDENTIALS_MISSING: Please configure .env with valid Management Key and Team ID.");
  }

  const isDev = import.meta.env.DEV;
  const url = isDev 
    ? `/xai-management/auth/teams/${TEAM_ID}/api-keys`
    : `https://management-api.x.ai/auth/teams/${TEAM_ID}/api-keys`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MANAGEMENT_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        acls: ["api-key:model:*", "api-key:endpoint:*"],
        qps: 5,
        qpm: 100,
        tpm: null
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `XAI_API_ERROR: ${response.status}`);
    }

    const data = await response.json();
    console.log("[XAI_LINK] Key generation successful.");
    return data;

  } catch (error) {
    console.error("[XAI_FATAL_ERROR]", error);
    throw error;
  }
}
