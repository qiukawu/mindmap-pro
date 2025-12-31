/**
 * TextAnalyzer.js - 智能文本分析器（完全重构）
 * 
 * 设计理念：
 * 1. 每个节点都是完整的思想单元，不是碎片
 * 2. 保持语义连贯性和逻辑层次
 * 3. 通用于任何主题和文本类型
 * 4. 遵循"概念→结构→细节→原则"四层架构
 */
class TextAnalyzer {
    constructor() {
        // 分析配置
        this.config = {
            maxNodeTextLength: 50,      // 节点文本最大长度
            minNodeTextLength: 4,       // 节点文本最小长度
            maxChildrenPerNode: 7,      // 每个节点最多子节点数
            maxDepth: 5,                // 最大层级深度
            summaryRatio: 0.3           // 摘要压缩比例
        };
        
        // 中文停用词（精简版，保留有意义的词）
        this.stopWords = new Set([
            '的', '了', '着', '是', '在', '把', '被', '让', '给',
            '就', '都', '也', '还', '又', '才', '只', '而', '且',
            '这', '那', '它', '他', '她', '我', '你', '们',
            '吧', '呢', '啊', '呀', '哦', '嗯'
        ]);
        
        // 逻辑连接词（用于识别结构）
        this.logicMarkers = {
            cause: ['因为', '由于', '既然', '因此', '所以', '导致', '造成'],
            result: ['因此', '所以', '于是', '结果', '从而', '以致'],
            contrast: ['但是', '然而', '却', '不过', '相反', '尽管', '虽然'],
            addition: ['而且', '并且', '同时', '此外', '另外', '还有', '以及'],
            sequence: ['首先', '其次', '然后', '接着', '最后', '第一', '第二'],
            condition: ['如果', '假如', '若', '一旦', '只要', '除非'],
            purpose: ['为了', '以便', '为的是', '目的是'],
            summary: ['总之', '总的来说', '综上所述', '概括地说', '总结']
        };
        
        // 内容类型模板
        this.templates = {
            problem: ['问题', '挑战', '困难', '障碍', '痛点', '需求'],
            solution: ['解决', '方案', '方法', '策略', '措施', '对策'],
            benefit: ['优势', '好处', '价值', '效果', '收益', '意义'],
            risk: ['风险', '问题', '隐患', '不足', '缺点', '劣势'],
            action: ['步骤', '操作', '流程', '过程', '阶段', '环节'],
            concept: ['概念', '定义', '含义', '本质', '特征', '属性']
        };
    }
    
    /**
     * 主分析入口 - 智能分析任意文本
     * @param {string} text 输入文本（无长度限制）
     * @param {Object} options 分析选项
     * @returns {Object} 结构化的思维导图数据
     */
    analyze(text, options = {}) {
        if (!text || text.trim().length === 0) {
            return this.createEmptyResult('请输入内容');
        }
        
        // 1. 预处理：清洗和规范化文本
        const cleanedText = this.preprocess(text);
        
        // 2. 识别文本类型和结构
        const textProfile = this.profileText(cleanedText);
        
        // 3. 根据文本类型选择分析策略
        let result;
        
        switch (textProfile.type) {
            case 'structured':
                // 已有清晰结构的文本（如带标题的文章）
                result = this.analyzeStructuredText(cleanedText, textProfile);
                break;
            case 'narrative':
                // 叙事性文本（故事、报道等）
                result = this.analyzeNarrativeText(cleanedText, textProfile);
                break;
            case 'argumentative':
                // 论述性文本（观点、分析等）
                result = this.analyzeArgumentativeText(cleanedText, textProfile);
                break;
            case 'descriptive':
                // 描述性文本（说明、介绍等）
                result = this.analyzeDescriptiveText(cleanedText, textProfile);
                break;
            case 'list':
                // 列表型文本
                result = this.analyzeListText(cleanedText, textProfile);
                break;
            default:
                // 通用分析
                result = this.analyzeGenericText(cleanedText, textProfile);
        }
        
        // 4. 优化和精炼结果
        result = this.refineResult(result);
        
        // 5. 确保节点文本流畅
        result = this.polishNodeTexts(result);
        
        return result;
    }
    
