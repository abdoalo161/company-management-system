/**
 * Professional Form Validation System
 * Provides a unified interface for validating forms across the application
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Form Validation Module
ProjectManager.FormValidation = (function() {
    // Configuration
    const config = {
        errorClass: 'is-invalid',
        successClass: 'is-valid',
        errorMessageClass: 'invalid-feedback',
        successMessageClass: 'valid-feedback',
        validateOnInput: true,
        validateOnBlur: true,
        showSuccessMessages: false
    };
    
    // Validation rules
    const rules = {
        required: {
            test: value => value !== null && value.trim() !== '',
            message: 'This field is required'
        },
        email: {
            test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        minLength: {
            test: (value, length) => value.length >= length,
            message: (length) => `Must be at least ${length} characters`
        },
        maxLength: {
            test: (value, length) => value.length <= length,
            message: (length) => `Must be no more than ${length} characters`
        },
        pattern: {
            test: (value, pattern) => pattern.test(value),
            message: 'Please enter a valid value'
        },
        match: {
            test: (value, fieldId) => value === document.getElementById(fieldId).value,
            message: (fieldId) => `Must match ${document.getElementById(fieldId).getAttribute('name') || fieldId}`
        },
        date: {
            test: value => !isNaN(new Date(value).getTime()),
            message: 'Please enter a valid date'
        }
    };
    
    // Validate a single field
    function validateField(field) {
        // Remove any existing validation messages
        removeValidationMessage(field);
        
        // Skip validation for disabled fields
        if (field.disabled) return true;
        
        // Get validation attributes
        const validations = getValidationAttributes(field);
        
        // If no validations, return true
        if (Object.keys(validations).length === 0) return true;
        
        // Get field value
        const value = field.value;
        
        // Check each validation rule
        for (const rule in validations) {
            if (rules[rule]) {
                const ruleValue = validations[rule];
                const result = rules[rule].test(value, ruleValue);
                
                if (!result) {
                    // Show error message
                    const message = typeof rules[rule].message === 'function' 
                        ? rules[rule].message(ruleValue) 
                        : rules[rule].message;
                    
                    showValidationMessage(field, message, false);
                    return false;
                }
            }
        }
        
        // If all validations pass, show success
        if (config.showSuccessMessages) {
            showValidationMessage(field, 'Looks good!', true);
        } else {
            field.classList.add(config.successClass);
        }
        
        return true;
    }
    
    // Get validation attributes from field
    function getValidationAttributes(field) {
        const validations = {};
        
        // Required
        if (field.required) {
            validations.required = true;
        }
        
        // Email
        if (field.type === 'email') {
            validations.email = true;
        }
        
        // Min length
        if (field.minLength) {
            validations.minLength = parseInt(field.minLength);
        }
        
        // Max length
        if (field.maxLength) {
            validations.maxLength = parseInt(field.maxLength);
        }
        
        // Pattern
        if (field.pattern) {
            validations.pattern = new RegExp(field.pattern);
        }
        
        // Match
        if (field.dataset.match) {
            validations.match = field.dataset.match;
        }
        
        // Date
        if (field.type === 'date') {
            validations.date = true;
        }
        
        return validations;
    }
    
    // Show validation message
    function showValidationMessage(field, message, isValid) {
        // Add appropriate class to field
        field.classList.remove(config.errorClass, config.successClass);
        field.classList.add(isValid ? config.successClass : config.errorClass);
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = isValid ? config.successMessageClass : config.errorMessageClass;
        messageElement.textContent = message;
        
        // Insert message after field
        field.parentNode.insertBefore(messageElement, field.nextSibling);
    }
    
    // Remove validation message
    function removeValidationMessage(field) {
        // Remove classes
        field.classList.remove(config.errorClass, config.successClass);
        
        // Remove message elements
        const nextSibling = field.nextSibling;
        if (nextSibling && (
            nextSibling.classList.contains(config.errorMessageClass) || 
            nextSibling.classList.contains(config.successMessageClass)
        )) {
            nextSibling.parentNode.removeChild(nextSibling);
        }
    }
    
    // Validate entire form
    function validateForm(form) {
        if (!form) {
            console.error('Form not found');
            return false;
        }
        
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Skip fields without a name
            if (!field.name) return;
            
            // Validate field
            const fieldValid = validateField(field);
            isValid = isValid && fieldValid;
        });
        
        return isValid;
    }
    
    // Initialize validation
    function init() {
        // Add event listeners to forms
        document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Prevent default submission
                form.addEventListener('submit', function(e) {
                    if (!validateForm(form)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                
                // Add input event listeners
                if (config.validateOnInput) {
                    const fields = form.querySelectorAll('input, select, textarea');
                    
                    fields.forEach(field => {
                        field.addEventListener('input', function() {
                            validateField(field);
                        });
                    });
                }
                
                // Add blur event listeners
                if (config.validateOnBlur) {
                    const fields = form.querySelectorAll('input, select, textarea');
                    
                    fields.forEach(field => {
                        field.addEventListener('blur', function() {
                            validateField(field);
                        });
                    });
                }
            });
        });
    }
    
    // Public API
    return {
        init: init,
        validateForm: validateForm,
        validateField: validateField
    };
})();

// Initialize form validation
ProjectManager.FormValidation.init();
