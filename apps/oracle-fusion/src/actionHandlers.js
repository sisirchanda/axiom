const { goToSetupAndMaintenance, openTaskBySearch } = require("./navigation/setup-maintenance.nav");
const { parseExcelSheet } = require("./config/excel.generic");

function buildHandlers(core) {
  return {
    "core.log": async (ctx, { level = "info", message = "" }) => {
      ctx.logger[level]?.(message) ?? ctx.logger.info(message);
    },

    "fusion.login": async (ctx) => {
      // Keep your redirect-aware login implementation here
      // Minimal placeholder: just navigate to ERP_URL for now
      await ctx.page.goto(ctx.env.ERP_URL, { waitUntil: "domcontentloaded" });
      ctx.logger.info("Fusion login step executed (placeholder).");
    },

    "fusion.goToSetupAndMaintenance": async (ctx) => {
      await goToSetupAndMaintenance(ctx.page);
      ctx.logger.info("Reached Setup and Maintenance.");
    },

    "fusion.openTask": async (ctx, { taskName }) => {
      await openTaskBySearch(ctx.page, taskName);
      ctx.logger.info(`Opened task: ${taskName}`);
    },

    "fusion.loadExcelRows": async (ctx, { sheet, map, required }) => {
      ctx.rows = parseExcelSheet(ctx.env.AXIOM_EXCEL_PATH, sheet, map, required);
      ctx.logger.info(`Loaded ${ctx.rows.length} rows from Excel sheet "${sheet}".`);
    },

    "fusion.paymentTerms.create": async (ctx, { row }) => {
      // call your Payables Payment Terms implementation
      // (you can keep it here or in a separate module)
      const page = ctx.page;

      // Click Create
      const createBtn = page.getByRole("button", { name: /create|add|\+/i }).first();
      await createBtn.click();

      await page.waitForTimeout(1200);

      await page.getByLabel(/name/i).fill(row.TermName).catch(async () => {
        await page.locator('input[type="text"]').first().fill(row.TermName);
      });

      if (row.Description) await page.getByLabel(/description/i).fill(row.Description).catch(() => {});
      if (row.DueDays) await page.getByLabel(/due.*days/i).fill(String(row.DueDays)).catch(() => {});

      const saveBtn = page.getByRole("button", { name: /save/i }).first();
      await saveBtn.click();
      await page.waitForTimeout(2500);

      ctx.logger.info(`Created Payment Term: ${row.TermName}`);
    },
  };
}

module.exports = { buildHandlers };