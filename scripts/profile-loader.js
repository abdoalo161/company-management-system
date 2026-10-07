/**
 * Profile Loader Script
 * 
 * This script only handles loading user data and updating profile display elements.
 * It does not handle dropdown functionality, which is now directly in the HTML.
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Profile Loader module
ProjectManager.ProfileLoader = (function() {
    /**
     * Initialize the profile display
     * Loads user data and updates the profile display elements
     */
    function init() {
        // Check if profile display elements exist on the page
        const profileDisplay = document.getElementById('profileDisplay');
        const profileName = document.getElementById('profileName');
        const profilePicture = document.getElementById('profilePicture');
        
        if (!profileDisplay || !profileName || !profilePicture) {
            console.warn('Profile display elements not found on page');
            return;
        }
        
        // Get user data
        if (typeof ProjectManager.UserData !== 'undefined') {
            const userData = ProjectManager.UserData.getUserData();
            
            // Update profile name - use first and last name from profile
            if (userData.firstName && userData.lastName) {
                profileName.textContent = `${userData.firstName} ${userData.lastName}`;
            } else if (userData.fullName) {
                profileName.textContent = userData.fullName;
            } else if (userData.username) {
                profileName.textContent = userData.username;
            } else {
                profileName.textContent = 'User';
            }
            
            // Update profile picture
            if (userData.profilePicture) {
                profilePicture.src = userData.profilePicture;
                
                // Add error handler to replace broken images
                profilePicture.onerror = function() {
                    console.log('Profile picture failed to load, replacing with default SVG');
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBmaWxsPSIjNjc2NzY3Ij48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI2UyZThmMCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIvPjxwYXRoIGQ9Ik0xNjAgMTgwYzAtMzMuMTQtMjYuODYtNjAtNjAtNjBzLTYwIDI2Ljg2LTYwIDYwaDEyMHoiLz48L3N2Zz4=';
                    this.onerror = null; // Prevent infinite loop
                };
            }
            
            // Make the profile display visible only after data is loaded
            // This prevents the glitching/flickering issue
            profileDisplay.style.visibility = 'visible';
        } else {
            console.error('UserData module not available');
            
            // Even if there's an error, make the profile display visible
            // but don't set a default name, leave it blank
            profileName.textContent = 'User';
            profileDisplay.style.visibility = 'visible';
        }
    }
    
    // Add event listener for logout buttons
    document.addEventListener('DOMContentLoaded', function() {
        const logoutButtons = document.querySelectorAll('#logoutButton');
        logoutButtons.forEach(button => {
            button.addEventListener('click', function(e) {
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
        });
    });
    
    // Public API
    return {
        init: init
    };
})();

// Initialize the profile loader when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure user data is loaded first
    setTimeout(function() {
        ProjectManager.ProfileLoader.init();
    }, 100);
});
