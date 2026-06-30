/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',

  mutate: [
    'src/modules/photo/photoService.js',
    'src/modules/user/userService.js',  
  ],


  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },

  thresholds: {
    high: 80,
    low: 70,
    break: 60,
  },

  timeoutMS: 15000,
  timeoutFactor: 1.5,
  concurrency: 2,

  plugins: [
    '@stryker-mutator/vitest-runner',
  ],
};