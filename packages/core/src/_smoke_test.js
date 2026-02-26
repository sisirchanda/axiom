const core = require("./");

(async () => {
  core.logger?.info?.("Core smoke test: starting") ?? console.log("Core smoke test: starting");

  const { browser, page } = await core.launchBrowser({ headless: false });
  await page.goto("https://www.google.com/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await core.closeBrowser(browser);
  core.logger?.info?.("Core smoke test: done") ?? console.log("Core smoke test: done");
})();