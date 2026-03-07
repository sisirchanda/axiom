async function openTask(ctx, taskName) {
	
	const { page, logger, env } = ctx;
	
	if (env.FLOW_TEST === 'Y') {
		logger.info(`Testing only the flow: ${taskName}`);
		return;
	}
	
    logger.info(`Opening Task: ${taskName}`);
	await page.getByRole('link', { name: 'Tasks' }).click();
	await page.waitForTimeout(1500);
	await page.locator('[id="__af_Z_window"]').getByRole('link', { name: 'Search' }).click();
	await page.waitForTimeout(1500);
	await page.getByLabel('', { exact: true }).click();
	//await page.getByLabel('', { exact: true }).fill('Manage Payment Terms');
	await page.getByLabel('', { exact: true }).fill(taskName);
	
	await page.getByRole('button', { name: 'Search' }).click();
	await page.waitForTimeout(1500);
	await page.getByRole('link', { name: taskName }).click();
	await page.waitForTimeout(1500);
	logger.info(`Opened Task: ${taskName}`);
}

module.exports = { openTask };