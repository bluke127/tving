import { combineReducers } from 'redux';
import user from '_reducers/user_reducer';
import favorite from '_reducers/favorite_reducer';
const rootReducer = combineReducers({ favorite, user });
export default rootReducer;
