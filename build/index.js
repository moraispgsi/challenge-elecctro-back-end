"use strict";

var startServer = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return client.start();

          case 2:
            _context3.next = 4;
            return server.register([_bell2.default, _hapiAuthCookie2.default]);

          case 4:
            _context3.next = 6;
            return userCache.addUser('root', 'root');

          case 6:

            server.auth.strategy('google', 'bell', {
              provider: 'google',
              password: process.env.password,
              isSecure: false,
              clientId: process.env.clientId,
              clientSecret: process.env.clientSecret,
              location: process.env.redirectURL
            });

            server.auth.strategy('session', 'cookie', {
              password: process.env.password, //used for cookie-encoding, the string could be anything
              cookie: 'sid',
              redirectTo: '/login',
              redirectOnTry: false,
              isSecure: false,
              validateFunc: function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, session, callback) {
                  var user, out;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return userCache.hasUser(session.sid);

                        case 2:
                          user = _context2.sent;
                          out = {
                            valid: !!user
                          };


                          if (out.valid) {
                            out.credentials = user.profile;
                          }

                          return _context2.abrupt('return', out);

                        case 6:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this);
                }));

                return function validateFunc(_x3, _x4, _x5) {
                  return _ref3.apply(this, arguments);
                };
              }()
            });

            server.route([routeAddTodos, routeUpdateTodo, routeGetTodos, routeRemoveTodo, routeLogin]);

            server.auth.default('session');
            _context3.next = 12;
            return server.start();

          case 12:
            console.log('Server running at:', server.info.uri);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function startServer() {
    return _ref2.apply(this, arguments);
  };
}();

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _catbox = require('catbox');

var _catboxMemory = require('catbox-memory');

var _catboxMemory2 = _interopRequireDefault(_catboxMemory);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _bell = require('bell');

var _bell2 = _interopRequireDefault(_bell);

var _hapiAuthCookie = require('hapi-auth-cookie');

var _hapiAuthCookie2 = _interopRequireDefault(_hapiAuthCookie);

var _userCache = require('./user-cache');

var _userCache2 = _interopRequireDefault(_userCache);

var _taskCache = require('./task-cache');

var _taskCache2 = _interopRequireDefault(_taskCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var client = new _catbox.Client(_catboxMemory2.default);
var userCache = new _userCache2.default(client);
var taskCache = new _taskCache2.default(client);

var routeGetTodos = {
  method: 'GET',
  path: '/todos',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: function handler(request, h) {

      return userCache.getTasks().then(function (tasks) {

        return tasks.filter(function (task) {
          switch (request.query.filter) {
            case _taskCache.ALL:
              return true;
            case _taskCache.COMPLETE:
              return task.state === _taskCache.COMPLETE;
            case _taskCache.INCOMPLETE:
              return task.state === _taskCache.INCOMPLETE;
            default:
              return true;
          }
        }).sort(function (taskA, taskB) {
          switch (request.query.orderBy) {
            case _taskCache.DESCRIPTION:
              return taskA.description.localeCompare(taskB.description);
              break;
            case _taskCache.DATE_ADDED:
              return new Date(taskA.dateAdded) > new Date(taskB.dateAdded);
          }
        });
      });
    },
    validate: {
      query: {
        filter: _joi2.default.string().valid(_taskCache.COMPLETE, _taskCache.INCOMPLETE, _taskCache.ALL).optional(),
        orderBy: _joi2.default.string().valid(_taskCache.DESCRIPTION, _taskCache.DATE_ADDED).optional()
      },
      failAction: function failAction(request, h, error) {
        return _boom2.default.boomify(error, { statusCode: 400 });
      }
    }
  }
};

var routeAddTodos = {
  method: 'PUT',
  path: '/todos',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: function handler(request, h) {
      return userCache.addTask(request.payload.description).then(function (task) {
        return task;
      });
    },
    validate: {
      payload: _joi2.default.object().required().keys({
        description: _joi2.default.string().min(1).max(60).required()
      }),
      failAction: function failAction(request, h, error) {
        return _boom2.default.boomify(error, { statusCode: 400 });
      }
    }
  }
};

var routeUpdateTodo = {
  method: 'PATCH',
  path: '/todo/{id}',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: function handler(request, h) {
      return userCache.editTask(request.params.id, request.payload.state, request.payload.description);
    },
    validate: {
      params: {
        id: _joi2.default.string().required()
      },
      payload: _joi2.default.object().keys({
        state: _joi2.default.string().valid(_taskCache.COMPLETE, _taskCache.INCOMPLETE),
        description: _joi2.default.string()
      }).or('state', 'description'),
      failAction: function failAction(request, h, error) {
        //TODO - 400 status for the payload and 404 for params
        return _boom2.default.boomify(error, { statusCode: 404 });
      }
    }
  }
};

var routeRemoveTodo = {
  method: 'DELETE',
  path: '/todo/{id}',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: function handler(request, h) {
      return userCache.removeTask(request.params.id);
    },
    validate: {
      params: {
        id: _joi2.default.string().required()
      },
      failAction: function failAction(request, h, error) {
        return _boom2.default.boomify(error, { statusCode: 404 });
      }
    }
  }
};

var routeLogin = {
  method: ['GET', 'POST'],
  path: '/login',
  config: {
    auth: {
      strategy: 'google'
    },
    handler: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, h) {
        var profile, user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (request.auth.isAuthenticated) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', 'Authentication failed with error: ' + request.auth.error.message);

              case 2:
                profile = request.auth.credentials;
                _context.next = 5;
                return userCache.addUser(profile);

              case 5:
                user = _context.sent;

                request.cookieAuth.set({ sid: user.id });

                return _context.abrupt('return', h.redirect(request.query.next));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function handler(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  }
};

var server = _hapi2.default.server({ host: '0.0.0.0', port: process.env.PORT });

startServer();