// app/api/ai/route.ts
import { NextResponse } from 'next/server';

// 添加消息类型定义
interface Message {
  role: string;
  content: string;
}

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const API_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export async function POST(req: Request) {
  try {
    if (!ZHIPU_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { messages }: { messages: Message[] } = await req.json();

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
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

    const data = await response.json();
    return NextResponse.json({
      content: data.choices[0].message.content
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}