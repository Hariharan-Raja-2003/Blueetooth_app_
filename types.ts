
export interface BluetoothDeviceState {
  // Fix: Using any to resolve "Cannot find name 'BluetoothDevice'"
  device: any | null;
  // Fix: Using any to resolve "Cannot find name 'BluetoothRemoteGATTServer'"
  server: any | null;
  // Fix: Using any to resolve "Cannot find name 'BluetoothRemoteGATTCharacteristic'"
  characteristic: any | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  errorMessage?: string;
}

export interface GridValue {
  id: string;
  label: string;
  value: number;
}