// import axios from 'axios';
import UseFetch from 'utill/UseFetch';
import { useRecoilState as UseRecoilState } from 'recoil';
import { loadingState } from '../atoms';

import {
  ADD_FAVORITE,
  FAVORITED,
  FAVORITE_NUMBER,
  GET_FAVORITE,
  REMOVE_FAVORITE,
} from './types';
export function favorited(dataToSubmit: any) {
  // const [loading, setLoading] = UseRecoilState(loadingState);
  const request =
    // UseAsync(
    UseFetch({
      method: 'post',
      url: '/api/favorite/favorited',
      data: dataToSubmit,
    });
  // );
  // axios
  //   .post('api/users/login', dataToSubmit)
  //   .then(response => response.data);
  return { type: FAVORITED, payload: request };
}

export function favorite_number() {
  const request = UseFetch({
    url: '/api/favorite/favorite_number',
    method: 'post',
  });
  // axios
  //   .post('api/users/register', dataToSubmit)
  //   .then(response => response.data);
  return { type: FAVORITE_NUMBER, payload: request };
}
export function removeFromFavorite(data: any) {
  const request = UseFetch({
    url: '/api/favorite/removeFromFavorite',
    method: 'post',
    data,
  });
  // axios
  //   .post('api/users/register', dataToSubmit)
  //   .then(response => response.data);
  return { type: REMOVE_FAVORITE, payload: request };
}
export function addToFavorite(data: any) {
  const request = UseFetch({
    url: '/api/favorite/addToFavorite',
    method: 'post',
    data: data,
  });
  // axios
  //   .post('api/users/register', dataToSubmit)
  //   .then(response => response.data);
  return { type: ADD_FAVORITE, payload: request };
}
export function getFavoredMovie() {
  const request = UseFetch({
    url: '/api/favorite/getFavoredMovie',
    method: 'post',
  });
  // axios
  //   .post('api/users/register', dataToSubmit)
  //   .then(response => response.data);
  return { type: GET_FAVORITE, payload: request };
}
