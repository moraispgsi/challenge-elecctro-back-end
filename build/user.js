'use strict';

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

var TTL = 1000000;
var ALL = exports.ALL = 'ALL';
var COMPLETE = exports.COMPLETE = 'COMPLETE';
var INCOMPLETE = exports.INCOMPLETE = 'INCOMPLETE';
var DESCRIPTION = exports.DESCRIPTION = 'DESCRIPTION';
var DATE_ADDED = exports.DATE_ADDED = 'DATE_ADDED';

var User = function () {
  function User(client, user) {
    _classCallCheck(this, User);

    this.client = client;
    this.id = user.id;
    this.profile = user.profile;
    this.tasks = user.tasks;
  }

  //Creates a task object


  _createClass(User, [{
    key: 'addTask',


    //Adds a new task without saving(locally)
    value: function addTask(description) {
      this.tasks.push(User.createTask(description));
    }

    //Return task by id

  }, {
    key: 'getTask',
    value: function getTask(id) {
      var task = this.tasks.find(function (task) {
        return task.id === id;
      });
      if (!task) {
        return Boom.boomify(new Error('Task ID not found.'), { statusCode: 404 });
      }
      return task;
    }

    //gets all the tasks of the user

  }, {
    key: 'getTasks',
    value: function getTasks() {
      return this.tasks;
    }

    //edits a task without saving(locally)

  }, {
    key: 'editTask',
    value: function editTask(id, state, description) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var task = _step.value;

          if (task.id === id) {
            if (task.state === COMPLETE) {
              return Boom.boomify(new Error('Task is already complete.'), { statusCode: 400 });
            }
            task.state = state || task.state;
            task.description = description || task.description;
            return task;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return Boom.boomify(new Error('Task ID not found.'), { statusCode: 404 });
    }

    //removes a task by id without saving(locally)

  }, {
    key: 'removeTask',
    value: function removeTask(id) {
      if (!this.tasks.find(function (task) {
        return task.id === id;
      })) {
        return Boom.boomify(new Error('Task ID not found.'), { statusCode: 404 });
      }
      this.tasks = this.tasks.filter(function (task) {
        return !(task.id === id);
      });
    }

    //Saves the user data

  }, {
    key: 'save',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return User.setUser(this.client, this);

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function save() {
        return _ref.apply(this, arguments);
      }

      return save;
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
  }, {
    key: 'hasUser',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(client, id) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return User.getUsersList(client);

              case 2:
                _context2.t0 = id;
                return _context2.abrupt('return', _context2.sent.includes(_context2.t0));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function hasUser(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return hasUser;
    }()

    //Gets a list of the IDs of all users from the cache

  }, {
    key: 'getUsersList',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(client) {
        var key, value, users;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                key = { id: 'users', segment: 'users' };
                _context3.next = 3;
                return client.get(key);

              case 3:
                value = _context3.sent;

                if (value) {
                  _context3.next = 9;
                  break;
                }

                users = [];
                _context3.next = 8;
                return client.set(key, users);

              case 8:
                return _context3.abrupt('return', []);

              case 9:
                return _context3.abrupt('return', value.item);

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getUsersList(_x3) {
        return _ref3.apply(this, arguments);
      }

      return getUsersList;
    }()

    //Gets an user by id from the cache

  }, {
    key: 'getUser',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(client, id) {
        var keyUser, value;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                keyUser = { id: id, segment: 'users' };
                _context4.next = 3;
                return client.get(keyUser);

              case 3:
                value = _context4.sent;

                if (value) {
                  _context4.next = 6;
                  break;
                }

                throw new Error('User does not exists.');

              case 6:
                return _context4.abrupt('return', new User(client, {
                  id: id,
                  profile: value.item.profile,
                  tasks: value.item.tasks
                }));

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getUser(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return getUser;
    }()

    //Sets an user in the cache

  }, {
    key: 'setUser',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(client, user) {
        var keyUser, keyUsers, value, users;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                keyUser = { id: user.id, segment: 'users' };

                client.set(keyUser, {
                  id: user.id,
                  profile: user.profile,
                  tasks: user.tasks
                });
                keyUsers = { id: 'users', segment: 'users' };
                _context5.next = 5;
                return client.get(keyUsers);

              case 5:
                value = _context5.sent;
                users = void 0;

                if (!value) {
                  users = [user.id];
                } else {
                  users = value.item;
                  users.push(user.id);
                }
                _context5.next = 10;
                return client.set(keyUsers, users);

              case 10:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function setUser(_x6, _x7) {
        return _ref5.apply(this, arguments);
      }

      return setUser;
    }()

    //Adds an user in the cache

  }, {
    key: 'addUser',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(client, profile, tasks) {
        var user, keyUser, keyUsers, value, users;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                user = {
                  id: (0, _v2.default)(),
                  profile: profile,
                  tasks: tasks
                };
                keyUser = { id: user.id, segment: 'users' };

                client.set(keyUser, user);

                keyUsers = { id: 'users', segment: 'users' };
                _context6.next = 6;
                return client.get(keyUsers);

              case 6:
                value = _context6.sent;
                users = void 0;

                if (!value) {
                  users = [user.id];
                } else {
                  users = value.item;
                  users.push(user.id);
                }
                _context6.next = 11;
                return client.set(keyUsers, users);

              case 11:
                return _context6.abrupt('return', new User(client, user));

              case 12:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function addUser(_x8, _x9, _x10) {
        return _ref6.apply(this, arguments);
      }

      return addUser;
    }()

    //Removes an user from the cache

  }, {
    key: 'removeUser',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(client, id) {
        var keyUser, keyUsers, value, users;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                keyUser = { id: id, segment: 'users' };
                _context7.next = 3;
                return client.drop(keyUser);

              case 3:
                keyUsers = { id: 'users', segment: 'users' };
                _context7.next = 6;
                return client.get(keyUsers);

              case 6:
                value = _context7.sent;

                if (value) {
                  _context7.next = 11;
                  break;
                }

                users = [];
                _context7.next = 11;
                return client.set(keyUsers, users);

              case 11:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function removeUser(_x11, _x12) {
        return _ref7.apply(this, arguments);
      }

      return removeUser;
    }()
  }]);

  return User;
}();

exports.default = User;