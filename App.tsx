
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import GridButton from './components/GridButton';
import { GRID_VALUES } from './constants';
import { BluetoothDeviceState } from './types';
import { BluetoothService } from './services/bluetoothService';
import { getDeviceAssistantResponse } from './services/geminiService';

const App: React.FC = () => {
  const [btState, setBtState] = useState<BluetoothDeviceState>({
    device: null,
    server: null,
    characteristic: null,
    status: 'disconnected'
  });
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState<string | null>(null);
  const [isLoadingAssistant, setIsLoadingAssistant] = useState(false);

  const handleConnect = async () => {
    setBtState(prev => ({ ...prev, status: 'connecting' }));
    const result = await BluetoothService.connect();
    setBtState(result);
  };

  const handleValueClick = useCallback(async (label: string, value: number) => {
    setLastSent(label);
    
    // 1. Send to Bluetooth
    await BluetoothService.sendData(btState.characteristic, label);

    // 2. Fetch Gemini insight (optional flair)
    setIsLoadingAssistant(true);
    const insight = await getDeviceAssistantResponse(value);
    setAssistantText(insight);
    setIsLoadingAssistant(false);

    // Provide tactile feedback if on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }, [btState.characteristic]);

  // Handle device disconnection
  useEffect(() => {
    const device = btState.device;
    if (device) {
      const handleDisconnection = () => {
        setBtState({
          device: null,
          server: null,
          characteristic: null,
          status: 'disconnected',
          errorMessage: 'Device disconnected.'
        });
      };
      device.addEventListener('gattserverdisconnected', handleDisconnection);
      return () => {
        device.removeEventListener('gattserverdisconnected', handleDisconnection);
      };
    }
  }, [btState.device]);

  return (
    <div className="min-h-screen bg-[#0f0e13] flex flex-col">
      <Header 
        onConnect={handleConnect} 
        connectionStatus={btState.status}
        deviceName={btState.device?.name}
      />

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {btState.status === 'error' && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-xl text-red-200 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p>{btState.errorMessage}</p>
          </div>
        )}

        {/* Display feedback from Gemini or last action */}
        <div className="mb-6 h-16 flex flex-col justify-center px-2">
          {isLoadingAssistant ? (
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
            </div>
          ) : assistantText ? (
            <p className="text-[#a0a0b0] text-sm italic animate-in fade-in slide-in-from-bottom-2 duration-500">
              &ldquo;{assistantText}&rdquo;
            </p>
          ) : lastSent ? (
            <p className="text-indigo-400 text-sm font-medium">
              Command sent: {lastSent}
            </p>
          ) : (
            <p className="text-gray-500 text-sm">Select an input to transmit</p>
          )}
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-4 md:gap-5 pb-12">
          {GRID_VALUES.map((item) => (
            <GridButton
              key={item.id}
              label={item.label}
              isActive={lastSent === item.label}
              onClick={() => handleValueClick(item.label, item.value)}
              disabled={btState.status === 'connecting'}
            />
          ))}
        </div>
      </main>

      {/* Connection Instructions Footer (only if disconnected) */}
      {btState.status === 'disconnected' && (
        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Instructions</p>
          <p className="text-sm text-gray-400">
            Click the Bluetooth icon top-right to connect your device.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
