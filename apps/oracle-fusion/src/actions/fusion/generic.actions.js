const { createRecord } = require("../../workflows/genericForm.workflow");
const { parseExcelSheet } = require("../../config/excel.generic");

module.exports = {
  // Existing
  "fusion.generic.createRecord": async (ctx, { row, ui }) => {
    await createRecord(ctx.page, ctx.logger, row, ui);
  },

  // Excel Loader
  "fusion.excel.loadRows": async (ctx) => {
    const source = ctx.flow?.data?.source;

    if (!source || source.type !== "excel") {
      throw new Error("flow.data.source is missing or not excel");
    }

    if (!ctx.filePath) {
      throw new Error("ctx.filePath missing. Pass Excel path in ctx.");
    }

    ctx.logger.info(
      `Loading Excel ${ctx.filePath} sheet=${source.sheet}`
    );

    const rows = parseExcelSheet(
      ctx.filePath,
      source.sheet,
      source.map,
      source.required || []
    );

    // Normalize Action
    for (const r of rows) {
      r.Action = String(r.Action || "CREATE").trim().toUpperCase();
    }

    ctx.rows = rows;

    ctx.logger.info(`Loaded ${rows.length} rows`);
  }
};