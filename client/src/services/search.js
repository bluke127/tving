import api, { API_KEY } from 'utill/axios';

const url = `/search/`;
export async function getSearchMedia(type, keyword) {
  const _url = `${url}${type}?api_key=${API_KEY}&query=${keyword}`;
  const response = await api.get({ url: _url });
  return response;
}
