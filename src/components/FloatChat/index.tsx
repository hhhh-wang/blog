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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
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