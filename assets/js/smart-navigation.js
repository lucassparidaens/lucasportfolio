/* Smart Navigation for Multi-Page Portfolio */
(function() {
    'use strict';
    
    // Initialize smart navigation when DOM is ready
    function initSmartNavigation() {
        // Wait for navigation component to load
        setTimeout(() => {
            attachSmartNavigationListeners();
        }, 100);
    }
    
    function attachSmartNavigationListeners() {
        const smartNavLinks = document.querySelectorAll('[data-smart-nav]');
        
        smartNavLinks.forEach(link => {
            link.addEventListener('click', handleSmartNavigation);
        });
    }
    
    function handleSmartNavigation(e) {
        const link = e.currentTarget;
        const targetSection = link.getAttribute('data-smart-nav');
        const href = link.getAttribute('href');
        
        // Skip processing if no data-smart-nav attribute
        if (!targetSection) {
            return; // Let browser handle normally
        }
        
        // Check if we're on the homepage
        const currentPage = window.location.pathname;
        const isOnHomepage = currentPage === '/' || 
                            currentPage === '/index.html' || 
                            currentPage.endsWith('/index.html') ||
                            currentPage.split('/').pop() === 'index.html' ||
                            currentPage === '' ||
                            currentPage.split('/').pop() === '';
        
        // Handle home/logo clicks
        if (targetSection === 'home' && !isOnHomepage) {
            // Let browser navigate to homepage normally
            return;
        }
        
        // If we're on homepage and target section exists, scroll to it
        if (isOnHomepage && targetSection !== 'home') {
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                e.preventDefault();
                
                // Smooth scroll to the target section
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without page reload
                if (history.pushState) {
                    history.pushState(null, null, `#${targetSection}`);
                }
                
                return false;
            }
        }
        
        // If we're not on homepage, let the link navigate normally
        // This will go to /#section which should work correctly
    }
    
    // Handle back/forward browser navigation
    function handlePopState() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetElement = document.getElementById(hash);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartNavigation);
    } else {
        initSmartNavigation();
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    
    // Re-initialize when navigation component loads (for component-based loading)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                const hasNavigation = addedNodes.some(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.querySelector && node.querySelector('[data-smart-nav]'))
                );
                
                if (hasNavigation) {
                    setTimeout(attachSmartNavigationListeners, 50);
                }
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Public API for manual re-initialization
    window.SmartNavigation = {
        init: initSmartNavigation,
        attach: attachSmartNavigationListeners
    };
})();
