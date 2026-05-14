module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/support/**/*.ts', 'tests/steps/**/*.ts'],
    paths: ['tests/features/**/*.feature'],
    tags: 'not @no_automatizar and not @cron and not @rpc and not @api_externa and not @bug_bloqueante and not @no_implementado',
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};
