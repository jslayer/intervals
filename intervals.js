/*
 * Simple setInterval manager (https://github.com/jslayer/intervals)
 * Copyright 2012 Eugene Poltorakov (http://poltorakov.com)
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * @version 1.0.3
 *
 * IntervalManager.add({name, callback, delay, options, scope, method}) - create timer instance
 * IntervalManager.remove(name) - remove timer instance
 * IntervalManager.get(name) - return timer instance by its name
 * IntervalManager.getAll() - return objects with all existing timers
 * IntervalManager.stopAll() - stops all unlocked timers
 * IntervalManager.startAll() - starts all unlocked timers
 *
 * Note: by default method is `intervals`, but you can set this value to `timeout`;
 * This means that callback will retrieve back callback as last argument;
 * This option is useful when callback execution time is much enough and we should wait until it finished
 * before starting new timer;
 *
 * Instance methods:
 *
 * instance.start() - start instance
 * instance.stop() - stop instance
 * instance.call() - immediately call the callback
 */
var IntervalManager = (function(){
  var instances = {},
    _instance = function(options) {
      var _name, _callback, _delay, _options, _method, _scope,
        _start, _timer,
        args = _.values(arguments);

      _name     = options.name;
      _callback = options.callback;
      _delay    = options.delay    || 2000;
      _options  = options.args     || [];
      _method   = options.method   || 'interval';
      _scope    = options.scope    || {};

      return {
        start: function(force) {
          if (_timer != -1 || force) {
            switch(_method) {
              case 'interval':
                _timer = setInterval(function() {
                  instances[_name].call();
                }, _delay);
                break;
              case 'timeout':
                _timer = setTimeout(function() {
                  clearTimeout(_timer);
                  instances[_name].call();
                }, _delay)
                break;
              default:
                throw new Error('Unknown intervals method');
            }
          }
          return this;
        },
        _start: function(){
          instances[_name].start(true);
        },
        call: function() {
          var _args = _options;
          if (_method == 'timeout') {
            var _args = _.clone(_options);
            _args.push(instances[_name]._start);
          }
          _callback.apply(_scope, _args);
          return this;
        },
        stop: function() {
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
          _timer = -1;
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
        instance._start();
      });
      return this;
    }
  };
})();
