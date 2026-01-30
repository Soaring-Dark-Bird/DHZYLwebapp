// End-to-end test simulation
const http = require('http');

async function fetchText(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname + parsed.search,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function fetchJSON(url) {
  const result = await fetchText(url);
  try {
    result.data = JSON.parse(result.body);
  } catch (e) {
    result.data = null;
  }
  return result;
}

async function testGame() {
  console.log('=== 大荒斩妖录 E2E 测试 ===\n');

  const baseUrl = 'http://localhost:3000';

  // Test 1: Main page
  console.log('测试 1: 主页面');
  const home = await fetchText(baseUrl);
  console.log(`  状态: ${home.status}`);
  console.log(`  Content-Type: ${home.headers['content-type']}`);
  console.log(`  包含 #app: ${home.body.includes('<div id="app">') ? '✓' : '✗'}`);
  console.log(`  包含 main.js: ${home.body.includes('/src/main.js') ? '✓' : '✗'}`);

  // Test 2: CSS files
  console.log('\n测试 2: CSS 文件');
  const cssFiles = ['/styles/themes.css', '/styles/main.css', '/styles/animations.css'];
  for (const file of cssFiles) {
    const css = await fetchText(baseUrl + file);
    console.log(`  ${file}: ${css.status} ${css.status === 200 ? '✓' : '✗'}`);
  }

  // Test 3: JavaScript modules
  console.log('\n测试 3: JavaScript 模块');
  const jsFiles = [
    '/src/main.js',
    '/src/core/GameState.js',
    '/src/ui/IntroScreen.js',
    '/src/ui/MapView.js',
    '/src/ui/RegionView.js',
    '/src/ui/BattleView.js',
    '/src/core/BattleSystem.js',
    '/src/core/UpgradeSystem.js'
  ];
  for (const file of jsFiles) {
    const js = await fetchText(baseUrl + file);
    console.log(`  ${file}: ${js.status} ${js.status === 200 ? '✓' : '✗'}`);
    if (js.status === 200) {
      const hasExport = js.body.includes('export');
      const hasImport = js.body.includes('import');
      console.log(`    - import: ${hasImport ? '✓' : '✗'}, export: ${hasExport ? '✓' : '✗'}`);
    }
  }

  // Test 4: Data files
  console.log('\n测试 4: 数据文件');
  const dataFiles = ['/assets/data/blades.json', '/assets/data/monsters.json', '/assets/data/materials.json', '/assets/data/regions.json', '/assets/data/recipes.json'];
  for (const file of dataFiles) {
    const data = await fetchJSON(baseUrl + file);
    console.log(`  ${file}: ${data.status} ${data.status === 200 ? '✓' : '✗'}`);
    if (data.data) {
      const keys = Object.keys(data.data);
      console.log(`    - keys: ${keys.join(', ')}`);
      if (Array.isArray(data.data[keys[0]])) {
        console.log(`    - ${keys[0]}: ${data.data[keys[0]].length} 项`);
      }
    }
  }

  // Test 5: Check for module integrity
  console.log('\n测试 5: 模块完整性检查');

  const mainJs = await fetchText(baseUrl + '/src/main.js');
  const imports = mainJs.body.match(/import\s+[^;]+from\s+['"]([^'"]+)['"]/g) || [];
  console.log(`  main.js 导入 ${imports.length} 个模块:`);
  for (const imp of imports) {
    const match = imp.match(/from\s+['"]([^'"]+)['"]/);
    if (match) {
      // Strip query params for checking
      const cleanPath = match[1].split('?')[0];
      const module = await fetchText(baseUrl + cleanPath);
      console.log(`    ${cleanPath}: ${module.status === 200 ? '✓' : '✗'}`);
    }
  }

  // Test 6: Check exports
  console.log('\n测试 6: 导出检查');
  const gameState = await fetchText(baseUrl + '/src/core/GameState.js');
  const exports = gameState.body.match(/^export\s+(function|const|class)\s+(\w+)/gm) || [];
  console.log(`  GameState.js 导出 ${exports.length} 个函数:`);
  exports.forEach(exp => {
    console.log(`    - ${exp.match(/\w+$/)[0]}`);
  });

  console.log('\n=== 测试完成 ===');
}

testGame().catch(err => {
  console.error('测试失败:', err);
  process.exit(1);
});
