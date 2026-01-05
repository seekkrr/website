import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">SeekKrr</h3>
                    <p className="text-gray-400 text-sm">
                        Take on Quests to the best kept Offbeat Experiences.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/mission" className="hover:text-white">Mission</Link></li>
                        <li><span className="text-gray-500 cursor-default">Travel Stories (coming soon)</span></li>
                        <li><Link to="/meet-the-team" className="hover:text-white">Meet the Team</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    {/* More placeholder links */}
                </div>
                <div>
                    <p className="text-sm text-gray-500 mt-auto">
                        © {new Date().getFullYear()} SeekKrr Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
