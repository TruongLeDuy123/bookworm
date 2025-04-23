import { useState } from "react"
import Nav from "./Navbar.jsx"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(prev => !prev)
    }

    return (
        <header className="flex items-center justify-between px-4 md:px-10 h-20 relative text-white">
            <Nav isOpen={isOpen} toggleMenu={toggleMenu} />
        </header>
    )
}

export default Navbar