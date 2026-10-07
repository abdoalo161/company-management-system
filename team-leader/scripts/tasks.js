/**
 * Team Leader Tasks JavaScript
 * Unified module for task management, filtering, and task actions
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Team Leader Tasks module
ProjectManager.Tasks = (function() {
    // Private variables
    let allTasks = [];
    let filterButtons;
    let taskRows;
    let currentFilter = 'all';
    let assignTaskForm;
    let assignTaskBtn;
    let currentMemberId;
    
    // Initialize tasks functionality
    function init() {
        try {
            // Initialize task management elements
            initTaskManagement();
            
            // Initialize filter buttons
            initFilterButtons();
            
            // Initialize task action buttons
            initTaskActions();
            
            // Load tasks from localStorage
            loadTasks();
            
        } catch (error) {
            console.error('Error initializing Tasks module:', error);
            showToast('Error initializing tasks', 'error');
        }
    }
    
    // Initialize task management functionality
    function initTaskManagement() {
        try {
            // Get the form and related elements
            assignTaskForm = document.getElementById('assignTaskForm');
            assignTaskBtn = document.getElementById('assignTaskBtn');
            
            if (!assignTaskForm || !assignTaskBtn) {
                console.error('Required task management elements not found');
                return;
            }
            
            // Set default dates
            setDefaultDates();
            
            // Add event listener to assign task button
            assignTaskBtn.addEventListener('click', assignTask);
            
            // Add event listeners to task links in the team members page
            const assignTaskLinks = document.querySelectorAll('.dropdown-item[data-bs-target="#assignTaskModal"]');
            assignTaskLinks.forEach(link => {
                // Get the member data from the row
                const memberRow = link.closest('tr');
                if (memberRow) {
                    const memberId = memberRow.getAttribute('data-member-id');
                    const memberName = memberRow.querySelector('h6').textContent;
                    
                    // Set data attributes on the link
                    link.setAttribute('data-member-id', memberId);
                    link.setAttribute('data-member-name', memberName);
                }
                
                link.addEventListener('click', function() {
                    populateAssignTaskForm(this);
                });
            });
            
            console.log('Task management initialized');
        } catch (error) {
            console.error('Error initializing task management:', error);
        }
    }
    
    // Set default dates for the form
    function setDefaultDates() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to beginning of the day for comparison
            const todayFormatted = formatDateForInput(today);
            
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            const nextWeekFormatted = formatDateForInput(nextWeek);
            
            // Set default values for date fields
            const startDateField = document.getElementById('taskStartDate');
            const dueDateField = document.getElementById('taskDueDate');
            
            if (startDateField && dueDateField) {
                startDateField.value = todayFormatted;
                dueDateField.value = nextWeekFormatted;
                
                // Set min attributes to prevent selecting dates in the past
                startDateField.min = todayFormatted;
                dueDateField.min = todayFormatted;
            }
        } catch (error) {
            console.error('Error setting default dates:', error);
            showToast('Error initializing date fields', 'error');
        }
    }
    
    // Format date for input fields (YYYY-MM-DD)
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Populate assign task form with member data
    function populateAssignTaskForm(assignLink) {
        try {
            // Get member data from the link's data attributes
            const memberId = assignLink.getAttribute('data-member-id');
            const memberName = assignLink.getAttribute('data-member-name');
            
            if (!memberId || !memberName) {
                console.error('Missing member data for task assignment');
                return;
            }
            
            // Store current member ID
            currentMemberId = memberId;
            
            // Update modal title with member name
            const modalTitle = document.getElementById('assignTaskModalLabel');
            if (modalTitle) {
                modalTitle.textContent = `Assign Task to ${memberName}`;
            }
            
            // Update member name display in the modal
            const memberNameDisplay = document.getElementById('assignTaskMemberName');
            if (memberNameDisplay) {
                memberNameDisplay.textContent = memberName;
            }
            
            // Set member ID in the hidden field
            const memberIdField = document.getElementById('assignTaskMemberId');
            if (memberIdField) {
                memberIdField.value = memberId;
            }
            
            // Reset form fields
            if (assignTaskForm) {
                assignTaskForm.reset();
                setDefaultDates();
            }
        } catch (error) {
            console.error('Error populating assign task form:', error);
        }
    }
    
    // Get initials from a name
    function getInitials(name) {
        if (!name) return '';
        
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    }
    
    // Assign task to team member
    function assignTask() {
        try {
            // Check if we have a valid member ID
            if (!currentMemberId) {
                // Try to get member ID from the form
                const memberIdField = document.getElementById('assignTaskMemberId');
                if (memberIdField && memberIdField.value) {
                    currentMemberId = memberIdField.value;
                } else {
                    showToast('No team member selected for task assignment', 'error');
                    return;
                }
            }
            
            // Validate form
            if (!ProjectManager.FormValidation.validateForm(assignTaskForm)) {
                // Show validation error notification
                showToast('Please correct the errors in the form', 'warning');
                return;
            }
            
            // Get form values
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const priority = document.getElementById('taskPriority') ? document.getElementById('taskPriority').value : 'medium';
            const startDate = document.getElementById('taskStartDate') ? document.getElementById('taskStartDate').value : '';
            const dueDate = document.getElementById('taskDueDate') ? document.getElementById('taskDueDate').value : '';
            
            // Get today's date (beginning of day)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Convert string dates to Date objects
            const startDateObj = new Date(startDate);
            const dueDateObj = new Date(dueDate);
            
            // Validate that start date is not in the past
            if (startDateObj < today) {
                showToast('Start date cannot be in the past', 'warning');
                return;
            }
            
            // Validate that due date is after start date
            if (dueDateObj <= startDateObj) {
                showToast('Due date must be after start date', 'warning');
                return;
            }
            
            // Get member data
            const memberData = JSON.parse(localStorage.getItem('teamMembers')) || [];
            
            // If no team members exist, initialize with sample data
            if (memberData.length === 0) {
                initializeTeamMembersData();
                const updatedMemberData = JSON.parse(localStorage.getItem('teamMembers')) || [];
                if (updatedMemberData.length === 0) {
                    showToast('Could not initialize team members data', 'error');
                    return;
                }
            }
            
            // Debug: Log all available member IDs
            console.log('Current member ID:', currentMemberId);
            console.log('Available member IDs:', memberData.map(m => m.id));
            
            // Try to find the member - use a more flexible comparison
            let member = null;
            
            // First try exact match
            member = memberData.find(m => m.id === currentMemberId);
            
            // If not found, try with different formats (hyphen vs underscore)
            if (!member && currentMemberId.includes('-')) {
                const altId = currentMemberId.replace(/-/g, '_');
                member = memberData.find(m => m.id === altId);
                if (member) {
                    // Update the member ID to match the format in the HTML
                    member.id = currentMemberId;
                    localStorage.setItem('teamMembers', JSON.stringify(memberData));
                }
            } else if (!member && currentMemberId.includes('_')) {
                const altId = currentMemberId.replace(/_/g, '-');
                member = memberData.find(m => m.id === altId);
                if (member) {
                    // Update the member ID to match the format in localStorage
                    currentMemberId = altId;
                }
            }
            
            // If still not found, create a new member
            if (!member) {
                // Try to get member name from the modal
                const memberNameElement = document.getElementById('assignTaskMemberName');
                const memberName = memberNameElement ? memberNameElement.textContent : 'Team Member';
                
                // Create a new member object
                member = {
                    id: currentMemberId,
                    name: memberName,
                    position: 'Team Member',
                    email: 'member@example.com',
                    activeTasks: 0
                };
                
                // Add to memberData and save
                memberData.push(member);
                localStorage.setItem('teamMembers', JSON.stringify(memberData));
                console.log('Created new member:', member);
            }
            
            const memberName = member.name;
            const memberInitials = getInitials(memberName);
            
            // Create task object
            const task = {
                id: 'task_' + Date.now(),
                title: title,
                description: description,
                assignedTo: {
                    id: currentMemberId,
                    name: memberName,
                    initials: memberInitials
                },
                priority: priority,
                startDate: startDate,
                dueDate: dueDate,
                status: 'assigned',
                progress: 0,
                createdDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            // Save task to localStorage
            saveTask(task);
            
            // Update UI - increase active tasks count
            updateActiveTasksCount(currentMemberId);
            
            // Show success notification
            showToast(
                `Task "${title}" has been assigned to ${memberName}`, 
                'success'
            );
            
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('assignTaskModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reload tasks to show the new task
            loadTasks();
            
        } catch (error) {
            console.error('Error assigning task:', error);
            showToast('An error occurred while assigning the task', 'error');
        }
    }
    
    // Save task to localStorage
    function saveTask(task) {
        try {
            // Get existing tasks
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Add new task
            tasks.push(task);
            
            // Save back to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Update member's task count
            updateMemberTaskCount(task.assignedTo.id);
            
            console.log('Task saved successfully:', task);
            
        } catch (error) {
            console.error('Error saving task:', error);
        }
    }
    
    // Update member's active tasks count
    function updateMemberTaskCount(memberId) {
        try {
            // Get team members data
            const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
            
            // Find the member
            const memberIndex = teamMembers.findIndex(member => member.id === memberId);
            
            if (memberIndex === -1) {
                console.warn('Member not found for task count update:', memberId);
                return;
            }
            
            // Get all tasks for this member
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const activeTasks = tasks.filter(task => 
                task.assignedTo.id === memberId && 
                task.status !== 'completed'
            );
            
            // Update member's active tasks count
            teamMembers[memberIndex].activeTasks = activeTasks.length;
            
            // Save back to localStorage
            localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
            
        } catch (error) {
            console.error('Error updating member task count:', error);
        }
    }
    
    // Update active tasks count in the UI
    function updateActiveTasksCount(memberId) {
        try {
            // Get team members data
            const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
            
            // Find the member
            const member = teamMembers.find(m => m.id === memberId);
            
            if (!member) {
                console.warn('Member not found for UI update:', memberId);
                return;
            }
            
            // Update UI elements with active tasks count
            const activeTasksCountElements = document.querySelectorAll(`[data-member-id="${memberId}"] .active-tasks-count`);
            
            activeTasksCountElements.forEach(element => {
                element.textContent = member.activeTasks || 0;
            });
            
        } catch (error) {
            console.error('Error updating active tasks count in UI:', error);
        }
    }
    
    // Initialize filter buttons
    function initFilterButtons() {
        filterButtons = document.querySelectorAll('.task-filter');
        if (!filterButtons.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterType = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Apply filter
                applyFilter(filterType);
            });
        });
    }
    
    // Apply filter to tasks
    function applyFilter(filterType) {
        currentFilter = filterType;
        taskRows = document.querySelectorAll('.tasks-table tbody tr');
        
        if (!taskRows.length) return;
        
        taskRows.forEach(row => {
            // Get status badge
            const statusCell = row.querySelector('td:nth-child(5)');
            const statusBadge = statusCell ? statusCell.querySelector('.badge') : null;
            
            // Get priority badge
            const priorityCell = row.querySelector('td:nth-child(4)');
            const priorityBadge = priorityCell ? priorityCell.querySelector('.badge') : null;
            
            if (!statusBadge) return;
            
            const status = statusBadge.textContent.toLowerCase();
            const priority = priorityBadge ? priorityBadge.textContent.toLowerCase() : '';
            
            let showRow = false;
            
            switch(filterType) {
                case 'all':
                    showRow = true;
                    break;
                case 'in progress':
                    showRow = status === 'in progress';
                    break;
                case 'completed':
                    showRow = status === 'completed';
                    break;
                case 'pending':
                    showRow = status === 'pending';
                    break;
                case 'high':
                    showRow = priority === 'high';
                    break;
                default:
                    showRow = true;
            }
            
            row.style.display = showRow ? '' : 'none';
        });
        
        // Update task count
        updateTaskCount();
    }
    
    // Initialize sample tasks if none exist
    function initializeSampleTasks() {
        const sampleTasks = [
            {
                id: 'task_1',
                title: 'Complete project proposal',
                description: 'Finalize the project proposal document with all requirements',
                dueDate: '2025-05-25',
                priority: 'high',
                status: 'in progress',
                assignedTo: {
                    id: 'member_1',
                    name: 'John Smith'
                },
                createdAt: '2025-05-10T10:00:00Z',
                lastUpdated: '2025-05-15T14:30:00Z'
            },
            {
                id: 'task_2',
                title: 'Review code changes',
                description: 'Review pull request #42 with frontend changes',
                dueDate: '2025-05-20',
                priority: 'medium',
                status: 'pending',
                assignedTo: {
                    id: 'member_2',
                    name: 'Sarah Johnson'
                },
                createdAt: '2025-05-12T09:15:00Z',
                lastUpdated: '2025-05-12T09:15:00Z'
            },
            {
                id: 'task_3',
                title: 'Update UI design',
                description: 'Implement new UI design based on feedback',
                dueDate: '2025-05-22',
                priority: 'high',
                status: 'in progress',
                assignedTo: {
                    id: 'member_3',
                    name: 'Alex Morgan'
                },
                createdAt: '2025-05-14T11:30:00Z',
                lastUpdated: '2025-05-16T10:45:00Z'
            },
            {
                id: 'task_4',
                title: 'Test checkout process',
                description: 'Perform end-to-end testing of the checkout process',
                dueDate: '2025-05-18',
                priority: 'medium',
                status: 'completed',
                assignedTo: {
                    id: 'member_4',
                    name: 'Emily Wilson'
                },
                createdAt: '2025-05-08T14:20:00Z',
                lastUpdated: '2025-05-17T09:00:00Z'
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        
        return sampleTasks;
    }
    
    // Create a task object from row data
    function createTaskFromRow(taskRow, updates) {
        // Get task title
        const titleElement = taskRow.querySelector('h6');
        const title = titleElement ? titleElement.textContent : 'Untitled Task';
        
        // Get task description
        const descElement = taskRow.querySelector('small');
        const description = descElement ? descElement.textContent : '';
        
        // Get task ID
        const taskId = taskRow.getAttribute('data-task-id') || 'task_' + Date.now();
        
        // Create a new task object
        const newTask = {
            id: taskId,
            title: title,
            description: description,
            dueDate: updates.dueDate || new Date().toISOString().split('T')[0],
            priority: updates.priority || 'medium',
            status: updates.status || 'pending',
            assignedTo: updates.assignedTo || null,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        return newTask;
    }
    
    // Update task count based on current filter
    function updateTaskCount() {
        const taskTable = document.querySelector('.tasks-table tbody');
        if (!taskTable) return;
        
        // Get all task rows
        taskRows = taskTable.querySelectorAll('tr');
        
        // Count visible tasks
        let visibleTasks = 0;
        taskRows.forEach(row => {
            if (row.style.display !== 'none') {
                visibleTasks++;
            }
        });
        
        const totalTasks = taskRows.length;
        
        const taskCountElement = document.querySelector('.task-count');
        if (taskCountElement) {
            taskCountElement.textContent = `${visibleTasks} of ${totalTasks} tasks`;
        }
    }
    
    // Initialize task action buttons
    function initTaskActions() {
        // Task Actions - only target dropdown items within the tasks table
        const tasksTable = document.querySelector('.tasks-table');
        
        // If tasks table doesn't exist on this page, don't proceed
        if (!tasksTable) {
            return;
        }
        
        // Only select dropdown items that are within the tasks table
        tasksTable.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.textContent.trim().toLowerCase();
                const taskRow = this.closest('tr');
                
                // This should always exist now, but keep the check as a safeguard
                if (!taskRow) {
                    console.warn('Task row not found for this dropdown item');
                    return;
                }
                
                const taskTitleElement = taskRow.querySelector('h6');
                if (!taskTitleElement) {
                    console.warn('Task title element not found in the row');
                    return;
                }
                
                const taskTitle = taskTitleElement.textContent;
                
                if (action === 'change due date') {
                    changeDueDate(taskRow);
                } else if (action === 'change status') {
                    changeTaskStatus(taskRow);
                } else if (action === 'reassign') {
                    reassignTask(taskRow);
                } else if (action === 'delete') {
                    deleteTask(taskRow);
                }
            });
        });
    }
    
    // Change due date
    function changeDueDate(taskRow) {
        const taskTitle = taskRow.querySelector('h6').textContent;
        const dueDateCell = taskRow.querySelector('td:nth-child(3)');
        const dueDate = dueDateCell ? dueDateCell.textContent : '';
        
        // Create a modal for changing the due date
        const modalHTML = `
            <div class="modal fade" id="changeDueDateModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Change Due Date</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="changeDueDateForm">
                                <div class="mb-3">
                                    <label class="form-label">Task</label>
                                    <p class="form-control-plaintext">${taskTitle}</p>
                                </div>
                                <div class="mb-3">
                                    <label for="newDueDate" class="form-label">New Due Date</label>
                                    <input type="date" class="form-control" id="newDueDate" required data-validate="required,date">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveDueDateBtn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize the modal
        const modal = new bootstrap.Modal(document.getElementById('changeDueDateModal'));
        modal.show();
        
        // Set default value for the date input
        const today = new Date();
        const newDueDateInput = document.getElementById('newDueDate');
        newDueDateInput.min = formatDateForInput(today);
        
        // Try to parse the current due date
        try {
            const dateParts = dueDate.split(',')[0].trim().split(' ');
            const month = getMonthNumber(dateParts[0]);
            const day = parseInt(dateParts[1]);
            const year = new Date().getFullYear();
            
            const dateObj = new Date(year, month - 1, day);
            if (!isNaN(dateObj.getTime())) {
                newDueDateInput.value = formatDateForInput(dateObj);
            } else {
                newDueDateInput.value = formatDateForInput(new Date());
            }
        } catch (error) {
            console.warn('Error parsing due date:', error);
            newDueDateInput.value = formatDateForInput(new Date());
        }
        
        // Add event listener to the save button
        document.getElementById('saveDueDateBtn').addEventListener('click', function() {
            const form = document.getElementById('changeDueDateForm');
            
            // Validate form
            if (!ProjectManager.FormValidation.validateForm(form)) {
                showToast('Please select a valid date', 'warning');
                return;
            }
            
            const newDueDate = document.getElementById('newDueDate').value;
            const newDueDateObj = new Date(newDueDate);
            
            // Format the date for display
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            const formattedDate = newDueDateObj.toLocaleDateString('en-US', options);
            
            // Update the cell in the table
            if (dueDateCell) {
                dueDateCell.textContent = formattedDate;
            }
            
            // Update the task in localStorage
            updateTaskInStorage(taskRow, { dueDate: newDueDate });
            
            // Show success notification
            showToast(`Due date for "${taskTitle}" has been updated to ${formattedDate}`, 'success');
            
            // Close and remove the modal
            modal.hide();
            document.getElementById('changeDueDateModal').addEventListener('hidden.bs.modal', function() {
                modalContainer.remove();
            });
        });
        
        // Remove the modal when it's closed
        document.getElementById('changeDueDateModal').addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
    }
    
    // Change task status
    function changeTaskStatus(taskRow) {
        const taskTitle = taskRow.querySelector('h6').textContent;
        const statusCell = taskRow.querySelector('td:nth-child(5)');
        const statusBadge = statusCell ? statusCell.querySelector('.badge') : null;
        const currentStatus = statusBadge ? statusBadge.textContent.toLowerCase() : '';
        
        // Create a modal for changing the status
        const modalHTML = `
            <div class="modal fade" id="changeStatusModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Change Task Status</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="changeStatusForm">
                                <div class="mb-3">
                                    <label class="form-label">Task</label>
                                    <p class="form-control-plaintext">${taskTitle}</p>
                                </div>
                                <div class="mb-3">
                                    <label for="newStatus" class="form-label">New Status</label>
                                    <select class="form-select" id="newStatus" required data-validate="required">
                                        <option value="assigned" ${currentStatus === 'assigned' ? 'selected' : ''}>Assigned</option>
                                        <option value="in progress" ${currentStatus === 'in progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="review" ${currentStatus === 'review' ? 'selected' : ''}>Review</option>
                                        <option value="completed" ${currentStatus === 'completed' ? 'selected' : ''}>Completed</option>
                                        <option value="pending" ${currentStatus === 'pending' ? 'selected' : ''}>Pending</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveStatusBtn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize the modal
        const modal = new bootstrap.Modal(document.getElementById('changeStatusModal'));
        modal.show();
        
        // Add event listener to the save button
        document.getElementById('saveStatusBtn').addEventListener('click', function() {
            const form = document.getElementById('changeStatusForm');
            
            // Validate form
            if (!ProjectManager.FormValidation.validateForm(form)) {
                showToast('Please select a status', 'warning');
                return;
            }
            
            const newStatus = document.getElementById('newStatus').value;
            
            // Update the badge in the table
            if (statusBadge) {
                // Remove existing color classes
                statusBadge.classList.remove('bg-primary', 'bg-success', 'bg-warning', 'bg-info', 'bg-secondary');
                
                // Add appropriate color class based on status
                switch(newStatus) {
                    case 'assigned':
                        statusBadge.classList.add('bg-primary');
                        break;
                    case 'in progress':
                        statusBadge.classList.add('bg-info');
                        break;
                    case 'review':
                        statusBadge.classList.add('bg-warning');
                        break;
                    case 'completed':
                        statusBadge.classList.add('bg-success');
                        break;
                    case 'pending':
                        statusBadge.classList.add('bg-secondary');
                        break;
                }
                
                // Update text
                statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
            }
            
            // Update the task in localStorage
            updateTaskInStorage(taskRow, { status: newStatus });
            
            // Apply current filter (to hide/show based on status)
            applyFilter(currentFilter);
            
            // Show success notification
            showToast(`Status for "${taskTitle}" has been updated to ${newStatus}`, 'success');
            
            // Close and remove the modal
            modal.hide();
            document.getElementById('changeStatusModal').addEventListener('hidden.bs.modal', function() {
                modalContainer.remove();
            });
        });
        
        // Remove the modal when it's closed
        document.getElementById('changeStatusModal').addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
    }
    
    // Reassign task
    function reassignTask(taskRow) {
        const taskTitle = taskRow.querySelector('h6').textContent;
        const assigneeCell = taskRow.querySelector('td:nth-child(2)');
        const assigneeDiv = assigneeCell ? assigneeCell.querySelector('.d-flex') : null;
        const currentAssigneeInitials = assigneeDiv ? assigneeDiv.querySelector('.avatar').textContent.trim() : '';
        
        // Get team members for the dropdown
        const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
        
        // Create options for the select element
        let memberOptions = '';
        teamMembers.forEach(member => {
            const initials = getInitials(member.name);
            const selected = initials === currentAssigneeInitials ? 'selected' : '';
            memberOptions += `<option value="${member.id}" data-initials="${initials}" ${selected}>${member.name}</option>`;
        });
        
        // Create a modal for reassigning the task
        const modalHTML = `
            <div class="modal fade" id="reassignTaskModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Reassign Task</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="reassignTaskForm">
                                <div class="mb-3">
                                    <label class="form-label">Task</label>
                                    <p class="form-control-plaintext">${taskTitle}</p>
                                </div>
                                <div class="mb-3">
                                    <label for="newAssignee" class="form-label">New Assignee</label>
                                    <select class="form-select" id="newAssignee" required data-validate="required">
                                        ${memberOptions}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveAssigneeBtn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize the modal
        const modal = new bootstrap.Modal(document.getElementById('reassignTaskModal'));
        modal.show();
        
        // Add event listener to the save button
        document.getElementById('saveAssigneeBtn').addEventListener('click', function() {
            const form = document.getElementById('reassignTaskForm');
            
            // Validate form
            if (!ProjectManager.FormValidation.validateForm(form)) {
                showToast('Please select a team member', 'warning');
                return;
            }
            
            const assigneeSelect = document.getElementById('newAssignee');
            const newAssigneeId = assigneeSelect.value;
            const newAssigneeInitials = assigneeSelect.options[assigneeSelect.selectedIndex].getAttribute('data-initials');
            const newAssigneeName = assigneeSelect.options[assigneeSelect.selectedIndex].text;
            
            if (!newAssigneeInitials) {
                showToast('Please select a team member', 'warning');
                return;
            }
            
            // Update the assignee in the table
            if (assigneeDiv) {
                const avatar = assigneeDiv.querySelector('.avatar');
                const nameSpan = assigneeDiv.querySelector('span');
                
                if (avatar) {
                    avatar.textContent = newAssigneeInitials;
                }
                
                if (nameSpan) {
                    nameSpan.textContent = newAssigneeName;
                }
            }
            
            // Update the task in localStorage
            updateTaskInStorage(taskRow, {
                assignedTo: {
                    id: newAssigneeId,
                    name: newAssigneeName,
                    initials: newAssigneeInitials
                }
            });
            
            // Show success notification
            showToast(`Task "${taskTitle}" has been reassigned to ${newAssigneeName}`, 'success');
            
            // Close and remove the modal
            modal.hide();
            document.getElementById('reassignTaskModal').addEventListener('hidden.bs.modal', function() {
                modalContainer.remove();
            });
        });
        
        // Remove the modal when it's closed
        document.getElementById('reassignTaskModal').addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
    }
    
    // Delete task
    function deleteTask(taskRow) {
        const taskTitle = taskRow.querySelector('h6').textContent;
        
        // Create a modal for delete confirmation
        const modalHTML = `
            <div class="modal fade" id="deleteTaskModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Confirm Delete</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you want to delete the task "${taskTitle}"?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize the modal
        const modal = new bootstrap.Modal(document.getElementById('deleteTaskModal'));
        modal.show();
        
        // Add event listener to the confirm button
        document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
            // Remove the task from localStorage
            updateTaskInStorage(taskRow, null, true);
            
            // Remove the row from the table with a fade effect
            taskRow.style.opacity = '0';
            
            // Close the modal
            modal.hide();
            
            // Set a timeout to ensure everything happens in sequence
            setTimeout(function() {
                // Remove the row
                taskRow.remove();
                
                // Update task count
                updateTaskCount();
                
                // Show success notification with a slight delay
                setTimeout(function() {
                    showToast(`Task "${taskTitle}" has been deleted`, 'success');
                }, 100);
            }, 500);
        });
        
        // Remove the modal when it's closed
        document.getElementById('deleteTaskModal').addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
    }
    
    // Update task in localStorage
    function updateTaskInStorage(taskRow, updates, isDelete = false) {
        try {
            // Get the task ID from the row
            const taskId = taskRow.getAttribute('data-task-id');
            
            if (!taskId) {
                console.warn('Task ID not found in the row');
                return;
            }
            
            // Get all tasks from localStorage
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // If tasks array is empty, initialize it with sample data
            if (tasks.length === 0) {
                tasks = initializeSampleTasks();
            }
            
            // Find the task index
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex === -1) {
                console.warn('Task not found in localStorage:', taskId);
                // Create a new task object based on the row data if it doesn't exist
                if (!isDelete && updates) {
                    const newTask = createTaskFromRow(taskRow, updates);
                    tasks.push(newTask);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    return;
                }
                return;
            }
            
            if (isDelete) {
                // Delete the task
                const deletedTask = tasks.splice(taskIndex, 1)[0];
                
                // Update member's task count
                if (deletedTask && deletedTask.assignedTo && deletedTask.assignedTo.id) {
                    updateMemberTaskCount(deletedTask.assignedTo.id);
                }
            } else {
                // Update the task
                const oldAssigneeId = tasks[taskIndex].assignedTo ? tasks[taskIndex].assignedTo.id : null;
                
                // Apply updates
                Object.assign(tasks[taskIndex], updates);
                
                // Update lastUpdated timestamp
                tasks[taskIndex].lastUpdated = new Date().toISOString();
                
                // If assignee changed, update task counts for both old and new assignees
                if (updates.assignedTo && oldAssigneeId !== updates.assignedTo.id) {
                    if (oldAssigneeId) {
                        updateMemberTaskCount(oldAssigneeId);
                    }
                    updateMemberTaskCount(updates.assignedTo.id);
                }
                
                // If status changed to/from completed, update task count
                if (updates.status && 
                    ((tasks[taskIndex].status === 'completed' && updates.status !== 'completed') ||
                     (tasks[taskIndex].status !== 'completed' && updates.status === 'completed'))) {
                    updateMemberTaskCount(tasks[taskIndex].assignedTo.id);
                }
            }
            
            // Save back to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
        } catch (error) {
            console.error('Error updating task in storage:', error);
        }
    }
    
    // Load tasks from localStorage
    function loadTasks() {
        // Implementation depends on the UI structure
        console.log('Loading tasks from localStorage');
        
        // Ensure team members data exists in localStorage
        initializeTeamMembersData();
    }
    
    // Initialize team members data if it doesn't exist
    function initializeTeamMembersData() {
        const teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
        
        // Only initialize if no data exists
        if (teamMembers.length === 0) {
            const defaultTeamMembers = [
                {
                    id: 'member-1',
                    name: 'John Smith',
                    position: 'Frontend Developer',
                    email: 'john.smith@example.com',
                    activeTasks: 2
                },
                {
                    id: 'member-2',
                    name: 'Sarah Johnson',
                    position: 'Backend Developer',
                    email: 'sarah.johnson@example.com',
                    activeTasks: 1
                },
                {
                    id: 'member-3',
                    name: 'Alex Morgan',
                    position: 'UI/UX Designer',
                    email: 'alex.morgan@example.com',
                    activeTasks: 1
                },
                {
                    id: 'member-4',
                    name: 'Emily Wilson',
                    position: 'QA Engineer',
                    email: 'emily.wilson@example.com',
                    activeTasks: 1
                }
            ];
            
            localStorage.setItem('teamMembers', JSON.stringify(defaultTeamMembers));
            console.log('Team members data initialized');
        }
    }
    
    // Helper function to get month number from month name
    function getMonthNumber(monthName) {
        const months = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
        
        return months[monthName] || 1;
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1080';
            document.body.appendChild(toastContainer);
        }
        
        // Create a unique ID for this toast
        const toastId = 'toast-' + Date.now();
        
        // Determine the appropriate color class based on type
        let colorClass = 'bg-info text-white';
        let icon = '<i class="bi bi-info-circle me-2"></i>';
        
        switch (type) {
            case 'success':
                colorClass = 'bg-success text-white';
                icon = '<i class="bi bi-check-circle me-2"></i>';
                break;
            case 'warning':
                colorClass = 'bg-warning text-dark';
                icon = '<i class="bi bi-exclamation-triangle me-2"></i>';
                break;
            case 'error':
            case 'danger':
                colorClass = 'bg-danger text-white';
                icon = '<i class="bi bi-x-circle me-2"></i>';
                break;
        }
        
        // Create the toast HTML
        const toastHtml = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${colorClass}">
                    ${icon}
                    <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        // Add the toast to the container
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        // Initialize the Bootstrap toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        
        // Show the toast
        toast.show();
        
        // Remove the toast element when hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize the tasks module when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.Tasks.init();
});
