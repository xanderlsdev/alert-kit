// src/index.js
import CustomAlert, { AlertType } from './js/customAlert.js';

const customAlert = new CustomAlert();

// if (typeof window !== 'undefined') {
//     window.customAlert = customAlert;
// }

export { CustomAlert, customAlert, AlertType };