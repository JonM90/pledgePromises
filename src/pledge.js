'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise(executor) {
  if (typeof executor !== 'function') throw TypeError ('executor is not a function.')
  this._state = 'pending';
  this._value;

  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
//   return this;
}

$Promise.prototype._internalResolve = function(data) {
  if (this._state === 'pending') {
    this._state = 'fulfilled';
    this._value = data;
    if (this._handlerGroups) this._callHandlers(this._handlerGroups);
  }
}

$Promise.prototype._internalReject = function(reason) {
  if (this._state === 'pending') {
    this._state = 'rejected';
    this._value = reason;
    if (this._handlerGroups) this._callHandlers(this._handlerGroups);
  }
}

$Promise.prototype.then = function(onSuccess, onReject) {
    this._handlerGroups = this._handlerGroups || [];
    let handlers = {
        successCb: typeof onSuccess === 'function' ? onSuccess : null,
        errorCb: typeof onReject === 'function' ? onReject : null,
        downstreamPromise: new $Promise(function () {})
    };
    // if (handlers.successCb) {
    //     handlers.downstreamPromise = new $Promise(function () {})
    // } else if (!handlers.successCb) {
    //     handlers.downstreamPromise = this;
    // }
    this._handlerGroups.push(handlers);
    if (this._state === 'fulfilled') {
        // handlers.downstreamPromise = new $Promise(handlers.successCb(this._value));
        handlers.successCb(this._value);
    } else if (this._state === 'rejected' && onReject) {
        handlers.errorCb(this._value);
    }
    return handlers.downstreamPromise;
}

$Promise.prototype._callHandlers = function(handlerGroups) {
    if (this._state === 'fulfilled') {
        handlerGroups.forEach(handler => handler.successCb(this._value));
    } else if (this._state === 'rejected') {
        handlerGroups.forEach(handler => handler.errorCb(this._value));
    }
    this._handlerGroups = [];
}

$Promise.prototype.catch = function(onReject) {
    return this.then(null, onReject);
}



/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
