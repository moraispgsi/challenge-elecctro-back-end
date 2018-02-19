"use strict";

var startServer = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return client.start();

          case 2:
            _context7.next = 4;
            return server.register([_bell2.default, _hapiAuthCookie2.default, _vision2.default, _inert2.default, _lout2.default]);

          case 4:

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
                var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, session, callback) {
                  var user, out;
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          _context6.next = 2;
                          return userCache.hasUser(session.sid);

                        case 2:
                          user = _context6.sent;
                          out = {
                            valid: !!user
                          };

                          if (out.valid) {
                            out.credentials = user.profile;
                          }
                          return _context6.abrupt('return', out);

                        case 6:
                        case 'end':
                          return _context6.stop();
                      }
                    }
                  }, _callee6, _this);
                }));

                return function validateFunc(_x11, _x12, _x13) {
                  return _ref7.apply(this, arguments);
                };
              }()
            });

            server.route([baseRoute, getTasksRoute, addTaskRoute, updateTaskRoute, removeTaskRoute, loginRoute]);

            server.auth.default('session');
            _context7.next = 10;
            return server.start();

          case 10:
            console.log('Server running at:', server.info.uri);

          case 11:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function startServer() {
    return _ref6.apply(this, arguments);
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

var _vision = require('vision');

var _vision2 = _interopRequireDefault(_vision);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _lout = require('lout');

var _lout2 = _interopRequireDefault(_lout);

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

var baseHandler = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, h) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', 'HOME');

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function baseHandler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var baseConfig = {
  auth: {
    strategy: 'session'
  },
  handler: baseHandler
};

var baseRoute = {
  method: 'GET',
  path: '/',
  config: baseConfig
};

//  _____ _____ _____    _____ _____ _____ _____ _____
// |   __|   __|_   _|  |_   _|  _  |   __|  |  |   __|
// |  |  |   __| | |      | | |     |__   |    -|__   |
// |_____|_____| |_|      |_| |__|__|_____|__|__|_____|
//

