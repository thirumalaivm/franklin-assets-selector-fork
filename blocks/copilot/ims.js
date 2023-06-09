var validity = 0;

export default async function getAccessToken(cfg = {}) {
  if (!cfg.token) {
	var url = `https://sparkling-moon-cf29.satyadeep.workers.dev/?code=${cfg.authcode}&shared-secret=franklincopilot`;
	
	// call IMS API via CF worker
	
	const response = await fetch(url);
	if (response.ok) {
	  const data = await response.json();
	  console.log(`[ims]Here's the IMS token API Response: ${JSON.stringify(data, null, 2)}`);
	  cfg.token = data.access_token;
	  validity = Date.now() + data.expires_in - 600000;
	}
  }
  return cfg.token;
}

export { getAccessToken };