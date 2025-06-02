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
    overlayClassName?: string;

    contentClass?: string[];
    contentClassName?: string;
    contentStyle?: string;

    headerVisible?: boolean;
    headerClass?: string[];
    headerStyle?: string;
    headerClassName?: string;

    headerTitleClass?: string[];
    headerTitleStyle?: string;
    headerTitleClassName?: string;
    headerTitleInnerHTML?: string;

    headerCloseButtonClass?: string[];
    headerCloseButtonStyle?: string;
    headerCloseButtonClassName?: string;
    headerCloseButtonInnerHTML?: string;

    bodyClass?: string[];
    bodyStyle?: string;
    bodyClassName?: string;
    bodyInnerHTML?: string;

    bodyIconClass?: string[];
    bodyIconStyle?: string;
    bodyIconInnerHTML?: string;

    bodyTitleClass?: string[];
    bodyTitleStyle?: string;
    bodyTitleClassName?: string;
    bodyTitleInnerHTML?: string;

    bodyMessageClass?: string[];
    bodyMessageStyle?: string;
    bodyMessageClassName?: string;
    bodyMessageInnerHTML?: string;

    footerClass?: string[];
    footerStyle?: string;
    footerClassName?: string;
    footerInnerHTML?: string;

    headerTitle?: string;
    title?: string;
    message?: string;
    type?: AlertKitType;
    backdropBlur?: boolean;
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