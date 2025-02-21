// src/index.js
import AlertKit, { AlertKitType, AlertKitOptions, AlertKitButton } from './js/alertKit.js';

const alertKit = new AlertKit();

// if (typeof window !== 'undefined') {
//     window.customAlert = customAlert;
// }

export { alertKit, AlertKitType, AlertKitOptions, AlertKitButton};