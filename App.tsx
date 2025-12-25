
import React, { useState, useCallback, useEffect } from 'react';
import { INITIAL_STRUCTURE } from './constants';
import { FileNode, ChatMessage, AppStatus } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import ChatPanel from './components/ChatPanel';
import { gemini } from './services/gemini';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleFileSelect = useCallback((file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setAnalysis(''); // Reset analysis for new file
    }
  }, []);

  const analyzeCurrentFile = async () => {
    if (!selectedFile || !selectedFile.content) return;
    setIsAnalyzing(true);
    const result = await gemini.analyzeFile(selectedFile.name, selectedFile.content);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const onSendMessage = async (msg: string) => {
    const newUserMsg: ChatMessage = { role: 'user', parts: [{ text: msg }] };
    setChatMessages(prev => [...prev, newUserMsg]);

    const history = chatMessages.map(m => ({ role: m.role, parts: m.parts }));
    const responseText = await gemini.chatAboutProject(history, selectedFile?.name || null, msg);
    
    setChatMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Left Sidebar: File Tree */}
      <div className="w-64 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center font-bold text-xs text-black">
            DA
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-200">DroidArchitect AI</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar nodes={INITIAL_STRUCTURE} onSelect={handleFileSelect} activePath={selectedFile?.path || ''} />
        </div>
      </div>

      {/* Main Content: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 border-b border-slate-800 flex items-center px-4 bg-slate-900/50 justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedFile ? (
              <>
                <FileIcon name={selectedFile.name} className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300 truncate">{selectedFile.path}</span>
              </>
            ) : (
              <span className="text-xs text-slate-500 italic">Select a file to view source</span>
            )}
          </div>
          {selectedFile && (
            <button 
              onClick={analyzeCurrentFile}
              disabled={isAnalyzing}
              className="text-[10px] px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white font-medium uppercase tracking-wider disabled:opacity-50 flex items-center gap-1"
            >
              {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
            </button>
          )}
        </div>
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <Editor file={selectedFile} />
          </div>
          
          {analysis && (
            <div className="h-1/3 border-t border-slate-800 bg-slate-900 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-blue-400 flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   AI INSIGHTS
                </h3>
                <button onClick={() => setAnalysis('')} className="text-slate-500 hover:text-slate-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: AI Chat */}
      <div className="w-80 border-l border-slate-800 flex flex-col shrink-0 bg-slate-900/30">
        <ChatPanel 
          messages={chatMessages} 
          onSendMessage={onSendMessage} 
          selectedFileName={selectedFile?.name || null}
        />
      </div>
    </div>
  );
};

// Helper Icon Components
const FileIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  if (name.endsWith('.kt')) return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15h6" />
    </svg>
  );
  if (name.endsWith('.xml')) return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
  if (name.endsWith('.gradle')) return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
};

export default App;
