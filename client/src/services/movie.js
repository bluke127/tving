import api, { API_KEY } from 'utill/axios';

export async function getTopMovie(currentPage = 0) {
  const url = `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${
    currentPage + 1
  }`;
  const response = await api.get({ url });
  return response;
}

export async function getPopularMovie(currentPage = 0) {
  const _url = `/movie/popular?api_key=${API_KEY}&language=en-US&page=${
    currentPage + 1
  }`;
  const response = await api.get({ url: _url });
  return response;
}
export async function handleMovieListByType(currentPage = 0, type) {
  type === 'top' ? getTopMovie(currentPage) : getPopularMovie(currentPage);
}
export async function getDetailMovie(id) {
  const detailUrl = `/movie/${id}?api_key=${API_KEY}`;
  const response = await api.get({ url: detailUrl });
  return response;
}
