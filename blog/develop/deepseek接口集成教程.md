---
id: 1010
slug: deepseek-api-integration-guide-docusaurus
title: DeepSeek API 集成教程：在 Docusaurus 博客中开发 AI 对话助手
authors: [bianliang]
tags: [DeepSeek, API集成, React开发, Docusaurus, AI助手, 前端开发]
keywords: [DeepSeek API,Docusaurus集成,AI对话助手,前端开发教程,React组件,API Key配置,项目实践,聊天功能实现]
description: DeepSeek API集成教程，从环境配置到完整实现，手把手教你在Docusaurus博客中开发AI对话助手。包含代码示例、性能优化和最佳实践。
image: https://bianliangrensheng.cn/gImage/title/deepseek-Integration-hub.jpg
---

#  DeepSeek API 集成教程：在 Docusaurus 博客中开发 AI 对话助手

在这个最新的 DeepSeek API 集成教程中，我将详细介绍如何在 Docusaurus 博客中开发 AI 对话助手。本教程基于实际项目实践，包含完整的代码示例和实现步骤。

<!-- truncate -->

## 1. 基础环境准备

### 1.1 安装依赖
首先需要安装必要的依赖包：

```bash
pnpm add openai
```

### 1.2 项目结构
我们需要创建以下文件：

```
src/
  ├── components/
  │   └── DeepseekChat/
  │       └── index.tsx      # 聊天组件
  ├── utils/
  │   └── deepseek.ts       # DeepSeek 工具类
  └── pages/
      └── ai-chat.tsx       # AI 聊天页面
```

## 2. 核心代码实现

### 2.1 DeepSeek 工具类
在 `src/utils/deepseek.ts` 中实现 DeepSeek API 的调用：

```typescript
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// 创建 OpenAI 客户端工厂函数
function createOpenAIClient(apiKey: string) {
    return new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey,
        dangerouslyAllowBrowser: true // 警告：这种方式在生产环境中不安全
    });
}

// 基本的聊天完成函数
export async function chatWithDeepseek(
    messages: ChatCompletionMessageParam[],
    apiKey: string,
    model: string = 'deepseek-chat'
) {
    const openai = createOpenAIClient(apiKey);

    try {
        const completion = await openai.chat.completions.create({
            messages,
            model,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Deepseek API 调用错误:', error);
        throw error;
    }
}

// 使用系统预设的聊天函数
export async function chatWithSystem(
    content: string,
    apiKey: string,
    systemPrompt: string = 'You are a helpful assistant.'
) {
    const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
    ];
    
    return chatWithDeepseek(messages, apiKey);
}
```

### 2.2 聊天组件
在 `src/components/DeepseekChat/index.tsx` 中实现聊天界面：

```typescript
import React, { useState } from 'react';
import { chatWithSystem } from '@site/src/utils/deepseek';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DeepseekChat() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const {siteConfig} = useDocusaurusContext();
    const apiKey = siteConfig.customFields?.deepseekApiKey as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !apiKey) return;

        setLoading(true);
        try {
            const result = await chatWithSystem(input, apiKey);
            setResponse(result || '抱歉，没有得到回应');
        } catch (error: any) {
            console.error('聊天出错:', error);
            let errorMessage = '抱歉，发生了错误，请稍后再试';
            
            // 处理特定错误类型
            if (error?.message?.includes('402 Insufficient Balance')) {
                errorMessage = '抱歉，API 账户余额不足，请联系管理员充值。';
            } else if (error?.message?.includes('429')) {
                errorMessage = '请求太频繁，请稍后再试。';
            } else if (error?.message?.includes('401')) {
                errorMessage = 'API Key 无效，请检查配置。';
            }
            
            setResponse(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!apiKey) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4">
                <p className="text-red-500">API Key 未配置，请检查网站配置。</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="请输入你的问题..."
                    className="w-full p-2 border rounded-lg min-h-[100px] bg-white dark:bg-gray-800"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? '正在思考...' : '发送'}
                </button>
            </form>

            {response && (
                <div className={`p-4 rounded-lg ${response.includes('抱歉') ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-900'}`}>
                    <h3 className="font-bold mb-2">{response.includes('抱歉') ? '错误提示：' : 'AI 回应：'}</h3>
                    <p className="whitespace-pre-wrap">{response}</p>
                </div>
            )}
        </div>
    );
}
```

### 2.3 AI 聊天页面
在 `src/pages/ai-chat.tsx` 中创建页面：

```typescript
import React from 'react';
import Layout from '@theme/Layout';
import DeepseekChat from '@site/src/components/DeepseekChat';

export default function AiChat() {
    return (
        <Layout
            title="AI 助手"
            description="与 AI 助手进行对话"
        >
            <main className="container margin-vert--lg">
                <h1 className="text-3xl font-bold text-center mb-8">AI 助手</h1>
                <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
                    这是一个基于 Deepseek 的 AI 助手，可以回答你的问题、提供建议和帮助。
                </p>
                <DeepseekChat />
            </main>
        </Layout>
    );
}
```

## 3. Docusaurus 配置

### 3.1 配置 API Key
在 `docusaurus.config.ts` 中添加 DeepSeek API Key：

```typescript
const config: Config = {
  // ... 其他配置
  customFields: {
    bio: '无论前路如何，探索与学习是我不断进化的动力',
    description: '这里是一片探索技术的乐园...',
    deepseekApiKey: 'your-api-key-here',
  },
  // ... 其他配置
};
```

### 3.2 添加导航菜单
在 `docusaurus.config.ts` 的 `navbar.items` 中添加 AI 助手菜单：

```typescript
navbar: {
  items: [
    // ... 其他菜单项
    { label: 'AI助手', position: 'right', to: 'ai-chat' },
  ],
}
```

## 4. 安全注意事项

:::warning 安全警告
当前实现方式将 API Key 暴露在前端，这在生产环境中是不安全的。在实际生产环境中，建议：

1. 创建后端 API 服务来代理 DeepSeek API 调用
2. 在后端安全存储 API Key
3. 实现请求频率限制和用户认证
4. 添加内容审核机制
:::

## 5. 错误处理
当前实现已经包含了以下错误处理：

1. API Key 未配置的提示
2. 402 余额不足的错误提示
3. 429 请求频率限制的错误提示
4. 401 API Key 无效的错误提示
5. 其他通用错误的提示

## 6. 样式适配
组件已经支持：

1. 响应式布局
2. 深色模式适配
3. 错误状态的样式区分
4. 加载状态的显示

## 7. 常见问题

### Q: 为什么会遇到 402 Insufficient Balance 错误？
A: 这表示你的 DeepSeek API 账户余额不足，需要在 DeepSeek 平台充值后才能继续使用。

### Q: 为什么在浏览器中调用 API 会有安全警告？
A: 这是因为在浏览器中直接使用 API Key 是不安全的。我们使用了 `dangerouslyAllowBrowser: true` 选项来允许浏览器端调用，但这仅适用于开发环境。

### Q: 如何实现更安全的部署方案？
A: 建议创建一个后端服务来代理 API 调用，将 API Key 安全地存储在服务器端。

## 8. 参考资源

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [OpenAI SDK 文档](https://github.com/openai/openai-node)
- [Docusaurus 文档](https://docusaurus.io/)
