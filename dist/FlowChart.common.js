module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "7157");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0323":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("af49");
var toObject = __webpack_require__("3067");
var toLength = __webpack_require__("16fb");
var toInteger = __webpack_require__("b6b0");
var advanceStringIndex = __webpack_require__("ee67");
var regExpExec = __webpack_require__("be40");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("35a2")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "0749":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("af49");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "07cf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("94b9");
var $find = __webpack_require__("4952")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("1e52")(KEY);


/***/ }),

/***/ "088d":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "0a03":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "0acb":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("c833")(false);
// imports


// module
exports.push([module.i, "#svg{height:100%;width:100%}#chart{position:relative;width:800px;height:600px;border:1px solid #dfdfdf;background-size:20px 20px,20px 20px,10px 10px,10px 10px;background-image:linear-gradient(90deg,#dfdfdf 1px,transparent 0),linear-gradient(180deg,#dfdfdf 1px,transparent 0),linear-gradient(90deg,#f1f1f1 1px,transparent 0),linear-gradient(180deg,#f1f1f1 1px,transparent 0)}#position{position:absolute;right:4px}.unselectable{moz-user-select:-moz-none;-moz-user-select:none;-o-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.connector{cursor:crosshair;opacity:0}.connector.active{opacity:1;fill:#fff;stroke:#bbb;stroke-width:1px}.connector:hover{stroke:red}#svg .selection{stroke:#add8e6;fill:#add8e6;fill-opacity:.8;display:none}#svg .selection.active{display:block}", ""]);

// exports


/***/ }),

/***/ "0b9f":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("467d");
var setPrototypeOf = __webpack_require__("a709").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "1053":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "13ad":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("0acb");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("cd61").default
var update = add("0af8b9c6", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "1401":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "1577":
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__("911e");


/***/ }),

/***/ "15b5":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("8ecf");
var createDesc = __webpack_require__("b5aa");
module.exports = __webpack_require__("3b88") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "16fb":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("b6b0");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "1cea":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__("c959");
var $export = __webpack_require__("94b9");
var toObject = __webpack_require__("3067");
var call = __webpack_require__("bfdd");
var isArrayIter = __webpack_require__("a690");
var toLength = __webpack_require__("16fb");
var createProperty = __webpack_require__("bf86");
var getIterFn = __webpack_require__("693f");

$export($export.S + $export.F * !__webpack_require__("30df")(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "1e52":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("911e")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("15b5")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "2263":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("c833")(false);
// imports


// module
exports.push([module.i, ".flowchart__chart{background-image:linear-gradient(90deg,#dfdfdf 1px,transparent 0),linear-gradient(180deg,#dfdfdf 1px,transparent 0),linear-gradient(90deg,#f1f1f1 1px,transparent 0),linear-gradient(180deg,#f1f1f1 1px,transparent 0)}", ""]);

// exports


/***/ }),

/***/ "227b":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "2698":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("227b");
var has = __webpack_require__("84eb");
var cof = __webpack_require__("e064");
var inheritIfRequired = __webpack_require__("0b9f");
var toPrimitive = __webpack_require__("26d5");
var fails = __webpack_require__("9eef");
var gOPN = __webpack_require__("6485").f;
var gOPD = __webpack_require__("fc78").f;
var dP = __webpack_require__("8ecf").f;
var $trim = __webpack_require__("4e3a").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("46ce")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("3b88") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("831d")(global, NUMBER, $Number);
}


/***/ }),

/***/ "26d5":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("467d");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "2f00":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("227b");
var dP = __webpack_require__("8ecf");
var DESCRIPTORS = __webpack_require__("3b88");
var SPECIES = __webpack_require__("911e")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "3020":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("2263");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("cd61").default
var update = add("54ad9ddd", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "3067":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("ba8d");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "30df":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("911e")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "35a2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("39b9");
var redefine = __webpack_require__("831d");
var hide = __webpack_require__("15b5");
var fails = __webpack_require__("9eef");
var defined = __webpack_require__("ba8d");
var wks = __webpack_require__("911e");
var regexpExec = __webpack_require__("6edf");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "36a6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("1e52");
var step = __webpack_require__("6300");
var Iterators = __webpack_require__("9d83");
var toIObject = __webpack_require__("52e2");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("b057")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "39b9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("6edf");
__webpack_require__("94b9")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "3a32":
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__("52e2");
var gOPN = __webpack_require__("6485").f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "3b88":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("9eef")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "3c6b":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("94b9");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("dbd7") });


/***/ }),

/***/ "3ef3":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("c959");
var invoke = __webpack_require__("e19a");
var html = __webpack_require__("bd1f");
var cel = __webpack_require__("c031");
var global = __webpack_require__("227b");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("e064")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "3faf":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("8ecf").f;
var has = __webpack_require__("84eb");
var TAG = __webpack_require__("911e")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "4035":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("c959");
var call = __webpack_require__("bfdd");
var isArrayIter = __webpack_require__("a690");
var anObject = __webpack_require__("af49");
var toLength = __webpack_require__("16fb");
var getIterFn = __webpack_require__("693f");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "4042":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "411b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("46ce");
var descriptor = __webpack_require__("b5aa");
var setToStringTag = __webpack_require__("3faf");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("15b5")(IteratorPrototype, __webpack_require__("911e")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "467d":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "46ce":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("af49");
var dPs = __webpack_require__("fe2e");
var enumBugKeys = __webpack_require__("0a03");
var IE_PROTO = __webpack_require__("4b89")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("c031")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("bd1f").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "4952":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("c959");
var IObject = __webpack_require__("7229");
var toObject = __webpack_require__("3067");
var toLength = __webpack_require__("16fb");
var asc = __webpack_require__("d463");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "4b89":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5789")('keys');
var uid = __webpack_require__("ac3a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "4e3a":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("94b9");
var defined = __webpack_require__("ba8d");
var fails = __webpack_require__("9eef");
var spaces = __webpack_require__("4042");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "4f71":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "52e2":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("7229");
var defined = __webpack_require__("ba8d");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "54b7":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("e064");
var TAG = __webpack_require__("911e")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "555d":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("831d");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "5583":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("63fe");
var enumBugKeys = __webpack_require__("0a03");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "5789":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8e76");
var global = __webpack_require__("227b");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("e300") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "6281":
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__("5583");
var gOPS = __webpack_require__("088d");
var pIE = __webpack_require__("7bd6");
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ "6300":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "63fe":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("84eb");
var toIObject = __webpack_require__("52e2");
var arrayIndexOf = __webpack_require__("7e1b")(false);
var IE_PROTO = __webpack_require__("4b89")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "6485":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("63fe");
var hiddenKeys = __webpack_require__("0a03").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "65d1":
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__("ac3a")('meta');
var isObject = __webpack_require__("467d");
var has = __webpack_require__("84eb");
var setDesc = __webpack_require__("8ecf").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__("9eef")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "691d":
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__("94b9");

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});


/***/ }),

