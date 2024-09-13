import { CSSTransition } from "react-transition-group";


interface IProp {
    open: boolean
    children: React.ReactNode
}

export default function({ ...props }: IProp) {
    return (
        <CSSTransition
            in={props.open}
            timeout={300}
            classNames="slide"
            unmountOnExit
        >
            <div className="fixed z-50 inset-0 overflow-hidden">{props.children}</div>
        </CSSTransition>
    );
};