require("dotenv").config();

const { parseExcelSheet } = require("../../config/excel.generic");

const { login } = require("../../navigation/login.nav");
const { openSetupAndMaintenance } = require("../../navigation/setupMaintenance.nav");
const { openTask } = require("../../navigation/task.nav");

const URL = process.env.ERP_URL
const USERNAME = process.env.ERP_USERNAME
const PASSWORD = process.env.ERP_PASSWORD

const AXIOM_OFFERING = process.env.AXIOM_OFFERING
const AXIOM_FUNCTIONAL_AREA = process.env.AXIOM_FUNCTIONAL_AREA

module.exports = {
  "fusion.login": async (ctx) => {
    //await login(ctx.page, ctx.logger, ctx.env);
	ctx.logger.info(`ERP_URL=${URL} and USERNAME=${USERNAME}`);
	await login(ctx.page, ctx.logger, URL, USERNAME, PASSWORD);
  },

  "fusion.openSetupAndMaintenance": async (ctx) => {
    await openSetupAndMaintenance(ctx.page, ctx.logger);
  },

  "fusion.openTask": async (ctx, { taskName }) => {
    await openTask(ctx.page, ctx.logger, AXIOM_OFFERING, AXIOM_FUNCTIONAL_AREA, taskName);
  },

  "fusion.loadExcelRows": async (ctx, { sheet, map, required }) => {
    ctx.rows = parseExcelSheet(ctx.env.AXIOM_EXCEL_PATH, sheet, map, required);
    ctx.logger.info(`Loaded ${ctx.rows.length} rows from Excel sheet "${sheet}".`);
  },
};