var getTasksHandler = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, h) {
    var tasks;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return taskCache.getTasks();

          case 2:
            tasks = _context2.sent;
            return _context2.abrupt('return', tasks.filter(function (task) {
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
            }));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getTasksHandler(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getTasksValidate = {
  query: {
    filter: _joi2.default.string().valid(_taskCache.COMPLETE, _taskCache.INCOMPLETE, _taskCache.ALL).optional(),
    orderBy: _joi2.default.string().valid(_taskCache.DESCRIPTION, _taskCache.DATE_ADDED).optional()
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
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, h) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return taskCache.addTask(request.payload.description);

          case 2:
            return _context3.abrupt('return', _context3.sent);

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function addTaskHandler(_x5, _x6) {
    return _ref3.apply(this, arguments);
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
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, h) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return taskCache.editTask(request.params.id, request.payload.state, request.payload.description);

          case 2:
            return _context4.abrupt('return', _context4.sent);

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function updateTaskHandler(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var updateTaskValidate = {
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

var removeTaskHandler = function removeTaskHandler(request, h) {
  return taskCache.removeTask(request.params.id);
};

var removeTaskValidate = {
  params: {
    id: _joi2.default.string().required()
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
    var profile, user;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (request.auth.isAuthenticated) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt('return', 'Authentication failed with error: ' + request.auth.error.message);

          case 2:
            profile = request.auth.credentials;
            _context5.next = 5;
            return userCache.addUser(profile);

          case 5:
            user = _context5.sent;

            request.cookieAuth.set({ sid: user.id });

            return _context5.abrupt('return', h.redirect('/'));

          case 8:
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

//  _____ _____ _____ _____ _____ _____
// |   __|   __| __  |  |  |   __| __  |
// |__   |   __|    -|  |  |   __|    -|
// |_____|_____|__|__|\___/|_____|__|__|
//

var server = _hapi2.default.server({ host: '0.0.0.0', port: process.env.PORT });

startServer();
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATE_ADDED = exports.DESCRIPTION = exports.INCOMPLETE = exports.COMPLETE = exports.ALL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskCache = function () {
  function TaskCache(client) {
    _classCallCheck(this, TaskCache);

    this.client = client;
  }

  _createClass(TaskCache, [{
    key: 'getTasks',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var key, value, tasks;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                key = { id: 'tasks', segment: 'tasks' };
                _context.next = 3;
                return this.client.get(key);

              case 3:
                value = _context.sent;

                if (value) {
                  _context.next = 9;
                  break;
                }

                tasks = [];
                _context.next = 8;
                return this.client.set(key, tasks);

              case 8:
                return _context.abrupt('return', []);

              case 9:
                return _context.abrupt('return', value.item);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTasks() {
        return _ref.apply(this, arguments);
      }

      return getTasks;
    }()
  }, {
    key: 'setTasks',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(tasks) {
        var key;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                key = { id: 'tasks', segment: 'tasks' };
                _context2.next = 3;
                return this.client.set(key, tasks, 100000);

              case 3:
                return _context2.abrupt('return', _context2.sent);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setTasks(_x) {
        return _ref2.apply(this, arguments);
      }

      return setTasks;
    }()
  }, {
    key: 'getTask',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id) {
        var tasks;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.getTasks();

              case 2:
                tasks = _context3.sent;
                return _context3.abrupt('return', tasks.find(function (task) {
                  return task.id === id;
                }));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getTask(_x2) {
        return _ref3.apply(this, arguments);
      }

      return getTask;
    }()
  }, {
    key: 'addTask',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(description) {
        var tasks, newTask;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.getTasks();

              case 2:
                tasks = _context4.sent;
                newTask = TaskCache.createTask(description);

                tasks.push(newTask);
                _context4.next = 7;
                return this.setTasks(tasks);

              case 7:
                return _context4.abrupt('return', newTask);

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function addTask(_x3) {
        return _ref4.apply(this, arguments);
      }

      return addTask;
    }()
  }, {
    key: 'removeTask',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(id) {
        var tasks;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getTask(id);

              case 2:
                if (_context5.sent) {
                  _context5.next = 4;
                  break;
                }

                return _context5.abrupt('return', Boom.boomify(new Error('ID not found.'), { statusCode: 404 }));

              case 4:
                _context5.next = 6;
                return this.getTasks();

              case 6:
                tasks = _context5.sent;

                tasks = tasks.filter(function (task) {
                  return !(task.id === id);
                });
                _context5.next = 10;
                return this.setTasks(tasks);

              case 10:
                return _context5.abrupt('return', '');

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function removeTask(_x4) {
        return _ref5.apply(this, arguments);
      }

      return removeTask;
    }()
  }, {
    key: 'editTask',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(id, state, description) {
        var tasks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, task;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.getTasks();

              case 2:
                tasks = _context6.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context6.prev = 6;
                _iterator = tasks[Symbol.iterator]();

              case 8:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context6.next = 21;
                  break;
                }

                task = _step.value;

                if (!(task.id === id)) {
                  _context6.next = 18;
                  break;
                }

                if (!(task.state === COMPLETE)) {
                  _context6.next = 13;
                  break;
                }

                return _context6.abrupt('return', Boom.boomify(new Error('Task is already complete.'), { statusCode: 400 }));

              case 13:
                task.state = state || task.state;
                task.description = description || task.description;
                _context6.next = 17;
                return this.setTasks(tasks);

              case 17:
                return _context6.abrupt('return', task);

              case 18:
                _iteratorNormalCompletion = true;
                _context6.next = 8;
                break;

              case 21:
                _context6.next = 27;
                break;

              case 23:
                _context6.prev = 23;
                _context6.t0 = _context6['catch'](6);
                _didIteratorError = true;
                _iteratorError = _context6.t0;

              case 27:
                _context6.prev = 27;
                _context6.prev = 28;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 30:
                _context6.prev = 30;

                if (!_didIteratorError) {
                  _context6.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context6.finish(30);

              case 34:
                return _context6.finish(27);

              case 35:
                return _context6.abrupt('return', Boom.boomify(new Error('ID not found.'), { statusCode: 404 }));

              case 36:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[6, 23, 27, 35], [28,, 30, 34]]);
      }));

      function editTask(_x5, _x6, _x7) {
        return _ref6.apply(this, arguments);
      }

      return editTask;
    }()
  }], [{
    key: 'createTask',
    value: function createTask(description) {
      return {
        id: (0, _v2.default)(),
        state: INCOMPLETE,
        description: description,
        dateAdded: new Date().toISOString()
      };
    }
  }]);

  return TaskCache;
}();

