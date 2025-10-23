import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

interface HardwareInfo {
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  network: string;
  tpm: string;
  motherboard: string;
}

interface HardwareState {
  hardwareInfo: HardwareInfo | null;
  loading: boolean;
  fetchHardwareInfo: () => Promise<void>;
}

const useHardwareStore = create<HardwareState>((set) => ({
  hardwareInfo: null,
  loading: true, // Set loading to true by default
  fetchHardwareInfo: async () => {
    set({ loading: true });
    try {
      const info: HardwareInfo = await invoke('get_hardware_info');
      set({ hardwareInfo: info, loading: false });
    } catch (error) {
      console.error("Failed to fetch hardware info:", error);
      set({ loading: false });
    }
  },
}));

export default useHardwareStore;
