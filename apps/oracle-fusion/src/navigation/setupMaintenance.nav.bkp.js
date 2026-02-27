
async function openSetupAndMaintenance(pageInstance, logger) {
    // Inner function that actually interacts with the Browser DOM
	logger.info("Scanning top header icons to reveal 'Settings and Actions'...");
    const browserCode = async () => {
        // Helper to find the link across different elements
        const findSetupLink = () => {
            const selectors = ['a', 'span', 'div', 'td', 'li'];
            for (let selector of selectors) {
                const elements = Array.from(document.querySelectorAll(selector));
                const found = elements.find(el => 
                    el.textContent.trim() === 'Setup and Maintenance' && 
                    el.offsetWidth > 0 // Ensure it's actually visible
                );
                if (found) return found;
            }
            return null;
        };

        // 1. Locate and Click Profile Icon
        const profileIcon = document.querySelector('button[id*="UIScm"]') || 
                            document.querySelector('a[title*="Settings and Actions"]') ||
                            document.querySelector('[id$="UIScmil1u"]'); // Common specific ID

        if (!profileIcon) throw new Error("Profile icon not found.");
        profileIcon.click();

        // 2. Poll for the menu item (Oracle menus can be slow to inject)
        // We try for up to 3 seconds
        for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const setupLink = findSetupLink();
            if (setupLink) {
                setupLink.click();
                return "Successfully clicked Setup and Maintenance.";
            }
        }

        throw new Error("Link 'Setup and Maintenance' did not appear in the menu after 3 seconds.");
    };

    // ENVIRONMENT DETECTION
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // --- BROWSER CONTEXT ---
        logger.info("Running in Browser context...");
        return await browserCode();
    } else if (typeof page !== 'undefined' || pageInstance) {
        // --- NODE.JS / AXIOM CONTEXT ---
        logger.info("Running in Node.js (Axiom) context...");
        const activePage = pageInstance || page; // Axiom provides 'page' globally in app context
        return await activePage.evaluate(browserCode);
    } else {
        throw new Error("Unknown environment: Neither 'window' nor 'page' (Puppeteer) found.");
    }
}

module.exports = { openSetupAndMaintenance };