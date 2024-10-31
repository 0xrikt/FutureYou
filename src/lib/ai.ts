// lib/ai.ts

import { ZhipuAIResponse } from '@/types';

const ZHIPU_API_KEY = `Bearer ${process.env.NEXT_PUBLIC_ZHIPU_API_KEY}`;
const API_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

interface Message {
  role: string;
  content: string;
}

export class AIService {
  private static async makeRequest(messages: Message[]) {
    try {
      if (!process.env.NEXT_PUBLIC_ZHIPU_API_KEY) {
        throw new Error('智谱API密钥未配置');
      }

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
    // 1. 移除可能的代码块标记
    let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    cleaned = cleaned.trim();
    
    try {
      // 2. 尝试直接解析
      JSON.parse(cleaned);
      return cleaned;
    } catch (e) {
      // 3. 如果直接解析失败，进行深度清理
      try {
        // 找到 JSON 结构的起始和结束位置
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
          throw new Error('No valid JSON structure found');
        }
        
        // 提取 JSON 部分
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
        
        // 处理换行符
        cleaned = cleaned.replace(/\r?\n/g, '\\n');
        
        // 处理多余的转义符
        cleaned = cleaned.replace(/\\\\/g, '\\');
        
        // 处理引号
        cleaned = cleaned.replace(/\\"/g, '"')  // 先处理已转义的引号
                        .replace(/([^\\])"/g, '$1\\"')  // 再处理未转义的引号
                        .replace(/^"/, '\\"');  // 处理开头的引号
        
        // 处理特殊字符
        cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        
        // 验证并返回
        JSON.parse(cleaned);
        return cleaned;
      } catch (error) {
        // 4. 如果还是失败，尝试最后的修复
        try {
          // 提取letterA和letterB的内容
          const letterAMatch = cleaned.match(/"letterA"\s*:\s*"([^"]+)"/);
          const letterBMatch = cleaned.match(/"letterB"\s*:\s*"([^"]+)"/);
          
          if (!letterAMatch || !letterBMatch) {
            throw new Error('Cannot extract letters content');
          }
          
          // 重新构造一个干净的JSON
          const cleanJson = {
            letterA: letterAMatch[1].replace(/\\n/g, '\n'),
            letterB: letterBMatch[1].replace(/\\n/g, '\n')
          };
          
          return JSON.stringify(cleanJson);
        } catch (finalError) {
          console.error('Final JSON cleaning attempt failed:', finalError);
          throw new Error('Failed to clean JSON response');
        }
      }
    }
  }

  static async checkBackgroundInfo(background: string) {
    const messages = [
      {
        role: 'system',
        content: `你是一位帮助评估和收集用户背景信息的AI助手。请根据以下维度评估用户提供的信息是否充分，以便生成高质量的未来信件。

评估维度：

1. 选择相关信息
- 为什么会出现这两个选择
- 每个选择的机会和风险
- 当前倾向和顾虑

2. 价值观和诉求
- 最看重的生活方面（如家庭、事业、自我实现等）
- 对未来的期待
- 内心的担忧

如果信息不充分，请选择最重要的缺失维度，从用户已经提供的背景信息出发，提出一个具体的追问。请用温暖自然的语气。

请严格按照以下JSON格式返回：
{
  "sufficient": false,
  "questions": ["一个温暖友好的追问"]
}
或
{
  "sufficient": true
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
      
      if (typeof result.sufficient !== 'boolean') {
        throw new Error('Invalid response format');
      }
      
      return result;
    } catch (error) {
      console.error('Error parsing background check response:', error);
      return {
        sufficient: true,
        questions: []
      };
    }
  }

  static async collectMoreInfo(background: string, question: string, answer: string) {
    const messages = [
      {
        role: 'system',
        content: `你是一位温暖友好的AI助手，正在通过对话收集用户背景信息。请基于用户的回答，判断是否需要继续提问。

评估要点：
1. 用户的回答是否为我们理解情况提供了新的视角
2. 是否还有重要的信息维度需要了解
3. 如果需要继续提问，从最自然的维度开始
4. 用轻松的语气提问，表达理解和共情
5. 控制追问数量，确保高效收集信息

请严格按照以下JSON格式返回：
{
  "sufficient": true | false,
  "question": "如果需要继续提问，这里是下一个温暖友好的问题。如果信息充分，返回空字符串"
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
      
      if (typeof result.sufficient !== 'boolean' || typeof result.question !== 'string') {
        throw new Error('Invalid response format');
      }
      
      return result;
    } catch (error) {
      console.error('Error parsing more info response:', error);
      return { sufficient: true, question: '' };
    }
  }

  static async generateLetters(formData: any, additionalInfo = '') {
    const messages = [
      {
        role: 'system',
        content: `你正在参与一项特殊的服务，帮助人们通过收到"十年后的自己"写来的信来做出重要的人生选择。你需要基于用户当前面临的选择，写两封来自不同人生轨迹的未来的信。

写信要求：
1. 信件结构
开头：
- - 点明这是一封十年后的来信，注意人称，如“你好，这是十年后的你”，而不是“你好，这是十年后的我”
- 对当时的困扰表示理解
- 建立温暖私密的语气
生活概述：
- 描绘现在的生活图景
- 提供2-3个具体细节
- 涵盖事业、感情、生活等方面
选择影响：
- 回顾当初的决定如何改变了人生轨迹
- 分享意料之外的转折点
- 解释这个选择如何影响了后续的决定
深度反思：
- 分享最重要的领悟
- 谈谈对自己的新认识
- 诚实面对遗憾或困难
- 提到一些在任何选择下都不变的东西

写作原则：
1. 口吻要求：
- 像真正经历过这十年的自己在写信
- 语气亲切自然，避免说教
- 保持温暖但不失诚实
- 体现十年后的成熟与智慧
2. 内容要求：
- 字数控制在600-1200字
- 两种未来都要让人觉得值得憧憬
- 加入具体的生活细节增强真实感
- 不要预测社会发展和科技进步
- 重点写个人成长和生命体验
- 目的是帮助反思，而不是指导选择
3. 流畅地讲述，可以聊的要素：
- 一个意外的人际关系
- 一个促进成长的挑战
- 一个对生命的新认识
- 一个关于选择的顿悟时刻
- 一个始料未及的机遇
- 一个需要克服的困难
- 一个未曾想到的快乐
- 一个关于生活或自我的领悟

重要提醒：
- 两个未来都应该是真实可信的
- 在每种选择中，想象在某种程度上兼顾另一种的可能
- 避免把某个选择描述得明显更好
- 保持同一个人的性格特点
- 体现时间带来的成长改变
- 信中要包含具体的生活场景
- 努力设想真实的可能性，避免空泛的说教和建议

请严格按照以下JSON格式返回：
{
  "letterA": "亲爱的[称呼]：\\n[按上述结构和要求撰写信件A，对应选择了optionA的未来]\\n\\n来自\\n十年后的你\\n2034年✒️",
  "letterB": "亲爱的[称呼]：\\n[按上述结构和要求撰写信件B，对应选择了optionB的未来]\\n\\n来自\\n十年后的你\\n2034年✒️"
}`
      },
      {
        role: 'user',
        content: `当前处境：${formData.background}
${additionalInfo ? `\n补充信息：${additionalInfo}` : ''}

面临的选择：
- 选项A：${formData.optionA}
- 选项B：${formData.optionB}`
      }
    ];

    try {
      const response = await this.makeRequest(messages);
      const cleaned = this.cleanJsonResponse(response);
      const result = JSON.parse(cleaned);
      
      if (!result.letterA || !result.letterB) {
        throw new Error('Invalid response format');
      }

      return {
        letterA: result.letterA.replace('[称呼]', formData.name).trim(),
        letterB: result.letterB.replace('[称呼]', formData.name).trim()
      };
    } catch (error) {
      console.error('Error generating letters:', error);
      throw new Error('生成信件时出现错误，请重试');
    }
  }
}