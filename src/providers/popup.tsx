import React, { createContext, useState } from "react";
import Alert from "@/components/widgets/popups/Alert";
import Confirm from "@/components/widgets/popups/Confirm";
import { IPopupConfirm, IPopupContext, IPopupMessage, IPopupState } from "./types";


const initialPopupState: IPopupState = {
    message: null,
    confirm: null
}

export const PopupContext = createContext<IPopupContext>({
    showMessage: () => {},
    showConfirmation: () => {},
    closePopup: () => {},
    confirm: () => {},
    cancel: () => {},
});

export default function PopupProvider({children}: any) {
    const [popupState, setPopupState] = useState<IPopupState>(initialPopupState);

    const showMessage = (payload: IPopupMessage) => {
        setPopupState({ message: payload, confirm: null });
    };

    const showConfirmation = (payload: IPopupConfirm) => {
        setPopupState({ message: null, confirm: payload });
    };

    const closePopup = () => {
        setPopupState(initialPopupState);
    };

    const confirm = () => {
        if (popupState.confirm) {
            popupState.confirm.onConfirm();
            closePopup();
        }
    };

    const cancel = () => {
        if (popupState.confirm) {
            popupState.confirm.onCancel();
            closePopup();
        }
    };
    
    return (
        <PopupContext.Provider value={{
            showMessage,
            showConfirmation,
            closePopup,
            confirm,
            cancel,
        }}>
            { 
                React.Children.map(children, child => { 
                    if(React.isValidElement(child)) {
                        return child
                    }
                }) 
            }
            
            {
                popupState.message && (
                    <Alert 
                        isOpen={true}
                        theme={popupState.message.theme}
                        title={popupState.message.title}
                        message={popupState.message.message}
                        children={popupState.message.children}
                        onClose={closePopup}
                    />
                )
            }

            { 
                popupState.confirm && (
                <Confirm
                    isOpen={true}
                    theme={popupState.confirm.theme}
                    title={popupState.confirm.title}
                    message={popupState.confirm.message}
                    acceptText={popupState.confirm.acceptText}
                    declineText={popupState.confirm.declineText}
                    onAccept={confirm}
                    onDecline={cancel}
                    onClose={() => {}}
                />
            )}
        </PopupContext.Provider>
    )

}