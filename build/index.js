"use strict";

var getUsers = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var key, value, users;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            key = { id: 'users', segment: 'users' };
            _context.next = 3;
            return client.get(key);

          case 3:
            value = _context.sent;

            if (value) {
              _context.next = 9;
              break;
            }

            users = [];
            _context.next = 8;
            return client.set(key, users);

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

  return function getUsers() {
    return _ref.apply(this, arguments);
  };
}();

var setUsers = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(users) {
    var key;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            key = { id: 'users', segment: 'users' };
            _context2.next = 3;
            return client.set(key, users, 100000);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function setUsers(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var addUser = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(username, password) {
    var users, newUser;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getUsers();

          case 2:
            users = _context3.sent;
            newUser = createUser(username, password);

            users.push(newUser);
            _context3.next = 7;
            return setUsers(users);

          case 7:
            return _context3.abrupt('return', newUser);

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function addUser(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

var existsUser = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(username, password) {
    var users, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getUsers();

          case 2:
            users = _context4.sent;

            console.log('user', username);
            console.log('password', password);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 8;
            _iterator = users[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context4.next = 19;
              break;
            }

            user = _step.value;

            console.log(user.password);
            console.log(_passwordHash2.default.verify(password, user.password));

            if (!(user.username === username && _passwordHash2.default.verify(password, user.password))) {
              _context4.next = 16;
              break;
            }

            return _context4.abrupt('return', true);

          case 16:
            _iteratorNormalCompletion = true;
            _context4.next = 10;
            break;

          case 19:
            _context4.next = 25;
            break;

          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4['catch'](8);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 25:
            _context4.prev = 25;
            _context4.prev = 26;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 28:
            _context4.prev = 28;

            if (!_didIteratorError) {
              _context4.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context4.finish(28);

          case 32:
            return _context4.finish(25);

          case 33:
            return _context4.abrupt('return', false);

          case 34:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[8, 21, 25, 33], [26,, 28, 32]]);
  }));

  return function existsUser(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var getTasks = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var key, value, tasks;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            key = { id: 'tasks', segment: 'tasks' };
            _context5.next = 3;
            return client.get(key);

          case 3:
            value = _context5.sent;

            if (value) {
              _context5.next = 9;
              break;
            }

            tasks = [];
            _context5.next = 8;
            return client.set(key, tasks);

          case 8:
            return _context5.abrupt('return', []);

          case 9:
            return _context5.abrupt('return', value.item);

          case 10:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getTasks() {
    return _ref5.apply(this, arguments);
  };
}();

var setTasks = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(tasks) {
    var key;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            key = { id: 'tasks', segment: 'tasks' };
            _context6.next = 3;
            return client.set(key, tasks, 100000);

          case 3:
            return _context6.abrupt('return', _context6.sent);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function setTasks(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

var getTask = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(id) {
    var tasks;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getTasks();

          case 2:
            tasks = _context7.sent;
            return _context7.abrupt('return', tasks.find(function (task) {
              return task.id === id;
            }));

          case 4:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getTask(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

var addTask = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(description) {
    var tasks, newTask;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return getTasks();

          case 2:
            tasks = _context8.sent;
            newTask = createTask(description);

            tasks.push(newTask);
            _context8.next = 7;
            return setTasks(tasks);

          case 7:
            return _context8.abrupt('return', newTask);

          case 8:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function addTask(_x8) {
    return _ref8.apply(this, arguments);
  };
}();

var removeTask = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
    var tasks;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return getTask(id);

          case 2:
            if (_context9.sent) {
              _context9.next = 4;
              break;
            }

            return _context9.abrupt('return', _boom2.default.boomify(new Error('ID not found.'), { statusCode: 404 }));

          case 4:
            _context9.next = 6;
            return getTasks();

          case 6:
            tasks = _context9.sent;

            tasks = tasks.filter(function (task) {
              return !(task.id === id);
            });
            _context9.next = 10;
            return setTasks(tasks);

          case 10:
            return _context9.abrupt('return', '');

          case 11:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function removeTask(_x9) {
    return _ref9.apply(this, arguments);
  };
}();

var editTask = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(id, state, description) {
    var tasks, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, task;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return getTasks();

          case 2:
            tasks = _context10.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context10.prev = 6;
            _iterator2 = tasks[Symbol.iterator]();

          case 8:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context10.next = 21;
              break;
            }

            task = _step2.value;

            if (!(task.id === id)) {
              _context10.next = 18;
              break;
            }

            if (!(task.state === COMPLETE)) {
              _context10.next = 13;
              break;
            }

            return _context10.abrupt('return', _boom2.default.boomify(new Error('Task is already complete.'), { statusCode: 400 }));

          case 13:
            task.state = state || task.state;
            task.description = description || task.description;
            _context10.next = 17;
            return setTasks(tasks);

          case 17:
            return _context10.abrupt('return', task);

          case 18:
            _iteratorNormalCompletion2 = true;
            _context10.next = 8;
            break;

          case 21:
            _context10.next = 27;
            break;

          case 23:
            _context10.prev = 23;
            _context10.t0 = _context10['catch'](6);
            _didIteratorError2 = true;
            _iteratorError2 = _context10.t0;

          case 27:
            _context10.prev = 27;
            _context10.prev = 28;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 30:
            _context10.prev = 30;

            if (!_didIteratorError2) {
              _context10.next = 33;
              break;
            }

            throw _iteratorError2;

          case 33:
            return _context10.finish(30);

          case 34:
            return _context10.finish(27);

          case 35:
            return _context10.abrupt('return', _boom2.default.boomify(new Error('ID not found.'), { statusCode: 404 }));

          case 36:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this, [[6, 23, 27, 35], [28,, 30, 34]]);
  }));

  return function editTask(_x10, _x11, _x12) {
    return _ref10.apply(this, arguments);
  };
}();

