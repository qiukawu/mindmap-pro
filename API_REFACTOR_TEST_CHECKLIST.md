# API 配置重构 - 功能验证清单

## 概述
本文档列出了所有需要验证的功能，确保 API 配置分离（主机 + 路径）工作正常。

---

## ✅ 代码更改验证

### 1️⃣ API 配置 UI（mindmap.htm 行 1305-1370）

- [ ] 4 个输入字段都存在且正确
  - [ ] `setting-api-host` - API 主机地址
  - [ ] `setting-api-path` - API 路径（默认 /v1/chat/completions）
  - [ ] `setting-api-key` - API 密钥
  - [ ] `setting-model` - 模型名称

- [ ] 帮助文本清晰
  - [ ] 显示了多个提供商的示例
  - [ ] 说明了默认路径值

- [ ] 模型预设按钮存在且正常
  - [ ] GPT-4
  - [ ] GPT-4 Turbo
  - [ ] GPT-3.5
  - [ ] Claude 3 Opus
  - [ ] Claude 3 Sonnet
  - [ ] 通义千问
  - [ ] DeepSeek

### 2️⃣ AIService 类（mindmap.htm 行 1978-2010）

- [ ] 构造函数初始化正确
  - [ ] `this.apiHost = null`
  - [ ] `this.apiPath = '/v1/chat/completions'`（默认值）
  - [ ] `this.apiKey = null`
  - [ ] `this.model = 'gpt-4'`

- [ ] `configure()` 方法接受分离的参数
  - [ ] `config.apiHost`
  - [ ] `config.apiPath`（使用默认值如果未提供）
  - [ ] `config.apiKey`
  - [ ] `config.model`

- [ ] `getFullUrl()` 方法正确组合 URL
  - [ ] 返回 `null` 如果 `apiHost` 为空
  - [ ] 去掉 host 末尾的 `/`
  - [ ] 确保 path 开头有 `/`
  - [ ] 正确拼接：`https://api.openai.com` + `/v1/chat/completions`

### 3️⃣ callAPI() 方法（mindmap.htm 行 2135-2165）

- [ ] 使用 `getFullUrl()` 而不是旧的 `this.apiUrl`
- [ ] 完整 URL 正确传递到 `fetch()`

### 4️⃣ saveSettings() 方法（mindmap.htm 行 3828-3857）

- [ ] 从 DOM 读取 4 个字段
  - [ ] `setting-api-host`
  - [ ] `setting-api-path`
  - [ ] `setting-api-key`
  - [ ] `setting-model`

- [ ] 验证逻辑正确
  - [ ] 如果提供 apiHost，则需要 apiKey 和 model
  - [ ] 使用 `new URL()` 验证 host 格式
  - [ ] 如果 path 为空，默认为 `/v1/chat/completions`

- [ ] localStorage 保存格式正确
  - [ ] 保存为 JSON: `{ apiHost, apiPath, apiKey, model }`

### 5️⃣ loadSettingsForm() 方法（mindmap.htm 行 3814-3821）

- [ ] 从 localStorage 读取 4 个字段
- [ ] 正确填充到 DOM
  - [ ] `document.getElementById('setting-api-host').value = config.apiHost`
  - [ ] `document.getElementById('setting-api-path').value = config.apiPath || '/v1/chat/completions'`
  - [ ] `document.getElementById('setting-api-key').value = config.apiKey`
  - [ ] `document.getElementById('setting-model').value = config.model`

### 6️⃣ testAPI() 方法（mindmap.htm 行 3862-3925）

- [ ] 从 DOM 读取分离的字段
- [ ] 验证主机格式
- [ ] 验证路径格式
- [ ] 使用 `getFullUrl()` 逻辑组合 URL
- [ ] HTTP 错误处理
  - [ ] 401 → "API密钥错误或已过期"
  - [ ] 404 → "API路径错误"
  - [ ] 429 → "请求过于频繁（限流）"
  - [ ] 500 → "服务器错误"

### 7️⃣ 按钮事件处理

- [ ] 模型预设按钮（行 3808-3809）
  - [ ] 点击时填充 `setting-model` 字段
  - [ ] 值来自 `data-model` 属性

- [ ] 测试连接按钮（行 3795-3797）
  - [ ] 触发 `testAPI()` 方法

- [ ] 清空配置按钮（行 3799-3808）
  - [ ] 清除所有 4 个字段
  - [ ] 删除 localStorage 中的配置
  - [ ] 禁用 API

---

## ✅ 功能测试清单

### 场景 1：新用户首次配置 OpenAI

**步骤**：
1. [ ] 打开应用
2. [ ] 点击⚙️设置按钮
3. [ ] 输入：
   - [ ] API 主机地址: `https://api.openai.com`
   - [ ] API 路径: 留空（应默认为 `/v1/chat/completions`）
   - [ ] API 密钥: `sk-proj-xxxxx`
   - [ ] 模型名称: 点击"GPT-4"按钮
4. [ ] 点击"测试连接"
5. [ ] [ ] 应该显示 ✅ 连接成功

**期望结果**：
- [ ] 配置保存到 localStorage
- [ ] 状态显示"已连接 (GPT-4)"

### 场景 2：配置 Claude（不同的路径）

**步骤**：
1. [ ] 打开设置
2. [ ] 输入：
   - [ ] API 主机地址: `https://api.anthropic.com`
   - [ ] API 路径: `/v1/messages`（必须修改！）
   - [ ] API 密钥: `sk-ant-xxxxx`
   - [ ] 模型名称: 点击"Claude 3 Opus"按钮
3. [ ] 点击"测试连接"
4. [ ] 应该显示 ✅ 连接成功

