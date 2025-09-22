// src/js/customAlert.js

import type { AlertKitOptions } from "../types";
import { AlertKitType } from "./constants";
import AlertKitConfig, { AlertKitGlobalConfig } from "./globalConfig";

interface Icons {
    error: string;
    warning: string;
    info: string;
    question: string;
    loading: string;
    success: string;
}

class AlertKit {

    static instance: AlertKit;
    private config: AlertKitConfig;

    private _name: string = 'Alert Kit';
    private _version: string = '2.2.0';
    private icons: Icons;
    private focusableElements: HTMLElement[] = [];
    private firstFocusableElement: HTMLElement | null = null;
    private lastFocusableElement: HTMLElement | null = null;
    private previousActiveElement: HTMLElement | null = null;
    private closeTimeout: number | null = null;
    private messageElement: HTMLParagraphElement | null = null;
    private overlay: HTMLElement | null = null;
    private alertBox: HTMLElement | null = null;
    private header: HTMLElement | null = null;
    private _message: string = '';
    private settings: AlertKitOptions | null = null;
    private boundEscapeHandler: (e: KeyboardEvent) => void = () => { };
    private boundFocusHandler: (e: KeyboardEvent) => void = () => { };
    private boundFocusInSideHandler: () => void = () => { };
    private boundClickOutSideHandler: (e: MouseEvent) => void = () => { };
    private boundMouseDownHandler: (e: MouseEvent) => void = () => { };
    private boundMouseMoveHandler: (e: MouseEvent) => void = () => { };
    private boundMouseUpHandler: () => void = () => { };

    private isDraggingHeader: boolean = false;
    private offsetX: number = 0;
    private offsetY: number = 0;

    // Método para crear las opciones por defecto
    constructor() {
        this.icons = this.generateIcons();
        this.config = AlertKitConfig.getInstance();

        // Si la instancia ya existe, evitar la creación de una nueva
        if (AlertKit.instance) {
            return AlertKit.instance;
        }

        // Crear un método estático para acceder a la instancia
        AlertKit.instance = this;

        // Crear funciones de tratamiento de eventos
        this.boundEscapeHandler = this.trapEscKey.bind(this);
        this.boundFocusHandler = this.trapFocus.bind(this);
        this.boundFocusInSideHandler = this.trapInSideFocus.bind(this);
        this.boundClickOutSideHandler = this.outSideClick.bind(this);
        this.boundMouseDownHandler = this.handleDragStart.bind(this);
        this.boundMouseMoveHandler = this.handleDragging.bind(this);
        this.boundMouseUpHandler = this.handleDragEnd.bind(this);
    }

    generateIcons() {
        return {
            success: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `,
            warning: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        `,
            error: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        `,
            info: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `,
            question: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 1 1 3.91 2.86c-.66.23-1 1-1 1.64V15"></path>
                <circle cx="12" cy="18" r="0.5"></circle>
            </svg>
        `,
            loading: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-2h2v2h-2zm0-13v9h2v-9h-2z" class="alert-kit-loading-spinner"/>
            </svg>
        `,
        };
    }

