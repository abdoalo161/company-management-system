/**
 * Team Leader Team Members JavaScript
 * Handles team member list functionality and bootstrap components
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Team Members Management Module
ProjectManager.TeamMembers = (function() {
    // Initialize the module
    function init() {
        try {
            initBootstrapComponents();
            initSidebar();
            initChatFunctionality();
            initDeleteFunctionality();
            initEvaluationFunctionality();
            initAssignTaskFunctionality();
            
            // Initialization notification removed
        } catch (error) {
            console.error('Error initializing Team Members module:', error);
            showToast('Error initializing team members: ' + error.message, 'error');
        }
    }
    
    /**
     * Sidebar functionality has been removed as requested
     */
    function initSidebar() {
        // Sidebar toggle functionality has been removed while keeping the hamburger button in HTML
        console.log('Team Members page: Sidebar toggle functionality has been removed');
    }
    
    // Initialize Bootstrap components
    function initBootstrapComponents() {
        // Initialize tooltips
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        if (tooltips.length > 0 && typeof bootstrap !== 'undefined') {
            Array.from(tooltips).map(tooltip => new bootstrap.Tooltip(tooltip));
        }

        // Ensure all team member rows have data-member-id attributes
        document.querySelectorAll('tbody tr').forEach((row, index) => {
            if (!row.hasAttribute('data-member-id')) {
                row.setAttribute('data-member-id', `member-${index + 1}`);
            }
        });

        // Make sure all chat buttons have the correct member-id from their parent row
        document.querySelectorAll('.chat-with-member').forEach(button => {
            const row = button.closest('tr');
            if (row && row.hasAttribute('data-member-id')) {
                button.setAttribute('data-member-id', row.getAttribute('data-member-id'));
            }
        });

        // No dropdown initialization needed for static profile display
        
        // Initialize all modals
        const modals = document.querySelectorAll('.modal');
        if (modals.length > 0 && typeof bootstrap !== 'undefined') {
            Array.from(modals).forEach(modal => {
                new bootstrap.Modal(modal, {
                    backdrop: 'static',
                    keyboard: true
                });
            });
        }
        
        // Set up assign task modal
        document.querySelectorAll('[data-bs-target="#assignTaskModal"]').forEach(button => {
            button.addEventListener('click', function(e) {
                // Get member data from the closest row
                const row = this.closest('tr');
                if (row) {
                    const memberId = row.getAttribute('data-member-id');
                    const nameElement = row.querySelector('h6');
                    const roleElement = row.querySelector('small.text-muted');
                    const avatarElement = row.querySelector('.avatar');
                    
                    // Set member data in the modal
                    const assignTaskMemberName = document.getElementById('assignTaskMemberName');
                    const assignTaskMemberRole = document.getElementById('assignTaskMemberRole');
                    const assignTaskAvatar = document.getElementById('assignTaskAvatar');
                    const assignTaskHeaderAvatar = document.getElementById('assignTaskHeaderAvatar');
                    
                    if (nameElement && assignTaskMemberName) {
                        const memberName = nameElement.textContent.trim();
                        assignTaskMemberName.textContent = memberName;
                        
                        // Set the initials in the header avatar
                        if (assignTaskHeaderAvatar) {
                            // Get initials from name (first letter of first name and first letter of last name)
                            const nameParts = memberName.split(' ');
                            let initials = nameParts[0][0]; // First letter of first name
                            
                            // Add first letter of last name if it exists
                            if (nameParts.length > 1) {
                                initials += nameParts[nameParts.length - 1][0];
                            }
                            
                            assignTaskHeaderAvatar.textContent = initials.toUpperCase();
                        }
                    }
                    
                    if (roleElement && assignTaskMemberRole) {
                        assignTaskMemberRole.textContent = roleElement.textContent;
                    }
                    
                    if (avatarElement && assignTaskAvatar) {
                        assignTaskAvatar.textContent = avatarElement.textContent.trim();
                        assignTaskAvatar.className = avatarElement.className;
                    }
                }
            });
        });
    }
    
    // Initialize chat functionality
    function initChatFunctionality() {
        // Add global click event listener for chat buttons
        document.addEventListener('click', function(e) {
            const chatButton = e.target.closest('.chat-with-member');
            if (chatButton) {
                e.preventDefault();
                e.stopPropagation(); // Prevent dropdown from closing
                
                // Get the member ID
                const memberId = chatButton.getAttribute('data-member-id');
                if (!memberId) return;
                
                // Get the member name from the row
                const row = document.querySelector(`tr[data-member-id="${memberId}"]`);
                let memberName = '';
                
                if (row) {
                    const nameElement = row.querySelector('h6');
                    if (nameElement) {
                        memberName = nameElement.textContent.trim();
                    }
                }
                
                // If we couldn't find the name from the row, try to get it from the button's parent row
                if (!memberName && chatButton.closest('tr')) {
                    const nameElement = chatButton.closest('tr').querySelector('h6');
                    if (nameElement) {
                        memberName = nameElement.textContent.trim();
                    }
                }
                
                // Open the chat modal with the member's information
                openChatModal(memberId, memberName);
            }
        });
        
        // Handle send message button in chat modal
        const sendButton = document.getElementById('individualSendButton');
        if (sendButton) {
            sendButton.addEventListener('click', function() {
                sendChatMessage();
            });
        }
        
        // Handle enter key in message input
        const messageInput = document.getElementById('individualMessageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
        }
    }
    
    // Initialize delete functionality
    function initDeleteFunctionality() {
        // Add global click event listener for delete buttons
        document.addEventListener('click', function(e) {
            const deleteButton = e.target.closest('.delete-member');
            if (deleteButton) {
                e.preventDefault();
                e.stopPropagation(); // Prevent dropdown from closing
                
                // Get the member ID
                const memberId = deleteButton.getAttribute('data-member-id');
                if (!memberId) return;
                
                // Confirm deletion
                if (confirm('Are you sure you want to delete this team member?')) {
                    deleteTeamMember(memberId);
                }
            }
        });
    }
    
    // Initialize evaluation functionality
    function initEvaluationFunctionality() {
        // Handle evaluation form submission
        const evaluationForm = document.getElementById('evaluationForm');
        if (evaluationForm) {
            evaluationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                submitEvaluation(this);
            });
        }

        // Set up modal data when evaluation button is clicked
        document.querySelectorAll('[data-bs-target="#evaluationModal"]').forEach(button => {
            button.addEventListener('click', function() {
                // Get member data from the closest row
                const row = this.closest('tr');
                if (row) {
                    const memberId = row.getAttribute('data-member-id');
                    const nameElement = row.querySelector('h6');
                    const roleElement = row.querySelector('small.text-muted');
                    const avatarElement = row.querySelector('.avatar');
                    
                    // Set member data in the modal
                    const evalEmployeeName = document.getElementById('evalEmployeeName');
                    const evalPosition = document.getElementById('evalPosition');
                    const evalEmployeeAvatar = document.getElementById('evalEmployeeAvatar');
                    
                    if (nameElement && evalEmployeeName) {
                        evalEmployeeName.textContent = nameElement.textContent;
                        // Also set it as a hidden input for the form
                        let memberNameInput = document.querySelector('input[name="memberName"]');
                        if (!memberNameInput && evaluationForm) {
                            memberNameInput = document.createElement('input');
                            memberNameInput.type = 'hidden';
                            memberNameInput.name = 'memberName';
                            evaluationForm.appendChild(memberNameInput);
                        }
                        if (memberNameInput) {
                            memberNameInput.value = nameElement.textContent;
                        }
                    }
                    
                    if (roleElement && evalPosition) {
                        evalPosition.textContent = roleElement.textContent;
                    }
                    
                    if (avatarElement && evalEmployeeAvatar) {
                        evalEmployeeAvatar.textContent = avatarElement.textContent.trim();
                        evalEmployeeAvatar.className = avatarElement.className;
                    }
                }
            });
        });

        // Set up evaluation period fields
        const quarterSelect = document.getElementById('evaluationQuarter');
        const startYearInput = document.getElementById('startYear');
        const endYearInput = document.getElementById('endYear');
    }
        
    // Submit team member evaluation
    function submitEvaluation(form) {
        if (!form) return;
        
        // Get form data
        const formData = new FormData(form);
        const evaluationData = Object.fromEntries(formData.entries());
        
        // Show success message with toast if available, otherwise use alert
        if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
            ProjectManager.AdminPanel.NotificationSystem.success('Evaluation submitted successfully!', '');
        } else {
            showToast('Evaluation submitted successfully!', 'success');
        }
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('evaluationModal'));
        if (modal) {
            modal.hide();
        }
        
        // Reset form
        form.reset();
    }
    
    // Initialize assign task functionality
    function initAssignTaskFunctionality() {
        // Set current date as default for start date
        const taskStartDate = document.getElementById('taskStartDate');
        if (taskStartDate) {
            const today = new Date();
            taskStartDate.value = today.toISOString().split('T')[0];
            
            // Set default due date to 7 days from now
            const taskDueDate = document.getElementById('taskDueDate');
            if (taskDueDate) {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 7);
                taskDueDate.value = dueDate.toISOString().split('T')[0];
            }
        }
        
        // The assign task button is now handled by task-management.js
        
        // Set up modal data when assign task button is clicked
        document.querySelectorAll('[data-bs-target="#assignTaskModal"]').forEach(button => {
            button.addEventListener('click', function(e) {
                // Get member data from the closest row
                const row = this.closest('tr');
                if (row) {
                    const memberId = row.getAttribute('data-member-id');
                    const nameElement = row.querySelector('h6');
                    const roleElement = row.querySelector('small.text-muted');
                    const avatarElement = row.querySelector('.avatar');
                    
                    // Set member data in the modal
                    const assignTaskMemberName = document.getElementById('assignTaskMemberName');
                    const assignTaskMemberRole = document.getElementById('assignTaskMemberRole');
                    const assignTaskAvatar = document.getElementById('assignTaskAvatar');
                    const assignTaskHeaderAvatar = document.getElementById('assignTaskHeaderAvatar');
                    const assignTaskMemberId = document.getElementById('assignTaskMemberId');
                    
                    if (memberId && assignTaskMemberId) {
                        assignTaskMemberId.value = memberId;
                    }
                    
                    if (nameElement && assignTaskMemberName) {
                        const memberName = nameElement.textContent.trim();
                        assignTaskMemberName.textContent = memberName;
                        
                        // Set the initials in the header avatar
                        if (assignTaskHeaderAvatar) {
                            // Get initials from name (first letter of first name and first letter of last name)
                            const nameParts = memberName.split(' ');
                            let initials = nameParts[0][0]; // First letter of first name
                            
                            // Add first letter of last name if it exists
                            if (nameParts.length > 1) {
                                initials += nameParts[nameParts.length - 1][0];
                            }
                            
                            assignTaskHeaderAvatar.textContent = initials.toUpperCase();
                        }
                    }
                    
                    if (roleElement && assignTaskMemberRole) {
                        assignTaskMemberRole.textContent = roleElement.textContent;
                    }
                    
                    if (avatarElement && assignTaskAvatar) {
                        assignTaskAvatar.textContent = avatarElement.textContent.trim();
                        assignTaskAvatar.className = avatarElement.className;
                    }
                    
                    // Reset form
                    const form = document.getElementById('assignTaskForm');
                }
            });
        });
        
        // Set up date inputs
        const taskStartDateInput = document.getElementById('taskStartDate');
        const taskDueDateInput = document.getElementById('taskDueDate');
    }
    

    
    // This function is now handled by task-management.js
    function submitAssignTask(form) {
        console.log('This function is deprecated. Task assignment is now handled by task-management.js');
        // Let task-management.js handle this functionality
        return false;
    }
    
    // Send chat message
    function sendChatMessage() {
        const messageInput = document.getElementById('individualMessageInput');
        if (!messageInput || !messageInput.value.trim()) return;
        
        const message = messageInput.value.trim();
        const chatMessages = document.getElementById('individualChatMessages');
        
        if (chatMessages) {
            // Create message element (your message - no name needed)
            const messageElement = document.createElement('div');
            messageElement.className = 'message message-admin';
            messageElement.innerHTML = `
                <div class="message-content">${message}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            `;
            
            // Add to chat
            chatMessages.appendChild(messageElement);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Get member name from the modal data attribute
            const chatModal = document.getElementById('chatModal');
            const memberName = chatModal.getAttribute('data-member-name') || '';
            
            // Simulate response after delay
            setTimeout(() => {
                const responseElement = document.createElement('div');
                responseElement.className = 'message message-team';
                responseElement.innerHTML = `
                    <div class="sender-name">${memberName}</div>
                    <div class="message-content">Thank you for your message. I'll get back to you soon.</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                chatMessages.appendChild(responseElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
    
    // Open chat modal with team member
    function openChatModal(memberId, memberName) {
        // Find the chat modal
        const chatModal = document.getElementById('chatModal');
        if (!chatModal) return;
        
        // If memberName is empty, try to get it from the row
        if (!memberName) {
            const row = document.querySelector(`tr[data-member-id="${memberId}"]`);
            if (row) {
                const nameElement = row.querySelector('h6');
                if (nameElement) {
                    memberName = nameElement.textContent.trim();
                }
            }
        }
        
        // Set the member name in the modal title
        const modalTitle = chatModal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Chat with ${memberName}`;
        }
        
        // Set the member name in the span element
        const chatMemberNameSpan = document.getElementById('chatMemberName');
        if (chatMemberNameSpan) {
            chatMemberNameSpan.textContent = memberName;
        }
        
        // Store the member name as a data attribute on the modal for later use
        chatModal.setAttribute('data-member-name', memberName);
        
        // Set the member ID as a data attribute on the modal
        chatModal.setAttribute('data-member-id', memberId);
        
        // Set the avatar initials
        const chatMemberAvatar = document.getElementById('chatMemberAvatar');
        if (chatMemberAvatar && memberName) {
            // Get initials from name (first letter of first name and first letter of last name)
            const nameParts = memberName.split(' ');
            let initials = nameParts[0][0]; // First letter of first name
            
            // Add first letter of last name if it exists
            if (nameParts.length > 1) {
                initials += nameParts[nameParts.length - 1][0];
            }
            
            chatMemberAvatar.textContent = initials.toUpperCase();
        }
        
        // Clear previous chat messages
        const chatMessages = document.getElementById('individualChatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            
            // Add a welcome message
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'message system-message';
            welcomeMessage.innerHTML = `<div class="message-content">Chat session started with ${memberName}</div>`;
            chatMessages.appendChild(welcomeMessage);
            
            // Add a sample message from the team member
            setTimeout(() => {
                const teamMemberMessage = document.createElement('div');
                teamMemberMessage.className = 'message message-team';
                teamMemberMessage.innerHTML = `
                    <div class="sender-name">${memberName}</div>
                    <div class="message-content">Hello! How can I help you today?</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                chatMessages.appendChild(teamMemberMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
        }
        
        // Show the modal
        const modal = new bootstrap.Modal(chatModal);
        modal.show();
        
        // Focus on the input field
        setTimeout(() => {
            const inputField = document.getElementById('individualMessageInput');
            if (inputField) inputField.focus();
        }, 500);
    }
    
    // Delete team member
    function deleteTeamMember(memberId) {
        // Find the team member row
        const memberRow = document.querySelector(`tr[data-member-id="${memberId}"]`);
        if (!memberRow) return;
        
        // Get member name for notification
        const nameElement = memberRow.querySelector('h6');
        const memberName = nameElement ? nameElement.textContent.trim() : 'Team Member';
        
        // Remove the row with animation
        memberRow.style.transition = 'opacity 0.3s, transform 0.3s';
        memberRow.style.opacity = '0';
        memberRow.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            memberRow.remove();
            
            // Show notification
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.success(`${memberName} has been removed from the team`, '');
            } else {
                showToast(`${memberName} has been removed from the team`, 'success');
            }
        }, 300);
    }
    
    // Return public methods
    return {
        init: init
    };
})();

// Initialize the module when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.TeamMembers.init();
});
