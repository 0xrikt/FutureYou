// components/WriteForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@headlessui/react';
import { Loader2, User, CalendarDays, GitFork, FileText } from 'lucide-react';
import { AIService } from '@/lib/ai';
import { InfoDialog } from './InfoDialog';

const defaultYear = '1995';
const yearOptions = Array.from({ length: 81 }, (_, i) => (1940 + i).toString());
const MAX_DIALOG_ROUNDS = 5;  // 最大对话轮数

export default function WriteForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentReason, setCurrentReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [dialogRounds, setDialogRounds] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthYear: defaultYear,
    optionA: '',
    optionB: '',
    background: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isStep1Valid = () => {
    return formData.name && formData.gender && formData.birthYear;
  };

  const isStep2Valid = () => {
    return formData.optionA && formData.optionB && formData.background;
  };

  const generateLettersAndNavigate = () => {
    localStorage.removeItem('letters');
    localStorage.removeItem('options');
    
    localStorage.setItem('options', JSON.stringify({
      optionA: formData.optionA,
      optionB: formData.optionB
    }));
    
    router.push('/letters');
    
    AIService.generateLetters(formData, additionalInfo)
      .then(letters => {
        // 确保信件和选项一一对应
        const lettersData = {
          letterA: letters.letterA,  // letterA对应选项A
          letterB: letters.letterB   // letterB对应选项B
        };
        localStorage.setItem('letters', JSON.stringify(lettersData));
      })
      .catch(error => {
        console.error('Error generating letters:', error);
        router.push('/write');
      });
  };

  const handleDialogSubmit = async (answer: string) => {
    setIsLoading(true);
    
    // 检查是否达到最大对话轮数
    if (dialogRounds >= MAX_DIALOG_ROUNDS - 1) {
      // 如果已经达到最大轮数，直接生成信件
      const newInfo = `${additionalInfo}\n问：${currentQuestion}\n答：${answer}`;
      setAdditionalInfo(newInfo);
      setIsDialogOpen(false);
      generateLettersAndNavigate();
      return;
    }

    try {
      const newInfo = `${additionalInfo}\n问：${currentQuestion}\n答：${answer}`;
      setAdditionalInfo(newInfo);
      
      const result = await AIService.collectMoreInfo(
        formData.background,
        currentQuestion,
        answer
      );

      setDialogRounds(prev => prev + 1);

      if (!result.sufficient && result.question && dialogRounds < MAX_DIALOG_ROUNDS - 1) {
        setCurrentQuestion(result.question);
        setIsLoading(false);
      } else {
        setIsDialogOpen(false);
        generateLettersAndNavigate();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('发生错误，请稍后重试');
      setIsLoading(false);
    }
  };

  const handleDialogSkip = () => {
    setIsDialogOpen(false);
    generateLettersAndNavigate();
  };

  const handleNext = async () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2 && isStep2Valid()) {
      setIsLoading(true);
      try {
        const result = await AIService.checkBackgroundInfo(formData.background);
        
        if (!result.sufficient && result.questions?.length) {
          setDialogRounds(0);  // 重置对话轮数
          setCurrentQuestion(result.questions[0]);
          setCurrentReason(result.reason);
          setIsDialogOpen(true);
          setIsLoading(false);
        } else {
          generateLettersAndNavigate();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('发生错误，请稍后重试');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8 space-y-8">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center text-sm text-gray-700 font-light">
                <User className="w-4 h-4 mr-2" />
                称呼
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 
                         text-gray-900 placeholder-gray-400 font-light
                         focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="输入你喜欢的称呼"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-sm text-gray-700 font-light">
                性别
              </label>
              <RadioGroup 
                value={formData.gender} 
                onChange={value => setFormData(prev => ({ ...prev, gender: value }))}
                className="flex space-x-4"
              >
                {['male', 'female'].map((gender) => (
                  <RadioGroup.Option
                    key={gender}
                    value={gender}
                    className={({ checked }) =>
                      `${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:border-blue-400'}
                       relative flex cursor-pointer rounded-lg border p-3 focus:outline-none transition-colors duration-200`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex w-16 items-center justify-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-light ${checked ? 'text-blue-900' : 'text-gray-900'}`}
                          >
                            {gender === 'male' ? '男生' : '女生'}
                          </RadioGroup.Label>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <label htmlFor="birthYear" className="flex items-center text-sm text-gray-700 font-light">
                <CalendarDays className="w-4 h-4 mr-2" />
                出生年份
              </label>
              <select
                id="birthYear"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 
                         text-gray-900 font-light bg-white
                         focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <GitFork className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-900 font-light">两个选择</span>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="optionA" className="block text-sm text-gray-700 font-light">
                  选择一
                </label>
                <input
                  type="text"
                  id="optionA"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 
                           text-gray-900 placeholder-gray-400 font-light
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="简单概括第一个选择"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="optionB" className="block text-sm text-gray-700 font-light">
                  选择二
                </label>
                <input
                  type="text"
                  id="optionB"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 
                           text-gray-900 placeholder-gray-400 font-light
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="简单概括第二个选择"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="background" className="flex items-center text-sm text-gray-700 font-light">
                  <FileText className="w-4 h-4 mr-2" />
                  展开聊聊
                </label>
                
                {/* 提示说明 */}
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  <p className="text-sm text-gray-600 font-light">比如可以聊聊：</p>
                  <ul className="text-sm text-gray-600 space-y-1 pl-4 font-light">
                    <li>• 目前的生活状态和心情</li>
                    <li>• 为什么会面临这个选择</li>
                    <li>• 每个选项的好处和坏处</li>
                    <li>🐱 想到什么说什么就好</li>
                  </ul>
                </div>
              </div>

              <textarea
                id="background"
                name="background"
                value={formData.background}
                onChange={handleInputChange}
                rows={6}
                className="w-full rounded-md border border-gray-300 px-4 py-3 
                         text-gray-900 font-light
                         focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm text-gray-700 bg-white border 
                       border-gray-300 rounded-md hover:bg-gray-50 font-light
                       focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500 transition-colors duration-200"
            >
              返回
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading || (step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid())}
            className={`${
              step === 1 ? 'w-full' : ''
            } inline-flex items-center justify-center px-6 py-2 text-sm 
               text-white bg-blue-600 rounded-md hover:bg-blue-700 font-light
               focus:outline-none focus:ring-2 focus:ring-offset-2 
               focus:ring-blue-500 disabled:opacity-50 
               disabled:cursor-not-allowed transition-colors duration-200 
               min-w-[120px]`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              step === 1 ? '下一步' : '看看两种未来中的自己'
            )}
          </button>
        </div>
      </div>

      <InfoDialog
        isOpen={isDialogOpen}
        question={currentQuestion}
        reason={currentReason}
        onSubmit={handleDialogSubmit}
        onSkip={handleDialogSkip}
        isLoading={isLoading}
      />
    </div>
  );
}