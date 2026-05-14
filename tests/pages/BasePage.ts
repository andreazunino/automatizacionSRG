import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { waitUtils } from '../utils/waitUtils';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  protected getBySelector(selector: string): Locator {
    return this.page.locator(selector);
  }

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
    await waitUtils.waitForPageReady(this.page);
  }

  async click(selector: string): Promise<void> {
    const locator = this.getBySelector(selector);
    await waitUtils.waitForVisible(locator);
    await locator.click();
  }

  async fill(selector: string, value: string): Promise<void> {
    const locator = this.getBySelector(selector);
    await waitUtils.waitForVisible(locator);
    await locator.fill(value);
  }

  async getText(selector: string): Promise<string> {
    const locator = this.getBySelector(selector);
    await waitUtils.waitForVisible(locator);
    return (await locator.textContent())?.trim() ?? '';
  }

  async waitForVisible(selector: string): Promise<void> {
    await waitUtils.waitForVisible(this.getBySelector(selector));
  }

  async waitForHidden(selector: string): Promise<void> {
    await waitUtils.waitForHidden(this.getBySelector(selector));
  }

  async screenshot(path: string): Promise<Buffer> {
    return this.page.screenshot({ path, fullPage: true });
  }

  async expectText(selector: string, expectedText: string | RegExp): Promise<void> {
    await expect(this.getBySelector(selector)).toContainText(expectedText);
  }
}
