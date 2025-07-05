

import { AiOutlineMenu } from "react-icons/ai";

import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import Button from "../Button";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/authStore";

interface UserMenuProps {
    currentUser: Record<string, any> | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {

    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuthStore()

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Logged out successfully")
            navigate('/')
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className="relative w-full">
            <div className="flex flex-row w-full items-center justify-between ">
                <div className="flex ">

                    {currentUser && <NavItem label={"Ride History"} link={'/ride-history'} />}
                    <NavItem label={"Sell"} link={'/'} />

                    <NavItem label={"Find a dealership"} link={'/'} />
                </div>
                <div className="flex gap-2 items-center">

                    {currentUser && <div className="bg-theme1 text-white rounded-3xl ">
                        <Link to={'/request-a-ride'}>
                            <Button label="Request a ride"
                                className="rounded-full" />
                        </Link>
                    </div>}
                    <div onClick={toggleOpen} className="sm:p-4 xs:p-3 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                        <AiOutlineMenu />
                        <div className="hidden md:block">
                            <Avatar src={currentUser?.image} />

                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-10 rounded-xl shadow-md w-[40vw] lg:w-1/6 md:w-1/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem
                                    onClick={() => navigate("/request-a-ride")}
                                    label="Request a ride"
                                />
                                <MenuItem
                                    onClick={() => navigate("/ride-history")}
                                    label="Ride History"
                                />

                                <MenuItem
                                    onClick={handleLogout}
                                    label="Logout"
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={() => navigate('/auth/login')}
                                    label="Login"
                                />
                                <MenuItem
                                    onClick={() => navigate('/auth/signup')}
                                    label="Sign up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

interface NavItemProps {
    label: string;
    link: string
}

const NavItem: React.FC<NavItemProps> = ({ label, link }) => {
    return (
        <Link to={link}>
            <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                {label}
            </div>
        </Link>
    )
}

export default UserMenu;