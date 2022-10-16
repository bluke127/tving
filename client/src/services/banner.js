import api, { API_KEY } from 'utill/axios';

export async function movieBannerVideo(movieId) {
  const response = await api.get({
    url: `/movie/${movieId}/videos?api_key=${API_KEY}`,
    params: { append_to_response: 'videos' },
  });
  return response;
}
export async function tvBannerVideo(tvId) {
  const response = await api.get({
    url: `/tv/${tvId}/videos?api_key=${API_KEY}`,
    params: { append_to_response: 'videos' },
  });
  return response;
}
