'use client';

import { useEffect, useState } from 'react';

type SchemaType = 'erd' | 'sql' | 'prisma' | 'relationships';

interface CodeDisplayProps {
  content: string;
  schemaType: SchemaType;
}

export default function CodeDisplay({
  content,
  schemaType,
}: CodeDisplayProps) {
  const [iframeContent, setIframeContent] = useState('');

  useEffect(() => {
    if (schemaType === 'erd' && content.includes('mermaid')) {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
          <style>
            body { margin: 0; padding: 20px; background: white; }
            .mermaid { display: flex; justify-content: center; }
          </style>
        </head>
        <body>
          <div class="mermaid">
            ${content.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '')}
          </div>
          <script>
            mermaid.contentLoaded();
          </script>
        </body>
        </html>
      `;
      setIframeContent(html);
    }
  }, [content, schemaType]);

  if (schemaType === 'erd') {
    return (
      <div className="rounded-lg bg-gray-50 p-4">
        {iframeContent ? (
          <iframe
            srcDoc={iframeContent}
            style={{
              width: '100%',
              height: '500px',
              border: 'none',
              borderRadius: '0.5rem',
            }}
            title="ERD Visualization"
          />
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">Loading diagram...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-auto rounded-lg bg-gray-900 p-4">
        <pre className="text-sm text-gray-100">
          <code>{content}</code>
        </pre>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(content);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
