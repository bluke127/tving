import api from 'utill/axios';
import { LOGIN_USER } from './types';
export function loginUser(dataTosubmit: any) {
  console.log(
    process.env.REACT_APP_NODE_API_URL,
    process.env.REACT_APP_API_URL
  );
  const request = api
    .post({
      baseURL: ('http://' + process.env.REACT_APP_NODE_API_URL) as string,
      url: 'api/users/login',
      query: dataTosubmit,
    })
    .then(response => response.data);
  return { type: LOGIN_USER, payload: request };
}
