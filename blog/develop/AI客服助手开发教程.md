---
id: 1010
slug: ai-customer-service-assistant
title: React + Deepseek 开发智能客服助手完全指南
authors: [bianliang]
tags: [React, TypeScript, AI, Deepseek, Docusaurus]
keywords: [AI客服, Deepseek API, React组件开发, TypeScript, Tailwind CSS]
description: 详细介绍如何使用 React、TypeScript 和 Deepseek API 开发一个智能客服助手组件，包含完整的代码实现和最佳实践
image: https://bianliangrensheng.cn/gImage/title/ai-customer-service-assistant.jpg
---

# React + Deepseek 开发智能客服助手完全指南

在这个教程中，我们将详细介绍如何使用 React、TypeScript 和 Deepseek API 开发一个智能客服助手组件。这个组件不仅界面美观，而且具有良好的交互体验和完整的功能实现。
<!-- truncate -->
:::tip 在线演示
🔗 演示地址：[智能客服助手](https://bianliangrensheng.cn/business)

可以在该页面右侧看到一个悬浮的客服图标，点击即可体验完整功能。
:::


## 1. 功能特点

### 1.1 核心功能
- 悬浮图标：固定位置显示，支持悬停动画
- 聊天对话框：优雅的弹出动画和毛玻璃效果
- AI 对话：集成 Deepseek API，提供智能问答服务
- 暗色模式：完整支持明暗主题切换

### 1.2 交互体验
- 平滑的动画效果
- 即时的用户反馈
- 优雅的加载状态
- 清晰的错误提示

## 2. 技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| React | 前端框架 | 组件化开发 |
| TypeScript | 开发语言 | 类型安全 |
| Tailwind CSS | 样式框架 | 原子化 CSS |
| Deepseek API | AI 对话 | 智能问答服务 |

## 3. 代码实现

### 3.1 项目结构
```
src/components/
├── FloatChat/
│   └── index.tsx      # 悬浮图标和对话框组件
├── DeepseekChat/
│   └── index.tsx      # AI 对话实现组件
└── utils/
    └── deepseek.ts    # Deepseek API 封装
```

### 3.2 FloatChat 组件实现

这是主要的悬浮图标和对话框组件：

```tsx
import React, { useState } from 'react';
import clsx from 'clsx';
import DeepseekChat from '@site/src/components/DeepseekChat';

export default function FloatChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 悬浮图标 */}
      <div
        className={clsx(
          'fixed top-[400px] right-[calc(50%-400px)] z-50 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg',
          { 'opacity-0': isOpen }
        )}
        onClick={() => setIsOpen(true)}
      >
        <img
          src="https://bianliangrensheng.cn/gImage/title/customer-service-beauty.jpg"
          alt="客服"
          className="w-16 h-16 rounded-full shadow-lg border-2 border-blue-100 hover:border-blue-200"
        />
      </div>

      {/* 聊天对话框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-end transition-all duration-300">
          <div className="w-[400px] bg-white dark:bg-gray-800 rounded-tl-2xl shadow-2xl transition-all duration-300 animate-slideUp">
            {/* 对话框头部 */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-tl-2xl border-b border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                  智能客服助手
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                aria-label="关闭对话框"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 欢迎消息 */}
            <div className="px-6 py-4 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                您好！我是智能客服助手，很高兴为您服务。我可以：
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  解答技术开发相关问题
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  提供项目合作咨询
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  介绍我们的服务内容
                </li>
              </ul>
            </div>

            {/* 聊天内容区域 */}
            <div className="h-[400px] overflow-y-auto bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/95">
              <DeepseekChat />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
```

### 3.3 DeepseekChat 组件实现

AI 对话的核心实现组件：

```tsx
import React, { useState } from 'react';
import { chatWithSystem } from '@site/src/utils/deepseek';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';

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
            const result = await chatWithSystem(
                input, 
                apiKey,
                '你是一个专业的技术顾问，负责解答用户关于软件开发、项目合作等方面的问题。请用简洁专业的语言回答。'
            );
            setResponse(result || '抱歉，没有得到回应');
        } catch (error: any) {
            console.error('聊天出错:', error);
            let errorMessage = '抱歉，发生了错误，请稍后再试';
            
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

    return (
        <div className="p-4 space-y-4">
            {response && (
                <div className={clsx(
                    'p-4 rounded-lg transition-all duration-300',
                    response.includes('抱歉') 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50'
                )}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">
                            AI
                        </div>
                        <h3 className="font-medium text-blue-600 dark:text-blue-400">
                            {response.includes('抱歉') ? '错误提示' : 'AI 回应'}
                        </h3>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 pl-8">
                        {response}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-blue-100 dark:border-blue-800/50">
                <div className="flex flex-col gap-2">
                    <div className="relative flex-1">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="请输入您的问题..."
                            className="w-full p-3 pr-4 border border-blue-200 dark:border-blue-700 rounded-xl min-h-[80px] max-h-[160px] bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y placeholder-gray-400 dark:placeholder-gray-500 scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgb(191 219 254) transparent'
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            按 Enter 发送消息，Shift + Enter 换行
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    思考中...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    发送
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
```

### 3.4 Deepseek API 封装

```typescript
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

function createOpenAIClient(apiKey: string) {
    return new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey,
        dangerouslyAllowBrowser: true
    });
}

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
```

## 4. 使用方法

### 4.1 配置 Deepseek API
在 `docusaurus.config.ts` 中配置 API Key：

```typescript
customFields: {
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
}
```

### 4.2 添加到页面
在需要显示客服助手的页面中引入组件：

```tsx
import FloatChat from '@site/src/components/FloatChat';

<FloatChat />
```

## 5. 设计亮点

### 5.1 UI/UX 设计
- 使用渐变色和毛玻璃效果提升视觉体验
- 添加平滑的动画过渡
- 优化暗色模式下的显示效果
- 精心设计的间距和布局

### 5.2 交互优化
- 输入框支持自适应高度
- Enter 快捷发送消息
- 清晰的加载状态反馈
- 优雅的错误提示样式

### 5.3 性能考虑
- 组件按需渲染
- 优化动画性能
- 合理的状态管理
- 防抖处理用户输入

## 6. 注意事项

:::warning 安全提示
- 生产环境中不要在前端暴露 API Key
- 建议通过后端代理调用 Deepseek API
- 注意控制 API 调用频率
:::

## 参考资源
- [Deepseek API 文档](https://platform.deepseek.com/docs)
- [React 官方文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs) 