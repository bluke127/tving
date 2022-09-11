// import axios from 'axios';
import UseFetch from 'utill/UseFetch';
import { LOGIN_USER, REGISTER_USER } from './types';
export function loginUser(dataToSubmit: any) {
  const request = UseFetch({
    method: 'post',
    url: 'api/users/login',
    data: dataToSubmit,
  });
  // axios
  //   .post('api/users/login', dataToSubmit)
  //   .then(response => response.data);
  return { type: LOGIN_USER, payload: request };
}
export function registerUser(dataToSubmit: any) {
  const request = UseFetch({
    url: 'api/users/register',
    data: dataToSubmit,
    method: 'post',
  });
  // axios
  //   .post('api/users/register', dataToSubmit)
  //   .then(response => response.data);
  return { type: REGISTER_USER, payload: request };
}
