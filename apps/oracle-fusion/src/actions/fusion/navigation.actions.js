const { loginFusion } = require("../../navigation/login.nav");
const { openSetupAndMaintenance } = require("../../navigation/setupMaintenance.nav");
const { openTask } = require("../../navigation/task.nav");
const { parseExcelSheet } = require("../../config/excel.generic");

module.exports = {
  "fusion.login": async (ctx) => {
    await loginFusion(ctx.page, ctx.logger, ctx.env);
  },

  "fusion.openSetupAndMaintenance": async (ctx) => {
    await openSetupAndMaintenance(ctx.page, ctx.logger);
    await ctx.page.screenshot({ path: "04_setup_and_maintenance.png", fullPage: true });
  },

  "fusion.openTask": async (ctx, { taskName }) => {
    await openTask(ctx.page, ctx.logger, taskName);
  },

  "fusion.loadExcelRows": async (ctx, { sheet, map, required }) => {
    ctx.rows = parseExcelSheet(ctx.env.AXIOM_EXCEL_PATH, sheet, map, required);
    ctx.logger.info(`Loaded ${ctx.rows.length} rows from Excel sheet "${sheet}".`);
  },
};