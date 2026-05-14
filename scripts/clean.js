const fs = require('node:fs/promises');
const path = require('node:path');

const evidenceDirs = ['reports', 'test-results', 'traces', 'videos', 'screenshots'];

const cleanDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.name !== '.gitkeep')
      .map((entry) => fs.rm(path.join(dir, entry.name), { recursive: true, force: true }))
  );
};

Promise.all(evidenceDirs.map(cleanDir)).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
