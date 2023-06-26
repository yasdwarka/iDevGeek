
const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  setupFiles: [
    "./src/__mocks__/client.js"
  ],
};

module.exports = config;