async function openTask(page, logger, functionalArea, taskName) {
  logger.info(`Navigating to: ${taskName} in ${functionalArea}`);

  // 1. Click the "Tasks" Icon (the image with title="Tasks")
  const tasksIcon = page.locator('img[title="Tasks"]').first();
  await tasksIcon.waitFor({ state: 'visible', timeout: 15000 });
  await tasksIcon.click();
  logger.info("Tasks icon clicked.");

  // 2. Click the "Search" Link within the drawer
  // Use the specific title attribute from your HTML snippet
  const searchLink = page.locator('a[title="Search"]').first();
  await searchLink.waitFor({ state: 'visible', timeout: 15000 });
  await searchLink.click();
  logger.info("Search link clicked.");

  // 3. Wait for the Search Input Box
  // If it doesn't appear, Oracle might have missed the Search link click
  const searchInput = page.locator('input[placeholder*="Search Tasks"], [id*="search_task"]').first();
  
  try {
    await searchInput.waitFor({ state: 'visible', timeout: 8000 });
  } catch (e) {
    logger.warn("Search input not found, retrying click on Search link...");
    await searchLink.click({ force: true });
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  // 4. Perform the search
  await searchInput.fill(taskName);
  await page.keyboard.press('Enter');
  logger.info(`Searching for "${taskName}"...`);

  // 5. Locate and click the Task based on Functional Area
  // We use the filter pattern to ensure we get the right row
  const taskRow = page.locator('tr')
    .filter({ hasText: functionalArea })
    .filter({ hasText: taskName })
    .locator('a').first();

  try {
    await taskRow.waitFor({ state: 'visible', timeout: 15000 });
    await taskRow.click();
    logger.info(`Successfully opened: ${taskName}`);
  } catch (err) {
    logger.error(`Task "${taskName}" not found in results for area "${functionalArea}"`);
    await page.screenshot({ path: "axiom_search_fail.png" });
    throw new Error("Task navigation failed.");
  }

  // Final load check
  await page.waitForLoadState('networkidle');
}

module.exports = { openTask };