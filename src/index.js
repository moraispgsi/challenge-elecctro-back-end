"use strict";

import Hapi from 'hapi'
import { Client } from 'catbox'
import catboxMemory from 'catbox-memory'
import uuidv4 from 'uuid/v4'
import Joi from 'joi'
import Boom from 'boom'
import Bell from 'bell'
import Vision from 'vision'
import Inert from 'inert'
import Lout from 'lout'

import CookieAuth from 'hapi-auth-cookie'
import UserCache from './user-cache'
import TaskCache, { COMPLETE, INCOMPLETE, DATE_ADDED, DESCRIPTION, ALL } from './task-cache'

const client = new Client(catboxMemory);
const userCache = new UserCache(client);
const taskCache = new TaskCache(client);


const baseHandler = async (request, h) => {
  return 'HOME';
};

const baseConfig = {
  auth: {
    strategy: 'session'
  },
  handler: baseHandler,
};

const baseRoute = {
  method: 'GET',
  path: '/',
  config: baseConfig
};


//  _____ _____ _____    _____ _____ _____ _____ _____
// |   __|   __|_   _|  |_   _|  _  |   __|  |  |   __|
// |  |  |   __| | |      | | |     |__   |    -|__   |
// |_____|_____| |_|      |_| |__|__|_____|__|__|_____|
//

const getTasksHandler = async (request, h) => {
  const tasks = await taskCache.getTasks();
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
};

const getTasksValidate = {
  query: {
    filter: Joi.string().valid(COMPLETE, INCOMPLETE, ALL).optional(),
    orderBy: Joi.string().valid(DESCRIPTION, DATE_ADDED).optional()
  },
  failAction: (request, h, error) => {
    return Boom.boomify(error, { statusCode: 400 });
  }
};

const getTasksConfig = {
  auth: {
    strategy: 'session'
  },
  handler: getTasksHandler,
  validate: getTasksValidate
};

const getTasksRoute = {
  method: 'GET',
  path: '/todos',
  config: getTasksConfig
};


//  _____ ____  ____     _____ _____ _____ _____ _____
// |  _  |    \|    \   |_   _|  _  |   __|  |  |   __|
// |     |  |  |  |  |    | | |     |__   |    -|__   |
// |__|__|____/|____/     |_| |__|__|_____|__|__|_____|
//

const addTaskHandler = async (request, h) => {
  return await taskCache.addTask(request.payload.description);
};

const addTaskValidate = {
  payload: Joi.object().required().keys({
    description: Joi.string().min(1).max(60).required()
  }),
  failAction: (request, h, error) => {
    return Boom.boomify(error, { statusCode: 400 });
  }
};

const addTaskConfig = {
  auth: {
    strategy: 'session'
  },
  handler: addTaskHandler,
  validate: addTaskValidate
};

const addTaskRoute =  {
  method: 'PUT',
  path: '/todos',
  config: addTaskConfig
};


//  _____ _____ ____  _____ _____ _____    _____ _____ _____ _____
// |  |  |  _  |    \|  _  |_   _|   __|  |_   _|  _  |   __|  |  |
// |  |  |   __|  |  |     | | | |   __|    | | |     |__   |    -|
// |_____|__|  |____/|__|__| |_| |_____|    |_| |__|__|_____|__|__|
//

const updateTaskHandler = async (request, h) => {
  return await taskCache.editTask(request.params.id, request.payload.state, request.payload.description);
};

const updateTaskValidate = {
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
};

const updateTaskConfig = {
  auth: {
    strategy: 'session'
  },
  handler: updateTaskHandler,
  validate: updateTaskValidate
};

const updateTaskRoute = {
  method: 'PATCH',
  path: '/todo/{id}',
  config: updateTaskConfig
};


//  _____ _____ _____ _____ _____ _____    _____ _____ _____ _____
// | __  |   __|     |     |  |  |   __|  |_   _|  _  |   __|  |  |
// |    -|   __| | | |  |  |  |  |   __|    | | |     |__   |    -|
// |__|__|_____|_|_|_|_____|\___/|_____|    |_| |__|__|_____|__|__|
//

const removeTaskHandler = (request, h) => {
  return taskCache.removeTask(request.params.id);
};

const removeTaskValidate = {
  params: {
    id: Joi.string().required()
  },
  failAction: (request, h, error) => {
    return Boom.boomify(error, { statusCode: 404 });
  }
};

const removeTaskConfig =  {
  auth: {
    strategy: 'session'
  },
  handler: removeTaskHandler,
  validate: removeTaskValidate
};

const removeTaskRoute = {
  method: 'DELETE',
  path: '/todo/{id}',
  config: removeTaskConfig
};


//  __    _____ _____ _____ _____
// |  |  |     |   __|     |   | |
// |  |__|  |  |  |  |-   -| | | |
// |_____|_____|_____|_____|_|___|
//

const loginHandler = async (request, h) => {

  if (!request.auth.isAuthenticated) {
    return 'Authentication failed with error: '  + request.auth.error.message;
  }

  const profile = request.auth.credentials;
  const user = await userCache.addUser(profile);
  request.cookieAuth.set({ sid: user.id });

  return h.redirect('/');

};

const loginConfig = {
  auth: {
    strategy: 'google',
  },
  handler: loginHandler
};

const loginRoute = {
  method: ['GET', 'POST'],
  path: '/login',
  config: loginConfig
};


//  _____ _____ _____ _____ _____ _____
// |   __|   __| __  |  |  |   __| __  |
// |__   |   __|    -|  |  |   __|    -|
// |_____|_____|__|__|\___/|_____|__|__|
//

const server = Hapi.server({ host: '0.0.0.0', port: process.env.PORT });

async function startServer() {
  await client.start();
  await server.register([Bell, CookieAuth, Vision, Inert, Lout]);

  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: process.env.password,
    isSecure: false,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    location: process.env.redirectURL,
  });

  server.auth.strategy('session', 'cookie', {
    password: process.env.password, //used for cookie-encoding, the string could be anything
    cookie: 'sid',
    redirectTo: '/login',
    redirectOnTry: false,
    isSecure: false,
    validateFunc: async (request, session, callback) => {
      const user = await userCache.hasUser(session.sid);
      const out = {
        valid: !!user
      };
      if (out.valid) {
        out.credentials = user.profile;
      }
      return out;
    }
  });

  server.route([
    baseRoute,
    getTasksRoute,
    addTaskRoute,
    updateTaskRoute,
    removeTaskRoute,
    loginRoute
  ]);

  server.auth.default('session');
  await server.start();
  console.log('Server running at:', server.info.uri);
}

startServer();



