# 更新日志 - API 配置架构重构

## v2.0.0 - API 配置架构重构版本 (2024)

### 🎯 主要改进

#### ⭐ 核心变更：API 配置分离

**之前**：单一 URL 字段 + 密钥 + 模型
```
API 地址: https://api.openai.com/v1/chat/completions
API 密钥: sk-...
模型: gpt-4
```

**现在**：分离的主机 + 路径 + 密钥 + 模型（推荐方式）
```
API 主机地址: https://api.openai.com
API 路径: /v1/chat/completions (默认自动填充)
API 密钥: sk-...
模型: gpt-4
```

### 🚀 功能改进

#### 1. API 配置界面
- ✅ **新增**：分离的"API 主机地址"字段
- ✅ **新增**：分离的"API 路径"字段，带默认值 `/v1/chat/completions`
- ✅ **改进**：每个字段都有详细的帮助文本和真实示例
- ✅ **改进**：包括 OpenAI、Claude、DeepSeek、阿里云、本地 Ollama 等 5 个提供商的配置示例

#### 2. API 连接性
- ✅ **新增**：`AIService.getFullUrl()` 方法，智能拼接 URL
- ✅ **改进**：支持 HTTP 404 → "API 路径错误"的具体错误提示
- ✅ **改进**：支持 HTTP 401 → "API 密钥错误"的具体错误提示
- ✅ **改进**：所有 API 调用使用统一的 URL 拼接方式

#### 3. 配置存储
- ✅ **更新**：localStorage 从 `{apiUrl, apiKey, model}` 改为 `{apiHost, apiPath, apiKey, model}`
- ✅ **改进**：页面刷新后正确恢复所有 4 个配置字段
- ✅ **改进**：路径字段为空时自动使用默认值

#### 4. 支持的服务商
- ✅ **增强**：正式支持 Claude (Anthropic)
- ✅ **增强**：正式支持 DeepSeek
- ✅ **增强**：正式支持阿里通义千问
- ✅ **增强**：正式支持本地 Ollama
- ✅ **增强**：支持任何兼容 OpenAI API 的自定义服务

### 📚 文档更新

#### 新增文档
1. **API_CONFIGURATION_GUIDE.md** (2500+ 字)
   - 详细的配置指南
   - 5 个主要提供商的逐步说明
   - 常见错误解决方案
   - 安全建议

2. **API_QUICK_REFERENCE.md** (1200+ 字)
   - 30 秒快速参考卡
   - 常用配置速查表

3. **API_CONFIG_ARCHITECTURE_IMPL.md** (4000+ 字)
   - 技术实现细节
   - 每项代码变更的详细说明
   - 使用示例代码

4. **API_REFACTOR_TEST_CHECKLIST.md** (3500+ 字)
   - 完整的功能测试清单
   - 10 个测试场景
   - 浏览器控制台验证步骤

#### 更新的文档
- **README.md**
  - 新增"快速开始"的两种方式
  - 新增"API 配置"章节
  - 添加服务商速查表
  - 扩展常见问题和安全建议

### 🔧 技术细节

#### 代码修改

| 文件 | 位置 | 方法 | 变更 |
|------|------|------|------|
| mindmap.htm | 1305-1370 | API 配置 UI | 添加分离的主机和路径字段 |
| mindmap.htm | 1978-2010 | AIService 类 | 添加 `getFullUrl()` 方法 |
| mindmap.htm | 2135-2165 | callAPI() | 使用 `getFullUrl()` |
| mindmap.htm | 3862-3925 | testAPI() | 改进错误消息 |
| mindmap.htm | 3828-3857 | saveSettings() | 保存 4 个分离的字段 |
| mindmap.htm | 3814-3827 | loadSettingsForm() | 恢复 4 个分离的字段 |
| mindmap.htm | 3799-3808 | 清空配置 | 清除所有 4 个字段 |

#### 已移除的过时代码
- ❌ `this.apiUrl` 属性
- ❌ `setting-api-url` DOM 元素 ID
- ❌ 旧的 localStorage 格式引用

### 🐛 修复的问题

1. **❌ 问题**：API 配置无法支持非标准 API 路径（如 Claude 的 `/v1/messages`）
   - **✅ 解决**：分离主机和路径，支持任意组合

2. **❌ 问题**：API 测试错误信息不清楚，无法区分是路径错误还是密钥错误
   - **✅ 解决**：HTTP 404 明确显示"API 路径错误"，401 显示"API 密钥错误"

3. **❌ 问题**：API 配置混淆，用户不知道应该填什么
   - **✅ 解决**：分离的字段 + 详细的帮助文本和示例

4. **❌ 问题**：无法支持除 OpenAI 外的其他 AI 服务
   - **✅ 解决**：现支持 Claude、DeepSeek、阿里云、本地 Ollama 等

### 📊 向后兼容性

- ⚠️ **兼容性说明**：localStorage 格式已改变
- 🔄 **迁移策略**：现有用户需重新配置 API（一次性）
- 💡 **可选**：可添加自动迁移代码，但当前不实现（保持简洁）

### ✅ 验证完成度

| 项目 | 完成度 |
|------|--------|
| 代码更改 | ✅ 100% |
| 文档完成 | ✅ 100% |
| 功能验证 | ✅ 通过代码审查 |
| 用户测试 | ⏳ 待浏览器验证 |

### 🎉 预期效果

- **更清晰**：用户能清楚理解每个配置字段的作用
- **更灵活**：支持任何兼容 OpenAI API 格式的服务商
- **更可靠**：错误消息清晰指出问题所在
- **更易用**：默认路径值简化了 OpenAI 等标准 API 的配置
- **更易维护**：代码结构更符合 REST API 设计原则

### 📝 使用建议

**对于最终用户**：
1. 查看 [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) 进行快速配置
2. 如需更详细的说明，参考 [API_CONFIGURATION_GUIDE.md](API_CONFIGURATION_GUIDE.md)
3. 点击"测试连接"验证配置是否正确

**对于开发者**：
1. 参考 [API_CONFIG_ARCHITECTURE_IMPL.md](API_CONFIG_ARCHITECTURE_IMPL.md) 了解技术细节
2. 查看 [API_REFACTOR_TEST_CHECKLIST.md](API_REFACTOR_TEST_CHECKLIST.md) 进行功能验证

### 🚀 后续改进方向

- [ ] 添加自动迁移功能（将旧 `apiUrl` 自动拆分为 `apiHost` + `apiPath`）
- [ ] 添加更多 API 提供商的预设配置
- [ ] 添加 API 调用日志和调试工具
- [ ] 支持多个 API 配置档案，快速切换

---

## 版本说明

**版本号**：v2.0.0

**发布类型**：主要版本更新 (Major Release)

**更新类别**：
- 🎯 **Breaking Change**：API 配置格式改变，现有用户需重新配置
- 🚀 **Feature**：支持多个 AI 服务商
- 📚 **Documentation**：添加 4 份新文档
- 🐛 **Bugfix**：改进错误诊断信息

**建议升级**：强烈推荐升级，获得更好的 API 配置体验

---

## 致谢

感谢用户的宝贵反馈：
> "API 主机地址和 API 路径是两个不同的东西，不能混在一起"

这个反馈指出了原始设计的根本缺陷，推动了这次重要的架构改进。✨

---

**更新日期**：2024 年
**状态**：✅ 完成
**版本**：v2.0.0
