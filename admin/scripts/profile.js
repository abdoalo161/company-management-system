/**
 * Admin Profile JavaScript
 * Handles profile page functionality including:
 * - Profile picture upload and preview
 * - Profile form submission
 * - Password strength validation
 * - Password matching validation
 * - Profile display with dropdown menu
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Admin Profile module
ProjectManager.AdminProfile = (function() {
    
    // Initialize profile page functionality
    function init() {
        // Sidebar functionality is now handled by sidebar.js
        initProfilePictureUpload();
        initProfileForm();
        initPasswordForm();
        initProfileDisplay();
    }
    
    // Initialize profile display functionality
    function initProfileDisplay() {
        // Default options
        const config = {
            nameElementId: 'profileName',
            pictureElementId: 'profilePicture',
            containerElementId: 'profileDisplay'
        };
        
        // Get container element
        const container = document.getElementById(config.containerElementId);
        if (!container) {
            console.error(`Profile display container element not found: #${config.containerElementId}`);
            return;
        }
        
        // Load user data
        const userData = loadUserProfileData();
        
        // Render profile display
        renderProfileDisplay(container, userData, config);
        
        // Add event listeners
        addProfileDisplayEventListeners();
    }
    
    // Load user profile data
    function loadUserProfileData() {
        // Default profile data
        const defaults = {
            name: 'User',
            picture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBmaWxsPSIjNjc2NzY3Ij48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI2UyZThmMCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIvPjxwYXRoIGQ9Ik0xNjAgMTgwYzAtMzMuMTQtMjYuODYtNjAtNjAtNjBzLTYwIDI2Ljg2LTYwIDYwaDEyMHoiLz48L3N2Zz4='
        };
        
        // Initialize profile data with defaults
        const profileData = {
            name: defaults.name,
            picture: defaults.picture
        };
        
        try {
            // Get data from the ProjectManager.UserData system
            if (typeof ProjectManager.UserData !== 'undefined') {
                const userData = ProjectManager.UserData.getUserData();
                
                // Construct display name from firstName and lastName
                if (userData.firstName && userData.lastName) {
                    profileData.name = `${userData.firstName} ${userData.lastName}`;
                } else if (userData.fullName) {
                    profileData.name = userData.fullName;
                }
                
                // Use profilePicture if available
                if (userData.profilePicture) {
                    profileData.picture = userData.profilePicture;
                }
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
        
        return profileData;
    }
    
    // Render profile display as static element (no dropdown)
    function renderProfileDisplay(container, profileData, config) {
        // Clear container
        container.innerHTML = '';
        
        // Create profile display HTML as static element without dropdown
        const html = `
            <div class="profile-display static-profile">
                <span id="${config.nameElementId}" class="profile-name">${profileData.name}</span>
                <img id="${config.pictureElementId}" class="profile-picture" 
                     src="${profileData.picture}" alt="${profileData.name}'s Profile Picture">
            </div>
        `;
        
        // Set container HTML
        container.innerHTML = html;
        
        // Make profile display visible now that data is loaded
        container.style.visibility = 'visible';
    }
    
    // Add event listeners to profile display elements
    function addProfileDisplayEventListeners() {
        // No event listeners needed for static profile display
        // This function is kept for compatibility but doesn't do anything now
        console.log('Profile display is static, no event listeners added');
    }
    
    // Initialize profile picture upload functionality
    function initProfilePictureUpload() {
        const profilePicture = document.getElementById('profilePictureEdit');
        const profilePictureInput = document.getElementById('profilePictureInput');
        
        // Load current user data to display
        if (profilePicture && typeof ProjectManager.UserData !== 'undefined') {
            const userData = ProjectManager.UserData.getUserData();
            if (userData.profilePicture) {
                profilePicture.src = userData.profilePicture;
            }
        }
        
        if (profilePictureInput && profilePicture) {
            profilePictureInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Compress the image before displaying and storing it
                        compressImage(e.target.result, function(compressedImageData) {
                            profilePicture.src = compressedImageData;
                            
                            // Store the compressed profile picture data for later saving
                            profilePicture.dataset.newImage = compressedImageData;
                            
                            // Ensure the image is fully loaded before any processing
                            profilePicture.onload = function() {
                                // Force a repaint to ensure proper display
                                profilePicture.style.display = 'none';
                                setTimeout(function() {
                                    profilePicture.style.display = 'block';
                                }, 0);
                            };
                        });
                    };
                    
                    // Function to compress image data
                    function compressImage(dataURL, callback) {
                        const img = new Image();
                        img.onload = function() {
                            // Create a canvas to resize the image
                            const canvas = document.createElement('canvas');
                            
                            // Set maximum dimensions (smaller size = smaller data)
                            const MAX_WIDTH = 150;
                            const MAX_HEIGHT = 150;
                            
                            let width = img.width;
                            let height = img.height;
                            
                            // Calculate new dimensions while maintaining aspect ratio
                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }
                            
                            // Set canvas dimensions and draw resized image
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            // Get compressed image data (lower quality = smaller data)
                            const compressedDataURL = canvas.toDataURL('image/jpeg', 0.7);
                            callback(compressedDataURL);
                        };
                        
                        // Set source of image to the data URL
                        img.src = dataURL;
                    }
                    
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }
    }
    
    // Initialize profile form functionality
    function initProfileForm() {
        const profileForm = document.getElementById('profileForm');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        
        // Load current user data to display
        if (firstNameInput && lastNameInput && typeof ProjectManager.UserData !== 'undefined') {
            const userData = ProjectManager.UserData.getUserData();
            firstNameInput.value = userData.firstName || '';
            lastNameInput.value = userData.lastName || '';
            
            // Make the profile form visible now that data is loaded
            profileForm.style.visibility = 'visible';
            
            // Also make the profile picture container visible
            const profilePictureContainer = document.getElementById('profilePictureContainer');
            if (profilePictureContainer) {
                profilePictureContainer.style.visibility = 'visible';
            }
        }
        
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const firstName = firstNameInput.value;
                const lastName = lastNameInput.value;
                
                // Validate form
                if (!firstName || !lastName) {
                    showAlert('Please fill in all required fields', 'danger');
                    return;
                }
                
                // Get profile picture if changed
                const profilePictureEdit = document.getElementById('profilePictureEdit');
                const profilePictureData = profilePictureEdit ? profilePictureEdit.dataset.newImage : null;
                
                // Prepare user data to save
                const userData = {
                    firstName: firstName,
                    lastName: lastName
                };
                
                // Add profile picture if it was changed
                if (profilePictureData) {
                    userData.profilePicture = profilePictureData;
                    // Clear the data attribute to avoid saving it again on next submit
                    delete profilePictureEdit.dataset.newImage;
                }
                
                // Save user data using the centralized system
                if (typeof ProjectManager.UserData !== 'undefined') {
                    ProjectManager.UserData.saveUserData(userData);
                }
                
                // Save was successful, refresh the page with a success parameter
                window.location.href = window.location.pathname + '?success=true';
            });
        }
    }
    
    // Initialize password form functionality
    function initPasswordForm() {
        const passwordForm = document.getElementById('passwordForm');
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const passwordStrength = document.getElementById('passwordStrength');
        const passwordMatch = document.getElementById('passwordMatch');
        
        if (newPassword && passwordStrength) {
            newPassword.addEventListener('input', function() {
                const strength = checkPasswordStrength(this.value);
                updatePasswordStrengthUI(strength, passwordStrength);
            });
        }
        
        if (newPassword && confirmPassword && passwordMatch) {
            confirmPassword.addEventListener('input', function() {
                if (newPassword.value !== this.value) {
                    passwordMatch.textContent = 'Passwords do not match';
                    passwordMatch.className = 'form-text text-danger';
                } else {
                    passwordMatch.textContent = 'Passwords match';
                    passwordMatch.className = 'form-text text-success';
                }
            });
        }
        
        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const currentPassword = document.getElementById('currentPassword').value;
                const newPasswordValue = newPassword.value;
                const confirmPasswordValue = confirmPassword.value;
                
                // Validate form
                if (!currentPassword || !newPasswordValue || !confirmPasswordValue) {
                    showAlert('Please fill in all required fields', 'danger');
                    return;
                }
                
                if (newPasswordValue !== confirmPasswordValue) {
                    showAlert('Passwords do not match', 'danger');
                    return;
                }
                
                const strength = checkPasswordStrength(newPasswordValue);
                if (strength.score < 2) {
                    showAlert('Please choose a stronger password', 'danger');
                    return;
                }
                
                // Simulate API call to update password
                setTimeout(function() {
                    showAlert('Password updated successfully', 'success');
                    passwordForm.reset();
                    passwordStrength.textContent = '';
                    passwordMatch.textContent = '';
                }, 1000);
            });
        }
    }
    
    // Check password strength
    function checkPasswordStrength(password) {
        // Initialize score and feedback
        let score = 0;
        let feedback = '';
        
        // Check password length
        if (password.length < 8) {
            feedback = 'Password is too short';
        } else {
            score += 1;
        }
        
        // Check for mixed case
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
            score += 1;
        }
        
        // Check for numbers
        if (password.match(/\d/)) {
            score += 1;
        }
        
        // Check for special characters
        if (password.match(/[^a-zA-Z\d]/)) {
            score += 1;
        }
        
        // Determine feedback based on score
        if (score === 0) {
            feedback = 'Very weak password';
        } else if (score === 1) {
            feedback = 'Weak password';
        } else if (score === 2) {
            feedback = 'Moderate password';
        } else if (score === 3) {
            feedback = 'Strong password';
        } else {
            feedback = 'Very strong password';
        }
        
        return {
            score: score,
            feedback: feedback
        };
    }
    
    // Update password strength UI
    function updatePasswordStrengthUI(strength, element) {
        // Update text content
        element.textContent = strength.feedback;
        
        // Update CSS class based on strength
        element.className = 'form-text';
        
        if (strength.score === 0) {
            element.classList.add('text-danger');
        } else if (strength.score === 1) {
            element.classList.add('text-danger');
        } else if (strength.score === 2) {
            element.classList.add('text-warning');
        } else if (strength.score === 3) {
            element.classList.add('text-success');
        } else {
            element.classList.add('text-success');
        }
    }
    
    // Show alert message
    function showAlert(message, type) {
        // Use our toast notification system
        showToast(message, type);
    }
    
    // Public API
    return {
        init: init
    };
})();

// Make showAlert accessible in the global scope
function showSuccessAlert(message, type) {
    // Use our toast notification system
    showToast(message, type || 'success');
}

// Initialize the admin profile module when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.AdminProfile.init();
    
    // Check if we need to show a success message after page refresh
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Remove the success parameter from the URL without refreshing the page
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Show the success message
        setTimeout(function() {
            showSuccessAlert('Profile updated successfully', 'success');
        }, 300); // Small delay to ensure the page is fully loaded
    }
    
    // Sidebar toggle functionality has been removed while keeping the hamburger button in HTML
    console.log('Admin profile page: Sidebar toggle functionality has been removed');
});
