import api, { API_KEY } from 'utill/axios';

const url = `/authentication/token/new?api_key=${API_KEY}`;

export async function getLogin() {
  const response = await api.get({ url });
  return response;
}
