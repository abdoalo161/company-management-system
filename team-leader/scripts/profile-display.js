/**
 * Profile Display System for Team Leader Portal
 * 
 * This module handles the consistent display of user profile information
 * across all team leader portal pages, implementing anti-glitch techniques
 * to ensure a smooth user experience with a static profile display.
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Team Leader Profile Display module
ProjectManager.ProfileDisplay = (function() {
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
        
        // Check if we're on the profile page
        const isProfilePage = window.location.pathname.includes('profile.html');
        
        // Only apply static profile on profile page
        if (isProfilePage) {
            profileDisplay.classList.add('static-profile');
            // Remove any dropdown-related classes and attributes if they exist
            profileDisplay.classList.remove('dropdown-toggle');
            profileDisplay.removeAttribute('data-bs-toggle');
            profileDisplay.removeAttribute('aria-expanded');
        }
        
        // Get user data
        if (typeof ProjectManager.UserData !== 'undefined') {
            const userData = ProjectManager.UserData.getUserData();
            
            // Update profile name - use first and last name from profile
            if (userData.firstName && userData.lastName) {
                profileName.textContent = `${userData.firstName} ${userData.lastName}`;
            } else if (userData.fullName) {
                profileName.textContent = userData.fullName;
            } else {
                profileName.textContent = '';
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
            
            // No dropdown menu functionality needed for profile display
        } else {
            console.error('UserData module not available');
            
            // Even if there's an error, make the profile display visible
            // but don't set a default name, leave it blank
            profileName.textContent = '';
            profileDisplay.style.visibility = 'visible';
            
            // No dropdown menu functionality needed for profile display
        }
    }
    
    // Function initDropdownMenu has been removed as dropdown functionality is not needed for profile display
    
    // Add event listener to logout buttons
    function initLogoutButton() {
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
    }
    
    // Public API
    return {
        init: init,
        initLogoutButton: initLogoutButton
    };
})();

// Initialize the profile display when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure user data is loaded first
    setTimeout(function() {
        ProjectManager.ProfileDisplay.init();
        ProjectManager.ProfileDisplay.initLogoutButton();
    }, 100);
});
