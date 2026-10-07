/**
 * Universal Sidebar Toggle Functionality
 * This script provides sidebar toggle functionality for all pages across all portals
 * It handles the sidebar toggle button click, closing the sidebar when clicking outside,
 * and closing the sidebar on window resize for responsive behavior.
 */

// Initialize the sidebar toggle functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSidebarToggle();
});

/**
 * Initialize the sidebar toggle functionality
 * This function finds the sidebar toggle button and sidebar element,
 * then sets up the necessary event listeners for toggling the sidebar.
 */
function initSidebarToggle() {
    // Find the sidebar toggle button and sidebar element
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Only proceed if both elements exist
    if (sidebarToggle && sidebar) {
        console.log('Initializing universal sidebar toggle functionality');
        
        // Add click event listener to the sidebar toggle button
        sidebarToggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Toggle the 'show' class on the sidebar
            sidebar.classList.toggle('show');
            
            console.log('Sidebar toggle clicked, show state:', sidebar.classList.contains('show'));
        });
        
        // Add click event listener to the document to close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            // Check if sidebar is visible and click is outside sidebar and toggle button
            if (
                sidebar.classList.contains('show') && 
                !sidebar.contains(event.target) && 
                !sidebarToggle.contains(event.target)
            ) {
                sidebar.classList.remove('show');
                console.log('Sidebar closed by clicking outside');
            }
        });
        
        // Add window resize listener to hide sidebar on larger screens
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991.98) {
                sidebar.classList.remove('show');
                console.log('Sidebar closed by window resize');
            }
        });
    } else {
        console.warn('Sidebar toggle or sidebar element not found');
    }
}
