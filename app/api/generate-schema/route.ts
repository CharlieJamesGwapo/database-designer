import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { appIdea, schemaType } = await request.json();

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

    let prompt = '';

    switch (schemaType) {
      case 'erd':
        prompt = `Generate an Entity Relationship Diagram (ERD) in Mermaid syntax for the following app idea: "${appIdea}".

        Create a clear ERD showing all entities, their attributes, and relationships. Use standard ERD notation.
        Return ONLY the Mermaid code block wrapped in \`\`\`mermaid markers, nothing else.`;
        break;

      case 'sql':
        prompt = `Generate a complete SQL schema for the following app idea: "${appIdea}".

        Create CREATE TABLE statements with appropriate data types, primary keys, foreign keys, and constraints.
        Use PostgreSQL syntax. Include comments explaining each table.
        Return ONLY the SQL code wrapped in \`\`\`sql markers, nothing else.`;
        break;

      case 'prisma':
        prompt = `Generate a complete Prisma schema for the following app idea: "${appIdea}".

        Create a proper Prisma schema.prisma file with all models, fields, and relationships.
        Use appropriate field types and add relationships with proper conventions.
        Return ONLY the Prisma schema code wrapped in \`\`\`prisma markers, nothing else.`;
        break;

      case 'relationships':
        prompt = `Create a detailed description of database relationships for the following app idea: "${appIdea}".

        Explain all one-to-many, many-to-many, and one-to-one relationships in plain English.
        Include cascade rules and foreign key constraints.
        List each relationship clearly with its type and purpose.`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid schema type' },
          { status: 400 }
        );
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
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
      content: content.text,
      schemaType,
    });
  } catch (error) {
    console.error('Error generating schema:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate schema',
      },
      { status: 500 }
    );
  }
}
