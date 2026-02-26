// Add new actions here for example setup invoice options

const { createPaymentTerm } = require("../../workflows/payables/paymentTerms.workflow");

module.exports = {
  "fusion.paymentTerms.create": async (ctx, { row }) => {
    await createPaymentTerm(ctx.page, ctx.logger, row);
  },
};