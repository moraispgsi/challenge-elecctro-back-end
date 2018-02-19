"use strict";
import uuidv4 from 'uuid/v4'

export default class TaskCache {

  constructor(client) {
    this.client = client;
  }

  static createTask (description) {
    return {
      id: uuidv4(),
      state: INCOMPLETE,
      description,
      dateAdded: (new Date()).toISOString()
    }
  }

  async getTasks() {
    const key = { id: 'tasks', segment: 'tasks' };
    let value = await this.client.get(key);
    if(!value) {
      let tasks = [];
      await this.client.set(key, tasks);
      return [];
    }
    return value.item;
  }

  async setTasks(tasks) {
    const key = { id: 'tasks', segment: 'tasks' };
    return await this.client.set(key, tasks, 100000);
  }

  async getTask(id) {
    let tasks = await this.getTasks();
    return tasks.find((task) => task.id === id);
  }

  async addTask(description) {
    let tasks = await this.getTasks();
    let newTask = TaskCache.createTask(description);
    tasks.push(newTask);
    await this.setTasks(tasks);
    return newTask;
  }

  async removeTask(id) {
    if(!await this.getTask(id)) {
      return Boom.boomify(new Error('ID not found.'), { statusCode: 404 });
    }
    let tasks = await this.getTasks();
    tasks = tasks.filter((task) => !(task.id === id));
    await this.setTasks(tasks);
    return '';
  }

  async editTask(id, state, description) {
    let tasks = await this.getTasks();
    for(let task of tasks) {
      if(task.id === id) {
        if(task.state === COMPLETE){
          return Boom.boomify(new Error('Task is already complete.'), { statusCode: 400 });
        }
        task.state = state || task.state;
        task.description = description || task.description;
        await this.setTasks(tasks);

        return task;
      }
    }
    return Boom.boomify(new Error('ID not found.'), { statusCode: 404 });
  }
}

export const ALL = 'ALL';
export const COMPLETE = 'COMPLETE';
export const INCOMPLETE = 'INCOMPLETE';
export const DESCRIPTION = 'DESCRIPTION';
export const DATE_ADDED = 'DATE_ADDED';