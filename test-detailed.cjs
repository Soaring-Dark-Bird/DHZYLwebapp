// Detailed test to check for JavaScript errors
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function checkFiles() {
  console.log('=== File Structure Check ===\n');

  const files = [
    'index.html',
    'src/main.js',
    'src/core/GameState.js',
    'src/core/BattleSystem.js',
    'src/core/UpgradeSystem.js',
    'src/ui/IntroScreen.js',
    'src/ui/MapView.js',
    'src/ui/RegionView.js',
    'src/ui/BattleView.js',
    'src/ui/BladeGallery.js',
    'src/ui/SettingsPanel.js',
    'src/ui/InfoPanel.js',
    'styles/themes.css',
    'styles/main.css',
    'styles/animations.css',
    'assets/data/blades.json',
    'assets/data/monsters.json',
    'assets/data/materials.json',
    'assets/data/regions.json',
    'assets/data/recipes.json'
  ];

  const projectDir = 'E:\\dahuangzhanyaolu';
  let missing = [];

  for (const file of files) {
    const fullPath = path.join(projectDir, file);
    if (fs.existsSync(fullPath)) {
      console.log(`✓ ${file}`);
    } else {
      console.log(`✗ ${file} - MISSING`);
      missing.push(file);
    }
  }

  console.log('\n=== Import Check ===\n');

  // Check main.js imports
  const mainJs = fs.readFileSync(path.join(projectDir, 'src/main.js'), 'utf8');

  const imports = [
    { from: './core/GameState.js', name: 'GameState' },
    { from: './ui/IntroScreen.js', name: 'IntroScreen' },
    { from: './ui/MapView.js', name: 'MapView' },
    { from: './ui/RegionView.js', name: 'RegionView' },
    { from: './ui/BattleView.js', name: 'BattleView' },
    { from: './ui/BladeGallery.js', name: 'BladeGallery' },
    { from: './ui/SettingsPanel.js', name: 'SettingsPanel' },
    { from: './ui/InfoPanel.js', name: 'InfoPanel' }
  ];

  for (const imp of imports) {
    const file = path.join(projectDir, 'src', imp.from.substring(2)); // remove ./
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (imp.name === 'default') {
        if (content.includes('export default')) {
          console.log(`✓ ${imp.from} has default export`);
        } else {
          console.log(`✗ ${imp.from} missing default export`);
        }
      } else {
        if (content.includes(`export ${imp.name}`) || content.includes(`export class ${imp.name}`) || content.includes(`export function ${imp.name}`)) {
          console.log(`✓ ${imp.from} exports ${imp.name}`);
        } else {
          console.log(`? ${imp.from} - check exports manually`);
        }
      }
    }
  }

  console.log('\n=== Checking for common issues ===\n');

  // Check RegionView.js for getMonster import
  const regionView = fs.readFileSync(path.join(projectDir, 'src/ui/RegionView.js'), 'utf8');
  if (regionView.includes('import { getRegion, getMonstersByRegion, getMonster, showScreen, getCurrentBlade }')) {
    console.log('✓ RegionView.js imports getMonster correctly');
  } else {
    console.log('✗ RegionView.js missing getMonster import');
    missing.push('RegionView.js: fix getMonster import');
  }

  if (regionView.includes('getMonster(monsterId)')) {
    console.log('✓ RegionView.js uses getMonster function');
  } else {
    console.log('? RegionView.js may not use getMonster');
  }

  console.log('\n=== Summary ===');
  if (missing.length > 0) {
    console.log('\nIssues found:');
    missing.forEach(m => console.log('  -', m));
  } else {
    console.log('\n✓ All files present and imports look correct!');
  }
}

checkFiles().catch(console.error);
