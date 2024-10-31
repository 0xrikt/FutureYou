// components/LetterDisplay.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LOADING_MESSAGES = [
  "AI 正在分析现状……🔍",
  "是个棘手的选择……🤔️",
  "尝试模拟第一种人生 🧪",
  "尝试模拟第二种人生 ⚛️",
  "又或许没有非黑即白的选择 ♟️",
  "几位AI召开了联合会议 💬",
  "等待的时间可能有点久 🥚",
  "已经联系到十年后的你 🎙️",
  "就快好了 🚄",
  "贴上邮票 ✉️",
  "想象更多的可能……☁️"
];

const NavigationBar = ({ 
  onBack, 
  backText = "返回首页"
}: { 
  onBack: () => void;
  backText?: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm"
  >
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
      <button
        onClick={onBack}
        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-light"
      >
        <ChevronLeft className="h-5 w-5 mr-2" />
        <span className="text-sm">{backText}</span>
      </button>
    </div>
  </motion.div>
);

const LoadingState = () => {
  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = LOADING_MESSAGES.indexOf(prev);
        return LOADING_MESSAGES[(currentIndex + 1) % LOADING_MESSAGES.length];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center space-y-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Mail className="h-16 w-16 text-blue-500 mx-auto" />
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-gray-600 font-light"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

const LetterEnvelope = ({ 
  isOpen, 
  onClick, 
  title, 
  disabled 
}: { 
  isOpen: boolean; 
  onClick: () => void; 
  title: string;
  disabled: boolean;
}) => (
  <motion.div
    className={`relative cursor-pointer ${disabled ? 'opacity-50' : ''}`}
    whileHover={!disabled ? { scale: 1.05 } : {}}
    onClick={!disabled ? onClick : undefined}
  >
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <Mail 
        className={`h-12 w-12 mx-auto mb-4 ${isOpen ? 'text-blue-300' : 'text-blue-600'}`} 
      />
      <h3 className="text-sm text-gray-900 mb-2 font-light">
        {title}
      </h3>
      <p className="text-xs text-gray-500 font-light">
        {isOpen ? '已打开' : '点击打开'}
      </p>
    </div>
  </motion.div>
);

const LetterContent = ({ 
    content,
    onClose,
    isFirstLetter,
    bothLettersRead
  }: { 
    content: string;
    onClose: () => void;
    isFirstLetter: boolean;
    bothLettersRead: boolean;
  }) => {
    const handleClose = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        onClose();
      }, 100);
    };
  
    return (
      <div className="pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto"
        >
          <div className="max-w-none">
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed font-light mb-4">
                {paragraph}
              </p>
            ))}
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 pt-4 border-t border-gray-100"
            >
              <button
                onClick={handleClose}
                className="text-blue-600 hover:text-blue-700 flex items-center justify-center w-full font-light"
              >
                {bothLettersRead ? (
                  <>
                    <span>查看彩蛋</span>
                    <span className="ml-1">🌟</span>
                  </>
                ) : isFirstLetter ? (
                  "查看另一种选择"
                ) : null}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };
  
  const FinalLetter = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-2xl mx-auto mt-12 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100" />
      <div className="absolute -left-4 top-8 w-24 h-24 rounded-full bg-blue-50/30" />
      <div className="absolute -right-4 bottom-8 w-32 h-32 rounded-full bg-blue-50/30" />
      
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" 
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 30px)',
               backgroundSize: '100% 30px'
             }}
        />
      </div>
  
      <div className="relative space-y-8">
        <div className="space-y-6">
          <p className="text-xl text-gray-800 tracking-wide font-light">
            🌟 感谢你看到这里。
          </p>
          <div className="space-y-4 text-gray-700 leading-loose tracking-wide font-light">
            <p>没人能预测你的未来，包括AI。</p>
            <p>这是一场沙盘演习，一次思维实验，希望能提供新的视角来看待当下。</p>
            <p>你的未来始终在你手中。</p>
            <div className="flex justify-end mt-8">
              <div className="w-16 h-16 rounded-full border-2 border-red-300/20 flex items-center justify-center">
                <span className="text-red-400/60 text-sm tracking-wider rotate-12">
                  AISELF
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <div className="flex items-center justify-center space-x-4 my-4">
          <div className="h-px w-16 bg-gray-200" />
          <div className="text-blue-400">❋</div>
          <div className="h-px w-16 bg-gray-200" />
        </div>
  
        <div className="pt-2">
          <motion.div 
            className="text-gray-600 leading-loose tracking-wide text-center font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>黄色的树林里分出两条路</p>
            <p>可惜我不能同时去涉足</p>
            <p>而我选择了人迹罕至的那一条</p>
            <p>从此决定了我一生的道路</p>
            <p className="text-sm text-gray-500 mt-4 tracking-wider">
              ——《未选择的路》Robert Frost
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
  
  export default function LetterDisplay() {
    const router = useRouter();
    const [letters, setLetters] = useState<{
      letterA: string;
      letterB: string;
      optionA: string;
      optionB: string;
    } | null>(null);
    const [openLetter, setOpenLetter] = useState<'A' | 'B' | null>(null);
    const [readLetters, setReadLetters] = useState<Set<'A' | 'B'>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [firstReadLetter, setFirstReadLetter] = useState<'A' | 'B' | null>(null);
  
    useEffect(() => {
      const checkLetters = () => {
        const storedData = localStorage.getItem('letters');
        const options = localStorage.getItem('options');
        
        if (!storedData || !options) {
          return false;
        }
        
        try {
          const parsedLetters = JSON.parse(storedData);
          const parsedOptions = JSON.parse(options);
          
          if (!parsedLetters?.letterA || !parsedLetters?.letterB) {
            return false;
          }
          
          setLetters({
            ...parsedLetters,
            optionA: parsedOptions.optionA,
            optionB: parsedOptions.optionB
          });
          
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          
          return true;
        } catch (error) {
          console.error('Error parsing stored data:', error);
          return false;
        }
      };
  
      const interval = setInterval(() => {
        if (checkLetters()) {
          clearInterval(interval);
        }
      }, 1000);
  
      const timeout = setTimeout(() => {
        if (!letters) {
          router.push('/write');
        }
      }, 100000);
  
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }, [router, letters]);
  
    const handleOpenLetter = (letter: 'A' | 'B') => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (!firstReadLetter) {
        setFirstReadLetter(letter);
      }
      setOpenLetter(letter);
      setReadLetters(prev => new Set(prev).add(letter));
    };
  
    if (isLoading) {
      return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
          <NavigationBar 
            onBack={() => router.push('/')}
            backText="返回首页"
          />
          <div className="max-w-4xl mx-auto pt-16">
            <LoadingState />
          </div>
        </main>
      );
    }
  
    if (!letters) {
      return null;
    }
  
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <NavigationBar 
          onBack={() => {
            if (openLetter) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                setOpenLetter(null);
              }, 100);
            } else {
              router.push('/');
            }
          }}
          backText={openLetter ? "返回信封" : "返回首页"}
        />
  
        <div className="max-w-6xl mx-auto pt-16">
          <AnimatePresence mode="wait">
            {!openLetter ? (
              <>
                <motion.h1 
                  className="text-2xl text-gray-800 text-center mb-12 font-light tracking-wide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  来自2034年的两封信
                </motion.h1>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <LetterEnvelope
                    isOpen={readLetters.has('A')}
                    onClick={() => handleOpenLetter('A')}
                    title={`选择一：${letters.optionA}`}
                    disabled={false}
                  />
                  <LetterEnvelope
                    isOpen={readLetters.has('B')}
                    onClick={() => handleOpenLetter('B')}
                    title={`选择二：${letters.optionB}`}
                    disabled={false}
                  />
                </div>
              </>
            ) : (
              <LetterContent
                content={openLetter === 'A' ? letters.letterA : letters.letterB}
                onClose={() => setOpenLetter(null)}
                isFirstLetter={firstReadLetter === openLetter}
                bothLettersRead={readLetters.size === 2}
              />
            )}
          </AnimatePresence>
  
          {readLetters.size === 2 && !openLetter && <FinalLetter />}
        </div>
      </main>
    );
  }