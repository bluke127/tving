import { LOGIN_USER, REGISTER_USER } from '_actions/types';

export default function (state = {}, action: any) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      break;
    case REGISTER_USER:
      console.log(state, 'state');
      return { ...state, registerSuccess: action.payload };
      break;
    default:
      return state;
  }
}
