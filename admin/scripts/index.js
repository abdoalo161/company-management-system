/**
 * Admin Dashboard Index JavaScript
 */

// Ensure the ProjectManager namespace exists
var ProjectManager = ProjectManager || {};

// Admin Dashboard module
ProjectManager.AdminDashboard = (function() {
    function init() {
        // Nothing to initialize
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize the admin dashboard module when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ProjectManager.AdminDashboard.init();
});
