/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { getAccessToken } from './ims.js';

const BASE_URL = 'https://firefall-stage.adobe.io';

const MAX_RETRIES = 3;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function callAPI(endpoint, body, cfg) {
  let retries = 0;
  const headers = {
    'Content-Type': 'application/json',
    'x-gw-ims-org-id': '1234@AdobeOrg',
    'x-api-key': 'franklin_firefall_service',
    Authorization: `Bearer ${await getAccessToken(cfg)}`,
  };

  const requestOptions = {
    method: 'POST',
    headers,
  };

  requestOptions.body = JSON.stringify(body);

  while (retries < MAX_RETRIES) {
    const response = await fetch(BASE_URL + endpoint, requestOptions);
    if (response.ok) {
      const data = await response.json();
      console.log(`Here's the Firefall API Response: ${JSON.stringify(data, null, 2)}`);
      return data;
    }
    retries += 1;
    const delay = 1000;
    console.log(`Attempt ${retries}/${MAX_RETRIES} Firefall API Retrying in ${delay}ms...`);
    await wait(delay);
  }
  throw new Error('Firefall API Max retries reached. Giving up!!');
}

export { callAPI };
