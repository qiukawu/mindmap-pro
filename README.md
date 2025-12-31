# MindFlow Pro - 专业思维导图系统

专业级思维导图应用，支持 AI 智能生成、拖拽编辑、多选操作、撤销重做等功能。

## ✨ 核心特性

-  **无限层级结构** - 支持任意深度的节点创建
-  **拖拽排序** - 直观的拖放操作界面
-  **多选批量操作** - 同时选中多个节点
-  **撤销/重做** - 完整的历史记录
-  **AI 智能生成** - 支持多个 AI 服务（OpenAI、Claude、DeepSeek、阿里云、本地 Ollama）
-  **折叠/展开** - 灵活的视图管理
-  **保存/导出** - 支持 JSON、PNG 导出
-  **多主题** - 内置多套配色方案
-  **快捷键** - 完整的键盘快捷键支持

## 🚀 快速开始

### 方式 1：浏览器直接打开（推荐新手）

1. 用浏览器打开 `index.html` 或 `mindmap.htm`
2. 不配置 API 也能使用所有基本功能
3. 点击⚙️ 可配置 OpenAI、Claude 等 AI 服务（可选）

### 方式 2：本地开发服务器

```bash
npm install
npm start
```

开发模式（自动重启）：

```bash
npm run dev
```

## 🔧 API 配置（可选）

**本应用不配置 API 也能正常使用！** 配置 API 可获得更智能的 AI 功能。

### 快速配置 OpenAI

1. 点击⚙️设置按钮
2. 填入：
   - **API 主机地址**：`https://api.openai.com`
   - **API 路径**：留空（默认自动使用 `/v1/chat/completions`）
   - **API 密钥**：从 https://platform.openai.com/account/api-keys 获取
   - **模型名称**：点击"GPT-4"按钮
3. 点击"测试连接" ✅

### 支持的服务商

| 服务 | 主机地址 | 路径 |
|------|---------|------|
| **OpenAI** | `https://api.openai.com` | `/v1/chat/completions` |
| **Claude** | `https://api.anthropic.com` | `/v1/messages` |
| **DeepSeek** | `https://api.deepseek.com` | `/v1/chat/completions` |
| **本地 Ollama** | `http://localhost:11434` | `/api/chat` |

**详见** → 📖 [API 配置指南](./API_CONFIGURATION_GUIDE.md) / [快速参考](./API_QUICK_REFERENCE.md)

## 📂 项目结构

```
mindmap.htm             # 完整应用（核心文件）
index.html              # 快速启动页面
css/
   style.css           # 样式
js/
   app.js              # 应用入口
   core/               # 核心模块
      Node.js         # 节点类
      MindMap.js      # 引擎
      Renderer.js     # 渲染器
      Layout.js       # 布局
   features/           # 功能模块
      DragDrop.js     # 拖拽
      Selection.js    # 多选
      History.js      # 历史
      Export.js       # 导出
      Import.js       # 导入
      Themes.js       # 主题
   ai/                 # AI 模块
      TextAnalyzer.js
      AIService.js
      NLPProcessor.js
server/
   server.js           # Express 服务器
   routes/
      api.js          # API 路由
   services/
       openai.js       # OpenAI 服务

📚 文档
├── README.md                          # 本文件
├── API_CONFIGURATION_GUIDE.md         # 详细配置指南
├── API_QUICK_REFERENCE.md             # 快速参考卡
├── API_CONFIG_ARCHITECTURE_IMPL.md    # 技术实现细节
└── API_REFACTOR_TEST_CHECKLIST.md     # 测试清单
```

## API 文档

### POST /api/ai

请求：

```json
{
  "action": "generate",
  "prompt": "基于业务流程创建思维导图",
  "topic": "项目管理",
  "options": { "maxNodes": 20 }
}
```

响应：

```json
{
  "success": true,
  "data": {
    "nodes": [...],
    "connections": [...]
  }
}
```


## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ❓ 常见问题

### Q: 我不想配置 API，可以用吗？
**A:** 可以！所有基础功能都支持离线本地使用。AI 功能是可选的。

