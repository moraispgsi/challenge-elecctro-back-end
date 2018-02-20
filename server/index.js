"use strict";

import Hapi from 'hapi'
import { Client } from 'catbox'
import catboxRedis from 'catbox-redis'
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
if(!process.env.REDIS_HOST) {
  throw new Error('REDIS_URL environmental variable is required');
}

const PASSWORD = process.env.PASSWORD || 'Password with at least 32 characters';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 8000;
const REDIRECT_URL = process.env.REDIRECT_URL || 'http://localhost:' + PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const UUID_VERSIONS = [
  'uuidv4'
];

const options = {
  partition: 'base',
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD
};

const client = new Client(catboxRedis, options);

const baseRoute = {
  method: 'GET',
  path: '/static/{param*}',
  config: {
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    handler: {
      directory: {
        path: 'build/static',
        listing: true
      }
    }
  }
};

const appRoute = {
  method: 'GET',
  path: '/',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: function (request, h) {
      return h.file('build/index.html');
    }
  }
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
  await user.save();
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
  await user.save();
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

const removeTaskHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return Boom.unauthorized(request.auth.error.message);
  }
  const user = request.auth.credentials;
  const result = user.removeTask(request.params.id);
  await user.save();
  return result || '';
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
  const profile = request.auth.credentials.profile;
  let user;
  if(await User.hasUser(client, profile.id)) {
    user = await User.getUser(client, profile.id);
  } else {
    user = await User.addUser(client, profile, []);
  }
  const sid = await User.setSessionKey(client, user);
  request.cookieAuth.set({ sid: sid });
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
  await User.removeSessionKey(client, h.request.state['sid'].sid);
  request.cookieAuth.clear();
  return h.redirect(`https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${REDIRECT_URL}`);
};

const logoutConfig = {
  auth: {
    strategy: 'session'
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

const server = Hapi.server({ host: '0.0.0.0', port: PORT, routes: { cors: true } });

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
    isSameSite: 'Lax',
    validateFunc: async (request, session) => {

      if(!session.sid) {
        return {
          valid: false
        }
      }
      try {
        const user = await User.getUserWithSessionID(client, session.sid);
        return {
          valid: await User.hasUser(client, user.id),
          credentials: user
        };
      } catch(err) {
        return {
          valid: false
        }
      }

    }
  });

  server.route([
    baseRoute,
    getTasksRoute,
    addTaskRoute,
    updateTaskRoute,
    removeTaskRoute,
    loginRoute,
    logoutRoute,
    appRoute,
  ]);

  server.auth.default('session');
  await server.start();
  console.log('Server running at:', server.info.uri);
}

startServer().then();



