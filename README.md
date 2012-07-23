#Simple setInterval manager

Copyright 2012 Eugene Poltorakov (http://poltorakov.com)

Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php

##IntervalManager methods:

* IntervalManger.add(name, callback, delay, options, scope) - create timer instance
* IntervalManger.remove(name) - remove timer instance
* IntervalManger.get(name) - return timer instance by its name
* IntervalManger.getAll() - return objects with all existing timers
* IntervalManger.stopAll() - stops all unlocked timers
* IntervalManger.startAll() - starts all unlocked timers

##Instance methods:

* instance.start() - start instance
* instance.stop() - stop instance
* instance.lock() - lock instance (it's state couldn't be changed until unlock)
* instance.unlock() - unlock instance

