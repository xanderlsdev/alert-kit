import { AlertKitType } from "../js/constants";

export type AlertKitButton = {
    text?: string;
    html?: string;
    onClick: () => void;
    primary?: boolean;
    type?: 'error' | 'warning' | 'info' | 'question' | 'success';
    class?: string[];
    className?: string;
    style?: string;
};

export type AlertKitOptions = {
    overlayClass?: string[];
    overlayStyle?: string;
    backdropBlur?: boolean;

    contentClass?: string[];
    contentStyle?: string;

    headerVisible?: boolean;
    headerClass?: string[];
    headerStyle?: string;

    headerTitleClass?: string[];
    headerTitleStyle?: string;
    headerTitleInnerHTML?: string;

    headerCloseButtonClass?: string[];
    headerCloseButtonStyle?: string;
    headerCloseButtonInnerHTML?: string;

    bodyClass?: string[];
    bodyStyle?: string;
    bodyInnerHTML?: string;

    bodyIconClass?: string[];
    bodyIconStyle?: string;
    bodyIconInnerHTML?: string;

    bodyTitleClass?: string[];
    bodyTitleStyle?: string;
    bodyTitleInnerHTML?: string;

    bodyMessageClass?: string[];
    bodyMessageStyle?: string;
    bodyMessageInnerHTML?: string;

    footerClass?: string[];
    footerStyle?: string;
    footerInnerHTML?: string;

    headerTitle?: string;
    title?: string;
    message?: string;
    type?: AlertKitType;
    showCloseButton?: boolean;
    closeOnEsc?: boolean;
    closeOnClickOutside?: boolean;
    isMoveable?: boolean;
    buttons?: AlertKitButton[];
    autoClose?: boolean;
    autoCloseTime?: number;
    onOpen?: () => void;
    onClose?: () => void;
}