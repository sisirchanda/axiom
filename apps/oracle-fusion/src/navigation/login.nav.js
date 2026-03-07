require("dotenv").config();
const KEEP_OPEN = process.env.AXIOM_KEEP_OPEN === "1";


async function login(ctx) {
  // Put your working login logic here (you already have it working)
  const {logger, page, env} = ctx
  if (env.FLOW_TEST === 'Y') {
	logger.info(`Testing only the flow: login`);
	return;
  }
  await page.goto(env.ERP_URL, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);
  logger.info("Fusion login page opened");
  
  
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(env.ERP_USERNAME);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(env.ERP_PASSWORD);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1500);

  logger.info(`After login URL: ${env.ERP_URL}`); 
}

module.exports = { login };