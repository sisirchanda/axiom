async function clickByRoleRegex(page, role, nameRegex) {
  const re = new RegExp(nameRegex, "i");
  const el = page.getByRole(role, { name: re }).first();
  if (!(await el.isVisible().catch(() => false))) {
    throw new Error(`Could not find ${role} with nameRegex="${nameRegex}"`);
  }
  await el.click();
}

async function fillByLabelRegex(page, labelRegex, value) {
  const v = value === undefined || value === null ? "" : String(value);
  if (!v.trim()) return;

  const re = new RegExp(labelRegex, "i");
  const ok = await page.getByLabel(re).fill(v).then(() => true).catch(() => false);
  if (!ok) throw new Error(`Could not fill field by labelRegex="${labelRegex}"`);
}

async function fillByCss(page, selector, value) {
  const v = value === undefined || value === null ? "" : String(value);
  if (!v.trim()) return;

  const el = page.locator(selector).first();
  if (!(await el.isVisible().catch(() => false))) {
    throw new Error(`CSS selector not visible: ${selector}`);
  }
  await el.fill(v);
}

async function fillField(page, fillSpec, value) {
  if (!fillSpec) throw new Error("Missing fill spec in JSON ui.fields[].fill");

  if (fillSpec.type === "label") {
    return fillByLabelRegex(page, fillSpec.labelRegex, value);
  }
  if (fillSpec.type === "css") {
    return fillByCss(page, fillSpec.selector, value);
  }
  throw new Error(`Unknown fill spec type: ${fillSpec.type}`);
}

async function createRecord(page, logger, row, ui) {
  logger.info("Creating record (generic form)");

  if (!ui?.createButton || !ui?.saveButton) {
    throw new Error("ui.createButton and ui.saveButton are required in flow JSON params.ui");
  }

  // Create
  if (ui.createButton.type === "role") {
    await clickByRoleRegex(page, ui.createButton.role, ui.createButton.nameRegex);
  } else {
    throw new Error(`Unsupported createButton.type: ${ui.createButton.type}`);
  }

  await page.waitForTimeout(1500);

  // Fill fields (driven by JSON)
  for (const f of ui.fields || []) {
    const value = row[f.key];
    await fillField(page, f.fill, value);
  }

  // Save
  if (ui.saveButton.type === "role") {
    await clickByRoleRegex(page, ui.saveButton.role, ui.saveButton.nameRegex);
  } else {
    throw new Error(`Unsupported saveButton.type: ${ui.saveButton.type}`);
  }

  await page.waitForTimeout(4000);
  logger.info("Record saved (generic form)");
}

module.exports = { createRecord };