require("dotenv").config();
const KEEP_OPEN = process.env.AXIOM_KEEP_OPEN === "1";

async function login(page, logger, { url, username, password }) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500);
  logger.info("Fusion login page opened");

  await page.screenshot({ path: "01_login_page.png", fullPage: true });

  const userFilled =
    (await page.getByLabel(/user|email|login|username/i).fill(username).then(() => true).catch(() => false)) ||
    (await page.locator('input[type="email"]').first().fill(username).then(() => true).catch(() => false)) ||
    (await page.locator('input[type="text"]').first().fill(username).then(() => true).catch(() => false));

  if (!userFilled) throw new Error("Could not find username/email field.");

  const passFilled =
    (await page.getByLabel(/password/i).fill(password).then(() => true).catch(() => false)) ||
    (await page.locator('input[type="password"]').first().fill(password).then(() => true).catch(() => false));

  if (!passFilled) throw new Error("Could not find password field.");

  const clickedSignin =
    (await page.getByRole("button", { name: /sign in|login|next/i }).click().then(() => true).catch(() => false)) ||
    false;

  if (!clickedSignin) {
    await page.keyboard.press("Enter");
    logger.info("No sign-in button matched; pressed Enter.");
  } else {
    logger.info("Clicked Sign In/Login button.");
  }

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(4000);

  await page.screenshot({ path: "03_after_login.png", fullPage: true });
  logger.info(`After login URL: ${page.url()}`);
}

module.exports = { login };