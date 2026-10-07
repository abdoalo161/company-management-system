/**
 * User Data Management System
 * 
 * This module provides a centralized way to manage user data across all pages.
 * It uses localStorage to persist user data between sessions.
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// User Data Management module
ProjectManager.UserData = (function() {
    // Default user data
    const defaultUserData = {
        firstName: 'Alex',
        lastName: 'Morgan',
        fullName: 'Alex Morgan',
        profilePicture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==',
        initials: 'AM'
    };
    
    // Keys for localStorage - separate for each portal
    const BASE_USER_DATA_KEY = 'projectManager_userData';
    
    // Determine which portal we're in based on the URL path
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
    
    // Get the appropriate storage key for the current portal
    function getUserDataKey() {
        const portal = getCurrentPortal();
        return `${BASE_USER_DATA_KEY}_${portal}`;
    }
    
    /**
     * Get user data from localStorage or return default if not found
     * @returns {Object} User data object
     */
    function getUserData() {
        const key = getUserDataKey();
        const storedData = localStorage.getItem(key);
        
        // Set different default data based on portal
        let portalDefaultData = { ...defaultUserData };
        const portal = getCurrentPortal();
        
        // Set portal-specific defaults
        if (portal === 'admin') {
            portalDefaultData = {
                firstName: 'Admin',
                lastName: 'User',
                fullName: 'Admin User',
                profilePicture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==',
                initials: 'AU'
            };
        } else if (portal === 'team-leader') {
            portalDefaultData = {
                firstName: 'Team',
                lastName: 'Leader',
                fullName: 'messi',  // As per user's preference
                profilePicture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==',
                initials: 'TL'
            };
        } else if (portal === 'user') {
            portalDefaultData = {
                firstName: 'Team',
                lastName: 'Member',
                fullName: 'Team Member',
                profilePicture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==',
                initials: 'TM'
            };
        }
        
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (e) {
                console.error(`Error parsing user data from localStorage for ${portal}:`, e);
                return portalDefaultData;
            }
        }
        return portalDefaultData;
    }
    
    /**
     * Save user data to localStorage
     * @param {Object} userData - User data object to save
     */
    function saveUserData(userData) {
        // Get the portal-specific key
        const key = getUserDataKey();
        const portal = getCurrentPortal();
        
        // Merge with existing data to ensure we don't lose any fields
        const currentData = getUserData();
        const updatedData = { ...currentData, ...userData };
        
        // Ensure fullName is updated if firstName or lastName changed
        if (userData.firstName || userData.lastName) {
            updatedData.fullName = `${updatedData.firstName} ${updatedData.lastName}`;
            
            // If the user explicitly set a fullName, use that instead
            if (userData.fullName) {
                updatedData.fullName = userData.fullName;
            }
            
            // Update initials
            updatedData.initials = updatedData.firstName.charAt(0) + updatedData.lastName.charAt(0);
        }
        
        // If the user explicitly set a fullName, use that
        if (userData.fullName) {
            updatedData.fullName = userData.fullName;
        }
        
        // Save to localStorage with error handling
        try {
            localStorage.setItem(key, JSON.stringify(updatedData));
            console.log(`Saved user data for ${portal} portal`);
        } catch (e) {
            console.error(`Error saving user data to localStorage for ${portal}:`, e);
            
            // If quota exceeded, try to save just essential data
            if (e.name === 'QuotaExceededError') {
                // Create a minimal version with just essential fields
                const minimalData = {
                    firstName: updatedData.firstName,
                    lastName: updatedData.lastName,
                    fullName: updatedData.fullName,
                    initials: updatedData.initials
                };
                
                // If profilePicture is a data URL and too large, use a placeholder
                if (updatedData.profilePicture && updatedData.profilePicture.startsWith('data:')) {
                    // Use a simple placeholder instead
                    minimalData.profilePicture = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                } else {
                    minimalData.profilePicture = updatedData.profilePicture;
                }
                
                try {
                    // Try to save the minimal version
                    localStorage.setItem(key, JSON.stringify(minimalData));
                    console.log(`Saved minimal user data for ${portal} due to quota limits`);
                    // Update our reference to use this minimal data
                    Object.assign(updatedData, minimalData);
                } catch (innerError) {
                    // If even that fails, just continue with the in-memory version
                    console.error(`Failed to save even minimal user data for ${portal}:`, innerError);
                }
            }
        }
        
        // Dispatch an event so other parts of the app can react to the change
        // Include portal information in the event detail
        const event = new CustomEvent('userDataChanged', { 
            detail: { 
                userData: updatedData,
                portal: portal
            }
        });
        document.dispatchEvent(event);
        
        return updatedData;
    }
    
    /**
     * Update user interface elements with current user data
     * This updates headers, profile pictures, etc. across the app
     */
    function updateUI() {
        const userData = getUserData();
        console.log('Updating UI with user data:', userData);
        
        // Pre-set user names in HTML to prevent flashing of default values
        const portal = getCurrentPortal();
        if (portal === 'team-leader') {
            // Only target header user elements, not action buttons in tables
            document.querySelectorAll('#userDropdown, .user-display-name').forEach(el => {
                // Skip elements inside table action buttons
                const isInActionButton = el.closest('.dropdown') && 
                                       el.closest('.dropdown').querySelector('button') && 
                                       el.closest('.dropdown').querySelector('button').textContent.trim() === 'Actions';
                
                if (el.textContent.trim() && !isInActionButton) {
                    // For text nodes directly in the element
                    for (let i = 0; i < el.childNodes.length; i++) {
                        if (el.childNodes[i].nodeType === Node.TEXT_NODE && el.childNodes[i].nodeValue.trim()) {
                            const currentText = el.childNodes[i].nodeValue;
                            const leadingSpace = currentText.match(/^\s*/)[0];
                            const trailingSpace = currentText.match(/\s*$/)[0];
                            // Use the actual saved name instead of hardcoding 'messi'
                            el.childNodes[i].nodeValue = leadingSpace + userData.fullName + trailingSpace;
                        }
                    }
                    
                    // For span elements that might contain the name
                    el.querySelectorAll('span:not(.badge)').forEach(span => {
                        if (span.textContent.trim() && !span.querySelector('*')) {
                            // Use the actual saved name instead of hardcoding 'messi'
                            span.textContent = userData.fullName;
                        }
                    });
                }
            });
        }
        
        // Update user name in headers and dropdown menus
        updateUserNames(userData);
        
        // Update profile pictures
        updateProfilePictures(userData);
        
        // Update avatar initials
        updateAvatarInitials(userData);
        
        // Update chat names
        updateChatNames(userData);
    }
    
    /**
     * Update all user name elements in the UI
     */
    function updateUserNames(userData) {
        const portal = getCurrentPortal();
        
        // Update user name in the new user-display-name spans
        const userDisplayNameElements = document.querySelectorAll('.user-display-name');
        userDisplayNameElements.forEach(element => {
            // Skip elements inside table action buttons
            const isInActionButton = element.closest('.dropdown') && 
                                   element.closest('.dropdown').querySelector('button') && 
                                   element.closest('.dropdown').querySelector('button').textContent.trim() === 'Actions';
            
            if (!isInActionButton) {
                element.textContent = userData.fullName;
            }
        });
        
        // Update user name in headers (for any elements we might have missed)
        // Only target the user dropdown in the header, not action buttons in tables
        const userNameElements = document.querySelectorAll('#userDropdown');
        userNameElements.forEach(element => {
            
            // Check if this element contains text directly (not just child elements)
            let textNode = null;
            for (let i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].nodeType === Node.TEXT_NODE && element.childNodes[i].nodeValue.trim()) {
                    textNode = element.childNodes[i];
                    break;
                }
            }
            
            if (textNode) {
                // Replace the text while preserving any leading/trailing whitespace
                const currentText = textNode.nodeValue;
                const leadingSpace = currentText.match(/^\s*/)[0];
                const trailingSpace = currentText.match(/\s*$/)[0];
                textNode.nodeValue = leadingSpace + userData.fullName + trailingSpace;
            }
        });
        
        // Fix dropdown menu items - ensure they don't show the user's name
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            // Check if this is a profile link
            if (item.getAttribute('href') === 'profile.html' || item.getAttribute('href')?.includes('profile')) {
                // Find the text node after the SVG icon
                for (let i = 0; i < item.childNodes.length; i++) {
                    if (item.childNodes[i].nodeType === Node.TEXT_NODE && item.childNodes[i].nodeValue.trim()) {
                        item.childNodes[i].nodeValue = ' Profile';
                    }
                }
            }
            // Check if this is a logout link
            else if (item.id === 'logout-btn' || item.textContent.includes('Logout')) {
                // Find the text node after the SVG icon
                for (let i = 0; i < item.childNodes.length; i++) {
                    if (item.childNodes[i].nodeType === Node.TEXT_NODE && item.childNodes[i].nodeValue.trim()) {
                        item.childNodes[i].nodeValue = ' Logout';
                    }
                }
            }
        });
        
        // Also update h1 elements that might contain the user's name
        const h1Elements = document.querySelectorAll('h1');
        h1Elements.forEach(element => {
            if (element.textContent.includes('Profile')) {
                // This is likely a profile header, don't modify it
            } else if (element.textContent.includes('Alex') || element.textContent.includes('Morgan')) {
                element.textContent = userData.fullName;
            }
        });
    }
    
    /**
     * Update all profile picture elements in the UI
     */
    function updateProfilePictures(userData) {
        // Check if the profile picture is a file path that might not exist
        if (userData.profilePicture && (userData.profilePicture.includes('/libs/images/default-avatar.png') || 
            userData.profilePicture.includes('\\libs\\images\\default-avatar.png'))) {
            // Replace with our embedded SVG data URL
            userData.profilePicture = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
            
            // Save the updated data using the portal-specific key
            const key = getUserDataKey();
            try {
                localStorage.setItem(key, JSON.stringify(userData));
            } catch (e) {
                console.error('Error updating profile picture in localStorage:', e);
            }
        }
        
        // Update all image elements that could be profile pictures
        const profilePicElements = document.querySelectorAll('.profile-picture, .avatar img, img.avatar, .bi-person-circle');
        profilePicElements.forEach(element => {
            if (element.tagName === 'IMG') {
                element.src = userData.profilePicture;
                
                // Add error handler to replace broken images
                element.onerror = function() {
                    console.log('Image failed to load, replacing with default SVG');
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                    this.onerror = null; // Prevent infinite loop
                    
                    // Also update the user data using the portal-specific key
                    const currentData = getUserData();
                    currentData.profilePicture = this.src;
                    const key = getUserDataKey();
                    try {
                        localStorage.setItem(key, JSON.stringify(currentData));
                    } catch (e) {
                        console.error('Error updating profile picture in localStorage:', e);
                    }
                };
            } else if (element.tagName === 'svg') {
                // For SVG profile icons, we need to replace them with an actual image
                const parentElement = element.parentElement;
                if (parentElement) {
                    // Create a new image element
                    const img = document.createElement('img');
                    img.src = userData.profilePicture;
                    img.className = 'profile-icon ms-2';
                    img.style.width = '20px';
                    img.style.height = '20px';
                    img.style.borderRadius = '50%';
                    img.style.objectFit = 'cover';
                    
                    // Add error handler
                    img.onerror = function() {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                        this.onerror = null; // Prevent infinite loop
                    };
                    
                    // Replace the SVG with the image
                    element.remove(); // Remove the SVG completely
                    parentElement.appendChild(img);
                }
            }
        });
        
        // Also check for any SVG profile icons in the dropdown toggle
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            const svg = toggle.querySelector('.bi-person-circle');
            if (svg) {
                // Check if we already added an image
                const existingImg = toggle.querySelector('.profile-icon');
                if (!existingImg) {
                    // Create a new image element
                    const img = document.createElement('img');
                    img.src = userData.profilePicture;
                    img.className = 'profile-icon ms-2';
                    img.style.width = '20px';
                    img.style.height = '20px';
                    img.style.borderRadius = '50%';
                    img.style.objectFit = 'cover';
                    
                    // Add error handler
                    img.onerror = function() {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                        this.onerror = null; // Prevent infinite loop
                    };
                    
                    // Replace the SVG with the image
                    svg.remove(); // Remove the SVG completely
                    toggle.appendChild(img);
                }
            }
        });
    }
    
    /**
     * Update all avatar initials elements in the UI
     */
    function updateAvatarInitials(userData) {
        // Update avatar initials in div elements
        const avatarInitialsElements = document.querySelectorAll('.avatar:not(img)');
        avatarInitialsElements.forEach(element => {
            if (element.textContent.trim().length <= 2) { // Only update if it looks like initials
                element.textContent = userData.initials;
            }
        });
    }
    
    /**
     * Update all chat name elements in the UI
     */
    function updateChatNames(userData) {
        // Update chat names
        const chatNameElements = document.querySelectorAll('.chat-name');
        chatNameElements.forEach(element => {
            if (element.textContent.includes('You') || element.textContent.includes('Me')) {
                element.textContent = 'You';
            }
        });
    }
    
    /**
     * Initialize the user data system
     * Sets up event listeners and updates UI with current data
     */
    function init() {
        console.log('Initializing user data system');
        
        // Check if we need to reset localStorage (for debugging/fixing issues)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('reset_user_data')) {
            console.log('Resetting user data due to URL parameter');
            localStorage.removeItem(USER_DATA_KEY);
        }
        
        // For this specific error, we'll check if we're on the profile page
        // and if so, we'll clear localStorage to fix the issue
        if (window.location.href.includes('profile.html')) {
            // Check if we have problematic data
            const storedData = localStorage.getItem(USER_DATA_KEY);
            if (storedData && storedData.includes('default-avatar.png')) {
                console.log('Found problematic data in localStorage, clearing it');
                localStorage.removeItem(USER_DATA_KEY);
            }
        }
        
        // Fix existing localStorage data if needed
        fixExistingUserData();
        
        // Listen for user data changes
        document.addEventListener('userDataChanged', function(e) {
            console.log('User data changed event received');
            updateUI();
        });
        
        // Initial UI update
        updateUI();
        
        // Also update UI when page loads completely (after all resources)
        window.addEventListener('load', function() {
            console.log('Window load event - updating UI');
            updateUI();
        });
        
        // Update UI when navigating between pages
        if (document.readyState === 'complete') {
            console.log('Document already loaded - updating UI');
            updateUI();
        }
    }
    
    /**
     * Fix any issues with existing user data in localStorage
     */
    function fixExistingUserData() {
        try {
            // First check if the raw stored data contains the problematic string
            const storedData = localStorage.getItem(USER_DATA_KEY);
            if (storedData) {
                // If the raw data contains the problematic string, clear it completely
                if (storedData.includes('default-avatar.png')) {
                    console.log('Found problematic default-avatar.png reference in localStorage, clearing it');
                    localStorage.removeItem(USER_DATA_KEY);
                    return; // Exit early, we'll use default data instead
                }
                
                // Otherwise, try to parse and fix the data
                try {
                    const userData = JSON.parse(storedData);
                    let needsUpdate = false;
                    
                    // Fix profile picture if it's using the old path or any problematic value
                    if (!userData.profilePicture || 
                        userData.profilePicture.includes('default-avatar.png') || 
                        userData.profilePicture.includes('/libs/images/') ||
                        userData.profilePicture.includes('\\libs\\images\\')) {
                        
                        userData.profilePicture = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                        needsUpdate = true;
                    }
                    
                    // Save the updated data if needed
                    if (needsUpdate) {
                        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
                        console.log('Fixed existing user data in localStorage');
                    }
                } catch (parseError) {
                    console.error('Error parsing user data JSON:', parseError);
                    localStorage.removeItem(USER_DATA_KEY);
                }
            }
        } catch (e) {
            console.error('Error fixing existing user data:', e);
            // If there's an error, clear the localStorage and start fresh
            try {
                localStorage.removeItem(USER_DATA_KEY);
                console.log('Cleared problematic user data from localStorage');
            } catch (clearError) {
                console.error('Error clearing localStorage:', clearError);
            }
        }
    }
    
    /**
     * Initialize user data system
     * This is a compatibility function for older code that expects an init function
     */
    function init() {
        // Simply call updateUI to initialize the UI with current user data
        updateUI();
        return getUserData(); // Return current user data for convenience
    }
    
    // Public API
    // Public methods
    return {
        getUserData: getUserData,
        saveUserData: saveUserData,
        updateUI: updateUI,
        getCurrentPortal: getCurrentPortal,
        init: init // Add back the init function for backward compatibility
    };
})();

// Initialize the user data module when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.UserData.init();
});
