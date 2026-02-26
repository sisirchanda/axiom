const fs = require("fs");

function template(str, ctx) {
  // Minimal templating: supports {{row.Field}} and {{var}}
  return String(str).replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    const p = expr.trim().split(".");
    let cur = ctx;
    for (const k of p) cur = cur?.[k];
    return cur ?? "";
  });
}

async function runActions(actions, ctx, handlers) {
  for (const step of actions) {
    if (step.action) {
      const fn = handlers[step.action];
      if (!fn) throw new Error(`Unknown action: ${step.action}`);

      // Resolve params with templating
      const params = step.params ? JSON.parse(template(JSON.stringify(step.params), ctx)) : {};
      await fn(ctx, params);
      continue;
    }

    if (step.if) {
      const [left, right] = step.if.eq;
      const L = template(left, ctx);
      const R = template(right, ctx);
      if (L === R) await runActions(step.then || [], ctx, handlers);
      else await runActions(step.else || [], ctx, handlers);
      continue;
    }

    if (step.forEach) {
      const listName = step.forEach; // e.g. "rows"
      const list = ctx[listName];
      if (!Array.isArray(list)) throw new Error(`forEach expects array ctx.${listName}`);

      for (const row of list) {
        await runActions(step.do || [], { ...ctx, row }, handlers);
      }
      continue;
    }

    throw new Error(`Unsupported step: ${JSON.stringify(step)}`);
  }
}

async function runFlowFromFile(flowPath, ctx, handlers) {
  const raw = fs.readFileSync(flowPath, "utf-8");
  const flow = JSON.parse(raw);

  // 1) pre steps
  await runActions(flow.pre || [], ctx, handlers);

  // 2) main steps
  await runActions(flow.steps || [], ctx, handlers);

  return flow;
}

module.exports = { runFlowFromFile };