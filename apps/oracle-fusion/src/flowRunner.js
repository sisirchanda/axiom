const fs = require("fs");
const path = require("path");

function template(str, ctx) {
  return String(str).replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    const parts = expr.trim().split(".");
    let cur = ctx;
    for (const p of parts) cur = cur?.[p];
    return cur ?? "";
  });
}

function deepTemplate(obj, ctx) {
  return JSON.parse(template(JSON.stringify(obj), ctx));
}

async function runSteps(steps, ctx, handlers) {
  for (const step of steps || []) {
    if (step.action) {
      const fn = handlers[step.action];
      if (!fn) throw new Error(`Unknown action: ${step.action}`);
      const params = step.params ? deepTemplate(step.params, ctx) : {};
      ctx.logger.info(`Running action: ${step.action}`);
      await fn(ctx, params);
      continue;
    }

    if (step.forEach) {
      const list = ctx[step.forEach];
      if (!Array.isArray(list)) throw new Error(`ctx.${step.forEach} is not an array`);
      for (const row of list) await runSteps(step.do, { ...ctx, row }, handlers);
      continue;
    }

    if (step.if?.eq) {
      const [l, r] = step.if.eq;
      const L = template(l, ctx);
      const R = template(r, ctx);
      if (L === R) await runSteps(step.then, ctx, handlers);
      else await runSteps(step.else, ctx, handlers);
      continue;
    }

    throw new Error(`Unsupported step: ${JSON.stringify(step)}`);
  }
}

// NEW: base flow path (common for all fusion tasks)
const FUSION_BASE_FLOW_PATH = path.join(__dirname, "..", "flows", "_fusion.base.json");

async function runFlowFromFile(flowPath, ctx, handlers) {
  // 1) Load task flow
  const flow = JSON.parse(fs.readFileSync(flowPath, "utf8"));

  // 2) Make it available to templating as {{flow.xxx}}
  const ctxWithFlow = { ...ctx, flow };

  // 3) Run common Fusion pre from JSON
  const base = JSON.parse(fs.readFileSync(FUSION_BASE_FLOW_PATH, "utf8"));
  await runSteps(base.pre, ctxWithFlow, handlers);

  // 4) Run task-specific steps only
  await runSteps(flow.steps, ctxWithFlow, handlers);

  return flow;
}

module.exports = { runFlowFromFile };