const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const reports = [
  path.resolve('reports/cucumber-report.html'),
  path.resolve('reports/playwright-report/index.html')
];

const reportPath = reports.find((candidate) => fs.existsSync(candidate));

if (!reportPath) {
  console.error('No se encontro un reporte HTML. Ejecuta primero npm run test.');
  process.exitCode = 1;
  return;
}

const command =
  process.platform === 'win32'
    ? ['cmd', ['/c', 'start', '', reportPath]]
    : process.platform === 'darwin'
      ? ['open', [reportPath]]
      : ['xdg-open', [reportPath]];

spawn(command[0], command[1], {
  detached: true,
  stdio: 'ignore'
}).unref();