**期望结果**：
- [ ] 正确识别非标准路径

### 场景 3：路径错误的错误处理

**步骤**：
1. [ ] 打开设置
2. [ ] 输入：
   - [ ] API 主机地址: `https://api.openai.com`
   - [ ] API 路径: `/wrong/path`
   - [ ] API 密钥: `sk-proj-xxxxx`
   - [ ] 模型名称: `gpt-4`
3. [ ] 点击"测试连接"
4. [ ] 应该显示 ❌ 错误，明确指出"API路径错误（HTTP 404）"

**期望结果**：
- [ ] 错误信息清晰指出是路径问题

### 场景 4：密钥错误的错误处理

**步骤**：
1. [ ] 打开设置
2. [ ] 输入：
   - [ ] API 主机地址: `https://api.openai.com`
   - [ ] API 路径: `/v1/chat/completions`
   - [ ] API 密钥: `sk-proj-invalid-key`
   - [ ] 模型名称: `gpt-4`
3. [ ] 点击"测试连接"
4. [ ] 应该显示 ❌ 错误，说明"API密钥错误或已过期（HTTP 401）"

**期望结果**：
- [ ] 错误信息清晰指出是密钥问题

### 场景 5：本地 Ollama 配置

**步骤**：
1. [ ] 启动 Ollama 服务
2. [ ] 打开设置
3. [ ] 输入：
   - [ ] API 主机地址: `http://localhost:11434`
   - [ ] API 路径: `/api/chat`
   - [ ] API 密钥: （留空）
   - [ ] 模型名称: `llama2`
4. [ ] 点击"测试连接"
5. [ ] 应该显示 ✅ 连接成功

**期望结果**：
- [ ] 支持本地无密钥的 API

### 场景 6：默认路径自动处理

**步骤**：
1. [ ] 打开设置
2. [ ] 配置 OpenAI：
   - [ ] API 主机地址: `https://api.openai.com`
   - [ ] API 路径: 留空（故意留空）
   - [ ] API 密钥: `sk-proj-xxxxx`
   - [ ] 模型名称: `gpt-4`
3. [ ] 保存
4. [ ] [ ] 关闭设置，重新打开

**期望结果**：
- [ ] API 路径字段自动填充 `/v1/chat/completions`

### 场景 7：清空配置

**步骤**：
1. [ ] 保存一个 API 配置
2. [ ] 点击"清空配置"按钮
3. [ ] [ ] 所有字段都被清空
4. [ ] [ ] localStorage 中的配置被删除

**期望结果**：
- [ ] 应用恢复到未配置状态

### 场景 8：模型预设按钮

**步骤**：
1. [ ] 打开设置
2. [ ] 点击各个模型预设按钮
   - [ ] GPT-4 → 模型字段变为 `gpt-4`
   - [ ] GPT-4 Turbo → 模型字段变为 `gpt-4-turbo`
   - [ ] GPT-3.5 → 模型字段变为 `gpt-3.5-turbo`
   - [ ] Claude 3 Opus → 模型字段变为 `claude-3-opus-20240229`
   - [ ] Claude 3 Sonnet → 模型字段变为 `claude-3-sonnet-20240229`
   - [ ] 通义千问 → 模型字段变为 `qwen-turbo`
   - [ ] DeepSeek → 模型字段变为 `deepseek-chat`

**期望结果**：
- [ ] 每个按钮正确填充相应的模型名称

### 场景 9：页面刷新后配置恢复

**步骤**：
1. [ ] 配置并保存一个 API
2. [ ] 刷新页面 (F5)
3. [ ] 打开设置

**期望结果**：
- [ ] 所有 4 个字段都恢复为保存的值
- [ ] API 状态显示为已连接

### 场景 10：使用 AI 功能

**步骤**：
1. [ ] 配置并测试 API（应该成功）
2. [ ] 在思维导图中输入一个主题
3. [ ] 使用 AI 功能生成内容

**期望结果**：
- [ ] AI 调用成功
- [ ] 使用了正确的主机 + 路径 + 密钥 + 模型

---

## ✅ 浏览器控制台检查

在浏览器开发者工具（F12）的控制台（Console）中验证：

```javascript
// 检查 AIService 是否正确配置
const aiService = new AIService();
aiService.configure({
    apiHost: 'https://api.openai.com',
    apiPath: '/v1/chat/completions',
    apiKey: 'sk-proj-test',
    model: 'gpt-4'
});

// 应该返回完整 URL
console.log(aiService.getFullUrl());
// 输出: https://api.openai.com/v1/chat/completions

// 检查 localStorage 中的配置
console.log(JSON.parse(localStorage.getItem('mindmap_api_config')));
// 输出: { apiHost: "https://api.openai.com", apiPath: "/v1/chat/completions", apiKey: "sk-proj-test", model: "gpt-4" }
```

---

## ✅ 已知问题和说明

### 旧配置迁移
- **问题**：如果用户有旧的 `{ apiUrl, apiKey, model }` 格式的 localStorage 数据
- **当前行为**：应用将此视为未配置（因为新代码期望 `apiHost`）
- **解决方案**：首次使用时，用户需要重新配置 API（或添加迁移代码）

---

## 测试完成清单

所有验证完成后，请在本清单中标记：

- [ ] 所有代码更改已验证
- [ ] 所有 10 个功能场景已测试
- [ ] 浏览器控制台检查通过
- [ ] API 配置文档已阅读理解
- [ ] 已准备好告知用户新的配置方式

---

## 下一步

- [ ] 部署更新到生产环境
- [ ] 通知用户关于新的 API 配置方式
- [ ] 收集用户反馈
- [ ] 根据需要进行微调
