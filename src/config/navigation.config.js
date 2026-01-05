/**
 * Navigation Configuration
 * Centralized navigation links used across Navbar and Footer
 */

export const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'Mission', path: '/mission' },
    { name: 'Travel Stories (coming soon)', path: '/travel-stories', disabled: true },
    {
        name: 'Meet the Team',
        path: 'https://drive.google.com/file/d/1ug5goUxfp_4jGwLz0olJFjZboD1mq6VQ/view?usp=sharing',
        isExternal: true
    },
    { name: 'Contact Us', path: '/contact' },
];

/**
 * Footer-specific links (subset of nav links that appear in footer)
 */
export const FOOTER_LINKS = NAV_LINKS;
