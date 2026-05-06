import axios from 'axios';
import { API_URL } from './http';

const client = axios.create({ baseURL: API_URL, timeout: 15000 });

export async function createUser(email, password) {
  const { data } = await client.post('/auth/signup', { email, password });
  return { token: data.token, userId: data.userId, email: data.email, name: data.name };
}

export async function login(email, password) {
  const { data } = await client.post('/auth/login', { email, password });
  return { token: data.token, userId: data.userId, email: data.email, name: data.name };
}

export async function refreshToken(token) {
  const { data } = await client.post(
    '/auth/refresh',
    null,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data.token;
}
