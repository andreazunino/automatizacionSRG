import { After, AfterAll, Before, Status } from '@cucumber/cucumber';
import fs from 'node:fs/promises';
import path from 'node:path';
import { browserManager } from './browser';
import type { CustomWorld } from './world';

const ensureDir = async (dir: string): Promise<void> => {
  await fs.mkdir(dir, { recursive: true });
};

const sanitizeName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
};

Before(async function (this: CustomWorld) {
  await Promise.all([
    ensureDir('reports'),
    ensureDir('test-results'),
    ensureDir('traces'),
    ensureDir('videos'),
    ensureDir('screenshots')
  ]);

  const session = await browserManager.newSession();
  this.context = session.context;
  this.page = session.page;
  this.initializePages();
});

After(async function (this: CustomWorld, scenario) {
  if (!this.page || !this.context) {
    return;
  }

  const failed = scenario.result?.status === Status.FAILED;
  const scenarioName = sanitizeName(scenario.pickle.name);
  const video = this.page.video();

  if (failed) {
    const screenshotPath = path.join('screenshots', `${scenarioName}.png`);
    const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
    await this.attach(screenshot, 'image/png');
    await this.context.tracing.stop({ path: path.join('traces', `${scenarioName}.zip`) });
  } else {
    await this.context.tracing.stop();
  }

  await this.context.close();

  if (video) {
    const videoPath = await video.path();
    if (failed) {
      await this.attach(`Video: ${videoPath}`, 'text/plain');
    } else {
      await fs.rm(videoPath, { force: true });
    }
  }
});

AfterAll(async function () {
  await browserManager.close();
});
