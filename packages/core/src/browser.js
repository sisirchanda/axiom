const { chromium } = require('playwright');
require('dotenv').config();

async function launchBrowser() {

    const headless = process.env.HEADLESS === "true";

    const browser = await chromium.launch({
        headless
    });

    const context = await browser.newContext();

    const page = await context.newPage();

    return { browser, context, page };
}

async function closeBrowser(browser) {
    await browser.close();
}

module.exports = {
    launchBrowser,
    closeBrowser
};