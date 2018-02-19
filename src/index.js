"use strict";

import Hapi from 'hapi'
import { Client } from 'catbox'
import catboxMemory from 'catbox-memory'
import uuidv4 from 'uuid/v4'
import Joi from 'joi'
import Boom from 'boom'
import Bell from 'bell'
import CookieAuth from 'hapi-auth-cookie'
import passwordHash from 'password-hash'


const ALL = 'ALL';
const COMPLETE = 'COMPLETE';
const INCOMPLETE = 'INCOMPLETE';
const DESCRIPTION = 'DESCRIPTION';
const DATE_ADDED = 'DATE_ADDED';

const client = new Client(catboxMemory);


function createUser(username, password) {
  return {
    id: uuidv4(),
    username,
    password: passwordHash.generate(password)
  }
}

async function getUsers() {
  const key = { id: 'users', segment: 'users' };
  let value = await client.get(key);
  if(!value) {
    let users = [];
    await client.set(key, users);
    return [];
  }
  return value.item;
}

async function setUsers(users) {
  const key = { id: 'users', segment: 'users' };
  await client.set(key, users, 100000);
}

async function addUser(username, password) {
  let users = await getUsers();
  let newUser = createUser(username, password);
  users.push(newUser);
  await setUsers(users);
  return newUser;
}

async function existsUser(username, password) {
  let users = await getUsers();
  console.log('user', username);
  console.log('password', password);
  for(let user of users) {
    console.log(user.password);
    console.log(passwordHash.verify(password, user.password))
    if (user.username === username &&
      passwordHash.verify(password, user.password)) {
      return true;
    }
  }
  return false;
}



function createTask (description) {
  return {
    id: uuidv4(),
    state: INCOMPLETE,
    description,
    dateAdded: (new Date()).toISOString()
  }
}

async function getTasks() {
  const key = { id: 'tasks', segment: 'tasks' };
  let value = await client.get(key);
  if(!value) {
    let tasks = [];
    await client.set(key, tasks);
    return [];
  }
  return value.item;
}

async function setTasks(tasks) {
  const key = { id: 'tasks', segment: 'tasks' };
  return await client.set(key, tasks, 100000);
}

async function getTask(id) {
  let tasks = await getTasks();
  return tasks.find((task) => task.id === id);
}

async function addTask(description) {
  let tasks = await getTasks();
  let newTask = createTask(description);
  tasks.push(newTask);
  await setTasks(tasks);
  return newTask;
}

async function removeTask(id) {
  if(!await getTask(id)) {
    return Boom.boomify(new Error('ID not found.'), { statusCode: 404 });
  }
  let tasks = await getTasks();
  tasks = tasks.filter((task) => !(task.id === id));
  await setTasks(tasks);
  return '';
}

async function editTask(id, state, description) {
  let tasks = await getTasks();
  for(let task of tasks) {
    if(task.id === id) {
      if(task.state === COMPLETE){
        return Boom.boomify(new Error('Task is already complete.'), { statusCode: 400 });
      }
      task.state = state || task.state;
      task.description = description || task.description;
      await setTasks(tasks);

      return task;
    }
  }
  return Boom.boomify(new Error('ID not found.'), { statusCode: 404 });
}

const routeGetTodos = {
  method: 'GET',
  path: '/todos',
  config: {
    handler: (request, h) => {
      return getTasks().then((tasks) => {

        return tasks.filter((task) => {
          switch(request.query.filter){
            case ALL:
              return true;
            case COMPLETE:
              return task.state === COMPLETE;
            case INCOMPLETE:
              return task.state === INCOMPLETE;
            default:
              return true;
          }
        }).sort((taskA, taskB) => {
          switch(request.query.orderBy) {
            case DESCRIPTION:
              return taskA.description.localeCompare(taskB.description);
              break;
            case DATE_ADDED:
              return new Date(taskA.dateAdded) > new Date(taskB.dateAdded);
          }
        })

      });
    },
    validate: {
      query: {
        filter: Joi.string().valid(COMPLETE, INCOMPLETE, ALL).optional(),
        orderBy: Joi.string().valid(DESCRIPTION, DATE_ADDED).optional()
      },
      failAction: (request, h, error) => {
        return Boom.boomify(error, { statusCode: 400 });
      }
    }
  }
};

