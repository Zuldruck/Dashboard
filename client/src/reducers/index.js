import { combineReducers } from 'redux';
import AdminReducer from './AdminReducer';

const reducers = combineReducers({
    isAdmin: AdminReducer,
});

export default reducers;