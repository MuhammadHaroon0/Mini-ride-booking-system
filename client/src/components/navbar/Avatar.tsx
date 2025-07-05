
interface AvatarProps {
    src: string
}
const Avatar: React.FC<AvatarProps> = ({
    src
}) => {
    return (
        <img
            className="rounded-full"
            height={30}
            width={30}
            alt="Avatar"
            src={src || "/default.png"}
        />
    );
}

export default Avatar;