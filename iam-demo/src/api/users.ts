import api from './axios';

export const getUsers = async () => (await api.get('/users')).data;
export const getUser = async (id: string) =>
  (await api.get(`/users/${id}`)).data;
export const createUser = async (data: {
  email: string;
  username: string;
  name?: string;
}) => (await api.post('/users', data)).data;
export const updateUser = async (
  id: string,
  data: { email?: string; username?: string; name?: string },
) => (await api.put(`/users/${id}`, data)).data;
export const deleteUser = async (id: string) =>
  (await api.delete(`/users/${id}`)).data;
