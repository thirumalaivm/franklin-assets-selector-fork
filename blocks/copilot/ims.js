export default async function getAccessToken(cfg = {}) {
  if (!cfg.token) {
    const url = `https://sparkling-moon-cf29.satyadeep.workers.dev/?code=${cfg.authcode}&shared-secret=blahblah`;
    // call IMS API via CF worker
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // eslint-disable-next-line no-console
      // console.log(`[ims]Here's the IMS token API Response: ${JSON.stringify(data, null, 2)}`);
      cfg.token = data.access_token;
    }
  }
  return cfg.token;
}

export { getAccessToken };
