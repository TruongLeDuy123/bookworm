import { Link } from "react-router-dom";

export const Logo = () => {
    return (
        <Link to="/">
            <img
                className="w-40"
                alt="logo"
                src="tailwindcss-logotype-white.svg"
            />
        </Link>
    )
}