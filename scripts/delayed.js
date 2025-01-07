// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
document.dispatchEvent(new Event('delayed-phase'));
Window.DELAYED_PHASE = true;

// add more delayed functionality here
