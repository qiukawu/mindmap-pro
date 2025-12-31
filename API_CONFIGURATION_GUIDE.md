# API 配置指南

## 概述

MindFlow Pro 现在支持**任何兼容 OpenAI API 的服务**以及其他自定义 API。关键是将 API 主机地址和 API 路径**分开配置**。

## 核心概念

API 配置分为 **4 个独立字段**：

| 字段 | 说明 | 示例 |
|-----|------|------|
| **API 主机地址** | API 服务的基础 URL（不包含路径） | `https://api.openai.com` |
| **API 路径** | 具体的端点路径（默认值 `/v1/chat/completions`） | `/v1/chat/completions` |
| **API 密钥** | 访问 API 所需的认证密钥 | `sk-proj-...` |
| **模型名称** | 要使用的模型标识符 | `gpt-4` |

### URL 组合方式

最终的 API 请求 URL = **API 主机地址** + **API 路径**

```
https://api.openai.com + /v1/chat/completions 
= https://api.openai.com/v1/chat/completions
```

---

## 快速配置

### 1️⃣ OpenAI（GPT 系列）

**配置步骤：**

1. **API 主机地址**
   ```
   https://api.openai.com
   ```

2. **API 路径**
   ```
   /v1/chat/completions
   ```
   （可以留空，默认使用此路径）

3. **API 密钥**
   - 从 https://platform.openai.com/account/api-keys 获取
   - 格式: `sk-proj-...`

4. **模型名称**
   - `gpt-4` - 最强大的模型
   - `gpt-4-turbo` - 更快更便宜
   - `gpt-3.5-turbo` - 最经济的选择

### 2️⃣ Claude（Anthropic）

**配置步骤：**

1. **API 主机地址**
   ```
   https://api.anthropic.com
   ```

2. **API 路径**
   ```
   /v1/messages
   ```
   ⚠️ **注意**：Claude 的路径不是 `/v1/chat/completions`

3. **API 密钥**
   - 从 https://console.anthropic.com/ 获取
   - 格式: `sk-ant-...`

4. **模型名称**
   - `claude-3-opus-20240229` - 最强大
   - `claude-3-sonnet-20240229` - 均衡
   - `claude-3-haiku-20240307` - 最快

### 3️⃣ DeepSeek

**配置步骤：**

1. **API 主机地址**
   ```
   https://api.deepseek.com
   ```

2. **API 路径**
   ```
   /v1/chat/completions
   ```
   （可以留空，默认使用此路径）

3. **API 密钥**
   - 从 https://platform.deepseek.com/ 获取

4. **模型名称**
   - `deepseek-chat` - 推荐
   - `deepseek-coder` - 编程任务

### 4️⃣ 阿里通义千问

**配置步骤：**

1. **API 主机地址**
   ```
   https://dashscope.aliyuncs.com
   ```

2. **API 路径**
   ```
   /api/v1/services/aigc/text-generation/generation
   ```

3. **API 密钥**
   - 从 https://dashscope.console.aliyun.com/ 获取
   - 格式: `sk-...`

4. **模型名称**
   - `qwen-turbo` - 推荐
   - `qwen-plus`
   - `qwen-max`

### 5️⃣ 本地 Ollama（开源模型）

**配置步骤：**

1. **API 主机地址**
   ```
   http://localhost:11434
   ```

2. **API 路径**
   ```
   /api/chat
   ```

3. **API 密钥**
   ```
   （留空，本地 Ollama 不需要密钥）
   ```

4. **模型名称**
   - 根据你已安装的模型填写
   - 例如: `llama2`, `mistral`, `neural-chat`
   - 查看已安装模型: `ollama list`

---

## 测试连接

### 点击"测试连接"按钮

系统会：
1. 验证 API 主机地址格式是否正确
2. 构建完整的 API URL
3. 发送测试请求
4. 显示具体的错误信息

### 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| ❌ **主机格式错误** | 主机地址不是有效的 URL | 检查格式，应以 `http://` 或 `https://` 开头 |
| ❌ **401 Unauthorized** | API 密钥错误或已过期 | 重新获取并检查 API 密钥 |
| ❌ **404 Not Found** | **API 路径错误** | 检查你的 API 提供商的文档，确认正确的路径 |
| ❌ **429 Too Many Requests** | 请求过于频繁 | 等待一段时间后重试 |
| ❌ **500 Server Error** | API 服务器出错 | 联系 API 提供商或稍后重试 |

---

## 为什么要分开主机和路径？

### ❌ 旧方式（不推荐）
```
单一 URL 字段: https://api.openai.com/v1/chat/completions
```

**问题**：
- 用户必须知道完整的 API 端点
- 不同 API 提供商的路径结构不同
- 容易出错，难以维护

### ✅ 新方式（推荐）
```
主机地址: https://api.openai.com
API 路径: /v1/chat/completions
```

**优点**：
- **清晰**：主机和路径分开，一目了然
- **灵活**：轻松支持不同的 API 结构
- **可靠**：减少用户输入错误
- **易维护**：错误信息更具体（如 404 表示路径错误）

---

## 常用配置速查表

```
┌─────────────────────────────────────────────────────────────┐
│  提供商      │  主机地址                    │  路径          │
├─────────────────────────────────────────────────────────────┤
│  OpenAI      │  https://api.openai.com     │  /v1/chat/     │
│              │                              │  completions   │
├─────────────────────────────────────────────────────────────┤
│  Claude      │  https://api.anthropic.com  │  /v1/messages  │
├─────────────────────────────────────────────────────────────┤
│  DeepSeek    │  https://api.deepseek.com   │  /v1/chat/     │
│              │                              │  completions   │
├─────────────────────────────────────────────────────────────┤
│  通义千问    │  https://dashscope.         │  /api/v1/      │
│              │  aliyuncs.com               │  services/...  │
├─────────────────────────────────────────────────────────────┤
│  本地Ollama  │  http://localhost:11434     │  /api/chat     │
└─────────────────────────────────────────────────────────────┘
```

---

## 进阶配置

### 自定义兼容 OpenAI 的 API

如果你有一个兼容 OpenAI API 格式的服务（例如自搭建的服务），只需：

1. **API 主机地址** → 填写你的服务地址
2. **API 路径** → 保持 `/v1/chat/completions`（如果兼容）或修改为实际路径
3. **API 密钥** → 填写你的认证密钥
4. **模型名称** → 填写你的模型ID

### 代理服务

如果使用代理服务访问 API：

1. **API 主机地址** → 填写代理服务的地址
2. **API 路径** → 保持与原 API 相同（通常是 `/v1/chat/completions`）
3. **API 密钥** → 使用代理提供的密钥

---

## 安全建议

✅ **必须做**：
- 定期更新 API 密钥
- 不要在公开场合分享你的 API 密钥
- 对你的 API 额度设置上限

⚠️ **不要做**：
- 不要在代码中硬编码密钥
- 不要在浏览器控制台中输入密钥
- 不要共享包含密钥的配置文件

---

## 支持与反馈

如有问题，请检查：
1. **主机地址格式** - 是否以 `http://` 或 `https://` 开头？
2. **API 路径** - 是否与 API 提供商文档一致？
3. **API 密钥** - 是否正确且未过期？
4. **网络连接** - 是否能访问 API 服务？

点击"测试连接"获取更具体的错误信息！
