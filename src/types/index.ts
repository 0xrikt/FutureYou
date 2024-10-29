// types/index.ts

export interface ZhipuAIResponse {
    choices: {
      message: {
        content: string;
        role: string;
      };
      finish_reason: string;
    }[];
  }
  
  export interface FormData {
    name: string;
    gender: string;
    birthDate: string;
    optionA: string;
    optionB: string;
    background: string;
  }
  
  // 更新的类型定义
  export interface BackgroundCheckResult {
    sufficient: boolean;
    reason: string;
    questions?: string[];
  }
  
  export interface MoreInfoResult {
    sufficient: boolean;
    question: string;
  }
  
  export interface Letters {
    letterA: string;
    letterB: string;
  }