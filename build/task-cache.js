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