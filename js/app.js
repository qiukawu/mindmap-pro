/**
 * app.js - 应用入口（仅供参考，实际代码已集成到 mindmap.htm）
 * 本文件用于模块化开发参考，应用运行完全依赖 mindmap.htm
 * 
 * 注意：mindmap.htm 已包含所有以下功能的完整实现
 */

let mindMap;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 MindFlow Pro 启动中...');
    
    // 检查必要的DOM元素
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('❌ 缺少 canvas-container 元素');
        return;
    }
    
    try {
        // 创建思维导图实例（此时所有类已在 mindmap.htm 中定义）
        mindMap = new MindMap('canvas-container');
        
        // 初始化API配置（从localStorage读取）
        initAPIConfig();
        
        // 添加示例数据
        loadSampleData();
        
        // 暴露到全局
        window.mindMap = mindMap;
        
        console.log('✅ MindFlow Pro 启动完成（本地模式）');
        console.log('📌 提示：所有核心代码已集成在 mindmap.htm 中');
    } catch (error) {
        console.error('❌ MindFlow Pro 启动失败:', error);
        // 显示错误提示
        if (mindMap) {
            mindMap.showToast('应用启动失败: ' + error.message, 'error');
        }
    }
});

/**
 * 初始化API配置
 */
function initAPIConfig() {
    const savedConfig = localStorage.getItem('mindmap_api_config');
    
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            mindMap.aiService.configure(config);
            console.log('🔧 已加载保存的API配置');
            console.log('📝 模型:', config.model);
        } catch (e) {
            console.warn('API配置加载失败:', e.message);
        }
    } else {
        console.log('💡 未配置API，使用本地模式');
    }
}

/**
 * 加载示例数据
 */
function loadSampleData() {
    const root = mindMap.root;
    root.text = '思维导图专业版';
    root.style.backgroundColor = '#2C3E50';
    
    // 添加示例节点
    const features = new Node({
        text: '核心功能',
        style: { backgroundColor: '#3498DB' }
    });
    features.parentId = root.id;
    root.children.push(features);
    
    ['节点编辑', '拖拽排序', '多选操作', '历史管理'].forEach(text => {
        const node = new Node({ text });
        node.parentId = features.id;
        features.children.push(node);
    });
    
    const ai = new Node({
        text: 'AI功能',
        style: { backgroundColor: '#9B59B6' }
    });
    ai.parentId = root.id;
    root.children.push(ai);
    
    ['主题生成', '文本分析', '节点扩展', '内容优化'].forEach(text => {
        const node = new Node({ text });
        node.parentId = ai.id;
        ai.children.push(node);
    });
    
    const exports = new Node({
        text: '导出格式',
        style: { backgroundColor: '#E74C3C' }
    });
    exports.parentId = root.id;
    root.children.push(exports);
    
    ['PNG/JPG', 'JSON', 'Markdown'].forEach(text => {
        const node = new Node({ text });
        node.parentId = exports.id;
        exports.children.push(node);
    });
    
    mindMap.render();
    mindMap.centerView();
    mindMap.saveState('加载示例');
}
