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