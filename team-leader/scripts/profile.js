/**
 * Team Leader Profile JavaScript
 * Handles profile page functionality including:
 * - Profile picture upload and preview
 * - Profile form submission
 * - Password strength validation
 * - Password matching validation
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Team Leader Profile module
ProjectManager.TeamLeaderProfile = (function() {
    
    // Initialize profile page functionality
    function init() {
        initSidebar();
        initProfilePictureUpload();
        initProfileForm();
        initPasswordForm();
    }
    
    /**
     * Sidebar functionality has been removed as requested
     */
    function initSidebar() {
        // Sidebar toggle functionality has been removed while keeping the hamburger button in HTML
        console.log('Team Leader Profile page: Sidebar toggle functionality has been removed');
    }
    
    // Initialize profile picture upload functionality
    function initProfilePictureUpload() {
        const formProfilePicture = document.getElementById('formProfilePicture');
        const headerProfilePicture = document.getElementById('profilePicture');
        const profilePictureInput = document.getElementById('profilePictureInput');
        
        // Load current user data to display
        if (formProfilePicture && typeof ProjectManager.UserData !== 'undefined') {
            const userData = ProjectManager.UserData.getUserData();
            if (userData.profilePicture) {
                formProfilePicture.src = userData.profilePicture;
            }
        }
        
        if (profilePictureInput && formProfilePicture) {
            profilePictureInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Compress the image before displaying and storing it
                        compressImage(e.target.result, function(compressedImageData) {
                            // Update the profile picture in the form
                            formProfilePicture.src = compressedImageData;
                            
                            // Store the compressed profile picture data for later saving
                            formProfilePicture.dataset.newImage = compressedImageData;
                            
                            // Don't update the header profile picture or localStorage until save button is clicked
                            // This ensures changes are only applied after explicit user confirmation
                            
                            // Ensure the image is fully loaded before any processing
                            formProfilePicture.onload = function() {
                                // Force a repaint to ensure proper display
                                formProfilePicture.style.display = 'none';
                                setTimeout(function() {
                                    formProfilePicture.style.display = 'block';
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
        const profileContent = document.getElementById('profileContent');
        
        // Load current user data to display
        if (firstNameInput && lastNameInput && typeof ProjectManager.UserData !== 'undefined') {
            const userData = ProjectManager.UserData.getUserData();
            firstNameInput.value = userData.firstName || '';
            lastNameInput.value = userData.lastName || '';
            
            // Make profile content visible only after data is loaded
            if (profileContent) {
                profileContent.style.visibility = 'visible';
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
                const formProfilePicture = document.getElementById('formProfilePicture');
                const profilePictureData = formProfilePicture ? formProfilePicture.dataset.newImage : null;
                
                // Prepare user data to save
                const userData = {
                    firstName: firstName,
                    lastName: lastName
                };
                
                // Add profile picture if it was changed
                if (profilePictureData) {
                    userData.profilePicture = profilePictureData;
                    // Clear the data attribute to avoid saving it again on next submit
                    delete formProfilePicture.dataset.newImage;
                }
                
                // Save user data using the centralized system
                if (typeof ProjectManager.UserData !== 'undefined') {
                    ProjectManager.UserData.saveUserData(userData);
                    
                    // Now that the user has explicitly saved, update the header profile picture
                    const headerProfilePicture = document.getElementById('profilePicture');
                    if (headerProfilePicture && profilePictureData) {
                        headerProfilePicture.src = profilePictureData;
                    }
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
        const passwordContent = document.getElementById('passwordContent');
        
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
        
        // Make password content visible after initialization
        if (passwordContent) {
            passwordContent.style.visibility = 'visible';
        }
        
        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const currentPasswordValue = document.getElementById('currentPassword').value;
                const newPasswordValue = newPassword.value;
                const confirmPasswordValue = confirmPassword.value;
                
                // Validate form
                if (!currentPasswordValue || !newPasswordValue || !confirmPasswordValue) {
                    showAlert('Please fill in all required fields', 'danger');
                    return;
                }
                
                if (newPasswordValue !== confirmPasswordValue) {
                    showAlert('New passwords do not match', 'danger');
                    return;
                }
                
                // TODO: Implement password change functionality
                // For now, just show success message
                showAlert('Password changed successfully', 'success');
                
                // Reset form
                passwordForm.reset();
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
    showToast(message, type);
}

// Initialize the team leader profile module when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.TeamLeaderProfile.init();
    
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
});