    show(options: AlertKitOptions) {
        this._message = options.message || '';
        // Cerrar alerta actual si existe
        if (this.overlay) {
            this.overlay.remove();
        }

        // Agregar las opciones personalizadas al objeto
        this.settings = this.createDataDefaults(options);

        // Obtener el elemento activo del documento
        this.previousActiveElement = this.getActiveElementSafely();

        // Crear el elemento contenedor del modal
        this.overlay = this.createContainer();

        // Se agrega un elemento de trapeo de foco para los modales de tipo loading
        if (this.settings.type === 'loading') {
            // Crear el elemento contenido del modal
            this.alertBox = this.createContentSpinner();

            const spinner = document.createElement('div');
            spinner.className = 'alert-kit-loading-spinner';

            // Agregar el elemento de trapeo de foco
            this.alertBox.appendChild(this.createFocusTrapElement());

            this.alertBox.appendChild(spinner);
            this.alertBox.appendChild(this.createMessageElement());

            // Agregar el contenido del modal al contenedor
            this.overlay.appendChild(this.alertBox);
        } else {
            // Crear el elemento contenido del modal
            this.alertBox = this.createContentBox();

            // Crear la cabecera del modal
            this.header = this.createHeader();
            // Agregar el titulo al header del modal
            this.header.appendChild(this.createTitleHeader());
            // Si esta activo el mostrar el botón de cierre agregarlo al contenido del modal
            if (this.settings.showCloseButton) {
                this.header.appendChild(this.createCloseButtonHeader());
            }

            // Si esta activo el header se puede arrastrar
            if (this.settings.isMoveable) {
                this.header.addEventListener('mousedown', this.boundMouseDownHandler);
                document.addEventListener('mousemove', this.boundMouseMoveHandler);
                document.addEventListener('mouseup', this.boundMouseUpHandler);
            }
            if (!this.settings.headerVisible) {
                this.header.style.display = 'none';
            }
            this.alertBox.appendChild(this.header);

            // Crear el cuerpo del modal
            const body = this.createBody();
            if (!this.settings.bodyInnerHTML) {
                // Agregar el icono al cuerpo del modal
                body.appendChild(this.createIconElement());
                // Agregar el contenido de los titulos al cuerpo del modal
                const bodyContent = document.createElement('div');
                bodyContent.className = 'alert-kit-body-content';
                bodyContent.appendChild(this.createTitleElement());
                bodyContent.appendChild(this.createMessageElement());
                body.appendChild(bodyContent);
            } else {
                body.innerHTML = this.settings.bodyInnerHTML;
            }
            this.alertBox.appendChild(body);

            // Crear el pie de pagina del modal
            const footer = this.creteFooter();
            this.createButtonsElement(footer);
            this.alertBox.appendChild(footer);

            // Agregar el contenido del modal al contenedor
            this.overlay.appendChild(this.alertBox);
        }

        // Si se habilita el cierre por clic fuera, se agrega un evento de click al overlay
        if (this.settings.closeOnClickOutside) {
            this.overlay.style.cursor = 'pointer';
            this.overlay.addEventListener('mousedown', this.boundClickOutSideHandler);
        }

        // Si se habilita el cierre por teclado, se agrega un evento de teclado al documento
        if (this.settings.closeOnEsc) {
            document.addEventListener('keydown', this.boundEscapeHandler);
        }

        // Quitar el scroll del body
        document.body.style.overflow = 'hidden';
        document.body.appendChild(this.overlay);

        // Ejecutar el callback de apertura
        this.settings.onOpen?.();
        this.alertBox.focus();

        // Obtener los elementos focalizables del modal
        this.focusableElements = this.getFocusableElements(this.alertBox) as HTMLElement[];

        // Obtener el primer elemento focalizable del modal
        this.firstFocusableElement = this.focusableElements[0];

        // Obtener el último elemento focalizable del modal
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

        // Agregar el evento de trapeo de foco
        document.addEventListener('keydown', this.boundFocusHandler);

        // Si no es un modal de tipo loading, se enfoca el primer botón si existe o el primer elemento focalizable
        // if (this.settings.type === AlertKitType.loading) {
        //     this.firstFocusableElement.focus();
        // } else {
        //     if (this.settings.buttons && this.settings.buttons.length > 0) {
        //         const focusButton = Array.from(this.alertBox.querySelectorAll("button")).find(element => element.getAttribute('data-primary'));
        //         if (focusButton) {
        //             focusButton.focus();
        //         }
        //     } else {
        //         this.firstFocusableElement.focus();
        //     }
        // }

        requestAnimationFrame(() => {
            if (this.settings!.type === AlertKitType.loading) {
                this.firstFocusableElement?.focus();
            } else {
                const primaryButton = this.alertBox?.querySelector('button[data-primary="true"]') as HTMLButtonElement;
                if (primaryButton) {
                    primaryButton.focus();
                } else if (this.firstFocusableElement) {
                    this.firstFocusableElement.focus();
                }
            }
        });

        // Auto-cerrado si está configurado
        if (this.settings.autoClose) {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
            }
            this.closeTimeout = setTimeout(() => {
                this.close();
            }, this.settings.autoCloseTime);
        }

