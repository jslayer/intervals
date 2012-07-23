/*
 * Simple setInterval manager (https://github.com/jslayer/intervals)
 * Copyright 2012 Eugene Poltorakov (http://poltorakov.com)
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * IntervalManger.add(name, callback, delay, options, scope) - create timer instance
 * IntervalManger.remove(name) - remove timer instance
 * IntervalManger.get(name) - return timer instance by its name
 * IntervalManger.getAll() - return objects with all existing timers
 * IntervalManger.stopAll() - stops all unlocked timers
 * IntervalManger.startAll() - starts all unlocked timers
 *
 * Instance methods:
 *
 * instance.start() - start instance
 * instance.stop() - stop instance
 * instance.lock() - lock instance (it's state couldn't be changed until unlock)
 * instance.unlock() - unlock instance
 */
var IntervalManger = (function(){
  var instances = {},
    _instance = function() {
      var _name, _callback, _delay, _options, _scope,
        _start, _timer,
        _started = false,
        _locked  = false,
        args = _.values(arguments);

      _name     = args.shift();
      _callback = args.shift();
      _delay    = args.shift() || 2000;
      _options  = args.shift() || {};
      _scope    = args.shift() || {};

      return {
        start: function() {
          if (!_started && !_locked) {
            _timer = setInterval(function() {
              _callback.call(_scope, _options);
            }, _delay);
            _started = true;
          }
          return this;
        },
        stop: function() {
          if (_started && !_locked) {
            _started = false;
            clearInterval(_timer);
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
    add: function(name, callback, delay, options, scope) {
      var instance = _instance.apply({}, arguments);
      instances[name] = instance;
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
