// Test module loading in Node.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');

// Mock browser globals
global.window = {
  localStorage: {
    getItem: (key) => global.mockStorage?.[key] || null,
    setItem: (key, value) => { global.mockStorage = global.mockStorage || {}; global.mockStorage[key] = value; },
    removeItem: (key) => { if (global.mockStorage) delete global.mockStorage[key]; }
  },
  document: {
    getElementById: () => null,
    createElement: (tag) => ({
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      addEventListener: () => {}
    }),
    querySelector: () => null,
    querySelectorAll: () => [],
    body: {
      appendChild: () => {},
      classList: { add: () => {}, remove: () => {} }
    },
    head: {}
  },
  navigator: {},
  location: { href: 'http://localhost:3000' },
  setTimeout: (fn, delay) => setTimeout(fn, delay),
  clearTimeout: (id) => clearTimeout(id),
  setInterval: (fn, delay) => setInterval(fn, delay),
  clearInterval: (id) => clearInterval(id),
  fetch: (url) => fetch(url)
};

global.document = window.document;
global.localStorage = window.localStorage;
global.navigator = window.navigator;
global.location = window.location;

async function testModules() {
  console.log('=== Testing Module Imports ===\n');

  const projectDir = 'E:\\dahuangzhanyaolu';

  try {
    // Test GameState
    console.log('Testing GameState.js...');
    const gameStatePath = path.join(projectDir, 'src', 'core', 'GameState.js');
    const { getState, getCurrentBlade, getSettings } = await import('file://' + gameStatePath);
    console.log('✓ GameState imports work');
    console.log('  - getState:', typeof getState);
    console.log('  - getCurrentBlade:', typeof getCurrentBlade);
    console.log('  - getSettings:', typeof getSettings);

    // Test main.js
    console.log('\nTesting main.js...');
    const mainPath = path.join(projectDir, 'src', 'main.js');
    await import('file://' + mainPath);
    console.log('✓ main.js loads without errors');

  } catch (e) {
    console.error('✗ Error loading modules:', e.message);
    console.error(e.stack);
  }
}

testModules().then(() => {
  console.log('\n=== Test Complete ===');
}).catch(err => {
  console.error('Fatal error:', err);
});
