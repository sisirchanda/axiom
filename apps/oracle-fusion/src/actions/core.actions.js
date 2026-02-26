module.exports = {
  "core.log": async (ctx, { level = "info", message = "" }) => {
    ctx.logger[level]?.(message) ?? ctx.logger.info(message);
  },
};