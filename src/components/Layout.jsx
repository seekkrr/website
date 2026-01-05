import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-0"> {/* Removed pt-16 (top margin for fixed nav) because Hero handles full screen. Added p-16 for global padding request. But Hero is supposed to be full screen? "background on the top is a full size video". If I add padding to the CONTAINER, the video will be inside the padding. This contradicts "full size". 
    Re-reading: "add a padding of 64 pixels on all sides on the page". 
    If this is a "frame" design, `body` padding or `div` wrapper padding works. 
    However, if the video needs to bleed to the edge, then padding should NOT be on the container of the video. 
    But the image often shows a "card" or "framed" look in modern web design. 
    Let's assume "on the page" means the whole UI is inset. 
    I will add `p-16` to a wrapper div in Layout that contains EVERYTHING including Navbar?
    Actually, Navbar is "Fixed". If I pad the page, Fixed navbar usually respects viewport. 
    Let's try putting the padding on the outer `div`.
    */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
