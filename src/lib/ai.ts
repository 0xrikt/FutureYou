// lib/ai.ts

import { ZhipuAIResponse } from '@/types';

const ZHIPU_API_KEY = 'Bearer d2f09bbcf48584db02e6bbeac6d01f81.5z7u0mZWUk8jij8X';
const API_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export class AIService {
  private static async makeRequest(messages: any[]) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ZHIPU_API_KEY
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 4096,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: ZhipuAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('与AI服务通信时出现错误');
    }
  }

  private static cleanJsonResponse(response: string): string {
    try {
      // 移除可能的 Markdown 代码块标记
      let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // 移除可能的开头和结尾空白字符
      cleaned = cleaned.trim();
      
      // 如果响应不是以 { 开始，尝试找到第一个 {
      const firstBrace = cleaned.indexOf('{');
      if (firstBrace > 0) {
        cleaned = cleaned.slice(firstBrace);
      }
      
      // 如果响应不是以 } 结束，尝试找到最后一个 }
      const lastBrace = cleaned.lastIndexOf('}');
      if (lastBrace !== -1 && lastBrace !== cleaned.length - 1) {
        cleaned = cleaned.slice(0, lastBrace + 1);
      }

      // 验证是否为有效的 JSON
      const parsed = JSON.parse(cleaned);
      return cleaned;
    } catch (error) {
      console.error('Error cleaning JSON response:', error);
      throw new Error('无法解析 AI 响应');
    }
  }

  static async checkBackgroundInfo(background: string) {
    const messages = [
      {
        role: 'system',
        content: `你是一个经验丰富的生活顾问。请判断用户提供的背景信息是否足以生成有价值的建议信。如果信息不够充分，提出一个最关键的问题来理解用户的处境。

请严格按照以下JSON格式返回：
{
  "sufficient": false,
  "reason": "需要更多信息来提供更准确的建议",
  "questions": ["你最关心的问题"]
}
或
{
  "sufficient": true,
  "reason": "信息充分"
}`
      },
      {
        role: 'user',
        content: `用户的背景信息：\n${background}`
      }
    ];

    try {
      const response = await this.makeRequest(messages);
      const cleaned = this.cleanJsonResponse(response);
      const result = JSON.parse(cleaned);
      
      // 验证响应格式
      if (typeof result.sufficient !== 'boolean') {
        throw new Error('Invalid response format');
      }
      
      return result;
    } catch (error) {
      console.error('Error parsing background check response:', error);
      // 返回安全的默认值
      return {
        sufficient: true,
        reason: "继续处理",
        questions: []
      };
    }
  }

  static async collectMoreInfo(background: string, question: string, answer: string) {
    const messages = [
      {
        role: 'system',
        content: `你是一个友好的顾问。请仔细评估用户提供的额外信息，判断是否需要继续提问。请严格按照以下JSON格式返回：
{
  "sufficient": true | false,
  "question": "如果需要继续提问，这里是下一个问题。如果信息充分，返回空字符串"
}`
      },
      {
        role: 'user',
        content: `背景信息：${background}\n问题：${question}\n回答：${answer}`
      }
    ];

    try {
      const response = await this.makeRequest(messages);
      const cleaned = this.cleanJsonResponse(response);
      const result = JSON.parse(cleaned);
      
      // 验证响应格式
      if (typeof result.sufficient !== 'boolean' || typeof result.question !== 'string') {
        throw new Error('Invalid response format');
      }
      
      return result;
    } catch (error) {
      console.error('Error parsing more info response:', error);
      return { sufficient: true, question: '' };
    }
  }

  static async generateLetters(formData: any, additionalInfo: string = '') {
    const messages = [
      {
        role: 'system',
        content: `你是一位富有同理心的生活顾问。请基于用户信息，分别生成两封来自未来的信：一封来自选择A的未来，一封来自选择B的未来。请用朴实温暖的语言写作。

请确保每封信：
1. 描述选择后的生活轨迹
2. 分享这个选择带来的收获与挑战
3. 给现在的自己一些建议
4. 用换行符(\\n)来分隔段落

请严格按照以下JSON格式返回，信件内容直接作为字符串值：
{
  "letterA": "第一封信的内容\\n用换行符分隔段落",
  "letterB": "第二封信的内容\\n用换行符分隔段落"
}`
      },
      {
        role: 'user',
        content: `基本信息：
- 称呼：${formData.name}
- 性别：${formData.gender === 'male' ? '男' : '女'}
- 出生日期：${formData.birthDate}

当前选择：
- 选项A：${formData.optionA}
- 选项B：${formData.optionB}

背景信息：
${formData.background}
${additionalInfo ? `\n补充信息：${additionalInfo}` : ''}`
      }
    ];

    try {
      const response = await this.makeRequest(messages);
      console.log('Raw AI response:', response);
      
      const cleaned = this.cleanJsonResponse(response);
      console.log('Cleaned response:', cleaned);
      
      const result = JSON.parse(cleaned);
      
      // 验证返回的信件格式
      if (typeof result.letterA !== 'string' || typeof result.letterB !== 'string') {
        throw new Error('Invalid response format: letters must be strings');
      }

      return {
        letterA: result.letterA.trim(),
        letterB: result.letterB.trim()
      };
    } catch (error) {
      console.error('Error generating letters:', error);
      throw new Error('生成信件时出现错误，请重试');
    }
  }
}