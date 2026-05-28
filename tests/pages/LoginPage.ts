import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { env, type UserRole } from '../support/env';
import { loginSelectors } from '../utils/selectors/loginSelectors';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToApplication(): Promise<void> {
    await this.goto(env.baseUrl);
  }

  async login(username = env.qaUser, password = env.qaPassword): Promise<void> {
    const usernameInput = this.page.locator(loginSelectors.usernameInput);
    const passwordInput = this.page.locator(loginSelectors.passwordInput);

    await expect(usernameInput).toBeVisible({ timeout: 30000 });
    await usernameInput.fill(username);
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);
    await this.click(loginSelectors.submitButton);
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
    await expect(this.page.locator(loginSelectors.homeTitle).first()).toBeVisible({ timeout: 30000 });
  }
}
