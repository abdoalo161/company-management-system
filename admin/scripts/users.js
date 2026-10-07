// Custom scripts for users.html

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality is now handled by sidebar.js
    // Sidebar functionality is now handled by sidebar.js
    
    // Table sorting state
    let currentSortColumn = null;
    let currentSortDirection = 'asc';
    // Get modal elements
    const editModalElement = document.getElementById('editUserModal');
    const editModalCloseBtn = editModalElement.querySelector('.btn-close');
    const editModalCancelBtn = editModalElement.querySelector('.btn-secondary');
    
    // Store the element that had focus before the modal was opened
    let lastFocusedElement = null;
    
    // Handle close button clicks
    editModalCloseBtn.addEventListener('click', () => {
        editModalElement.close();
    });
    
    editModalCancelBtn.addEventListener('click', () => {
        editModalElement.close();
    });
    
    // Handle modal events
    editModalElement.addEventListener('close', () => {
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    });
    
    // Initialize other modals
    const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    const importExcelModal = new bootstrap.Modal(document.getElementById('importExcelModal'));
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    
    // DOM Elements
    const addUserBtn = document.getElementById('addUserBtn');
    const importExcelBtn = document.getElementById('importExcelBtn');
    const userSearch = document.getElementById('userSearch');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const updateUserBtn = document.getElementById('updateUserBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const processExcelBtn = document.getElementById('processExcelBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    // Function to create table row for a user
    function createUserTableRow(user) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-medium">${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.team}</td>
            <td><span class="badge ${user.status.toLowerCase() === 'active' ? 'bg-success' : 'bg-danger'}">${user.status}</span></td>
            <td class="text-end">
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item chat-user" href="#" data-user-id="${user.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots me-2 text-primary" viewBox="0 0 16 16">
                                <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                            </svg> Chat
                        </a></li>
                        <li><a class="dropdown-item edit-user" href="#" data-user-id="${user.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-2 text-warning" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg> Edit
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item remove-user text-danger" href="#" data-user-id="${user.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash me-2 text-danger" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg> Remove
                        </a></li>
                    </ul>
                </div>
            </td>
        `;
        return row;
    }

    // Function to add user to table
    function addUserToTable(user) {
        const tbody = document.querySelector('tbody');
        const row = createUserTableRow(user);
        tbody.appendChild(row);
    }

    // Sample user data - replace with actual data from backend
    // Make users variable accessible globally for the dashboard
    window.users = [
        { id: 1, firstName: 'John', lastName: 'Doe', name: 'John Doe', email: 'john.doe@example.com', role: 'Team Leader', team: 'Development', status: 'Active' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Team Member', team: 'Development', status: 'Active' },
        { id: 3, firstName: 'Mike', lastName: 'Johnson', name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Team Member', team: 'Design', status: 'Active' },
        { id: 4, firstName: 'Sarah', lastName: 'Williams', name: 'Sarah Williams', email: 'sarah.williams@example.com', role: 'Team Leader', team: 'QA', status: 'Inactive' },
        { id: 5, firstName: 'David', lastName: 'Brown', name: 'David Brown', email: 'david.brown@example.com', role: 'Team Member', team: 'Full Stack', status: 'Active' }
    ];
    
    // Event Listeners
    addUserBtn.addEventListener('click', () => {
        // Reset form
        document.getElementById('addUserForm').reset();
        addUserModal.show();
    });
    
    importExcelBtn.addEventListener('click', () => {
        importExcelModal.show();
    });
    
    // Initialize table sorting function
    function initTableSorting() {
        const sortableHeaders = document.querySelectorAll('th.sortable');
        if (!sortableHeaders || sortableHeaders.length === 0) return;
        
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const sortBy = this.dataset.sort;
                
                // Toggle sort direction if clicking the same column
                if (currentSortColumn === sortBy) {
                    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = sortBy;
                    currentSortDirection = 'asc';
                }
                
                // Update sort indicators
                sortableHeaders.forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });
                
                this.classList.add(currentSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
                
                // Sort the table
                sortTable(sortBy, currentSortDirection);
            });
        });
    }
    
    // Call the initialization function
    initTableSorting();
    
    // Save initial users data to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Search functionality
    userSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
            const name = row.querySelector('td:first-child').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const role = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const team = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || email.includes(searchTerm) || 
                role.includes(searchTerm) || team.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    // Form validation function
    function validateForm(form) {
        let isValid = true;
        form.classList.remove('was-validated');
        
        // Check each required input
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
            }
        });
        
        // Show validation feedback
        if (!isValid) {
            form.classList.add('was-validated');
        }
        
        return isValid;
    }
    
    // Form validation function
    function validateForm(form) {
        let isValid = true;
        form.classList.remove('was-validated');
        
        // Check each required input
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
            }
        });
        
        // Show validation feedback
        if (!isValid) {
            form.classList.add('was-validated');
        }
        
        return isValid;
    }
    
    // Add user functionality
    saveUserBtn.addEventListener('click', () => {
        const form = document.getElementById('addUserForm');
        
        // Validate form
        if (!validateForm(form)) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

    const userFirstName = document.getElementById('userFirstName').value.trim();
    const userLastName = document.getElementById('userLastName').value.trim();
    const userName = userFirstName + ' ' + userLastName;
    const userEmail = document.getElementById('userEmail').value.trim();
    const userRole = document.getElementById('userRole').value;
    const userTeam = document.getElementById('userTeam').value;
    const userStatus = document.getElementById('userStatus').value;

    // Generate new ID (would be handled by backend in a real app)
    const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;

    // Add to users array
    const newUser = {
        id: newId,
        firstName: userFirstName,
        lastName: userLastName,
        name: userName,
        email: userEmail,
        role: userRole,
        team: userTeam,
        status: userStatus
    };

    users.push(newUser);

    // Add to table
    addUserToTable(newUser);

    // Close modal
    addUserModal.hide();

    // Save users to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    showToast('User added successfully', 'success');
});

// Handle edit user clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-user')) {
        const editButton = e.target.closest('.edit-user');
        const userId = editButton.getAttribute('data-user-id');
        const user = users.find(u => u.id == userId);

        if (user) {
            // Store the button that opened the modal
            lastFocusedElement = editButton;

            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserFirstName').value = user.firstName;
            document.getElementById('editUserLastName').value = user.lastName;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserTeam').value = user.team;
            document.getElementById('editUserStatus').value = user.status;

            editModalElement.showModal();

            // Focus first input after modal is shown
            const firstInput = editModalElement.querySelector('input:not([type=hidden])');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }
});

// Update user functionality
updateUserBtn.addEventListener('click', () => {
    const form = document.getElementById('editUserForm');

    // Validate form
    if (!validateForm(form)) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const userId = document.getElementById('editUserId').value;
    const userFirstName = document.getElementById('editUserFirstName').value.trim();
    const userLastName = document.getElementById('editUserLastName').value.trim();
    const userName = userFirstName + ' ' + userLastName;
    const userEmail = document.getElementById('editUserEmail').value.trim();
    const userRole = document.getElementById('editUserRole').value;
    const userTeam = document.getElementById('editUserTeam').value;
    const userStatus = document.getElementById('editUserStatus').value;

    // Update users array
    const userIndex = users.findIndex(u => u.id == userId);
    if (userIndex !== -1) {
        users[userIndex] = {
            id: parseInt(userId),
            firstName: userFirstName,
            lastName: userLastName,
            name: userName,
            email: userEmail,
            role: userRole,
            team: userTeam,
            status: userStatus
        };

        // Get the edit button that was clicked
        const editButton = document.querySelector(`button.edit-user[data-user-id="${userId}"]`);

        // Update table row
        const row = document.querySelector(`tr:has([data-user-id="${userId}"])`);
        if (row) {
            const newRow = createUserTableRow({
                id: parseInt(userId),
                firstName: userFirstName,
                lastName: userLastName,
                name: userName,
                email: userEmail,
                role: userRole,
                team: userTeam,
                status: userStatus
            });
            row.replaceWith(newRow);
        }

        // Save users to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Update data
        localStorage.setItem('users', JSON.stringify(users));

        // Close modal
        editModalElement.close();

        // Show success message
        showToast('User updated successfully', 'success');
    }
});

// Handle remove user clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-user')) {
        e.preventDefault();
        const userId = e.target.closest('.remove-user').dataset.userId;
        document.getElementById('deleteUserId').value = userId;
        confirmDeleteModal.show();
    }
});

// Confirm delete functionality
confirmDeleteBtn.addEventListener('click', () => {
    const userId = document.getElementById('deleteUserId').value;

    // Remove from users array
    users = users.filter(u => u.id != userId);

    // Remove from table
    const userRow = document.querySelector(`[data-user-id="${userId}"]`).closest('tr');
    if (userRow) {
        userRow.remove();
    }

    // Close modal
    confirmDeleteModal.hide();

    // Save users to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    showToast('User removed successfully', 'success');
});

// Handle chat user clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.chat-user')) {
        e.preventDefault();
        const userId = e.target.closest('.chat-user').dataset.userId;
        const user = users.find(u => u.id == userId);
        
        if (user) {
            // Set chat user name
            document.getElementById('chatUserName').textContent = user.name;
            
            // Clear previous messages
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '<div class="text-center text-muted"><p>Start a conversation with this user</p></div>';
            
            // Show modal
            chatModal.show();
        }
    }
});
    
    // Send message functionality
    sendMessageBtn.addEventListener('click', () => {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message) {
            const chatMessages = document.getElementById('chatMessages');
            
            // Clear placeholder if it exists
            if (chatMessages.querySelector('.text-center.text-muted')) {
                chatMessages.innerHTML = '';
            }
            
            // Add message
            const messageElement = document.createElement('div');
            messageElement.className = 'message outgoing mb-3';
            messageElement.innerHTML = `
                <div class="d-flex justify-content-end">
                    <div class="message-content p-2 px-3 rounded bg-primary text-white">
                        ${message}
                    </div>
                </div>
                <div class="message-time text-end small text-muted mt-1">${getCurrentTime()}</div>
            `;
            
            chatMessages.appendChild(messageElement);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate response after 1 second
            setTimeout(() => {
                const responseElement = document.createElement('div');
                responseElement.className = 'message incoming mb-3';
                responseElement.innerHTML = `
                    <div class="d-flex">
                        <div class="message-content p-2 px-3 rounded bg-light">
                            Thanks for your message. I'll get back to you soon.
                        </div>
                    </div>
                    <div class="message-time small text-muted mt-1">${getCurrentTime()}</div>
                `;
                
                chatMessages.appendChild(responseElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    });
    
    // Import Excel functionality
    const previewExcelBtn = document.getElementById('previewExcelBtn');
    // Using the existing processExcelBtn variable declared at the top
    let excelData = null;
    let columnHeaders = [];
    
    // Preview Excel data
    previewExcelBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('excelFile');
        const hasHeader = document.getElementById('headerRow').checked;
        
        if (!fileInput.files.length) {
            showToast('Please select an Excel file', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: hasHeader ? undefined : 1,
                defval: '' // Set default value for empty cells
            });
            
            if (jsonData.length === 0) {
                showToast('No data found in the Excel file', 'error');
                return;
            }
            
            // Store the data for later use
            excelData = jsonData;
            
            // Get column headers
            if (hasHeader) {
                // If first row has headers, use those
                columnHeaders = Object.keys(jsonData[0]);
            } else {
                // Otherwise, generate numeric headers
                const maxColumns = Math.max(...jsonData.map(row => Object.keys(row).length));
                columnHeaders = Array.from({length: maxColumns}, (_, i) => (i + 1).toString());
            }
            
            // Populate column mapping dropdowns
            populateColumnMappings(columnHeaders);
            
            // Show the column mapping section
            document.getElementById('columnMappingSection').style.display = 'block';
            
            // Generate preview table
            generatePreview(jsonData.slice(0, 3), columnHeaders);
            
            // Enable the import button
            processExcelBtn.disabled = false;
        };
        
        reader.readAsArrayBuffer(file);
    });
    
    // Populate column mapping dropdowns
    function populateColumnMappings(headers) {
        const mappingSelects = [
            'firstNameColumn', 'lastNameColumn', 'fullNameColumn', 
            'emailColumn', 'roleColumn', 'teamColumn', 'statusColumn'
        ];
        
        // Clear existing options except the first one
        mappingSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            while (select.options.length > 1) {
                select.remove(1);
            }
        });
        
        // Add header options to each select
        headers.forEach(header => {
            mappingSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                const option = document.createElement('option');
                option.value = header;
                option.textContent = header;
                select.appendChild(option);
            });
        });
        
        // Try to auto-match columns based on common naming patterns
        autoMatchColumns(headers);
    }
    
    // Auto-match columns based on common naming patterns
    function autoMatchColumns(headers) {
        const patterns = {
            firstNameColumn: ['first name', 'firstname', 'first', 'fname', 'given name'],
            lastNameColumn: ['last name', 'lastname', 'last', 'lname', 'surname', 'family name'],
            fullNameColumn: ['full name', 'name', 'user name', 'username'],
            emailColumn: ['email', 'e-mail', 'mail', 'email address'],
            roleColumn: ['role', 'position', 'job title', 'title', 'job role'],
            teamColumn: ['team', 'department', 'group', 'division'],
            statusColumn: ['status', 'state', 'active', 'account status']
        };
        
        // For each header, check if it matches any of our patterns
        headers.forEach(header => {
            const headerLower = header.toString().toLowerCase();
            
            Object.keys(patterns).forEach(selectId => {
                const patterns_for_field = patterns[selectId];
                if (patterns_for_field.some(pattern => headerLower.includes(pattern))) {
                    document.getElementById(selectId).value = header;
                }
            });
        });
        
        // If email wasn't matched but is required, select the first column as a fallback
        if (document.getElementById('emailColumn').value === '' && headers.length > 0) {
            document.getElementById('emailColumn').value = headers[0];
        }
    }
    
    // Generate preview table
    function generatePreview(previewData, headers) {
        const previewHeader = document.getElementById('previewHeader').querySelector('tr');
        const previewBody = document.getElementById('previewBody');
        
        // Clear existing headers except the first one
        while (previewHeader.children.length > 1) {
            previewHeader.removeChild(previewHeader.lastChild);
        }
        
        // Clear existing body rows
        previewBody.innerHTML = '';
        
        // Add headers
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            previewHeader.appendChild(th);
        });
        
        // Add preview rows
        previewData.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            
            // Add row number
            const tdRowNum = document.createElement('td');
            tdRowNum.textContent = rowIndex + 1;
            tr.appendChild(tdRowNum);
            
            // Add data cells
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header] !== undefined ? row[header] : '';
                tr.appendChild(td);
            });
            
            previewBody.appendChild(tr);
        });
    }
    
    // Process Excel data
    processExcelBtn.addEventListener('click', function() {
        if (!excelData || excelData.length === 0) {
            showToast('No data available. Please preview the Excel file first.', 'warning');
            return;
        }
        
        // Get column mappings
        const mappings = {
            firstName: document.getElementById('firstNameColumn').value,
            lastName: document.getElementById('lastNameColumn').value,
            fullName: document.getElementById('fullNameColumn').value,
            email: document.getElementById('emailColumn').value,
            role: document.getElementById('roleColumn').value,
            team: document.getElementById('teamColumn').value,
            status: document.getElementById('statusColumn').value
        };
        
        // Validate required mappings
        if (!mappings.email) {
            showToast('Email mapping is required. Please select a column for Email.', 'warning');
            return;
        }
        
        // Process the data
        let newUsers = [];
        let skippedRows = 0;
        
        excelData.forEach((row, index) => {
            // Extract user data from row using mappings
            const email = row[mappings.email] || '';
            
            // Skip rows without email
            if (!email) {
                skippedRows++;
                return;
            }
            
            // Handle name fields (first name, last name, or full name)
            let firstName = '';
            let lastName = '';
            let fullName = '';
            
            if (mappings.firstName && mappings.lastName) {
                // If we have both first and last name columns
                firstName = row[mappings.firstName] || '';
                lastName = row[mappings.lastName] || '';
                fullName = (firstName + ' ' + lastName).trim();
            } else if (mappings.fullName) {
                // If we have a full name column
                fullName = row[mappings.fullName] || '';
                
                // Try to split full name into first and last name
                const nameParts = fullName.split(' ');
                if (nameParts.length > 1) {
                    firstName = nameParts[0];
                    lastName = nameParts.slice(1).join(' ');
                } else {
                    firstName = fullName;
                    lastName = '';
                }
            } else {
                // Default to email username as name if no name fields are mapped
                const emailParts = email.split('@');
                firstName = emailParts[0] || 'User';
                lastName = '';
                fullName = firstName;
            }
            
            // Get other fields with defaults
            const role = row[mappings.role] || 'Team Member';
            const team = row[mappings.team] || 'Unassigned';
            const status = row[mappings.status] || 'Active';
            
            // Normalize role to match our options
            let normalizedRole = role;
            if (role.toLowerCase().includes('lead') || role.toLowerCase().includes('manager') || 
                role.toLowerCase().includes('head') || role.toLowerCase().includes('senior')) {
                normalizedRole = 'Team Leader';
            } else {
                normalizedRole = 'Team Member';
            }
            
            // Generate new ID
            const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 + newUsers.length : 1;
            
            // Create new user object
            newUsers.push({
                id: newId,
                firstName: firstName,
                lastName: lastName,
                name: fullName,
                email: email,
                role: normalizedRole,
                team: team,
                status: status
            });
        });
        
        // Add new users to the table
        if (newUsers.length > 0) {
            users = [...users, ...newUsers];
            renderUsers();
            importExcelModal.hide();
            
            // Show notification using the unified notification system
            if (ProjectManager && ProjectManager.NotificationSystem) {
                ProjectManager.NotificationSystem.success(
                    `Successfully imported ${newUsers.length} users. ${skippedRows > 0 ? `${skippedRows} rows were skipped due to missing email.` : ''}`,
                    'Excel Import Complete'
                );
            } else {
                // Fallback to alert if notification system is not available
                showToast(`Successfully imported ${newUsers.length} users. ${skippedRows > 0 ? `${skippedRows} rows were skipped due to missing email.` : ''}`, 'success');
            }
            
            // Reset the form
            document.getElementById('excelFile').value = '';
            document.getElementById('columnMappingSection').style.display = 'none';
            processExcelBtn.disabled = true;
            excelData = null;
        } else {
            // Show error notification using the unified notification system
            if (ProjectManager && ProjectManager.NotificationSystem) {
                ProjectManager.NotificationSystem.error(
                    'No valid users found in the Excel file. Please check that your file contains at least one row with an email address.',
                    'Import Failed'
                );
            } else {
                // Fallback to alert if notification system is not available
                showToast('No valid users found in the Excel file. Please check that your file contains at least one row with an email address.', 'error');
            }
        }
    });
    
    // Helper function to add user to table
    function addUserToTable(user) {
        const tbody = document.querySelector('tbody');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="fw-medium">${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.team}</td>
            <td><span class="badge bg-${user.status === 'Active' ? 'success' : 'secondary'}">${user.status}</span></td>
            <td class="text-end">
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item chat-user" href="#" data-user-id="${user.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots me-2 text-primary" viewBox="0 0 16 16">
                                <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                            </svg> Chat
                        </a></li>
                        <li><a class="dropdown-item edit-user" href="#" data-user-id="${user.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-2 text-warning" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg> Edit
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item remove-user" href="#" data-user-id="${user.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash me-2 text-danger" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg> Remove
                        </a></li>
                    </ul>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    }
    
    // Helper function to update user in table
    function updateUserInTable(user) {
        const rows = document.querySelectorAll('tbody tr');
        
        for (let i = 0; i < rows.length; i++) {
            const actionBtn = rows[i].querySelector('.edit-user');
            if (actionBtn && actionBtn.dataset.userId == user.id) {
                const cells = rows[i].querySelectorAll('td');
                cells[0].textContent = user.name;
                cells[1].textContent = user.email;
                cells[2].textContent = user.role;
                cells[3].textContent = user.team;
                
                const statusBadge = cells[4].querySelector('.badge');
                statusBadge.className = `badge bg-${user.status === 'Active' ? 'success' : 'secondary'}`;
                statusBadge.textContent = user.status;
                break;
            }
        }
        
        // Generate new ID
        const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
        return newId;
    }
    
    // Function to add a user to the table
    function addUserToTable(user) {
        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        const row = createUserTableRow(user);
        tbody.appendChild(row);
    }

    // Function to sort the table
    function sortTable(column, direction) {
        const tbody = document.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Sort the rows based on the selected column
        const sortedRows = rows.sort((a, b) => {
            let aValue, bValue;
            
            switch(column) {
                case 'name':
                    aValue = a.cells[0].textContent.trim();
                    bValue = b.cells[0].textContent.trim();
                    break;
                case 'email':
                    aValue = a.cells[1].textContent.trim();
                    bValue = b.cells[1].textContent.trim();
                    break;
                case 'role':
                    aValue = a.cells[2].textContent.trim();
                    bValue = b.cells[2].textContent.trim();
                    break;
                case 'team':
                    aValue = a.cells[3].textContent.trim();
                    bValue = b.cells[3].textContent.trim();
                    break;
                case 'status':
                    aValue = a.cells[4].textContent.trim();
                    bValue = b.cells[4].textContent.trim();
                    break;
                default:
                    return 0;
            }
            
            // Compare the values
            if (aValue < bValue) {
                return direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        // Reorder the rows in the table
        sortedRows.forEach(row => {
            tbody.appendChild(row);
        });
    }
    
    // Helper function to get current time
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    }
    
    // Helper function to show notification
    function showNotification(message, type = 'success') {
        // Use the toast notification system
        showToast(message, type);
    }
    
    // Function to render all users in the table
    function renderUsers() {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Filter users if search is active
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const filteredUsers = searchTerm ? 
            users.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm) || 
                user.role.toLowerCase().includes(searchTerm) || 
                user.team.toLowerCase().includes(searchTerm) || 
                user.status.toLowerCase().includes(searchTerm)
            ) : users;
            
        // Sort users if sorting is active
        if (currentSortColumn && currentSortDirection) {
            sortTable(currentSortColumn, currentSortDirection);
            return; // sortTable already renders the table
        }
        
        // Render each user
        filteredUsers.forEach(user => {
            addUserToTable(user);
        });
        
        // Show message if no users found
        if (filteredUsers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6" class="text-center py-4">No users found</td>`;
            tbody.appendChild(row);
        }
    }
    
    // Enter key in message input triggers send button
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessageBtn.click();
        }
    });
});
