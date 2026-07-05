import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { appIdea } = await request.json();

    if (!appIdea) {
      return NextResponse.json(
        { error: 'App idea is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    const prompt = `Generate an Entity Relationship Diagram (ERD) in plain text ASCII format for: "${appIdea}"

Show all entities, attributes, and relationships. Keep it simple and clear.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return NextResponse.json({
      erd: content.text,
    });
  } catch (error) {
    console.error('Error generating ERD:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to generate ERD',
      },
      { status: 500 }
    );
  }
}
