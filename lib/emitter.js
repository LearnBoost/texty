
/*!
 * EventEmitter
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

/**
 * Convert arguments to an array.
 *
 * @return {Array}
 * @api public
 */

function toArray(args) {
  var ret = [];
  for (var i = 0, len = args.length; i < len; ++i) {
    ret.push(args[i]);
  }
  return ret;
}

/**
 * Initialize a new `EventEmitter`.
 */

EventEmitter = function EventEmitter() {
  this.callbacks = {};
};

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 */

EventEmitter.prototype.on = function(event, fn){
  (this.callbacks[event] = this.callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 */

EventEmitter.prototype.emit = function(event){
  var args = toArray(arguments).slice(1)
    , callbacks = this.callbacks[event];

  if (callbacks) {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }

  return this;
};
