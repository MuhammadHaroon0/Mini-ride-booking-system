import { useNavigate } from "react-router-dom";
import logo from "/favicon.png"
interface LogoProps {
    currentUser: Record<string, any> | null;
}
const Logo: React.FC<LogoProps> = ({ currentUser }) => {
    const navigate = useNavigate()
    const handleNavigate = () => {
        if (currentUser) {
            if (currentUser.role === "driver")
                navigate('/ride-requests')
            else
                navigate('/request-a-ride')

        }
    }
    return (
        <img
            onClick={handleNavigate}
            alt="Logo"
            src={logo}
            className="ml-1 block object-contain cursor-pointer xs:h-7 w-[50px]"
        />
    )
}

export default Logo;