    /**
     * 文本预处理
     */
    preprocess(text) {
        return text
            // 统一换行符
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            // 合并多余空白
            .replace(/[ \t]+/g, ' ')
            // 保留段落结构，但合并过多的空行
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }
    
    /**
     * 分析文本特征，判断类型
     */
    profileText(text) {
        const profile = {
            type: 'generic',
            length: text.length,
            paragraphs: text.split(/\n\n+/).filter(p => p.trim()),
            hasNumberedList: /^\s*[\d一二三四五六七八九十]+[.、．:：)\]】]\s*/m.test(text),
            hasBulletList: /^\s*[-*•·]\s+/m.test(text),
            hasHeadings: /^#+\s+|^[一二三四五六七八九十]+[、.]\s*\S|^\d+[.、]\s*[^\d]/m.test(text),
            questionCount: (text.match(/[？?]/g) || []).length,
            statementStrength: 0,
            topics: [],
            keyPhrases: []
        };
        
        // 提取关键短语（2-8字的有意义短语）
        profile.keyPhrases = this.extractKeyPhrases(text);
        
        // 识别核心主题
        profile.topics = this.identifyTopics(text, profile.keyPhrases);
        
        // 判断文本类型
        if (profile.hasHeadings || profile.hasNumberedList) {
            profile.type = 'structured';
        } else if (profile.hasBulletList) {
            profile.type = 'list';
        } else if (profile.questionCount > 2) {
            profile.type = 'argumentative';
        } else if (this.hasNarrativeMarkers(text)) {
            profile.type = 'narrative';
        } else if (profile.paragraphs.length <= 2 && text.length < 500) {
            profile.type = 'descriptive';
        } else {
            profile.type = this.inferTextType(text);
        }
        
        return profile;
    }
    
    /**
     * 提取关键短语（而非碎片词汇）
     */
    extractKeyPhrases(text) {
        const phrases = [];
        
        // 1. 提取引号内容
        const quoted = text.match(/["「『"']([^"」』"']+)["」』"']/g) || [];
        quoted.forEach(q => {
            const content = q.slice(1, -1).trim();
            if (content.length >= 2 && content.length <= 20) {
                phrases.push({ text: content, weight: 3, type: 'quoted' });
            }
        });
        
        // 2. 提取冒号后的定义性内容
        const definitions = text.match(/[：:]\s*([^，。！？\n]{4,30})/g) || [];
        definitions.forEach(d => {
            const content = d.slice(1).trim();
            phrases.push({ text: content, weight: 2, type: 'definition' });
        });
        
        // 3. 提取"是...的"结构
        const isPatterns = text.match(/是([^，。！？]{2,20})的/g) || [];
        isPatterns.forEach(p => {
            const content = p.slice(1, -1).trim();
            if (content.length >= 2) {
                phrases.push({ text: content, weight: 2, type: 'definition' });
            }
        });
        
        // 4. 提取动宾短语
        const verbPhrases = this.extractVerbPhrases(text);
        verbPhrases.forEach(vp => {
            phrases.push({ text: vp, weight: 1.5, type: 'action' });
        });
        
        // 5. 提取并列结构
        const parallelStructures = this.extractParallelStructures(text);
        parallelStructures.forEach(ps => {
            phrases.push({ text: ps, weight: 1.5, type: 'parallel' });
        });
        
        // 去重并排序
        const uniquePhrases = this.deduplicatePhrases(phrases);
        return uniquePhrases.sort((a, b) => b.weight - a.weight).slice(0, 20);
    }
    
    /**
     * 提取动宾短语
     */
    extractVerbPhrases(text) {
        const phrases = [];
        
        // 常见动词模式
        const verbPatterns = [
            /([实现建立提升优化改进完善推动促进加强创建开发设计制定执行完成达成])([\u4e00-\u9fa5]{2,10})/g,
            /(通过|利用|采用|运用|借助)([\u4e00-\u9fa5]{2,15})/g,
            /([分析研究探讨解决处理应对])([\u4e00-\u9fa5]{2,10}(?:问题|情况|现象)?)/g
        ];
        
        verbPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const phrase = match[0];
                if (phrase.length >= 3 && phrase.length <= 15) {
                    phrases.push(phrase);
                }
            }
        });
        
        return [...new Set(phrases)];
    }
    
    /**
     * 提取并列结构
     */
    extractParallelStructures(text) {
        const structures = [];
        
        // 顿号分隔的并列项
        const dunhaoPattern = /([^，。！？\n]{2,8})[、]([^，。！？\n]{2,8})(?:[、]([^，。！？\n]{2,8}))*/g;
        let match;
        while ((match = dunhaoPattern.exec(text)) !== null) {
            const items = match[0].split('、').filter(s => s.trim().length >= 2);
            if (items.length >= 2 && items.length <= 5) {
                structures.push(...items);
            }
        }
        
        // "和"/"与"/"及"连接的并列项
        const conjPattern = /([^，。！？\n]{2,10})(和|与|及|以及)([^，。！？\n]{2,10})/g;
        while ((match = conjPattern.exec(text)) !== null) {
            structures.push(match[1].trim(), match[3].trim());
        }
        
        return [...new Set(structures)];
    }
    
    /**
     * 识别核心主题
     */
    identifyTopics(text, keyPhrases) {
        const topics = [];
        
        // 从关键短语中提取主题
        const topPhrases = keyPhrases.slice(0, 5);
        
        // 查找最可能的主题词
        const firstSentence = text.split(/[。！？\n]/)[0];
        if (firstSentence && firstSentence.length <= 50) {
            topics.push({
                text: this.extractCorePhrase(firstSentence),
                confidence: 0.9
            });
        }
        
        // 添加高权重短语作为候选主题
        topPhrases.forEach(p => {
            topics.push({
                text: p.text,
                confidence: p.weight / 3
            });
        });
        
        return topics;
    }
    
    /**
     * 提取句子核心短语
     */
    extractCorePhrase(sentence) {
        // 移除句首的连接词和修饰语
        let core = sentence
            .replace(/^(首先|其次|然后|最后|另外|此外|总之|因此|所以|但是|然而|如果|虽然)[，,]?\s*/g, '')
            .replace(/^(我们?|你们?|他们?|这|那|本文|该)[^，。]*[，,]\s*/g, '')
            .trim();
        
        // 如果太长，截取前半部分
        if (core.length > 30) {
            const comma = core.indexOf('，');
            if (comma > 5 && comma < 25) {
                core = core.substring(0, comma);
            } else {
                core = core.substring(0, 25) + '...';
            }
        }
        
        return core || sentence.substring(0, 20);
    }
    
    /**
     * 判断是否有叙事特征
     */
    hasNarrativeMarkers(text) {
        const narrativeWords = ['曾经', '后来', '当时', '起初', '最终', '突然', '逐渐', '开始', '结束'];
        return narrativeWords.some(word => text.includes(word));
    }
    
    /**
     * 推断文本类型
     */
    inferTextType(text) {
        const indicators = {
            argumentative: ['认为', '观点', '分析', '论述', '证明', '说明', '表明'],
            descriptive: ['介绍', '描述', '说明', '解释', '包括', '具有', '特点'],
            narrative: ['发生', '经历', '过程', '事件', '故事', '历史']
        };
        
        let maxScore = 0;
        let detectedType = 'generic';
        
        for (const [type, words] of Object.entries(indicators)) {
            const score = words.filter(w => text.includes(w)).length;
            if (score > maxScore) {
                maxScore = score;
                detectedType = type;
            }
        }
        
        return detectedType;
    }
    
    // ==================== 各类型文本分析方法 ====================
    
    /**
     * 分析结构化文本（有标题/编号的）
     */
    analyzeStructuredText(text, profile) {
        const sections = this.extractSections(text);
        
        // 确定根节点（整体主题）
        const rootText = this.determineRootTopic(text, profile);
        
        const root = {
            text: rootText,
            children: []
        };
        
        // 将各章节转换为子节点
        sections.forEach(section => {
            const sectionNode = {
                text: this.formatNodeText(section.title),
                children: []
            };
            
            // 分析章节内容
            if (section.content) {
                const contentNodes = this.analyzeContent(section.content);
                sectionNode.children = contentNodes;
            }
            
            root.children.push(sectionNode);
        });
        
        // 如果没有提取到章节，使用通用分析
        if (root.children.length === 0) {
            return this.analyzeGenericText(text, profile);
        }
        
        return root;
    }
    
    /**
     * 提取文本章节
     */
    extractSections(text) {
        const sections = [];
        
        // 匹配各种标题格式
        const headingPatterns = [
            /^(#{1,3})\s+(.+)$/gm,                           // Markdown标题
            /^([一二三四五六七八九十]+)[、.．]\s*(.+)$/gm,      // 中文数字标题
            /^(\d+)[.、．]\s*(.+)$/gm,                        // 数字标题
            /^[【\[](.+?)[】\]]$/gm                           // 括号标题
        ];
        
        let allMatches = [];
        
        headingPatterns.forEach(pattern => {
            let match;
            const regex = new RegExp(pattern.source, pattern.flags);
            while ((match = regex.exec(text)) !== null) {
                allMatches.push({
                    index: match.index,
                    title: match[match.length - 1].trim(),
                    fullMatch: match[0]
                });
            }
        });
        
        // 按位置排序
        allMatches.sort((a, b) => a.index - b.index);
        
        // 提取每个章节的内容
        for (let i = 0; i < allMatches.length; i++) {
            const current = allMatches[i];
            const next = allMatches[i + 1];
            
            const startPos = current.index + current.fullMatch.length;
            const endPos = next ? next.index : text.length;
            const content = text.substring(startPos, endPos).trim();
            
            sections.push({
                title: current.title,
                content: content
            });
        }
        
        return sections;
    }
    
    /**
     * 确定根节点主题
     */
    determineRootTopic(text, profile) {
        // 优先使用识别到的主题
        if (profile.topics.length > 0 && profile.topics[0].confidence > 0.7) {
            return profile.topics[0].text;
        }
        
        // 尝试从第一段提取
        const firstPara = profile.paragraphs[0];
        if (firstPara) {
            const firstSentence = firstPara.split(/[。！？]/)[0];
            if (firstSentence && firstSentence.length <= 30) {
                return this.formatNodeText(firstSentence);
            }
        }
        
        // 使用关键短语
        if (profile.keyPhrases.length > 0) {
            return profile.keyPhrases[0].text;
        }
        
        return '主题分析';
    }
    
    /**
     * 分析叙事性文本
     */
    analyzeNarrativeText(text, profile) {
        const root = {
            text: this.determineRootTopic(text, profile),
            children: []
        };
        
        // 按时间/逻辑顺序提取要点
        const timeline = this.extractTimeline(text);
        
        if (timeline.length > 0) {
            // 如果有明确的时间线
            timeline.forEach(event => {
                root.children.push({
                    text: event.description,
                    children: event.details.map(d => ({ text: d, children: [] }))
                });
            });
        } else {
            // 按段落分析
            const paragraphSummaries = this.summarizeParagraphs(profile.paragraphs);
            root.children = paragraphSummaries.map(s => ({
                text: s,
                children: []
            }));
        }
        
        return root;
    }
    
    /**
     * 提取时间线/事件序列
     */
    extractTimeline(text) {
        const events = [];
        
        // 时间标记词
        const timeMarkers = ['最初', '起初', '开始', '首先', '然后', '接着', '之后', '后来', '最后', '最终'];
        
        const sentences = text.split(/[。！？\n]+/).filter(s => s.trim());
        
        let currentEvent = null;
        
        sentences.forEach(sentence => {
            const hasTimeMarker = timeMarkers.some(marker => sentence.includes(marker));
            
            if (hasTimeMarker) {
                if (currentEvent) {
                    events.push(currentEvent);
                }
                currentEvent = {
                    description: this.formatNodeText(sentence),
                    details: []
                };
            } else if (currentEvent) {
                const detail = this.formatNodeText(sentence);
                if (detail.length >= 4) {
                    currentEvent.details.push(detail);
                }
            }
        });
        
        if (currentEvent) {
            events.push(currentEvent);
        }
        
        return events;
    }
    
    /**
     * 分析论述性文本
     */
    analyzeArgumentativeText(text, profile) {
        const root = {
            text: this.determineRootTopic(text, profile),
            children: []
        };
        
        // 提取论点结构
        const argumentsList = this.extractArguments(text);
        
        // 组织为：论点 → 论据 → 结论
        if (argumentsList.mainPoint) {
            root.children.push({
                text: '核心观点',
                children: [{
                    text: argumentsList.mainPoint,
                    children: []
                }]
            });
        }
        
        if (arguments.supports.length > 0) {
            root.children.push({
                text: '论证分析',
                children: arguments.supports.map(s => ({
                    text: s,
                    children: []
                }))
            });
        }
        
        if (arguments.conclusion) {
            root.children.push({
                text: '结论',
                children: [{
                    text: arguments.conclusion,
                    children: []
                }]
            });
        }
        
        // 如果没有提取到清晰的论证结构，回退到通用分析
        if (root.children.length === 0) {
            return this.analyzeGenericText(text, profile);
        }
        
        return root;
    }
    
    /**
     * 提取论证结构
     */
    extractArguments(text) {
        const result = {
            mainPoint: null,
            supports: [],
            conclusion: null
        };
        
        const sentences = text.split(/[。！？]+/).filter(s => s.trim());
        
        // 查找主要观点（通常包含"认为"、"观点"等词）
        for (const sentence of sentences) {
            if (/认为|主张|观点是|看法是|我们?觉得/.test(sentence)) {
                result.mainPoint = this.formatNodeText(sentence);
                break;
            }
        }
        
        // 查找支持论据
        sentences.forEach(sentence => {
            if (/因为|由于|原因是|根据|数据显示|研究表明|事实上|例如|比如/.test(sentence)) {
                const formatted = this.formatNodeText(sentence);
                if (formatted !== result.mainPoint) {
                    result.supports.push(formatted);
                }
            }
        });
        
        // 查找结论
        for (let i = sentences.length - 1; i >= Math.max(0, sentences.length - 3); i--) {
            if (/因此|所以|总之|综上|可见|说明/.test(sentences[i])) {
                result.conclusion = this.formatNodeText(sentences[i]);
                break;
            }
        }
        
        return result;
    }
    
    /**
     * 分析描述性文本
     */
    analyzeDescriptiveText(text, profile) {
        const root = {
            text: this.determineRootTopic(text, profile),
            children: []
        };
        
        // 提取描述的各个方面
        const aspects = this.extractAspects(text);
        
        aspects.forEach(aspect => {
            root.children.push({
                text: aspect.name,
                children: aspect.points.map(p => ({ text: p, children: [] }))
            });
        });
        
        // 如果没有明确的方面划分
        if (root.children.length === 0) {
            const keyPoints = this.extractKeyPoints(text);
            root.children = keyPoints.map(p => ({ text: p, children: [] }));
        }
        
        return root;
    }
    
    /**
     * 提取描述的各个方面
     */
    extractAspects(text) {
        const aspects = [];
        
        // 常见的方面类别
        const aspectPatterns = {
            '定义与概念': /(?:是指|是一种|定义为|概念是|指的是)/,
            '主要特点': /(?:特点|特征|特性|属性)(?:是|有|包括)?/,
            '组成部分': /(?:包括|包含|由.*组成|分为|构成)/,
            '应用场景': /(?:应用|用于|使用|适用|场景)/,
            '优势价值': /(?:优势|好处|价值|意义|作用|益处)/,
            '发展历程': /(?:历史|发展|演变|起源|沿革)/
        };
        
        for (const [aspectName, pattern] of Object.entries(aspectPatterns)) {
            const sentences = text.split(/[。！？\n]+/).filter(s => pattern.test(s));
            
            if (sentences.length > 0) {
                aspects.push({
                    name: aspectName,
                    points: sentences.slice(0, 3).map(s => this.formatNodeText(s))
                });
            }
        }
        
        return aspects;
    }
    
    /**
     * 分析列表型文本
     */
    analyzeListText(text, profile) {
        const root = {
            text: this.determineRootTopic(text, profile),
            children: []
        };
        
        // 提取列表项
        const listItems = this.extractListItems(text);
        
        listItems.forEach(item => {
            root.children.push({
                text: item.main,
                children: item.sub.map(s => ({ text: s, children: [] }))
            });
        });
        
        return root;
    }
    
    /**
     * 提取列表项
     */
    extractListItems(text) {
        const items = [];
        const lines = text.split('\n');
        
        let currentItem = null;
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            
            // 检查是否是主列表项
            const isMainItem = /^[\d一二三四五六七八九十]+[.、．:：)\]】]|^[-*•·]\s/.test(trimmed);
            const isSubItem = /^\s{2,}[-*•·]|^\s{4,}/.test(line);
            
            if (isMainItem) {
                if (currentItem) {
                    items.push(currentItem);
                }
                currentItem = {
                    main: trimmed.replace(/^[\d一二三四五六七八九十]+[.、．:：)\]】]\s*/, '')
                                .replace(/^[-*•·]\s*/, '')
                                .trim(),
                    sub: []
                };
            } else if (isSubItem && currentItem) {
                const subText = trimmed.replace(/^[-*•·]\s*/, '').trim();
                if (subText) {
                    currentItem.sub.push(subText);
                }
            } else if (currentItem && trimmed.length > 0) {
                // 继续之前的项
                currentItem.main += trimmed;
            }
        });
        
        if (currentItem) {
            items.push(currentItem);
        }
        
        return items;
    }
    
    /**
     * 通用文本分析
     */
    analyzeGenericText(text, profile) {
        const root = {
            text: this.determineRootTopic(text, profile),
            children: []
        };
        
        // 使用四层架构：概念 → 结构 → 细节 → 原则
        const layers = this.buildFourLayerStructure(text, profile);
        
        Object.entries(layers).forEach(([layerName, items]) => {
            if (items.length > 0) {
                root.children.push({
                    text: layerName,
                    children: items.map(item => ({
                        text: item,
                        children: []
                    }))
                });
            }
        });
        
        // 如果四层架构没有内容，使用关键点提取
        if (root.children.length === 0) {
            const keyPoints = this.extractKeyPoints(text);
            root.children = keyPoints.map(p => ({ text: p, children: [] }));
        }
        
        return root;
    }
    
    /**
     * 构建四层架构
     */
    buildFourLayerStructure(text, profile) {
        const layers = {
            '核心概念': [],
            '主要内容': [],
            '具体细节': [],
            '关键要点': []
        };
        
        const sentences = text.split(/[。！？\n]+/).filter(s => s.trim().length > 5);
        
        // 第一部分：核心概念（通常在开头）
        const conceptSentences = sentences.slice(0, Math.min(3, sentences.length));
        conceptSentences.forEach(s => {
            if (/是|指|定义|概念|本质/.test(s)) {
                layers['核心概念'].push(this.formatNodeText(s));
            }
        });
        
        // 中间部分：主要内容
        const middleSentences = sentences.slice(2, -2);
        const contentPoints = this.extractMainPoints(middleSentences.join('。'));
        layers['主要内容'] = contentPoints.slice(0, 4);
        
        // 细节：包含数据、例子
        sentences.forEach(s => {
            if (/\d+%|\d+个|\d+年|例如|比如|如：/.test(s)) {
                layers['具体细节'].push(this.formatNodeText(s));
            }
        });
        layers['具体细节'] = layers['具体细节'].slice(0, 3);
        
        // 关键要点：结尾的总结
        const endSentences = sentences.slice(-3);
        endSentences.forEach(s => {
            if (/因此|所以|总之|关键|重要|必须|需要/.test(s)) {
                layers['关键要点'].push(this.formatNodeText(s));
            }
        });
        
        // 清理空层
        Object.keys(layers).forEach(key => {
            if (layers[key].length === 0) {
                delete layers[key];
            }
        });
        
        return layers;
    }
    
    /**
     * 提取主要论点/观点
     */
    extractMainPoints(text) {
        const points = [];
        const sentences = text.split(/[。！？]+/).filter(s => s.trim().length > 8);
        
        // 优先提取有明确逻辑标记的句子
        const priorityPatterns = [
            /首先|第一/,
            /其次|第二/,
            /再次|另外|此外/,
            /最后|最终/,
            /重要的是|关键是|核心是/,
            /必须|需要|应该/
        ];
        
        priorityPatterns.forEach(pattern => {
            sentences.forEach(sentence => {
                if (pattern.test(sentence) && points.length < 5) {
                    const formatted = this.formatNodeText(sentence);
                    if (!points.includes(formatted)) {
                        points.push(formatted);
                    }
                }
            });
        });
        
        // 如果不够，补充其他句子
        if (points.length < 3) {
            const remaining = sentences
                .filter(s => !points.some(p => s.includes(p.replace('...', ''))))
                .slice(0, 5 - points.length);
            
            remaining.forEach(s => {
                points.push(this.formatNodeText(s));
            });
        }
        
        return points;
    }
    
    /**
     * 提取关键点
     */
    extractKeyPoints(text) {
        const sentences = text.split(/[。！？\n]+/).filter(s => s.trim().length > 5);
        
        // 评分并排序
        const scored = sentences.map((sentence, index) => {
            let score = 0;
            
            // 位置分数
            if (index === 0) score += 3;
            if (index === sentences.length - 1) score += 2;
            
            // 长度适中
            if (sentence.length > 10 && sentence.length < 50) score += 2;
            
            // 包含关键词
            if (/重要|关键|核心|必须|应该|需要/.test(sentence)) score += 2;
            
            // 包含动词短语
            if (/实现|提升|优化|建立|推动|促进|解决/.test(sentence)) score += 1;
            
            return { sentence, score };
        });
        
        scored.sort((a, b) => b.score - a.score);
        
        return scored
            .slice(0, 5)
            .map(item => this.formatNodeText(item.sentence));
    }
    
    /**
     * 分析内容片段
     */
    analyzeContent(content) {
        const nodes = [];
        
        // 按句子分析
        const sentences = content.split(/[。！？\n]+/).filter(s => s.trim().length > 4);
        
        // 提取要点
        const points = sentences.slice(0, 4).map(s => ({
            text: this.formatNodeText(s),
            children: []
        }));
        
        return points;
    }
    
    /**
     * 总结段落
     */
    summarizeParagraphs(paragraphs) {
        return paragraphs.map(para => {
            const sentences = para.split(/[。！？]+/).filter(s => s.trim());
            
            if (sentences.length === 0) return null;
            
            // 取第一句作为段落主旨
            const firstSentence = sentences[0];
            return this.formatNodeText(firstSentence);
        }).filter(Boolean);
    }
    
    // ==================== 工具方法 ====================
    
    /**
     * 格式化节点文本
     * 确保文本流畅、长度适中、有意义
     */
    formatNodeText(text) {
        if (!text) return '';
        
        let formatted = text.trim();
        
        // 移除开头的序号和标点
        formatted = formatted.replace(/^[\d一二三四五六七八九十]+[.、．:：)\]】]\s*/g, '');
        formatted = formatted.replace(/^[-*•·]\s*/g, '');
        formatted = formatted.replace(/^[（(【\[「『]\s*/g, '');
        
        // 移除引号
        formatted = formatted.replace(/^["「『"']\s*/g, '');
        formatted = formatted.replace(/\s*["」』"']$/g, '');
        
        // 移除句首的连接词（但保留有意义的内容）
        formatted = formatted.replace(/^(因此|所以|但是|然而|如果|虽然|不过)[，,]\s*/g, '');
        
        // 限制长度
        if (formatted.length > this.config.maxNodeTextLength) {
            // 尝试在标点处截断
            const breakPoints = [
                formatted.indexOf('，'),
                formatted.indexOf('、'),
                formatted.indexOf('；')
            ].filter(i => i > 10 && i < this.config.maxNodeTextLength);
            
            if (breakPoints.length > 0) {
                formatted = formatted.substring(0, Math.max(...breakPoints));
            } else {
                formatted = formatted.substring(0, this.config.maxNodeTextLength - 3) + '...';
            }
        }
        
        // 确保最小长度
        if (formatted.length < this.config.minNodeTextLength) {
            return '';
        }
        
        // 移除末尾的标点（除了省略号）
        formatted = formatted.replace(/[，、。！？；：]+$/g, '');
        
        return formatted;
    }
    
    /**
     * 去重短语
     */
    deduplicatePhrases(phrases) {
        const seen = new Set();
        const result = [];
        
        phrases.forEach(phrase => {
            const key = phrase.text.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                result.push(phrase);
            }
        });
        
        return result;
    }
    
    /**
     * 优化结果结构
     */
    refineResult(result) {
        // 移除空节点
        const removeEmpty = (node) => {
            if (!node.text || node.text.length < 2) {
                return null;
            }
            
            node.children = node.children
                .map(removeEmpty)
                .filter(Boolean);
            
            return node;
        };
        
        // 合并过于单薄的分支
        const mergeThin = (node) => {
            // 如果只有一个子节点，且该子节点也只有一个子节点，考虑合并
            if (node.children.length === 1 && 
                node.children[0].children.length <= 1 &&
                node.text.length + node.children[0].text.length < 40) {
                node.text = `${node.text}：${node.children[0].text}`;
                node.children = node.children[0].children;
            }
            
            node.children.forEach(mergeThin);
            return node;
        };
        
        // 限制每个节点的子节点数量
        const limitChildren = (node, maxChildren = this.config.maxChildrenPerNode) => {
            if (node.children.length > maxChildren) {
                // 保留前N-1个，最后一个合并为"其他"
                const kept = node.children.slice(0, maxChildren - 1);
                const rest = node.children.slice(maxChildren - 1);
                
                if (rest.length > 0) {
                    kept.push({
                        text: `其他${rest.length}项`,
                        children: rest
                    });
                }
                
                node.children = kept;
            }
            
            node.children.forEach(child => limitChildren(child, maxChildren));
            return node;
        };
        
        let refined = removeEmpty(result);
        if (!refined) {
            return this.createEmptyResult('分析结果为空');
        }
        
        refined = mergeThin(refined);
        refined = limitChildren(refined);
        
        return refined;
    }
    
    /**
     * 润色节点文本
     */
    polishNodeTexts(result) {
        const polish = (node) => {
            // 确保文本完整
            if (node.text) {
                node.text = this.ensureCompleteness(node.text);
            }
            
            node.children.forEach(polish);
            return node;
        };
        
        return polish(result);
    }
    
    /**
     * 确保文本完整性
     */
    ensureCompleteness(text) {
        // 如果以"的"结尾，可能是不完整的
        if (text.endsWith('的') && text.length < 10) {
            return text + '要点';
        }
        
        // 确保首字母大写（如果是英文）
        if (/^[a-z]/.test(text)) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }
        
        return text;
    }
    
    /**
     * 创建空结果
     */
    createEmptyResult(message) {
        return {
            text: message,
            children: []
        };
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextAnalyzer;
}
