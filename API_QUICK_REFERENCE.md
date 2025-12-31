# API 配置 - 快速参考卡

## 🚀 30 秒快速配置

### OpenAI（最常用）

```
主机地址: https://api.openai.com
路径:     留空（默认自动使用 /v1/chat/completions）
密钥:     sk-proj-xxxxx（来自 platform.openai.com）
模型:     点击 "GPT-4" 按钮
```

**然后点击"测试连接"** ✅

---

## 🔄 其他常用提供商

### Claude (Anthropic)
```
主机: https://api.anthropic.com
路径: /v1/messages          ⚠️ 重要：不是 /v1/chat/completions!
密钥: sk-ant-xxxxx
模型: 点击 "Claude 3 Opus" 按钮
```

### DeepSeek
```
主机: https://api.deepseek.com
路径: 留空（默认自动使用 /v1/chat/completions）
密钥: xxxxx
模型: 点击 "DeepSeek" 按钮
```

### 本地 Ollama
```
主机: http://localhost:11434
路径: /api/chat
密钥: （留空）
模型: 自己输入（例如 llama2, mistral 等）
```

---

## ❓ 关键概念

| 概念 | 说明 | 示例 |
|------|------|------|
| **主机地址** | API 服务器的地址 | `https://api.openai.com` |
| **路径** | 具体的 API 端点 | `/v1/chat/completions` |
| **完整 URL** | 主机 + 路径 | `https://api.openai.com/v1/chat/completions` |
| **默认路径** | 如果留空自动使用 | `/v1/chat/completions` |

---

## ⚡ 为什么要分开主机和路径？

因为不同的 API 有不同的路径：
- OpenAI 用 `/v1/chat/completions`
- Claude 用 `/v1/messages`
- Ollama 用 `/api/chat`
- 阿里云用 `/api/v1/services/aigc/text-generation/generation`

分开配置，你可以灵活支持任何 API！✨

---

## 🔴 常见错误提示解释

| 错误 | 原因 | 修复方法 |
|-----|------|---------|
| ❌ 主机地址格式错误 | 没有 `http://` 或 `https://` | 加上协议前缀 |
| ❌ API密钥错误 (401) | 密钥不对或过期 | 重新获取密钥 |
| ❌ API路径错误 (404) | 路径不对 | 查看 API 文档，修改路径 |
| ❌ 请求过于频繁 (429) | 请求太快 | 等等再试 |

---

## 💡 提示

✅ **最简单的方式**：
1. 只填"主机地址" → 路径自动用 OpenAI 标准值
2. 如果不行 → 查看你用的 API 文档，在"路径"里改一下
3. 点击"测试连接" → 错误信息会告诉你哪里有问题

✅ **模型预设按钮**：
- 点击可以自动填入该提供商的常用模型
- 省得手动输入

✅ **页面刷新后**：
- 配置会自动恢复
- 不用每次都重新填

---

## 📚 详细指南

👉 查看 **API_CONFIGURATION_GUIDE.md** 了解更多

- 所有支持的提供商
- 逐步配置说明
- 安全建议
- 高级配置

---

## 🆘 还是不行？

**请在"测试连接"后看错误信息**，它会告诉你：

- 如果是 **404** → API 路径错误，查看文档修改
- 如果是 **401** → API 密钥错误，重新获取
- 如果是 **500** → API 服务器出问题，稍后再试
- 如果连不上 → 检查网络或主机地址是否正确

---

## 🎯 核心要点

```
主机地址 + API路径 = 完整的 API 请求地址

不要混在一起 ✨
```

**就这么简单！**
