// components/InfoDialog.tsx
import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';

interface InfoDialogProps {
  isOpen: boolean;
  question: string;
  reason: string;
  onSubmit: (answer: string) => void;
  onSkip: () => void;
  isLoading: boolean;
}

export function InfoDialog({ 
  isOpen, 
  question,
  reason,
  onSubmit, 
  onSkip, 
  isLoading 
}: InfoDialogProps) {
  const [answer, setAnswer] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
        {/* 关闭按钮 */}
        <div className="flex justify-end">
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-500"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
          <p className="text-sm text-blue-800 font-light">
            提供的信息越详细，推演的未来越准确。
          </p>
        </div>

        {/* 问题输入区 */}
        <div>
          <p className="text-gray-700 mb-2 font-light">{question}</p>
          <textarea
            className="w-full min-h-[120px] p-3 border rounded-md 
                     text-gray-700 placeholder-gray-400 font-light
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="写下你的回答..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* 按钮组 */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-light
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            跳过
          </button>
          <button
            onClick={() => {
              if (answer.trim()) {
                onSubmit(answer);
                setAnswer('');
              }
            }}
            className="flex items-center justify-center px-4 py-2 
                     bg-blue-600 text-white rounded-md font-light
                     hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     min-w-[100px]"
            disabled={isLoading || !answer.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              '提交回答'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}