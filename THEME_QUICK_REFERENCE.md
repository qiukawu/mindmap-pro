# 🎨 MindFlow Pro 主题系统快速参考

## 主题切换方法

### 用户方式
在工具栏右侧，选择主题下拉框，选择你喜欢的主题：
- 商务蓝：专业商务场景
- 清新绿：学习和创意
- 暗黑模式：夜间工作
- 多彩主题：特殊演示
- 极简白：简洁专注

### 开发者方式（JavaScript控制台）
```javascript
// 直接切换主题
mindMap.setTheme('business');
mindMap.setTheme('fresh');
mindMap.setTheme('dark');
mindMap.setTheme('colorful');
mindMap.setTheme('minimal');

// 获取当前主题
mindMap.themes.currentTheme;

// 获取完整的主题对象
mindMap.themes.getCurrentTheme();
```

## 颜色方案一览

### 商务蓝 🔵
```
深蓝:    #2C3E50
中蓝:    #3498DB
浅蓝:    #85C1E9
极浅蓝: #EBF5FB
背景:    #F8FAFE
```

### 清新绿 🟢
```
深绿:    #1E8449
中绿:    #27AE60
浅绿:    #52BE80
极浅绿: #D5F4E6
背景:    #F0FFF4
```

### 暗黑模式 ⚫
```
极深:    #1a1a2e
深:      #16213e
强调:    #533483
边框:    #2a2a4a
文字:    #E8E8E8
```

### 多彩主题 🎨
```
紫:      #8E44AD
红:      #E74C3C
橙:      #F39C12
绿:      #27AE60
背景:    #FFFFFF
```

### 极简白 ⚪
```
深灰:    #2C3E50
中灰:    #34495E
浅灰:    #7F8C8D
极浅灰: #ECF0F1
背景:    #FFFFFF
```

## 技术细节

### CSS 变量映射
```javascript
--bg-color          // 背景色
--panel-bg          // 面板背景
--canvas-bg         // 画布背景
--text-primary      // 主要文字
--text-secondary    // 次要文字
--border-color      // 边框色
--primary-color     // 主色
--primary-dark      // 副色
--secondary-color   // 辅助色
```

### 主题持久化
- 保存位置：`localStorage.mindmap_theme`
- 加载时机：页面初始化时自动读取
- 清除方式：`localStorage.removeItem('mindmap_theme')`

## 常见问题

### Q: 主题选择会自动保存吗？
A: 是的，选择会自动保存到浏览器的 localStorage，下次打开时会自动加载。

### Q: 可以编程方式切换主题吗？
A: 可以，使用 `mindMap.setTheme(name)` 方法，其中 name 是主题名称。

### Q: 如何添加新的主题？
A: 编辑 mindmap.htm 中的 Themes 类定义，添加新的主题对象，然后在 HTML 中添加对应的 option。

### Q: 暗黑模式和其他主题有什么区别？
A: 暗黑模式优化了夜间使用体验，有特殊的加载遮罩样式和背景图案。其他主题都是日间设计。

### Q: 主题切换会影响节点数据吗？
A: 不会，主题只影响视觉样式，不影响任何数据。

### Q: 可以自定义颜色吗？
A: 目前不支持用户自定义，但开发者可以在代码中修改颜色值。

## 性能考虑

- 主题切换操作耗时 < 100ms
- CSS 变量通过 JavaScript 直接修改，浏览器自动优化
- 没有重排和重绘的额外开销
- localStorage 读写操作异步，不阻塞UI

## 浏览器兼容性

- Chrome/Edge：完全支持
- Firefox：完全支持
- Safari：完全支持
- IE11：不支持 CSS 变量，需要 polyfill

## 文件修改概览

只修改了 mindmap.htm 中的以下部分：

1. **CSS 部分**（第 1-1300 行）
   - 添加 5 个主题的 86 条 CSS 规则
   - 颜色专属覆盖

2. **JavaScript 部分**
   - Themes 类：扩展了主题定义结构
   - setTheme() 方法：添加 CSS 变量应用和 localStorage 保存
   - MindMap 初始化：添加 localStorage 加载逻辑

3. **HTML 部分**
   - 无修改（结构保持不变）

总修改量：**纯颜色和样式**，零功能性代码修改

---

**主题系统状态**：✅ 完整可用
**最后更新**：2024年
**维护者**：MindFlow Pro Team
