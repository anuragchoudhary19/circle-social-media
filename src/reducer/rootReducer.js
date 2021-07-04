import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { postReducer } from './postReducer';
import { modalReducer } from './modalReducer';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  id: modalReducer,
});

export default rootReducer;
