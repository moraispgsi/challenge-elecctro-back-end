"use strict";

var startServer = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return client.start();

          case 2:
            _context8.next = 4;
            return server.register([_bell2.default, _hapiAuthCookie2.default, _vision2.default, _inert2.default, _lout2.default]);

          case 4:

            server.auth.strategy('google', 'bell', {
              provider: 'google',
              isSecure: false,
              password: PASSWORD,
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              location: REDIRECT_URL
            });

            server.auth.strategy('session', 'cookie', {
              password: PASSWORD, //used for cookie-encoding, the string could be anything
              cookie: 'sid',
              redirectTo: '/login',
              redirectOnTry: false,
              isSecure: false,
              validateFunc: function () {
                var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(request, session) {
                  var user;
                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          if (session.sid) {
                            _context7.next = 2;
                            break;
                          }

                          return _context7.abrupt('return', {
                            valid: false
                          });

                        case 2:
                          _context7.prev = 2;
                          _context7.next = 5;
                          return _user2.default.getUserWithSessionID(client, session.sid);

                        case 5:
                          user = _context7.sent;
                          _context7.next = 8;
                          return _user2.default.hasUser(client, user.id);

                        case 8:
                          _context7.t0 = _context7.sent;
                          _context7.t1 = user;
                          return _context7.abrupt('return', {
                            valid: _context7.t0,
                            credentials: _context7.t1
                          });

                        case 13:
                          _context7.prev = 13;
                          _context7.t2 = _context7['catch'](2);
                          return _context7.abrupt('return', {
                            valid: false
                          });

                        case 16:
                        case 'end':
                          return _context7.stop();
                      }
                    }
                  }, _callee7, _this, [[2, 13]]);
                }));

                return function validateFunc(_x13, _x14) {
                  return _ref8.apply(this, arguments);
                };
              }()
            });

            server.route([baseRoute, getTasksRoute, addTaskRoute, updateTaskRoute, removeTaskRoute, loginRoute, logoutRoute, appRoute]);

            server.auth.default('session');
            _context8.next = 10;
            return server.start();

          case 10:
            console.log('Server running at:', server.info.uri);

          case 11:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function startServer() {
    return _ref7.apply(this, arguments);
  };
}();

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _catbox = require('catbox');

var _catboxRedis = require('catbox-redis');

var _catboxRedis2 = _interopRequireDefault(_catboxRedis);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _bell = require('bell');

var _bell2 = _interopRequireDefault(_bell);

var _vision = require('vision');

var _vision2 = _interopRequireDefault(_vision);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _lout = require('lout');

var _lout2 = _interopRequireDefault(_lout);

var _hapiAuthCookie = require('hapi-auth-cookie');

var _hapiAuthCookie2 = _interopRequireDefault(_hapiAuthCookie);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

if (!process.env.CLIENT_ID) {
  throw new Error('CLIENT_ID environmental variable is required');
}
if (!process.env.CLIENT_SECRET) {
  throw new Error('CLIENT_SECRET environmental variable is required');
}
if (!process.env.REDIS_HOST) {
  throw new Error('REDIS_URL environmental variable is required');
}

var PASSWORD = process.env.PASSWORD || 'Password with at least 32 characters';
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var PORT = process.env.PORT || 8000;
var REDIRECT_URL = process.env.REDIRECT_URL || 'http://localhost:' + PORT;
var REDIS_HOST = process.env.REDIS_HOST;
var REDIS_PORT = process.env.REDIS_PORT;
var REDIS_PASSWORD = process.env.REDIS_PASSWORD;

var UUID_VERSIONS = ['uuidv4'];

var options = {
  partition: 'base',
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD
};

var client = new _catbox.Client(_catboxRedis2.default, options);

var baseRoute = {
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

var appRoute = {
  method: 'GET',
  path: '/',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: function handler(request, h) {
      return h.file('build/index.html');
    }
  }
};

//  _____ _____ _____    _____ _____ _____ _____ _____
// |   __|   __|_   _|  |_   _|  _  |   __|  |  |   __|
// |  |  |   __| | |      | | |     |__   |    -|__   |
// |_____|_____| |_|      |_| |__|__|_____|__|__|_____|
//

