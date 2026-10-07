/**
 * Team Leader Chat Functionality
 * Handles chat with admin and team members
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Chat module
ProjectManager.Chat = (function() {
    // Private variables and functions
    let adminChatMessages;
    let adminMessageInput;
    let adminSendButton;
    
    let teamChatMessages;
    let teamMessageInput;
    let teamSendButton;
    let teamMembers;
    
    let groupChatMessages;
    let groupMessageInput;
    let groupSendButton;
    
    // Current selected team member
    let currentTeamMember = {
        id: 1,
        name: "John Davis",
        role: "Frontend Developer"
    };    // Sample chat messages for demo
    const teamMemberMessages = {
        1: [
            { sender: "team", message: "Good morning! I've completed the homepage redesign.", time: "9:15 AM" },
            { sender: "team-leader", message: "Great work, John! Can you share the link to the design files?", time: "9:17 AM" },
            { sender: "team", message: "Sure, here's the link: https://design.example.com/homepage-v2", time: "9:18 AM" },
            { sender: "team-leader", message: "Thanks! I'll review it and provide feedback by noon.", time: "9:20 AM" },
            { sender: "team", message: "Sounds good. I'll start working on the product page next.", time: "9:22 AM" }
        ],
        2: [
            { sender: "team-leader", message: "Hi Alice, how's the UI design coming along?", time: "Yesterday" },
            { sender: "team", message: "Going well! I'm finalizing the color palette and typography.", time: "Yesterday" },
            { sender: "team-leader", message: "Great! When do you think you'll have the mockups ready?", time: "Yesterday" },
            { sender: "team", message: "I should have them ready by tomorrow afternoon.", time: "Yesterday" }
        ],
        3: [
            { sender: "team", message: "I've deployed the new API endpoints to the staging environment.", time: "Monday" },
            { sender: "team-leader", message: "Thanks Robert! Are there any documentation updates needed?", time: "Monday" },
            { sender: "team", message: "Yes, I'll update the API docs today.", time: "Monday" }
        ],
        4: [
            { sender: "team-leader", message: "Maria, have you started testing the new features?", time: "Last Week" },
            { sender: "team", message: "Yes, I've found a few minor issues that I've documented in Jira.", time: "Last Week" },
            { sender: "team-leader", message: "Thanks for being thorough. Let's discuss them in our next standup.", time: "Last Week" }
        ],
        5: [
            { sender: "team", message: "The CI/CD pipeline is now fully automated.", time: "2 Weeks ago" },
            { sender: "team-leader", message: "That's excellent news, David! How much time does it save per deployment?", time: "2 Weeks ago" },
            { sender: "team", message: "About 45 minutes per deployment, and it reduces human error.", time: "2 Weeks ago" },
            { sender: "team-leader", message: "That's a significant improvement. Great work!", time: "2 Weeks ago" }
        ]
    };    // Function to send message to admin
    function sendAdminMessage() {
        try {
            if (!adminMessageInput || !adminChatMessages) {
                if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                    ProjectManager.AdminPanel.NotificationSystem.error('Chat elements not found', 'Chat Error');
                }
                return;
            }
            
            const message = adminMessageInput.value.trim();
            if (!message) {
                if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                    ProjectManager.AdminPanel.NotificationSystem.warning('Please enter a message', 'Chat');
                }
                return;
            }
            
            // Get current time
            const time = getCurrentTime();
            
            // Force refresh user data if possible
            if (window.ProjectManager && ProjectManager.UserData && ProjectManager.UserData.updateUI) {
                ProjectManager.UserData.updateUI();
            }
            
            // Add message to chat
            addMessageToAdminChat('team-leader', message, time);
            
            // Clear input
            adminMessageInput.value = '';
            
            // Show success notification if available
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.success('Message sent', '', 1000);
            }
        } catch (error) {
            console.error('Error sending admin message:', error);
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.error('Error sending message', error.message);
            }
        }
    }
    
    // Function to send message to team member
    function sendTeamMessage() {
        try {
            if (!teamMessageInput || !teamChatMessages) {
                if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                    ProjectManager.AdminPanel.NotificationSystem.error('Chat elements not found', 'Chat Error');
                }
                return;
            }
            
            const message = teamMessageInput.value.trim();
            if (!message) {
                if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                    ProjectManager.AdminPanel.NotificationSystem.warning('Please enter a message', 'Chat');
                }
                return;
            }
            
            // Get current time
            const time = getCurrentTime();
            
            // Force refresh user data if possible
            if (window.ProjectManager && ProjectManager.UserData && ProjectManager.UserData.updateUI) {
                ProjectManager.UserData.updateUI();
            }
            
            // Add message to chat
            addMessageToTeamChat('team-leader', message, time);
            
            // Store message in team member messages
            if (!teamMemberMessages[currentTeamMember.id]) {
                teamMemberMessages[currentTeamMember.id] = [];
            }
            
            teamMemberMessages[currentTeamMember.id].push({
                sender: 'team-leader',
                message: message,
                time: time
            });
            
            // Clear input
            teamMessageInput.value = '';
            
            // Show success notification if available
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.success('Message sent', '', 1000);
            }
        } catch (error) {
            console.error('Error sending team message:', error);
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.error('Error sending message', error.message);
            }
        }
    }
    
    // Function to send message to group
    function sendGroupMessage() {
        try {
            if (!groupMessageInput || !groupChatMessages) {
                if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                    ProjectManager.AdminPanel.NotificationSystem.error('Chat elements not found', 'Chat Error');
                }
                return;
            }
            
            const message = groupMessageInput.value.trim();
            if (!message) {
                if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                    ProjectManager.AdminPanel.NotificationSystem.warning('Please enter a message', 'Chat');
                }
                return;
            }
            
            // Get current time
            const time = getCurrentTime();
            
            // Force refresh user data if possible
            if (window.ProjectManager && ProjectManager.UserData && ProjectManager.UserData.updateUI) {
                ProjectManager.UserData.updateUI();
            }
            
            // Add message to chat
            addMessageToGroupChat('team-leader', message, time);
            
            // Clear input
            groupMessageInput.value = '';
            
            // Show success notification if available
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.success('Message sent', '', 1000);
            }
        } catch (error) {
            console.error('Error sending group message:', error);
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.error('Error sending message', error.message);
            }
        }
    }    // Function to add message to admin chat
    function addMessageToAdminChat(sender, message, time) {
        if (!adminChatMessages) return;
        
        const isTeamLeader = sender === 'team-leader';
        // Team leader messages (your messages) on the right
        const messageClass = isTeamLeader ? 'message-admin' : 'message-team';
        
        // Get user data for team leader messages
        let senderName, senderInitials, avatarBg, profilePicture;
        
        if (isTeamLeader && window.ProjectManager && ProjectManager.UserData) {
            // Get user data from the user-data.js module
            const userData = ProjectManager.UserData.getUserData();
            
            // Use first and last name from profile
            if (userData.firstName && userData.lastName) {
                senderName = `${userData.firstName} ${userData.lastName}`;
            } else if (userData.fullName) {
                senderName = userData.fullName;
            } else {
                senderName = '';
            }
            
            // Create initials from the name
            if (userData.initials) {
                senderInitials = userData.initials;
            } else if (userData.firstName && userData.lastName) {
                senderInitials = (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase();
            } else if (senderName.includes(' ')) {
                senderInitials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();
            } else if (senderName) {
                senderInitials = senderName.substring(0, 2).toUpperCase();
            } else {
                senderInitials = 'TL';
            }
            
            profilePicture = userData.profilePicture || null;
            avatarBg = 'bg-primary';
        } else {
            senderName = 'Admin';
            senderInitials = 'AD';
            profilePicture = null;
            avatarBg = 'bg-success';
        }
        
        // Create avatar element based on whether we have a profile picture or not
        let avatarElement;
        if (isTeamLeader && profilePicture) {
            avatarElement = `<img src="${profilePicture}" class="message-sender-avatar rounded-circle" alt="${senderName}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg=='; this.classList.add('${avatarBg}', 'text-white', 'p-1');">`;            
        } else {
            avatarElement = `<div class="message-sender-avatar ${avatarBg} text-white">${senderInitials}</div>`;
        }
        
        const messageHTML = `
            <div class="message ${messageClass}">
                <div class="${isTeamLeader ? 'sender-right-aligned' : 'message-sender'}">
                    ${isTeamLeader ? `<span>${senderName}</span>${avatarElement}` : `${avatarElement}${senderName}`}
                </div>
                <div class="message-content">
                    ${message}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        adminChatMessages.innerHTML += messageHTML;
        adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
    }
    
    // Function to add message to team chat
    function addMessageToTeamChat(sender, message, time) {
        if (!teamChatMessages) return;
        
        const isTeamLeader = sender === 'team-leader';
        // Team leader messages (your messages) on the right
        const messageClass = isTeamLeader ? 'message-admin' : 'message-team';
        
        // Get user data for team leader messages
        let senderName, senderInitials, avatarBg, profilePicture;
        
        if (isTeamLeader && window.ProjectManager && ProjectManager.UserData) {
            // Get user data from the user-data.js module
            const userData = ProjectManager.UserData.getUserData();
            
            // Use first and last name from profile
            if (userData.firstName && userData.lastName) {
                senderName = `${userData.firstName} ${userData.lastName}`;
            } else if (userData.fullName) {
                senderName = userData.fullName;
            } else {
                senderName = '';
            }
            
            // Create initials from the name
            if (userData.initials) {
                senderInitials = userData.initials;
            } else if (userData.firstName && userData.lastName) {
                senderInitials = (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase();
            } else if (senderName.includes(' ')) {
                senderInitials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();
            } else if (senderName) {
                senderInitials = senderName.substring(0, 2).toUpperCase();
            } else {
                senderInitials = 'TL';
            }
            
            profilePicture = userData.profilePicture || null;
            avatarBg = 'bg-primary';
        } else {
            senderName = currentTeamMember.name;
            const nameParts = currentTeamMember.name.split(' ');
            senderInitials = nameParts.length > 1 ? 
                (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase() : 
                nameParts[0].charAt(0).toUpperCase();
            profilePicture = null;
            avatarBg = 'bg-info';
        }
        
        // Create avatar element based on whether we have a profile picture or not
        let avatarElement;
        if (isTeamLeader && profilePicture) {
            avatarElement = `<img src="${profilePicture}" class="message-sender-avatar rounded-circle" alt="${senderName}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg=='; this.classList.add('${avatarBg}', 'text-white', 'p-1');">`;            
        } else {
            avatarElement = `<div class="message-sender-avatar ${avatarBg} text-white">${senderInitials}</div>`;
        }
        
        const messageHTML = `
            <div class="message ${messageClass}">
                <div class="${isTeamLeader ? 'sender-right-aligned' : 'message-sender'}">
                    ${isTeamLeader ? `<span>${senderName}</span>${avatarElement}` : `${avatarElement}${senderName}`}
                </div>
                <div class="message-content">
                    ${message}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        teamChatMessages.innerHTML += messageHTML;
        teamChatMessages.scrollTop = teamChatMessages.scrollHeight;
    }
    
    // Function to add message to group chat
    function addMessageToGroupChat(sender, message, time) {
        if (!groupChatMessages) return;
        
        const isTeamLeader = sender === 'team-leader';
        // Team leader messages (your messages) on the right
        const messageClass = isTeamLeader ? 'message-admin' : 'message-team';
        
        // Get user data for team leader messages
        let senderName, senderInitials, avatarBg, profilePicture;
        
        if (isTeamLeader && window.ProjectManager && ProjectManager.UserData) {
            // Get user data from the user-data.js module
            const userData = ProjectManager.UserData.getUserData();
            
            // Use first and last name from profile
            if (userData.firstName && userData.lastName) {
                senderName = `${userData.firstName} ${userData.lastName}`;
            } else if (userData.fullName) {
                senderName = userData.fullName;
            } else {
                senderName = '';
            }
            
            // Create initials from the name
            if (userData.initials) {
                senderInitials = userData.initials;
            } else if (userData.firstName && userData.lastName) {
                senderInitials = (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase();
            } else if (senderName.includes(' ')) {
                senderInitials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();
            } else if (senderName) {
                senderInitials = senderName.substring(0, 2).toUpperCase();
            } else {
                senderInitials = 'TL';
            }
            
            profilePicture = userData.profilePicture || null;
            avatarBg = 'bg-primary';
        } else {
            senderName = 'Team Member';
            senderInitials = 'TM';
            profilePicture = null;
            avatarBg = 'bg-success';
        }
        
        // Create avatar element based on whether we have a profile picture or not
        let avatarElement;
        if (isTeamLeader && profilePicture) {
            avatarElement = `<img src="${profilePicture}" class="message-sender-avatar rounded-circle" alt="${senderName}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg=='; this.classList.add('${avatarBg}', 'text-white', 'p-1');">`;            
        } else {
            avatarElement = `<div class="message-sender-avatar ${avatarBg} text-white">${senderInitials}</div>`;
        }
        
        const messageHTML = `
            <div class="message ${messageClass}">
                <div class="${isTeamLeader ? 'sender-right-aligned' : 'message-sender'}">
                    ${isTeamLeader ? `<span>${senderName}</span>${avatarElement}` : `${avatarElement}${senderName}`}
                </div>
                <div class="message-content">
                    ${message}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        groupChatMessages.innerHTML += messageHTML;
        groupChatMessages.scrollTop = groupChatMessages.scrollHeight;
    }
    
    // Function to load chat history for selected team member
    function loadTeamMemberChat(memberId) {
        try {
            if (!teamChatMessages) {
                console.error('Team chat messages container not found');
                return;
            }
            
            // Clear existing messages
            teamChatMessages.innerHTML = '';
            
            // Set current team member
            const teamMember = document.querySelector(`.team-member[data-member-id="${memberId}"]`);
            if (teamMember) {
                const name = teamMember.querySelector('.fw-bold').textContent;
                const role = teamMember.querySelector('.text-muted').textContent;
                
                currentTeamMember = {
                    id: memberId,
                    name: name,
                    role: role
                };
            }
            
            // Get messages for this member
            const messages = teamMemberMessages[memberId] || [];
            
            // Add messages to the chat
            messages.forEach(msg => {
                addMessageToTeamChat(msg.sender, msg.message, msg.time);
            });
            
            // Show member info in notification if available
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.info(`Chatting with ${currentTeamMember.name}`, currentTeamMember.role, 2000);
            }
        } catch (error) {
            console.error('Error loading team member chat:', error);
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.error('Error loading chat', error.message);
            }
        }
    }
    
    // Helper function to get current time
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
    }    /**
     * Update hardcoded example messages with user profile data
     */
    function updateExampleMessages() {
        try {
            if (window.ProjectManager && ProjectManager.UserData) {
                const userData = ProjectManager.UserData.getUserData();
                console.log('Updating example messages with user data:', userData);
                
                // Use the user's first and last name consistently instead of generic placeholders
                let userName = '';
                if (userData.firstName && userData.lastName) {
                    userName = `${userData.firstName} ${userData.lastName}`;
                } else if (userData.fullName) {
                    userName = userData.fullName;
                }
                
                // Find all elements with IDs starting with user-name-
                const userNameElements = document.querySelectorAll('[id^="user-name-"]');
                userNameElements.forEach(element => {
                    element.textContent = userName;
                });
                
                // Update any elements with "Team Leader" or "You" text
                document.querySelectorAll('.sender-right-aligned span, .message-sender, .chat-name').forEach(element => {
                    if (element.textContent.includes('Team Leader') || element.textContent.includes('You')) {
                        element.textContent = userName;
                    }
                });
                
                // Find all elements with IDs starting with user-avatar-
                const userAvatarElements = document.querySelectorAll('[id^="user-avatar-"]');
                userAvatarElements.forEach(avatarElement => {
                    if (userData.profilePicture) {
                        // Create a new image element
                        const img = document.createElement('img');
                        img.src = userData.profilePicture;
                        img.className = 'message-sender-avatar rounded-circle';
                        img.alt = userName;
                        img.id = avatarElement.id; // Keep the same ID
                        img.onerror = function() {
                            this.onerror = null;
                            this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                            this.classList.add('bg-primary', 'text-white', 'p-1');
                        };
                        
                        // Replace the old avatar with the new image
                        avatarElement.parentNode.replaceChild(img, avatarElement);
                    }
                });
                
                // Also update any other team leader messages that might be in the chat
                const teamLeaderMessages = document.querySelectorAll('.message.message-admin');
                teamLeaderMessages.forEach(message => {
                    // Update the name in all admin messages
                    const senderElement = message.querySelector('.message-sender');
                    if (senderElement) {
                        // Find text nodes or spans containing the name
                        const textNodes = Array.from(senderElement.childNodes)
                            .filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim());
                        
                        if (textNodes.length > 0) {
                            // Replace text nodes with the user's name
                            textNodes.forEach(node => {
                                if (node.nodeValue.trim()) {
                                    node.nodeValue = userName;
                                }
                            });
                        }
                        
                        // Update spans that might contain the name
                        senderElement.querySelectorAll('span').forEach(span => {
                            if (span.textContent.includes('Team Leader') || span.textContent.includes('You')) {
                                span.textContent = userName;
                            }
                        });
                        
                        // Update avatars in messages
                        const avatarElement = senderElement.querySelector('.message-sender-avatar');
                        if (avatarElement && userData.profilePicture) {
                            // Create a new image element
                            const img = document.createElement('img');
                            img.src = userData.profilePicture;
                            img.className = 'message-sender-avatar rounded-circle';
                            img.alt = userName;
                            img.onerror = function() {
                                this.onerror = null;
                                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uLWNpcmNsZSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgNmEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCA4YTggOCAwIDEgMSAxNiAwQTggOCAwIDAgMSAwIDh6bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxeiIvPjwvc3ZnPg==';
                                this.classList.add('bg-primary', 'text-white', 'p-1');
                            };
                            
                            // Replace the old avatar with the new image
                            avatarElement.parentNode.replaceChild(img, avatarElement);
                        }
                    }
                });
                
                // Update the initials in avatars
                document.querySelectorAll('.avatar').forEach(avatar => {
                    if (avatar.textContent === 'TL' || avatar.textContent === 'AM') {
                        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
                        avatar.textContent = initials || 'ME';
                    }
                });
            }
        } catch (error) {
            console.error('Error updating example messages:', error);
        }
    }
    
    // Initialize chat functionality
    function init() {
        try {
            // Get DOM elements
            adminChatMessages = document.getElementById('adminChatMessages');
            adminMessageInput = document.getElementById('adminMessageInput');
            adminSendButton = document.getElementById('adminSendButton');
            
            teamChatMessages = document.getElementById('teamChatMessages');
            teamMessageInput = document.getElementById('teamMessageInput');
            teamSendButton = document.getElementById('teamSendButton');
            teamMembers = document.querySelectorAll('.team-member');
            
            groupChatMessages = document.getElementById('groupChatMessages');
            groupMessageInput = document.getElementById('groupMessageInput');
            groupSendButton = document.getElementById('groupSendButton');
            
            // Make sure user data is loaded and up to date
            if (window.ProjectManager && ProjectManager.UserData) {
                console.log('Initializing user data for chat');
                if (typeof ProjectManager.UserData.updateUI === 'function') {
                    ProjectManager.UserData.updateUI();
                }
                
                // Update example messages with user profile data
                updateExampleMessages();
            }
            
            // Add event listeners for admin chat
            if (adminSendButton && adminMessageInput) {
                adminSendButton.addEventListener('click', sendAdminMessage);
                document.addEventListener('userDataChanged', function(event) {
                    // Only update if this is for the team-leader portal
                    if (event.detail && event.detail.portal === 'team-leader') {
                        if (typeof updateExampleMessages === 'function') {
                            updateExampleMessages();
                        }
                    }
                });
                adminMessageInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendAdminMessage();
                    }
                });
            }
            
            // Add event listeners for team chat
            if (teamSendButton && teamMessageInput) {
                teamSendButton.addEventListener('click', sendTeamMessage);
                teamMessageInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendTeamMessage();
                    }
                });
            }
            
            // Add event listeners for group chat
            if (groupSendButton && groupMessageInput) {
                groupSendButton.addEventListener('click', sendGroupMessage);
                groupMessageInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendGroupMessage();
                    }
                });
            }
            
            // Add event listeners for team member selection
            if (teamMembers) {
                teamMembers.forEach(member => {
                    member.addEventListener('click', function() {
                        // Remove active class from all team members
                        teamMembers.forEach(m => m.classList.remove('active'));
                        
                        // Add active class to selected team member
                        this.classList.add('active');
                        
                        // Load chat for selected team member
                        const memberId = this.getAttribute('data-member-id');
                        loadTeamMemberChat(memberId);
                    });
                });
                
                // Load chat for first team member by default
                const firstMember = teamMembers[0];
                if (firstMember) {
                    firstMember.classList.add('active');
                    const memberId = firstMember.getAttribute('data-member-id');
                    loadTeamMemberChat(memberId);
                }
            }
            
            // Initialization notification removed
        } catch (error) {
            console.error('Error initializing chat module:', error);
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.error('Error initializing chat', error.message);
            }
        }
    }
    
    // Public methods and initialization
    return {
        init: init,
        addMessageToAdminChat: addMessageToAdminChat,
        addMessageToTeamChat: addMessageToTeamChat,
        addMessageToGroupChat: addMessageToGroupChat,
        getCurrentTime: getCurrentTime,
        loadTeamMemberChat: loadTeamMemberChat
    };
})();

// Initialize the chat module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat elements
    initChatElements();
    
    // Initialize sidebar functionality
    initSidebar();
    
    // Initialize chat functionality
    initChatFunctionality();
});

/**
 * Sidebar functionality has been removed as requested
 */
function initSidebar() {
    // Sidebar toggle functionality has been removed while keeping the hamburger button in HTML
    console.log('Team Leader Chat page: Sidebar toggle functionality has been removed');
}

function initChatElements() {
    // Initialize chat elements
}

function initChatFunctionality() {
    ProjectManager.Chat.init();
}