import { Browser, chromium, Page } from "@playwright/test";

class Operator {
  static browser: Browser | null = null;
  static page: Page | null = null;

  static async init() {
    console.log('[Operator::init] Initiating playwright operator...');
    this.browser = await chromium.launch({ headless: false, });
    this.page = await this.browser.newPage();
    console.log('[Operator::init] Playwright operator initiated.');
  }

  static async close() {
    console.log('[Operator::close] Closing browser...');
    if (!this.browser) { console.error('[Operator::close] Browser not initialized.'); return; }
    
    await this.browser.close();
  }
}

export default Operator;