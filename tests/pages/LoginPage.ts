import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { env, type UserRole } from '../support/env';
import { selectors } from '../utils/selectors';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToApplication(): Promise<void> {
    await this.goto(env.baseUrl);
  }

  async login(username = env.qaUser, password = env.qaPassword): Promise<void> {
    const usernameInput = this.page.locator(selectors.login.usernameInput);
    const passwordInput = this.page.locator(selectors.login.passwordInput);

    await expect(usernameInput).toBeVisible({ timeout: 30000 });
    await usernameInput.fill(username);
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);
    await this.click(selectors.login.submitButton);
  }

  async loginAs(role: UserRole): Promise<void> {
    const credentials = env.credentials[role];
    await this.login(credentials.username, credentials.password);
  }

  async loginWithValidCredentials(): Promise<void> {
    await this.navigateToApplication();
    await this.loginAs('internal');
  }

  async assertHomeIsVisible(): Promise<void> {
    await expect(this.page.locator(selectors.login.homeTitle)).toBeVisible({ timeout: 30000 });
  }
}
