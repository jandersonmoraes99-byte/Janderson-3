
import React, { useState } from 'react';
import { FileNode } from '../types';

interface SidebarProps {
  nodes: FileNode[];
  onSelect: (node: FileNode) => void;
  activePath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ nodes, onSelect, activePath }) => {
  return (
    <div className="py-2">
      {nodes.map(node => (
        <TreeNode key={node.id} node={node} onSelect={onSelect} activePath={activePath} depth={0} />
      ))}
    </div>
  );
};

const TreeNode: React.FC<{ node: FileNode; onSelect: (node: FileNode) => void; activePath: string; depth: number }> = ({ node, onSelect, activePath, depth }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = activePath === node.path;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  return (
    <div>
      <div 
        onClick={handleToggle}
        className={`flex items-center gap-2 py-1 px-4 cursor-pointer hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {node.type === 'folder' ? (
            <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
            </svg>
          ) : null}
        </div>
        <div className="w-4 h-4">
          {node.type === 'folder' ? (
            <svg className="w-4 h-4 text-blue-500/80" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          ) : (
            <FileIcon name={node.name} />
          )}
        </div>
        <span className="text-xs truncate select-none">{node.name}</span>
      </div>
      
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} onSelect={onSelect} activePath={activePath} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileIcon: React.FC<{ name: string }> = ({ name }) => {
  if (name.endsWith('.kt')) return (
    <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
  if (name.endsWith('.xml')) return (
    <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
    </svg>
  );
  if (name.endsWith('.gradle')) return (
    <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
  return (
    <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
    </svg>
  );
};

export default Sidebar;
