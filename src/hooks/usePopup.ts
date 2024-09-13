import { useContext } from "react";
import { PopupContext } from "../providers/popup";


export default function usePopup() {
    const popup = useContext(PopupContext);
    if(popup === null) {
        throw new Error("Implementation error, popup provider required as a parent node")
    }
    return popup
}