import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import seekkrrLogo from '../assets/mission/seekkrr_logo.svg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isMissionPage = location.pathname === '/mission';
    const isContactPage = location.pathname === '/contact';

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Mission', path: '/mission' },
        { name: 'Travel Stories (coming soon)', path: '/travel-stories', disabled: true },
        { name: 'Meet the Team', path: '/meet-the-team' },
        { name: 'Contact Us', path: '/contact' },
    ];

    // Determine text color:
    // Scrolled -> Black (because background is light #EBEAEC)
    // Mission Page -> Black
    // Home Page (Unscrolled) -> White
    const isDarkText = isScrolled || isMissionPage || isContactPage;

    const textColorClass = isDarkText ? 'text-black hover:text-gray-700' : 'text-[#F6F4F3] hover:text-white';
    const mobileButtonClass = isDarkText ? 'text-black hover:text-gray-700' : 'text-[#F6F4F3] hover:text-white';
    const navbarBgClass = isScrolled ? 'bg-[#EBEAEC] shadow-sm' : 'bg-transparent';

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navbarBgClass}`}>
            <div className="w-full px-4 sm:px-6 lg:px-12">
                <div className="flex justify-between items-center h-20">
                    {/* Logo - Visible on Mission Page or when Scrolled (optional preference, but good for UX) */}
                    <div className="flex-shrink-0 flex items-center">
                        {(isMissionPage || isContactPage || isScrolled) && (
                            <Link to="/">
                                <img src={seekkrrLogo} alt="SeekKrr" className="h-10 w-auto" />
                            </Link>
                        )}
                    </div>

                    {/* Desktop Menu - Expanded */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            link.disabled ? (
                                <span
                                    key={link.name}
                                    className={`${textColorClass} font-inter font-medium text-base opacity-70 cursor-default`}
                                >
                                    {link.name}
                                </span>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`${textColorClass} font-inter font-medium text-base transition-colors`}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Mobile Hamburger - Hidden on Desktop */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={toggleMenu}
                            className={`inline-flex items-center justify-center p-2 rounded-md ${mobileButtonClass} focus:outline-none`}
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile/Expanded Menu Overlay */}
            {isOpen && (
                <div className="absolute top-16 right-0 w-64 bg-white/90 backdrop-blur-md shadow-lg rounded-bl-lg border-l border-b border-gray-200 transition-all duration-300 ease-in-out md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-end pr-6">
                        {navLinks.map((link) => (
                            link.disabled ? (
                                <span
                                    key={link.name}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 text-right cursor-default"
                                >
                                    {link.name}
                                </span>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-right"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
