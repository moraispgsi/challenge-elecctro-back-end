
import uuidv4 from 'uuid/v4'

const TTL = 1000000;
export const ALL = 'ALL';
export const COMPLETE = 'COMPLETE';
export const INCOMPLETE = 'INCOMPLETE';
export const DESCRIPTION = 'DESCRIPTION';
export const DATE_ADDED = 'DATE_ADDED';

export default class User {

  constructor(client, user) {
    this.client = client;
    this.id = user.id;
    this.profile = user.profile;
    this.tasks = user.tasks;
  }

  //Creates a task object
  static createTask (description) {
    return {
      id: uuidv4(),
      state: INCOMPLETE,
      description,
      dateAdded: (new Date()).toISOString()
    }
  }

  //Adds a new task without saving(locally)
  addTask(description) {
    this.tasks.push(User.createTask(description));
  }

  //Return task by id
  getTask(id) {
    let task = this.tasks.find((task) => task.id === id);
    if(!task) {
      return Boom.boomify(new Error('Task ID not found.'), { statusCode: 404 });
    }
    return task;
  }

  //gets all the tasks of the user
  getTasks() {
    return this.tasks;
  }

  //edits a task without saving(locally)
  editTask(id, state, description) {
    for(let task of this.tasks) {
      if(task.id === id) {
        if(task.state === COMPLETE){
          return Boom.boomify(new Error('Task is already complete.'), { statusCode: 400 });
        }
        task.state = state || task.state;
        task.description = description || task.description;
        return task;
      }
    }
    return Boom.boomify(new Error('Task ID not found.'), { statusCode: 404 });
  }

  //removes a task by id without saving(locally)
  removeTask(id) {
    if(!this.tasks.find((task) => task.id === id)) {
      return Boom.boomify(new Error('Task ID not found.'), { statusCode: 404 });
    }
    this.tasks = this.tasks.filter((task) => !(task.id === id));
  }

  //Saves the user data
  async save() {
    await User.setUser(this.client, this);
  }

  static async hasUser(client, id) {
    return (await User.getUsersList(client)).includes(id);
  }

  //Gets a list of the IDs of all users from the cache
  static async getUsersList(client) {
    const key = { id: 'users', segment: 'users' };
    let value = await client.get(key);
    if(!value) {
      let users = [];
      await client.set(key, users);
      return [];
    }
    return value.item;
  }

  //Gets an user by id from the cache
  static async getUser(client, id) {
    const keyUser = { id: id, segment: 'users' };
    let value = await client.get(keyUser);
    if(!value) {
      throw new Error('User does not exists.');
    }
    return new User(client, {
      id: id,
      profile: value.item.profile,
      tasks: value.item.tasks
    });
  }

  //Sets an user in the cache
  static async setUser(client, user) {
    const keyUser = { id: user.id, segment: 'users' };
    client.set(keyUser, {
      id: user.id,
      profile: user.profile,
      tasks: user.tasks,
    });
    const keyUsers = { id: 'users', segment: 'users' };
    let value = await client.get(keyUsers);
    let users;
    if(!value) {
      users = [user.id];
    } else {
      users = value.item;
      users.push(user.id);
    }
    await client.set(keyUsers, users);
  }

  //Adds an user in the cache
  static async addUser(client, profile, tasks) {
    const user = {
      id: uuidv4(),
      profile: profile,
      tasks: tasks,
    };
    const keyUser = { id: user.id, segment: 'users' };
    client.set(keyUser, user);

    const keyUsers = { id: 'users', segment: 'users' };
    let value = await client.get(keyUsers);
    let users;
    if(!value) {
      users = [user.id];
    } else {
      users = value.item;
      users.push(user.id);
    }
    await client.set(keyUsers, users);
    return new User(client, user);
  }

  //Removes an user from the cache
  static async removeUser(client, id) {
    const keyUser = { id: id, segment: 'users' };
    await client.drop(keyUser);

    const keyUsers = { id: 'users', segment: 'users' };
    let value = await client.get(keyUsers);
    if(!value) {
      let users = [];
      await client.set(keyUsers, users);
    }
  }

}