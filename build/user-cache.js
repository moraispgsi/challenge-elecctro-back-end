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