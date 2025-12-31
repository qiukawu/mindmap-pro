# 🔗 API 配置完全指南 - 如何正确连接 API

## ⚠️ 关键点：必须使用完整 URL 路径

很多用户配置 API 失败的原因是**只填了域名，没有填完整的路径**。

### ❌ 错误示例
```
https://api.openai.com
https://api.anthropic.com
```

### ✅ 正确示例
```
https://api.openai.com/v1/chat/completions
https://api.anthropic.com/v1/messages
```

**注意：不同的 API 提供商路径不同！一定要包含 `/v1/chat/completions` 或相应的完整路径。**

---

## 📋 各大 API 提供商的完整 URL

### 1️⃣ OpenAI（GPT-4, GPT-3.5）

```
完整 URL: https://api.openai.com/v1/chat/completions

配置步骤：
1. API地址: https://api.openai.com/v1/chat/completions
2. API密钥: sk-xxxxx（从 https://platform.openai.com/api-keys 获取）
3. 模型: gpt-4 或 gpt-3.5-turbo

测试命令（curl）:
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxx" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

### 2️⃣ Anthropic Claude（Claude 3）

```
完整 URL: https://api.anthropic.com/v1/messages

配置步骤：
1. API地址: https://api.anthropic.com/v1/messages
2. API密钥: sk-ant-xxxxx（从 https://console.anthropic.com 获取）
3. 模型: claude-3-opus-20240229 或 claude-3-sonnet-20240229

⚠️ 注意：Claude 的请求格式略有不同！
```

### 3️⃣ 阿里云通义千问

```
完整 URL: https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation

配置步骤：
1. API地址: https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
2. API密钥: sk-xxxxx（从阿里云控制台获取）
3. 模型: qwen-plus 或 qwen-turbo

⚠️ 注意：通义千问的请求格式也不同！
```

### 4️⃣ DeepSeek

```
完整 URL: https://api.deepseek.com/chat/completions

配置步骤：
1. API地址: https://api.deepseek.com/chat/completions
2. API密钥: sk-xxxxx
3. 模型: deepseek-chat

测试命令：
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxx" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

### 5️⃣ 本地 Ollama（离线模型）

```
完整 URL: http://localhost:11434/api/chat

配置步骤：
1. 首先安装 Ollama：https://ollama.com
2. 运行：ollama serve
3. 下载模型：ollama pull llama2 (或其他模型)

然后在 MindFlow Pro 中：
1. API地址: http://localhost:11434/api/chat
2. API密钥: （留空或填 anything）
3. 模型: llama2 或你下载的其他模型

⚠️ 注意：本地 Ollama 通常不需要密钥
```

### 6️⃣ 百度文心一言

```
完整 URL: https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant

配置步骤：
1. API地址: https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant
2. API密钥: 需要特殊格式的 token（不是简单的 sk-xxxxx）
3. 模型: eb-instant

⚠️ 注意：文心一言的认证方式特殊，请参考百度文档
```

### 7️⃣ Moonshot（月之暗面）

```
完整 URL: https://api.moonshot.cn/v1/chat/completions

配置步骤：
1. API地址: https://api.moonshot.cn/v1/chat/completions
2. API密钥: sk-xxxxx
3. 模型: moonshot-v1-8k

测试命令：
curl https://api.moonshot.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxx" \
  -d '{
    "model": "moonshot-v1-8k",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

### 8️⃣ 智谱（GLM）

```
完整 URL: https://open.bigmodel.cn/api/paas/v4/chat/completions

配置步骤：
1. API地址: https://open.bigmodel.cn/api/paas/v4/chat/completions
2. API密钥: sk-xxxxx
3. 模型: glm-4 或 glm-3.5-turbo
```

---

## 🧪 如何测试 API 是否正确

### 方法 1：使用浏览器控制台（F12）

```javascript
// 打开浏览器控制台，复制粘贴：

fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-xxxxx'  // 替换为你的 key
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hi' }],
    max_tokens: 10
  })
})
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

### 方法 2：使用 curl 命令（命令行）

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxx" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hi"}],
    "max_tokens": 10
  }'
```

### 方法 3：使用 MindFlow Pro 的"测试连接"功能

1. 填写 API 地址、密钥、模型
2. 点击"测试连接"按钮
3. 等待结果提示

---

## 🔍 常见连接错误及解决方案

### 错误 1：HTTP 401 - API 密钥错误

```
❌ 错误信息: API 密钥错误或已过期（HTTP 401）

