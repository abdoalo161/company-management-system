/**
 * Team Leader Dashboard JavaScript
 * Handles dashboard functionality and bootstrap components
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Team Leader Dashboard module
ProjectManager.Dashboard = (function() {
    // Initialize dashboard functionality
    function init() {
        try {
            initBootstrapComponents();
            initSidebar();
            
            // Initialization notification removed
        } catch (error) {
            console.error('Error initializing Dashboard:', error);
            if (window.ProjectManager && ProjectManager.AdminPanel && ProjectManager.AdminPanel.NotificationSystem) {
                ProjectManager.AdminPanel.NotificationSystem.error('Error initializing dashboard', error.message);
            }
        }
    }
    
    /**
     * Sidebar functionality has been removed as requested
     */
    function initSidebar() {
        // Sidebar toggle functionality has been removed while keeping the hamburger button in HTML
        console.log('Sidebar toggle functionality has been removed');
    }
    
    // Initialize Bootstrap components
    function initBootstrapComponents() {
        // Initialize tooltips
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        if (tooltips.length > 0 && typeof bootstrap !== 'undefined') {
            Array.from(tooltips).map(tooltip => new bootstrap.Tooltip(tooltip));
        }
        
        // No dropdown initialization needed for static profile display
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize the dashboard module when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.Dashboard.init();
});
