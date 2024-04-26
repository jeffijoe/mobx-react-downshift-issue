import { chromium } from "playwright";
import { expect } from "playwright/test";

(async () => {
  // Run basic version
  console.log("Running basic version");
  await runTest(false);
  // Run mobx version
  console.log("Running MobX version");
  await runTest(true);
})();

async function runTest(useMobX) {
  const browser = await chromium.launch({
    headless: false,
    // This is the path to the Chrome executable on macOS
    // My system doesn't let me use the PW-installed ones, you can comment
    // this out if you want to try, or change it to your system's Chrome path
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  const context = await browser.newContext();
  try {
    const page = await context.newPage();

    await page.fi;
    await page.goto(`http://localhost:5173${useMobX ? "?mobx" : ""}`);
    await page.getByTestId("search-input").fill("w");

    await page.getByTestId("book-0").click({
      // To make it work, use a delay
      // delay: 10,
    });

    await expect(page.getByTestId("counter")).toHaveText("1");
  } catch (error) {
    console.error(error);
  } finally {
    await context.close();
    await browser.close();
  }
}
