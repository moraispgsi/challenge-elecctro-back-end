import { combineReducers } from 'redux';
import TasksReducer from './Tasks';
import TaskFilters from './Settings';

const rootReducer = combineReducers({
  tasks: TasksReducer,
  settings: TaskFilters
});

export default rootReducer;