/*
 * Simple setInterval manager (https://github.com/jslayer/intervals)
 * Copyright 2012 Eugene Poltorakov (http://poltorakov.com)
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * @version 1.0.1
 *
 * IntervalManager.add({name, callback, delay, options, scope, method}) - create timer instance
 * IntervalManager.remove(name) - remove timer instance
 * IntervalManager.get(name) - return timer instance by its name
 * IntervalManager.getAll() - return objects with all existing timers
 * IntervalManager.stopAll() - stops all unlocked timers
 * IntervalManager.startAll() - starts all unlocked timers
 *
 * Note: by default method is `intervals`, but you can set this value to `timeout`;
 * This means that callback will retrieve back callback as last argument,
 * you should execute it in order to start new timeout;
 * This option is useful when callback execution time is much enough and we should wait until it finished
 * before starting new timer;
 *
 * Instance methods:
 *
 * instance.start() - start instance
 * instance.stop() - stop instance
 * instance.lock() - lock instance (it's state couldn't be changed until unlock)
 * instance.unlock() - unlock instance
 * instance.call() - immediately call the callback
 */
var IntervalManager = (function(){
  var instances = {},
    _instance = function(options) {
      var _name, _callback, _delay, _options, _method, _scope,
        _start, _timer,
        _started = false,
        _locked  = false,
        args = _.values(arguments);

      _name     = options.name;
      _callback = options.callback;
      _delay    = options.delay    || 2000;
      _options  = options.args     || [];
      _method   = options.method   || 'interval';
      _scope    = options.scope    || {};

      return {
        start: function() {
          if (!_started && !_locked) {
            switch(_method) {
              case 'interval':
                _timer = setInterval(function() {
                  _callback.call(_scope, _options);
                }, _delay);
                break;
              case 'timeout':
                _timer = setTimeout(function() {
                  var _args = _options;
                  clearTimeout(_timer);
                  _started = false;
                  _args.push(instances[_name].start);
                  _callback.apply(_scope, _args);
                }, _delay)
                //todo
                break;
              default:
                throw new Error('Unknown intervals method');
            }
            _started = true;
          }
          return this;
        },
        call: function() {
          _callback.call(_scope, _options);
          return this;
        },
        stop: function() {
          if (_started && !_locked) {
            _started = false;
            switch(_method) {
              case 'interval':
                clearInterval(_timer);
                break;
              case 'timeout':
                clearTimeout(_timer);
                break;
              default:
                throw new Error('Unknown intervals method');
            }
          }
          return this;
        },
        lock: function() {
          _locked = true;
          return this;
        },
        unlock: function() {
          _locked = false;
          return this;
        }
      };
    };

  return {
    add: function(options) {
      var instance = _instance.call({}, options);
      instances[options.name] = instance;
      return instance;
    },
    remove: function(name) {
      if (typeof(instances[name]) == 'object') {
        instances[name].stop();
      }
      delete instances[name];
      return this;
    },
    get: function(name) {
      return instances[name];
    },
    getAll: function() {
      return instances;
    },
    stopAll: function() {
      _.each(instances, function(instance, key) {
        instance.stop();
      });
      return this;
    },
    startAll: function() {
      _.each(instances, function(instance, key) {
        instance.start();
      });
      return this;
    }
  };
})();
