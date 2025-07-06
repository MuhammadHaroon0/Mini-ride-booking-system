
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Navbar: React.FC = ({ }) => {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (!user)
            navigate("/auth/login")

    }, [])
    return (
        <div className="w-full mx-auto bg-white z-10 sm:shadow-sm px-4 shadow-md 
">
            <div className="
            py-2
            "
            >
                <div className="hidden sm:flex w-full flex-row items-center gap-3 ">
                    <Logo currentUser={user} />
                    <UserMenu currentUser={user} />
                </div>
                <div className="sm:hidden flex flex-col gap-3">
                    <div className="flex flex-row items-center justify-between w-full">
                        <Logo currentUser={user} />
                        <div className="flex items-center">

                            <UserMenu currentUser={user} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Navbar;
