require("dotenv").config();
const KEEP_OPEN = process.env.AXIOM_KEEP_OPEN === "1";

async function login(page, logger,  url, username, password ) {
  // Put your working login logic here (you already have it working)
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500);
  logger.info("Fusion login page opened");
  
  
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1500);

  logger.info(`After login URL: ${page.url()}`); 
}

module.exports = { login };