var startServer = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return client.start();

          case 2:
            _context11.next = 4;
            return server.register([_bell2.default, _hapiAuthCookie2.default]);

          case 4:
            _context11.next = 6;
            return addUser('root', 'root');

          case 6:

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
            server.route([routeAddTodos, routeUpdateTodo, routeGetTodos, routeRemoveTodo, routeLogin]
            //routeLogout,
            //routeIndex
            );

            server.auth.default('google');
            _context11.next = 11;
            return server.start();

          case 11:
            console.log('Server running at:', server.info.uri);

          case 12:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function startServer() {
    return _ref11.apply(this, arguments);
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

var _passwordHash = require('password-hash');

var _passwordHash2 = _interopRequireDefault(_passwordHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ALL = 'ALL';
var COMPLETE = 'COMPLETE';
var INCOMPLETE = 'INCOMPLETE';
var DESCRIPTION = 'DESCRIPTION';
var DATE_ADDED = 'DATE_ADDED';

var client = new _catbox.Client(_catboxMemory2.default);

function createUser(username, password) {
  return {
    id: (0, _v2.default)(),
    username: username,
    password: _passwordHash2.default.generate(password)
  };
}

function createTask(description) {
  return {
    id: (0, _v2.default)(),
    state: INCOMPLETE,
    description: description,
    dateAdded: new Date().toISOString()
  };
}

var routeGetTodos = {
  method: 'GET',
  path: '/todos',
  config: {
    auth: {
      strategy: 'google'
    },
    handler: function handler(request, h) {
      return getTasks().then(function (tasks) {

        return tasks.filter(function (task) {
          switch (request.query.filter) {
            case ALL:
              return true;
            case COMPLETE:
              return task.state === COMPLETE;
            case INCOMPLETE:
              return task.state === INCOMPLETE;
            default:
              return true;
          }
        }).sort(function (taskA, taskB) {
          switch (request.query.orderBy) {
            case DESCRIPTION:
              return taskA.description.localeCompare(taskB.description);
              break;
            case DATE_ADDED:
              return new Date(taskA.dateAdded) > new Date(taskB.dateAdded);
          }
        });
      });
    },
    validate: {
      query: {
        filter: _joi2.default.string().valid(COMPLETE, INCOMPLETE, ALL).optional(),
        orderBy: _joi2.default.string().valid(DESCRIPTION, DATE_ADDED).optional()
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
    handler: function handler(request, h) {
      return addTask(request.payload.description).then(function (task) {
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
    handler: function handler(request, h) {
      return editTask(request.params.id, request.payload.state, request.payload.description);
    },
    validate: {
      params: {
        id: _joi2.default.string().required()
      },
      payload: _joi2.default.object().keys({
        state: _joi2.default.string().valid(COMPLETE, INCOMPLETE),
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
    handler: function handler(request, h) {
      return removeTask(request.params.id);
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
  method: '*', // Must handle both GET and POST
  path: '/bell/door', // The callback endpoint registered with the provider
  config: {
    auth: {
      strategy: 'google',
      mode: 'try'
    },
    handler: function handler(request, h) {

      console.log(JSON.stringify(request.auth.credentials, null, 4));
      if (!request.auth.isAuthenticated) {
        return 'Authentication failed' + request.auth.error.message;
      }

      // Perform any account lookup or registration, setup local session,
      // and redirect to the application. The third-party credentials are
      // stored in request.auth.credentials. Any query parameters from
      // the initial request are passed back via request.auth.credentials.query.
      return 'Teste';
    }
  }
};

var routeLogout = {
  method: 'GET',
  path: '/logout',
  options: {
    handler: function handler(request, h) {
      request.server.app.cache.drop(request.state['sid-example'].sid);
      request.cookieAuth.clear();
      return 'logged out';
    }
  }
};

var routeIndex = {
  method: 'GET',
  path: '/',
  config: {
    auth: {
      strategy: 'google', //authorisation is of 'hapi-auth-cookie' type
      mode: 'try' //allows you to proceed to a path handler even if not authenticated
    },
    handler: function handler(request, h) {
      if (request.auth.isAuthenticated) {
        //isAuthenticated is true if the user has successfully logged in
        return 'good';
      } else {
        return 'bad';
      }
    }
  }
};

var server = _hapi2.default.server({ host: '0.0.0.0', port: process.env.PORT });

startServer();