/***/ "693f":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("54b7");
var ITERATOR = __webpack_require__("911e")('iterator');
var Iterators = __webpack_require__("9d83");
module.exports = __webpack_require__("8e76").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "6edf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0749");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "7157":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("1401")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("e50d");

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"31b4450c-vue-loader-template"}!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/cache-loader/dist/cjs.js??ref--12-0!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/babel-loader/lib!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/cache-loader/dist/cjs.js??ref--0-0!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/vue-loader/lib??vue-loader-options!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/Flowchart.vue?vue&type=template&id=c68c1afa
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    style: {
      width: isNaN(_vm.width) ? _vm.width : _vm.width + 'px',
      height: isNaN(_vm.height) ? _vm.height : _vm.height + 'px',
      overflow: _vm.overflow,
      cursor: _vm.cursor
    },
    attrs: {
      "id": "chart",
      "tabindex": "0"
    },
    on: {
      "mousemove": _vm.handleChartMouseMove,
      "mouseup": function mouseup($event) {
        return _vm.handleChartMouseUp($event);
      },
      "dblclick": function dblclick($event) {
        return _vm.handleChartDblClick($event);
      },
      "wheel": _vm.handleChartMouseWheel,
      "mousedown": function mousedown($event) {
        return _vm.handleChartMouseDown($event);
      },
      "touchstart": function touchstart($event) {
        return _vm.handleTouch($event);
      },
      "touchmove": function touchmove($event) {
        return _vm.handleTouchMove($event);
      }
    }
  }, [_c('span', {
    staticClass: "unselectable",
    attrs: {
      "id": "position"
    }
  }, [_vm._v("\n    " + _vm._s(_vm.cursorToChartOffset.x + ", " + _vm.cursorToChartOffset.y) + "\n  ")]), _c('svg', {
    attrs: {
      "id": "svg"
    }
  }, [_c('rect', {
    staticClass: "selection",
    attrs: {
      "height": "0",
      "width": "0"
    }
  })]), _c('div', {
    staticClass: "unselectable",
    attrs: {
      "id": "chart-slot"
    }
  }, [_vm._t("default")], 2)]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/Flowchart.vue?vue&type=template&id=c68c1afa

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es7.symbol.async-iterator.js
var es7_symbol_async_iterator = __webpack_require__("f102a");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.symbol.js
var es6_symbol = __webpack_require__("f0ac");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.string.iterator.js
var es6_string_iterator = __webpack_require__("f034");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.array.from.js
var es6_array_from = __webpack_require__("1cea");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("71ee");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.math.hypot.js
var es6_math_hypot = __webpack_require__("e6fb");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("3c6b");

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("07cf");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("7d5c");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("c1d9");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __webpack_require__("e9d4");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __webpack_require__("93dd");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.math.trunc.js
var es6_math_trunc = __webpack_require__("691d");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__("a649");

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("2698");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("0323");

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/utils/math.js
function distanceOfPointToLine(beginX, beginY, endX, endY, ptX, ptY) {
  var k = (endY - beginY || 1) / (endX - beginX || 1);
  var b = beginY - k * beginX;
  return Math.abs(k * ptX - ptY + b) / Math.sqrt(k * k + 1);
}
function between(num1, num2, num) {
  return num > num1 && num < num2 || num > num2 && num < num1;
}
function approximatelyEquals(n, m) {
  return Math.abs(m - n) <= 3;
}
function getEdgeOfPoints(points) {
  var minX = points.reduce(function (prev, point) {
    return point.x < prev ? point.x : prev;
  }, Infinity);
  var maxX = points.reduce(function (prev, point) {
    return point.x > prev ? point.x : prev;
  }, 0);
  var minY = points.reduce(function (prev, point) {
    return point.y < prev ? point.y : prev;
  }, Infinity);
  var maxY = points.reduce(function (prev, point) {
    return point.y > prev ? point.y : prev;
  }, 0);
  return {
    start: {
      x: minX,
      y: minY
    },
    end: {
      x: maxX,
      y: maxY
    }
  };
}
function pointRectangleIntersection(p, r) {
  return p.x > r.start.x && p.x < r.end.x && p.y > r.start.y && p.y < r.end.y;
}
function roundTo20(number) {
  return number < 20 ? 20 : number;
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/utils/svg.js


function lineTo(g, x1, y1, x2, y2, lineWidth, strokeStyle, dash) {
  var sta = [x1, y1];
  var end = [x2, y2];
  var path = g.append('path').attr('stroke', strokeStyle).attr('stroke-width', lineWidth).attr('fill', 'none').attr('d', "M ".concat(sta[0], " ").concat(sta[1], " L ").concat(end[0], " ").concat(end[1]));
  if (dash) {
    path.style('stroke-dasharray', dash.join(','));
  }
  return path;
}
function connect(g, x1, y1, x2, y2, startPosition, endPosition, lineWidth, strokeStyle, markered) {
  if (!endPosition) {
    endPosition = x1 > x2 ? 'right' : 'left';
  }
  var points = [];
  var start = [x1, y1];
  var end = [x2, y2];
  var centerX = start[0] + (end[0] - start[0]) / 2;
  var centerY = start[1] + (end[1] - start[1]) / 2;
  var second;
  var addVerticalCenterLine = function addVerticalCenterLine() {
    var third = [centerX, second[1]];
    var forth = [centerX, penult[1]];
    points.push(third);
    points.push(forth);
  };
  var addHorizontalCenterLine = function addHorizontalCenterLine() {
    var third = [second[0], centerY];
    var forth = [penult[0], centerY];
    points.push(third);
    points.push(forth);
  };
  var addHorizontalTopLine = function addHorizontalTopLine() {
    points.push([second[0], start[1] - 50]);
    points.push([penult[0], start[1] - 50]);
  };
  var addHorizontalBottomLine = function addHorizontalBottomLine() {
    points.push([second[0], start[1] + 50]);
    points.push([penult[0], start[1] + 50]);
  };
  var addVerticalRightLine = function addVerticalRightLine() {
    points.push([start[0] + 80, second[1]]);
    points.push([start[0] + 80, penult[1]]);
  };
  var addVerticalLeftLine = function addVerticalLeftLine() {
    points.push([start[0] - 80, second[1]]);
    points.push([start[0] - 80, penult[1]]);
  };
  var addSecondXPenultY = function addSecondXPenultY() {
    points.push([second[0], penult[1]]);
  };
  var addPenultXSecondY = function addPenultXSecondY() {
    points.push([penult[0], second[1]]);
  };
  switch (startPosition) {
    case 'left':
      second = [start[0] - 20, start[1]];
      break;
    case 'top':
      second = [start[0], start[1] - 20];
      break;
    case 'bottom':
      second = [start[0], start[1] + 20];
      break;
    default:
      second = [start[0] + 20, start[1]];
      break;
  }
  var penult = null;
  switch (endPosition) {
    case 'right':
      penult = [end[0] + 20, end[1]];
      break;
    case 'top':
      penult = [end[0], end[1] - 20];
      break;
    case 'bottom':
      penult = [end[0], end[1] + 20];
      break;
    default:
      penult = [end[0] - 20, end[1]];
      break;
  }
  points.push(start);
  points.push(second);
  startPosition = startPosition || 'right';
  endPosition = endPosition || 'left';
  var direction = getDirection(x1, y1, x2, y2);
  if (direction.indexOf('r') > -1) {
    if (startPosition === 'right' || endPosition === 'left') {
      if (second[0] > centerX) {
        second[0] = centerX;
      }
      if (penult[0] < centerX) {
        penult[0] = centerX;
      }
    }
  }
  if (direction.indexOf('d') > -1) {
    if (startPosition === 'bottom' || endPosition === 'top') {
      if (second[1] > centerY) {
        second[1] = centerY;
      }
      if (penult[1] < centerY) {
        penult[1] = centerY;
      }
    }
  }
  if (direction.indexOf('l') > -1) {
    if (startPosition === 'left' || endPosition === 'right') {
      if (second[0] < centerX) {
        second[0] = centerX;
      }
      if (penult[0] > centerX) {
        penult[0] = centerX;
      }
    }
  }
  if (direction.indexOf('u') > -1) {
    if (startPosition === 'top' || endPosition === 'bottom') {
      if (second[1] < centerY) {
        second[1] = centerY;
      }
      if (penult[1] > centerY) {
        penult[1] = centerY;
      }
    }
  }
  switch (direction) {
    case 'lu':
      {
        if (startPosition === 'right') {
          switch (endPosition) {
            case 'top':
            case 'right':
              addSecondXPenultY();
              break;
            default:
              {
                addHorizontalCenterLine();
                break;
              }
          }
        } else if (startPosition === 'bottom') {
          switch (endPosition) {
            case 'top':
              addVerticalCenterLine();
              break;
            default:
              {
                addPenultXSecondY();
                break;
              }
          }
        } else if (startPosition === 'top') {
          switch (endPosition) {
            case 'top':
            case 'right':
              addSecondXPenultY();
              break;
            default:
              {
                addHorizontalCenterLine();
                break;
              }
          }
        } else {
          // startPosition is left
          switch (endPosition) {
            case 'top':
            case 'right':
              addVerticalCenterLine();
              break;
            default:
              {
                addPenultXSecondY();
                break;
              }
          }
        }
        break;
      }
    case 'u':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'right':
            {
              break;
            }
          case 'top':
            {
              addSecondXPenultY();
              break;
            }
          default:
            {
              addHorizontalCenterLine();
              break;
            }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left':
          case 'right':
            addPenultXSecondY();
            break;
          default:
            {
              addVerticalRightLine();
              break;
            }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left':
            {
              addPenultXSecondY();
              break;
            }
          case 'right':
            {
              addHorizontalCenterLine();
              break;
            }
          case 'top':
            addVerticalRightLine();
            break;
          default:
            {
              break;
            }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'right':
            break;
          default:
            {
              points.push([second[0], penult[1]]);
              break;
            }
        }
      }
      break;
    case 'ru':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left':
            {
              addVerticalCenterLine();
              break;
            }
          case 'top':
            {
              addSecondXPenultY();
              break;
            }
          default:
            {
              addPenultXSecondY();
              break;
            }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'top':
            {
              addVerticalCenterLine();
              break;
            }
          default:
            {
              addPenultXSecondY();
              break;
            }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'right':
            {
              addVerticalCenterLine();
              break;
            }
          default:
            {
              addSecondXPenultY();
              break;
            }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'top':
            addSecondXPenultY();
            break;
          default:
            {
              addHorizontalCenterLine();
              break;
            }
        }
      }
      break;
    case 'l':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left':
          case 'right':
          case 'top':
            addHorizontalTopLine();
            break;
          default:
            {
              addHorizontalBottomLine();
              break;
            }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left':
            {
              addHorizontalBottomLine();
              break;
            }
          case 'right':
            {
              addSecondXPenultY();
              break;
            }
          case 'top':
            {
              addVerticalCenterLine();
              break;
            }
          default:
            {
              break;
            }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left':
            {
              addHorizontalTopLine();
              break;
            }
          case 'right':
            {
              addSecondXPenultY();
              break;
            }
          case 'top':
            {
              break;
            }
          default:
            {
              addVerticalCenterLine();
              break;
            }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
            {
              addHorizontalTopLine();
              break;
            }
          case 'right':
            {
              break;
            }
          default:
            {
              addSecondXPenultY();
              break;
            }
        }
      }
      break;
    case 'r':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left':
            {
              break;
            }
          case 'right':
            {
              addHorizontalTopLine();
              break;
            }
          default:
            {
              addSecondXPenultY();
              break;
            }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left':
            {
              addSecondXPenultY();
              break;
            }
          case 'right':
            {
              addHorizontalBottomLine();
              break;
            }
          case 'top':
            {
              addVerticalCenterLine();
              break;
            }
          default:
            {
              break;
            }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left':
            {
              addPenultXSecondY();
              break;
            }
          case 'right':
            {
              addHorizontalTopLine();
              break;
            }
          case 'top':
            {
              break;
            }
          default:
            {
              addVerticalCenterLine();
              break;
            }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'right':
          case 'top':
            addHorizontalTopLine();
            break;
          default:
            {
              addHorizontalBottomLine();
              break;
            }
        }
      }
      break;
    case 'ld':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left':
            {
              addHorizontalCenterLine();
              break;
            }
          default:
            {
              addSecondXPenultY();
              break;
            }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left':
            {
              addPenultXSecondY();
              break;
            }
          case 'top':
            {
              addHorizontalCenterLine();
              break;
            }
          default:
            {
              addSecondXPenultY();
              break;
            }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left':
          case 'right':
          case 'top':
            addPenultXSecondY();
            break;
          default:
            {
              addVerticalCenterLine();
              break;
            }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'top':
            addPenultXSecondY();
            break;
          case 'right':
            {
              addVerticalCenterLine();
              break;
            }
          default:
            {
              addSecondXPenultY();
              break;
            }
        }
      }
      break;
    case 'd':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left':
            {
              addHorizontalCenterLine();
              break;
            }
          case 'right':
            {
              addPenultXSecondY();
              break;
            }
          case 'top':
            {
              addSecondXPenultY();
              break;
            }
          default:
            {
              addVerticalRightLine();
              break;
            }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left':
          case 'right':
            addPenultXSecondY();
            break;
          case 'top':
            {
              break;
            }
          default:
            {
              addVerticalRightLine();
              break;
            }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left':
            {
              addVerticalLeftLine();
              break;
            }
          default:
            {
              addVerticalRightLine();
              break;
            }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
            {
              break;
            }
          case 'right':
            {
              addHorizontalCenterLine();
              break;
            }
          case 'top':
            {
              addSecondXPenultY();
              break;
            }
          default:
            {
              addVerticalLeftLine();
              break;
            }
        }
      }
      break;
    case 'rd':
      {
        if (startPosition === 'right' && endPosition === 'left') {
          addVerticalCenterLine();
        } else if (startPosition === 'right' && endPosition === 'bottom') {
          addSecondXPenultY();
        } else if (startPosition === 'right' && endPosition === 'top' || startPosition === 'right' && endPosition === 'right') {
          addPenultXSecondY();
        } else if (startPosition === 'bottom' && endPosition === 'left') {
          addSecondXPenultY();
        } else if (startPosition === 'bottom' && endPosition === 'right') {
          addPenultXSecondY();
        } else if (startPosition === 'bottom' && endPosition === 'top') {
          addHorizontalCenterLine();
        } else if (startPosition === 'bottom' && endPosition === 'bottom') {
          addSecondXPenultY();
        } else if (startPosition === 'top' && endPosition === 'left') {
          addPenultXSecondY();
        } else if (startPosition === 'top' && endPosition === 'right') {
          addPenultXSecondY();
        } else if (startPosition === 'top' && endPosition === 'top') {
          addPenultXSecondY();
        } else if (startPosition === 'top' && endPosition === 'bottom') {
          addVerticalCenterLine();
        } else if (startPosition === 'left' && endPosition === 'left') {
          addSecondXPenultY();
        } else if (startPosition === 'left' && endPosition === 'right') {
          addHorizontalCenterLine();
        } else if (startPosition === 'left' && endPosition === 'top') {
          addHorizontalCenterLine();
        } else if (startPosition === 'left' && endPosition === 'bottom') {
          addSecondXPenultY();
        }
        break;
      }
  }
  points.push(penult);
  points.push(end);
  var lines = [];
  var paths = [];
  for (var i = 0; i < points.length; i++) {
    var source = points[i];
    var destination = points[i + 1];
    lines.push({
      sourceX: source[0],
      sourceY: source[1],
      destinationX: destination[0],
      destinationY: destination[1]
    });
    var finish = i === points.length - 2;
    if (finish && markered) {
      var path = svg_arrowTo(g, source[0], source[1], destination[0], destination[1], lineWidth, strokeStyle);
      paths.push(path);
      break;
    } else {
      var _path = lineTo(g, source[0], source[1], destination[0], destination[1], lineWidth, strokeStyle);
      paths.push(_path);
    }
    if (finish) {
      break;
    }
  }
  return {
    lines: lines,
    paths: paths
  };
}
function svg_arrowTo(g, x1, y1, x2, y2, lineWidth, strokeStyle) {
  var path = lineTo(g, x1, y1, x2, y2, lineWidth, strokeStyle);
  var id = 'arrow' + strokeStyle.replace('#', '');
  g.append('marker').attr('id', id).attr('markerUnits', 'strokeWidth').attr('viewBox', '0 0 12 12').attr('refX', 9).attr('refY', 6).attr('markerWidth', 12).attr('markerHeight', 12).attr('orient', 'auto').append('path').attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2').attr('fill', strokeStyle);
  path.attr('marker-end', 'url(#' + id + ')');
  return path;
}
function getDirection(x1, y1, x2, y2) {
  // Use approximatelyEquals to fix the problem of css position presicion
  if (x2 < x1 && approximatelyEquals(y2, y1)) {
    return 'l';
  }
  if (x2 > x1 && approximatelyEquals(y2, y1)) {
    return 'r';
  }
  if (approximatelyEquals(x2, x1) && y2 < y1) {
    return 'u';
  }
  if (approximatelyEquals(x2, x1) && y2 > y1) {
    return 'd';
  }
  if (x2 < x1 && y2 < y1) {
    return 'lu';
  }
  if (x2 > x1 && y2 < y1) {
    return 'ru';
  }
  if (x2 < x1 && y2 > y1) {
    return 'ld';
  }
  return 'rd';
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/on.js
var filterEvents = {};

var on_event = null;

if (typeof document !== "undefined") {
  var on_element = document.documentElement;
  if (!("onmouseenter" in on_element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = on_event; // Events can be reentrant (e.g., focus).
    on_event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      on_event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

/* harmony default export */ var on = (function(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
});

function customEvent(event1, listener, that, args) {
  var event0 = on_event;
  event1.sourceEvent = on_event;
  on_event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    on_event = event0;
  }
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selector.js
function none() {}

/* harmony default export */ var src_selector = (function(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/select.js



/* harmony default export */ var selection_select = (function(select) {
  if (typeof select !== "function") select = src_selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}

/* harmony default export */ var selectorAll = (function(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/selectAll.js



/* harmony default export */ var selectAll = (function(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/matcher.js
/* harmony default export */ var matcher = (function(selector) {
  return function() {
    return this.matches(selector);
  };
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/filter.js



/* harmony default export */ var selection_filter = (function(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/sparse.js
/* harmony default export */ var sparse = (function(update) {
  return new Array(update.length);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/enter.js



/* harmony default export */ var selection_enter = (function() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
});

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/constant.js
/* harmony default export */ var constant = (function(x) {
  return function() {
    return x;
  };
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/data.js




var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

/* harmony default export */ var selection_data = (function(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/exit.js



/* harmony default export */ var selection_exit = (function() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/join.js
/* harmony default export */ var join = (function(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/merge.js


/* harmony default export */ var selection_merge = (function(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/order.js
/* harmony default export */ var order = (function() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/sort.js


/* harmony default export */ var sort = (function(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
});

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/call.js
/* harmony default export */ var call = (function() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/nodes.js
/* harmony default export */ var nodes = (function() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/node.js
/* harmony default export */ var selection_node = (function() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/size.js
/* harmony default export */ var size = (function() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/empty.js
/* harmony default export */ var selection_empty = (function() {
  return !this.node();
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/each.js
/* harmony default export */ var each = (function(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";

/* harmony default export */ var namespaces = ({
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/namespace.js


/* harmony default export */ var namespace = (function(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/attr.js


function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

/* harmony default export */ var attr = (function(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/window.js
/* harmony default export */ var src_window = (function(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/style.js


function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

/* harmony default export */ var style = (function(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
});

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || src_window(node).getComputedStyle(node, null).getPropertyValue(name);
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

/* harmony default export */ var property = (function(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

/* harmony default export */ var classed = (function(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

/* harmony default export */ var selection_text = (function(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

/* harmony default export */ var html = (function(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

/* harmony default export */ var selection_raise = (function() {
  return this.each(raise);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

/* harmony default export */ var selection_lower = (function() {
  return this.each(lower);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/creator.js



function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

/* harmony default export */ var creator = (function(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/append.js


/* harmony default export */ var selection_append = (function(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/insert.js



function constantNull() {
  return null;
}

/* harmony default export */ var insert = (function(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : src_selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/remove.js
function remove_remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

/* harmony default export */ var selection_remove = (function() {
  return this.each(remove_remove);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

/* harmony default export */ var clone = (function(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/datum.js
/* harmony default export */ var datum = (function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/dispatch.js


function dispatchEvent(node, type, params) {
  var window = src_window(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

/* harmony default export */ var dispatch = (function(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/selection/index.js
































var selection_root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection_selection() {
  return new Selection([[document.documentElement]], selection_root);
}

Selection.prototype = selection_selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: join,
  merge: selection_merge,
  order: order,
  sort: sort,
  call: call,
  nodes: nodes,
  node: selection_node,
  size: size,
  empty: selection_empty,
  each: each,
  attr: attr,
  style: style,
  property: property,
  classed: classed,
  text: selection_text,
  html: html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: insert,
  remove: selection_remove,
  clone: clone,
  datum: datum,
  on: on,
  dispatch: dispatch
};

/* harmony default export */ var src_selection = (selection_selection);

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/select.js


/* harmony default export */ var src_select = (function(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], selection_root);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-dispatch/src/dispatch.js
var noop = {value: function() {}};

function dispatch_dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function dispatch_parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch_dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = dispatch_parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

/* harmony default export */ var src_dispatch = (dispatch_dispatch);

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/sourceEvent.js


/* harmony default export */ var sourceEvent = (function() {
  var current = on_event, source;
  while (source = current.sourceEvent) current = source;
  return current;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/point.js
/* harmony default export */ var src_point = (function(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/mouse.js



/* harmony default export */ var mouse = (function(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return src_point(node, event);
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-selection/src/touch.js



/* harmony default export */ var src_touch = (function(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return src_point(node, touch);
    }
  }

  return null;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-drag/src/noevent.js


function nopropagation() {
  on_event.stopImmediatePropagation();
}

/* harmony default export */ var noevent = (function() {
  on_event.preventDefault();
  on_event.stopImmediatePropagation();
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-drag/src/nodrag.js



/* harmony default export */ var nodrag = (function(view) {
  var root = view.document.documentElement,
      selection = src_select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
});

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = src_select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-drag/src/constant.js
/* harmony default export */ var src_constant = (function(x) {
  return function() {
    return x;
  };
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-drag/src/event.js
function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/d3-drag/src/drag.js







// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !on_event.ctrlKey && !on_event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? {x: on_event.x, y: on_event.y} : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

/* harmony default export */ var src_drag = (function() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = src_dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
    if (!gesture) return;
    src_select(on_event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    nodrag(on_event.view);
    nopropagation();
    mousemoving = false;
    mousedownx = on_event.clientX;
    mousedowny = on_event.clientY;
    gesture("start");
  }

  function mousemoved() {
    noevent();
    if (!mousemoving) {
      var dx = on_event.clientX - mousedownx, dy = on_event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag");
  }

  function mouseupped() {
    src_select(on_event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(on_event.view, mousemoving);
    noevent();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = on_event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches[i].identifier, c, src_touch, this, arguments)) {
        nopropagation();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches = on_event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = on_event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id), s, dx, dy,
        sublisteners = listeners.copy();

    if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
      if ((on_event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;

    return function gesture(type) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[id] = gesture, n = active++; break;
        case "end": delete gestures[id], --active; // nobreak
        case "drag": p = point(container, id), n = active; break;
      }
      customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : src_constant(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : src_constant(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : src_constant(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : src_constant(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
});

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/render.js



function render_render(g, node, isSelected) {
  node.width = node.width || 120;
  node.height = node.height || 60;
  var header = null;
  var title = null;
  var theme = !node.theme ? {} : node.theme;
  var headerBackgroundColor = theme.headerBackgroundColor ? theme.headerBackgroundColor : "#f1f3f4";
  var bodyBackgroundColor = theme.bodyBackgroundColor ? theme.bodyBackgroundColor : "white";
  var bodyTextColor = theme.bodyTextColor ? theme.bodyTextColor : "black";
  var headerTextColor = theme.headerTextColor ? theme.headerTextColor : "black";
  var borderColor = isSelected ? "#666666" : "#bbbbbb";
  if (theme.borderColor) {
    if (isSelected) {
      borderColor = theme.borderColorSelected;
    } else {
      borderColor = theme.borderColor;
    }
  }
  if (node.type !== "start" && node.type !== "end") {
    // title
    header = g.append("rect").attr("x", node.x).attr("y", node.y).attr("stroke", borderColor).attr("class", "title").style("height", "20px").style("fill", headerBackgroundColor).style("stroke-width", "1px").style("width", node.width + "px");
    title = g.append("text").attr("fill", headerTextColor).attr("x", node.x + 4).attr("y", node.y + 15).attr("class", "unselectable").text(function () {
      return node.name;
    }).each(function wrap() {
      var self = src_select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text();
      while (textLength > node.width - 2 * 4 && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + "...");
        textLength = self.node().getComputedTextLength();
      }
    });
  }
  // body
  var body = g.append("rect").attr("class", "body");
  body.style("width", node.width + "px").style("fill", bodyBackgroundColor).style("stroke-width", "1px");
  if (node.type !== "start" && node.type !== "end") {
    body.attr("x", node.x).attr("y", node.y + 20);
    body.style("height", roundTo20(node.height - 20) + "px");
  } else {
    body.attr("x", node.x).attr("y", node.y).classed(node.type, true).attr("rx", 30);
    body.style("height", roundTo20(node.height) + "px");
  }
  body.attr("stroke", borderColor);

  // body text
  var text = node.type === "start" ? "Start" : node.type === "end" ? "End" : !node.approvers || node.approvers.length === 0 ? "No approver" : node.approvers.length > 1 ? "".concat(node.approvers[0].name + "...") : node.approvers[0].name;
  var bodyTextY;
  if (node.type !== "start" && node.type !== "end") {
    bodyTextY = node.y + 25 + roundTo20(node.height - 20) / 2;
  } else {
    bodyTextY = node.y + 5 + roundTo20(node.height) / 2;
  }
  var content = g.append("text").attr("fill", bodyTextColor).attr("x", node.x + node.width / 2).attr("y", bodyTextY).attr("class", "unselectable").attr("text-anchor", "middle").text(function () {
    return text;
  }).each(function wrap() {
    var self = src_select(this),
      textLength = self.node().getComputedTextLength(),
      text = self.text();
    while (textLength > node.width - 2 * 4 && text.length > 0) {
      text = text.slice(0, -1);
      self.text(text + "...");
      textLength = self.node().getComputedTextLength();
    }
  });
  return {
    header: header,
    title: title,
    body: body,
    content: content
  };
}
/* harmony default export */ var flowchart_render = (render_render);
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/utils/dom.js


function ifElementContainChildNode(parentSelector, checkedNode) {
  var parentElement = document.querySelector(parentSelector);
  var childrenNodes = Array.from(parentElement.childNodes);
  return childrenNodes.some(function (node) {
    return node.contains(checkedNode);
  });
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/cache-loader/dist/cjs.js??ref--12-0!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/thread-loader/dist/cjs.js!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/babel-loader/lib!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/cache-loader/dist/cjs.js??ref--0-0!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/vue-loader/lib??vue-loader-options!E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/Flowchart.vue?vue&type=script&lang=js


















function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = Flowchartvue_type_script_lang_js_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function Flowchartvue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Flowchartvue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Flowchartvue_type_script_lang_js_arrayLikeToArray(o, minLen); }
function Flowchartvue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }






/* harmony default export */ var Flowchartvue_type_script_lang_js = ({
  name: "flowchart",
  props: {
    nodes: {
      type: Array,
      default: function _default() {
        return [{
          id: 1,
          x: 140,
          y: 270,
          name: "Start",
          type: "start"
        }, {
          id: 2,
          x: 540,
          y: 270,
          name: "End",
          type: "end"
        }];
      }
    },
    connections: {
      type: Array,
      default: function _default() {
        return [{
          source: {
            id: 1,
            position: "center"
          },
          destination: {
            id: 2,
            position: "left"
          },
          id: 1,
          type: "pass"
        }];
      }
    },
    width: {
      type: [String, Number],
      default: 800
    },
    height: {
      type: [String, Number],
      default: 600
    },
    overflow: {
      type: [String],
      default: 'auto'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    readOnlyPermissions: {
      type: Object,
      default: function _default() {
        return {
          allowDragNodes: false,
          allowSave: false,
          allowAddNodes: false,
          allowEditNodes: false,
          allowEditConnections: false,
          allowDblClick: false
        };
      }
    },
    removeRequiresConfirmation: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      internalNodes: [],
      internalConnections: [],
      connectingInfo: {
        source: null,
        sourcePosition: null
      },
      selectionInfo: null,
      moveInfo: null,
      currentNodes: [],
      currentConnections: [],
      /**
       * Mouse position(relative to chart div)
       */
      cursorToChartOffset: {
        x: 0,
        y: 0
      },
      clickedOnce: false,
      pathClickedOnce: false,
      /**
       * lines of all internalConnections
       */
      lines: [],
      invalidConnections: [],
      moveCoordinates: {
        startX: 0,
        startY: 0,
        diffX: 0,
        diffY: 0
      },
      customViewBox: 680,
      leftViewBox: 50,
      topViewBox: 0,
      isMobile: window.innerWidth < 756,
      listOfTouches: []
    };
  },
  methods: {
    calculateConnectionTextPosition: function calculateConnectionTextPosition(connObject, moveRight, moveDown) {
      var maxX = connObject.lines[connObject.lines.length - 1].sourceX;
      var minX = connObject.lines[0].destinationX;
      var targetYPosition;
      if (!moveRight && moveDown || moveRight && moveDown) {
        targetYPosition = connObject.lines.length - 2;
      } else {
        targetYPosition = 1;
      }
      var targetY = connObject.lines[targetYPosition];
      var textX = minX + (maxX - minX) / 2;
      var textY = targetY.sourceY > targetY.destinationY ? targetY.destinationY : targetY.sourceY;
      return {
        x: textX,
        y: textY
      };
    },
    add: function add(node) {
      if (this.readonly && !this.readOnlyPermissions.allowAddNodes) {
        return;
      }
      this.internalNodes.push(node);
      this.$emit("add", node, this.internalNodes, this.internalConnections);
    },
    editCurrent: function editCurrent() {
      if (this.currentNodes.length === 1) {
        this.editNode(this.currentNodes[0]);
      } else if (this.currentConnections.length === 1) {
        this.editConnection(this.currentConnections[0]);
      }
    },
    editNode: function editNode(node) {
      if (this.readonly && !this.readOnlyPermissions.allowEditNodes) {
        return;
      }
      this.$emit("editnode", node);
    },
    editConnection: function editConnection(connection) {
      if (this.readonly && !this.readOnlyPermissions.allowEditConnections) {
        return;
      }
      this.$emit("editconnection", connection);
    },
    handleChartMouseWheel: function handleChartMouseWheel(event) {
      event.stopPropagation();
      event.preventDefault();
      var svg = document.getElementById("svg");
      if (event.deltaY > 0 && zoom === 0.1) {
        return;
      }
      var zoom = event.deltaY / 2;
      if (zoom > 0) {
        this.leftViewBox = this.customViewBox < 1600 ? this.leftViewBox - Math.round(zoom / 2) : this.leftViewBox;
        this.topViewBox = this.customViewBox < 1600 ? this.topViewBox - Math.round(zoom / 5) : this.topViewBox;
        this.customViewBox = this.customViewBox < 1600 ? this.customViewBox + zoom : this.customViewBox;
      } else {
        this.leftViewBox = this.customViewBox > 200 ? this.leftViewBox - Math.round(zoom / 2) : this.leftViewBox;
        this.topViewBox = this.customViewBox > 200 ? this.topViewBox - Math.round(zoom / 5) : this.topViewBox;
        this.customViewBox = this.customViewBox > 200 ? this.customViewBox + zoom : this.customViewBox;
      }
      svg.setAttribute('viewBox', "".concat(this.leftViewBox, " ").concat(this.topViewBox, " ").concat(this.customViewBox, " ").concat(this.customViewBox));
    },
    handleChartMouseUp: function () {
      var _handleChartMouseUp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
        var tempId, conn;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (this.connectingInfo.source) {
                if (this.hoveredConnector) {
                  if (this.isNodesConnectionValid()) {
                    // Node can't connect to itself
                    tempId = +new Date();
                    conn = {
                      source: {
                        id: this.connectingInfo.source.id,
                        position: this.connectingInfo.sourcePosition
                      },
                      destination: {
                        id: this.hoveredConnector.node.id,
                        position: this.hoveredConnector.position
                      },
                      id: tempId,
                      type: "pass"
                    };
                    this.internalConnections.push(conn);
                    this.$emit("connect", conn, this.internalNodes, this.internalConnections);
                  }
                }
                this.connectingInfo.source = null;
                this.connectingInfo.sourcePosition = null;
              }
              if (this.selectionInfo) {
                this.selectionInfo = null;
              }
              if (this.moveInfo) {
                this.$emit("movediff", {
                  x: this.moveCoordinates.diffX,
                  y: this.moveCoordinates.diffY
                });
                this.moveInfo = null;
              }
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function handleChartMouseUp(_x) {
        return _handleChartMouseUp.apply(this, arguments);
      }
      return handleChartMouseUp;
    }(),
    handleTouch: function handleTouch(event) {
      var svg = document.querySelector('#svg');
      if (this.isMobile) {
        this.moveCoordinates.startX = event.changedTouches[0].pageX;
        this.moveCoordinates.startY = event.changedTouches[0].pageY;
        var x = Math.round(this.moveCoordinates.startX) - svg.getBoundingClientRect().left;
        var y = Math.round(this.moveCoordinates.startY) - svg.getBoundingClientRect().top;
        this.moveInfo = {
          x: x,
          y: y
        };
      }
      if (this.isMouseClickOnSlot(event.target)) {
        return;
      }
    },
    zoomByTouch: function zoomByTouch(direction) {
      this.leftViewBox = this.leftViewBox - Math.round(direction / 2);
      this.topViewBox = this.topViewBox - Math.round(direction / 5);
      this.customViewBox = this.customViewBox + direction;
    },
    handleTouchMove: function () {
      var _handleTouchMove = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
        var boundingClientRect, actualX, actualY, _iterator, _step, element, sourceOffset, destinationPosition;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(this.isMobile && event.targetTouches.length == 1)) {
                _context2.next = 14;
                break;
              }
              boundingClientRect = event.currentTarget.getBoundingClientRect();
              actualX = event.changedTouches[0].pageX - boundingClientRect.left - window.scrollX;
              this.cursorToChartOffset.x = Math.trunc(actualX);
              actualY = event.changedTouches[0].pageY - boundingClientRect.top;
              this.cursorToChartOffset.y = Math.trunc(actualY);
              if (!this.connectingInfo.source) {
                _context2.next = 14;
                break;
              }
              _context2.next = 9;
              return this.renderConnections();
            case 9:
              _iterator = _createForOfIteratorHelper(document.querySelectorAll("#svg .connector"));
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  element = _step.value;
                  element.classList.add("active");
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              sourceOffset = this.getNodeConnectorOffset(this.connectingInfo.source.id, this.connectingInfo.sourcePosition);
              destinationPosition = this.hoveredConnector ? this.hoveredConnector.position : null;
              this.arrowTo(sourceOffset.x, sourceOffset.y, this.cursorToChartOffset.x, this.cursorToChartOffset.y, this.connectingInfo.sourcePosition, destinationPosition);
            case 14:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function handleTouchMove(_x2) {
        return _handleTouchMove.apply(this, arguments);
      }
      return handleTouchMove;
    }(),
    isNodesConnectionValid: function isNodesConnectionValid() {
      var _this = this;
      var connectionToItself = this.connectingInfo.source.id === this.hoveredConnector.node.id;
      var connectionAlreadyExists = this.internalConnections.some(function (x) {
        return x.source.id === _this.connectingInfo.source.id && x.source.position === _this.connectingInfo.sourcePosition && x.destination.id === _this.hoveredConnector.node.id && x.destination.position === _this.hoveredConnector.position;
      });
      return !connectionToItself && !connectionAlreadyExists;
    },
    handleChartMouseMove: function () {
      var _handleChartMouseMove = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(event) {
        var boundingClientRect, actualX, actualY, _iterator2, _step2, element, sourceOffset, destinationPosition;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (this.isMobile) {
                _context3.next = 16;
                break;
              }
              // calc offset of cursor to chart
              boundingClientRect = event.currentTarget.getBoundingClientRect();
              actualX = event.pageX - boundingClientRect.left - window.scrollX;
              this.cursorToChartOffset.x = Math.trunc(actualX);
              actualY = event.pageY - boundingClientRect.top - window.scrollY;
              this.cursorToChartOffset.y = Math.trunc(actualY);
              if (!this.connectingInfo.source) {
                _context3.next = 14;
                break;
              }
              _context3.next = 9;
              return this.renderConnections();
            case 9:
              _iterator2 = _createForOfIteratorHelper(document.querySelectorAll("#svg .connector"));
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  element = _step2.value;
                  element.classList.add("active");
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              sourceOffset = this.getNodeConnectorOffset(this.connectingInfo.source.id, this.connectingInfo.sourcePosition);
              destinationPosition = this.hoveredConnector ? this.hoveredConnector.position : null;
              this.arrowTo(sourceOffset.x, sourceOffset.y, this.cursorToChartOffset.x, this.cursorToChartOffset.y, this.connectingInfo.sourcePosition, destinationPosition);
            case 14:
              _context3.next = 17;
              break;
            case 16:
              event.preventDefault();
            case 17:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function handleChartMouseMove(_x3) {
        return _handleChartMouseMove.apply(this, arguments);
      }
      return handleChartMouseMove;
    }(),
    handleChartDblClick: function handleChartDblClick(event) {
      if (this.isMouseClickOnSlot(event.target)) {
        return;
      }
      if (this.readonly && !this.readOnlyPermissions.allowDblClick) {
        return;
      }
      this.$emit("dblclick", {
        x: event.offsetX,
        y: event.offsetY
      });
    },
    handleChartMouseDown: function handleChartMouseDown(event) {
      if (this.isMouseClickOnSlot(event.target)) {
        return;
      }
      this.moveCoordinates.startX = event.pageX;
      this.moveCoordinates.startY = event.pageY;
      this.initializeMovingAllElements(event);
    },
    isMouseClickOnSlot: function isMouseClickOnSlot(eventTargetNode) {
      return ifElementContainChildNode('#chart-slot', eventTargetNode);
    },
    initializeMovingAllElements: function initializeMovingAllElements(event) {
      if (!this.isMouseOverAnyNode()) {
        this.moveInfo = {
          x: event.offsetX,
          y: event.offsetY
        };
      }
    },
    isMouseOverAnyNode: function isMouseOverAnyNode() {
      var cursorPosition = {
        x: this.cursorToChartOffset.x,
        y: this.cursorToChartOffset.y
      };
      var result = false;
      for (var currentNodeIndex = 0; currentNodeIndex < this.internalNodes.length; currentNodeIndex++) {
        var node = this.internalNodes[currentNodeIndex];
        var nodeArea = {
          start: {
            x: node.x,
            y: node.y
          },
          end: {
            x: node.x + node.width,
            y: node.y + node.height
          }
        };
        var mousePointIntersectNodeArea = cursorPosition.x >= nodeArea.start.x && cursorPosition.x <= nodeArea.end.x && cursorPosition.y >= nodeArea.start.y && cursorPosition.y <= nodeArea.end.y;
        if (mousePointIntersectNodeArea) {
          result = true;
          break;
        }
      }
      return result;
    },
    getConnectorPosition: function getConnectorPosition(node) {
      var halfWidth = node.width / 2;
      var halfHeight = node.height / 2;
      var result = {};
      if (this.hasNodeConnector(node, "top")) {
        result.top = {
          x: node.x + halfWidth,
          y: node.y
        };
      }
      if (this.hasNodeConnector(node, "right")) {
        result.right = {
          x: node.x + node.width,
          y: node.y + halfHeight
        };
      }
      if (this.hasNodeConnector(node, "bottom")) {
        result.bottom = {
          x: node.x + halfWidth,
          y: node.y + node.height
        };
      }
      if (this.hasNodeConnector(node, "left")) {
        result.left = {
          x: node.x,
          y: node.y + halfHeight
        };
      }
      return result;
    },
    hasNodeConnector: function hasNodeConnector(node, position) {
      return !node.connectors || node.connectors.includes(position);
    },
    moveAllElements: function moveAllElements() {
      var that = this;
      if (!that.moveInfo) {
        return;
      }
      var moveX = that.moveInfo.x - that.cursorToChartOffset.x;
      var moveY = that.moveInfo.y - that.cursorToChartOffset.y;
      this.internalNodes.forEach(function (element) {
        element.x -= moveX;
        element.y -= moveY;
      });
      that.moveInfo.x = that.cursorToChartOffset.x;
      that.moveInfo.y = that.cursorToChartOffset.y;
      this.$emit("moveelems", that.internalNodes);
    },
    renderSelection: function renderSelection() {
      var that = this;
      // render selection rectangle
      if (that.selectionInfo) {
        that.currentNodes.splice(0, that.currentNodes.length);
        that.currentConnections.splice(0, that.currentConnections.length);
        var edge = getEdgeOfPoints([{
          x: that.selectionInfo.x,
          y: that.selectionInfo.y
        }, {
          x: that.cursorToChartOffset.x,
          y: that.cursorToChartOffset.y
        }]);
        var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll("#svg .selection")),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var rect = _step3.value;
            rect.classList.add("active");
            rect.setAttribute("x", edge.start.x);
            rect.setAttribute("y", edge.start.y);
            rect.setAttribute("width", edge.end.x - edge.start.x);
            rect.setAttribute("height", edge.end.y - edge.start.y);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        that.internalNodes.forEach(function (item) {
          var points = [{
            x: item.x,
            y: item.y
          }, {
            x: item.x,
            y: item.y + item.height
          }, {
            x: item.x + item.width,
            y: item.y
          }, {
            x: item.x + item.width,
            y: item.y + item.height
          }];
          if (points.some(function (point) {
            return pointRectangleIntersection(point, edge);
          })) {
            that.currentNodes.push(item);
          }
        });
        that.lines.forEach(function (line) {
          var points = [{
            x: line.sourceX,
            y: line.sourceY
          }, {
            x: line.destinationX,
            y: line.destinationY
          }];
          if (points.every(function (point) {
            return pointRectangleIntersection(point, edge);
          }) && that.currentConnections.every(function (item) {
            return item.id !== line.id;
          })) {
            var connection = that.internalConnections.filter(function (conn) {
              return conn.id === line.id;
            })[0];
            that.currentConnections.push(connection);
          }
        });
      } else {
        var _iterator4 = _createForOfIteratorHelper(document.querySelectorAll("#svg > .selection")),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var element = _step4.value;
            element.classList.remove("active");
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    },
    renderConnections: function renderConnections() {
      var that = this;
      return new Promise(function (resolve) {
        that.$nextTick(function () {
          var _iterator5 = _createForOfIteratorHelper(document.querySelectorAll("#svg > g.connection")),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var element = _step5.value;
              element.remove();
            }
            // render lines
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          that.lines = [];
          that.invalidConnections = [];
          that.internalConnections.forEach(function (conn) {
            if (!that.haveNodesSelectedConnectors(conn)) {
              that.invalidConnections.push(conn);
              return;
            }
            var sourcePosition = that.getNodeConnectorOffset(conn.source.id, conn.source.position);
            var destinationPosition = that.getNodeConnectorOffset(conn.destination.id, conn.destination.position);
            var colors = {
              pass: "#52c41a",
              reject: "#ff6864",
              accept: "#5c60ff"
            };
            if (that.currentConnections.filter(function (item) {
              return item === conn;
            }).length > 0) {
              colors = {
                pass: "#3a8c13",
                reject: "#e31600",
                accept: "#0500b5"
              };
            }
            var result = that.arrowTo(sourcePosition.x, sourcePosition.y, destinationPosition.x, destinationPosition.y, conn.source.position, conn.destination.position, colors[conn.type], conn.name);
            var _iterator6 = _createForOfIteratorHelper(result.paths),
              _step6;
            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var path = _step6.value;
                path.on("mousedown", function () {
                  on_event.stopPropagation();
                  if (that.pathClickedOnce) {
                    that.editConnection(conn);
                  } else {
                    var timer = setTimeout(function () {
                      that.pathClickedOnce = false;
                      clearTimeout(timer);
                    }, 300);
                    that.pathClickedOnce = true;
                  }
                  that.currentNodes.splice(0, that.currentNodes.length);
                  that.currentConnections.splice(0, that.currentConnections.length);
                  that.currentConnections.push(conn);
                });
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
            var _iterator7 = _createForOfIteratorHelper(result.lines),
              _step7;
            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var line = _step7.value;
                that.lines.push({
                  sourceX: line.sourceX,
                  sourceY: line.sourceY,
                  destinationX: line.destinationX,
                  destinationY: line.destinationY,
                  id: conn.id
                });
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
          });
          resolve();
        });
      });
    },
    haveNodesSelectedConnectors: function haveNodesSelectedConnectors(connection) {
      var sourceNode = this.nodes.find(function (x) {
        return x.id === connection.source.id;
      });
      var destinationNode = this.nodes.find(function (x) {
        return x.id === connection.destination.id;
      });
      return this.hasNodeConnector(sourceNode, connection.source.position) && this.hasNodeConnector(destinationNode, connection.destination.position);
    },
    renderNodes: function renderNodes() {
      var that = this;
      return new Promise(function (resolve) {
        var _iterator8 = _createForOfIteratorHelper(document.querySelectorAll("#svg > g.node")),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var node = _step8.value;
            node.remove();
          }
          // render nodes
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
        that.internalNodes.forEach(function (node) {
          that.renderNode(node, that.currentNodes.filter(function (item) {
            return item === node;
          }).length > 0);
        });
        resolve();
      });
    },
    getNodeConnectorOffset: function getNodeConnectorOffset(nodeId, connectorPosition) {
      var node = this.internalNodes.filter(function (item) {
        return item.id === nodeId;
      })[0];
      return this.getConnectorPosition(node)[connectorPosition];
    },
    append: function append(element) {
      var svg = src_select("#svg");
      return svg.insert(element, ".selection");
    },
    guideLineTo: function guideLineTo(x1, y1, x2, y2) {
      var g = this.append("g");
      g.classed("guideline", true);
      lineTo(g, x1, y1, x2, y2, 1, "#a3a3a3", [5, 3]);
    },
    arrowTo: function arrowTo(x1, y1, x2, y2, startPosition, endPosition, color, connectionName) {
      var g = this.append("g");
      g.classed("connection", true);
      var connectionLines = connect(g, x1, y1, x2, y2, startPosition, endPosition, 1, color || "#a3a3a3", true);
      var moveRight = x2 - x1 > 0;
      var moveDown = y2 - y1 > 0;
      if (connectionName) {
        var _this$calculateConnec = this.calculateConnectionTextPosition(connectionLines, moveRight, moveDown),
          x = _this$calculateConnec.x,
          y = _this$calculateConnec.y;
        g.append('text').attr('x', x).attr('y', y).attr('text-anchor', 'middle').text(connectionName);
      }
      var mainConnection = connect(g, x1, y1, x2, y2, startPosition, endPosition, 5, "transparent", false);
      // a 5px cover to make mouse operation conveniently
      return mainConnection;
    },
    renderNode: function renderNode(node, isSelected) {
      var that = this;
      var g = that.append("g").attr("cursor", "move").classed("node", true);
      var children = flowchart_render(g, node, isSelected);
      that.$emit('render', node, children);
      var dragHandler = src_drag().on("start", function () {
        // handle mousedown
        var isNotCurrentNode = that.currentNodes.filter(function (item) {
          return item === node;
        }).length === 0;
        if (isNotCurrentNode) {
          that.currentConnections.splice(0, that.currentConnections.length);
          that.currentNodes.splice(0, that.currentNodes.length);
          that.currentNodes.push(node);
        }
        if (that.clickedOnce) {
          that.currentNodes.splice(0, that.currentNodes.length);
          that.editNode(node);
        } else {
          var timer = setTimeout(function () {
            that.clickedOnce = false;
            clearTimeout(timer);
          }, 300);
          that.clickedOnce = true;
        }
      }).on("drag", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var zoom, _iterator9, _step9, currentNode, x, y, _iterator10, _step10, element, edge, expectX, expectY;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(that.readonly && !that.readOnlyPermissions.allowDragNodes)) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return");
            case 2:
              zoom = parseFloat(document.getElementById("svg").style.zoom || 1);
              _iterator9 = _createForOfIteratorHelper(that.currentNodes);
              try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                  currentNode = _step9.value;
                  x = on_event.dx / zoom;
                  if (currentNode.x + x < 0) {
                    x = -currentNode.x;
                  }
                  currentNode.x += x;
                  y = on_event.dy / zoom;
                  if (currentNode.y + y < 0) {
                    y = -currentNode.y;
                  }
                  currentNode.y += y;
                }
              } catch (err) {
                _iterator9.e(err);
              } finally {
                _iterator9.f();
              }
              _iterator10 = _createForOfIteratorHelper(document.querySelectorAll("#svg > g.guideline"));
              try {
                for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                  element = _step10.value;
                  element.remove();
                }
              } catch (err) {
                _iterator10.e(err);
              } finally {
                _iterator10.f();
              }
              edge = that.getCurrentNodesEdge();
              expectX = Math.round(Math.round(edge.start.x) / 10) * 10;
              expectY = Math.round(Math.round(edge.start.y) / 10) * 10;
              that.internalNodes.forEach(function (item) {
                if (that.currentNodes.filter(function (currentNode) {
                  return currentNode === item;
                }).length === 0) {
                  if (item.x === expectX) {
                    // vertical guideline
                    if (item.y < expectY) {
                      that.guideLineTo(item.x, item.y + item.height, expectX, expectY);
                    } else {
                      that.guideLineTo(expectX, expectY + item.height, item.x, item.y);
                    }
                  }
                  if (item.y === expectY) {
                    // horizontal guideline
                    if (item.x < expectX) {
                      that.guideLineTo(item.x + item.width, item.y, expectX, expectY);
                    } else {
                      that.guideLineTo(expectX + item.width, expectY, item.x, item.y);
                    }
                  }
                }
              });
            case 11:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }))).on("end", function () {
        // for (let element of document.querySelectorAll("#svg > g.guideline")) {
        //   element.remove();
        // }
        // for (let currentNode of that.currentNodes) {
        //   currentNode.x = Math.round(Math.round(currentNode.x) / 10) * 10;
        //   currentNode.y = Math.round(Math.round(currentNode.y) / 10) * 10;
        // }

        // that.$emit("nodesdragged", that.currentNodes);
      });
      g.call(dragHandler);
      g.on("mousedown", function () {
        if (!on_event.ctrlKey) {
          return;
        }
        var isNotCurrentNode = that.currentNodes.filter(function (item) {
          return item === node;
        }).length === 0;
        if (isNotCurrentNode) {
          that.currentNodes.push(node);
        } else {
          that.currentNodes.splice(that.currentNodes.indexOf(node), 1);
        }
      });
      var connectors = [];
      var connectorPosition = this.getConnectorPosition(node);
      var _loop = function _loop(position) {
        var positionElement = connectorPosition[position];
        var connector = g.append("circle").attr("cx", positionElement.x).attr("cy", positionElement.y).attr("r", 4).attr("class", "connector");
        connector.on("mousedown", function () {
          on_event.stopPropagation();
          if (node.type === "end" || that.readonly) {
            return;
          }
          that.connectingInfo.source = node;
          that.connectingInfo.sourcePosition = position;
        }).on("mouseup", function () {
          on_event.stopPropagation();
          if (that.connectingInfo.source) {
            if (that.connectingInfo.source.id !== node.id) {
              // Node can't connect to itself
              var tempId = +new Date();
              var conn = {
                source: {
                  id: that.connectingInfo.source.id,
                  position: that.connectingInfo.sourcePosition
                },
                destination: {
                  id: node.id,
                  position: position
                },
                id: tempId,
                type: "pass"
              };
              that.internalConnections.push(conn);
              that.$emit("connect", conn, that.internalNodes, that.internalConnections);
            }
            that.connectingInfo.source = null;
            that.connectingInfo.sourcePosition = null;
          }
        }).on("mouseover", function () {
          connector.classed("active", true);
        }).on("mouseout", function () {
          connector.classed("active", false);
        });
        connectors.push(connector);
      };
      for (var position in connectorPosition) {
        _loop(position);
      }
      g.on("mouseover", function () {
        connectors.forEach(function (conn) {
          return conn.classed("active", true);
        });
      }).on("mouseout", function () {
        connectors.forEach(function (conn) {
          return conn.classed("active", false);
        });
      });
    },
    getCurrentNodesEdge: function getCurrentNodesEdge() {
      var points = this.currentNodes.map(function (node) {
        return {
          x: node.x,
          y: node.y
        };
      });
      points.push.apply(points, _toConsumableArray(this.currentNodes.map(function (node) {
        return {
          x: node.x + node.width,
          y: node.y + node.height
        };
      })));
      return getEdgeOfPoints(points);
    },
    save: function save() {
      if (this.readonly && !this.readOnlyPermissions.allowSave) {
        return;
      }
      this.$emit("save", this.internalNodes, this.internalConnections);
    },
    remove: function () {
      var _remove = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var anyElementToRemove;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!(this.readonly && !this.readOnlyPermissions.allowRemove)) {
                _context5.next = 2;
                break;
              }
              return _context5.abrupt("return");
            case 2:
              anyElementToRemove = this.currentConnections.length > 0 || this.currentNodes.length > 0;
              if (anyElementToRemove) {
                _context5.next = 5;
                break;
              }
              return _context5.abrupt("return");
            case 5:
              if (!this.removeRequiresConfirmation) {
                this.removeSelectedNodesAndConnections();
              } else {
                this.$emit("removeconfirmationrequired", this.currentNodes, this.currentConnections);
              }
            case 6:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function remove() {
        return _remove.apply(this, arguments);
      }
      return remove;
    }(),
    confirmRemove: function confirmRemove() {
      this.removeSelectedNodesAndConnections();
    },
    removeSelectedNodesAndConnections: function removeSelectedNodesAndConnections() {
      if (this.readonly) {
        return;
      }
      if (this.currentConnections.length > 0) {
        var _iterator11 = _createForOfIteratorHelper(this.currentConnections),
          _step11;
        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var conn = _step11.value;
            this.removeConnection(conn);
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
        this.currentConnections.splice(0, this.currentConnections.length);
      }
      if (this.currentNodes.length > 0) {
        var _iterator12 = _createForOfIteratorHelper(this.currentNodes),
          _step12;
        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var node = _step12.value;
            this.removeNode(node);
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }
        this.currentNodes.splice(0, this.currentNodes.length);
      }
    },
    removeNode: function removeNode(node) {
      var connections = this.internalConnections.filter(function (item) {
        return item.source.id === node.id || item.destination.id === node.id;
      });
      var _iterator13 = _createForOfIteratorHelper(connections),
        _step13;
      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var connection = _step13.value;
          this.internalConnections.splice(this.internalConnections.indexOf(connection), 1);
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
      this.internalNodes.splice(this.internalNodes.indexOf(node), 1);
      this.$emit("delete", node, this.internalNodes, this.internalConnections);
    },
    removeConnection: function removeConnection(conn) {
      var index = this.internalConnections.indexOf(conn);
      this.internalConnections.splice(index, 1);
      this.$emit("disconnect", conn, this.internalNodes, this.internalConnections);
    },
    moveCurrentNode: function moveCurrentNode(x, y) {
      if (this.currentNodes.length > 0 && !this.readonly) {
        var _iterator14 = _createForOfIteratorHelper(this.currentNodes),
          _step14;
        try {
          for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
            var node = _step14.value;
            if (node.x + x < 0) {
              x = -node.x;
            }
            node.x += x;
            if (node.y + y < 0) {
              y = -node.y;
            }
            node.y += y;
          }
        } catch (err) {
          _iterator14.e(err);
        } finally {
          _iterator14.f();
        }
      }
    },
    init: function init() {
      var _this2 = this;
      var that = this;
      that.internalNodes.splice(0, that.internalNodes.length);
      that.internalConnections.splice(0, that.internalConnections.length);
      that.nodes.forEach(function (node) {
        var newNode = Object.assign({}, node);
        newNode.x = newNode.x - _this2.moveCoordinates.diffX;
        newNode.y = newNode.y + _this2.moveCoordinates.diffY;
        newNode.width = newNode.width || 120;
        newNode.height = newNode.height || 60;
        that.internalNodes.push(newNode);
      });
      that.connections.forEach(function (connection) {
        that.internalConnections.push(JSON.parse(JSON.stringify(connection)));
      });
    }
  },
  mounted: function mounted() {
    var that = this;
    that.init();
    var svg = document.querySelector('#svg');
    svg.setAttribute('viewBox', "".concat(this.leftViewBox, " ").concat(this.topViewBox, " ").concat(this.customViewBox, " ").concat(this.customViewBox));
    document.onkeydown = function (event) {
      switch (event.keyCode) {
        case 37:
          that.moveCurrentNode(-10, 0);
          break;
        case 38:
          that.moveCurrentNode(0, -10);
          break;
        case 39:
          that.moveCurrentNode(10, 0);
          break;
        case 40:
          that.moveCurrentNode(0, 10);
          break;
        case 27:
          that.currentNodes.splice(0, that.currentNodes.length);
          that.currentConnections.splice(0, that.currentConnections.length);
          break;
        case 65:
          if (document.activeElement === document.getElementById("chart")) {
            var _that$currentNodes, _that$currentConnecti;
            that.currentNodes.splice(0, that.currentNodes.length);
            that.currentConnections.splice(0, that.currentConnections.length);
            (_that$currentNodes = that.currentNodes).push.apply(_that$currentNodes, _toConsumableArray(that.internalNodes));
            (_that$currentConnecti = that.currentConnections).push.apply(_that$currentConnecti, _toConsumableArray(that.internalConnections));
            event.preventDefault();
          }
          break;
        case 46:
          that.remove();
          break;
        default:
          break;
      }
    };
  },
  created: function created() {},
  computed: {
    hoveredConnector: function hoveredConnector() {
      var _iterator15 = _createForOfIteratorHelper(this.internalNodes),
        _step15;
      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var node = _step15.value;
          var connectorPosition = this.getConnectorPosition(node);
          for (var prop in connectorPosition) {
            var entry = connectorPosition[prop];
            if (Math.hypot(entry.x - this.cursorToChartOffset.x, entry.y - this.cursorToChartOffset.y) < 10) {
              return {
                position: prop,
                node: node
              };
            }
          }
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }
      return null;
    },
    hoveredConnection: function hoveredConnection() {
      var _this3 = this;
      var _iterator16 = _createForOfIteratorHelper(this.lines),
        _step16;
      try {
        var _loop2 = function _loop2() {
            var line = _step16.value;
            var distance = distanceOfPointToLine(line.sourceX, line.sourceY, line.destinationX, line.destinationY, _this3.cursorToChartOffset.x, _this3.cursorToChartOffset.y);
            if (distance < 5 && between(line.sourceX - 2, line.destinationX + 2, _this3.cursorToChartOffset.x) && between(line.sourceY - 2, line.destinationY + 2, _this3.cursorToChartOffset.y)) {
              var connections = _this3.internalConnections.filter(function (item) {
                return item.id === line.id;
              });
              return {
                v: connections.length > 0 ? connections[0] : null
              };
            }
          },
          _ret;
        for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
          _ret = _loop2();
          if (_ret) return _ret.v;
        }
      } catch (err) {
        _iterator16.e(err);
      } finally {
        _iterator16.f();
      }
      return null;
    },
    cursor: function cursor() {
      if (this.connectingInfo.source || this.hoveredConnector) {
        return "crosshair";
      }
      if (this.hoveredConnection != null) {
        return "pointer";
      }
      return null;
    }
  },
  watch: {
    internalNodes: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.renderNodes();
        this.renderConnections();
      }
    },
    internalConnections: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.renderConnections();
      }
    },
    selectionInfo: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.renderSelection();
      }
    },
    currentNodes: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.$emit("select", this.currentNodes);
        this.renderNodes();
      }
    },
    currentConnections: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.$emit("selectconnection", this.currentConnections);
        this.renderConnections();
      }
    },
    cursorToChartOffset: {
      immediate: true,
      deep: true,
      handler: function handler() {
        if (this.selectionInfo) {
          this.renderSelection();
          return;
        }
        if (this.moveInfo) {
          this.moveAllElements();
        }
      }
    },
    connectingInfo: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.renderConnections();
      }
    },
    nodes: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.init();
      }
    },
    connections: {
      immediate: true,
      deep: true,
      handler: function handler() {
        this.init();
      }
    }
  }
});
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/Flowchart.vue?vue&type=script&lang=js
 /* harmony default export */ var flowchart_Flowchartvue_type_script_lang_js = (Flowchartvue_type_script_lang_js); 
// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/index.css?vue&type=style&index=0&prod&lang=css&external
var flowchartvue_type_style_index_0_prod_lang_css_external = __webpack_require__("ba6f");

// EXTERNAL MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/Flowchart.vue?vue&type=style&index=1&id=c68c1afa&prod&lang=css
var Flowchartvue_type_style_index_1_id_c68c1afa_prod_lang_css = __webpack_require__("b8b0");

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/Flowchart.vue







/* normalize component */

var component = normalizeComponent(
  flowchart_Flowchartvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Flowchart = (component.exports);
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/src/components/flowchart/index.js



/* eslint-disable */
Flowchart.install = function (Vue) {
  Vue.component(Flowchart.name, Flowchart);
};
/* harmony default export */ var flowchart = (Flowchart);
// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (flowchart);



/***/ }),

/***/ "71ee":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("dba3");
var anObject = __webpack_require__("af49");
var $flags = __webpack_require__("0749");
var DESCRIPTORS = __webpack_require__("3b88");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("831d")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("9eef")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "7229":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("e064");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "72c2":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "79d8":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5789")('native-function-to-string', Function.toString);


/***/ }),

/***/ "7bd6":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "7ce9":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("467d");
var isArray = __webpack_require__("9c8a");
var SPECIES = __webpack_require__("911e")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "7d5c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("e300");
var global = __webpack_require__("227b");
var ctx = __webpack_require__("c959");
var classof = __webpack_require__("54b7");
var $export = __webpack_require__("94b9");
var isObject = __webpack_require__("467d");
var aFunction = __webpack_require__("1053");
var anInstance = __webpack_require__("4f71");
var forOf = __webpack_require__("4035");
var speciesConstructor = __webpack_require__("7de2");
var task = __webpack_require__("3ef3").set;
var microtask = __webpack_require__("b008")();
var newPromiseCapabilityModule = __webpack_require__("9403");
var perform = __webpack_require__("72c2");
var userAgent = __webpack_require__("8faa");
var promiseResolve = __webpack_require__("f0f7");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("911e")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("555d")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("3faf")($Promise, PROMISE);
__webpack_require__("2f00")(PROMISE);
Wrapper = __webpack_require__("8e76")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("30df")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "7de2":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("af49");
var aFunction = __webpack_require__("1053");
var SPECIES = __webpack_require__("911e")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "7e1b":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("52e2");
var toLength = __webpack_require__("16fb");
var toAbsoluteIndex = __webpack_require__("ca40");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "831d":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("227b");
var hide = __webpack_require__("15b5");
var has = __webpack_require__("84eb");
var SRC = __webpack_require__("ac3a")('src');
var $toString = __webpack_require__("79d8");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8e76").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "84eb":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "86d5":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("84eb");
var toObject = __webpack_require__("3067");
var IE_PROTO = __webpack_require__("4b89")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "8e76":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "8ecf":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("af49");
var IE8_DOM_DEFINE = __webpack_require__("f84f");
var toPrimitive = __webpack_require__("26d5");
var dP = Object.defineProperty;

exports.f = __webpack_require__("3b88") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8faa":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("227b");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "911e":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5789")('wks');
var uid = __webpack_require__("ac3a");
var Symbol = __webpack_require__("227b").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "93dd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__("94b9");
var context = __webpack_require__("c31c");
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__("ae8a")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "9403":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("1053");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "94b9":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("227b");
var core = __webpack_require__("8e76");
var hide = __webpack_require__("15b5");
var redefine = __webpack_require__("831d");
var ctx = __webpack_require__("c959");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "9c8a":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("e064");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "9d83":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "9eef":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "a342":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("b6b0");
var defined = __webpack_require__("ba8d");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "a649":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next mehtod, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable || iterable === "") {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    throw new TypeError(typeof iterable + " is not iterable");
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "a690":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("9d83");
var ITERATOR = __webpack_require__("911e")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "a709":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("467d");
var anObject = __webpack_require__("af49");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("c959")(Function.call, __webpack_require__("fc78").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "ac3a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "ae8a":
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__("911e")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "af49":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("467d");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "b008":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("227b");
var macrotask = __webpack_require__("3ef3").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("e064")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "b057":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("e300");
var $export = __webpack_require__("94b9");
var redefine = __webpack_require__("831d");
var hide = __webpack_require__("15b5");
var Iterators = __webpack_require__("9d83");
var $iterCreate = __webpack_require__("411b");
var setToStringTag = __webpack_require__("3faf");
var getPrototypeOf = __webpack_require__("86d5");
var ITERATOR = __webpack_require__("911e")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "b5aa":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "b6b0":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "b8b0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Flowchart_vue_vue_type_style_index_1_id_c68c1afa_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3020");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Flowchart_vue_vue_type_style_index_1_id_c68c1afa_prod_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Flowchart_vue_vue_type_style_index_1_id_c68c1afa_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "ba6f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_index_css_vue_type_style_index_0_prod_lang_css_external__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("13ad");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_index_css_vue_type_style_index_0_prod_lang_css_external__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_index_css_vue_type_style_index_0_prod_lang_css_external__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "ba8d":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "bd1f":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("227b").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "be40":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("54b7");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "bf86":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__("8ecf");
var createDesc = __webpack_require__("b5aa");

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ "bfdd":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("af49");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "c031":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("467d");
var document = __webpack_require__("227b").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "c1d9":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("36a6");
var getKeys = __webpack_require__("5583");
var redefine = __webpack_require__("831d");
var global = __webpack_require__("227b");
var hide = __webpack_require__("15b5");
var Iterators = __webpack_require__("9d83");
var wks = __webpack_require__("911e");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "c31c":
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__("ff19");
var defined = __webpack_require__("ba8d");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "c833":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "c959":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("1053");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "ca40":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("b6b0");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "cd61":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesClient; });

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: E:/serge/Documents/NetBeansProjects/flowchart-vue-neti/flowchart-vue-neti/node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "d463":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("7ce9");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "dba3":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("3b88") && /./g.flags != 'g') __webpack_require__("8ecf").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("0749")
});


/***/ }),

/***/ "dbd7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__("3b88");
var getKeys = __webpack_require__("5583");
var gOPS = __webpack_require__("088d");
var pIE = __webpack_require__("7bd6");
var toObject = __webpack_require__("3067");
var IObject = __webpack_require__("7229");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("9eef")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "e064":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "e19a":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "e300":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "e50d":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("8ecf").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("3b88") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "e6fb":
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__("94b9");
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});


/***/ }),

/***/ "e9d4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__("94b9");
var $includes = __webpack_require__("7e1b")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__("1e52")('includes');


/***/ }),

/***/ "ee67":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("a342")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "f034":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("a342")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("b057")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "f0ac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__("227b");
var has = __webpack_require__("84eb");
var DESCRIPTORS = __webpack_require__("3b88");
var $export = __webpack_require__("94b9");
var redefine = __webpack_require__("831d");
var META = __webpack_require__("65d1").KEY;
var $fails = __webpack_require__("9eef");
var shared = __webpack_require__("5789");
var setToStringTag = __webpack_require__("3faf");
var uid = __webpack_require__("ac3a");
var wks = __webpack_require__("911e");
var wksExt = __webpack_require__("1577");
var wksDefine = __webpack_require__("f1bf");
var enumKeys = __webpack_require__("6281");
var isArray = __webpack_require__("9c8a");
var anObject = __webpack_require__("af49");
var isObject = __webpack_require__("467d");
var toObject = __webpack_require__("3067");
var toIObject = __webpack_require__("52e2");
var toPrimitive = __webpack_require__("26d5");
var createDesc = __webpack_require__("b5aa");
var _create = __webpack_require__("46ce");
var gOPNExt = __webpack_require__("3a32");
var $GOPD = __webpack_require__("fc78");
var $GOPS = __webpack_require__("088d");
var $DP = __webpack_require__("8ecf");
var $keys = __webpack_require__("5583");
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__("6485").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__("7bd6").f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__("e300")) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__("15b5")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "f0f7":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("af49");
var isObject = __webpack_require__("467d");
var newPromiseCapability = __webpack_require__("9403");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "f102a":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("f1bf")('asyncIterator');


/***/ }),

/***/ "f1bf":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("227b");
var core = __webpack_require__("8e76");
var LIBRARY = __webpack_require__("e300");
var wksExt = __webpack_require__("1577");
var defineProperty = __webpack_require__("8ecf").f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ "f84f":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("3b88") && !__webpack_require__("9eef")(function () {
  return Object.defineProperty(__webpack_require__("c031")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "fc78":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("7bd6");
var createDesc = __webpack_require__("b5aa");
var toIObject = __webpack_require__("52e2");
var toPrimitive = __webpack_require__("26d5");
var has = __webpack_require__("84eb");
var IE8_DOM_DEFINE = __webpack_require__("f84f");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("3b88") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "fe2e":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("8ecf");
var anObject = __webpack_require__("af49");
var getKeys = __webpack_require__("5583");

module.exports = __webpack_require__("3b88") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "ff19":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("467d");
var cof = __webpack_require__("e064");
var MATCH = __webpack_require__("911e")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ })

/******/ });
//# sourceMappingURL=FlowChart.common.js.map