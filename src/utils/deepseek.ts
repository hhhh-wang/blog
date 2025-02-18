import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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