// 简单的 OpenAI 服务存根，生产环境请用官方 SDK 并从环境变量读取 API Key
module.exports = {
  analyze: async (text) => {
    // 这里返回一个占位响应；可替换为真实调用
    return { summary: `分析：接收到 ${String(text).length} 字符` };
  }
};
