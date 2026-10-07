/**
 * Global Logout Script
 * 
 * This script provides a consistent way to log out from any portal in the application.
 * It clears relevant session data and redirects to the login page.
 */

// Create a namespace for the logout functionality
var ProjectManager = ProjectManager || {};

// Logout module
ProjectManager.Logout = (function() {
    
    /**
     * Perform logout actions
     * - Clear authentication data
     * - Clear user session
     * - Redirect to login page
     */
    function logout() {
        console.log('Logging out...');
        
        try {
            // Clear authentication data
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('authToken');
            localStorage.removeItem('lastLogin');
            
            // Clear current session data
            sessionStorage.clear();
            
            // Get the current portal to determine where to redirect
            const currentPortal = getCurrentPortal();
            
            // Show logout message
            showToast('You have been logged out successfully.', 'success');
            
            // Redirect to the appropriate login page
            window.location.href = '../login.html?portal=' + currentPortal;
        } catch (error) {
            console.error('Error during logout:', error);
            showToast('There was a problem logging out. Please try again.', 'error');
        }
    }
    
    /**
     * Determine which portal we're in based on the URL path
     */
    function getCurrentPortal() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/admin/')) {
            return 'admin';
        } else if (path.includes('/team-leader/')) {
            return 'team-leader';
        } else if (path.includes('/user/')) {
            return 'user';
        }
        return 'default'; // Fallback
    }
    
    // Public API
    return {
        logout: logout
    };
    
})();
