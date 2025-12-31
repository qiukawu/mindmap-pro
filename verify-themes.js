#!/usr/bin/env node

/**
 * 主题功能验证脚本
 * 检查 mindmap.htm 中的主题定义和 CSS 是否完整
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mindmap.htm');

// 读取文件
const content = fs.readFileSync(filePath, 'utf-8');

// 要检查的主题列表
const themes = ['business', 'fresh', 'dark', 'colorful', 'minimal'];

console.log('🎨 MindFlow Pro 主题功能验证\n');
console.log('=' .repeat(50));

// 1. 检查主题定义
console.log('\n✅ 检查主题定义...');
let allThemesFound = true;
for (const theme of themes) {
    const themeDefRegex = new RegExp(`${theme}:\\s*\\{[^}]*name:\\s*'[^']*'`, 's');
    const cssClassRegex = new RegExp(`body\\.theme-${theme}`, 'g');
    
    const themeDefFound = themeDefRegex.test(content);
    const cssClassCount = (content.match(cssClassRegex) || []).length;
    
    console.log(`  ${themeDefFound ? '✓' : '✗'} ${theme}: 定义 ${themeDefFound ? '✓' : '✗'}, CSS类 ${cssClassCount}个`);
    
    if (!themeDefFound) allThemesFound = false;
}

// 2. 检查 Themes 类的 setTheme 方法
console.log('\n✅ 检查 setTheme 方法...');
const setThemeRegex = /setTheme\(name\)\s*\{[\s\S]*?localStorage\.setItem\('mindmap_theme', name\);/;
const setThemeFound = setThemeRegex.test(content);
console.log(`  ${setThemeFound ? '✓' : '✗'} localStorage 保存支持: ${setThemeFound ? '✓' : '✗'}`);

// 3. 检查初始化代码
console.log('\n✅ 检查初始化代码...');
const localStorageLoadRegex = /const savedTheme = localStorage\.getItem\('mindmap_theme'\)/;
const loadFound = localStorageLoadRegex.test(content);
console.log(`  ${loadFound ? '✓' : '✗'} 主题加载支持: ${loadFound ? '✓' : '✗'}`);

// 4. 检查 CSS 变量设置
console.log('\n✅ 检查 CSS 变量设置...');
const cssVarRegex = /root\.style\.setProperty\('--bg-color'/;
const cssVarFound = cssVarRegex.test(content);
console.log(`  ${cssVarFound ? '✓' : '✗'} CSS 变量应用: ${cssVarFound ? '✓' : '✗'}`);

// 5. 统计主题特定的 CSS 规则
console.log('\n✅ CSS 规则统计...');
let totalThemeCSSRules = 0;
for (const theme of themes) {
    const rules = (content.match(new RegExp(`body\\.theme-${theme}`, 'g')) || []).length;
    console.log(`  body.theme-${theme}: ${rules} 条规则`);
    totalThemeCSSRules += rules;
}
console.log(`  总计: ${totalThemeCSSRules} 条主题特定规则`);

// 6. 检查模态框主题样式
console.log('\n✅ 检查模态框样式...');
let modalRulesCount = 0;
for (const theme of themes) {
    const modalRegex = new RegExp(`body\\.theme-${theme} \\.modal`, 'g');
    const matches = content.match(modalRegex) || [];
    if (matches.length > 0) {
        console.log(`  ✓ body.theme-${theme} 有模态框样式`);
        modalRulesCount++;
    }
}

console.log('\n' + '='.repeat(50));

// 7. 总体评分
console.log('\n📊 验证结果:');
const checks = [
    allThemesFound,
    setThemeFound,
    loadFound,
    cssVarFound,
    modalRulesCount === themes.length
];

const passCount = checks.filter(c => c).length;
const totalChecks = checks.length;

console.log(`  通过: ${passCount}/${totalChecks}`);

if (passCount === totalChecks) {
    console.log('\n✅ 所有检查通过！主题功能完整。');
    process.exit(0);
} else {
    console.log('\n⚠️  部分检查未通过。请检查上述标记为 ✗ 的项目。');
    process.exit(1);
}
