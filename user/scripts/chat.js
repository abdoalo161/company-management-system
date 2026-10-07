/**
 * User Chat Functionality
 * Handles chat with team leader and admin
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Chat module
ProjectManager.Chat = (function() {
    // Private variables and functions
    let teamLeaderChatMessages;
    let teamLeaderChatInput;
    let teamLeaderChatForm;
    let teamLeaderSendBtn;
    
    // Sidebar toggle functionality has been completely removed
    
    let adminChatMessages;
    let adminChatInput;
    let adminChatForm;
    let adminSendBtn;
    
    let groupChatMessages;
    let groupChatInput;
    let groupChatForm;
    let groupSendBtn;
    
    // Function to send message to team leader
    function sendTeamLeaderMessage() {
        const message = teamLeaderChatInput.value.trim();
        if (message === '') return;
        
        // Get current time
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Add message to chat
        addMessageToChat(teamLeaderChatMessages, message, 'You', timeString, true);
        
        // Clear input
        teamLeaderChatInput.value = '';
        
        // Simulate team leader response after a delay
        setTimeout(() => {
            const responses = [
                "Thanks for the update!",
                "That sounds good. Keep up the great work!",
                "I'll check in with you later to see how it's going.",
                "Do you need any help with that?",
                "Let me know if you run into any issues."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(teamLeaderChatMessages, randomResponse, 'Team Leader', timeString, false);
        }, 2000);
    }
    
    // Function to send message to admin
    function sendAdminMessage() {
        const message = adminChatInput.value.trim();
        if (message === '') return;
        
        // Get current time
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Add message to chat
        addMessageToChat(adminChatMessages, message, 'You', timeString, true);
        
        // Clear input
        adminChatInput.value = '';
        
        // Simulate admin response after a delay
        setTimeout(() => {
            const responses = [
                "Thank you for the information.",
                "I appreciate your hard work on this project.",
                "That's good to hear. Is there anything you need from me?",
                "I'll make a note of that. Keep up the good work!",
                "Feel free to reach out if you need any resources or support."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(adminChatMessages, randomResponse, 'Admin', timeString, false);
        }, 2000);
    }
    
    // Function to send message to group
    function sendGroupMessage() {
        const message = groupChatInput.value.trim();
        if (message === '') return;
        
        // Get current time
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Add message to chat
        addMessageToChat(groupChatMessages, message, 'You', timeString, true);
        
        // Clear input
        groupChatInput.value = '';
        
        // Simulate group response after a delay
        setTimeout(() => {
            const responses = [
                "Thanks for sharing!",
                "Great point!",
                "I agree!",
                "That's a good idea!",
                "Let's discuss this further."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(groupChatMessages, randomResponse, 'Group Member', timeString, false);
        }, 2000);
    }
    
    // Function to add message to chat
    function addMessageToChat(chatContainer, message, sender, time, isSent) {
        const messageElement = document.createElement('div');
        messageElement.className = isSent ? 'message message-sent' : 'message message-received';
        
        // Create sender section
        const senderElement = document.createElement('div');
        
        if (isSent) {
            // For sent messages, use the sender-right-aligned class
            senderElement.className = 'sender-right-aligned';
            
            // Get user data
            let userData = { fullName: 'You', initials: 'AM' };
            if (window.ProjectManager && ProjectManager.UserData) {
                userData = ProjectManager.UserData.getUserData();
            }
            
            // Create name span
            const nameSpan = document.createElement('span');
            nameSpan.textContent = userData.fullName || 'You';
            
            // Create avatar
            let avatarElement;
            if (userData.profilePicture) {
                // Use profile picture if available
                avatarElement = document.createElement('img');
                avatarElement.src = userData.profilePicture;
                avatarElement.className = 'message-sender-avatar rounded-circle';
                avatarElement.alt = userData.fullName || 'You';
                avatarElement.onerror = function() {
                    this.onerror = null;
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                    this.classList.add('bg-success', 'text-white', 'p-1');
                };
            } else {
                // Use initials if no profile picture
                avatarElement = document.createElement('div');
                avatarElement.className = 'message-sender-avatar bg-success text-white';
                avatarElement.textContent = userData.initials || 'AM';
            }
            
            // Add elements to sender section
            senderElement.appendChild(nameSpan);
            senderElement.appendChild(avatarElement);
        } else {
            // For received messages, use the original message-sender class
            senderElement.className = 'message-sender';
            
            // Create avatar
            const avatarElement = document.createElement('div');
            avatarElement.className = 'message-sender-avatar';
            avatarElement.classList.add('bg-' + (sender === 'Team Leader' ? 'primary' : 'danger'), 'text-white');
            avatarElement.textContent = sender.split(' ').map(word => word[0]).join('');
            
            // Add elements to sender section
            senderElement.appendChild(avatarElement);
            senderElement.appendChild(document.createTextNode(sender));
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const messageInfo = document.createElement('div');
        messageInfo.className = 'message-info';
        messageInfo.textContent = time;
        
        messageElement.appendChild(senderElement);
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageInfo);
        
        chatContainer.appendChild(messageElement);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    /**
     * Update hardcoded example messages with user profile data
     */
    function updateExampleMessages() {
        try {
            if (window.ProjectManager && ProjectManager.UserData) {
                const userData = ProjectManager.UserData.getUserData();
                console.log('Updating example messages with user data:', userData);
                
                // Find all elements with IDs starting with user-name-
                const userNameElements = document.querySelectorAll('[id^="user-name-"]');
                userNameElements.forEach(element => {
                    element.textContent = userData.fullName || 'You';
                });
                
                // Find all elements with IDs starting with user-avatar-
                const userAvatarElements = document.querySelectorAll('[id^="user-avatar-"]');
                userAvatarElements.forEach(avatarElement => {
                    if (userData.profilePicture) {
                        // Create a new image element
                        const img = document.createElement('img');
                        img.src = userData.profilePicture;
                        img.className = 'message-sender-avatar rounded-circle';
                        img.alt = userData.fullName || 'You';
                        img.id = avatarElement.id; // Keep the same ID
                        img.onerror = function() {
                            this.onerror = null;
                            this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                            this.classList.add('bg-success', 'text-white', 'p-1');
                        };
                        
                        // Replace the old avatar with the new image
                        avatarElement.parentNode.replaceChild(img, avatarElement);
                    }
                });
            }
        } catch (error) {
            console.error('Error updating example messages:', error);
        }
    }
    
    // Public methods and initialization
    return {
        init: function() {
            // Sidebar toggle functionality has been removed
            
            // DOM Elements - Team Leader Chat
            teamLeaderChatMessages = document.getElementById('teamLeaderChatMessages');
            teamLeaderChatInput = document.getElementById('team-leader-chat-input');
            teamLeaderChatForm = document.getElementById('team-leader-chat-form');
            teamLeaderSendBtn = document.getElementById('team-leader-send-btn');
            
            // DOM Elements - Admin Chat
            adminChatMessages = document.getElementById('adminChatMessages');
            adminChatInput = document.getElementById('admin-chat-input');
            adminChatForm = document.getElementById('admin-chat-form');
            adminSendBtn = document.getElementById('admin-send-btn');
            
            // DOM Elements - Group Chat
            groupChatMessages = document.getElementById('groupChatMessages');
            groupChatInput = document.getElementById('group-chat-input');
            groupChatForm = document.getElementById('group-chat-form');
            groupSendBtn = document.getElementById('group-send-btn');
            
            // Team Leader Chat Event Listeners
            if (teamLeaderChatForm && teamLeaderChatInput && teamLeaderSendBtn) {
                teamLeaderChatForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    sendTeamLeaderMessage();
                });
                
                teamLeaderSendBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    sendTeamLeaderMessage();
                });
            }
            
            // Admin Chat Event Listeners
            if (adminChatForm && adminChatInput && adminSendBtn) {
                adminChatForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    sendAdminMessage();
                });
                
                adminSendBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    sendAdminMessage();
                });
            }
            
            // Group Chat Event Listeners
            if (groupChatForm && groupChatInput && groupSendBtn) {
                groupChatForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    sendGroupMessage();
                });
                
                groupSendBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    sendGroupMessage();
                });
            }
            
            // Initialize chat tabs
            const chatTabs = document.querySelectorAll('button[data-bs-toggle="tab"]');
            chatTabs.forEach(tab => {
                tab.addEventListener('shown.bs.tab', function (e) {
                    // Scroll to bottom of active chat
                    if (e.target.id === 'team-leader-tab' && teamLeaderChatMessages) {
                        teamLeaderChatMessages.scrollTop = teamLeaderChatMessages.scrollHeight;
                    } else if (e.target.id === 'admin-tab' && adminChatMessages) {
                        adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
                    } else if (e.target.id === 'group-tab' && groupChatMessages) {
                        groupChatMessages.scrollTop = groupChatMessages.scrollHeight;
                    }
                });
            });
        }
    };
})();

// Initialize the modules when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user profile
    if (typeof ProjectManager.UserProfile !== 'undefined') {
        ProjectManager.UserProfile.init();
    }
    
    // Initialize chat functionality including sidebar toggle
    if (typeof ProjectManager.Chat !== 'undefined') {
        ProjectManager.Chat.init();
    }
    
    // Update example messages with user profile data
    if (typeof updateExampleMessages === 'function') {
        updateExampleMessages();
    }
    
    // Listen for user data changes
    document.addEventListener('userDataChanged', function(event) {
        // Only update if this is for the user portal
        if (event.detail && event.detail.portal === 'user') {
            if (typeof updateExampleMessages === 'function') {
                updateExampleMessages();
            }
        }
    });
});
