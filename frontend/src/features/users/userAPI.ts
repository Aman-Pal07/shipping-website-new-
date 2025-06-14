import axios from '../../lib/axios';
import { User, CreateUserData, UpdateUserData } from '../../types/user';

export const userAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await axios.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, updates: UpdateUserData): Promise<User> => {
    const response = await axios.patch(`/users/${id}`, updates);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`/users/${id}`);
  },
};