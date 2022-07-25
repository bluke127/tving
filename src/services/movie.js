import api, { API_KEY } from 'utill/axios';

const url = `/movie/top_rated?api_key=${API_KEY}`;

export async function getTopMovie() {
  const response = await api.get({ url });
  return response;
}

export async function getDetailMovie(id) {
  const detailUrl = `/movie/${id}?api_key=${API_KEY}`;
  const response = await api.get({ url: detailUrl });
  return response;
}
