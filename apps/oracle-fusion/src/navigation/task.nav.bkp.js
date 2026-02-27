async function openTask(page, logger, taskName) {
    logger.info(`Force-opening drawer for: ${taskName}`);

    // 1. Target the icon inside ANY frame
    // In Fusion, the Task icon is often inside an iframe named 'pt1:r1:0:rt' or similar
    const tasksIcon = page.frameLocator('iframe').locator('img[title="Tasks"]').first();

    try {
        // 2. Wait for it to exist (not just visible)
        await tasksIcon.waitFor({ state: 'attached', timeout: 20000 });
        
        // 3. EXECUTE DIRECT JS CLICK
        // This is the only way to bypass "Glass Panes" and "Guided Learning" reliably
        await page.evaluate(() => {
            const findAndClick = () => {
                // Look for the icon in the main document AND all iframes
                const getAllElements = (selector, root = document) => {
                    const elements = Array.from(root.querySelectorAll(selector));
                    const iframes = Array.from(root.querySelectorAll('iframe'));
                    for (const iframe of iframes) {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            elements.push(...getAllElements(selector, iframeDoc));
                        } catch (e) { /* cross-origin */ }
                    }
                    return elements;
                };

                const icons = getAllElements('img[title="Tasks"]');
                if (icons.length > 0) {
                    const icon = icons[0];
                    icon.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    icon.parentElement.click(); // Also click the <a> wrapper
                    return true;
                }
                return false;
            };
            return findAndClick();
        });

        logger.info("Direct JS Click dispatched.");

        // 4. VERIFY THE SEARCH LINK
        const searchLink = page.locator('a[title="Search"]').first();
        // Give it 10 seconds to physically appear on screen
        await searchLink.waitFor({ state: 'visible', timeout: 10000 });
        
        logger.info("Drawer IS OPEN: Search link is visible.");
        await searchLink.click({ force: true });

    } catch (error) {
        logger.error("DRAWER CRITICAL FAILURE: Could not open even with JS.");
        // Take a full page screenshot to see what's actually on the screen
        await page.screenshot({ path: 'FAILED_DRAWER_STATE.png', fullPage: true });
        throw error;
    }
}

module.exports = { openTask };