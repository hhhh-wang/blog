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