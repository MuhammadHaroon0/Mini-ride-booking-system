import { useNavigate } from "react-router-dom";
import logo from "/favicon.png"

const Logo = () => {
    const navigate = useNavigate()
    return (
        <img
            onClick={() => navigate('/')}
            alt="Logo"
            src={logo}
            className="ml-1 block object-contain cursor-pointer xs:h-7 w-[50px]"
        />
    )
}

export default Logo;