require("dotenv").config();
const core = require("../../../packages/core/src");
const path = require("path");

const { resolveTasks } = require("./moduleResolver");

const loginNav = require("./navigation/login.nav");
const setupNav = require("./navigation/setupMaintenance.nav");
const taskNav = require("./navigation/task.nav");

(async () => {

  const logger = core.logger;
  
  if (process.argv.length < 3) {
	  throw new Error("Usage: node src/index.js <module> [excelFile]");
  }

  const moduleName = process.argv[2];   // dynamic module
  const inputFile = process.argv[3];    // optional excel

  if (!moduleName) {
    throw new Error("Usage: node src/index.js <module> [excelFile]");
  }

  const filePath =
    inputFile ||
    path.join(__dirname, "..", "testdata", moduleName, "payment_terms.xlsx");

  logger.info(`Module: ${moduleName}`);
  logger.info(`Excel: ${filePath}`);

  const { browser, page } = await core.launchBrowser({ headless: false });

  try {

    const ctx = {
      logger,
      page,
      env: process.env,
      filePath
    };

    await loginNav.login(ctx);
    await setupNav.openSetupAndMaintenance(ctx);

    const tasks = resolveTasks(moduleName);

    for (const task of tasks) {

      logger.info(`Running task: ${task.taskKey}`);

      await taskNav.openTask(ctx, task.fusionTask);

      const handler = require(task.handlerPath);

      await handler.run(ctx, task);

    }

  } catch (e) {

    logger.error("Execution failed", e);

  } finally {

    await core.closeBrowser(browser);
    logger.info("Browser closed");

  }

})();