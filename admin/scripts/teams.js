// Custom scripts for teams.html

document.addEventListener('DOMContentLoaded', function() {

    // Sidebar functionality is now handled by sidebar.js
    
    // Initialize modals
    const addTeamModal = new bootstrap.Modal(document.getElementById('addTeamModal'));
    const editTeamModal = new bootstrap.Modal(document.getElementById('editTeamModal'));
    const confirmDeleteTeamModal = new bootstrap.Modal(document.getElementById('confirmDeleteTeamModal'));
    
    // DOM Elements
    const addTeamBtn = document.getElementById('addTeamBtn');
    const saveTeamBtn = document.getElementById('saveTeamBtn');
    const updateTeamBtn = document.getElementById('updateTeamBtn');
    const confirmDeleteTeamBtn = document.getElementById('confirmDeleteTeamBtn');
    const teamSearch = document.getElementById('teamSearch');
    
    // Sample team data (would typically come from a database)
    // Make teams variable accessible globally for the dashboard
    window.teams = [
        { 
            id: 1, 
            name: 'Development', 
            description: 'Frontend and backend developers',
            leader: 'John Doe',
            members: 8,
            projects: ['Project Alpha', 'Project Beta']
        },
        { 
            id: 2, 
            name: 'Design', 
            description: 'UI/UX designers and graphic artists',
            leader: 'Emma Watson',
            members: 5,
            projects: ['Project Alpha', 'Project Delta']
        },
        { 
            id: 3, 
            name: 'QA', 
            description: 'Quality assurance and testing specialists',
            leader: 'Sarah Williams',
            members: 3,
            projects: ['Project Alpha', 'Project Beta']
        },
        { 
            id: 4, 
            name: 'Full Stack', 
            description: 'Full stack developers for complex projects',
            leader: 'Robert Miller',
            members: 6,
            projects: ['Project Gamma']
        }
    ];
    
    // Form validation function
    function validateForm(form) {
        let isValid = true;
        form.classList.remove('was-validated');
        
        // Check each required input
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
            }
        });
        
        // Check if at least one project is selected
        const projectCheckboxes = form.querySelectorAll('.project-list input[type="checkbox"]:checked');
        if (projectCheckboxes.length === 0) {
            isValid = false;
            // Find the invalid feedback for projects
            const projectList = form.querySelector('.project-list');
            if (projectList) {
                const feedback = projectList.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.style.display = 'block';
                }
            }
        }
        
        // Show validation feedback
        if (!isValid) {
            form.classList.add('was-validated');
        }
        
        return isValid;
    }
    
    // Event Listeners
    
    // Open Add Team Modal
    addTeamBtn.addEventListener('click', () => {
        document.getElementById('addTeamForm').reset();
        addTeamModal.show();
    });
    
    // Save New Team
    saveTeamBtn.addEventListener('click', () => {
        const form = document.getElementById('addTeamForm');
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Get form values
        const teamName = document.getElementById('teamName').value.trim();
        const teamDescription = document.getElementById('teamDescription').value.trim();
        const teamLeader = document.getElementById('teamLeader').value;
        
        // Get selected projects
        const projectCheckboxes = form.querySelectorAll('.project-list input[type="checkbox"]:checked');
        const teamProjects = Array.from(projectCheckboxes).map(checkbox => checkbox.value);
        
        // Generate new ID
        const newId = teams.length > 0 ? Math.max(...teams.map(team => team.id)) + 1 : 1;
        
        // Create new team object
        const newTeam = {
            id: newId,
            name: teamName,
            description: teamDescription,
            leader: teamLeader,
            members: 0, // Start with 0 members
            projects: teamProjects
        };
        
        // Add to teams array
        teams.push(newTeam);
        
        // Add team card to UI
        addTeamCard(newTeam);
        
        // Close modal
        addTeamModal.hide();
        
        // Save teams to localStorage
        localStorage.setItem('teams', JSON.stringify(teams));
        
        // Show success message
        showToast(`Team "${teamName}" created successfully`, 'success');
    });
    
    // Edit Team
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-team-btn')) {
            e.preventDefault();
            const teamId = e.target.closest('.edit-team-btn').dataset.teamId;
            const team = teams.find(t => t.id == teamId);
            
            if (team) {
                // Populate form
                document.getElementById('editTeamId').value = team.id;
                document.getElementById('editTeamName').value = team.name;
                document.getElementById('editTeamDescription').value = team.description;
                document.getElementById('editTeamLeader').value = team.leader;
                document.getElementById('editTeamMembers').value = team.members;
                
                // Check project checkboxes
                const projectCheckboxes = document.querySelectorAll('#editTeamForm .project-list input[type="checkbox"]');
                projectCheckboxes.forEach(checkbox => {
                    checkbox.checked = team.projects.includes(checkbox.value);
                });
                
                // Show modal
                editTeamModal.show();
            }
        }
    });
    
    // Update Team
    updateTeamBtn.addEventListener('click', () => {
        const form = document.getElementById('editTeamForm');
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        const teamId = document.getElementById('editTeamId').value;
        const teamName = document.getElementById('editTeamName').value.trim();
        const teamDescription = document.getElementById('editTeamDescription').value.trim();
        const teamLeader = document.getElementById('editTeamLeader').value;
        const teamMembers = parseInt(document.getElementById('editTeamMembers').value);
        
        // Get selected projects
        const projectCheckboxes = form.querySelectorAll('.project-list input[type="checkbox"]:checked');
        const teamProjects = Array.from(projectCheckboxes).map(checkbox => checkbox.value);
        
        // Update teams array
        const teamIndex = teams.findIndex(t => t.id == teamId);
        if (teamIndex !== -1) {
            teams[teamIndex] = {
                id: parseInt(teamId),
                name: teamName,
                description: teamDescription,
                leader: teamLeader,
                members: teamMembers,
                projects: teamProjects
            };
            
            // Update team card in UI
            updateTeamCard(teams[teamIndex]);
            
            // Close modal
            editTeamModal.hide();
            
            // Save teams to localStorage
            localStorage.setItem('teams', JSON.stringify(teams));
            
            // Show success message
            showToast(`Team "${teamName}" updated successfully`, 'success');
        }
    });
    
    // Delete Team
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-team-btn')) {
            e.preventDefault();
            const teamId = e.target.closest('.delete-team-btn').dataset.teamId;
            const team = teams.find(t => t.id == teamId);
            
            if (team) {
                // Set the team ID to delete
                document.getElementById('deleteTeamId').value = team.id;
                
                // Show confirmation modal
                confirmDeleteTeamModal.show();
            }
        }
    });
    
    // Confirm Delete Team
    confirmDeleteTeamBtn.addEventListener('click', () => {
        const teamId = document.getElementById('deleteTeamId').value;
        
        // Remove from teams array
        teams = teams.filter(t => t.id != teamId);
        
        // Remove team card from UI
        const teamCard = document.querySelector(`.team-card[data-team-id="${teamId}"]`);
        if (teamCard) {
            teamCard.closest('.col-lg-4').remove();
        }
        
        // Close modal
        confirmDeleteTeamModal.hide();
        
        // Save teams to localStorage
        localStorage.setItem('teams', JSON.stringify(teams));
        
        // Show success message
        showToast('Team deleted successfully', 'success');
    });
    
    // Search functionality
    teamSearch.addEventListener('input', () => {
        const searchTerm = teamSearch.value.toLowerCase();
        
        // Filter teams based on search term
        const filteredTeams = searchTerm ? 
            teams.filter(team => 
                team.name.toLowerCase().includes(searchTerm) || 
                team.description.toLowerCase().includes(searchTerm) || 
                team.leader.toLowerCase().includes(searchTerm)
            ) : teams;
        
        // Clear existing team cards
        const teamContainer = document.querySelector('.row');
        teamContainer.innerHTML = '';
        
        // Render filtered teams
        filteredTeams.forEach(team => {
            addTeamCard(team);
        });
        
        // Show message if no teams found
        if (filteredTeams.length === 0) {
            const noTeamsMessage = document.createElement('div');
            noTeamsMessage.className = 'col-12 text-center py-5';
            noTeamsMessage.innerHTML = `<h4>No teams found matching "${searchTerm}"</h4>`;
            teamContainer.appendChild(noTeamsMessage);
        }
    });
    
    // Helper function to add team card to UI
    function addTeamCard(team) {
        const teamContainer = document.querySelector('.row');
        const teamCol = document.createElement('div');
        teamCol.className = 'col-lg-4 col-md-6 col-12 mb-4';
        
        // Create team card HTML
        teamCol.innerHTML = `
            <div class="card team-card" data-team-id="${team.id}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3 class="card-title mb-0 h5">${team.name}</h3>
                    <span class="badge bg-primary team-member-count">${team.members} Members</span>
                </div>
                <div class="card-body">
                    <p class="mb-3 team-description">${team.description}</p>
                    <div class="mt-3">
                        <h4 class="h6">Active Projects:</h4>
                        <ul class="team-projects">
                            ${team.projects.map(project => `<li>${project}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="mt-3">
                        <h4 class="h6">Team Leader:</h4>
                        <p class="mb-0 team-leader">${team.leader}</p>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-primary me-2 edit-team-btn" data-team-id="${team.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-team-btn" data-team-id="${team.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg> Delete
                    </button>
                </div>
            </div>
        `;
        
        // Add to the top of the container instead of the bottom
        if (teamContainer.firstChild) {
            teamContainer.insertBefore(teamCol, teamContainer.firstChild);
        } else {
            teamContainer.appendChild(teamCol);
        }
    }
    
    // Helper function to update team card in UI
    function updateTeamCard(team) {
        const teamCard = document.querySelector(`.team-card[data-team-id="${team.id}"]`);
        if (teamCard) {
            // Update team card content
            teamCard.querySelector('.card-title').textContent = team.name;
            teamCard.querySelector('.team-member-count').textContent = `${team.members} Members`;
            teamCard.querySelector('.team-description').textContent = team.description;
            teamCard.querySelector('.team-leader').textContent = team.leader;
            
            // Update projects list
            const projectsList = teamCard.querySelector('.team-projects');
            projectsList.innerHTML = team.projects.map(project => `<li>${project}</li>`).join('');
        }
    }

    // This function is no longer needed as we're using the global showToast function
    // from toast-notification.js

    // Helper function to get current time
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    }

    // Initialize team cards - display in reverse order so newest are at the top
    // Create a copy of the array and reverse it to avoid modifying the original array
    [...teams].reverse().forEach(team => {
        addTeamCard(team);
        // Save initial teams data to localStorage
        localStorage.setItem('teams', JSON.stringify(teams));
    });
}); // Close DOMContentLoaded event listener
