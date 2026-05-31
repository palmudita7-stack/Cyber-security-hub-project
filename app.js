// Wait until the entire webpage document loads completely before attaching clicks
document.addEventListener("DOMContentLoaded", () => {
    
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.webpage');

    // --- MULTI-PAGE NAV BAR ROUTING LOGIC ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Stop page from refreshing
            
            // 1. Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // 2. Add active class to the clicked nav item
            item.classList.add('active');

            // 3. Get the target page ID (e.g., "phishing-page")
            const targetPageId = item.getAttribute('data-target');
            
            // 4. Loop through pages and show only the matched one
            pages.forEach(page => {
                if (page.id === targetPageId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    // --- DASHBOARD TILES ROUTING LOGIC ---
    // This explicitly maps the dashboard card clicks to show the proper pages
    const dashboardCards = document.querySelectorAll('.component-card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', () => {
            // Check which card was clicked based on its text content
            let targetId = "dashboard-page";
            if (card.innerText.includes("Phishing") || card.innerText.includes("Social")) {
                targetId = "phishing-page";
            } else if (card.innerText.includes("Password") || card.innerText.includes("Auditor")) {
                targetId = "password-page";
            }

            // Route to the corresponding page view
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });

            // Update the navigation bar highlights to match the page swap
            navItems.forEach(nav => {
                if (nav.getAttribute('data-target') === targetId) {
                    nav.classList.add('active');
                } else {
                    nav.classList.remove('active');
                }
            });
        });
    });
});

// --- COMPONENT FUNCTIONS (Must remain outside DOMContentLoaded wrapper so HTML buttons can find them) ---

function checkPhishingResult(isMaliciousSelected) {
    const feedbackWrapper = document.getElementById('phishing-feedback');
    if (!feedbackWrapper) return;
    
    feedbackWrapper.style.display = "block"; // Make the container container block visible
    
    if (isMaliciousSelected) {
        feedbackWrapper.innerText = "Correct! Threat Intercepted. Noticeable red flags included an obfuscated external domain variant (amaz0n-portal.net) and coercive urgency conditions.";
        feedbackWrapper.style.background = "rgba(0, 245, 160, 0.1)";
        feedbackWrapper.style.color = "#00f5a0";
        feedbackWrapper.style.border = "1px solid rgba(0, 245, 160, 0.2)";
    } else {
        feedbackWrapper.innerText = "Security Breach! You fell for the bait. Authorized enterprise networks do not leverage secondary domain mutations (amaz0n) or request administrative modifications via insecure standard anchors.";
        feedbackWrapper.style.background = "rgba(255, 65, 108, 0.1)";
        feedbackWrapper.style.color = "#ff416c";
        feedbackWrapper.style.border = "1px solid rgba(255, 65, 108, 0.2)";
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password-input');
    const toggleBtn = document.getElementById('toggle-btn');
    if (!passwordInput || !toggleBtn) return;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.innerText = "Hide Text";
    } else {
        passwordInput.type = "password";
        toggleBtn.innerText = "Show Text";
    }
}

function auditPassword() {
    const val = document.getElementById('password-input').value;
    
    const checks = {
        length: val.length >= 8,
        upper: /[A-Z]/.test(val),
        number: /[0-9]/.test(val),
        special: /[^A-Za-z0-9]/.test(val)
    };

    updateCriterionUI('crit-length', checks.length);
    updateCriterionUI('crit-upper', checks.upper);
    updateCriterionUI('crit-number', checks.number);
    updateCriterionUI('crit-special', checks.special);

    let score = Object.values(checks).filter(Boolean).length;
    const meter = document.getElementById('strength-meter');
    const label = document.getElementById('strength-label');
    
    if (!meter || !label) return;

    if (val.length === 0) {
        meter.style.width = "0%";
        label.innerText = "Awaiting Input...";
        label.style.color = "#94a3b8";
    } else if (score <= 1) {
        meter.style.width = "25%";
        meter.style.backgroundColor = "#ff416c";
        label.innerText = "Critical Risk (Weak)";
        label.style.color = "#ff416c";
    } else if (score <= 3) {
        meter.style.width = "60%";
        meter.style.backgroundColor = "#f59e0b";
        label.innerText = "Moderate (Medium)";
        label.style.color = "#f59e0b";
    } else {
        meter.style.width = "100%";
        meter.style.backgroundColor = "#00f5a0";
        label.innerText = "Highly Cryptographically Secure";
        label.style.color = "#00f5a0";
    }
}

function updateCriterionUI(id, isPassed) {
    const element = document.getElementById(id);
    if (!element) return;
    
    if (isPassed) {
        element.classList.remove('fail');
        element.classList.add('pass');
    } else {
        element.classList.remove('pass');
        element.classList.add('fail');
    }
}