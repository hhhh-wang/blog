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
            <div className="p-4">
                <p className="text-red-500">API Key 未配置，请检查网站配置。</p>
            </div>
        );
    }

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