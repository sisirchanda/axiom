//import { test, expect } from '@playwright/test';
require("dotenv").config();
const core = require("../../../packages/core/src");

( async () => {
  //await page.goto('https://idcs-47cf2a22cfbc4f809d75a1950ca5517c.identity.oraclecloud.com/ui/v1/signin');
 // await page.goto('https://fa-eqju-dev1-saasfaprod1.fa.ocs.oraclecloud.com');
  const { browser, page } = await core.launchBrowser({ headless: false });
  await page.goto('https://fa-eqju-dev1-saasfaprod1.fa.ocs.oraclecloud.com', { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500);
  
  
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('sanket.khaitan@tcs.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Oracle@123456');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Settings and Actions' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Setup and Maintenance' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Tasks' }).click();
  await page.waitForTimeout(1500);
  await page.locator('[id="__af_Z_window"]').getByRole('link', { name: 'Search' }).click();
  await page.waitForTimeout(1500);
  await page.getByLabel('', { exact: true }).click();
  await page.getByLabel('', { exact: true }).fill('Manage Payment Terms');
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Manage Payment Terms' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForTimeout(1500);
  await core.closeBrowser(browser);
})();