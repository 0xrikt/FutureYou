// app/letters/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, SwitchCamera } from 'lucide-react';

interface Letters {
  letterA: string;
  letterB: string;
}

export default function LettersPage() {
  const router = useRouter();
  const [letters, setLetters] = useState<Letters | null>(null);
  const [showLetter, setShowLetter] = useState<'A' | 'B'>('A');
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    // 从 localStorage 获取信件内容
    const storedLetters = localStorage.getItem('letters');
    if (!storedLetters) {
      router.push('/write');
      return;
    }
    
    try {
      const parsedLetters = JSON.parse(storedLetters);
      
      // 验证数据格式
      if (!parsedLetters || !parsedLetters.letterA || !parsedLetters.letterB || 
          typeof parsedLetters.letterA !== 'string' || typeof parsedLetters.letterB !== 'string') {
        console.error('Invalid letter format:', parsedLetters);
        router.push('/write');
        return;
      }

      setLetters(parsedLetters);
      
      // 自动开始拆信动画
      setTimeout(() => {
        setIsOpening(false);
      }, 2000);
    } catch (error) {
      console.error('Error parsing letters:', error);
      router.push('/write');
    }
  }, [router]);

  // 显示加载状态
  if (!letters) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Mail className="h-8 w-8 text-blue-500" />
        </div>
      </div>
    );
  }

  // 分割文本为段落，并确保返回一个字符串数组
  const splitTextToParagraphs = (text: string): string[] => {
    if (!text) return [''];
    return text.split('\n').filter(paragraph => paragraph.trim() !== '');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/')}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </button>

        <AnimatePresence>
          {isOpening ? (
            // 拆信动画
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="flex items-center justify-center h-[60vh]"
            >
              <div className="text-center">
                <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-bounce" />
                <p className="text-lg text-gray-600">正在拆开来自未来的信...</p>
              </div>
            </motion.div>
          ) : (
            // 信件内容
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-xl p-8">
                {/* 切换按钮 */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {showLetter === 'A' ? '选择A后的未来' : '选择B后的未来'}
                  </h1>
                  <button
                    onClick={() => setShowLetter(prev => prev === 'A' ? 'B' : 'A')}
                    className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <SwitchCamera className="h-4 w-4 mr-2" />
                    查看{showLetter === 'A' ? '另一个' : '上一个'}未来
                  </button>
                </div>

                {/* 信件内容 */}
                <motion.div
                  key={showLetter}
                  initial={{ opacity: 0, x: showLetter === 'A' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg max-w-none"
                >
                  {splitTextToParagraphs(showLetter === 'A' ? letters.letterA : letters.letterB)
                    .map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}