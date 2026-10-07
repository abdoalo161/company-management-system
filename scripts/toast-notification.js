/**
 * Simple Toast Notification System
 * Uses Bootstrap toasts for non-intrusive notifications
 */

// Create a global toast function
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
    
    // Initialize and show the toast
    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    
    bsToast.show();
    
    // Remove the toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}
