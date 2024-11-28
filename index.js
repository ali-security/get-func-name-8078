'use strict';

/* !
 * Chai - getFuncName utility
 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getFuncName(constructorFn)
 *
 * Returns the name of a function.
 * When a non-function instance is passed, returns `null`.
 * This also includes a polyfill function if `aFunc.name` is not defined.
 *
 * @name getFuncName
 * @param {Function} funct
 * @namespace Utils
 * @api public
 */

var toString = Function.prototype.toString;
var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
var maxFunctionSourceLength = 512;
function getFuncName(aFunc) {
  if (typeof aFunc !== 'function') {
    return null;
  }
  var name = '';
  var realFPName = Object.getOwnPropertyDescriptor(Function.prototype, 'name');
  var realFName = Object.getOwnPropertyDescriptor(aFunc, 'name');
  if ((typeof realFPName.name === 'undefined' || !realFPName.configurable) &&
      (typeof aFunc.name === 'undefined' || !realFName.configurable)) {
    // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
    var functionSource = toString.call(aFunc);
    if (functionSource.indexOf('(') > maxFunctionSourceLength) {
      return name;
    }
    var match = toString.call(aFunc).match(functionNameMatch);
    if (match) {
      name = match[1];
    }
  } else {
    // If we've got a `name` property we just use it
    name = aFunc.name;
  }

  return name;
}

module.exports = getFuncName;
