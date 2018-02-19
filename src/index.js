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
import User, { COMPLETE, INCOMPLETE, DATE_ADDED, DESCRIPTION, ALL } from './user'

if(!process.env.CLIENT_ID) {
  throw new Error('CLIENT_ID environmental variable is required');
}
if(!process.env.CLIENT_SECRET) {
  throw new Error('CLIENT_SECRET environmental variable is required');
}

const PASSWORD = process.env.PASSWORD || 'Password with at least 32 characters';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 8000;
const REDIRECT_URL = process.env.REDIRECT_URL || 'http://localhost:' + PORT;

const UUID_VERSIONS = [
  'uuidv4'
];

const client = new Client(catboxMemory);

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
  if (!request.auth.isAuthenticated) {
    return Boom.unauthorized(request.auth.error.message);
  }
  const user = request.auth.credentials;
  const tasks = user.getTasks();
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
  if (!request.auth.isAuthenticated) {
    return Boom.unauthorized(request.auth.error.message);
  }
  const user = request.auth.credentials;
  const result = user.addTask(request.payload.description);
  user.save();
  return result;
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
  if (!request.auth.isAuthenticated) {
    return Boom.unauthorized(request.auth.error.message);
  }
  const user = request.auth.credentials;
  const result = user.editTask(request.params.id, request.payload.state, request.payload.description);
  user.save();
  return result;
};

const updateTaskValidate = {
  params: {
    id: Joi.string().guid({ version: UUID_VERSIONS }).required()
  },
  payload: Joi.object().keys({
    state: Joi.string().valid(COMPLETE, INCOMPLETE),
    description: Joi.string()
  }).or('state', 'description'),
  failAction: (request, h, error) => {
    return Boom.boomify(error, { statusCode: 400 });
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
  if (!request.auth.isAuthenticated) {
    return Boom.unauthorized(request.auth.error.message);
  }

  const user = request.auth.credentials;
  const result = user.removeTask(request.params.id);
  user.save();
  return result;
};

const removeTaskValidate = {
  params: {
    id: Joi.string().guid({ version:  UUID_VERSIONS }).required()
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
    return Boom.unauthorized(request.auth.error.message);
  }

  //Creating new user
  const profile = request.auth.credentials;
  const user = await User.addUser(client, profile, []);
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


//  __    _____ _____ _____ _____ _____
// |  |  |     |   __|     |  |  |_   _|
// |  |__|  |  |  |  |  |  |  |  | | |
// |_____|_____|_____|_____|_____| |_|
//

const logoutHandler = async (request, h) => {
  request.cookieAuth.clear();
  return h.redirect('https://accounts.google.com/logout');
};

const logoutConfig = {
  auth: {
    strategy: 'session',
  },
  handler: logoutHandler
};

const logoutRoute = {
  method: 'GET',
  path: '/logout',
  config: logoutConfig
};


//  _____ _____ _____ _____ _____ _____
// |   __|   __| __  |  |  |   __| __  |
// |__   |   __|    -|  |  |   __|    -|
// |_____|_____|__|__|\___/|_____|__|__|
//

const server = Hapi.server({ host: '0.0.0.0', port: PORT });

async function startServer() {
  await client.start();
  await server.register([Bell, CookieAuth, Vision, Inert, Lout]);

  server.auth.strategy('google', 'bell', {
    provider: 'google',
    isSecure: false,
    password: PASSWORD,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    location: REDIRECT_URL,
  });

  server.auth.strategy('session', 'cookie', {
    password: PASSWORD, //used for cookie-encoding, the string could be anything
    cookie: 'sid',
    redirectTo: '/login',
    redirectOnTry: false,
    isSecure: false,
    validateFunc: async (request, session) => {

      console.log('ValidateFunc', session.sid)
      if(!session.sid) {
        return {
          valid: false
        }
      }
      const user = await User.getUser(client, session.sid);
      return {
        valid: await User.hasUser(client, session.sid),
        credentials: user
      };
    }
  });

  server.route([
    baseRoute,
    getTasksRoute,
    addTaskRoute,
    updateTaskRoute,
    removeTaskRoute,
    loginRoute,
    logoutRoute
  ]);

  server.auth.default('session');
  await server.start();
  console.log('Server running at:', server.info.uri);
}

startServer().then();