exports.default = TaskCache;
var ALL = exports.ALL = 'ALL';
var COMPLETE = exports.COMPLETE = 'COMPLETE';
var INCOMPLETE = exports.INCOMPLETE = 'INCOMPLETE';
var DESCRIPTION = exports.DESCRIPTION = 'DESCRIPTION';
var DATE_ADDED = exports.DATE_ADDED = 'DATE_ADDED';
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserCache = function () {
  function UserCache(client) {
    _classCallCheck(this, UserCache);

    this.client = client;
  }

  _createClass(UserCache, [{
    key: 'getUsers',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var key, value, users;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                key = { id: 'users', segment: 'users' };
                _context.next = 3;
                return this.client.get(key);

              case 3:
                value = _context.sent;

                if (value) {
                  _context.next = 9;
                  break;
                }

                users = [];
                _context.next = 8;
                return this.client.set(key, users);

              case 8:
                return _context.abrupt('return', []);

              case 9:
                return _context.abrupt('return', value.item);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getUsers() {
        return _ref.apply(this, arguments);
      }

      return getUsers;
    }()
  }, {
    key: 'setUsers',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(users) {
        var key;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                key = { id: 'users', segment: 'users' };
                _context2.next = 3;
                return this.client.set(key, users, 100000);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setUsers(_x) {
        return _ref2.apply(this, arguments);
      }

      return setUsers;
    }()
  }, {
    key: 'addUser',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(profile) {
        var users, newUser;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.getUsers();

              case 2:
                users = _context3.sent;
                newUser = UserCache.createUser(profile);

                users.push(newUser);
                _context3.next = 7;
                return this.setUsers(users);

              case 7:
                return _context3.abrupt('return', newUser);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function addUser(_x2) {
        return _ref3.apply(this, arguments);
      }

      return addUser;
    }()
  }, {
    key: 'getUser',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id) {
        var users, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.getUsers();

              case 2:
                users = _context4.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 6;
                _iterator = users[Symbol.iterator]();

              case 8:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 15;
                  break;
                }

                user = _step.value;

                if (!(id === user.id)) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt('return', user);

              case 12:
                _iteratorNormalCompletion = true;
                _context4.next = 8;
                break;

              case 15:
                _context4.next = 21;
                break;

              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4['catch'](6);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 21:
                _context4.prev = 21;
                _context4.prev = 22;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 24:
                _context4.prev = 24;

                if (!_didIteratorError) {
                  _context4.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context4.finish(24);

              case 28:
                return _context4.finish(21);

              case 29:
                return _context4.abrupt('return', null);

              case 30:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[6, 17, 21, 29], [22,, 24, 28]]);
      }));

      function getUser(_x3) {
        return _ref4.apply(this, arguments);
      }

      return getUser;
    }()
  }, {
    key: 'hasUser',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(id) {
        var users, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, user;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getUsers();

              case 2:
                users = _context5.sent;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context5.prev = 6;
                _iterator2 = users[Symbol.iterator]();

              case 8:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context5.next = 15;
                  break;
                }

                user = _step2.value;

                if (!(id === user.id)) {
                  _context5.next = 12;
                  break;
                }

                return _context5.abrupt('return', true);

              case 12:
                _iteratorNormalCompletion2 = true;
                _context5.next = 8;
                break;

              case 15:
                _context5.next = 21;
                break;

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5['catch'](6);
                _didIteratorError2 = true;
                _iteratorError2 = _context5.t0;

              case 21:
                _context5.prev = 21;
                _context5.prev = 22;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 24:
                _context5.prev = 24;

                if (!_didIteratorError2) {
                  _context5.next = 27;
                  break;
                }

                throw _iteratorError2;

              case 27:
                return _context5.finish(24);

              case 28:
                return _context5.finish(21);

              case 29:
                return _context5.abrupt('return', false);

              case 30:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[6, 17, 21, 29], [22,, 24, 28]]);
      }));

      function hasUser(_x4) {
        return _ref5.apply(this, arguments);
      }

      return hasUser;
    }()
  }], [{
    key: 'createUser',
    value: function createUser(profile) {
      return {
        id: (0, _v2.default)(),
        profile: profile
      };
    }
  }]);

  return UserCache;
}();

exports.default = UserCache;
