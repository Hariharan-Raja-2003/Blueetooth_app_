
import { BluetoothDeviceState } from '../types';

// Common Service UUID for generic data (UART-like)
const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

export class BluetoothService {
  static async connect(): Promise<BluetoothDeviceState> {
    try {
      // Fix: Cast navigator to any as 'bluetooth' property is missing in standard Navigator type
      if (!(navigator as any).bluetooth) {
        throw new Error('Bluetooth is not supported by your browser.');
      }

      // Fix: Cast navigator to any to access requestDevice
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [UART_SERVICE_UUID, 'generic_access'],
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Could not connect to GATT server.');

      // Try to find a writable characteristic
      // Note: In a real app, you'd specify service/char UUIDs. 
      // This is a generic implementation.
      // Fix: Use any for characteristic to resolve "Cannot find name 'BluetoothRemoteGATTCharacteristic'"
      let characteristic: any = null;
      
      try {
        const service = await server.getPrimaryService(UART_SERVICE_UUID);
        characteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);
      } catch (e) {
        console.warn('UART service not found, scanning all services...');
        const services = await server.getPrimaryServices();
        for (const s of services) {
          const chars = await s.getCharacteristics();
          const writable = chars.find(c => c.properties.write || c.properties.writeWithoutResponse);
          if (writable) {
            characteristic = writable;
            break;
          }
        }
      }

      if (!characteristic) {
        console.warn('No writable characteristic found. Commands will be logged to console only.');
      }

      return {
        device,
        server,
        characteristic,
        status: 'connected',
      };
    } catch (error: any) {
      return {
        device: null,
        server: null,
        characteristic: null,
        status: 'error',
        errorMessage: error.message || 'Unknown error occurred',
      };
    }
  }

  // Fix: Use any for characteristic parameter to resolve missing type definition
  static async sendData(characteristic: any, data: string): Promise<boolean> {
    if (!characteristic) {
      console.log(`[Bluetooth Simulation] Sending: ${data}`);
      return true;
    }

    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data + '\n');
      await characteristic.writeValue(encodedData);
      return true;
    } catch (error) {
      console.error('Failed to send data:', error);
      return false;
    }
  }

  // Fix: Use any for server parameter to resolve "Cannot find name 'BluetoothRemoteGATTServer'"
  static async disconnect(server: any) {
    if (server && server.connected) {
      server.disconnect();
    }
  }
}