        window.addEventListener('focus', this.boundFocusInSideHandler);
    }

    mergeDefaultButton(defaultButton: any, customButton?: Partial<any>) {
        if (!customButton) return defaultButton;

        return {
            ...defaultButton,
            text: customButton.text || defaultButton.text,
            html: customButton.html || defaultButton.html,
            class: customButton.class || defaultButton.class,
            className: customButton.className || defaultButton.className,
            style: customButton.style || defaultButton.style,
            onClick: customButton.onClick || defaultButton.onClick
        };
    }

    information(options: AlertKitOptions & {
        primaryButton?: {
            text?: string,
            class?: string[],
            className?: string,
            style?: string,
            html?: string
        }
    }, callback?: () => void) {
        const globalConfig = this.config.getDefaults();

        const defaultButton = {
            text: globalConfig.defaultTexts?.ok || 'Ok',
            onClick: () => callback?.(),
            primary: true,
            type: AlertKitType.info,
        };

        const defaults = {
            headerVisible: true,
            backdropBlur: globalConfig.backdropBlur ?? true,
            headerClassName: globalConfig.headerClassName,
            headerTitle: globalConfig.headerTitle || this.name,
            title: globalConfig.defaultTexts?.info || 'Information',
            message: 'Message',
            type: AlertKitType.info,
            showCloseButton: globalConfig.showCloseButton ?? true,
            closeOnEsc: globalConfig.closeOnEsc ?? true,
            closeOnClickOutside: globalConfig.closeOnClickOutside ?? true,
            isMoveable: globalConfig.isMoveable ?? true,
            buttons: [this.createButtonWithDefaults(defaultButton, options.primaryButton, 'primary')],
            autoClose: false,
            autoCloseTime: 0,
        } as AlertKitOptions;

        this.show({ ...defaults, ...options });
    }

    success(options: AlertKitOptions & {
        primaryButton?: {
            text?: string,
            class?: string[],
            className?: string,
            style?: string,
            html?: string
        }
    }, callback?: () => void) {
        const globalConfig = this.config.getDefaults();

        const defaultButton = {
            text: globalConfig.defaultTexts?.ok || 'Ok',
            onClick: () => callback?.(),
            primary: true,
            type: AlertKitType.success,
        };

        const defaults = {
            headerVisible: true,
            backdropBlur: globalConfig.backdropBlur ?? true,
            headerClassName: globalConfig.headerClassName,
            headerTitle: globalConfig.headerTitle || this.name,
            title: globalConfig.defaultTexts?.success || 'Success',
            message: 'Message',
            type: AlertKitType.success,
            showCloseButton: globalConfig.showCloseButton ?? true,
            closeOnEsc: globalConfig.closeOnEsc ?? true,
            closeOnClickOutside: globalConfig.closeOnClickOutside ?? true,
            isMoveable: globalConfig.isMoveable ?? true,
            buttons: [this.createButtonWithDefaults(defaultButton, options.primaryButton, 'primary')],
            autoClose: false,
            autoCloseTime: 0,
        } as AlertKitOptions;

        this.show({ ...defaults, ...options });
    }

    warning(options: AlertKitOptions & {
        primaryButton?: {
            text?: string,
            class?: string[],
            className?: string,
            style?: string,
            html?: string
        }
    }, callback?: () => void) {
        const globalConfig = this.config.getDefaults();

        const defaultButton = {
            text: globalConfig.defaultTexts?.ok || 'Ok',
            onClick: () => callback?.(),
            primary: true,
            type: AlertKitType.warning,
        };

        const defaults = {
            headerVisible: true,
            backdropBlur: globalConfig.backdropBlur ?? true,
            headerClassName: globalConfig.headerClassName,
            headerTitle: globalConfig.headerTitle || this.name,
            title: globalConfig.defaultTexts?.warning || 'Warning',
            message: 'Message',
            type: AlertKitType.warning,
            showCloseButton: globalConfig.showCloseButton ?? true,
            closeOnEsc: globalConfig.closeOnEsc ?? true,
            closeOnClickOutside: globalConfig.closeOnClickOutside ?? true,
            isMoveable: globalConfig.isMoveable ?? true,
            buttons: [this.createButtonWithDefaults(defaultButton, options.primaryButton, 'primary')],
            autoClose: false,
            autoCloseTime: 0,
        } as AlertKitOptions;

        this.show({ ...defaults, ...options });
    }

    error(options: AlertKitOptions & {
        primaryButton?: {
            text?: string,
            class?: string[],
            className?: string,
            style?: string,
            html?: string
        }
    }, callback?: () => void) {
        const globalConfig = this.config.getDefaults();

        const defaultButton = {
            text: globalConfig.defaultTexts?.ok || 'Ok',
            onClick: () => callback?.(),
            primary: true,
            type: AlertKitType.error,
        };

        const defaults = {
            headerVisible: true,
            backdropBlur: globalConfig.backdropBlur ?? true,
            headerClassName: globalConfig.headerClassName,
            headerTitle: globalConfig.headerTitle || this.name,
            title: globalConfig.defaultTexts?.error || 'Error',
            message: 'Message',
            type: AlertKitType.error,
            showCloseButton: globalConfig.showCloseButton ?? true,
            closeOnEsc: globalConfig.closeOnEsc ?? true,
            closeOnClickOutside: globalConfig.closeOnClickOutside ?? true,
            isMoveable: globalConfig.isMoveable ?? true,
            buttons: [this.createButtonWithDefaults(defaultButton, options.primaryButton, 'primary')],
            autoClose: false,
            autoCloseTime: 0,
        } as AlertKitOptions;

        this.show({ ...defaults, ...options });
    }

    question(options: AlertKitOptions & {
        acceptButton?: {
            text?: string,
            class?: string[],
            className?: string,
            style?: string,
            html?: string
        },
        cancelButton?: {
            text?: string,
            class?: string[],
            className?: string,
            style?: string,
            html?: string
        }
    }): Promise<boolean> {
        return new Promise(resolve => {
            const globalConfig = this.config.getDefaults();

            const defaultAcceptButton = {
                text: globalConfig.defaultTexts?.accept || 'Accept',
                onClick: () => resolve(true),   // 👉 resolvemos promesa
                primary: true,
                type: AlertKitType.question,
            };

            const defaultCancelButton = {
                text: globalConfig.defaultTexts?.cancel || 'Cancel',
                onClick: () => resolve(false),  // 👉 resolvemos promesa
                primary: false,
                type: AlertKitType.error,
            };

            const defaults = {
                headerVisible: true,
                backdropBlur: globalConfig.backdropBlur ?? true,
                headerClassName: globalConfig.headerClassName,
                headerTitle: globalConfig.headerTitle || this.name,
                title: globalConfig.defaultTexts?.question || 'Question',
                message: 'Message',
                type: AlertKitType.question,
                showCloseButton: false,
                closeOnEsc: false,
                closeOnClickOutside: false,
                isMoveable: globalConfig.isMoveable ?? true,
                buttons: [
                    this.createButtonWithDefaults(defaultAcceptButton, options.acceptButton, 'accept'),
                    this.createButtonWithDefaults(defaultCancelButton, options.cancelButton, 'cancel')
                ],
                autoClose: false,
                autoCloseTime: 0,
            } as AlertKitOptions;

            this.show({ ...defaults, ...options });
        });
    }

    loading(options: AlertKitOptions) {
        const defaults = {
            type: AlertKitType.loading,
            isMoveable: false,
            showCloseButton: false,
            closeOnEsc: false,
            closeOnClickOutside: false,
            autoClose: false,
        } as AlertKitOptions;

        this.show({ ...defaults, ...options });
    }

    html(options?: Partial<AlertKitOptions & {
        primaryButton?: {
            text?: string,
            class?: string[],
            className?: string,
            style?: string,
            html?: string
        }
    }>, callback?: () => void) {
        const globalConfig = this.config.getDefaults();

        const defaultButton = {
            text: globalConfig.defaultTexts?.ok || 'Ok',
            onClick: () => callback?.(),
            primary: true,
            type: AlertKitType.info,
        };

        const defaults = {
            headerVisible: true,
            backdropBlur: globalConfig.backdropBlur ?? true,
            headerClassName: globalConfig.headerClassName,
            headerTitle: globalConfig.headerTitle || this.name,
            title: globalConfig.defaultTexts?.success || 'Html',
            type: AlertKitType.info,
            showCloseButton: globalConfig.showCloseButton ?? true,
            closeOnEsc: globalConfig.closeOnEsc ?? true,
            closeOnClickOutside: globalConfig.closeOnClickOutside ?? true,
            isMoveable: globalConfig.isMoveable ?? true,
            buttons: [this.createButtonWithDefaults(defaultButton, options?.primaryButton, 'primary')],
            autoClose: false,
            autoCloseTime: 0,
        } as AlertKitOptions;

        this.show({ ...defaults, ...options });
    }

    close(callback?: () => void) {
        if (!this.overlay && !this.alertBox) return;

        this.alertBox!.classList.add('alert-kit-closing');
        this.alertBox!.addEventListener('animationend', () => {

            document.removeEventListener('keydown', this.boundEscapeHandler);
            document.removeEventListener('keydown', this.boundFocusHandler);
            this.overlay!.removeEventListener('mousedown', this.boundClickOutSideHandler);
            window.removeEventListener('focus', this.boundFocusInSideHandler);

            this.header?.removeEventListener('mousedown', this.boundMouseDownHandler);
            document.removeEventListener('mousemove', this.boundMouseMoveHandler);
            document.removeEventListener('mouseup', this.boundMouseUpHandler);

            // Limpiar timeout si existe
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }

            this.overlay!.remove();
            document.body.style.overflow = 'auto';

            this.overlay = null;
            this.alertBox = null;

            this.isDraggingHeader = false;
            this.offsetX = 0;
            this.offsetY = 0;

            if (this.previousActiveElement) {
                this.previousActiveElement.focus();
            }

            callback?.();
            this.settings?.onClose?.();
        }, { once: true });
    }


    static setGlobalDefaults(config: AlertKitGlobalConfig) {
        const configInstance = AlertKitConfig.getInstance();
        configInstance.setDefaults(config);
    }


    static getGlobalDefaults(): AlertKitGlobalConfig {
        const configInstance = AlertKitConfig.getInstance();
        return configInstance.getDefaults();
    }

    getFocusableElements(container: HTMLElement): Element[] {
        return Array.from(container.querySelectorAll(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(element => {
            // Verificar si es un elemento de formulario
            if (element instanceof HTMLButtonElement
                || element instanceof HTMLInputElement
                || element instanceof HTMLSelectElement
                || element instanceof HTMLTextAreaElement) {
                // Verificar si el elemento está habilitado y visible
                return !element.disabled && element.offsetParent !== null;
            }

            // Para los demás elementos (enlace y div), solo verificamos si son visibles
            return element instanceof HTMLAnchorElement || element instanceof HTMLDivElement
                ? element.offsetParent !== null
                : false;
        });
    }

    createDataDefaults(options: AlertKitOptions): AlertKitOptions {
        const globalDefaults = this.config.mergeWithDefaults(options);

        const systemDefaults = {
            headerVisible: true,
            backdropBlur: true,
            headerTitle: this.name,
            title: 'Subtitle',
            message: 'Message',
            type: AlertKitType.info,
            showCloseButton: true,
            closeOnEsc: true,
            closeOnClickOutside: true,
            isMoveable: true,
            buttons: [{
                text: 'Accept',
                onClick: () => { },
                primary: true,
                type: 'info',
            }],
            autoClose: false,
            autoCloseTime: 3000,
        } as AlertKitOptions;

        return { ...systemDefaults, ...globalDefaults };
    }

    private createButtonWithDefaults(
        defaultButton: any,
        customButton?: any,
        buttonType: 'primary' | 'cancel' | 'accept' = 'primary'
    ) {
        const globalConfig = this.config.getDefaults();
        let defaultClassName = '';

        switch (buttonType) {
            case 'primary':
                defaultClassName = globalConfig.primaryButtonClassName || '';
                break;
            case 'cancel':
                defaultClassName = globalConfig.cancelButtonClassName || '';
                break;
            case 'accept':
                defaultClassName = globalConfig.acceptButtonClassName || '';
                break;
        }

        if (!customButton) {
            return {
                ...defaultButton,
                className: defaultClassName || defaultButton.className
            };
        }

        return {
            ...defaultButton,
            text: customButton.text || defaultButton.text,
            html: customButton.html || defaultButton.html,
            class: customButton.class || defaultButton.class,
            className: customButton.className || defaultClassName || defaultButton.className,
            style: customButton.style || defaultButton.style,
            onClick: customButton.onClick || defaultButton.onClick
        };
    }

    createContainer() {
        const container = document.createElement('div');

        if (this.settings!.overlayClass) {
            this.settings!.overlayClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    container.classList.add(className.trim());
                }
            });
        } else if (this.settings!.overlayClassName) {
            container.className = this.settings!.overlayClassName;
        } else if (this.settings!.overlayStyle) {
            container.setAttribute('style', this.settings!.overlayStyle);
        } else {
            container.className = 'alert-kit-overlay';

        }

        if (this.settings!.backdropBlur) {
            container.classList.add('alert-kit-backdrop-blur');
        }

        return container;
    }

    createContentBox() {
        const content = document.createElement('div');

        if (this.settings!.contentClass) {
            this.settings!.contentClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    content.classList.add(className.trim());
                }
            });
        } else if (this.settings!.contentClassName) {
            content.className = this.settings!.contentClassName;
        } else if (this.settings!.contentStyle) {
            content.setAttribute('style', this.settings!.contentStyle);
        } else {
            content.className = 'alert-kit-content';
        }

        content.setAttribute('tabindex', '-1');
        content.setAttribute('role', 'dialog');
        content.setAttribute('aria-modal', 'true');
        content.setAttribute('aria-labelledby', 'alertTitle');
        content.setAttribute('aria-describedby', 'alertMessage');
        return content;
    }

    createContentSpinner() {
        const content = document.createElement('div');
        content.className = 'alert-kit-loading-container';

        if (this.settings!.contentClass) {
            this.settings!.contentClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    content.classList.add(className.trim());
                }
            });
        }

        if (this.settings!.contentStyle) {
            content.setAttribute('style', this.settings!.contentStyle);
        }

        content.setAttribute('tabindex', '-1');
        content.setAttribute('role', 'dialog');
        content.setAttribute('aria-modal', 'true');
        content.setAttribute('aria-labelledby', 'alertTitle');
        content.setAttribute('aria-describedby', 'alertMessage');
        return content;
    }

    // Obtener elemento activo de manera más segura
    private getActiveElementSafely(): HTMLElement | null {
        try {
            let activeElement = document.activeElement as HTMLElement;

            // Si el elemento activo está dentro de un shadow DOM
            while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
                activeElement = activeElement.shadowRoot.activeElement as HTMLElement;
            }

            // Si no hay elemento activo válido, usar body como fallback
            return activeElement && activeElement !== document.body ? activeElement : null;
        } catch (error) {
            return null;
        }
    }

    createHeader(): HTMLDivElement {
        const elementHeader = document.createElement('div');

        if (this.settings!.headerClass) {
            this.settings!.headerClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    elementHeader.classList.add(className.trim());
                }
            });
        } else if (this.settings!.headerClassName) {
            elementHeader.className = this.settings!.headerClassName;
        } else if (this.settings!.headerStyle) {
            elementHeader.setAttribute('style', this.settings!.headerStyle);
        } else {
            elementHeader.className = 'alert-kit-header';

            if (this.settings!.isMoveable) {
                elementHeader.classList.add('alert-kit-cursor-move');
            }

        }
        return elementHeader;
    }

    createTitleHeader(): HTMLParagraphElement {
        const title = document.createElement('p');

        if (this.settings!.headerTitleClass) {
            this.settings!.headerTitleClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    title.classList.add(className.trim());
                }
            });
        } else if (this.settings!.headerTitleClassName) {
            title.className = this.settings!.headerTitleClassName;
        } else if (this.settings!.headerTitleStyle) {
            title.setAttribute('style', this.settings!.headerTitleStyle);
        } else {
            title.className = 'alert-kit-header-p';
        }

        if (this.settings!.headerTitleInnerHTML) {
            title.innerHTML = this.settings!.headerTitleInnerHTML;
        } else {
            title.textContent = this.settings!.headerTitle ?? "";
        }

        return title;
    }

    createCloseButtonHeader(): HTMLButtonElement {
        const closeButton = document.createElement('button');

        if (this.settings!.headerCloseButtonClass) {
            this.settings!.headerCloseButtonClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    closeButton.classList.add(className.trim());
                }
            });
        } else if (this.settings!.headerCloseButtonStyle) {
            closeButton.setAttribute('style', this.settings!.headerCloseButtonStyle);
        } else {
            closeButton.className = 'alert-kit-close';
        }

        closeButton.setAttribute('aria-label', 'Close alert');

        if (this.settings!.headerCloseButtonInnerHTML) {
            closeButton.innerHTML = this.settings!.headerCloseButtonInnerHTML;
        } else {
            closeButton.innerHTML = '×';
        }

        closeButton.addEventListener('click', () => this.close());
        return closeButton;
    }

    createBody(): HTMLDivElement {
        const body = document.createElement('div');

        if (this.settings!.bodyClass) {
            this.settings!.bodyClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    body.classList.add(className.trim());
                }
            });
        } else if (this.settings!.bodyClassName) {
            body.className = this.settings!.bodyClassName;
        } else if (this.settings!.bodyStyle) {
            body.setAttribute('style', this.settings!.bodyStyle);
        } else {
            body.className = 'alert-kit-body';
        }

        if (this.settings!.bodyInnerHTML) {
            body.innerHTML = this.settings!.bodyInnerHTML;
        }

        return body;
    }

    creteFooter(): HTMLDivElement {
        const footer = document.createElement('div');

        if (this.settings!.footerClass) {
            this.settings!.footerClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    footer.classList.add(className.trim());
                }
            });
        } else if (this.settings!.footerClassName) {
            footer.className = this.settings!.footerClassName;
        }
        else if (this.settings!.footerStyle) {
            footer.setAttribute('style', this.settings!.footerStyle);
        } else {
            footer.className = 'alert-kit-footer';
        }

        if (this.settings!.footerInnerHTML) {
            footer.innerHTML = this.settings!.footerInnerHTML;
        }

        return footer;
    }

    createIconElement(): HTMLDivElement {
        const iconContainer = document.createElement('div');

        if (this.settings!.bodyIconClass) {
            this.settings!.bodyIconClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    iconContainer.classList.add(className.trim());
                }
            });
        } else if (this.settings!.bodyIconStyle) {
            iconContainer.setAttribute('style', this.settings!.bodyIconStyle);
        } else {
            iconContainer.className = `alert-kit-icon ${this.settings!.type}`;

        }

        if (this.settings!.bodyIconInnerHTML) {
            iconContainer.innerHTML = this.settings!.bodyIconInnerHTML;
        } else {
            iconContainer.innerHTML = this.icons[this.settings!.type!];
            const svg = iconContainer.querySelector('svg');
            if (svg) {
                svg.style.width = '50px';
                svg.style.height = '50px';
            }
        }

        return iconContainer;
    }

    createTitleElement(): HTMLHeadingElement {
        const titleElement = document.createElement('h2');

        if (this.settings!.bodyTitleClass) {
            this.settings!.bodyTitleClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    titleElement.classList.add(className.trim());
                }
            });
        } else if (this.settings!.bodyTitleClassName) {
            titleElement.className = this.settings!.bodyTitleClassName;
        } else if (this.settings!.bodyTitleStyle) {
            titleElement.setAttribute('style', this.settings!.bodyTitleStyle);
        } else {
            titleElement.className = 'alert-kit-body-content-h2';
        }

        if (this.settings!.bodyTitleInnerHTML) {
            titleElement.innerHTML = this.settings!.bodyTitleInnerHTML;
        } else {
            titleElement.textContent = this.settings!.title ?? "";
        }

        return titleElement;
    }

    createMessageElement(): HTMLParagraphElement {
        this.messageElement = document.createElement('p') as HTMLParagraphElement;

        if (this.settings!.bodyMessageClass) {
            this.settings!.bodyMessageClass.forEach((className) => {
                if (className.trim().length !== 0) {
                    this.messageElement!.classList.add(className.trim());
                }
            });
        } else if (this.settings!.bodyMessageClassName) {
            this.messageElement.className = this.settings!.bodyMessageClassName;
        } else if (this.settings!.bodyMessageStyle) {
            this.messageElement.setAttribute('style', this.settings!.bodyMessageStyle);
        } else {
            this.messageElement.className = 'alert-kit-body-content-p';
        }

        if (this.settings!.bodyMessageInnerHTML) {
            this.messageElement.innerHTML = this.settings!.bodyMessageInnerHTML;
        } else {
            this.messageElement.textContent = this.message;
        }

        return this.messageElement;
    }

    createButtonsElement(footer: HTMLDivElement) {
        this.settings!.buttons?.forEach(buttonConfig => {
            const button = document.createElement('button');

            // Permite que el contenido del botón sea HTML o texto plano
            if (buttonConfig.html) {
                button.innerHTML = buttonConfig.html!; // Permite contenido HTML
            } else {
                button.textContent = buttonConfig.text!; // Usa texto si no hay HTML
            }

            // Asigna la clase del botón
            if (buttonConfig.class) {
                buttonConfig.class.forEach(className => {
                    if (className.trim().length !== 0) {
                        button.classList.add(className.trim());
                    }
                });
            } else if (buttonConfig.className) {
                button.className = buttonConfig.className;
            } else if (buttonConfig.style) {
                button.setAttribute('style', buttonConfig.style);
            } else {
                button.className = `alert-kit-button ${buttonConfig.type}`;
            }

            if (buttonConfig.primary) {
                button.setAttribute('data-primary', 'true');
            } else {
                button.removeAttribute('data-primary');
            }

            // Agrega el evento de clic, cerrando el overlay cuando se presiona el botón
            button.addEventListener('click', () => {
                buttonConfig.onClick?.();
                this.close(() => {
                });
            });

            // Añade el botón al contenedor de botones
            footer.appendChild(button);
        });
    }

    createFocusTrapElement() {
        const focusTrap = document.createElement('div');
        focusTrap.setAttribute('tabindex', '0');
        focusTrap.style.opacity = '0';
        focusTrap.style.position = 'absolute';
        focusTrap.style.top = '0';
        focusTrap.style.left = '0';
        focusTrap.style.width = '1px';
        focusTrap.style.height = '1px';
        return focusTrap;
    }

    trapFocus(e: KeyboardEvent) {
        if (!this.focusableElements.length) return;

        const isTabPressed = e.key === 'Tab';
        if (!isTabPressed) return;

        if (e.shiftKey) {
            if (this.getActiveElementSafely() === this.firstFocusableElement) {
                this.lastFocusableElement?.focus();
                e.preventDefault();
            }
        } else {
            if (this.getActiveElementSafely() === this.lastFocusableElement) {
                this.firstFocusableElement?.focus();
                e.preventDefault();
            }
        }
    }

    trapEscKey(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    trapInSideFocus() {
        if (!this.overlay) return;

        requestAnimationFrame(() => {
            if (this.settings!.type === AlertKitType.loading) {
                this.firstFocusableElement?.focus();
            } else {
                const primaryButton = this.alertBox?.querySelector('button[data-primary="true"]') as HTMLButtonElement;
                if (primaryButton) {
                    primaryButton.focus();
                } else if (this.firstFocusableElement) {
                    this.firstFocusableElement.focus();
                }
            }
        });

        // if (this.settings!.type === AlertKitType.loading) {
        //     this.firstFocusableElement?.focus();
        // } else {
        //     this.alertBox!.focus();
        //     if (this.settings!.buttons && this.settings!.buttons.length > 0) {
        //         const focusButton = Array.from(this.alertBox!.querySelectorAll("button")).find(element => element.getAttribute('data-primary'));
        //         if (focusButton) {
        //             focusButton.focus();
        //         }
        //     } else {
        //         this.firstFocusableElement?.focus();
        //     }
        // }
    }

    outSideClick(e: MouseEvent) {
        if (e.target === this.overlay) {
            e.preventDefault();
            this.close();
        }
    }

    handleDragStart(e: MouseEvent) {
        this.isDraggingHeader = true;
        this.offsetX = e.clientX - this.alertBox!.offsetLeft;
        this.offsetY = e.clientY - this.alertBox!.offsetTop;
    }

    handleDragging(e: MouseEvent) {
        if (!this.isDraggingHeader) return;

        this.alertBox!.style.left = `${e.clientX - this.offsetX}px`;
        this.alertBox!.style.top = `${e.clientY - this.offsetY}px`;
    }

    handleDragEnd() {
        this.isDraggingHeader = false;
    }

    static getInstance() {
        return AlertKit.instance;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
        this.messageElement!.textContent = value;
    }

    get name(): string {
        return this._name;
    }

    get version(): string {
        return this._version;
    }
}

export default AlertKit;
