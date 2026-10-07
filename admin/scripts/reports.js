// Custom scripts for reports.html

// Global reports variable to store all reports data
let reports = [];

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    // Sidebar functionality is now handled by sidebar.js
});

// Initialize the page
function initializePage() {
    // Clear the table body first to prevent any flashing of content
    const tbody = document.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = '';
    }
    
    // Add a loading indicator
    showLoadingIndicator();
    
    // Load user profile data
    loadUserProfileData();
    
    // Load reports with a slight delay to ensure DOM is ready
    setTimeout(loadReports, 100);
}

// Function to load user profile data from localStorage
function loadUserProfileData() {
    // This function is now handled by the profile.js script
    // which populates the profileDisplay container
    const profileDisplay = document.getElementById('profileDisplay');
    
    if (!profileDisplay) {
        console.error('Profile display container not found in DOM');
        return;
    }
    
    // The profile display is now handled by the profile.js script
    console.log('Profile display is handled by the profile.js script');
}

// Function to show a loading indicator
function showLoadingIndicator() {
    const tbody = document.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Loading reports...</p>
                </td>
            </tr>
        `;
    }
}

// Function to load reports from localStorage
function loadReports() {
    // Reset reports array
    reports = [];
    
    // Try to load team evaluations from localStorage
    try {
        const storedEvaluations = localStorage.getItem('teamEvaluations');
        if (storedEvaluations) {
            const parsedEvaluations = JSON.parse(storedEvaluations);
            if (Array.isArray(parsedEvaluations) && parsedEvaluations.length > 0) {
                // Load teams data to get proper team names and team leaders
                let teamsData = [];
                try {
                    const storedTeams = localStorage.getItem('teams');
                    if (storedTeams) {
                        teamsData = JSON.parse(storedTeams);
                    }
                } catch (error) {
                    console.error('Error loading teams data:', error);
                }
                
                // Process evaluations
                parsedEvaluations.forEach((eval, index) => {
                    // Find team info
                    const teamInfo = teamsData.find(team => team.id === eval.teamId);
                    const teamName = teamInfo ? teamInfo.name : 'Unknown Team';
                    const teamLeader = teamInfo ? teamInfo.teamLeader : 'Unknown';
                    
                    reports.push({
                        id: eval.id || index + 1,
                        employeeName: eval.employeeName || 'Unknown Employee',
                        employeeId: eval.employeeId || '',
                        team: teamName,
                        teamId: eval.teamId || '',
                        evaluatorName: teamLeader,
                        date: eval.date || new Date().toISOString().split('T')[0],
                        overallScore: eval.overallScore || 0,
                        categories: eval.categories || []
                    });
                });
                
                console.log('Loaded evaluations from localStorage:', reports);
            }
        }
    } catch (error) {
        console.error('Error loading evaluations from localStorage:', error);
    }
    
    // If no reports were loaded, use sample data
    if (reports.length === 0) {
        console.log('No evaluations found in localStorage, using sample data');
        reports = [
            {
                id: 1,
                employeeName: "John Smith",
                employeeId: "EMP001",
                team: "Development Team",
                teamId: "DEV",
                evaluatorName: "Michael Johnson",
                date: "2025-04-15",
                overallScore: 85,
                categories: [
                    {
                        name: "Technical Skills",
                        score: 90,
                        comments: "John demonstrates excellent technical knowledge and problem-solving abilities. He consistently delivers high-quality code and is quick to adapt to new technologies."
                    },
                    {
                        name: "Communication",
                        score: 80,
                        comments: "John communicates effectively with team members and stakeholders. He could improve on documenting his work more thoroughly."
                    },
                    {
                        name: "Teamwork",
                        score: 85,
                        comments: "John is a collaborative team player who supports his colleagues. He actively participates in team discussions and shares knowledge."
                    }
                ]
            },
            {
                id: 2,
                employeeName: "Sarah Johnson",
                employeeId: "EMP002",
                team: "Design Team",
                teamId: "DES",
                evaluatorName: "Lisa Chen",
                date: "2025-04-12",
                overallScore: 92,
                categories: [
                    {
                        name: "Creativity",
                        score: 95,
                        comments: "Sarah consistently produces innovative and visually appealing designs. Her creative solutions have significantly improved our product's user experience."
                    },
                    {
                        name: "Technical Skills",
                        score: 90,
                        comments: "Sarah has mastered all the design tools and techniques required for her role. She stays current with industry trends."
                    },
                    {
                        name: "Deadline Management",
                        score: 88,
                        comments: "Sarah reliably delivers projects on time. She manages her workload effectively and communicates proactively about potential delays."
                    }
                ]
            },
            {
                id: 3,
                employeeName: "Michael Brown",
                employeeId: "EMP003",
                team: "Marketing Team",
                teamId: "MKT",
                evaluatorName: "Jennifer Williams",
                date: "2025-04-10",
                overallScore: 78,
                categories: [
                    {
                        name: "Campaign Management",
                        score: 82,
                        comments: "Michael has shown good skills in managing marketing campaigns. He effectively coordinates different aspects of campaigns."
                    },
                    {
                        name: "Analytics",
                        score: 75,
                        comments: "Michael's data analysis skills are developing. He would benefit from additional training in marketing analytics tools."
                    },
                    {
                        name: "Communication",
                        score: 80,
                        comments: "Michael communicates well with the team and clients. His presentations are clear and informative."
                    }
                ]
            }
        ];
    }
    
    // Update the table with the loaded reports
    updateReportsTable(reports);
    
    // Show success message
    showToast('Reports loaded successfully', 'success');
    
    // Add event listeners to the view report buttons
    addViewReportButtonListeners();
}

// Function to add event listeners to view report buttons
function addViewReportButtonListeners() {
    document.querySelectorAll('.view-report-btn').forEach(button => {
        // Remove existing listeners to prevent duplicates
        button.removeEventListener('click', viewReportClickHandler);
        // Add the click event listener
        button.addEventListener('click', viewReportClickHandler);
    });
}

// View report button click handler
function viewReportClickHandler() {
    const reportId = this.getAttribute('data-report-id');
    const report = reports.find(r => r.id == reportId);
    
    if (report) {
        displayReportDetails(report);
        showToast(`Viewing report for ${report.employeeName}`, 'info');
    } else {
        showToast('Report not found', 'error');
    }
}

// Function to display report details in the modal
function displayReportDetails(report) {
    // Set current report ID
    document.querySelector('#viewReportModal').setAttribute('data-current-report', report.id);
    
    // Employee information
    document.getElementById('reportEmployeeName').textContent = report.employeeName;
    document.getElementById('reportTeam').textContent = report.team;
    document.getElementById('reportDate').textContent = report.date;
    document.getElementById('reportEvaluator').textContent = report.evaluatorName;
    
    // Overall score
    const overallScoreElement = document.getElementById('reportOverallScore');
    overallScoreElement.textContent = `${report.overallScore}%`;
    
    // Set progress bar width and class
    const progressBar = document.getElementById('reportOverallProgressBar');
    progressBar.style.width = `${report.overallScore}%`;
    progressBar.className = `progress-bar ${getProgressBarClass(report.overallScore)}`;
    progressBar.setAttribute('aria-valuenow', report.overallScore);
    
    // Clear previous categories
    const categoriesContainer = document.getElementById('reportCategories');
    categoriesContainer.innerHTML = '';
    
    // Add each category
    report.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'mb-4';
        categoryElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="mb-0">${category.name}</h6>
                <span class="badge ${getProgressBarClass(category.score)} rounded-pill">${category.score}%</span>
            </div>
            <div class="progress mb-2" style="height: 8px;">
                <div class="progress-bar ${getProgressBarClass(category.score)}" role="progressbar" style="width: ${category.score}%" aria-valuenow="${category.score}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="small text-muted">${category.comments}</p>
        `;
        categoriesContainer.appendChild(categoryElement);
    });
}
            
