import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";


interface IProps {
    children: React.ReactNode
}

export default function({...props}: IProps) {
    const navigate = useNavigate();
    const auth = useSnapshot(authStore);

    useEffect(() => {
        if(auth.user == null) {
            var temp = auth.getUser();
        }
        if(auth.user && auth.user.status === "NEEDPASSWORDCHANGE") {
            navigate("/change-default", {replace: true});  
        }

        if(auth.getToken() == null) {
            navigate("/login", {replace: true});
        }

    }, [auth])

    return (
        <div>{props.children}</div>
    )
}