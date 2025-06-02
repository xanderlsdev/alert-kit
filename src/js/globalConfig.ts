// src/js/globalConfig.ts
import type { AlertKitOptions } from "../types";

export interface AlertKitGlobalConfig {
  // Configuraciones de header por defecto
  headerClassName?: string;
  headerTitle?: string;
  showCloseButton?: boolean;
  
  // Configuraciones de botones por defecto
  primaryButtonClassName?: string;
  cancelButtonClassName?: string;
  acceptButtonClassName?: string;
  
  // Configuraciones generales por defecto
  closeOnEsc?: boolean;
  closeOnClickOutside?: boolean;
  isMoveable?: boolean;
  backdropBlur?: boolean;
  
  // Textos por defecto
  defaultTexts?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    question?: string;
    accept?: string;
    cancel?: string;
    ok?: string;
  };
}

class AlertKitConfig {
  private static instance: AlertKitConfig;
  private config: AlertKitGlobalConfig = {};

  constructor() {
    if (AlertKitConfig.instance) {
      return AlertKitConfig.instance;
    }
    AlertKitConfig.instance = this;
  }

  /**
   * Configura los valores por defecto globales
   */
  setDefaults(config: AlertKitGlobalConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Obtiene la configuración actual
   */
  getDefaults(): AlertKitGlobalConfig {
    return this.config;
  }

  /**
   * Resetea la configuración a valores por defecto
   */
  reset() {
    this.config = {};
  }

  /**
   * Merge la configuración global con las opciones específicas
   */
  mergeWithDefaults(options: AlertKitOptions): AlertKitOptions {
    const defaults = this.config;
    
    return {
      // Valores por defecto del sistema
      headerVisible: true,
      backdropBlur: defaults.backdropBlur ?? true,
      showCloseButton: defaults.showCloseButton ?? true,
      closeOnEsc: defaults.closeOnEsc ?? true,
      closeOnClickOutside: defaults.closeOnClickOutside ?? true,
      isMoveable: defaults.isMoveable ?? true,
      autoClose: false,
      autoCloseTime: 3000,
      
      // Valores de configuración global
      headerClassName: defaults.headerClassName,
      headerTitle: defaults.headerTitle,
      
      // Merge con las opciones específicas (las opciones específicas tienen prioridad)
      ...options,
    };
  }

  static getInstance(): AlertKitConfig {
    if (!AlertKitConfig.instance) {
      AlertKitConfig.instance = new AlertKitConfig();
    }
    return AlertKitConfig.instance;
  }
}

export default AlertKitConfig;