var getTasksHandler = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, h) {
    var user, tasks;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (request.auth.isAuthenticated) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', _boom2.default.unauthorized(request.auth.error.message));

          case 2:
            user = request.auth.credentials;
            tasks = user.getTasks();
            return _context.abrupt('return', tasks.filter(function (task) {
              switch (request.query.filter) {
                case _user.ALL:
                  return true;
                case _user.COMPLETE:
                  return task.state === _user.COMPLETE;
                case _user.INCOMPLETE:
                  return task.state === _user.INCOMPLETE;
                default:
                  return true;
              }
            }).sort(function (taskA, taskB) {
              switch (request.query.orderBy) {
                case _user.DESCRIPTION:
                  return taskA.description.localeCompare(taskB.description);
                  break;
                case _user.DATE_ADDED:
                  return new Date(taskA.dateAdded) > new Date(taskB.dateAdded);
              }
            }));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getTasksHandler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getTasksValidate = {
  query: {
    filter: _joi2.default.string().valid(_user.COMPLETE, _user.INCOMPLETE, _user.ALL).optional(),
    orderBy: _joi2.default.string().valid(_user.DESCRIPTION, _user.DATE_ADDED).optional()
  },
  failAction: function failAction(request, h, error) {
    return _boom2.default.boomify(error, { statusCode: 400 });
  }
};

var getTasksConfig = {
  auth: {
    strategy: 'session'
  },
  handler: getTasksHandler,
  validate: getTasksValidate
};

var getTasksRoute = {
  method: 'GET',
  path: '/todos',
  config: getTasksConfig
};

//  _____ ____  ____     _____ _____ _____ _____ _____
// |  _  |    \|    \   |_   _|  _  |   __|  |  |   __|
// |     |  |  |  |  |    | | |     |__   |    -|__   |
// |__|__|____/|____/     |_| |__|__|_____|__|__|_____|
//

var addTaskHandler = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, h) {
    var user, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (request.auth.isAuthenticated) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', _boom2.default.unauthorized(request.auth.error.message));

          case 2:
            user = request.auth.credentials;
            result = user.addTask(request.payload.description);
            _context2.next = 6;
            return user.save();

          case 6:
            return _context2.abrupt('return', result);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function addTaskHandler(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var addTaskValidate = {
  payload: _joi2.default.object().required().keys({
    description: _joi2.default.string().min(1).max(60).required()
  }),
  failAction: function failAction(request, h, error) {
    return _boom2.default.boomify(error, { statusCode: 400 });
  }
};

var addTaskConfig = {
  auth: {
    strategy: 'session'
  },
  handler: addTaskHandler,
  validate: addTaskValidate
};

var addTaskRoute = {
  method: 'PUT',
  path: '/todos',
  config: addTaskConfig
};

//  _____ _____ ____  _____ _____ _____    _____ _____ _____ _____
// |  |  |  _  |    \|  _  |_   _|   __|  |_   _|  _  |   __|  |  |
// |  |  |   __|  |  |     | | | |   __|    | | |     |__   |    -|
// |_____|__|  |____/|__|__| |_| |_____|    |_| |__|__|_____|__|__|
//

var updateTaskHandler = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, h) {
    var user, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (request.auth.isAuthenticated) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt('return', _boom2.default.unauthorized(request.auth.error.message));

          case 2:
            user = request.auth.credentials;
            result = user.editTask(request.params.id, request.payload.state, request.payload.description);
            _context3.next = 6;
            return user.save();

          case 6:
            return _context3.abrupt('return', result);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function updateTaskHandler(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var updateTaskValidate = {
  params: {
    id: _joi2.default.string().guid({ version: UUID_VERSIONS }).required()
  },
  payload: _joi2.default.object().keys({
    state: _joi2.default.string().valid(_user.COMPLETE, _user.INCOMPLETE),
    description: _joi2.default.string()
  }).or('state', 'description'),
  failAction: function failAction(request, h, error) {
    return _boom2.default.boomify(error, { statusCode: 400 });
  }
};

var updateTaskConfig = {
  auth: {
    strategy: 'session'
  },
  handler: updateTaskHandler,
  validate: updateTaskValidate
};

var updateTaskRoute = {
  method: 'PATCH',
  path: '/todo/{id}',
  config: updateTaskConfig
};

//  _____ _____ _____ _____ _____ _____    _____ _____ _____ _____
// | __  |   __|     |     |  |  |   __|  |_   _|  _  |   __|  |  |
// |    -|   __| | | |  |  |  |  |   __|    | | |     |__   |    -|
// |__|__|_____|_|_|_|_____|\___/|_____|    |_| |__|__|_____|__|__|
//

var removeTaskHandler = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, h) {
    var user, result;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (request.auth.isAuthenticated) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt('return', _boom2.default.unauthorized(request.auth.error.message));

          case 2:
            user = request.auth.credentials;
            result = user.removeTask(request.params.id);
            _context4.next = 6;
            return user.save();

          case 6:
            return _context4.abrupt('return', result || '');

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function removeTaskHandler(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var removeTaskValidate = {
  params: {
    id: _joi2.default.string().guid({ version: UUID_VERSIONS }).required()
  },
  failAction: function failAction(request, h, error) {
    return _boom2.default.boomify(error, { statusCode: 404 });
  }
};

var removeTaskConfig = {
  auth: {
    strategy: 'session'
  },
  handler: removeTaskHandler,
  validate: removeTaskValidate
};

var removeTaskRoute = {
  method: 'DELETE',
  path: '/todo/{id}',
  config: removeTaskConfig
};

//  __    _____ _____ _____ _____
// |  |  |     |   __|     |   | |
// |  |__|  |  |  |  |-   -| | | |
// |_____|_____|_____|_____|_|___|
//

var loginHandler = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, h) {
    var profile, user, sid;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (request.auth.isAuthenticated) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt('return', _boom2.default.unauthorized(request.auth.error.message));

          case 2:

            //Creating new user
            profile = request.auth.credentials.profile;
            user = void 0;
            _context5.next = 6;
            return _user2.default.hasUser(client, profile.id);

          case 6:
            if (!_context5.sent) {
              _context5.next = 12;
              break;
            }

            _context5.next = 9;
            return _user2.default.getUser(client, profile.id);

          case 9:
            user = _context5.sent;
            _context5.next = 15;
            break;

          case 12:
            _context5.next = 14;
            return _user2.default.addUser(client, profile, []);

          case 14:
            user = _context5.sent;

          case 15:
            _context5.next = 17;
            return _user2.default.setSessionKey(client, user);

          case 17:
            sid = _context5.sent;

            request.cookieAuth.set({ sid: sid });
            return _context5.abrupt('return', h.redirect('/'));

          case 20:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function loginHandler(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var loginConfig = {
  auth: {
    strategy: 'google'
  },
  handler: loginHandler
};

var loginRoute = {
  method: ['GET', 'POST'],
  path: '/login',
  config: loginConfig
};

//  __    _____ _____ _____ _____ _____
// |  |  |     |   __|     |  |  |_   _|
// |  |__|  |  |  |  |  |  |  |  | | |
// |_____|_____|_____|_____|_____| |_|
//

var logoutHandler = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, h) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _user2.default.removeSessionKey(client, h.request.state['sid'].sid);

          case 2:
            request.cookieAuth.clear();
            return _context6.abrupt('return', h.redirect('https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' + REDIRECT_URL));

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function logoutHandler(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var logoutConfig = {
  auth: false,
  handler: logoutHandler
};

var logoutRoute = {
  method: 'GET',
  path: '/logout',
  config: logoutConfig
};

//  _____ _____ _____ _____ _____ _____
// |   __|   __| __  |  |  |   __| __  |
// |__   |   __|    -|  |  |   __|    -|
// |_____|_____|__|__|\___/|_____|__|__|
//

var server = _hapi2.default.server({ host: '0.0.0.0', port: PORT, routes: { cors: true } });

startServer().then();