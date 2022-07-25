import api, { API_KEY } from 'utill/axios';

let url = `/tv/top_rated?api_key=${API_KEY}`;

export async function getTopTv() {
  const response = await api.get({ url });
  return response;
}

export async function getDetailTv(id) {
  const detailUrl = `/tv/${id}?api_key=${API_KEY}`;
  const response = await api.get({ url: detailUrl });
  return response;
}
