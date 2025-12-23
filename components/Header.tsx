
import React from 'react';

interface HeaderProps {
  onConnect: () => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  deviceName?: string;
}

const Header: React.FC<HeaderProps> = ({ onConnect, connectionStatus, deviceName }) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-5 bg-[#0a0a0a] sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-wide uppercase text-gray-100">Controller</h1>
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} mt-1`} />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-[#333]">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <span className="text-sm font-mono text-gray-300">
            {deviceName ? deviceName.substring(0, 15) : 'No Device'}
          </span>
        </div>
        
        <button 
          onClick={onConnect}
          className="p-2 bg-[#2d2a37] rounded-full hover:bg-[#3e3b4a] transition-colors"
          title="Connect Bluetooth"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7,12L12,7V10H16.17L12,14.17V17H12L7,12M17.71,7.71L12,2H11V9.17L6.41,4.59L5,6L11,12L5,18L6.41,19.41L11,14.83V22H12L17.71,16.29L13.41,12L17.71,7.71Z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
