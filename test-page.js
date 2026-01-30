// Simple page tester without Playwright
const http = require('http');

const TARGET_URL = 'http://localhost:3000';

async function testPage() {
  console.log('Testing:', TARGET_URL);

  // Test main page
  try {
    const response = await fetch(TARGET_URL);
    console.log('Status:', response.status);
    const html = await response.text();

    // Check for key elements
    const hasApp = html.includes('<div id="app">');
    const hasMainJs = html.includes('src="/src/main.js');
    const hasCSS = html.includes('themes.css');

    console.log('✓ Has #app div:', hasApp);
    console.log('✓ Has main.js script:', hasMainJs);
    console.log('✓ Has CSS themes:', hasCSS);

    // Test CSS files
    const cssFiles = ['/styles/themes.css', '/styles/main.css', '/styles/animations.css'];
    for (const css of cssFiles) {
      try {
        const cssResp = await fetch(TARGET_URL + css);
        console.log(`✓ ${css}:`, cssResp.status);
      } catch (e) {
        console.log(`✗ ${css}: ERROR -`, e.message);
      }
    }

    // Test main.js
    try {
      const jsResp = await fetch(TARGET_URL + '/src/main.js');
      console.log(`✓ /src/main.js:`, jsResp.status);
    } catch (e) {
      console.log(`✗ /src/main.js: ERROR -`, e.message);
    }

    // Test data files
    const dataFiles = ['/assets/data/blades.json', '/assets/data/monsters.json'];
    for (const file of dataFiles) {
      try {
        const resp = await fetch(TARGET_URL + file);
        console.log(`✓ ${file}:`, resp.status);
        if (resp.ok) {
          const data = await resp.json();
          console.log(`  └─ Contains ${Object.keys(data)[0]}:`, Array.isArray(data[Object.keys(data)[0]]) ? `${data[Object.keys(data)[0]].length} items` : 'present');
        }
      } catch (e) {
        console.log(`✗ ${file}: ERROR -`, e.message);
      }
    }

  } catch (e) {
    console.error('Error testing page:', e);
  }
}

testPage().then(() => console.log('\nTest complete!'));
