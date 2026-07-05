'use client';

import { useState } from 'react';
import CodeDisplay from '@/components/CodeDisplay';

type SchemaType = 'erd' | 'sql' | 'prisma' | 'relationships';

interface GeneratedSchema {
  content: string;
  schemaType: SchemaType;
}

export default function Home() {
  const [appIdea, setAppIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<GeneratedSchema | null>(null);
  const [error, setError] = useState('');

  const generateSchema = async (schemaType: SchemaType) => {
    if (!appIdea.trim()) {
      setError('Please enter an app idea');
      return;
    }

    setLoading(true);
    setError('');
    setSchema(null);

    try {
      const response = await fetch('/api/generate-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appIdea, schemaType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate schema');
      }

      const data = (await response.json()) as GeneratedSchema;
      setSchema(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportSQL = () => {
    if (!schema || schema.schemaType !== 'sql') {
      setError('Please generate SQL schema first');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([schema.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `schema_${Date.now()}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getSchemaTypeLabel = (type: SchemaType): string => {
    const labels: Record<SchemaType, string> = {
      erd: 'Entity Relationship Diagram',
      sql: 'SQL Schema',
      prisma: 'Prisma Schema',
      relationships: 'Relationships',
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            AI Database Designer
          </h1>
          <p className="text-lg text-gray-700">
            Generate database schemas from your app idea using AI
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Your App Idea
              </h2>

              <textarea
                value={appIdea}
                onChange={(e) => setAppIdea(e.target.value)}
                placeholder="Describe your app idea (e.g., 'A social media platform with users, posts, comments, and likes')"
                className="mb-4 h-32 w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />

              <div className="mb-6 space-y-2">
                <button
                  onClick={() => generateSchema('erd')}
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate ERD'}
                </button>
                <button
                  onClick={() => generateSchema('sql')}
                  disabled={loading}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate SQL Schema'}
                </button>
                <button
                  onClick={() => generateSchema('prisma')}
                  disabled={loading}
                  className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Prisma Schema'}
                </button>
                <button
                  onClick={() => generateSchema('relationships')}
                  disabled={loading}
                  className="w-full rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Show Relationships'}
                </button>
              </div>

              {schema?.schemaType === 'sql' && (
                <button
                  onClick={exportSQL}
                  className="w-full rounded-lg border-2 border-blue-600 px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Export SQL
                </button>
              )}

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            {schema ? (
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  {getSchemaTypeLabel(schema.schemaType)}
                </h2>
                <CodeDisplay
                  content={schema.content}
                  schemaType={schema.schemaType}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow-lg">
                <div className="text-center">
                  <p className="mb-2 text-lg text-gray-600">
                    No schema generated yet
                  </p>
                  <p className="text-gray-500">
                    Describe your app idea and click a button to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
