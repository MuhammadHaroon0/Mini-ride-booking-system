
import { Link } from "react-router-dom";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavbarProps {
    currentUser: Record<string, any> | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
    // console.log(currentUser);

    return (
        <div className="w-full mx-auto bg-white z-10 sm:shadow-sm px-4 shadow-md 
">
            <div className="
            py-2
            "
            >
                <div className="hidden sm:flex w-full flex-row items-center gap-3 ">
                    <Logo />
                    <UserMenu currentUser={currentUser} />
                </div>
                <div className="sm:hidden flex flex-col gap-3">
                    <div className="flex flex-row items-center justify-between w-full">
                        <Logo />
                        <div className="flex items-center">
                            <div className="bg-theme1 text-white rounded-3xl ">
                                <Link to={'/'} >
                                    <div className="lg:hidden xs:block text-sm font-semibold py-3 px-4 rounded-full whitespace-nowrap hover:bg-green-500 transition cursor-pointer">
                                        Place Ad
                                    </div>
                                </Link>
                            </div>
                            <UserMenu currentUser={currentUser} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Navbar;
