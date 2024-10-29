'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@headlessui/react';
import { Loader2, User, CalendarDays, GitFork, FileText } from 'lucide-react';
import { AIService } from '@/lib/ai';
import { InfoDialog } from './InfoDialog';

const defaultDate = '1995-01-01';

export default function WriteForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentReason, setCurrentReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: defaultDate,
    optionA: '',
    optionB: '',
    background: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isStep1Valid = () => {
    return formData.name && formData.gender && formData.birthDate;
  };

  const isStep2Valid = () => {
    return formData.optionA && formData.optionB && formData.background;
  };

  const handleNext = async () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2 && isStep2Valid()) {
      setIsLoading(true);
      try {
        const result = await AIService.checkBackgroundInfo(formData.background);
        
        if (!result.sufficient && result.questions?.length) {
          setCurrentQuestion(result.questions[0]);
          setCurrentReason(result.reason);
          setIsDialogOpen(true);
        } else {
          await generateAndNavigate();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('发生错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDialogSubmit = async (answer: string) => {
    setIsLoading(true);
    try {
      const newInfo = `${additionalInfo}\n问：${currentQuestion}\n答：${answer}`;
      setAdditionalInfo(newInfo);
      
      const result = await AIService.collectMoreInfo(
        formData.background,
        currentQuestion,
        answer
      );

      if (!result.sufficient && result.question) {
        setCurrentQuestion(result.question);
      } else {
        setIsDialogOpen(false);
        await generateAndNavigate();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('发生错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogSkip = async () => {
    setIsDialogOpen(false);
    await generateAndNavigate();
  };

  const generateAndNavigate = async () => {
    try {
      const letters = await AIService.generateLetters(formData, additionalInfo);
      localStorage.setItem('letters', JSON.stringify(letters));
      router.push('/letters');
    } catch (error) {
      console.error('Error generating letters:', error);
      alert('生成信件时发生错误，请稍后重试');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8 space-y-8">
        {step === 1 ? (
          <div className="space-y-6">
            {/* 称呼 */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                <User className="w-4 h-4 mr-2" />
                称呼
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="输入你喜欢的称呼"
              />
            </div>

            {/* 性别 */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
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
                            className={`font-medium ${
                              checked ? 'text-blue-900' : 'text-gray-900'
                            }`}
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

            {/* 出生日期 */}
            <div className="space-y-2">
              <label htmlFor="birthDate" className="flex items-center text-sm font-medium text-gray-700">
                <CalendarDays className="w-4 h-4 mr-2" />
                出生年月
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 选项区域 */}
            <div className="space-y-4">
              <div className="flex items-center">
                <GitFork className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">两个选择</span>
              </div>
              
              {/* 选项一 */}
              <div className="space-y-2">
                <label htmlFor="optionA" className="block text-sm font-medium text-gray-700">
                  选择一
                </label>
                <input
                  type="text"
                  id="optionA"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="简单概括第一个选择"
                />
              </div>

              {/* 选项二 */}
              <div className="space-y-2">
                <label htmlFor="optionB" className="block text-sm font-medium text-gray-700">
                  选择二
                </label>
                <input
                  type="text"
                  id="optionB"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="简单概括第一个选择"
                />
              </div>
            </div>

            {/* 背景信息 */}
            <div className="space-y-2">
              <label htmlFor="background" className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2" />
                展开聊聊
              </label>
              <textarea
                id="background"
                name="background"
                value={formData.background}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="描述你目前的生活状态，为什么会面临这个选择？什么因素让你觉得难以决定？……"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              返回
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={(step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid()) || isLoading}
            className={`${
              step === 1 ? 'w-full' : ''
            } inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              step === 1 ? '下一步' : '生成两种未来'
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