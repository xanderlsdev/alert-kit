// src/index.js
import AlertKit, { AlertType } from './js/alertKit.js';

const alertKit = new AlertKit();

// if (typeof window !== 'undefined') {
//     window.customAlert = customAlert;
// }

export { AlertKit, alertKit, AlertType };