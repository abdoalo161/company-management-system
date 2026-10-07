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
            validate: value => value !== null && value !== undefined && value.toString().trim() !== '',
            message: 'This field is required'
        },
        email: {
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        minLength: {
            validate: (value, length) => value.length >= length,
            message: (length) => `Please enter at least ${length} characters`
        },
        maxLength: {
            validate: (value, length) => value.length <= length,
            message: (length) => `Please enter no more than ${length} characters`
        },
        min: {
            validate: (value, min) => Number(value) >= min,
            message: (min) => `Value must be at least ${min}`
        },
        max: {
            validate: (value, max) => Number(value) <= max,
            message: (max) => `Value must be no more than ${max}`
        },
        pattern: {
            validate: (value, pattern) => new RegExp(pattern).test(value),
            message: 'Please enter a valid value'
        },
        date: {
            validate: value => !isNaN(new Date(value).getTime()),
            message: 'Please enter a valid date'
        },
        dateAfter: {
            validate: (value, targetDate) => new Date(value) > new Date(targetDate),
            message: (targetDate) => `Date must be after ${new Date(targetDate).toLocaleDateString()}`
        },
        dateBefore: {
            validate: (value, targetDate) => new Date(value) < new Date(targetDate),
            message: (targetDate) => `Date must be before ${new Date(targetDate).toLocaleDateString()}`
        },
        integer: {
            validate: value => /^-?\d+$/.test(value),
            message: 'Please enter a valid integer'
        },
        decimal: {
            validate: value => /^-?\d+(\.\d+)?$/.test(value),
            message: 'Please enter a valid number'
        },
        alphanumeric: {
            validate: value => /^[a-zA-Z0-9]*$/.test(value),
            message: 'Please use only letters and numbers'
        },
        url: {
            validate: value => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value),
            message: 'Please enter a valid URL'
        }
    };

    // Initialize form validation
    function init() {
        // Set up global event listeners if needed
        if (config.validateOnInput) {
            document.addEventListener('input', handleInputValidation);
        }
        
        if (config.validateOnBlur) {
            document.addEventListener('blur', handleBlurValidation, true);
        }
        
        console.log('Form validation system initialized');
    }

    // Handle input validation events
    function handleInputValidation(event) {
        const target = event.target;
        if (target.hasAttribute('data-validate')) {
            validateField(target);
        }
    }

    // Handle blur validation events
    function handleBlurValidation(event) {
        const target = event.target;
        if (target.hasAttribute('data-validate')) {
            validateField(target);
        }
    }

    // Validate a single field
    function validateField(field) {
        // Get validation rules from data attribute
        const validationRules = field.getAttribute('data-validate');
        if (!validationRules) return true;
        
        // Get field value
        const value = getFieldValue(field);
        
        // Parse validation rules
        const rules = validationRules.split('|');
        let isValid = true;
        let errorMessage = '';
        
        // Check each rule
        for (const rule of rules) {
            const [ruleName, ruleValue] = rule.split(':');
            
            if (!validateRule(ruleName, value, ruleValue, field)) {
                isValid = false;
                errorMessage = getErrorMessage(ruleName, ruleValue, field);
                break;
            }
        }
        
        // Update field UI
        updateFieldValidationUI(field, isValid, errorMessage);
        
        return isValid;
    }

    // Get field value based on field type
    function getFieldValue(field) {
        if (field.type === 'checkbox') {
            return field.checked;
        } else if (field.type === 'radio') {
            const name = field.name;
            const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
            return checkedRadio ? checkedRadio.value : '';
        } else if (field.type === 'file') {
            return field.files.length > 0 ? field.files : '';
        } else {
            return field.value;
        }
    }

    // Validate a field against a specific rule
    function validateRule(ruleName, value, ruleValue, field) {
        // Handle custom validation function
        if (ruleName === 'custom' && typeof window[ruleValue] === 'function') {
            return window[ruleValue](value, field);
        }
        
        // Handle built-in rules
        if (rules[ruleName]) {
            if (ruleValue !== undefined) {
                return rules[ruleName].validate(value, ruleValue);
            } else {
                return rules[ruleName].validate(value);
            }
        }
        
        // If rule not found, consider it valid
        console.warn(`Validation rule '${ruleName}' not found`);
        return true;
    }

    // Get error message for a rule
    function getErrorMessage(ruleName, ruleValue, field) {
        // Check for custom error message on the field
        const customMessage = field.getAttribute(`data-error-${ruleName}`);
        if (customMessage) return customMessage;
        
        // Use built-in message
        if (rules[ruleName]) {
            if (typeof rules[ruleName].message === 'function') {
                return rules[ruleName].message(ruleValue);
            } else {
                return rules[ruleName].message;
            }
        }
        
        return 'Invalid value';
    }

    // Update field UI based on validation result
    function updateFieldValidationUI(field, isValid, errorMessage) {
        // Remove existing validation classes and messages
        field.classList.remove(config.errorClass, config.successClass);
        
        // Remove existing error/success messages
        const parent = field.parentElement;
        const existingErrorMessage = parent.querySelector(`.${config.errorMessageClass}`);
        const existingSuccessMessage = parent.querySelector(`.${config.successMessageClass}`);
        
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }
        
        if (existingSuccessMessage) {
            existingSuccessMessage.remove();
        }
        
        // Add appropriate class and message
        if (!isValid) {
            field.classList.add(config.errorClass);
            
            // Create error message element
            const errorElement = document.createElement('div');
            errorElement.className = config.errorMessageClass;
            errorElement.textContent = errorMessage;
            
            // Add error message after the field
            parent.appendChild(errorElement);
        } else if (config.showSuccessMessages) {
            field.classList.add(config.successClass);
            
            // Create success message element if configured
            const successMessage = field.getAttribute('data-success-message') || 'Looks good!';
            const successElement = document.createElement('div');
            successElement.className = config.successMessageClass;
            successElement.textContent = successMessage;
            
            // Add success message after the field
            parent.appendChild(successElement);
        }
    }

    // Validate an entire form
    function validateForm(form) {
        if (!form) return false;
        
        // Find all fields with validation rules
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;
        
        // Validate each field
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Reset validation state for a form
    function resetValidation(form) {
        if (!form) return;
        
        // Find all fields with validation classes
        const invalidFields = form.querySelectorAll(`.${config.errorClass}, .${config.successClass}`);
        
        // Remove validation classes
        invalidFields.forEach(field => {
            field.classList.remove(config.errorClass, config.successClass);
        });
        
        // Remove error messages
        const errorMessages = form.querySelectorAll(`.${config.errorMessageClass}, .${config.successMessageClass}`);
        errorMessages.forEach(message => {
            message.remove();
        });
    }

    // Add a custom validation rule
    function addRule(name, validateFn, errorMessage) {
        if (!name || typeof validateFn !== 'function') {
            console.error('Invalid rule definition');
            return;
        }
        
        rules[name] = {
            validate: validateFn,
            message: errorMessage || 'Invalid value'
        };
    }

    // Public API
    return {
        init: init,
        validateField: validateField,
        validateForm: validateForm,
        resetValidation: resetValidation,
        addRule: addRule,
        setConfig: function(newConfig) {
            Object.assign(config, newConfig);
        }
    };
})();

// Initialize the form validation system when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.FormValidation.init();
});
