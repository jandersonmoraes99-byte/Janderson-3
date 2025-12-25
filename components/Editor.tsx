
import React from 'react';
import { FileNode } from '../types';

interface EditorProps {
  file: FileNode | null;
}

const Editor: React.FC<EditorProps> = ({ file }) => {
  if (!file || file.type !== 'file') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 bg-slate-950">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">Select a file from the explorer to begin</p>
      </div>
    );
  }

  const lines = (file.content || '').split('\n');

  return (
    <div className="flex h-full bg-slate-950 text-slate-300 font-mono text-sm">
      <div className="w-12 pt-4 bg-slate-900/40 border-r border-slate-800/50 flex flex-col items-end px-3 select-none text-slate-600">
        {lines.map((_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>
      <div className="flex-1 pt-4 px-6 overflow-auto leading-6 whitespace-pre">
        {lines.map((line, i) => (
           <div key={i} className="hover:bg-slate-900 transition-colors">
              {formatLine(line, file.language || 'kotlin')}
           </div>
        ))}
      </div>
    </div>
  );
};

// Simple pseudo-highlighter
function formatLine(line: string, language: string) {
  const keywords = [
    'package', 'import', 'class', 'data', 'interface', 'fun', 'val', 'var', 'override',
    'private', 'lateinit', 'object', 'companion', 'abstract', 'suspend', 'return',
    'if', 'else', 'when', 'is', 'for', 'while', 'null', 'true', 'false',
    'plugins', 'id', 'dependencies', 'implementation', 'kapt', 'project', 'all'
  ];
  const annotations = [
    '@Entity', '@PrimaryKey', '@Dao', '@Query', '@Insert', '@Delete', '@Update', '@Database', '@Volatile'
  ];

  // Basic color coding for demo purposes
  const parts = line.split(/(\s+|\(|\)|\[|\]|\{|\}|\.|,|:|=|@\w+)/);
  
  return parts.map((part, i) => {
    const trimmed = part.trim();
    if (keywords.includes(trimmed)) {
      return <span key={i} className="text-blue-400">{part}</span>;
    }
    if (annotations.includes(trimmed) || part.startsWith('@')) {
      return <span key={i} className="text-yellow-500">{part}</span>;
    }
    if (part.startsWith('"') || part.endsWith('"') || part.startsWith("'") || part.endsWith("'")) {
      return <span key={i} className="text-green-400">{part}</span>;
    }
    if (part.startsWith('//')) {
      return <span key={i} className="text-slate-500 italic">{part}</span>;
    }
    if (/^[A-Z]\w+/.test(trimmed)) {
      return <span key={i} className="text-purple-400">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default Editor;