// Function to update the reports table with loaded data
function updateReportsTable(reports) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Remove loading indicator if present
    if (tbody.querySelector('.spinner-border')) {
        tbody.innerHTML = '';
    }
    
    // Add a row for each report
    reports.forEach(report => {
        const row = document.createElement('tr');
        
        // Format date for display
        const displayDate = report.date;
        
        // Create row content
        row.innerHTML = `
            <td>${report.employeeName}</td>
            <td>${report.team}</td>
            <td>${report.evaluatorName}</td>
            <td>${displayDate}</td>
            <td>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar ${getProgressBarClass(report.overallScore)}" role="progressbar" style="width: ${report.overallScore}%" aria-valuenow="${report.overallScore}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class="small">${report.overallScore}%</span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary view-report-btn" data-report-id="${report.id}" data-bs-toggle="modal" data-bs-target="#viewReportModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text me-1" viewBox="0 0 16 16">
                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                    </svg> View Full Report
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Re-attach event listeners to the new buttons
    addViewReportButtonListeners();
    
    // Make rows clickable after updating the table
    makeRowsClickable();
}
    
// Helper function to get the appropriate progress bar class based on score
function getProgressBarClass(score) {
    if (score >= 90) return 'bg-success';
    if (score >= 75) return 'bg-primary';
    if (score >= 60) return 'bg-warning';
    return 'bg-danger';
}

// Function to make table rows clickable
function makeRowsClickable() {
    document.querySelectorAll('tbody tr').forEach(row => {
        // Remove any existing click event listeners to prevent duplicates
        row.removeEventListener('click', rowClickHandler);
        // Add the click event listener
        row.addEventListener('click', rowClickHandler);
    });
}

// Row click handler function
function rowClickHandler(e) {
    // Don't trigger if clicking on the button itself (already has its own handler)
    if (!e.target.closest('.view-report-btn')) {
        // Find the button in this row and click it
        const button = this.querySelector('.view-report-btn');
        if (button) {
            button.click();
        }
    }
}
