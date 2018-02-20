import * as types from '../constants/TaskActionTypes';
import uuidv1 from 'uuid/v1';
import { List, Map } from 'immutable';

//@flow

const initialState = List([
    /*Map({
      id: uuidv1(),
      text: 'A random fabulous task!',
      marked: false
    })*/
  ]
);

export default (state: object = initialState, action: object) => {

  switch (action.type) {

    case types.RECEIVE_TASKS:
      return List(action.tasks.map((task) => (Map(task))));

    case types.TASK_ADDED:
      return state.push(Map({id: action.id, marked: action.marked, text: action.text}));

    case types.TASK_REMOVED:
      const taskRemoveIndex = state.findIndex((task)=> task.get('id') === action.id);
      return state.remove(taskRemoveIndex);

    case types.EDIT_TASK:
      const taskEditIndex = state.findIndex((task)=> task.get('id') === action.id);
      return state.setIn([taskEditIndex, 'text'], action.text);

    case types.TASK_MARKED:
      const taskMarkIndex = state.findIndex((task)=> task.get('id') === action.id);
      return state.setIn([taskMarkIndex, 'marked'], true);

    case types.TASK_UNMARKED:
      const taskUnmarkIndex = state.findIndex((task)=> task.get('id') === action.id);
      return state.setIn([taskUnmarkIndex, 'marked'], false);

    default:
      return state;
  }
}