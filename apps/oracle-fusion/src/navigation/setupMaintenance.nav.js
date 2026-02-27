
async function openSetupAndMaintenance(pageInstance, logger) {
	await pageInstance.getByRole('link', { name: 'Settings and Actions' }).click();
	await pageInstance.waitForTimeout(1500);
	await pageInstance.getByRole('link', { name: 'Setup and Maintenance' }).click();
	await pageInstance.waitForTimeout(1500);
}

module.exports = { openSetupAndMaintenance };