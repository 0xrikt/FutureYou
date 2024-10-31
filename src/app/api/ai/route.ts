// app/api/ai/route.ts
import { NextResponse } from 'next/server';
import { AIService } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case 'checkBackgroundInfo':
        const checkResult = await AIService.checkBackgroundInfo(data.background);
        return NextResponse.json(checkResult);

      case 'collectMoreInfo':
        const moreInfoResult = await AIService.collectMoreInfo(
          data.background,
          data.question,
          data.answer
        );
        return NextResponse.json(moreInfoResult);

      case 'generateLetters':
        const letters = await AIService.generateLetters(data.formData, data.additionalInfo);
        return NextResponse.json(letters);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}