import * as types from '../constants/TaskActionTypes';
import * as sortTypes from '../constants/SortTypes'
import fetch from 'cross-fetch'

// @flow

export const taskAdded = (id: string, text: string, marked: boolean) => ({ type: types.TASK_ADDED, id, text, marked });
export const addTask = (text: string) => {
  return dispatch => {
    fetch('/todos', {
      method: "PUT",
      body: JSON.stringify({
        description: text
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(function(res) {

      if (res.status >= 400) {
        console.log(res)
        throw new Error("Bad response from server");
      }

      res.json().then(task => {
        dispatch(taskAdded(task.id, task.description, task.state === 'COMPLETE'));
      });

    });
  }
};
export const taskRemoved = (id: boolean) => ({ type: types.TASK_REMOVED, id });
export const removeTask = (id: boolean) => {
  return dispatch => {
    fetch(`/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(function(res) {

      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      dispatch(taskRemoved(id));
    });
  }
};
export const taskEdited = (id: boolean, text: string) => ({ type: types.EDIT_TASK, id, text });
export const editTask = (id: boolean, text: string) => {
  return dispatch => {
    fetch(`/todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        description: text
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(function (res) {

      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      res.json().then(task => {
        dispatch(taskEdited(task.id, task.description));
      });

    });
  }
};

export const taskMarked = (id: string) => ({ type: types.TASK_MARKED, id });
export const markTask = (id: string) => {
  return dispatch => {
    fetch(`/todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        state: 'COMPLETE'
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(function (res) {

      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      res.json().then(task => {
        dispatch(taskMarked(task.id));
      });

    });
  }
};

//Both this action do not work because of the server API, the requirements do not allow a task to be unmarked
export const taskUnmarked = (id) => ({ type: types.TASK_UNMARKED, id });
export const unmarkTask = (id) => {
  return dispatch => {
    fetch(`/todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        state: 'INCOMPLETE'
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(function (res) {

      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      res.json().then(task => {
        dispatch(taskUnmarked(task.id));
      });

    });
  }
};

export const receiveTasks = (tasks) => ({ type: types.RECEIVE_TASKS, tasks });
export const fetchTasks = () => {
  return (dispatch, getState) => {

    const showingMarked = getState().settings.get('showingMarked');
    const sorting = getState().settings.get('sorting');
    let url = '/todos';
    let nextSeparator = '?';
    if(showingMarked) {
      url += `${nextSeparator}filter=${showingMarked ? 'ALL': 'INCOMPLETE' }`;
      nextSeparator = '&';
    }

    if(sorting === sortTypes.NONE) {
      url += `${nextSeparator}orderBy=DATE_ADDED`;
      nextSeparator = '&';
    }
    console.log(url);
    fetch(url).then((res) => {

      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      res.json().then(tasks => {
        console.log(tasks);
        //Parsing incompatible API
        tasks = tasks.map((task) => {
          return {
            id: task.id,
            text: task.description,
            marked: task.state === 'COMPLETE'
          }
        });

        dispatch(receiveTasks(tasks));
      });

    });
  };
};

