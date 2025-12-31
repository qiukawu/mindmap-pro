/**
 * AIService.js - AI服务模块
 * 与mindmap.htm中的AIService类对应
 * 支持多种AI服务：OpenAI/兼容API、本地服务等
 */

/**
 * AI服务配置和调用
 */
class AIService {
    constructor() {
        this.config = this.loadConfig();
        this.fallbackMode = !this.config.apiUrl || !this.config.apiKey;
        this.requestInProgress = false;
    }
    
    /**
     * 从localStorage加载配置
     */
    loadConfig() {
        try {
            const saved = localStorage.getItem('mindmap_api_config');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }
    
    /**
     * 配置API（API地址、密钥、模型）
     */
    configure(config) {
        if (config) {
            this.config = {
                apiUrl: config.apiUrl || config.url,
                apiKey: config.apiKey || config.key,
                model: config.model || 'gpt-3.5-turbo'
            };
            localStorage.setItem('mindmap_api_config', JSON.stringify(this.config));
            this.fallbackMode = !this.config.apiUrl || !this.config.apiKey;
        }
        return this;
    }
    
    /**
     * 调用AI生成内容
     */
    async callAPI(prompt, options = {}) {
        if (this.fallbackMode) {
            return this.fallbackGenerate(prompt);
        }
        
        if (this.requestInProgress) {
            throw new Error('AI请求已在进行中');
        }
        
        try {
            this.requestInProgress = true;
            
            const url = this.config.apiUrl;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            };
            
            const body = {
                model: this.config.model,
                messages: [
                    { role: 'system', content: options.system || '你是一个思维导图专家，帮助用户分析和组织思维。' },
                    { role: 'user', content: prompt }
                ],
                temperature: options.temperature || 0.7,
                max_tokens: options.max_tokens || 1000
            };
            
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API错误: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices?.[0]?.message?.content || '生成失败';
        } finally {
            this.requestInProgress = false;
        }
    }
    
    /**
     * 本地回退生成（无需API）
     */
    fallbackGenerate(prompt) {
        // 本地生成逻辑
        const patterns = {
            '分析': ['主要观点', '关键信息', '实施步骤', '成功要素'],
            '展开': ['具体方法', '实现方式', '应用场景', '优势劣势'],
            '优化': ['改进建议', '优化方案', '成本效益', '可行性分析'],
            '生成': ['相关主题', '延伸思路', '对标案例', '未来展望']
        };
        
        let result = [];
        for (const [key, suggestions] of Object.entries(patterns)) {
            if (prompt.includes(key)) {
                result = suggestions.slice(0, 4);
                break;
            }
        }
        
        return result.length > 0 ? result.join('、') : '思维整理、逻辑分析、方案规划、内容优化';
    }
}

/**
 * 导出为全局可用
 */
if (typeof window !== 'undefined') {
    window.AIService = AIService;
}

export default AIService;