### Q: 怎样配置 AI？
**A:** 
1. 点击⚙️设置按钮
2. 填入主机地址和路径
3. 添加 API 密钥
4. 点击"测试连接"

详见 📖 [API 配置指南](./API_CONFIGURATION_GUIDE.md)

### Q: 支持哪些 AI 服务？
**A:** 支持所有兼容 OpenAI API 格式的服务，包括：
- OpenAI（GPT-4、GPT-4 Turbo、GPT-3.5）
- Claude（Anthropic）
- DeepSeek
- 阿里通义千问
- 本地 Ollama

### Q: 为什么要分开配置"主机地址"和"API 路径"？
**A:** 因为不同 AI 服务的 API 结构不同：
- OpenAI 用 `/v1/chat/completions`
- Claude 用 `/v1/messages`
- Ollama 用 `/api/chat`

分开配置，你可以灵活支持任何服务！

### Q: 如何导出为 PNG？
**A:** 在思维导图中，点击工具栏的"导出"按钮，选择 PNG 格式。

### Q: 能否自定义主题颜色？
**A:** 可以。点击⚙️设置中的"主题"选项查看所有可用主题。

### Q: 我的配置会被保存吗？
**A:** 会。所有配置都保存在浏览器本地存储中（localStorage），即使关闭浏览器也不会丢失。

## 🛠️ 技术栈

**前端：**
- Vanilla JavaScript（无框架依赖）
- HTML5 Canvas 绘图
- 浏览器 localStorage 本地存储

**可选后端：**
- Node.js + Express
- OpenAI/Claude/其他 API 集成
- dotenv 环境管理

## 💻 本地开发

### 克隆仓库

```bash
git clone https://github.com/yourusername/mindmap-pro.git
cd mindmap-pro
```

### 安装依赖

```bash
npm install
```

### 配置环境（可选）

```bash
cp .env.example .env
# 编辑 .env，根据需要填入 API 密钥
```

### 云端访问

直接访问 Gitee Pages 版本：

```
https://qiukacomic.gitee.io/mindmap-pro
```

无需本地部署，开箱即用！

## 📝 调试技巧

- 打开浏览器开发者工具（F12）查看控制台
- 使用 `window.mindMap` 在控制台直接访问应用实例
- 查看 localStorage 中的 `mindmap_api_config` 检查配置状态

```javascript
// 在浏览器控制台（F12）检查 API 配置
console.log(JSON.parse(localStorage.getItem('mindmap_api_config')));
```

## 📚 文档

- 📖 [API 配置指南](./API_CONFIGURATION_GUIDE.md) - 详细的配置说明
- 📄 [快速参考卡](./API_QUICK_REFERENCE.md) - 常用服务商速查表
- 🔧 [技术实现细节](./API_CONFIG_ARCHITECTURE_IMPL.md) - 架构说明
- ✅ [测试清单](./API_REFACTOR_TEST_CHECKLIST.md) - 功能验证

## 🔐 安全建议

✅ **推荐做法：**
- 定期更新 API 密钥
- 不在公开场合分享密钥
- 对 API 额度设置使用限制

⚠️ **避免：**
- 在代码中硬编码密钥
- 在浏览器控制台输入密钥
- 分享包含密钥的配置文件

## 🎯 路线图

- [ ] 云端同步
- [ ] 实时协作编辑
- [ ] 更多导出格式（PDF、SVG、XMind）
- [ ] 移动端适配
- [ ] 思维导图模板库
- [ ] 更多 AI 服务集成

## 📄 许可证

MIT

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 💬 反馈与支持

- 🐛 报告 Bug：[GitHub Issues](https://github.com/yourusername/mindmap-pro/issues)
- 💭 功能建议：[GitHub Discussions](https://github.com/yourusername/mindmap-pro/discussions)
- 📧 联系方式：support@mindflow-pro.com

## 📊 项目统计

- **语言**：JavaScript（Vanilla）、HTML、CSS
- **代码行数**：4000+ 行
- **功能数量**：50+ 项
- **浏览器兼容**：98% 现代浏览器覆盖

---

**Made with ❤️ for mindfulness and productivity.**


