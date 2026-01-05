import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS, APP_CONFIG } from '../config';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">{APP_CONFIG.NAME}</h3>
                    <p className="text-gray-400 text-sm">
                        {APP_CONFIG.TAGLINE}
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        {NAV_LINKS.map((link) => (
                            <li key={link.name}>
                                {link.disabled ? (
                                    <span className="text-gray-500 cursor-default">{link.name}</span>
                                ) : (
                                    <Link to={link.path} className="hover:text-white">{link.name}</Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {/* More placeholder links */}
                </div>
                <div>
                    <p className="text-sm text-gray-500 mt-auto">
                        © {new Date().getFullYear()} {APP_CONFIG.COMPANY} All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

