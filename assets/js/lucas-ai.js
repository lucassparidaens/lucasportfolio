document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.ai-step');
    const contents = document.querySelectorAll('.ai-interactive-step-content');
    const nextBtn = document.getElementById('ai-next-btn');
    const backBtn = document.getElementById('ai-back-btn');
    const ctaBtn = document.getElementById('ai-final-cta-btn');
    let currentStep = 0;

    function updateStep(index) {
        // Update steps UI
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else if (i < index) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        // Update content visibility
        contents.forEach((content, i) => {
            if (i === index) {
                content.style.display = 'block';
                setTimeout(() => content.style.opacity = '1', 10);
            } else {
                content.style.opacity = '0';
                setTimeout(() => content.style.display = 'none', 300);
            }
        });

        // Update buttons
        if (index === 0) {
            backBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
            ctaBtn.style.display = 'none';
        } else if (index === steps.length - 1) {
            backBtn.style.display = 'inline-block';
            nextBtn.style.display = 'none';
            ctaBtn.style.display = 'inline-block';
            generateProposal();
        } else {
            backBtn.style.display = 'inline-block';
            nextBtn.style.display = 'inline-block';
            ctaBtn.style.display = 'none';
        }

        currentStep = index;
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) updateStep(currentStep + 1);
    });

    backBtn.addEventListener('click', () => {
        if (currentStep > 0) updateStep(currentStep - 1);
    });

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Only allow clicking previous steps or the immediate next step
            if (index <= currentStep + 1) {
                updateStep(index);
            }
        });
    });

    // Selection Logic
    const options = document.querySelectorAll('.ai-option-card');
    options.forEach(option => {
        option.addEventListener('click', function () {
            this.classList.toggle('selected');
        });
    });

    function generateProposal() {
        // Simple logic to update the proposal text based on selections
        // For now, we'll just show a generic success message with animation
        const proposalCard = document.querySelector('.ai-proposal-card');
        proposalCard.classList.add('loading');

        setTimeout(() => {
            proposalCard.classList.remove('loading');
        }, 1000);
    }

    // Initialize
    updateStep(0);
});
