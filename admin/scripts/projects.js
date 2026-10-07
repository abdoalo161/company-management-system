document.addEventListener('DOMContentLoaded', function() {
    // Fix for modal scrolling issues
    const fixScrolling = function() {
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        document.body.style.paddingRight = '0';
        document.body.classList.remove('modal-open');
        
        // Remove any lingering backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
    };
    
    // Add event listeners to all modals to fix scrolling when they're hidden
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', fixScrolling);
    });
    // Sidebar functionality is now handled by sidebar.js
    // Sample data for teams (replace with actual API calls)
    const teams = [
        {
            id: 1,
            name: 'Development',
            leader: 'John Smith',
            members: 8,
            color: '#3182ce'
        },
        {
            id: 2,
            name: 'Design',
            leader: 'Sarah Johnson',
            members: 5,
            color: '#805ad5'
        },
        {
            id: 3,
            name: 'Marketing',
            leader: 'Michael Brown',
            members: 6,
            color: '#dd6b20'
        },
        {
            id: 4,
            name: 'QA',
            leader: 'Emily Davis',
            members: 4,
            color: '#38a169'
        },
        {
            id: 5,
            name: 'DevOps',
            leader: 'Alex Wilson',
            members: 3,
            color: '#e53e3e'
        }
    ];
    
    // DOM elements for Add Project Modal
    const addProjectModal = document.getElementById('addProjectModal');
    const addProjectForm = document.getElementById('addProjectForm');
    const addProjectNameInput = document.getElementById('addProjectName');
    const addProjectDescriptionInput = document.getElementById('addProjectDescription');
    const addProjectStatusSelect = document.getElementById('addProjectStatus');
    const addProjectDeadlineInput = document.getElementById('addProjectDeadline');
    const addProjectTeamsCheckboxes = document.querySelectorAll('input[name="addProjectTeams"]');
    const createProjectBtn = document.getElementById('createProjectBtn');
    const addFormErrorSummary = document.getElementById('addFormErrorSummary');
    
    // DOM elements for Edit Project Modal
    const editProjectModal = document.getElementById('editProjectModal');
    const editProjectForm = document.getElementById('editProjectForm');
    const editProjectIdInput = document.getElementById('editProjectId');
    const editProjectNameInput = document.getElementById('editProjectName');
    const editProjectDescriptionInput = document.getElementById('editProjectDescription');
    const editProjectStatusSelect = document.getElementById('editProjectStatus');
    const editProjectDeadlineInput = document.getElementById('editProjectDeadline');
    const editProjectTeamsCheckboxes = document.querySelectorAll('input[name="editProjectTeams"]');
    const updateProjectBtn = document.getElementById('updateProjectBtn');
    const editFormErrorSummary = document.getElementById('editFormErrorSummary');
    
    // DOM elements for Delete Modal
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const deleteProjectNameSpan = document.getElementById('deleteProjectName');
    const deleteProjectIdInput = document.getElementById('deleteProjectId');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // DOM elements for Chat Modal
    const projectChatModal = document.getElementById('projectChatModal');
    const chatProjectNameSpan = document.getElementById('chatProjectName');
    const projectTeamsList = document.getElementById('projectTeamsList');
    const selectedTeamNameSpan = document.getElementById('selectedTeamName');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatForm = document.getElementById('chatForm');
    
    // Set minimum date for deadline inputs to today
    const today = new Date().toISOString().split('T')[0];
    if (addProjectDeadlineInput) addProjectDeadlineInput.min = today;
    if (editProjectDeadlineInput) editProjectDeadlineInput.min = today;
    
    // Sample data for projects (replace with actual API calls)
    // Make projects variable accessible globally for the dashboard
    window.projects = [
        {
            id: 1,
            name: 'Website Redesign',
            description: 'Complete overhaul of the company website with modern design, improved user experience, and mobile-first approach.',
            status: 'in-progress',
            teams: [1, 2], // Development and Design
            deadline: '2025-06-15',
            createdDate: '2025-01-10'
        },
        {
            id: 2,
            name: 'Mobile App Development',
            description: 'Develop a cross-platform mobile application with core functionalities matching our web platform.',
            status: 'planning',
            teams: [1, 4], // Development and QA
            deadline: '2025-09-01',
            createdDate: '2025-02-20'
        },
        {
            id: 3,
            name: 'Product Launch Campaign',
            description: 'Develop and execute a comprehensive marketing campaign for the upcoming product launch, including social media, email marketing, and PR activities.',
            status: 'urgent',
            teams: [2, 3], // Design and Marketing
            deadline: '2025-05-20',
            createdDate: '2025-05-01'
        }
    ];
    
    // Add event listeners
    document.addEventListener('click', function(event) {
        console.log('Click event detected', event.target);
        
        // Handle edit button clicks
        if (event.target.closest('.btn-edit')) {
            console.log('Edit button clicked');
            const projectCard = event.target.closest('.project-card');
            if (projectCard) {
                const projectId = projectCard.dataset.projectId;
                console.log('Opening edit modal for project ID:', projectId);
                openEditProjectModal(projectId);
            }
        }
        
        // Handle delete button clicks
        if (event.target.closest('.btn-delete')) {
            console.log('Delete button clicked');
            const projectCard = event.target.closest('.project-card');
            if (projectCard) {
                const projectId = projectCard.dataset.projectId;
                const projectName = projectCard.querySelector('h5').textContent;
                console.log('Opening delete modal for project:', projectName, 'ID:', projectId);
                openDeleteConfirmModal(projectId, projectName);
            }
        }
        
        // Handle "Add Project" button
        if (event.target.matches('.btn-add-project') || event.target.closest('.btn-add-project')) {
            console.log('Add Project button clicked');
            openAddProjectModal();
        }
    });
    
    // Open Add Project Modal
    function openAddProjectModal() {
        resetAddForm();
        const addModalInstance = new bootstrap.Modal(addProjectModal);
        addModalInstance.show();
    }
    
    // Open Edit Project Modal
    function openEditProjectModal(projectId) {
        const project = projects.find(p => p.id == projectId);
        if (!project) return;
        
        editProjectIdInput.value = project.id;
        editProjectNameInput.value = project.name;
        editProjectDescriptionInput.value = project.description;
        editProjectStatusSelect.value = project.status;
        editProjectDeadlineInput.value = project.deadline;
        
        // Reset and set team checkboxes
        editProjectTeamsCheckboxes.forEach(checkbox => {
            checkbox.checked = project.teams.includes(parseInt(checkbox.value));
        });
        
        // Reset validation
        resetValidation(editProjectForm);
        editFormErrorSummary.classList.add('d-none');
        
        const editModalInstance = new bootstrap.Modal(editProjectModal);
        editModalInstance.show();
    }
    
    // Open Delete Confirmation Modal
    function openDeleteConfirmModal(projectId, projectName) {
        deleteProjectIdInput.value = projectId;
        deleteProjectNameSpan.textContent = projectName;
        
        const deleteModalInstance = new bootstrap.Modal(deleteConfirmModal);
        deleteModalInstance.show();
    }
    
    // Reset Add Project Form
    function resetAddForm() {
        addProjectForm.reset();
        resetValidation(addProjectForm);
        addFormErrorSummary.classList.add('d-none');
        
        // Set default status to "In Progress"
        addProjectStatusSelect.value = 'in-progress';
    }
    
    // Reset form validation state
    function resetValidation(form) {
        form.classList.remove('was-validated');
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => {
            field.classList.remove('is-invalid');
        });
    }
    
    // Create new project
    if (createProjectBtn) {
        createProjectBtn.addEventListener('click', function() {
            if (validateForm(addProjectForm, addFormErrorSummary)) {
                const newProject = {
                    id: generateNewId(),
                    name: addProjectNameInput.value.trim(),
                    description: addProjectDescriptionInput.value.trim(),
                    status: addProjectStatusSelect.value,
                    teams: Array.from(addProjectTeamsCheckboxes)
                        .filter(checkbox => checkbox.checked)
                        .map(checkbox => parseInt(checkbox.value)),
                    deadline: addProjectDeadlineInput.value,
                    createdDate: new Date().toISOString().split('T')[0]
                };
                
                // Check if project with this name already exists
                const existingProject = projects.find(p => p.name.toLowerCase() === newProject.name.toLowerCase());
                if (existingProject) {
                    showToast('A project with this name already exists!', 'error');
                    return;
                }

                // Add to projects array (in real app, would be API call)
                projects.push(newProject);
                
                // Save projects to localStorage
                localStorage.setItem('projects', JSON.stringify(projects));

                // Close modal properly
                const modalInstance = bootstrap.Modal.getInstance(addProjectModal);
                if (modalInstance) {
                    modalInstance.hide();
                    
                    // Give time for Bootstrap's hide event to complete
                    setTimeout(() => {
                        // Clean up any remaining backdrop
                        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
                        modalBackdrops.forEach(backdrop => backdrop.remove());
                        
                        // Restore body state
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = 'auto';
                        document.body.style.paddingRight = '';
                        document.body.style.height = '';
                    }, 300);
                }
                
                // Render the new project card
                renderProjectCard(newProject);
                
                // Show success message
                showToast('Project created successfully!', 'success');
                
                // Reset the form
                resetAddForm();
            }
        });
    }
    
    // Update existing project
    if (updateProjectBtn) {
        updateProjectBtn.addEventListener('click', function() {
            if (validateForm(editProjectForm, editFormErrorSummary)) {
                const projectId = parseInt(editProjectIdInput.value);
                const projectIndex = projects.findIndex(p => p.id === projectId);
                
                if (projectIndex !== -1) {
                    // Update project in the array
                    projects[projectIndex] = {
                        ...projects[projectIndex],
                        name: editProjectNameInput.value.trim(),
                        description: editProjectDescriptionInput.value.trim(),
                        status: editProjectStatusSelect.value,
                        teams: Array.from(editProjectTeamsCheckboxes)
                            .filter(checkbox => checkbox.checked)
                            .map(checkbox => parseInt(checkbox.value)),
                        deadline: editProjectDeadlineInput.value
                    };
                    
                    // Close modal properly
                    const modalInstance = bootstrap.Modal.getInstance(editProjectModal);
                    if (modalInstance) {
                        modalInstance.hide();
                        
                        // Give time for Bootstrap's hide event to complete
                        setTimeout(() => {
                            // Clean up any remaining backdrop
                            const modalBackdrops = document.querySelectorAll('.modal-backdrop');
                            modalBackdrops.forEach(backdrop => backdrop.remove());
                            
                            // Restore body state
                            document.body.classList.remove('modal-open');
                            document.body.style.overflow = 'auto';
                            document.body.style.paddingRight = '';
                            document.body.style.height = '';
                        }, 300);
                    }
                    
                    // Update the project card in the UI
                    updateProjectCardInUI(projects[projectIndex]);
                    
                    // Save projects to localStorage
                    localStorage.setItem('projects', JSON.stringify(projects));
                    
                    // Show success message
                    showToast('Project updated successfully!', 'success');
                }
            }
        });
    }
    
    // Delete project
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const projectId = parseInt(deleteProjectIdInput.value);
            
            // Remove project from array
            projects = projects.filter(project => project.id !== projectId);
            
            // Remove project card from UI
            const projectCard = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
            if (projectCard) {
                projectCard.closest('.col-lg-4').remove();
            }
            
            // Close modal properly
            const modalInstance = bootstrap.Modal.getInstance(deleteConfirmModal);
            if (modalInstance) {
                modalInstance.hide();
                
                // Give time for Bootstrap's hide event to complete
                setTimeout(() => {
                    // Clean up any remaining backdrop
                    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
                    modalBackdrops.forEach(backdrop => backdrop.remove());
                    
                    // Restore body state
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = 'auto';
                    document.body.style.paddingRight = '';
                    document.body.style.height = '';
                }, 300);
            }
            
            // Save projects to localStorage
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // Show success message
            showToast('Project deleted successfully!', 'success');
        });
    }
    
    // Form validation
    function validateForm(form, errorSummary) {
        form.classList.add('was-validated');
        
        // Check if at least one team is selected
        const teamCheckboxes = form.querySelectorAll('.team-checkbox');
        const teamsContainer = form.querySelector('.card');
        const teamsSelected = Array.from(teamCheckboxes).some(checkbox => checkbox.checked);
        
        if (!teamsSelected) {
            teamsContainer.classList.add('border', 'border-danger');
            form.querySelector('#teamsInvalidFeedback')?.classList.remove('d-none');
        } else {
            teamsContainer.classList.remove('border', 'border-danger');
            form.querySelector('#teamsInvalidFeedback')?.classList.add('d-none');
        }
        
        // Validate date is in the future
        const deadlineInput = form.querySelector('input[type="date"]');
        const selectedDate = new Date(deadlineInput.value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < currentDate) {
            deadlineInput.setCustomValidity('Deadline must be a future date');
        } else {
            deadlineInput.setCustomValidity('');
        }
        
        const isValid = form.checkValidity() && teamsSelected;
        
        if (!isValid) {
            errorSummary.classList.remove('d-none');
            // Highlight all invalid fields
            const invalidInputs = form.querySelectorAll(':invalid');
            invalidInputs.forEach(input => {
                input.classList.add('is-invalid');
            });
        } else {
            errorSummary.classList.add('d-none');
        }
        
        return isValid;
    }
    
    // Generate a new unique ID for projects
    function generateNewId() {
        return Math.max(0, ...projects.map(p => p.id)) + 1;
    }
    
    // Render a project card and add it to the UI
    function renderProjectCard(project) {
        const projectsContainer = document.querySelector('.projects-grid .row');
        if (!projectsContainer) return;
        
        // Check if a project with this ID already exists
        const existingProject = document.querySelector(`.project-card[data-project-id="${project.id}"]`);
        if (existingProject) {
            console.log(`Project with ID ${project.id} already exists, not rendering again`);
            return;
        }
        
        const statusLabel = getStatusLabel(project.status);
        const statusClass = `status-${project.status}`;
        const teamsHtml = generateTeamsHtml(project.teams);
        
        const projectCardHtml = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 project-card" data-project-id="${project.id}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${project.name}</h5>
                        <span class="badge ${statusClass}" data-status="${project.status}" role="status" aria-label="Project status: ${statusLabel}">${statusLabel}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${project.description}</p>
                        <div class="project-details mt-3">
                            <div class="mb-2"><strong>Deadline:</strong> ${formatDate(project.deadline)}</div>
                            <div class="mb-2">
                                <strong>Teams:</strong>
                                <div class="mt-1 team-badges">
                                    ${teamsHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent d-flex justify-content-between">
                        <small class="text-muted">Created: ${formatDate(project.createdDate)}</small>
                        <div class="project-actions">
                            <button class="btn btn-chat me-1" data-bs-toggle="modal" data-bs-target="#projectChatModal" data-project-id="${project.id}" data-project-name="${project.name}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots me-1" viewBox="0 0 16 16">
                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                                </svg> Chat
                            </button>
                            <button class="btn btn-edit me-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg> Edit
                            </button>
                            <button class="btn btn-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3 me-1" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        projectsContainer.insertAdjacentHTML('afterbegin', projectCardHtml);
    }
    
    // Update a project card in the UI
    function updateProjectCardInUI(project) {
        const projectCard = document.querySelector(`.project-card[data-project-id="${project.id}"]`);
        if (!projectCard) return;
        
        const statusLabel = getStatusLabel(project.status);
        const statusClass = `status-${project.status}`;
        const teamsHtml = generateTeamsHtml(project.teams);
        
        // Update elements
        projectCard.querySelector('h5').textContent = project.name;
        
        const statusBadge = projectCard.querySelector('.badge');
        statusBadge.className = `badge ${statusClass}`;
        statusBadge.textContent = statusLabel;
        statusBadge.dataset.status = project.status;
        statusBadge.setAttribute('aria-label', `Project status: ${statusLabel}`);
        
        projectCard.querySelector('.card-text').textContent = project.description;
        projectCard.querySelector('.project-details .mb-2:first-child').innerHTML = `<strong>Deadline:</strong> ${formatDate(project.deadline)}`;
        projectCard.querySelector('.team-badges').innerHTML = teamsHtml;
    }
    
    // Get status label for display
    function getStatusLabel(status) {
        const statusMap = {
            'planning': 'Planning',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'on-hold': 'On Hold',
            'urgent': 'Urgent'
        };
        return statusMap[status] || status;
    }
    
    // Generate HTML for team badges
    function generateTeamsHtml(teamIds) {
        const teamMap = {
            1: { name: 'Development', class: 'team-development' },
            2: { name: 'Design', class: 'team-design' },
            3: { name: 'Marketing', class: 'team-marketing' },
            4: { name: 'QA', class: 'team-qa' },
            5: { name: 'DevOps', class: 'team-devops' }
        };
        
        return teamIds.map(id => {
            const team = teamMap[id] || { name: `Team ${id}`, class: 'team-default' };
            return `<span class="badge ${team.class}">${team.name}</span>`;
        }).join('');
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Show notification using alert
    function showNotification(message, type = 'success') {
        // Show alert
        showToast(message, type || 'info');
    }
    
    // Initialize the projects display
    function initializeProjects() {
        // Check if we already have project cards in the HTML
        const existingCards = document.querySelectorAll('.project-card');
        
        // If we already have project cards, don't render them again
        if (existingCards.length > 0) {
            console.log('Projects already exist in HTML, not rendering again');
            return;
        }
        
        // Only render projects if there are none in the HTML
        const projectsContainer = document.querySelector('.projects-grid .row');
        if (!projectsContainer) return;
        
        // Render all projects
        projects.forEach(project => {
            renderProjectCard(project);
        });
    }
    
    // Load projects from localStorage or use default projects
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        window.projects = JSON.parse(savedProjects);
    }
    
    // Initialize on page load
    initializeProjects();
    
    // Chat functionality
    
    // Event listener for chat buttons
    document.addEventListener('click', function(event) {
        if (event.target.closest('.btn-chat')) {
            const button = event.target.closest('.btn-chat');
            const projectId = parseInt(button.getAttribute('data-project-id'));
            const projectName = button.getAttribute('data-project-name');
            openChatModal(projectId, projectName);
        }
    });
    
    // Open chat modal and load project teams
    function openChatModal(projectId, projectName) {
        // Set project name in modal header
        if (chatProjectNameSpan) {
            chatProjectNameSpan.textContent = projectName;
        }
        
        // Find the project
        const project = projects.find(p => p.id === projectId);
        
        if (project && projectTeamsList) {
            // Clear previous teams
            projectTeamsList.innerHTML = '';
            
            // Reset chat area
            resetChatArea();
            
            // Get teams for this project
            const projectTeams = teams.filter(team => project.teams.includes(team.id));
            
            // Display teams in sidebar
            projectTeams.forEach(team => {
                const teamItem = document.createElement('div');
                teamItem.className = 'team-item';
                teamItem.setAttribute('data-team-id', team.id);
                
                // Generate initials for team icon
                const initials = team.name.split(' ')
                    .map(word => word.charAt(0))
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();
                
                teamItem.innerHTML = `
                    <div class="team-item-header">
                        <div class="team-icon" style="background-color: ${team.color}">${initials}</div>
                        <div>
                            <div class="team-name">${team.name}</div>
                            <div class="team-leader">${team.leader} (Team Leader)</div>
                        </div>
                    </div>
                    <div class="small">${team.members} team members</div>
                `;
                
                // Add click event to select team
                teamItem.addEventListener('click', function() {
                    selectTeam(team);
                });
                
                projectTeamsList.appendChild(teamItem);
            });
            
            // If no teams assigned to project
            if (projectTeams.length === 0) {
                projectTeamsList.innerHTML = `
                    <div class="p-3 text-center text-muted">
                        <p>No teams assigned to this project</p>
                    </div>
                `;
            }
        }
    }
    
    // Select a team to chat with
    function selectTeam(team) {
        // Update active team styling
        const teamItems = document.querySelectorAll('.team-item');
        teamItems.forEach(item => item.classList.remove('active'));
        const activeTeam = document.querySelector(`.team-item[data-team-id="${team.id}"]`);
        if (activeTeam) activeTeam.classList.add('active');
        
        // Update chat header
        if (selectedTeamNameSpan) {
            selectedTeamNameSpan.textContent = `${team.name} Team Leader (${team.leader})`;
        }
        
        // Enable chat input
        if (messageInput) messageInput.disabled = false;
        if (sendMessageBtn) sendMessageBtn.disabled = false;
        
        // Load simulated chat history
        loadChatHistory(team);
    }
    
    // Reset chat area
    function resetChatArea() {
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="d-flex justify-content-center align-items-center h-100">
                    <p class="text-muted">Select a team to start chatting</p>
                </div>
            `;
        }
        
        if (selectedTeamNameSpan) {
            selectedTeamNameSpan.textContent = 'Team Leader';
        }
        
        if (messageInput) {
            messageInput.disabled = true;
            messageInput.value = '';
        }
        
        if (sendMessageBtn) {
            sendMessageBtn.disabled = true;
        }
    }
    
    // Load simulated chat history
    function loadChatHistory(team) {
        if (!chatMessages) return;
        
        // Clear previous messages
        chatMessages.innerHTML = '';
        
        // Simulate chat history based on team
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const chatHistory = [
            {
                sender: 'you',
                message: `Hello ${team.leader}, I'd like to discuss the ${team.name} team's progress on their assigned tasks.`,
                time: formatChatTime(yesterday)
            },
            {
                sender: team.leader,
                message: `Hi there! We're making good progress. The team has completed about 70% of the assigned tasks.`,
                time: formatChatTime(yesterday, 5)
            },
            {
                sender: 'you',
                message: 'That sounds great! Any challenges or blockers I should be aware of?',
                time: formatChatTime(yesterday, 7)
            },
            {
                sender: team.leader,
                message: `We had a few technical issues last week, but we've resolved them. We're on track to meet the deadline.`,
                time: formatChatTime(yesterday, 10)
            },
            {
                sender: 'you',
                message: 'Perfect. Let me know if you need any additional resources.',
                time: formatChatTime(now, -60)
            }
        ];
        
        // Render chat messages
        chatHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender === 'you' ? 'message-outgoing' : 'message-incoming'}`;
            
            messageDiv.innerHTML = `
                <div class="message-bubble">${msg.message}</div>
                <div class="message-meta">
                    <span>${msg.sender === 'you' ? 'You' : msg.sender}</span>
                    <span>${msg.time}</span>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
        });
        
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Format chat time
    function formatChatTime(date, minutesOffset = 0) {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() + minutesOffset);
        
        const hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let prefix = '';
        if (d.toDateString() === today.toDateString()) {
            prefix = 'Today';
        } else if (d.toDateString() === yesterday.toDateString()) {
            prefix = 'Yesterday';
        } else {
            const month = d.getMonth() + 1;
            const day = d.getDate();
            prefix = `${month}/${day}`;
        }
        
        return `${prefix} at ${formattedHours}:${minutes} ${ampm}`;
    }
    
    // Send message
    if (chatForm) {
        chatForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const message = messageInput.value.trim();
            if (message === '') return;
            
            // Create outgoing message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message message-outgoing';
            
            messageDiv.innerHTML = `
                <div class="message-bubble">${message}</div>
                <div class="message-meta">
                    <span>You</span>
                    <span>Just now</span>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom of chat
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate response after delay
            setTimeout(function() {
                const activeTeam = document.querySelector('.team-item.active');
                if (!activeTeam) return;
                
                const teamId = parseInt(activeTeam.getAttribute('data-team-id'));
                const team = teams.find(t => t.id === teamId);
                
                if (!team) return;
                
                // Create simulated response
                const responseDiv = document.createElement('div');
                responseDiv.className = 'message message-incoming';
                
                const responses = [
                    "I'll look into that and get back to you soon.",
                    "Thanks for the update. We'll adjust our plans accordingly.",
                    "That's great to hear! The team will be pleased with this news.",
                    "I understand your concern. Let me discuss this with the team and find a solution.",
                    "We're on track to meet the deadline. I'll keep you updated on our progress."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                responseDiv.innerHTML = `
                    <div class="message-bubble">${randomResponse}</div>
                    <div class="message-meta">
                        <span>${team.leader}</span>
                        <span>Just now</span>
                    </div>
                `;
                
                chatMessages.appendChild(responseDiv);
                
                // Scroll to bottom of chat
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1500);
        });
    }
});