const routeAddTodos =  {
  method: 'PUT',
  path: '/todos',
  config:{
    handler: (request, h) => {
      return addTask(request.payload.description).then((task) => {
        return task;
      });
    },
    validate: {
      payload: Joi.object().required().keys({
        description: Joi.string().min(1).max(60).required()
      }),
      failAction: (request, h, error) => {
        return Boom.boomify(error, { statusCode: 400 });
      }
    }
  }
};

const routeUpdateTodo = {
  method: 'PATCH',
  path: '/todo/{id}',
  config:{
    handler: (request, h) => {
      return editTask(request.params.id, request.payload.state, request.payload.description);
    },
    validate: {
      params: {
        id: Joi.string().required()
      },
      payload: Joi.object().keys({
        state: Joi.string().valid(COMPLETE, INCOMPLETE),
        description: Joi.string()
      }).or('state', 'description'),
      failAction: (request, h, error) => {
        //TODO - 400 status for the payload and 404 for params
        return Boom.boomify(error, { statusCode: 404 });
      }
    }
  }
};

const routeRemoveTodo = {
  method: 'DELETE',
  path: '/todo/{id}',
  config: {
    handler: (request, h) => {
      return removeTask(request.params.id);
    },
    validate: {
      params: {
        id: Joi.string().required()
      },
      failAction: (request, h, error) => {
        return Boom.boomify(error, { statusCode: 404 });
      }
    }
  }
};

const routeLogin = {
  method: '*', // Must handle both GET and POST
  path: '/bell/door',          // The callback endpoint registered with the provider
  config: {
    auth: {
      strategy: 'google',
      mode: 'try'
    },
    handler: function (request, h) {


      console.log(JSON.stringify(request.auth.credentials, null, 4))
      if (!request.auth.isAuthenticated) {
        return 'Authentication failed'  + request.auth.error.message;
      }


      // Perform any account lookup or registration, setup local session,
      // and redirect to the application. The third-party credentials are
      // stored in request.auth.credentials. Any query parameters from
      // the initial request are passed back via request.auth.credentials.query.
      return 'Teste';
    }
  }
};

const routeLogout = {
  method: 'GET',
  path: '/logout',
  options: {
    handler: (request, h) => {
      request.server.app.cache.drop(request.state['sid-example'].sid);
      request.cookieAuth.clear();
      return 'logged out';
    }
  }
};

const routeIndex = {
  method: 'GET',
  path: '/',
  config: {
    auth: {
      strategy: 'session', //authorisation is of 'hapi-auth-cookie' type
      mode: 'try' //allows you to proceed to a path handler even if not authenticated
    },
    handler: function (request, h) {
      if(request.auth.isAuthenticated) { //isAuthenticated is true if the user has successfully logged in
        return 'good';
      }
      else {
        return 'bad';
      }
    }
  }
};

const server = Hapi.server({ host: '0.0.0.0', port: process.env.PORT });

async function startServer() {
  await client.start();
  await server.register([Bell, CookieAuth]);

  await addUser('root', 'root');

  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: process.env.password,
    isSecure: false,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    location: process.env.redirectURL
  });

  /*
  server.auth.strategy('session', 'cookie', {
    password: process.env.password, //used for cookie-encoding, the string could be anything
    cookie: 'sid',
    redirectTo: '/login',
    redirectOnTry: false,
    isSecure: false
  });
  */
  server.route([
    routeAddTodos,
    routeUpdateTodo,
    routeGetTodos,
    routeRemoveTodo,
    routeLogin,
    routeLogout,
    routeIndex
  ]);

  server.auth.default('session');
  await server.start();
  console.log('Server running at:', server.info.uri);
}

startServer();



