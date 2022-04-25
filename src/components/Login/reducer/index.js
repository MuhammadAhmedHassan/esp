import { combineReducers } from 'redux';
import checkUserRole from './loggedUsers';


const rootReducer = combineReducers({
  checkUserRole,
});

export default rootReducer;
