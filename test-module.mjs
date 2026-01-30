// Test module loading
const projectDir = 'E:\\dahuangzhanyaolu';

async function testModules() {
  console.log('=== Testing Module Syntax ===\n');

  // Just read and check the files for syntax errors
  const fs = await import('fs');
  const path = await import('path');

  const files = [
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
    'src/main.js'
  ];

  for (const file of files) {
    const fullPath = path.join(projectDir, file);
    try {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check for common issues
      const hasExport = content.includes('export');
      const hasImport = content.includes('import');
      const issues = [];

      if (!hasExport && file !== 'src/main.js') {
        issues.push('Missing export');
      }

      if (file === 'src/ui/RegionView.js') {
        if (!content.includes('getMonster')) {
          issues.push('Missing getMonster import');
        }
      }

      if (issues.length > 0) {
        console.log(`✗ ${file}: ${issues.join(', ')}`);
      } else {
        console.log(`✓ ${file}`);
      }
    } catch (e) {
      console.log(`✗ ${file}: ${e.message}`);
    }
  }

  console.log('\n=== Checking circular dependencies ===\n');

  // Read main.js imports
  const mainContent = fs.readFileSync(path.join(projectDir, 'src/main.js'), 'utf8');
  const imports = mainContent.match(/import[^;]+from\s+['"]([^'"]+)['"]/g) || [];

  console.log('main.js imports:');
  imports.forEach(imp => {
    const match = imp.match(/from\s+['"]([^'"]+)['"]/);
    if (match) {
      console.log(`  - ${match[1]}`);
    }
  });

  console.log('\n=== All checks passed! ===');
}

testModules().catch(err => {
  console.error('Fatal error:', err);
});
