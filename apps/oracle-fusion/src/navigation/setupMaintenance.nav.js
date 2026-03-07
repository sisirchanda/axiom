
async function openSetupAndMaintenance(ctx) {
	const { page, logger, env } = ctx;
	if (env.FLOW_TEST === 'Y') {
		logger.info(`Testing only the flow: SetupMaintenance`);
		return;
	}
	await page.getByRole('link', { name: 'Settings and Actions' }).click();
	await page.waitForTimeout(1500);
	await page.getByRole('link', { name: 'Setup and Maintenance' }).click();
	await page.waitForTimeout(1500);
}

module.exports = { openSetupAndMaintenance };