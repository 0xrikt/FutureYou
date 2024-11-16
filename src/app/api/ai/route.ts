import { NextResponse } from 'next/server';

// 添加消息类型定义
interface Message {
  role: string;
  content: string;
}

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const API_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export const runtime = 'edge'; // 使用 Edge Runtime
export const maxDuration = 60; // 设置最大执行时间为 60 秒

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 秒超时

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
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      content: data.choices[0].message.content
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}