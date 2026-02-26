async function openTask(page, logger, taskName) {
  logger.info(`Opening task: ${taskName}`);

  const candidates = [
    page.getByRole("textbox", { name: /search/i }).first(),
    page.getByRole("textbox", { name: /task/i }).first(),
    page.locator('input[type="text"]').first(),
  ];

  let searchBox = null;
  for (const c of candidates) {
    if (await c.isVisible().catch(() => false)) { searchBox = c; break; }
  }
  if (!searchBox) throw new Error("Task search box not found.");

  await searchBox.click();
  await searchBox.fill("");
  await searchBox.fill(taskName);
  await page.keyboard.press("Enter");

  await page.waitForTimeout(3000);

  const link = page.getByRole("link", { name: new RegExp(taskName, "i") }).first();
  if (!(await link.isVisible().catch(() => false))) throw new Error(`Task "${taskName}" not found.`);
  await link.click();

  await page.waitForTimeout(4000);
  await page.screenshot({ path: "12_task_opened.png", fullPage: true });
}

module.exports = { openTask };