原因：
1. API 密钥填写错误
2. 密钥已过期或被删除
3. 密钥格式不对（应该以 sk- 开头）

解决方案：
1. 检查密钥是否完全复制正确
2. 重新生成新的 API 密钥
3. 确保使用的是 API 密钥，不是其他 token
```

### 错误 2：HTTP 404 - API 地址错误

```
❌ 错误信息: API 地址错误（HTTP 404）

原因：
1. 只填了域名，没有完整路径
2. URL 拼写错误
3. 某些 API 提供商的路径已更改

解决方案：
1. 检查是否填写了完整路径（包括 /v1/chat/completions）
2. 参考本指南对应提供商的 URL
3. 确认 API 文档中的 URL 是否有更新
```

### 错误 3：HTTP 429 - 限流/速率超限

```
❌ 错误信息: API 请求过于频繁，已被限流（HTTP 429）

原因：
1. 在短时间内发送了过多请求
2. 达到了 API 的速率限制
3. 账户配额已用尽

解决方案：
1. 稍等片刻后再试
2. 升级账户或增加 API 额度
3. 检查 API 提供商的速率限制政策
```

### 错误 4：HTTP 500 - 服务器错误

```
❌ 错误信息: API 服务器错误（HTTP 500）

原因：
1. API 服务暂时不可用
2. API 提供商服务中断

解决方案：
1. 稍后重试
2. 检查 API 提供商的服务状态页面
3. 使用本地模式继续工作
```

### 错误 5：网络连接错误

```
❌ 错误信息: fetch failed / Network error

原因：
1. 网络连接问题
2. 代理/防火墙阻止
3. DNS 解析失败

解决方案：
1. 检查网络连接
2. 尝试 ping 一下 API 域名
3. 如果使用代理，检查代理设置
4. 尝试在浏览器地址栏打开 API URL（应该看到 404 或其他错误，但不是网络错误）
```

---

## 📝 完整配置示例

### 例 1：使用 OpenAI GPT-4

```
API 地址: https://api.openai.com/v1/chat/completions
API 密钥: sk-proj-abcdefg123456... (从 OpenAI 获取)
模型名称: gpt-4

步骤：
1. 打开 MindFlow Pro
2. 点击 ⚙️ 设置按钮
3. 在"API地址"填入上面的 URL
4. 在"API密钥"填入你的密钥
5. 在"模型名称"填入 gpt-4
6. 点击"测试连接"验证
7. 点击"保存设置"
8. 现在 AI 功能会使用你的 GPT-4 API
```

### 例 2：使用本地 Ollama

```
API 地址: http://localhost:11434/api/chat
API 密钥: (留空)
模型名称: llama2

步骤：
1. 确保 Ollama 已启动
2. 在 MindFlow Pro 中填写上面的地址和模型
3. 点击"测试连接"
4. 保存
5. AI 功能会离线使用本地模型
```

---

## 🆘 仍然无法连接？

### 检查清单

- [ ] 确认 API 地址是完整 URL（包含路径）
- [ ] 确认 API 密钥没有被复制错
- [ ] 确认模型名称与 API 支持的模型匹配
- [ ] 确认网络连接正常
- [ ] 在浏览器控制台查看详细的错误信息
- [ ] 点击"测试连接"按钮获取详细错误提示
- [ ] 参考该 API 提供商的官方文档

### 获取帮助

1. **查看浏览器控制台**：按 F12，点击 Console，查看红色错误信息
2. **使用 curl 测试**：在命令行测试 API 是否可用
3. **参考官方文档**：访问 API 提供商的文档网站
4. **使用本地模式**：不配置 API，使用内置的本地 AI 功能

---

## ✅ API 配置完成检查表

```
准备：
  ☐ 获取了 API 密钥
  ☐ 找到了正确的完整 API URL

配置：
  ☐ 在 MindFlow Pro 中填写了完整 URL
  ☐ 填写了 API 密钥
  ☐ 填写了模型名称
  ☐ 点击"保存设置"

验证：
  ☐ 点击"测试连接"
  ☐ 显示"✅ API 连接成功"
  ☐ 可以开始使用 AI 功能

使用：
  ☐ 选中节点
  ☐ 点击 AI 菜单
  ☐ 选择功能（分析/扩展/优化）
  ☐ 等待生成结果
```

---

**记住：完整的 URL 路径是关键！不同的 API 提供商有不同的路径。**

有任何问题，欢迎查看本文档或使用浏览器开发者工具进行诊断。
