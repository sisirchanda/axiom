require('dotenv').config();

const core = require('../../../packages/core/src');

(async () => {

    core.logger.info("Starting Oracle Fusion Automation");

    const { browser, page } = await core.launchBrowser();

    await page.goto(process.env.ERP_URL);

    core.logger.info("Oracle login page opened");

    await core.closeBrowser(browser);

    core.logger.info("Browser closed");

})();