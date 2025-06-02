// src/index.js
import { injectAlertKitStyles } from './js/injectStyles.js';
import { AlertKitType } from './js/constants.js';
import AlertKit from './js/alertKit.js';

injectAlertKitStyles();

const alertKit = new AlertKit();

export { alertKit, AlertKitType };

export default AlertKit;