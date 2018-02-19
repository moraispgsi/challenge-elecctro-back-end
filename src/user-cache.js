"use strict";
import uuidv4 from 'uuid/v4'

export default class UserCache {

  constructor(client) {
    this.client = client;
  }

  static createUser(profile) {
    return {
      id: uuidv4(),
      profile
    }
  }

  async getUsers() {
    const key = { id: 'users', segment: 'users' };
    let value = await this.client.get(key);
    if(!value) {
      let users = [];
      await this.client.set(key, users);
      return [];
    }
    return value.item;
  }

  async setUsers(users) {
    const key = { id: 'users', segment: 'users' };
    await this.client.set(key, users, 100000);
  }

  async addUser(profile) {
    let users = await this.getUsers();
    let newUser = UserCache.createUser(profile);
    users.push(newUser);
    await this.setUsers(users);
    return newUser;
  }

  async getUser(id) {
    let users = await this.getUsers();
    for(let user of users) {
      if(id === user.id) {
        return user;
      }
    }
    return null;
  }

  async hasUser(id) {
    let users = await this.getUsers();
    for(let user of users) {
      if(id === user.id) {
        return true;
      }
    }
    return false;
  }

}
