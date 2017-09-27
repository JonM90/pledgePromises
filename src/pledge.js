'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise(executor) {
  if (typeof executor !== 'function') throw TypeError ('executor is not a function.')
  this._state = 'pending';
  this._value = null;

  var resolve = this._internalResolve.bind(this);
  var reject = this._internalReject.bind(this);
  executor(resolve, reject);
}

$Promise.prototype._internalResolve = function(data) {
  //console.log('this._state:', data._state)
  // this = data;
  if (this._state === 'pending') {
    this._state = 'fulfilled';
    this._value = data;
  }
}

$Promise.prototype._internalReject = function(reason) {
  if (this._state === 'pending') {
    this._state = 'rejected';
    this._value = reason;
  }
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
