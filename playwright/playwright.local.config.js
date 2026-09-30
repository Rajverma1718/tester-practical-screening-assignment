const base = require('./playwright.config');

module.exports = {
  ...base,
  reporter: 'line',
  use: {
    ...(base.use || {}),
    headless: true,
    video: 'off',
    launchOptions: {
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox'],
    },
  },
};
