export interface IPopupMessage {
    message:    string
    theme:      "info" | "success" | "danger" | "warning"
    title:      string
    children?:  React.ReactNode
}

export interface IPopupConfirm {
    theme:          "info" | "success" | "danger" | "warning"
    title:          string
    message:        string;
    acceptText?:     string
    declineText?:    string
    onConfirm:      () => void;
    onCancel:       () => void;
}

export interface IPopupState { 
    message: IPopupMessage | null
    confirm: IPopupConfirm | null
}

export interface IPopupContext { 
    showMessage:        (payload: IPopupMessage) => void;
    showConfirmation:   (payload: IPopupConfirm) => void;
    closePopup:         () => void;
    confirm:            () => void;
    cancel:             () => void;
}