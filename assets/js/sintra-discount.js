/* Sintra Mystery Discount Banner JavaScript */
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        showDelay: 3000, // Show after 3 seconds
        hideAfterDays: 7, // Hide for 7 days if dismissed
        localStorageKey: 'sintra_discount_dismissed'
    };
    
    // Initialize the discount banner
    function initSintraDiscount() {
        // Check if user has dismissed the banner recently
        if (isDismissed()) {
            return;
        }
        
        // Create the banner element
        createDiscountBanner();
        
        // Show the banner after delay
        setTimeout(() => {
            showBanner();
        }, CONFIG.showDelay);
    }
    
    // Check if the banner has been dismissed recently
    function isDismissed() {
        const dismissedTime = localStorage.getItem(CONFIG.localStorageKey);
        if (!dismissedTime) return false;
        
        const now = new Date().getTime();
        const dismissed = parseInt(dismissedTime, 10);
        const daysPassed = (now - dismissed) / (1000 * 60 * 60 * 24);
        
        return daysPassed < CONFIG.hideAfterDays;
    }
    
    // Create the discount banner
    function createDiscountBanner() {
        // Load the component content
        loadComponent('sintra-discount', 'sintra-discount-container');
    }
    
    // Load component function
    async function loadComponent(componentName, targetId) {
        try {
            // Create container if it doesn't exist
            let container = document.getElementById(targetId);
            if (!container) {
                container = document.createElement('div');
                container.id = targetId;
                document.body.appendChild(container);
            }
            
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) throw new Error(`Failed to load ${componentName}`);
            const html = await response.text();
            container.innerHTML = html;
            
            // Initialize event listeners after component is loaded
            initEventListeners();
            
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }
    
    // Show the banner
    function showBanner() {
        const banner = document.getElementById('sintra-discount');
        if (banner) {
            banner.style.display = 'block';
            // Trigger animation
            requestAnimationFrame(() => {
                banner.classList.add('show');
            });
        }
    }
    
    // Hide the banner
    function hideBanner(rememberDismissal = false) {
        const banner = document.getElementById('sintra-discount');
        if (banner) {
            banner.classList.add('hidden');
            
            // Remove from DOM after animation
            setTimeout(() => {
                const container = document.getElementById('sintra-discount-container');
                if (container) {
                    container.remove();
                }
            }, 500);
            
            // Remember dismissal if requested
            if (rememberDismissal) {
                localStorage.setItem(CONFIG.localStorageKey, new Date().getTime().toString());
            }
        }
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Close button
        const closeBtn = document.getElementById('sintra-discount-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                hideBanner(true);
                trackEvent('sintra_discount_closed');
            });
        }
        
        // Yes please button
        const yesBtn = document.getElementById('sintra-discount-btn');
        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                handleDiscountClick();
                trackEvent('sintra_discount_clicked');
            });
        }
        
        // Hide on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideBanner(true);
                trackEvent('sintra_discount_escaped');
            }
        });
        
        // Auto-hide after 30 seconds if no interaction
        setTimeout(() => {
            hideBanner(false);
            trackEvent('sintra_discount_auto_hidden');
        }, 30000);
    }
    
    // Handle discount button click
    function handleDiscountClick() {
        // You can customize this to your needs
        // For now, it will redirect to a contact form or show a modal
        
        // Option 1: Redirect to contact
        // window.location.href = '#contact';
        
        // Option 2: Show contact modal
        const contactModal = document.querySelector('[data-modal="contact"]');
        if (contactModal) {
            contactModal.click();
        }
        
        // Option 3: Custom action (example: show alert)
        showDiscountModal();
        
        // Hide the banner
        hideBanner(true);
    }
    
    // Show discount modal (custom implementation)
    function showDiscountModal() {
        // Create a simple modal
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(8px);
            " id="discount-modal">
                <div style="
                    background: white;
                    padding: 32px;
                    border-radius: 16px;
                    max-width: 400px;
                    margin: 20px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                ">
                    <h3 style="margin: 0 0 16px; color: #1a5a1a; font-size: 24px;">🎉 Geweldig!</h3>
                    <p style="margin: 0 0 24px; color: #666; line-height: 1.5;">
                        Bedankt voor je interesse! Neem contact op via het contactformulier 
                        voor een persoonlijk gesprek over jouw project.
                    </p>
                    <button style="
                        background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-right: 12px;
                    " onclick="window.location.href='#contact'; document.getElementById('discount-modal').remove();">
                        Contact opnemen
                    </button>
                    <button style="
                        background: transparent;
                        color: #666;
                        border: 1px solid #ddd;
                        padding: 12px 24px;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                    " onclick="document.getElementById('discount-modal').remove();">
                        Sluiten
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Analytics tracking (optional)
    function trackEvent(eventName, params = {}) {
        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'sintra_discount',
                ...params
            });
        }
        
        // Track with other analytics tools if needed
        console.log(`Sintra Discount Event: ${eventName}`, params);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSintraDiscount);
    } else {
        initSintraDiscount();
    }
    
    // Export for manual control if needed
    window.SintraDiscount = {
        show: showBanner,
        hide: hideBanner,
        reset: () => {
            localStorage.removeItem(CONFIG.localStorageKey);
            initSintraDiscount();
        }
    };
})();
