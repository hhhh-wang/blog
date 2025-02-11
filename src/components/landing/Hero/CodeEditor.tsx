import { motion } from 'framer-motion'
import React from 'react'

const lines = [
  { content: "import React from 'react';", color: 'text-gray-700 dark:text-gray-200', indent: 0 },
  { content: '// Define component', color: 'text-emerald-600', indent: 0 },
  { content: 'const App = () => {', color: 'text-blue-600', indent: 0 },
  { content: 'return (', color: 'text-purple-600', indent: 1 },
  { content: '<div className="app">', color: 'text-emerald-600', indent: 2 },
  { content: '<h1>Hello World</h1>', color: 'text-red-600', indent: 3 },
  { content: '</div>', color: 'text-emerald-600', indent: 2 },
  { content: ');', color: 'text-purple-600', indent: 1 },
  { content: '};', color: 'text-blue-600', indent: 0 },
  { content: 'export default App;', color: 'text-gray-700 dark:text-gray-200', indent: 0 }
]

export default function CodeEditor() {
  return (
    <div className="relative w-full max-w-3xl mt-20 mr-[-20px]">
      {/* 编辑器背景 - 调整暗色模式的背景色和透明度 */}
      <div className="rounded-lg bg-white/70 shadow-lg backdrop-blur-sm dark:bg-gray-900/50 dark:backdrop-blur-md">
        {/* 标题栏 - 保持渐变色但调整暗色模式下的透明度 */}
        <div className="flex h-9 items-center rounded-t-lg bg-gradient-to-r from-blue-400/90 to-blue-500/90 dark:from-blue-500/70 dark:to-blue-600/70 px-4">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600" />
            <div className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
            <div className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600" />
          </div>
          <span className="ml-4 text-sm text-white">main.tsx</span>
        </div>

        {/* 代码区域 - 添加最大高度和滚动条 */}
        <div className="max-h-[420px] overflow-y-auto">
          <div className="grid grid-cols-[auto,1fr] gap-4 p-6 font-code text-[14px]">
            {/* 行号 - 调整暗色模式下的颜色 */}
            <div className="flex flex-col space-y-[0.4em] text-right text-gray-400 dark:text-gray-500 select-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i + 1}>{i + 1}</span>
              ))}
            </div>

            {/* 代码内容 */}
            <div className="flex flex-col space-y-[0.4em]">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.3,
                    ease: 'easeOut',
                  }}
                  className={`${line.color}`}
                  style={{ 
                    paddingLeft: `${line.indent * 1}rem`
                  }}
                >
                  {line.content}
                </motion.div>
              ))}
              {/* 空行 */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-[1.2em]">&nbsp;</div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部状态栏 - 调整暗色模式下的边框和文字颜色 */}
        <div className="flex h-7 items-center space-x-4 border-t border-gray-200/10 dark:border-gray-700/30 px-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Ln 6, Col 12</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
      </div>

      {/* 装饰元素 - 调整暗色模式下的颜色和模糊效果 */}
      <motion.div
        className="absolute -z-10 h-[500px] w-[500px] -right-32 -top-32 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl dark:blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
} 