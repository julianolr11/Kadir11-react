const assert = require('assert');

// Attempt to resolve the electron module. If it's not available, skip the tests.
let electronAvailable = true;
try {
  require.resolve('electron');
} catch (err) {
  electronAvailable = false;
}

describe('main.js', function () {
  it('loads without throwing', function () {
    if (!electronAvailable) {
      this.skip();
    }
    assert.doesNotThrow(() => {
      require('../main.js');
    });
  });
});
