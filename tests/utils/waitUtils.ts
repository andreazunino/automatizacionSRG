import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const waitUtils = {
  async waitForPageReady(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
  },

  async waitForVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  },

  async waitForHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }
};
