import { ADDRGETNETWORKPARAMS } from 'dns';
import {
  ADD_FAVORITE,
  FAVORITED,
  FAVORITE_NUMBER,
  GET_FAVORITE,
  REMOVE_FAVORITE,
} from '_actions/types';

export default function (state = {}, action: any) {
  switch (action.type) {
    case FAVORITED:
      console.log(state, 'state');
      return { ...state, success: action.payload };
      break;
    case FAVORITE_NUMBER:
      console.log(state, 'state');
      return { ...state, success: action.payload };
      break;

    case REMOVE_FAVORITE:
      console.log(state, 'state');
      return { ...state, success: action.payload };
      break;
    case ADD_FAVORITE:
      console.log(state, 'state');
      return { ...state, success: action.payload };
      break;
    case GET_FAVORITE:
      console.log(state, 'state');
      return { ...state, success: action.payload };
      break;
    default:
      return state;
  }
}
