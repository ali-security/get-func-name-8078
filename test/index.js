'use strict';
var assert = require('simple-assert');
var getFuncName = require('..');
describe('getFuncName', function () {
  it('should get the function name', function () {
    function normalFunction() {
      return 1;
    }

    assert(getFuncName(normalFunction) === 'normalFunction');
  });

  it('should get correct name when function is surrounded by comments', function () {
    function /*one*/correctName/*two*/() { // eslint-disable-line no-inline-comments, spaced-comment
      return 0;
    }

    assert(getFuncName(correctName) === 'correctName');
  });

  it('should return empty string for anonymous functions', function () {
    var anonymousFunc = (function () {
      return function () { // eslint-disable-line func-style
        return 2;
      };
    }());
    assert(getFuncName(anonymousFunc) === '');
  });

  it('should return an empty string for overly large function names', function () {
    // eslint-disable-next-line max-len, func-style, func-name-matching, id-length
    var longFunc = function aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa() {};
    var nameDescriptorF = Object.getOwnPropertyDescriptor(longFunc, 'name');
    if (nameDescriptorF && nameDescriptorF.configurable) {
      Object.defineProperty(longFunc, 'name', { value: undefined });
    }
    var realFPName = Object.getOwnPropertyDescriptor(Function.prototype, 'name');
    var nameDescriptorFP = Object.getOwnPropertyDescriptor(Function.prototype, 'name');
    if (nameDescriptorFP && nameDescriptorFP.configurable) {
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(Function.prototype, 'name', { value: undefined });
    }
    assert(getFuncName(longFunc) === '');
    if (nameDescriptorFP && nameDescriptorFP.configurable) {
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(Function.prototype, 'name', realFPName);
    }
  });

  it('should return `null` when passed a String as argument', function () {
    assert(getFuncName('') === null);
  });

  it('should return `null` when passed a Number as argument', function () {
    assert(getFuncName(1) === null);
  });

  it('should return `null` when passed a Boolean as argument', function () {
    assert(getFuncName(true) === null);
  });

  it('should return `null` when passed `null` as argument', function () {
    assert(getFuncName(null) === null);
  });

  it('should return `null` when passed `undefined` as argument', function () {
    assert(getFuncName(undefined) === null);
  });

  it('should return `null` when passed a Symbol as argument', function () {
    if (typeof Symbol !== 'undefined') {
      assert(getFuncName(Symbol()) === null);
    }
  });

  it('should return `null` when passed an Object as argument', function () {
    assert(getFuncName({}) === null);
  });
});

