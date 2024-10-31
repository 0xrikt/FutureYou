'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BackgroundDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute -left-24 -top-24 w-96 h-96 text-blue-100" viewBox="0 0 100 100">
      <motion.path
        d="M50,10 Q10,50 50,90 T50,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </svg>
    
    <svg className="absolute -right-24 -bottom-24 w-96 h-96 text-blue-100" viewBox="0 0 100 100">
      <motion.path
        d="M10,50 Q50,10 90,50 T10,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

const PathIllustration = () => (
  <motion.div 
    className="relative h-32 mx-auto my-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.5 }}
  >
    <svg className="w-full h-full text-blue-600/20" viewBox="0 0 200 100">
      <motion.path
        d="M20,50 L80,50 L80,20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M80,50 L80,80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      <motion.circle 
        cx="20" cy="50" r="3" 
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.circle 
        cx="80" cy="20" r="3" 
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      />
      <motion.circle 
        cx="80" cy="80" r="3" 
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      />
    </svg>
  </motion.div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden relative">
      <BackgroundDecoration />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 relative">
        <motion.div 
          className="max-w-2xl mx-auto text-center space-y-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 标题 */}
          <motion.div className="text-center">
            <p className="text-gray-500 text-lg tracking-wide font-light">
              未选择的路
              <span className="mx-2 opacity-50">·</span>
              对话十年后的自己
            </p>
          </motion.div>

          {/* 主要内容 */}
          <motion.div className="space-y-16">
            <div className="space-y-16">
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                "黄色的树林里分出两条路，
                <br />
                可惜我不能同时去涉足..."
              </p>

              <PathIllustration />

              <p className="text-2xl text-gray-800 font-light leading-relaxed">
                穿越时空，对话十年后的自己，
                <br />
                看不同选择会将你带向何方
              </p>
            </div>

            <a 
              href="/write"
              className="inline-flex items-center px-8 py-3 text-lg text-white bg-blue-600 
                        rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-0.5 
                        transition-all duration-150 font-light tracking-wide"
            >
              开启对话
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}