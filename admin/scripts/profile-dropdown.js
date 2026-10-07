/**
 * Profile Dropdown Menu Handler
 * 
 * This script initializes the profile dropdown menu functionality
 * for admin pages that use the dropdown menu instead of static profile display.
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Profile Dropdown module
ProjectManager.ProfileDropdown = (function() {
    /**
     * Initialize the profile dropdown menu
     */
    function init() {
        // Initialize Bootstrap dropdowns manually
        initBootstrapDropdowns();
        
        // Initialize logout button functionality
        initLogoutButton();
    }
    
    /**
     * Initialize Bootstrap dropdowns manually
     */
    function initBootstrapDropdowns() {
        // Get all dropdown toggle elements
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        // Initialize each dropdown with Bootstrap's Dropdown API
        dropdownToggles.forEach(function(toggle) {
            new bootstrap.Dropdown(toggle);
        });
    }
    
    /**
     * Initialize logout button functionality
     */
    function initLogoutButton() {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Call the logout function if available
                if (typeof ProjectManager.Logout !== 'undefined' && 
                    typeof ProjectManager.Logout.performLogout === 'function') {
                    ProjectManager.Logout.performLogout();
                } else {
                    // Fallback: redirect to login page
                    window.location.href = '../index.html';
                }
            });
        }
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize the profile dropdown when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize after a short delay to ensure other scripts have loaded
    setTimeout(function() {
        ProjectManager.ProfileDropdown.init();
    }, 100);
});
