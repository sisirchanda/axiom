require("dotenv").config();
const core = require("../../../packages/core/src");

const { getFlowPath } = require("./flowRegistry");
const { runFlowFromFile } = require("./flowRunner");
const { buildHandlers } = require("./actionHandlers");

(async () => {
  const logger = core.logger;

  const moduleName = process.env.AXIOM_MODULE;
  const submoduleName = process.env.AXIOM_SUBMODULE;
  
  console.log("AXIOM_MODULE=", process.env.AXIOM_MODULE);
  console.log("AXIOM_SUBMODULE=", process.env.AXIOM_SUBMODULE);

  const flowPath = getFlowPath(moduleName, submoduleName);
  if (!flowPath) {
	  throw new Error(`No flow registered for ${moduleName} / ${submoduleName}`);
  }

  const { browser, page } = await core.launchBrowser({ headless: false });
  

  try {
	const filePath = process.env.AXIOM_EXCEL_PATH || path.join(__dirname, "..", "testdata", "payables", "payment_terms.xlsx");
    const ctx = { logger, page, env: process.env, rows: [], filePath };
    const handlers = buildHandlers();

    await runFlowFromFile(flowPath, ctx, handlers);

    logger.info("Flow completed successfully.");
  } catch (e) {
    logger.error("Flow failed", e);
    await page.screenshot({ path: "99_error.png", fullPage: true }).catch(() => {});
    process.exitCode = 1;
  } finally {
    await core.closeBrowser(browser);
    logger.info("Browser closed");
  }
})();