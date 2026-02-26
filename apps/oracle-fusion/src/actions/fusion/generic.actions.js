const { createRecord } = require("../../workflows/genericForm.workflow");

module.exports = {
  "fusion.generic.createRecord": async (ctx, { row, ui }) => {
    await createRecord(ctx.page, ctx.logger, row, ui);
  },
};