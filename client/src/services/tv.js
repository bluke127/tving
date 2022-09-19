import api, { API_KEY } from 'utill/axios';

export async function getTopTv(currentPage = 0) {
  let url = `/tv/top_rated?api_key=${API_KEY}&language=en-US&page=${
    currentPage + 1
  }`;
  const response = await api.get({ url });
  return response;
}

export async function getPopularTv(currentPage = 0) {
  const _url = `/tv/popular?api_key=${API_KEY}&language=en-US&page=${
    currentPage + 1
  }`;
  const response = await api.get({ url: _url });
  return response;
}

export async function handleTvListByType(currentPage = 0, type) {
  type === 'top' ? getTopTv(currentPage) : getPopularTv(currentPage);
}
export async function getDetailTv(id) {
  const detailUrl = `/tv/${id}?api_key=${API_KEY}`;
  const response = await api.get({ url: detailUrl });
  return response;
}
