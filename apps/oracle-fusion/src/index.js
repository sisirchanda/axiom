require("dotenv").config();

const path = require("path");
const core = require(path.join(__dirname, "..", "..", "..", "packages", "core", "src"));


const { login } = require("./navigation/login.nav");
const { openSetupAndMaintenance } = require("./navigation/setupMaintenance.nav");

const KEEP_OPEN = process.env.AXIOM_KEEP_OPEN === "1";

(async () => {
  const logger = core.logger;
  logger.info("Starting Oracle Fusion Automation");

  const { browser, page } = await core.launchBrowser({ headless: false });

  try {
    await login(page, logger, {
      url: process.env.ERP_URL,
      username: process.env.ERP_USERNAME,
      password: process.env.ERP_PASSWORD,
    });

    logger.info("Navigating to Setup and Maintenance...");
    await openSetupAndMaintenance(page, logger);

    await page.waitForTimeout(4000);
    await page.screenshot({ path: "04_setup_and_maintenance.png", fullPage: true });
    logger.info(`Setup and Maintenance URL: ${page.url()}`);
  } catch (e) {
    logger.error("Automation failed", e);
    await page.screenshot({ path: "99_error.png", fullPage: true }).catch(() => {});
  } finally {
    if (KEEP_OPEN) {
      logger.info("AXIOM_KEEP_OPEN=1 → keeping browser open for debugging.");
      await page.waitForTimeout(10 * 60 * 1000);
    }
    await core.closeBrowser(browser);
    logger.info("Browser closed");
  }
})();