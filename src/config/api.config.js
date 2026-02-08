/**
 * API Configuration
 * Centralized API endpoints and base URL configuration
 */

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.seekkrr.com',
    ENDPOINTS: {
        QUERIES: '/api/queries',
    },
};

/**
 * Helper to build full API URL
 * @param {string} endpoint - Endpoint key from ENDPOINTS
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint] || endpoint}`;
};
