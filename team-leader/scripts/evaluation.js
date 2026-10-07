// Professional Team Member Evaluation JavaScript

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Evaluation module
ProjectManager.Evaluation = (function() {
    // Private variables
    let evaluationForm;
    let saveEvaluationBtn;
    let currentMemberId;
    let overallPerformance;
    let ratingValue;
    let evalEmployeeName;
    let evalEmployeeAvatar;
    let evalPosition;
    let evalDate;
    let evalPeriod;
    let yearDisplay;
    let prevYearBtn;
    let nextYearBtn;
    let quarterBtns;
    let keyStrengths;
    let improvementAreas;
    let evaluatorComments;
    let developmentGoals;
    
    // Initialize evaluation functionality
    function init() {
        try {
            // Get the evaluation form and related elements
            evaluationForm = document.getElementById('evaluationForm');
            saveEvaluationBtn = document.getElementById('saveEvaluationBtn');
            overallPerformance = document.getElementById('overallPerformance');
            ratingValue = document.getElementById('ratingValue');
            evalEmployeeName = document.getElementById('evalEmployeeName');
            evalEmployeeAvatar = document.getElementById('evalEmployeeAvatar');
            evalPosition = document.getElementById('evalPosition');
            evalDate = document.getElementById('evalDate');
            evalPeriod = document.getElementById('evalPeriod');
            keyStrengths = document.getElementById('keyStrengths');
            improvementAreas = document.getElementById('improvementAreas');
            evaluatorComments = document.getElementById('evaluatorComments');
            developmentGoals = document.getElementById('developmentGoals');
            
            // No longer needed since we're using a select dropdown
            
            if (!evaluationForm || !saveEvaluationBtn) {
                console.error('Required evaluation elements not found');
                return;
            }
            
            // Set current date
            const currentDate = new Date();
            if (evalDate) {
                evalDate.textContent = formatDate(currentDate.toISOString());
            }
            
            // Set default evaluation period
            setDefaultEvaluationPeriod();
            
            // Initialize rating slider
            if (overallPerformance && ratingValue) {
                overallPerformance.addEventListener('input', updateRatingDisplay);
                // Initialize rating display
                updateRatingDisplay();
            }
            
            // We're now using structured inputs for evaluation period
            // No need for input validation on the hidden field
            
            // Add event listener for save button
            saveEvaluationBtn.addEventListener('click', validateAndSaveEvaluation);
            
            // Add event listeners for team member selection (from dropdown actions)
            document.querySelectorAll('.dropdown-item[data-bs-toggle="modal"][data-bs-target="#evaluationModal"]').forEach(item => {
                item.addEventListener('click', function() {
                    const row = this.closest('tr');
                    if (row) {
                        // Get member ID for saving
                        currentMemberId = row.getAttribute('data-member-id') || '';
                        
                        if (!currentMemberId) {
                            console.error('No member ID found for this row');
                            showToastNotification('Error: Cannot identify team member.', 'danger');
                            return;
                        }
                        
                        // Get member name and set avatar initials
                        const nameElement = row.querySelector('h6');
                        if (nameElement && evalEmployeeName) {
                            const fullName = nameElement.textContent.trim();
                            evalEmployeeName.textContent = fullName;
                            
                            // Set avatar initials
                            if (evalEmployeeAvatar) {
                                const nameParts = fullName.split(' ');
                                let initials = nameParts[0][0] || '';
                                if (nameParts.length > 1) {
                                    initials += nameParts[nameParts.length - 1][0] || '';
                                }
                                evalEmployeeAvatar.textContent = initials.toUpperCase();
                            }
                        }
                        
                        // Get position
                        const positionElement = row.querySelector('small');
                        if (positionElement && evalPosition) {
                            evalPosition.textContent = positionElement.textContent.trim();
                        }
                        
                        // Reset form fields - always start with a new evaluation
                        resetEvaluationForm();
                        
                        // Always create a new evaluation, don't load existing ones
                    }
                });
            });
            
            // Set default evaluation period
            setDefaultEvaluationPeriod();
        } catch (error) {
            console.error('Error initializing evaluation module:', error);
        }
    }
    
    // Note: initQuarterPicker function has been removed as it's no longer used
    
    // Set default evaluation period
    function setDefaultEvaluationPeriod() {
        // Get the individual input elements
        const quarterSelect = document.getElementById('quarterSelect');
        const startYear = document.getElementById('startYear');
        const endYear = document.getElementById('endYear');
        
        if (!quarterSelect || !startYear || !endYear || !evalPeriod) {
            return;
        }
        
        // Get current date
        const currentDate = new Date();
        const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
        const currentYear = currentDate.getFullYear();
        
        // Set default values
        quarterSelect.value = currentQuarter;
        startYear.value = currentYear;
        endYear.value = currentYear + 1;
        
        // Update the hidden field with the formatted value
        updateEvaluationPeriod();
        
        // Add event listeners to update the hidden field when any component changes
        quarterSelect.addEventListener('change', updateEvaluationPeriod);
        startYear.addEventListener('input', updateEvaluationPeriod);
        endYear.addEventListener('input', updateEvaluationPeriod);
        
        // Add validation for end year to be after start year
        startYear.addEventListener('change', function() {
            if (this.value && endYear.value && parseInt(endYear.value) < parseInt(this.value)) {
                endYear.value = parseInt(this.value) + 1;
                updateEvaluationPeriod();
            }
        });
    }
    
    // Update the hidden evaluation period field
    function updateEvaluationPeriod() {
        const quarterSelect = document.getElementById('quarterSelect');
        const startYear = document.getElementById('startYear');
        const endYear = document.getElementById('endYear');
        
        if (!quarterSelect || !startYear || !endYear || !evalPeriod) {
            return;
        }
        
        // Format as QQ(YYYY-YYYY)
        evalPeriod.value = `Q${quarterSelect.value}(${startYear.value}-${endYear.value})`;
    }
    
    // Update rating display based on slider value
    function updateRatingDisplay() {
        if (!overallPerformance || !ratingValue) return;
        
        const value = parseInt(overallPerformance.value);
        let color = '';
        
        // Determine color based on percentage using a gradient
        if (value < 25) {
            // Red to Orange gradient (from #dc3545 to #fd7e14)
            const ratio = value / 25;
            const r = Math.floor(220 + (253 - 220) * ratio);
            const g = Math.floor(53 + (126 - 53) * ratio);
            const b = Math.floor(69 + (20 - 69) * ratio);
            color = `rgb(${r}, ${g}, ${b})`;
        } else if (value < 50) {
            // Orange to Yellow gradient (from #fd7e14 to #ffc107)
            const ratio = (value - 25) / 25;
            const r = Math.floor(253 + (255 - 253) * ratio);
            const g = Math.floor(126 + (193 - 126) * ratio);
            const b = Math.floor(20 + (7 - 20) * ratio);
            color = `rgb(${r}, ${g}, ${b})`;
        } else if (value < 75) {
            // Yellow to Blue gradient (from #ffc107 to #0d6efd)
            const ratio = (value - 50) / 25;
            const r = Math.floor(255 - (255 - 13) * ratio);
            const g = Math.floor(193 - (193 - 110) * ratio);
            const b = Math.floor(7 + (253 - 7) * ratio);
            color = `rgb(${r}, ${g}, ${b})`;
        } else {
            // Blue to Green gradient (from #0d6efd to #198754)
            const ratio = (value - 75) / 25;
            const r = Math.floor(13 + (25 - 13) * ratio);
            const g = Math.floor(110 + (135 - 110) * ratio);
            const b = Math.floor(253 - (253 - 84) * ratio);
            color = `rgb(${r}, ${g}, ${b})`;
        }
        
        // Update the progress bar width and color
        const progressBar = document.getElementById('ratingProgressBar');
        if (progressBar) {
            progressBar.style.width = `${value}%`;
            progressBar.style.backgroundColor = color;
        }
        
        // Update the display
        ratingValue.textContent = `${value}%`;
        ratingValue.style.backgroundColor = color;
        
        // Update the thumb position for the custom slider
        const rangeThumb = document.getElementById('rangeThumb');
        if (rangeThumb) {
            // Calculate the position as a percentage
            rangeThumb.style.left = `${value}%`;
        }
    }
    
    // Reset evaluation form fields
    function resetEvaluationForm() {
        if (overallPerformance) {
            overallPerformance.value = '75';
            updateRatingDisplay();
        }
        if (keyStrengths) keyStrengths.value = '';
        if (improvementAreas) improvementAreas.value = '';
        if (evaluatorComments) evaluatorComments.value = '';
        if (developmentGoals) developmentGoals.value = '';
        
        // Remove any validation error classes
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        
        // Remove any validation error messages
        document.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });
    }
    
    // Note: loadExistingEvaluation function has been removed as it's no longer used
    
    // Save evaluation to localStorage
    function saveEvaluationToStorage(evaluation) {
        try {
            // Get existing evaluations
            let evaluations = [];
            try {
                const stored = localStorage.getItem('teamEvaluations');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    evaluations = Array.isArray(parsed) ? parsed : [];
                }
            } catch (e) {
                console.error('Error parsing stored evaluations:', e);
                evaluations = [];
            }
            
            // Check if this is an update to an existing evaluation
            const existingIndex = evaluations.findIndex(e => e && e.memberId === evaluation.memberId);
            
            if (existingIndex >= 0) {
                // Update existing evaluation
                evaluations[existingIndex] = evaluation;
            } else {
                // Add new evaluation
                evaluations.push(evaluation);
            }
            
            // Save back to localStorage
            localStorage.setItem('teamEvaluations', JSON.stringify(evaluations));
        } catch (error) {
            console.error('Error saving evaluation to storage:', error);
            throw error; // Re-throw to be caught by the caller
        }
    }
    
    // Note: updateScoreBadgeColor, updateProgressBarColor, and updateOverallRating functions have been removed as they're no longer used
    
    // Note: addInputField function has been removed as it's no longer used
    
    // Save evaluation data
    function validateAndSaveEvaluation() {
        try {
            if (!evaluationForm || !currentMemberId) {
                showToast('Missing required data', 'error');
                return;
            }
            
            // Validate form
            if (!ProjectManager.FormValidation.validateForm(evaluationForm)) {
                // Show validation error notification
                showToast('Please correct the errors in the form', 'warning');
                return;
            }
            
            // Validate that end year is after or equal to start year
            const startYear = document.getElementById('startYear').value;
            const endYear = document.getElementById('endYear').value;
            if (parseInt(endYear) < parseInt(startYear)) {
                showToast('End year must be after or equal to start year', 'warning');
                return;
            }
            
            // Get form values
            const employeeName = evalEmployeeName.textContent.trim();
            const position = evalPosition ? evalPosition.textContent.trim() : '';
            const period = evalPeriod.value.trim();
            const rating = overallPerformance.value;
            const strengths = keyStrengths ? keyStrengths.value.trim() : '';
            const improvements = improvementAreas ? improvementAreas.value.trim() : '';
            const comments = evaluatorComments.value.trim();
            const goals = developmentGoals ? developmentGoals.value.trim() : '';
            
            // Create evaluation object
            const evaluation = {
                id: Date.now().toString(),
                memberId: currentMemberId,
                employeeName,
                position,
                period,
                rating,
                strengths,
                improvements,
                comments,
                goals,
                date: evalDate ? evalDate.textContent : formatDate(new Date().toISOString()),
                lastUpdated: new Date().toISOString()
            };
            
            // Save to localStorage
            saveEvaluationToStorage(evaluation);
            
            // Update team member performance in the table
            updateTeamMemberPerformance(employeeName, rating);
            
            // Show success notification
            showToast(
                `Performance evaluation for ${employeeName} has been submitted successfully`, 
                'success'
            );
            
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('evaluationModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset form validation
            ProjectManager.FormValidation.resetValidation(evaluationForm);
            
        } catch (error) {
            console.error('Error saving evaluation:', error);
            showToast('An error occurred while submitting the evaluation', 'error');
        }
    }
    
    // Function to reset form validation state
    function resetValidationState() {
        // Use the new form validation system
        ProjectManager.FormValidation.resetValidation(evaluationForm);
    }
    
    // Use the new notification system
    function showToastNotification(message, type) {
        // Map old types to new notification system types
        let notificationType = 'info';
        switch(type) {
            case 'success':
                notificationType = 'success';
                break;
            case 'danger':
                notificationType = 'error';
                break;
            case 'warning':
                notificationType = 'warning';
                break;
        }
        
        // Use the new notification system
        showToast(message, notificationType);
    }
    
    // Update team member performance in the table
    function updateTeamMemberPerformance(employeeName, overallRating) {
        try {
            // Find the team member row in the table
            const tableRows = document.querySelectorAll('#teamMembersTable tbody tr');
            for (let i = 0; i < tableRows.length; i++) {
                const nameElement = tableRows[i].querySelector('h6');
                if (nameElement && nameElement.textContent.trim() === employeeName.trim()) {
                    // Update the progress bar
                    const progressBar = tableRows[i].querySelector('.progress-bar');
                    const progressText = tableRows[i].querySelector('small.text-muted');
                    
                    if (progressBar && progressText) {
                        // Convert rating to percentage based on 1-5 scale or use as-is if already percentage
                        let percentValue;
                        if (overallRating >= 1 && overallRating <= 5) {
                            // Convert 1-5 scale to percentage (1=20%, 2=40%, 3=60%, 4=80%, 5=100%)
                            percentValue = overallRating * 20;
                        } else {
                            // Assume it's already a percentage
                            percentValue = parseInt(overallRating);
                        }
                        
                        // Update progress bar
                        progressBar.style.width = percentValue + '%';
                        progressBar.setAttribute('aria-valuenow', percentValue);
                        
                        // Update text based on rating type
                        if (overallRating >= 1 && overallRating <= 5) {
                            // Show rating out of 5
                            progressText.textContent = overallRating + '/5';
                        } else {
                            // Show as percentage
                            progressText.textContent = percentValue + '%';
                        }
                        
                        // Update progress bar color
                        progressBar.className = 'progress-bar';
                        if (percentValue >= 80) { // 4-5 rating or 80-100%
                            progressBar.classList.add('bg-success');
                        } else if (percentValue >= 60) { // 3 rating or 60-79%
                            progressBar.classList.add('bg-primary');
                        } else if (percentValue >= 40) { // 2 rating or 40-59%
                            progressBar.classList.add('bg-warning');
                        } else { // 1 rating or <40%
                            progressBar.classList.add('bg-danger');
                        }
                        
                        // Add a badge to show the evaluation is complete
                        const statusCell = tableRows[i].querySelector('td:last-child');
                        if (statusCell) {
                            // Check if evaluation badge already exists
                            let evalBadge = statusCell.querySelector('.badge-evaluation');
                            if (!evalBadge) {
                                // Create a new badge
                                evalBadge = document.createElement('span');
                                evalBadge.className = 'badge bg-info ms-2 badge-evaluation';
                                evalBadge.textContent = 'Evaluated';
                                statusCell.appendChild(evalBadge);
                            }
                        }
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error updating team member performance:', error);
        }
    }
    
    // Format a date string
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    // Public API
    return {
        init: init,
        saveEvaluation: validateAndSaveEvaluation, // Updated to use the new function name
        saveEvaluationToStorage: saveEvaluationToStorage,
        showToastNotification: showToastNotification,
        updateTeamMemberPerformance: updateTeamMemberPerformance,
        formatDate: formatDate
    };
})();

// Initialize evaluation module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.Evaluation.init();
});