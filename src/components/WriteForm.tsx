'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@headlessui/react';
import { format } from 'date-fns';

export default function WriteForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
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

  const handleNext = () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2 && isStep2Valid()) {
      // TODO: 处理表单提交
      router.push('/letters');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? '基本信息' : '当前抉择'}
          </h2>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            {/* 称呼 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                您的称呼
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="请输入您想要的称呼"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <RadioGroup value={formData.gender} onChange={value => setFormData(prev => ({ ...prev, gender: value }))}>
                <div className="flex space-x-4">
                  {['male', 'female'].map((gender) => (
                    <RadioGroup.Option
                      key={gender}
                      value={gender}
                      className={({ checked }) =>
                        `${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}
                         relative flex cursor-pointer rounded-lg border p-2 focus:outline-none`
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
                              {gender === 'male' ? '男' : '女'}
                            </RadioGroup.Label>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* 出生日期 */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                出生日期
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 选项一 */}
            <div>
              <label htmlFor="optionA" className="block text-sm font-medium text-gray-700">
                选项一
              </label>
              <input
                type="text"
                id="optionA"
                name="optionA"
                value={formData.optionA}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="请描述您的第一个选择"
              />
            </div>

            {/* 选项二 */}
            <div>
              <label htmlFor="optionB" className="block text-sm font-medium text-gray-700">
                选项二
              </label>
              <input
                type="text"
                id="optionB"
                name="optionB"
                value={formData.optionB}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="请描述您的第二个选择"
              />
            </div>

            {/* 背景信息 */}
            <div>
              <label htmlFor="background" className="block text-sm font-medium text-gray-700">
                背景信息
              </label>
              <textarea
                id="background"
                name="background"
                value={formData.background}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="请描述一下您当前面临的具体情况..."
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              上一步
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={(step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid())}
            className={`${
              step === 1 ? 'w-full' : ''
            } px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {step === 1 ? '下一步' : '生成信件'}
          </button>
        </div>
      </div>
    </div>
  );
}