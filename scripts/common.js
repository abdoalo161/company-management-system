/**
 * Common JavaScript functionality for all pages
 * This script ensures user data is properly initialized on every page
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Initialize common functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide user elements initially to prevent flashing of default values
    // Only select the user dropdown in the header, not action buttons in tables
    const userElements = document.querySelectorAll('.user-display-name, #userDropdown');
    userElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.2s ease-in-out';
    });
    
    // Load user data for team leader portal to prevent flashing
    if (window.location.pathname.toLowerCase().includes('/team-leader/')) {
        // Try to get user data from localStorage directly
        try {
            const teamLeaderKey = 'team-leader_userData';
            const storedData = localStorage.getItem(teamLeaderKey);
            if (storedData) {
                const userData = JSON.parse(storedData);
                
                // Update user names
                document.querySelectorAll('#userDropdown .user-display-name, .user-display-name').forEach(el => {
                    if (el.textContent.trim()) {
                        el.textContent = userData.fullName || 'messi';
                    }
                });
                
                // Update profile pictures
                document.querySelectorAll('.profile-picture').forEach(img => {
                    if (img.tagName === 'IMG' && userData.profilePicture) {
                        img.src = userData.profilePicture;
                    }
                });
            }
        } catch (e) {
            console.error('Error pre-loading team leader user data:', e);
        }
    }
    
    // Initialize user data if available
    if (window.ProjectManager && ProjectManager.UserData) {
        console.log('Initializing user data from common.js');
        
        // Call the updateUI function to update all user interface elements with current user data
        if (typeof ProjectManager.UserData.updateUI === 'function') {
            ProjectManager.UserData.updateUI();
            
            // Show user elements after they've been updated with a fade-in effect
            setTimeout(() => {
                userElements.forEach(element => {
                    element.style.opacity = '1';
                });
            }, 50); // Small delay to ensure DOM updates have completed
        }
        
        // For backward compatibility, also call init if it exists
        if (typeof ProjectManager.UserData.init === 'function') {
            ProjectManager.UserData.init();
        }
    }
    
    // Add event listener for user data changes
    document.addEventListener('userDataChanged', function(event) {
        console.log('User data changed, updating UI');
        if (window.ProjectManager && ProjectManager.UserData && 
            typeof ProjectManager.UserData.updateUI === 'function') {
            ProjectManager.UserData.updateUI();
        }
    });
    
    // Initialize Bootstrap dropdowns with a more robust approach
    if (typeof bootstrap !== 'undefined') {
        // Wait a short time to ensure all other scripts have loaded
        setTimeout(function() {
            // First, try to initialize all dropdowns the standard way
            const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
            dropdownElementList.forEach(function(dropdownToggleEl) {
                try {
                    new bootstrap.Dropdown(dropdownToggleEl);
                } catch (e) {
                    console.warn('Could not initialize dropdown with standard method:', e);
                }
            });
            
            // Special handling for the user dropdown which needs extra attention
            const userDropdown = document.getElementById('userDropdown');
            if (userDropdown) {
                try {
                    // Create a dedicated dropdown instance
                    const dropdownInstance = new bootstrap.Dropdown(userDropdown);
                    
                    // Add a click handler to manually toggle the dropdown
                    userDropdown.addEventListener('click', function(e) {
                        dropdownInstance.toggle();
                    });
                    
                    console.log('User dropdown initialized with enhanced method');
                } catch (error) {
                    console.error('Error initializing user dropdown:', error);
                }
            }
            
            console.log('Bootstrap dropdowns initialization complete');
        }, 300); // Short delay to ensure everything is loaded
    } else {
        console.error('Bootstrap is not loaded, dropdowns will not work');
    }
});
