import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { env } from './env';

let browser: Browser | undefined;

export interface BrowserSession {
  context: BrowserContext;
  page: Page;
}

export const browserManager = {
  async launch(): Promise<Browser> {
    if (!browser) {
      browser = await chromium.launch({ headless: env.headless });
    }

    return browser;
  },

  async newSession(): Promise<BrowserSession> {
    const activeBrowser = await this.launch();
    const context = await activeBrowser.newContext({
      baseURL: env.baseUrl,
      recordVideo: {
        dir: 'videos'
      }
    });
    const page = await context.newPage();

    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true
    });

    return { context, page };
  },

  async close(): Promise<void> {
    await browser?.close();
    browser = undefined;
  }
};
