import axios from '../../lib/axios';

interface Settings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}

export const settingsAPI = {
  getSettings: async (): Promise<Settings> => {
    const response = await axios.get('/api/settings');
    return response.data;
  },

  updateSettings: async (updates: Partial<Settings>): Promise<Settings> => {
    const response = await axios.patch('/api/settings', updates);
    return response.data;
  },
};