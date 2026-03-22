/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

export function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

export var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

export function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

export function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

export function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

export function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};

export function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};

export function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
};

export function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

export function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

export function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

export function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

export var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

export function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

export function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

export function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
export function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
export function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

export function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

export function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

export function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

export function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

export function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

export function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

export function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

export function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

export function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

export function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

export function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}

export function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;

}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

export function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    function next() {
        while (env.stack.length) {
            var rec = env.stack.pop();
            try {
                var result = rec.dispose && rec.dispose.call(rec.value);
                if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
            }
            catch (e) {
                fail(e);
            }
        }
        if (env.hasError) throw env.error;
    }
    return next();
}

export default {
    __extends: __extends,
    __assign: __assign,
    __rest: __rest,
    __decorate: __decorate,
    __param: __param,
    __metadata: __metadata,
    __awaiter: __awaiter,
    __generator: __generator,
    __createBinding: __createBinding,
    __exportStar: __exportStar,
    __values: __values,
    __read: __read,
    __spread: __spread,
    __spreadArrays: __spreadArrays,
    __spreadArray: __spreadArray,
    __await: __await,
    __asyncGenerator: __asyncGenerator,
    __asyncDelegator: __asyncDelegator,
    __asyncValues: __asyncValues,
    __makeTemplateObject: __makeTemplateObject,
    __importStar: __importStar,
    __importDefault: __importDefault,
    __classPrivateFieldGet: __classPrivateFieldGet,
    __classPrivateFieldSet: __classPrivateFieldSet,
    __classPrivateFieldIn: __classPrivateFieldIn,
    __addDisposableResource: __addDisposableResource,
    __disposeResources: __disposeResources,
};

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/vs/base/common/arraysFind.ts
function findLastIdxMonotonous(array, predicate, startIdx = 0, endIdxEx = array.length) {
  let i = startIdx;
  let j = endIdxEx;
  while (i < j) {
    const k = Math.floor((i + j) / 2);
    if (predicate(array[k])) {
      i = k + 1;
    } else {
      j = k;
    }
  }
  return i - 1;
}
var MonotonousArray = class _MonotonousArray {
  constructor(_array) {
    this._array = _array;
    this._findLastMonotonousLastIdx = 0;
  }
  static {
    this.assertInvariants = false;
  }
  /**
   * The predicate must be monotonous, i.e. `arr.map(predicate)` must be like `[true, ..., true, false, ..., false]`!
   * For subsequent calls, current predicate must be weaker than (or equal to) the previous predicate, i.e. more entries must be `true`.
   */
  findLastMonotonous(predicate) {
    if (_MonotonousArray.assertInvariants) {
      if (this._prevFindLastPredicate) {
        for (const item of this._array) {
          if (this._prevFindLastPredicate(item) && !predicate(item)) {
            throw new Error("MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.");
          }
        }
      }
      this._prevFindLastPredicate = predicate;
    }
    const idx = findLastIdxMonotonous(this._array, predicate, this._findLastMonotonousLastIdx);
    this._findLastMonotonousLastIdx = idx + 1;
    return idx === -1 ? void 0 : this._array[idx];
  }
};

// src/vs/base/common/errors.ts
var ErrorHandler = class {
  constructor() {
    this.listeners = [];
    this.unexpectedErrorHandler = function(e) {
      setTimeout(() => {
        if (e.stack) {
          if (ErrorNoTelemetry.isErrorNoTelemetry(e)) {
            throw new ErrorNoTelemetry(e.message + "\n\n" + e.stack);
          }
          throw new Error(e.message + "\n\n" + e.stack);
        }
        throw e;
      }, 0);
    };
  }
  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      this._removeListener(listener);
    };
  }
  emit(e) {
    this.listeners.forEach((listener) => {
      listener(e);
    });
  }
  _removeListener(listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }
  setUnexpectedErrorHandler(newUnexpectedErrorHandler) {
    this.unexpectedErrorHandler = newUnexpectedErrorHandler;
  }
  getUnexpectedErrorHandler() {
    return this.unexpectedErrorHandler;
  }
  onUnexpectedError(e) {
    this.unexpectedErrorHandler(e);
    this.emit(e);
  }
  // For external errors, we don't want the listeners to be called
  onUnexpectedExternalError(e) {
    this.unexpectedErrorHandler(e);
  }
};
var errorHandler = new ErrorHandler();
function onBugIndicatingError(e) {
  errorHandler.onUnexpectedError(e);
  return void 0;
}
function onUnexpectedError(e) {
  if (!isCancellationError(e)) {
    errorHandler.onUnexpectedError(e);
  }
  return void 0;
}
var canceledName = "Canceled";
function isCancellationError(error) {
  if (error instanceof CancellationError) {
    return true;
  }
  return error instanceof Error && error.name === canceledName && error.message === canceledName;
}
var CancellationError = class extends Error {
  constructor() {
    super(canceledName);
    this.name = this.message;
  }
};
var PendingMigrationError = class _PendingMigrationError extends Error {
  static {
    this._name = "PendingMigrationError";
  }
  static is(error) {
    return error instanceof _PendingMigrationError || error instanceof Error && error.name === _PendingMigrationError._name;
  }
  constructor(message) {
    super(message);
    this.name = _PendingMigrationError._name;
  }
};
function illegalState(name) {
  if (name) {
    return new Error(`Illegal state: ${name}`);
  } else {
    return new Error("Illegal state");
  }
}
var ErrorNoTelemetry = class _ErrorNoTelemetry extends Error {
  constructor(msg) {
    super(msg);
    this.name = "CodeExpectedError";
  }
  static fromError(err) {
    if (err instanceof _ErrorNoTelemetry) {
      return err;
    }
    const result = new _ErrorNoTelemetry();
    result.message = err.message;
    result.stack = err.stack;
    return result;
  }
  static isErrorNoTelemetry(err) {
    return err.name === "CodeExpectedError";
  }
};
var BugIndicatingError = class _BugIndicatingError extends Error {
  constructor(message) {
    super(message || "An unexpected bug occurred.");
    Object.setPrototypeOf(this, _BugIndicatingError.prototype);
  }
};

// src/vs/base/common/arrays.ts
function equals(one, other, itemEquals = (a, b) => a === b) {
  if (one === other) {
    return true;
  }
  if (!one || !other) {
    return false;
  }
  if (one.length !== other.length) {
    return false;
  }
  for (let i = 0, len = one.length; i < len; i++) {
    if (!itemEquals(one[i], other[i])) {
      return false;
    }
  }
  return true;
}
function coalesce(array) {
  return array.filter((e) => !!e);
}
function shuffle(array, _seed) {
  let rand;
  if (typeof _seed === "number") {
    let seed = _seed;
    rand = () => {
      const x = Math.sin(seed++) * 179426549;
      return x - Math.floor(x);
    };
  } else {
    rand = Math.random;
  }
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
var CompareResult;
((CompareResult2) => {
  function isLessThan(result) {
    return result < 0;
  }
  CompareResult2.isLessThan = isLessThan;
  function isLessThanOrEqual(result) {
    return result <= 0;
  }
  CompareResult2.isLessThanOrEqual = isLessThanOrEqual;
  function isGreaterThan(result) {
    return result > 0;
  }
  CompareResult2.isGreaterThan = isGreaterThan;
  function isNeitherLessOrGreaterThan(result) {
    return result === 0;
  }
  CompareResult2.isNeitherLessOrGreaterThan = isNeitherLessOrGreaterThan;
  CompareResult2.greaterThan = 1;
  CompareResult2.lessThan = -1;
  CompareResult2.neitherLessOrGreaterThan = 0;
})(CompareResult || (CompareResult = {}));
function compareBy(selector, comparator) {
  return (a, b) => comparator(selector(a), selector(b));
}
var numberComparator = (a, b) => a - b;
var CallbackIterable = class _CallbackIterable {
  constructor(iterate) {
    this.iterate = iterate;
  }
  static {
    this.empty = new _CallbackIterable((_callback) => {
    });
  }
  forEach(handler) {
    this.iterate((item) => {
      handler(item);
      return true;
    });
  }
  toArray() {
    const result = [];
    this.iterate((item) => {
      result.push(item);
      return true;
    });
    return result;
  }
  filter(predicate) {
    return new _CallbackIterable((cb) => this.iterate((item) => predicate(item) ? cb(item) : true));
  }
  map(mapFn) {
    return new _CallbackIterable((cb) => this.iterate((item) => cb(mapFn(item))));
  }
  some(predicate) {
    let result = false;
    this.iterate((item) => {
      result = predicate(item);
      return !result;
    });
    return result;
  }
  findFirst(predicate) {
    let result;
    this.iterate((item) => {
      if (predicate(item)) {
        result = item;
        return false;
      }
      return true;
    });
    return result;
  }
  findLast(predicate) {
    let result;
    this.iterate((item) => {
      if (predicate(item)) {
        result = item;
      }
      return true;
    });
    return result;
  }
  findLastMaxBy(comparator) {
    let result;
    let first = true;
    this.iterate((item) => {
      if (first || CompareResult.isGreaterThan(comparator(item, result))) {
        first = false;
        result = item;
      }
      return true;
    });
    return result;
  }
};

// src/vs/base/common/collections.ts
function groupBy(data, groupFn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const element of data) {
    const key = groupFn(element);
    let target = result[key];
    if (!target) {
      target = result[key] = [];
    }
    target.push(element);
  }
  return result;
}
var _a, _b;
var SetWithKey = class {
  constructor(values, toKey) {
    this.toKey = toKey;
    this._map = /* @__PURE__ */ new Map();
    this[_a] = "SetWithKey";
    for (const value of values) {
      this.add(value);
    }
  }
  get size() {
    return this._map.size;
  }
  add(value) {
    const key = this.toKey(value);
    this._map.set(key, value);
    return this;
  }
  delete(value) {
    return this._map.delete(this.toKey(value));
  }
  has(value) {
    return this._map.has(this.toKey(value));
  }
  *entries() {
    for (const entry of this._map.values()) {
      yield [entry, entry];
    }
  }
  keys() {
    return this.values();
  }
  *values() {
    for (const entry of this._map.values()) {
      yield entry;
    }
  }
  clear() {
    this._map.clear();
  }
  forEach(callbackfn, thisArg) {
    this._map.forEach((entry) => callbackfn.call(thisArg, entry, entry, this));
  }
  [(_b = Symbol.iterator, _a = Symbol.toStringTag, _b)]() {
    return this.values();
  }
};

// src/vs/base/common/functional.ts
function createSingleCallFunction(fn, fnDidRunCallback) {
  const _this = this;
  let didCall = false;
  let result;
  return function() {
    if (didCall) {
      return result;
    }
    didCall = true;
    if (fnDidRunCallback) {
      try {
        result = fn.apply(_this, arguments);
      } finally {
        fnDidRunCallback();
      }
    } else {
      result = fn.apply(_this, arguments);
    }
    return result;
  };
}

// src/vs/base/common/map.ts
var ResourceMapEntry = class {
  constructor(uri, value) {
    this.uri = uri;
    this.value = value;
  }
};
function isEntries(arg) {
  return Array.isArray(arg);
}
var _a2;
var ResourceMap = class _ResourceMap {
  constructor(arg, toKey) {
    this[_a2] = "ResourceMap";
    if (arg instanceof _ResourceMap) {
      this.map = new Map(arg.map);
      this.toKey = toKey ?? _ResourceMap.defaultToKey;
    } else if (isEntries(arg)) {
      this.map = /* @__PURE__ */ new Map();
      this.toKey = toKey ?? _ResourceMap.defaultToKey;
      for (const [resource, value] of arg) {
        this.set(resource, value);
      }
    } else {
      this.map = /* @__PURE__ */ new Map();
      this.toKey = arg ?? _ResourceMap.defaultToKey;
    }
  }
  static {
    this.defaultToKey = (resource) => resource.toString();
  }
  set(resource, value) {
    this.map.set(this.toKey(resource), new ResourceMapEntry(resource, value));
    return this;
  }
  get(resource) {
    return this.map.get(this.toKey(resource))?.value;
  }
  has(resource) {
    return this.map.has(this.toKey(resource));
  }
  get size() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  delete(resource) {
    return this.map.delete(this.toKey(resource));
  }
  forEach(clb, thisArg) {
    if (typeof thisArg !== "undefined") {
      clb = clb.bind(thisArg);
    }
    for (const [_, entry] of this.map) {
      clb(entry.value, entry.uri, this);
    }
  }
  *values() {
    for (const entry of this.map.values()) {
      yield entry.value;
    }
  }
  *keys() {
    for (const entry of this.map.values()) {
      yield entry.uri;
    }
  }
  *entries() {
    for (const entry of this.map.values()) {
      yield [entry.uri, entry.value];
    }
  }
  *[(_a2 = Symbol.toStringTag, Symbol.iterator)]() {
    for (const [, entry] of this.map) {
      yield [entry.uri, entry.value];
    }
  }
};
var _a3;
var ResourceSet = class {
  constructor(entriesOrKey, toKey) {
    this[_a3] = "ResourceSet";
    if (!entriesOrKey || typeof entriesOrKey === "function") {
      this._map = new ResourceMap(entriesOrKey);
    } else {
      this._map = new ResourceMap(toKey);
      entriesOrKey.forEach(this.add, this);
    }
  }
  get size() {
    return this._map.size;
  }
  add(value) {
    this._map.set(value, value);
    return this;
  }
  clear() {
    this._map.clear();
  }
  delete(value) {
    return this._map.delete(value);
  }
  forEach(callbackfn, thisArg) {
    this._map.forEach((_value, key) => callbackfn.call(thisArg, key, key, this));
  }
  has(value) {
    return this._map.has(value);
  }
  entries() {
    return this._map.entries();
  }
  keys() {
    return this._map.keys();
  }
  values() {
    return this._map.keys();
  }
  [(_a3 = Symbol.toStringTag, Symbol.iterator)]() {
    return this.keys();
  }
};
var _a4;
var LinkedMap = class {
  constructor() {
    this[_a4] = "LinkedMap";
    this._map = /* @__PURE__ */ new Map();
    this._head = void 0;
    this._tail = void 0;
    this._size = 0;
    this._state = 0;
  }
  clear() {
    this._map.clear();
    this._head = void 0;
    this._tail = void 0;
    this._size = 0;
    this._state++;
  }
  isEmpty() {
    return !this._head && !this._tail;
  }
  get size() {
    return this._size;
  }
  get first() {
    return this._head?.value;
  }
  get last() {
    return this._tail?.value;
  }
  has(key) {
    return this._map.has(key);
  }
  get(key, touch = 0 /* None */) {
    const item = this._map.get(key);
    if (!item) {
      return void 0;
    }
    if (touch !== 0 /* None */) {
      this.touch(item, touch);
    }
    return item.value;
  }
  set(key, value, touch = 0 /* None */) {
    let item = this._map.get(key);
    if (item) {
      item.value = value;
      if (touch !== 0 /* None */) {
        this.touch(item, touch);
      }
    } else {
      item = { key, value, next: void 0, previous: void 0 };
      switch (touch) {
        case 0 /* None */:
          this.addItemLast(item);
          break;
        case 1 /* AsOld */:
          this.addItemFirst(item);
          break;
        case 2 /* AsNew */:
          this.addItemLast(item);
          break;
        default:
          this.addItemLast(item);
          break;
      }
      this._map.set(key, item);
      this._size++;
    }
    return this;
  }
  delete(key) {
    return !!this.remove(key);
  }
  remove(key) {
    const item = this._map.get(key);
    if (!item) {
      return void 0;
    }
    this._map.delete(key);
    this.removeItem(item);
    this._size--;
    return item.value;
  }
  shift() {
    if (!this._head && !this._tail) {
      return void 0;
    }
    if (!this._head || !this._tail) {
      throw new Error("Invalid list");
    }
    const item = this._head;
    this._map.delete(item.key);
    this.removeItem(item);
    this._size--;
    return item.value;
  }
  forEach(callbackfn, thisArg) {
    const state = this._state;
    let current = this._head;
    while (current) {
      if (thisArg) {
        callbackfn.bind(thisArg)(current.value, current.key, this);
      } else {
        callbackfn(current.value, current.key, this);
      }
      if (this._state !== state) {
        throw new Error(`LinkedMap got modified during iteration.`);
      }
      current = current.next;
    }
  }
  keys() {
    const map = this;
    const state = this._state;
    let current = this._head;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next() {
        if (map._state !== state) {
          throw new Error(`LinkedMap got modified during iteration.`);
        }
        if (current) {
          const result = { value: current.key, done: false };
          current = current.next;
          return result;
        } else {
          return { value: void 0, done: true };
        }
      }
    };
    return iterator;
  }
  values() {
    const map = this;
    const state = this._state;
    let current = this._head;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next() {
        if (map._state !== state) {
          throw new Error(`LinkedMap got modified during iteration.`);
        }
        if (current) {
          const result = { value: current.value, done: false };
          current = current.next;
          return result;
        } else {
          return { value: void 0, done: true };
        }
      }
    };
    return iterator;
  }
  entries() {
    const map = this;
    const state = this._state;
    let current = this._head;
    const iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next() {
        if (map._state !== state) {
          throw new Error(`LinkedMap got modified during iteration.`);
        }
        if (current) {
          const result = { value: [current.key, current.value], done: false };
          current = current.next;
          return result;
        } else {
          return { value: void 0, done: true };
        }
      }
    };
    return iterator;
  }
  [(_a4 = Symbol.toStringTag, Symbol.iterator)]() {
    return this.entries();
  }
  trimOld(newSize) {
    if (newSize >= this.size) {
      return;
    }
    if (newSize === 0) {
      this.clear();
      return;
    }
    let current = this._head;
    let currentSize = this.size;
    while (current && currentSize > newSize) {
      this._map.delete(current.key);
      current = current.next;
      currentSize--;
    }
    this._head = current;
    this._size = currentSize;
    if (current) {
      current.previous = void 0;
    }
    this._state++;
  }
  trimNew(newSize) {
    if (newSize >= this.size) {
      return;
    }
    if (newSize === 0) {
      this.clear();
      return;
    }
    let current = this._tail;
    let currentSize = this.size;
    while (current && currentSize > newSize) {
      this._map.delete(current.key);
      current = current.previous;
      currentSize--;
    }
    this._tail = current;
    this._size = currentSize;
    if (current) {
      current.next = void 0;
    }
    this._state++;
  }
  addItemFirst(item) {
    if (!this._head && !this._tail) {
      this._tail = item;
    } else if (!this._head) {
      throw new Error("Invalid list");
    } else {
      item.next = this._head;
      this._head.previous = item;
    }
    this._head = item;
    this._state++;
  }
  addItemLast(item) {
    if (!this._head && !this._tail) {
      this._head = item;
    } else if (!this._tail) {
      throw new Error("Invalid list");
    } else {
      item.previous = this._tail;
      this._tail.next = item;
    }
    this._tail = item;
    this._state++;
  }
  removeItem(item) {
    if (item === this._head && item === this._tail) {
      this._head = void 0;
      this._tail = void 0;
    } else if (item === this._head) {
      if (!item.next) {
        throw new Error("Invalid list");
      }
      item.next.previous = void 0;
      this._head = item.next;
    } else if (item === this._tail) {
      if (!item.previous) {
        throw new Error("Invalid list");
      }
      item.previous.next = void 0;
      this._tail = item.previous;
    } else {
      const next = item.next;
      const previous = item.previous;
      if (!next || !previous) {
        throw new Error("Invalid list");
      }
      next.previous = previous;
      previous.next = next;
    }
    item.next = void 0;
    item.previous = void 0;
    this._state++;
  }
  touch(item, touch) {
    if (!this._head || !this._tail) {
      throw new Error("Invalid list");
    }
    if (touch !== 1 /* AsOld */ && touch !== 2 /* AsNew */) {
      return;
    }
    if (touch === 1 /* AsOld */) {
      if (item === this._head) {
        return;
      }
      const next = item.next;
      const previous = item.previous;
      if (item === this._tail) {
        previous.next = void 0;
        this._tail = previous;
      } else {
        next.previous = previous;
        previous.next = next;
      }
      item.previous = void 0;
      item.next = this._head;
      this._head.previous = item;
      this._head = item;
      this._state++;
    } else if (touch === 2 /* AsNew */) {
      if (item === this._tail) {
        return;
      }
      const next = item.next;
      const previous = item.previous;
      if (item === this._head) {
        next.previous = void 0;
        this._head = next;
      } else {
        next.previous = previous;
        previous.next = next;
      }
      item.next = void 0;
      item.previous = this._tail;
      this._tail.next = item;
      this._tail = item;
      this._state++;
    }
  }
  toJSON() {
    const data = [];
    this.forEach((value, key) => {
      data.push([key, value]);
    });
    return data;
  }
  fromJSON(data) {
    this.clear();
    for (const [key, value] of data) {
      this.set(key, value);
    }
  }
};
var Cache = class extends LinkedMap {
  constructor(limit, ratio = 1) {
    super();
    this._limit = limit;
    this._ratio = Math.min(Math.max(0, ratio), 1);
  }
  get limit() {
    return this._limit;
  }
  set limit(limit) {
    this._limit = limit;
    this.checkTrim();
  }
  get ratio() {
    return this._ratio;
  }
  set ratio(ratio) {
    this._ratio = Math.min(Math.max(0, ratio), 1);
    this.checkTrim();
  }
  get(key, touch = 2 /* AsNew */) {
    return super.get(key, touch);
  }
  peek(key) {
    return super.get(key, 0 /* None */);
  }
  set(key, value) {
    super.set(key, value, 2 /* AsNew */);
    return this;
  }
  checkTrim() {
    if (this.size > this._limit) {
      this.trim(Math.round(this._limit * this._ratio));
    }
  }
};
var LRUCache = class extends Cache {
  constructor(limit, ratio = 1) {
    super(limit, ratio);
  }
  trim(newSize) {
    this.trimOld(newSize);
  }
  set(key, value) {
    super.set(key, value);
    this.checkTrim();
    return this;
  }
};
var SetMap = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  add(key, value) {
    let values = this.map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      this.map.set(key, values);
    }
    values.add(value);
  }
  delete(key, value) {
    const values = this.map.get(key);
    if (!values) {
      return;
    }
    values.delete(value);
    if (values.size === 0) {
      this.map.delete(key);
    }
  }
  forEach(key, fn) {
    const values = this.map.get(key);
    if (!values) {
      return;
    }
    values.forEach(fn);
  }
  get(key) {
    const values = this.map.get(key);
    if (!values) {
      return /* @__PURE__ */ new Set();
    }
    return values;
  }
};

// src/vs/base/common/assert.ts
function assert(condition, messageOrError = "unexpected state") {
  if (!condition) {
    const errorToThrow = typeof messageOrError === "string" ? new BugIndicatingError(`Assertion Failed: ${messageOrError}`) : messageOrError;
    throw errorToThrow;
  }
}
function assertFn(condition) {
  if (!condition()) {
    debugger;
    condition();
    onUnexpectedError(new BugIndicatingError("Assertion Failed"));
  }
}

// src/vs/base/common/types.ts
function isString(str) {
  return typeof str === "string";
}
function isNumber(obj) {
  return typeof obj === "number" && !isNaN(obj);
}
function isIterable(obj) {
  return !!obj && typeof obj[Symbol.iterator] === "function";
}
function isUndefined(obj) {
  return typeof obj === "undefined";
}
function isDefined(arg) {
  return !isUndefinedOrNull(arg);
}
function isUndefinedOrNull(obj) {
  return isUndefined(obj) || obj === null;
}
function assertType(condition, type) {
  if (!condition) {
    throw new Error(type ? `Unexpected type, expected '${type}'` : "Unexpected type");
  }
}
function isFunction(obj) {
  return typeof obj === "function";
}

// src/vs/base/common/iterator.ts
var Iterable;
((Iterable2) => {
  function is(thing) {
    return !!thing && typeof thing === "object" && typeof thing[Symbol.iterator] === "function";
  }
  Iterable2.is = is;
  const _empty2 = Object.freeze([]);
  function empty() {
    return _empty2;
  }
  Iterable2.empty = empty;
  function* single(element) {
    yield element;
  }
  Iterable2.single = single;
  function wrap(iterableOrElement) {
    if (is(iterableOrElement)) {
      return iterableOrElement;
    } else {
      return single(iterableOrElement);
    }
  }
  Iterable2.wrap = wrap;
  function from(iterable) {
    return iterable ?? _empty2;
  }
  Iterable2.from = from;
  function* reverse(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      yield array[i];
    }
  }
  Iterable2.reverse = reverse;
  function isEmpty(iterable) {
    return !iterable || iterable[Symbol.iterator]().next().done === true;
  }
  Iterable2.isEmpty = isEmpty;
  function first(iterable) {
    return iterable[Symbol.iterator]().next().value;
  }
  Iterable2.first = first;
  function some(iterable, predicate) {
    let i = 0;
    for (const element of iterable) {
      if (predicate(element, i++)) {
        return true;
      }
    }
    return false;
  }
  Iterable2.some = some;
  function every(iterable, predicate) {
    let i = 0;
    for (const element of iterable) {
      if (!predicate(element, i++)) {
        return false;
      }
    }
    return true;
  }
  Iterable2.every = every;
  function find(iterable, predicate) {
    for (const element of iterable) {
      if (predicate(element)) {
        return element;
      }
    }
    return void 0;
  }
  Iterable2.find = find;
  function* filter(iterable, predicate) {
    for (const element of iterable) {
      if (predicate(element)) {
        yield element;
      }
    }
  }
  Iterable2.filter = filter;
  function* map(iterable, fn) {
    let index = 0;
    for (const element of iterable) {
      yield fn(element, index++);
    }
  }
  Iterable2.map = map;
  function* flatMap(iterable, fn) {
    let index = 0;
    for (const element of iterable) {
      yield* fn(element, index++);
    }
  }
  Iterable2.flatMap = flatMap;
  function* concat(...iterables) {
    for (const item of iterables) {
      if (isIterable(item)) {
        yield* item;
      } else {
        yield item;
      }
    }
  }
  Iterable2.concat = concat;
  function reduce(iterable, reducer, initialValue) {
    let value = initialValue;
    for (const element of iterable) {
      value = reducer(value, element);
    }
    return value;
  }
  Iterable2.reduce = reduce;
  function length(iterable) {
    let count = 0;
    for (const _ of iterable) {
      count++;
    }
    return count;
  }
  Iterable2.length = length;
  function* slice(arr, from2, to = arr.length) {
    if (from2 < -arr.length) {
      from2 = 0;
    }
    if (from2 < 0) {
      from2 += arr.length;
    }
    if (to < 0) {
      to += arr.length;
    } else if (to > arr.length) {
      to = arr.length;
    }
    for (; from2 < to; from2++) {
      yield arr[from2];
    }
  }
  Iterable2.slice = slice;
  function consume(iterable, atMost = Number.POSITIVE_INFINITY) {
    const consumed = [];
    if (atMost === 0) {
      return [consumed, iterable];
    }
    const iterator = iterable[Symbol.iterator]();
    for (let i = 0; i < atMost; i++) {
      const next = iterator.next();
      if (next.done) {
        return [consumed, Iterable2.empty()];
      }
      consumed.push(next.value);
    }
    return [consumed, { [Symbol.iterator]() {
      return iterator;
    } }];
  }
  Iterable2.consume = consume;
  async function asyncToArray(iterable) {
    const result = [];
    for await (const item of iterable) {
      result.push(item);
    }
    return result;
  }
  Iterable2.asyncToArray = asyncToArray;
  async function asyncToArrayFlat(iterable) {
    let result = [];
    for await (const item of iterable) {
      result = result.concat(item);
    }
    return result;
  }
  Iterable2.asyncToArrayFlat = asyncToArrayFlat;
})(Iterable || (Iterable = {}));

// src/vs/base/common/lifecycle.ts
var TRACK_DISPOSABLES = false;
var disposableTracker = null;
var DisposableTracker = class _DisposableTracker {
  constructor() {
    this.livingDisposables = /* @__PURE__ */ new Map();
  }
  static {
    this.idx = 0;
  }
  getDisposableData(d) {
    let val = this.livingDisposables.get(d);
    if (!val) {
      val = { parent: null, source: null, isSingleton: false, value: d, idx: _DisposableTracker.idx++ };
      this.livingDisposables.set(d, val);
    }
    return val;
  }
  trackDisposable(d) {
    const data = this.getDisposableData(d);
    if (!data.source) {
      data.source = new Error().stack;
    }
  }
  setParent(child, parent) {
    const data = this.getDisposableData(child);
    data.parent = parent;
  }
  markAsDisposed(x) {
    this.livingDisposables.delete(x);
  }
  markAsSingleton(disposable) {
    this.getDisposableData(disposable).isSingleton = true;
  }
  getRootParent(data, cache) {
    const cacheValue = cache.get(data);
    if (cacheValue) {
      return cacheValue;
    }
    const result = data.parent ? this.getRootParent(this.getDisposableData(data.parent), cache) : data;
    cache.set(data, result);
    return result;
  }
  getTrackedDisposables() {
    const rootParentCache = /* @__PURE__ */ new Map();
    const leaking = [...this.livingDisposables.entries()].filter(([, v]) => v.source !== null && !this.getRootParent(v, rootParentCache).isSingleton).flatMap(([k]) => k);
    return leaking;
  }
  computeLeakingDisposables(maxReported = 10, preComputedLeaks) {
    let uncoveredLeakingObjs;
    if (preComputedLeaks) {
      uncoveredLeakingObjs = preComputedLeaks;
    } else {
      const rootParentCache = /* @__PURE__ */ new Map();
      const leakingObjects = [...this.livingDisposables.values()].filter((info) => info.source !== null && !this.getRootParent(info, rootParentCache).isSingleton);
      if (leakingObjects.length === 0) {
        return;
      }
      const leakingObjsSet = new Set(leakingObjects.map((o) => o.value));
      uncoveredLeakingObjs = leakingObjects.filter((l) => {
        return !(l.parent && leakingObjsSet.has(l.parent));
      });
      if (uncoveredLeakingObjs.length === 0) {
        throw new Error("There are cyclic diposable chains!");
      }
    }
    if (!uncoveredLeakingObjs) {
      return void 0;
    }
    function getStackTracePath(leaking) {
      function removePrefix(array, linesToRemove) {
        while (array.length > 0 && linesToRemove.some((regexp) => typeof regexp === "string" ? regexp === array[0] : array[0].match(regexp))) {
          array.shift();
        }
      }
      const lines = leaking.source.split("\n").map((p) => p.trim().replace("at ", "")).filter((l) => l !== "");
      removePrefix(lines, ["Error", /^trackDisposable \(.*\)$/, /^DisposableTracker.trackDisposable \(.*\)$/]);
      return lines.reverse();
    }
    const stackTraceStarts = new SetMap();
    for (const leaking of uncoveredLeakingObjs) {
      const stackTracePath = getStackTracePath(leaking);
      for (let i2 = 0; i2 <= stackTracePath.length; i2++) {
        stackTraceStarts.add(stackTracePath.slice(0, i2).join("\n"), leaking);
      }
    }
    uncoveredLeakingObjs.sort(compareBy((l) => l.idx, numberComparator));
    let message = "";
    let i = 0;
    for (const leaking of uncoveredLeakingObjs.slice(0, maxReported)) {
      i++;
      const stackTracePath = getStackTracePath(leaking);
      const stackTraceFormattedLines = [];
      for (let i2 = 0; i2 < stackTracePath.length; i2++) {
        let line = stackTracePath[i2];
        const starts = stackTraceStarts.get(stackTracePath.slice(0, i2 + 1).join("\n"));
        line = `(shared with ${starts.size}/${uncoveredLeakingObjs.length} leaks) at ${line}`;
        const prevStarts = stackTraceStarts.get(stackTracePath.slice(0, i2).join("\n"));
        const continuations = groupBy([...prevStarts].map((d) => getStackTracePath(d)[i2]), (v) => v);
        delete continuations[stackTracePath[i2]];
        for (const [cont, set] of Object.entries(continuations)) {
          if (set) {
            stackTraceFormattedLines.unshift(`    - stacktraces of ${set.length} other leaks continue with ${cont}`);
          }
        }
        stackTraceFormattedLines.unshift(line);
      }
      message += `


==================== Leaking disposable ${i}/${uncoveredLeakingObjs.length}: ${leaking.value.constructor.name} ====================
${stackTraceFormattedLines.join("\n")}
============================================================

`;
    }
    if (uncoveredLeakingObjs.length > maxReported) {
      message += `


... and ${uncoveredLeakingObjs.length - maxReported} more leaking disposables

`;
    }
    return { leaks: uncoveredLeakingObjs, details: message };
  }
};
function setDisposableTracker(tracker) {
  disposableTracker = tracker;
}
if (TRACK_DISPOSABLES) {
  const __is_disposable_tracked__ = "__is_disposable_tracked__";
  setDisposableTracker(new class {
    trackDisposable(x) {
      const stack = new Error("Potentially leaked disposable").stack;
      setTimeout(() => {
        if (!x[__is_disposable_tracked__]) {
          console.log(stack);
        }
      }, 3e3);
    }
    setParent(child, parent) {
      if (child && child !== Disposable.None) {
        try {
          child[__is_disposable_tracked__] = true;
        } catch {
        }
      }
    }
    markAsDisposed(disposable) {
      if (disposable && disposable !== Disposable.None) {
        try {
          disposable[__is_disposable_tracked__] = true;
        } catch {
        }
      }
    }
    markAsSingleton(disposable) {
    }
  }());
}
function trackDisposable(x) {
  disposableTracker?.trackDisposable(x);
  return x;
}
function markAsDisposed(disposable) {
  disposableTracker?.markAsDisposed(disposable);
}
function setParentOfDisposable(child, parent) {
  disposableTracker?.setParent(child, parent);
}
function setParentOfDisposables(children, parent) {
  if (!disposableTracker) {
    return;
  }
  for (const child of children) {
    disposableTracker.setParent(child, parent);
  }
}
function isDisposable(thing) {
  return typeof thing === "object" && thing !== null && typeof thing.dispose === "function" && thing.dispose.length === 0;
}
function dispose(arg) {
  if (Iterable.is(arg)) {
    const errors = [];
    for (const d of arg) {
      if (d) {
        try {
          d.dispose();
        } catch (e) {
          errors.push(e);
        }
      }
    }
    if (errors.length === 1) {
      throw errors[0];
    } else if (errors.length > 1) {
      throw new AggregateError(errors, "Encountered errors while disposing of store");
    }
    return Array.isArray(arg) ? [] : arg;
  } else if (arg) {
    arg.dispose();
    return arg;
  }
}
function combinedDisposable(...disposables) {
  const parent = toDisposable(() => dispose(disposables));
  setParentOfDisposables(disposables, parent);
  return parent;
}
var FunctionDisposable = class {
  constructor(fn) {
    this._isDisposed = false;
    this._fn = fn;
    trackDisposable(this);
  }
  dispose() {
    if (this._isDisposed) {
      return;
    }
    if (!this._fn) {
      throw new Error(`Unbound disposable context: Need to use an arrow function to preserve the value of this`);
    }
    this._isDisposed = true;
    markAsDisposed(this);
    this._fn();
  }
};
function toDisposable(fn) {
  return new FunctionDisposable(fn);
}
var DisposableStore = class _DisposableStore {
  constructor() {
    this._toDispose = /* @__PURE__ */ new Set();
    this._isDisposed = false;
    trackDisposable(this);
  }
  static {
    this.DISABLE_DISPOSED_WARNING = false;
  }
  /**
   * Dispose of all registered disposables and mark this object as disposed.
   *
   * Any future disposables added to this object will be disposed of on `add`.
   */
  dispose() {
    if (this._isDisposed) {
      return;
    }
    markAsDisposed(this);
    this._isDisposed = true;
    this.clear();
  }
  /**
   * @return `true` if this object has been disposed of.
   */
  get isDisposed() {
    return this._isDisposed;
  }
  /**
   * Dispose of all registered disposables but do not mark this object as disposed.
   */
  clear() {
    if (this._toDispose.size === 0) {
      return;
    }
    try {
      dispose(this._toDispose);
    } finally {
      this._toDispose.clear();
    }
  }
  /**
   * Add a new {@link IDisposable disposable} to the collection.
   */
  add(o) {
    if (!o || o === Disposable.None) {
      return o;
    }
    if (o === this) {
      throw new Error("Cannot register a disposable on itself!");
    }
    setParentOfDisposable(o, this);
    if (this._isDisposed) {
      if (!_DisposableStore.DISABLE_DISPOSED_WARNING) {
        console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack);
      }
    } else {
      this._toDispose.add(o);
    }
    return o;
  }
  /**
   * Deletes a disposable from store and disposes of it. This will not throw or warn and proceed to dispose the
   * disposable even when the disposable is not part in the store.
   */
  delete(o) {
    if (!o) {
      return;
    }
    if (o === this) {
      throw new Error("Cannot dispose a disposable on itself!");
    }
    this._toDispose.delete(o);
    o.dispose();
  }
  /**
   * Deletes the value from the store, but does not dispose it.
   */
  deleteAndLeak(o) {
    if (!o) {
      return;
    }
    if (this._toDispose.delete(o)) {
      setParentOfDisposable(o, null);
    }
  }
  assertNotDisposed() {
    if (this._isDisposed) {
      onUnexpectedError(new BugIndicatingError("Object disposed"));
    }
  }
};
var Disposable = class {
  constructor() {
    this._store = new DisposableStore();
    trackDisposable(this);
    setParentOfDisposable(this._store, this);
  }
  static {
    /**
     * A disposable that does nothing when it is disposed of.
     *
     * TODO: This should not be a static property.
     */
    this.None = Object.freeze({ dispose() {
    } });
  }
  dispose() {
    markAsDisposed(this);
    this._store.dispose();
  }
  /**
   * Adds `o` to the collection of disposables managed by this object.
   */
  _register(o) {
    if (o === this) {
      throw new Error("Cannot register a disposable on itself!");
    }
    return this._store.add(o);
  }
};
var DisposableMap = class {
  constructor(store = /* @__PURE__ */ new Map()) {
    this._isDisposed = false;
    this._store = store;
    trackDisposable(this);
  }
  /**
   * Disposes of all stored values and mark this object as disposed.
   *
   * Trying to use this object after it has been disposed of is an error.
   */
  dispose() {
    markAsDisposed(this);
    this._isDisposed = true;
    this.clearAndDisposeAll();
  }
  /**
   * Disposes of all stored values and clear the map, but DO NOT mark this object as disposed.
   */
  clearAndDisposeAll() {
    if (!this._store.size) {
      return;
    }
    try {
      dispose(this._store.values());
    } finally {
      this._store.clear();
    }
  }
  has(key) {
    return this._store.has(key);
  }
  get size() {
    return this._store.size;
  }
  get(key) {
    return this._store.get(key);
  }
  set(key, value, skipDisposeOnOverwrite = false) {
    if (this._isDisposed) {
      console.warn(new Error("Trying to add a disposable to a DisposableMap that has already been disposed of. The added object will be leaked!").stack);
    }
    if (!skipDisposeOnOverwrite) {
      this._store.get(key)?.dispose();
    }
    this._store.set(key, value);
    setParentOfDisposable(value, this);
  }
  /**
   * Delete the value stored for `key` from this map and also dispose of it.
   */
  deleteAndDispose(key) {
    this._store.get(key)?.dispose();
    this._store.delete(key);
  }
  /**
   * Delete the value stored for `key` from this map but return it. The caller is
   * responsible for disposing of the value.
   */
  deleteAndLeak(key) {
    const value = this._store.get(key);
    if (value) {
      setParentOfDisposable(value, null);
    }
    this._store.delete(key);
    return value;
  }
  keys() {
    return this._store.keys();
  }
  values() {
    return this._store.values();
  }
  [Symbol.iterator]() {
    return this._store[Symbol.iterator]();
  }
};

// src/vs/base/common/linkedList.ts
var Node = class _Node {
  static {
    this.Undefined = new _Node(void 0);
  }
  constructor(element) {
    this.element = element;
    this.next = _Node.Undefined;
    this.prev = _Node.Undefined;
  }
};

// src/vs/nls.ts
function getNLSMessages() {
  return globalThis._VSCODE_NLS_MESSAGES;
}
function getNLSLanguage() {
  return globalThis._VSCODE_NLS_LANGUAGE;
}
var isPseudo = getNLSLanguage() === "pseudo" || typeof document !== "undefined" && document.location && typeof document.location.hash === "string" && document.location.hash.indexOf("pseudo=true") >= 0;
function _format(message, args) {
  let result;
  if (args.length === 0) {
    result = message;
  } else {
    result = message.replace(/\{(\d+)\}/g, (match, rest) => {
      const index = rest[0];
      const arg = args[index];
      let result2 = match;
      if (typeof arg === "string") {
        result2 = arg;
      } else if (typeof arg === "number" || typeof arg === "boolean" || arg === void 0 || arg === null) {
        result2 = String(arg);
      }
      return result2;
    });
  }
  if (isPseudo) {
    result = "\uFF3B" + result.replace(/[aouei]/g, "$&$&") + "\uFF3D";
  }
  return result;
}
function localize(data, message, ...args) {
  if (typeof data === "number") {
    return _format(lookupMessage(data, message), args);
  }
  return _format(message, args);
}
function lookupMessage(index, fallback) {
  const message = getNLSMessages()?.[index];
  if (typeof message !== "string") {
    if (typeof fallback === "string") {
      return fallback;
    }
    throw new Error(`!!! NLS MISSING: ${index} !!!`);
  }
  return message;
}

// src/vs/base/common/platform.ts
var LANGUAGE_DEFAULT = "en";
var _isWindows = false;
var _isMacintosh = false;
var _isLinux = false;
var _isLinuxSnap = false;
var _isNative = false;
var _isWeb = false;
var _isElectron = false;
var _isIOS = false;
var _isCI = false;
var _isMobile = false;
var _locale = void 0;
var _language = LANGUAGE_DEFAULT;
var _platformLocale = LANGUAGE_DEFAULT;
var _translationsConfigFile = void 0;
var _userAgent = void 0;
var $globalThis = globalThis;
var nodeProcess = void 0;
if (typeof $globalThis.vscode !== "undefined" && typeof $globalThis.vscode.process !== "undefined") {
  nodeProcess = $globalThis.vscode.process;
} else if (typeof process !== "undefined" && typeof process?.versions?.node === "string") {
  nodeProcess = process;
}
var isElectronProcess = typeof nodeProcess?.versions?.electron === "string";
var isElectronRenderer = isElectronProcess && nodeProcess?.type === "renderer";
if (typeof nodeProcess === "object") {
  _isWindows = nodeProcess.platform === "win32";
  _isMacintosh = nodeProcess.platform === "darwin";
  _isLinux = nodeProcess.platform === "linux";
  _isLinuxSnap = _isLinux && !!nodeProcess.env["SNAP"] && !!nodeProcess.env["SNAP_REVISION"];
  _isElectron = isElectronProcess;
  _isCI = !!nodeProcess.env["CI"] || !!nodeProcess.env["BUILD_ARTIFACTSTAGINGDIRECTORY"] || !!nodeProcess.env["GITHUB_WORKSPACE"];
  _locale = LANGUAGE_DEFAULT;
  _language = LANGUAGE_DEFAULT;
  const rawNlsConfig = nodeProcess.env["VSCODE_NLS_CONFIG"];
  if (rawNlsConfig) {
    try {
      const nlsConfig = JSON.parse(rawNlsConfig);
      _locale = nlsConfig.userLocale;
      _platformLocale = nlsConfig.osLocale;
      _language = nlsConfig.resolvedLanguage || LANGUAGE_DEFAULT;
      _translationsConfigFile = nlsConfig.languagePack?.translationsConfigFile;
    } catch (e) {
    }
  }
  _isNative = true;
} else if (typeof navigator === "object" && !isElectronRenderer) {
  _userAgent = navigator.userAgent;
  _isWindows = _userAgent.indexOf("Windows") >= 0;
  _isMacintosh = _userAgent.indexOf("Macintosh") >= 0;
  _isIOS = (_userAgent.indexOf("Macintosh") >= 0 || _userAgent.indexOf("iPad") >= 0 || _userAgent.indexOf("iPhone") >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
  _isLinux = _userAgent.indexOf("Linux") >= 0;
  _isMobile = _userAgent?.indexOf("Mobi") >= 0;
  _isWeb = true;
  _language = getNLSLanguage() || LANGUAGE_DEFAULT;
  _locale = navigator.language.toLowerCase();
  _platformLocale = _locale;
} else {
  console.error("Unable to resolve platform.");
}
var _platform = 0 /* Web */;
if (_isMacintosh) {
  _platform = 1 /* Mac */;
} else if (_isWindows) {
  _platform = 3 /* Windows */;
} else if (_isLinux) {
  _platform = 2 /* Linux */;
}
var isWindows = _isWindows;
var isMacintosh = _isMacintosh;
var isLinux = _isLinux;
var isNative = _isNative;
var isWeb = _isWeb;
var isWebWorker = _isWeb && typeof $globalThis.importScripts === "function";
var webWorkerOrigin = isWebWorker ? $globalThis.origin : void 0;
var userAgent = _userAgent;
var language = _language;
var Language;
((Language2) => {
  function value() {
    return language;
  }
  Language2.value = value;
  function isDefaultVariant() {
    if (language.length === 2) {
      return language === "en";
    } else if (language.length >= 3) {
      return language[0] === "e" && language[1] === "n" && language[2] === "-";
    } else {
      return false;
    }
  }
  Language2.isDefaultVariant = isDefaultVariant;
  function isDefault() {
    return language === "en";
  }
  Language2.isDefault = isDefault;
})(Language || (Language = {}));
var setTimeout0IsFaster = typeof $globalThis.postMessage === "function" && !$globalThis.importScripts;
var setTimeout0 = (() => {
  if (setTimeout0IsFaster) {
    const pending = [];
    $globalThis.addEventListener("message", (e) => {
      if (e.data && e.data.vscodeScheduleAsyncWork) {
        for (let i = 0, len = pending.length; i < len; i++) {
          const candidate = pending[i];
          if (candidate.id === e.data.vscodeScheduleAsyncWork) {
            pending.splice(i, 1);
            candidate.callback();
            return;
          }
        }
      }
    });
    let lastId = 0;
    return (callback) => {
      const myId = ++lastId;
      pending.push({
        id: myId,
        callback
      });
      $globalThis.postMessage({ vscodeScheduleAsyncWork: myId }, "*");
    };
  }
  return (callback) => setTimeout(callback);
})();
var isChrome = !!(userAgent && userAgent.indexOf("Chrome") >= 0);
var isFirefox = !!(userAgent && userAgent.indexOf("Firefox") >= 0);
var isSafari = !!(!isChrome && (userAgent && userAgent.indexOf("Safari") >= 0));
var isEdge = !!(userAgent && userAgent.indexOf("Edg/") >= 0);
var isAndroid = !!(userAgent && userAgent.indexOf("Android") >= 0);

// src/vs/base/common/process.ts
var safeProcess;
var vscodeGlobal = globalThis.vscode;
if (typeof vscodeGlobal !== "undefined" && typeof vscodeGlobal.process !== "undefined") {
  const sandboxProcess = vscodeGlobal.process;
  safeProcess = {
    get platform() {
      return sandboxProcess.platform;
    },
    get arch() {
      return sandboxProcess.arch;
    },
    get env() {
      return sandboxProcess.env;
    },
    cwd() {
      return sandboxProcess.cwd();
    }
  };
} else if (typeof process !== "undefined" && typeof process?.versions?.node === "string") {
  safeProcess = {
    get platform() {
      return process.platform;
    },
    get arch() {
      return process.arch;
    },
    get env() {
      return process.env;
    },
    cwd() {
      return process.env["VSCODE_CWD"] || process.cwd();
    }
  };
} else {
  safeProcess = {
    // Supported
    get platform() {
      return isWindows ? "win32" : isMacintosh ? "darwin" : "linux";
    },
    get arch() {
      return void 0;
    },
    // Unsupported
    get env() {
      return {};
    },
    cwd() {
      return "/";
    }
  };
}
var cwd = safeProcess.cwd;
var env = safeProcess.env;
var platform = safeProcess.platform;
var arch = safeProcess.arch;

// src/vs/base/common/stopwatch.ts
var performanceNow = globalThis.performance.now.bind(globalThis.performance);
var StopWatch = class _StopWatch {
  static create(highResolution) {
    return new _StopWatch(highResolution);
  }
  constructor(highResolution) {
    this._now = highResolution === false ? Date.now : performanceNow;
    this._startTime = this._now();
    this._stopTime = -1;
  }
  stop() {
    this._stopTime = this._now();
  }
  reset() {
    this._startTime = this._now();
    this._stopTime = -1;
  }
  elapsed() {
    if (this._stopTime !== -1) {
      return this._stopTime - this._startTime;
    }
    return this._now() - this._startTime;
  }
};

// src/vs/base/common/event.ts
var _enableDisposeWithListenerWarning = false;
var _enableSnapshotPotentialLeakWarning = false;
var _bufferLeakWarnCountThreshold = 100;
var _bufferLeakWarnTimeThreshold = 6e4;
function _isBufferLeakWarningEnabled() {
  return !!env["VSCODE_DEV"];
}
var Event;
((Event7) => {
  Event7.None = () => Disposable.None;
  function _addLeakageTraceLogic(options) {
    if (_enableSnapshotPotentialLeakWarning) {
      const { onDidAddListener: origListenerDidAdd } = options;
      const stack = Stacktrace.create();
      let count = 0;
      options.onDidAddListener = () => {
        if (++count === 2) {
          console.warn("snapshotted emitter LIKELY used public and SHOULD HAVE BEEN created with DisposableStore. snapshotted here");
          stack.print();
        }
        origListenerDidAdd?.();
      };
    }
  }
  function defer(event, flushOnListenerRemove, disposable) {
    return debounce(event, () => void 0, 0, void 0, flushOnListenerRemove ?? true, void 0, disposable);
  }
  Event7.defer = defer;
  function once(event) {
    return (listener, thisArgs = null, disposables) => {
      let didFire = false;
      let result = void 0;
      result = event((e) => {
        if (didFire) {
          return;
        } else if (result) {
          result.dispose();
        } else {
          didFire = true;
        }
        return listener.call(thisArgs, e);
      }, null, disposables);
      if (didFire) {
        result.dispose();
      }
      return result;
    };
  }
  Event7.once = once;
  function onceIf(event, condition) {
    return Event7.once(Event7.filter(event, condition));
  }
  Event7.onceIf = onceIf;
  function map(event, map2, disposable) {
    return snapshot((listener, thisArgs = null, disposables) => event((i) => listener.call(thisArgs, map2(i)), null, disposables), disposable);
  }
  Event7.map = map;
  function forEach(event, each, disposable) {
    return snapshot((listener, thisArgs = null, disposables) => event((i) => {
      each(i);
      listener.call(thisArgs, i);
    }, null, disposables), disposable);
  }
  Event7.forEach = forEach;
  function filter(event, filter2, disposable) {
    return snapshot((listener, thisArgs = null, disposables) => event((e) => filter2(e) && listener.call(thisArgs, e), null, disposables), disposable);
  }
  Event7.filter = filter;
  function signal(event) {
    return event;
  }
  Event7.signal = signal;
  function any(...events) {
    return (listener, thisArgs = null, disposables) => {
      const disposable = combinedDisposable(...events.map((event) => event((e) => listener.call(thisArgs, e))));
      return addAndReturnDisposable(disposable, disposables);
    };
  }
  Event7.any = any;
  function reduce(event, merge, initial, disposable) {
    let output = initial;
    return map(event, (e) => {
      output = merge(output, e);
      return output;
    }, disposable);
  }
  Event7.reduce = reduce;
  function snapshot(event, disposable) {
    let listener;
    const options = {
      onWillAddFirstListener() {
        listener = event(emitter.fire, emitter);
      },
      onDidRemoveLastListener() {
        listener?.dispose();
      }
    };
    if (!disposable) {
      _addLeakageTraceLogic(options);
    }
    const emitter = new Emitter(options);
    disposable?.add(emitter);
    return emitter.event;
  }
  function addAndReturnDisposable(d, store) {
    if (store instanceof Array) {
      store.push(d);
    } else if (store) {
      store.add(d);
    }
    return d;
  }
  function debounce(event, merge, delay = 100, leading = false, flushOnListenerRemove = false, leakWarningThreshold, disposable) {
    let subscription;
    let output = void 0;
    let handle = void 0;
    let numDebouncedCalls = 0;
    let doFire;
    const options = {
      leakWarningThreshold,
      onWillAddFirstListener() {
        subscription = event((cur) => {
          numDebouncedCalls++;
          output = merge(output, cur);
          if (leading && !handle) {
            emitter.fire(output);
            output = void 0;
          }
          doFire = () => {
            const _output = output;
            output = void 0;
            handle = void 0;
            if (!leading || numDebouncedCalls > 1) {
              emitter.fire(_output);
            }
            numDebouncedCalls = 0;
          };
          if (typeof delay === "number") {
            if (handle) {
              clearTimeout(handle);
            }
            handle = setTimeout(doFire, delay);
          } else {
            if (handle === void 0) {
              handle = null;
              queueMicrotask(doFire);
            }
          }
        });
      },
      onWillRemoveListener() {
        if (flushOnListenerRemove && numDebouncedCalls > 0) {
          doFire?.();
        }
      },
      onDidRemoveLastListener() {
        doFire = void 0;
        subscription.dispose();
      }
    };
    if (!disposable) {
      _addLeakageTraceLogic(options);
    }
    const emitter = new Emitter(options);
    disposable?.add(emitter);
    return emitter.event;
  }
  Event7.debounce = debounce;
  function accumulate(event, delay = 0, flushOnListenerRemove, disposable) {
    return Event7.debounce(event, (last, e) => {
      if (!last) {
        return [e];
      }
      last.push(e);
      return last;
    }, delay, void 0, flushOnListenerRemove ?? true, void 0, disposable);
  }
  Event7.accumulate = accumulate;
  function throttle(event, merge, delay = 100, leading = true, trailing = true, leakWarningThreshold, disposable) {
    let subscription;
    let output = void 0;
    let handle = void 0;
    let numThrottledCalls = 0;
    const options = {
      leakWarningThreshold,
      onWillAddFirstListener() {
        subscription = event((cur) => {
          numThrottledCalls++;
          output = merge(output, cur);
          if (handle === void 0) {
            if (leading) {
              emitter.fire(output);
              output = void 0;
              numThrottledCalls = 0;
            }
            if (typeof delay === "number") {
              handle = setTimeout(() => {
                if (trailing && numThrottledCalls > 0) {
                  emitter.fire(output);
                }
                output = void 0;
                handle = void 0;
                numThrottledCalls = 0;
              }, delay);
            } else {
              handle = 0;
              queueMicrotask(() => {
                if (trailing && numThrottledCalls > 0) {
                  emitter.fire(output);
                }
                output = void 0;
                handle = void 0;
                numThrottledCalls = 0;
              });
            }
          }
        });
      },
      onDidRemoveLastListener() {
        subscription.dispose();
      }
    };
    if (!disposable) {
      _addLeakageTraceLogic(options);
    }
    const emitter = new Emitter(options);
    disposable?.add(emitter);
    return emitter.event;
  }
  Event7.throttle = throttle;
  function latch(event, equals3 = (a, b) => a === b, disposable) {
    let firstCall = true;
    let cache;
    return filter(event, (value) => {
      const shouldEmit = firstCall || !equals3(value, cache);
      firstCall = false;
      cache = value;
      return shouldEmit;
    }, disposable);
  }
  Event7.latch = latch;
  function split(event, isT, disposable) {
    return [
      Event7.filter(event, isT, disposable),
      Event7.filter(event, (e) => !isT(e), disposable)
    ];
  }
  Event7.split = split;
  function buffer(event, debugName, flushAfterTimeout = false, _buffer = [], disposable) {
    let buffer2 = _buffer.slice();
    let bufferLeakWarningData;
    if (_isBufferLeakWarningEnabled()) {
      bufferLeakWarningData = {
        stack: Stacktrace.create(),
        timerId: setTimeout(() => {
          if (buffer2 && buffer2.length > 0 && bufferLeakWarningData && !bufferLeakWarningData.warned) {
            bufferLeakWarningData.warned = true;
            console.warn(`[Event.buffer][${debugName}] potential LEAK detected: ${buffer2.length} events buffered for ${_bufferLeakWarnTimeThreshold / 1e3}s without being consumed. Buffered here:`);
            bufferLeakWarningData.stack.print();
          }
        }, _bufferLeakWarnTimeThreshold),
        warned: false
      };
      if (disposable) {
        disposable.add(toDisposable(() => clearTimeout(bufferLeakWarningData.timerId)));
      }
    }
    const clearLeakWarningTimer = () => {
      if (bufferLeakWarningData) {
        clearTimeout(bufferLeakWarningData.timerId);
      }
    };
    let listener = event((e) => {
      if (buffer2) {
        buffer2.push(e);
        if (_isBufferLeakWarningEnabled() && bufferLeakWarningData && !bufferLeakWarningData.warned && buffer2.length >= _bufferLeakWarnCountThreshold) {
          bufferLeakWarningData.warned = true;
          console.warn(`[Event.buffer][${debugName}] potential LEAK detected: ${buffer2.length} events buffered without being consumed. Buffered here:`);
          bufferLeakWarningData.stack.print();
        }
      } else {
        emitter.fire(e);
      }
    });
    if (disposable) {
      disposable.add(listener);
    }
    const flush = () => {
      buffer2?.forEach((e) => emitter.fire(e));
      buffer2 = null;
      clearLeakWarningTimer();
    };
    const emitter = new Emitter({
      onWillAddFirstListener() {
        if (!listener) {
          listener = event((e) => emitter.fire(e));
          if (disposable) {
            disposable.add(listener);
          }
        }
      },
      onDidAddFirstListener() {
        if (buffer2) {
          if (flushAfterTimeout) {
            setTimeout(flush);
          } else {
            flush();
          }
        }
      },
      onDidRemoveLastListener() {
        if (listener) {
          listener.dispose();
        }
        listener = null;
        clearLeakWarningTimer();
      }
    });
    if (disposable) {
      disposable.add(emitter);
    }
    return emitter.event;
  }
  Event7.buffer = buffer;
  function chain(event, sythensize) {
    const fn = (listener, thisArgs, disposables) => {
      const cs = sythensize(new ChainableSynthesis());
      return event(function(value) {
        const result = cs.evaluate(value);
        if (result !== HaltChainable) {
          listener.call(thisArgs, result);
        }
      }, void 0, disposables);
    };
    return fn;
  }
  Event7.chain = chain;
  const HaltChainable = /* @__PURE__ */ Symbol("HaltChainable");
  class ChainableSynthesis {
    constructor() {
      this.steps = [];
    }
    map(fn) {
      this.steps.push(fn);
      return this;
    }
    forEach(fn) {
      this.steps.push((v) => {
        fn(v);
        return v;
      });
      return this;
    }
    filter(fn) {
      this.steps.push((v) => fn(v) ? v : HaltChainable);
      return this;
    }
    reduce(merge, initial) {
      let last = initial;
      this.steps.push((v) => {
        last = merge(last, v);
        return last;
      });
      return this;
    }
    latch(equals3 = (a, b) => a === b) {
      let firstCall = true;
      let cache;
      this.steps.push((value) => {
        const shouldEmit = firstCall || !equals3(value, cache);
        firstCall = false;
        cache = value;
        return shouldEmit ? value : HaltChainable;
      });
      return this;
    }
    evaluate(value) {
      for (const step of this.steps) {
        value = step(value);
        if (value === HaltChainable) {
          break;
        }
      }
      return value;
    }
  }
  function fromNodeEventEmitter(emitter, eventName, map2 = (id2) => id2) {
    const fn = (...args) => result.fire(map2(...args));
    const onFirstListenerAdd = () => emitter.on(eventName, fn);
    const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
    const result = new Emitter({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
    return result.event;
  }
  Event7.fromNodeEventEmitter = fromNodeEventEmitter;
  function fromDOMEventEmitter(emitter, eventName, map2 = (id2) => id2) {
    const fn = (...args) => result.fire(map2(...args));
    const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
    const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
    const result = new Emitter({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
    return result.event;
  }
  Event7.fromDOMEventEmitter = fromDOMEventEmitter;
  function toPromise(event, disposables) {
    let cancelRef;
    let listener;
    const promise = new Promise((resolve3) => {
      listener = once(event)(resolve3);
      addToDisposables(listener, disposables);
      cancelRef = () => {
        disposeAndRemove(listener, disposables);
      };
    });
    promise.cancel = cancelRef;
    if (disposables) {
      promise.finally(() => disposeAndRemove(listener, disposables));
    }
    return promise;
  }
  Event7.toPromise = toPromise;
  function forward(from, to) {
    return from((e) => to.fire(e));
  }
  Event7.forward = forward;
  function runAndSubscribe(event, handler, initial) {
    handler(initial);
    return event((e) => handler(e));
  }
  Event7.runAndSubscribe = runAndSubscribe;
  class EmitterObserver {
    constructor(_observable, store) {
      this._observable = _observable;
      this._counter = 0;
      this._hasChanged = false;
      const options = {
        onWillAddFirstListener: () => {
          _observable.addObserver(this);
          this._observable.reportChanges();
        },
        onDidRemoveLastListener: () => {
          _observable.removeObserver(this);
        }
      };
      if (!store) {
        _addLeakageTraceLogic(options);
      }
      this.emitter = new Emitter(options);
      if (store) {
        store.add(this.emitter);
      }
    }
    beginUpdate(_observable) {
      this._counter++;
    }
    handlePossibleChange(_observable) {
    }
    handleChange(_observable, _change) {
      this._hasChanged = true;
    }
    endUpdate(_observable) {
      this._counter--;
      if (this._counter === 0) {
        this._observable.reportChanges();
        if (this._hasChanged) {
          this._hasChanged = false;
          this.emitter.fire(this._observable.get());
        }
      }
    }
  }
  function fromObservable(obs, store) {
    const observer = new EmitterObserver(obs, store);
    return observer.emitter.event;
  }
  Event7.fromObservable = fromObservable;
  function fromObservableLight(observable) {
    return (listener, thisArgs, disposables) => {
      let count = 0;
      let didChange = false;
      const observer = {
        beginUpdate() {
          count++;
        },
        endUpdate() {
          count--;
          if (count === 0) {
            observable.reportChanges();
            if (didChange) {
              didChange = false;
              listener.call(thisArgs);
            }
          }
        },
        handlePossibleChange() {
        },
        handleChange() {
          didChange = true;
        }
      };
      observable.addObserver(observer);
      observable.reportChanges();
      const disposable = {
        dispose() {
          observable.removeObserver(observer);
        }
      };
      addToDisposables(disposable, disposables);
      return disposable;
    };
  }
  Event7.fromObservableLight = fromObservableLight;
})(Event || (Event = {}));
var EventProfiling = class _EventProfiling {
  constructor(name) {
    this.listenerCount = 0;
    this.invocationCount = 0;
    this.elapsedOverall = 0;
    this.durations = [];
    this.name = `${name}_${_EventProfiling._idPool++}`;
    _EventProfiling.all.add(this);
  }
  static {
    this.all = /* @__PURE__ */ new Set();
  }
  static {
    this._idPool = 0;
  }
  start(listenerCount) {
    this._stopWatch = new StopWatch();
    this.listenerCount = listenerCount;
  }
  stop() {
    if (this._stopWatch) {
      const elapsed = this._stopWatch.elapsed();
      this.durations.push(elapsed);
      this.elapsedOverall += elapsed;
      this.invocationCount += 1;
      this._stopWatch = void 0;
    }
  }
};
var _globalLeakWarningThreshold = -1;
var LeakageMonitor = class _LeakageMonitor {
  constructor(_errorHandler, threshold, name = (_LeakageMonitor._idPool++).toString(16).padStart(3, "0")) {
    this._errorHandler = _errorHandler;
    this.threshold = threshold;
    this.name = name;
    this._warnCountdown = 0;
  }
  static {
    this._idPool = 1;
  }
  dispose() {
    this._stacks?.clear();
  }
  check(stack, listenerCount) {
    const threshold = this.threshold;
    if (threshold <= 0 || listenerCount < threshold) {
      return void 0;
    }
    if (!this._stacks) {
      this._stacks = /* @__PURE__ */ new Map();
    }
    const count = this._stacks.get(stack.value) || 0;
    this._stacks.set(stack.value, count + 1);
    this._warnCountdown -= 1;
    if (this._warnCountdown <= 0) {
      this._warnCountdown = threshold * 0.5;
      const [topStack, topCount] = this.getMostFrequentStack();
      const message = `[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`;
      console.warn(message);
      console.warn(topStack);
      const error = new ListenerLeakError(message, topStack);
      this._errorHandler(error);
    }
    return () => {
      const count2 = this._stacks.get(stack.value) || 0;
      this._stacks.set(stack.value, count2 - 1);
    };
  }
  getMostFrequentStack() {
    if (!this._stacks) {
      return void 0;
    }
    let topStack;
    let topCount = 0;
    for (const [stack, count] of this._stacks) {
      if (!topStack || topCount < count) {
        topStack = [stack, count];
        topCount = count;
      }
    }
    return topStack;
  }
};
var Stacktrace = class _Stacktrace {
  constructor(value) {
    this.value = value;
  }
  static create() {
    const err = new Error();
    return new _Stacktrace(err.stack ?? "");
  }
  print() {
    console.warn(this.value.split("\n").slice(2).join("\n"));
  }
};
var ListenerLeakError = class extends Error {
  constructor(message, stack) {
    super(message);
    this.name = "ListenerLeakError";
    this.stack = stack;
  }
};
var ListenerRefusalError = class extends Error {
  constructor(message, stack) {
    super(message);
    this.name = "ListenerRefusalError";
    this.stack = stack;
  }
};
var id = 0;
var UniqueContainer = class {
  constructor(value) {
    this.value = value;
    this.id = id++;
  }
};
var compactionThreshold = 2;
var forEachListener = (listeners, fn) => {
  if (listeners instanceof UniqueContainer) {
    fn(listeners);
  } else {
    for (let i = 0; i < listeners.length; i++) {
      const l = listeners[i];
      if (l) {
        fn(l);
      }
    }
  }
};
var Emitter = class {
  constructor(options) {
    this._size = 0;
    this._options = options;
    this._leakageMon = _globalLeakWarningThreshold > 0 || this._options?.leakWarningThreshold ? new LeakageMonitor(options?.onListenerError ?? onUnexpectedError, this._options?.leakWarningThreshold ?? _globalLeakWarningThreshold) : void 0;
    this._perfMon = this._options?._profName ? new EventProfiling(this._options._profName) : void 0;
    this._deliveryQueue = this._options?.deliveryQueue;
  }
  dispose() {
    if (!this._disposed) {
      this._disposed = true;
      if (this._deliveryQueue?.current === this) {
        this._deliveryQueue.reset();
      }
      if (this._listeners) {
        if (_enableDisposeWithListenerWarning) {
          const listeners = this._listeners;
          queueMicrotask(() => {
            forEachListener(listeners, (l) => l.stack?.print());
          });
        }
        this._listeners = void 0;
        this._size = 0;
      }
      this._options?.onDidRemoveLastListener?.();
      this._leakageMon?.dispose();
    }
  }
  /**
   * For the public to allow to subscribe
   * to events from this Emitter
   */
  get event() {
    this._event ??= (callback, thisArgs, disposables) => {
      if (this._leakageMon && this._size > this._leakageMon.threshold ** 2) {
        const message = `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`;
        console.warn(message);
        const tuple = this._leakageMon.getMostFrequentStack() ?? ["UNKNOWN stack", -1];
        const error = new ListenerRefusalError(`${message}. HINT: Stack shows most frequent listener (${tuple[1]}-times)`, tuple[0]);
        const errorHandler2 = this._options?.onListenerError || onUnexpectedError;
        errorHandler2(error);
        return Disposable.None;
      }
      if (this._disposed) {
        return Disposable.None;
      }
      if (thisArgs) {
        callback = callback.bind(thisArgs);
      }
      const contained = new UniqueContainer(callback);
      let removeMonitor;
      let stack;
      if (this._leakageMon && this._size >= Math.ceil(this._leakageMon.threshold * 0.2)) {
        contained.stack = Stacktrace.create();
        removeMonitor = this._leakageMon.check(contained.stack, this._size + 1);
      }
      if (_enableDisposeWithListenerWarning) {
        contained.stack = stack ?? Stacktrace.create();
      }
      if (!this._listeners) {
        this._options?.onWillAddFirstListener?.(this);
        this._listeners = contained;
        this._options?.onDidAddFirstListener?.(this);
      } else if (this._listeners instanceof UniqueContainer) {
        this._deliveryQueue ??= new EventDeliveryQueuePrivate();
        this._listeners = [this._listeners, contained];
      } else {
        this._listeners.push(contained);
      }
      this._options?.onDidAddListener?.(this);
      this._size++;
      const result = toDisposable(() => {
        removeMonitor?.();
        this._removeListener(contained);
      });
      addToDisposables(result, disposables);
      return result;
    };
    return this._event;
  }
  _removeListener(listener) {
    this._options?.onWillRemoveListener?.(this);
    if (!this._listeners) {
      return;
    }
    if (this._size === 1) {
      this._listeners = void 0;
      this._options?.onDidRemoveLastListener?.(this);
      this._size = 0;
      return;
    }
    const listeners = this._listeners;
    const index = listeners.indexOf(listener);
    if (index === -1) {
      console.log("disposed?", this._disposed);
      console.log("size?", this._size);
      console.log("arr?", JSON.stringify(this._listeners));
      throw new Error("Attempted to dispose unknown listener");
    }
    this._size--;
    listeners[index] = void 0;
    const adjustDeliveryQueue = this._deliveryQueue.current === this;
    if (this._size * compactionThreshold <= listeners.length) {
      let n = 0;
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i]) {
          listeners[n++] = listeners[i];
        } else if (adjustDeliveryQueue && n < this._deliveryQueue.end) {
          this._deliveryQueue.end--;
          if (n < this._deliveryQueue.i) {
            this._deliveryQueue.i--;
          }
        }
      }
      listeners.length = n;
    }
  }
  _deliver(listener, value) {
    if (!listener) {
      return;
    }
    const errorHandler2 = this._options?.onListenerError || onUnexpectedError;
    if (!errorHandler2) {
      listener.value(value);
      return;
    }
    try {
      listener.value(value);
    } catch (e) {
      errorHandler2(e);
    }
  }
  /** Delivers items in the queue. Assumes the queue is ready to go. */
  _deliverQueue(dq) {
    const listeners = dq.current._listeners;
    while (dq.i < dq.end) {
      this._deliver(listeners[dq.i++], dq.value);
    }
    dq.reset();
  }
  /**
   * To be kept private to fire an event to
   * subscribers
   */
  fire(event) {
    if (this._deliveryQueue?.current) {
      this._deliverQueue(this._deliveryQueue);
      this._perfMon?.stop();
    }
    this._perfMon?.start(this._size);
    if (!this._listeners) {
    } else if (this._listeners instanceof UniqueContainer) {
      this._deliver(this._listeners, event);
    } else {
      const dq = this._deliveryQueue;
      dq.enqueue(this, event, this._listeners.length);
      this._deliverQueue(dq);
    }
    this._perfMon?.stop();
  }
  hasListeners() {
    return this._size > 0;
  }
};
var EventDeliveryQueuePrivate = class {
  constructor() {
    /**
     * Index in current's listener list.
     */
    this.i = -1;
    /**
     * The last index in the listener's list to deliver.
     */
    this.end = 0;
  }
  enqueue(emitter, value, end) {
    this.i = 0;
    this.end = end;
    this.current = emitter;
    this.value = value;
  }
  reset() {
    this.i = this.end;
    this.current = void 0;
    this.value = void 0;
  }
};
var EventMultiplexer = class {
  constructor() {
    this.hasListeners = false;
    this.events = [];
    this.emitter = new Emitter({
      onWillAddFirstListener: () => this.onFirstListenerAdd(),
      onDidRemoveLastListener: () => this.onLastListenerRemove()
    });
  }
  get event() {
    return this.emitter.event;
  }
  add(event) {
    const e = { event, listener: null };
    this.events.push(e);
    if (this.hasListeners) {
      this.hook(e);
    }
    const dispose2 = () => {
      if (this.hasListeners) {
        this.unhook(e);
      }
      const idx = this.events.indexOf(e);
      this.events.splice(idx, 1);
    };
    return toDisposable(createSingleCallFunction(dispose2));
  }
  onFirstListenerAdd() {
    this.hasListeners = true;
    this.events.forEach((e) => this.hook(e));
  }
  onLastListenerRemove() {
    this.hasListeners = false;
    this.events.forEach((e) => this.unhook(e));
  }
  hook(e) {
    e.listener = e.event((r) => this.emitter.fire(r));
  }
  unhook(e) {
    e.listener?.dispose();
    e.listener = null;
  }
  dispose() {
    this.emitter.dispose();
    for (const e of this.events) {
      e.listener?.dispose();
    }
    this.events = [];
  }
};
var Relay = class {
  constructor() {
    this.listening = false;
    this.inputEvent = Event.None;
    this.inputEventListener = Disposable.None;
    this.emitter = new Emitter({
      onDidAddFirstListener: () => {
        this.listening = true;
        this.inputEventListener = this.inputEvent(this.emitter.fire, this.emitter);
      },
      onDidRemoveLastListener: () => {
        this.listening = false;
        this.inputEventListener.dispose();
      }
    });
    this.event = this.emitter.event;
  }
  set input(event) {
    this.inputEvent = event;
    if (this.listening) {
      this.inputEventListener.dispose();
      this.inputEventListener = event(this.emitter.fire, this.emitter);
    }
  }
  dispose() {
    this.inputEventListener.dispose();
    this.emitter.dispose();
  }
};
function addToDisposables(result, disposables) {
  if (disposables instanceof DisposableStore) {
    disposables.add(result);
  } else if (Array.isArray(disposables)) {
    disposables.push(result);
  }
}
function disposeAndRemove(result, disposables) {
  if (disposables instanceof DisposableStore) {
    disposables.delete(result);
  } else if (Array.isArray(disposables)) {
    const index = disposables.indexOf(result);
    if (index !== -1) {
      disposables.splice(index, 1);
    }
  }
  result.dispose();
}

// src/vs/base/common/cancellation.ts
var shortcutEvent = Object.freeze(function(callback, context) {
  const handle = setTimeout(callback.bind(context), 0);
  return { dispose() {
    clearTimeout(handle);
  } };
});
var CancellationToken;
((CancellationToken6) => {
  function isCancellationToken(thing) {
    if (thing === CancellationToken6.None || thing === CancellationToken6.Cancelled) {
      return true;
    }
    if (thing instanceof MutableToken) {
      return true;
    }
    if (!thing || typeof thing !== "object") {
      return false;
    }
    return typeof thing.isCancellationRequested === "boolean" && typeof thing.onCancellationRequested === "function";
  }
  CancellationToken6.isCancellationToken = isCancellationToken;
  CancellationToken6.None = Object.freeze({
    isCancellationRequested: false,
    onCancellationRequested: Event.None
  });
  CancellationToken6.Cancelled = Object.freeze({
    isCancellationRequested: true,
    onCancellationRequested: shortcutEvent
  });
})(CancellationToken || (CancellationToken = {}));
var MutableToken = class {
  constructor() {
    this._isCancelled = false;
    this._emitter = null;
  }
  cancel() {
    if (!this._isCancelled) {
      this._isCancelled = true;
      if (this._emitter) {
        this._emitter.fire(void 0);
        this.dispose();
      }
    }
  }
  get isCancellationRequested() {
    return this._isCancelled;
  }
  get onCancellationRequested() {
    if (this._isCancelled) {
      return shortcutEvent;
    }
    if (!this._emitter) {
      this._emitter = new Emitter();
    }
    return this._emitter.event;
  }
  dispose() {
    if (this._emitter) {
      this._emitter.dispose();
      this._emitter = null;
    }
  }
};
var CancellationTokenSource = class {
  constructor(parent) {
    this._token = void 0;
    this._parentListener = void 0;
    this._parentListener = parent && parent.onCancellationRequested(this.cancel, this);
  }
  get token() {
    if (!this._token) {
      this._token = new MutableToken();
    }
    return this._token;
  }
  cancel() {
    if (!this._token) {
      this._token = CancellationToken.Cancelled;
    } else if (this._token instanceof MutableToken) {
      this._token.cancel();
    }
  }
  dispose(cancel = false) {
    if (cancel) {
      this.cancel();
    }
    this._parentListener?.dispose();
    if (!this._token) {
      this._token = CancellationToken.None;
    } else if (this._token instanceof MutableToken) {
      this._token.dispose();
    }
  }
};

// src/vs/base/common/path.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;
var ErrorInvalidArgType = class extends Error {
  constructor(name, expected, actual) {
    let determiner;
    if (typeof expected === "string" && expected.indexOf("not ") === 0) {
      determiner = "must not be";
      expected = expected.replace(/^not /, "");
    } else {
      determiner = "must be";
    }
    const type = name.indexOf(".") !== -1 ? "property" : "argument";
    let msg = `The "${name}" ${type} ${determiner} of type ${expected}`;
    msg += `. Received type ${typeof actual}`;
    super(msg);
    this.code = "ERR_INVALID_ARG_TYPE";
  }
};
function validateObject(pathObject, name) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new ErrorInvalidArgType(name, "Object", pathObject);
  }
}
function validateString(value, name) {
  if (typeof value !== "string") {
    throw new ErrorInvalidArgType(name, "string", value);
  }
}
var platformIsWin32 = platform === "win32";
function isPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z || code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z;
}
function normalizeString(path, allowAboveRoot, separator, isPathSeparator3) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code = 0;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) {
      code = path.charCodeAt(i);
    } else if (isPathSeparator3(code)) {
      break;
    } else {
      code = CHAR_FORWARD_SLASH;
    }
    if (isPathSeparator3(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length !== 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? `${separator}..` : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `${separator}${path.slice(lastSlash + 1, i)}`;
        } else {
          res = path.slice(lastSlash + 1, i);
        }
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function formatExt(ext) {
  return ext ? `${ext[0] === "." ? "" : "."}${ext}` : "";
}
function _format2(sep2, pathObject) {
  validateObject(pathObject, "pathObject");
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || `${pathObject.name || ""}${formatExt(pathObject.ext)}`;
  if (!dir) {
    return base;
  }
  return dir === pathObject.root ? `${dir}${base}` : `${dir}${sep2}${base}`;
}
var win32 = {
  // path.resolve([from ...], to)
  resolve(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for (let i = pathSegments.length - 1; i >= -1; i--) {
      let path;
      if (i >= 0) {
        path = pathSegments[i];
        validateString(path, `paths[${i}]`);
        if (path.length === 0) {
          continue;
        }
      } else if (resolvedDevice.length === 0) {
        path = cwd();
      } else {
        path = env[`=${resolvedDevice}`] || cwd();
        if (path === void 0 || path.slice(0, 2).toLowerCase() !== resolvedDevice.toLowerCase() && path.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
          path = `${resolvedDevice}\\`;
        }
      }
      const len = path.length;
      let rootEnd = 0;
      let device = "";
      let isAbsolute3 = false;
      const code = path.charCodeAt(0);
      if (len === 1) {
        if (isPathSeparator(code)) {
          rootEnd = 1;
          isAbsolute3 = true;
        }
      } else if (isPathSeparator(code)) {
        isAbsolute3 = true;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            const firstPart = path.slice(last, j);
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len || j !== last) {
                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
          isAbsolute3 = true;
          rootEnd = 3;
        }
      }
      if (device.length > 0) {
        if (resolvedDevice.length > 0) {
          if (device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
          }
        } else {
          resolvedDevice = device;
        }
      }
      if (resolvedAbsolute) {
        if (resolvedDevice.length > 0) {
          break;
        }
      } else {
        resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
        resolvedAbsolute = isAbsolute3;
        if (isAbsolute3 && resolvedDevice.length > 0) {
          break;
        }
      }
    }
    resolvedTail = normalizeString(
      resolvedTail,
      !resolvedAbsolute,
      "\\",
      isPathSeparator
    );
    return resolvedAbsolute ? `${resolvedDevice}\\${resolvedTail}` : `${resolvedDevice}${resolvedTail}` || ".";
  },
  normalize(path) {
    validateString(path, "path");
    const len = path.length;
    if (len === 0) {
      return ".";
    }
    let rootEnd = 0;
    let device;
    let isAbsolute3 = false;
    const code = path.charCodeAt(0);
    if (len === 1) {
      return isPosixPathSeparator(code) ? "\\" : path;
    }
    if (isPathSeparator(code)) {
      isAbsolute3 = true;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        while (j < len && !isPathSeparator(path.charCodeAt(j))) {
          j++;
        }
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j);
          last = j;
          while (j < len && isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path.slice(last)}\\`;
            }
            if (j !== last) {
              device = `\\\\${firstPart}\\${path.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
      device = path.slice(0, 2);
      rootEnd = 2;
      if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
        isAbsolute3 = true;
        rootEnd = 3;
      }
    }
    let tail = rootEnd < len ? normalizeString(path.slice(rootEnd), !isAbsolute3, "\\", isPathSeparator) : "";
    if (tail.length === 0 && !isAbsolute3) {
      tail = ".";
    }
    if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
      tail += "\\";
    }
    if (!isAbsolute3 && device === void 0 && path.includes(":")) {
      if (tail.length >= 2 && isWindowsDeviceRoot(tail.charCodeAt(0)) && tail.charCodeAt(1) === CHAR_COLON) {
        return `.\\${tail}`;
      }
      let index = path.indexOf(":");
      do {
        if (index === len - 1 || isPathSeparator(path.charCodeAt(index + 1))) {
          return `.\\${tail}`;
        }
      } while ((index = path.indexOf(":", index + 1)) !== -1);
    }
    if (device === void 0) {
      return isAbsolute3 ? `\\${tail}` : tail;
    }
    return isAbsolute3 ? `${device}\\${tail}` : `${device}${tail}`;
  },
  isAbsolute(path) {
    validateString(path, "path");
    const len = path.length;
    if (len === 0) {
      return false;
    }
    const code = path.charCodeAt(0);
    return isPathSeparator(code) || // Possible device root
    len > 2 && isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON && isPathSeparator(path.charCodeAt(2));
  },
  join(...paths) {
    if (paths.length === 0) {
      return ".";
    }
    let joined;
    let firstPart;
    for (let i = 0; i < paths.length; ++i) {
      const arg = paths[i];
      validateString(arg, "path");
      if (arg.length > 0) {
        if (joined === void 0) {
          joined = firstPart = arg;
        } else {
          joined += `\\${arg}`;
        }
      }
    }
    if (joined === void 0) {
      return ".";
    }
    let needsReplace = true;
    let slashCount = 0;
    if (typeof firstPart === "string" && isPathSeparator(firstPart.charCodeAt(0))) {
      ++slashCount;
      const firstLen = firstPart.length;
      if (firstLen > 1 && isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2))) {
            ++slashCount;
          } else {
            needsReplace = false;
          }
        }
      }
    }
    if (needsReplace) {
      while (slashCount < joined.length && isPathSeparator(joined.charCodeAt(slashCount))) {
        slashCount++;
      }
      if (slashCount >= 2) {
        joined = `\\${joined.slice(slashCount)}`;
      }
    }
    return win32.normalize(joined);
  },
  // It will solve the relative path from `from` to `to`, for instance:
  //  from = 'C:\\orandea\\test\\aaa'
  //  to = 'C:\\orandea\\impl\\bbb'
  // The output of the function should be: '..\\..\\impl\\bbb'
  relative(from, to) {
    validateString(from, "from");
    validateString(to, "to");
    if (from === to) {
      return "";
    }
    const fromOrig = win32.resolve(from);
    const toOrig = win32.resolve(to);
    if (fromOrig === toOrig) {
      return "";
    }
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) {
      return "";
    }
    if (fromOrig.length !== from.length || toOrig.length !== to.length) {
      const fromSplit = fromOrig.split("\\");
      const toSplit = toOrig.split("\\");
      if (fromSplit[fromSplit.length - 1] === "") {
        fromSplit.pop();
      }
      if (toSplit[toSplit.length - 1] === "") {
        toSplit.pop();
      }
      const fromLen2 = fromSplit.length;
      const toLen2 = toSplit.length;
      const length2 = fromLen2 < toLen2 ? fromLen2 : toLen2;
      let i2;
      for (i2 = 0; i2 < length2; i2++) {
        if (fromSplit[i2].toLowerCase() !== toSplit[i2].toLowerCase()) {
          break;
        }
      }
      if (i2 === 0) {
        return toOrig;
      } else if (i2 === length2) {
        if (toLen2 > length2) {
          return toSplit.slice(i2).join("\\");
        }
        if (fromLen2 > length2) {
          return "..\\".repeat(fromLen2 - 1 - i2) + "..";
        }
        return "";
      }
      return "..\\".repeat(fromLen2 - i2) + toSplit.slice(i2).join("\\");
    }
    let fromStart = 0;
    while (fromStart < from.length && from.charCodeAt(fromStart) === CHAR_BACKWARD_SLASH) {
      fromStart++;
    }
    let fromEnd = from.length;
    while (fromEnd - 1 > fromStart && from.charCodeAt(fromEnd - 1) === CHAR_BACKWARD_SLASH) {
      fromEnd--;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    while (toStart < to.length && to.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
      toStart++;
    }
    let toEnd = to.length;
    while (toEnd - 1 > toStart && to.charCodeAt(toEnd - 1) === CHAR_BACKWARD_SLASH) {
      toEnd--;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i < length; i++) {
      const fromCode = from.charCodeAt(fromStart + i);
      if (fromCode !== to.charCodeAt(toStart + i)) {
        break;
      } else if (fromCode === CHAR_BACKWARD_SLASH) {
        lastCommonSep = i;
      }
    }
    if (i !== length) {
      if (lastCommonSep === -1) {
        return toOrig;
      }
    } else {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i + 1);
        }
        if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      if (lastCommonSep === -1) {
        lastCommonSep = 0;
      }
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
        out += out.length === 0 ? ".." : "\\..";
      }
    }
    toStart += lastCommonSep;
    if (out.length > 0) {
      return `${out}${toOrig.slice(toStart, toEnd)}`;
    }
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
      ++toStart;
    }
    return toOrig.slice(toStart, toEnd);
  },
  toNamespacedPath(path) {
    if (typeof path !== "string" || path.length === 0) {
      return path;
    }
    const resolvedPath = win32.resolve(path);
    if (resolvedPath.length <= 2) {
      return path;
    }
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0)) && resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
      return `\\\\?\\${resolvedPath}`;
    }
    return resolvedPath;
  },
  dirname(path) {
    validateString(path, "path");
    const len = path.length;
    if (len === 0) {
      return ".";
    }
    let rootEnd = -1;
    let offset = 0;
    const code = path.charCodeAt(0);
    if (len === 1) {
      return isPathSeparator(code) ? path : ".";
    }
    if (isPathSeparator(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        while (j < len && !isPathSeparator(path.charCodeAt(j))) {
          j++;
        }
        if (j < len && j !== last) {
          last = j;
          while (j < len && isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j === len) {
              return path;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
      rootEnd = len > 2 && isPathSeparator(path.charCodeAt(2)) ? 3 : 2;
      offset = rootEnd;
    }
    let end = -1;
    let matchedSlash = true;
    for (let i = len - 1; i >= offset; --i) {
      if (isPathSeparator(path.charCodeAt(i))) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1) {
      if (rootEnd === -1) {
        return ".";
      }
      end = rootEnd;
    }
    return path.slice(0, end);
  },
  basename(path, suffix) {
    if (suffix !== void 0) {
      validateString(suffix, "suffix");
    }
    validateString(path, "path");
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path.length >= 2 && isWindowsDeviceRoot(path.charCodeAt(0)) && path.charCodeAt(1) === CHAR_COLON) {
      start = 2;
    }
    if (suffix !== void 0 && suffix.length > 0 && suffix.length <= path.length) {
      if (suffix === path) {
        return "";
      }
      let extIdx = suffix.length - 1;
      let firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === suffix.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) {
        end = firstNonSlashEnd;
      } else if (end === -1) {
        end = path.length;
      }
      return path.slice(start, end);
    }
    for (i = path.length - 1; i >= start; --i) {
      if (isPathSeparator(path.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1) {
      return "";
    }
    return path.slice(start, end);
  },
  extname(path) {
    validateString(path, "path");
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path.length >= 2 && path.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path.charCodeAt(0))) {
      start = startPart = 2;
    }
    for (let i = path.length - 1; i >= start; --i) {
      const code = path.charCodeAt(i);
      if (isPathSeparator(code)) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === CHAR_DOT) {
        if (startDot === -1) {
          startDot = i;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: _format2.bind(null, "\\"),
  parse(path) {
    validateString(path, "path");
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0) {
      return ret;
    }
    const len = path.length;
    let rootEnd = 0;
    let code = path.charCodeAt(0);
    if (len === 1) {
      if (isPathSeparator(code)) {
        ret.root = ret.dir = path;
        return ret;
      }
      ret.base = ret.name = path;
      return ret;
    }
    if (isPathSeparator(code)) {
      rootEnd = 1;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        while (j < len && !isPathSeparator(path.charCodeAt(j))) {
          j++;
        }
        if (j < len && j !== last) {
          last = j;
          while (j < len && isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
      if (len <= 2) {
        ret.root = ret.dir = path;
        return ret;
      }
      rootEnd = 2;
      if (isPathSeparator(path.charCodeAt(2))) {
        if (len === 3) {
          ret.root = ret.dir = path;
          return ret;
        }
        rootEnd = 3;
      }
    }
    if (rootEnd > 0) {
      ret.root = path.slice(0, rootEnd);
    }
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= rootEnd; --i) {
      code = path.charCodeAt(i);
      if (isPathSeparator(code)) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === CHAR_DOT) {
        if (startDot === -1) {
          startDot = i;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (end !== -1) {
      if (startDot === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        ret.base = ret.name = path.slice(startPart, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
      }
    }
    if (startPart > 0 && startPart !== rootEnd) {
      ret.dir = path.slice(0, startPart - 1);
    } else {
      ret.dir = ret.root;
    }
    return ret;
  },
  sep: "\\",
  delimiter: ";",
  win32: null,
  posix: null
};
var posixCwd = (() => {
  if (platformIsWin32) {
    const regexp = /\\/g;
    return () => {
      const cwd3 = cwd().replace(regexp, "/");
      return cwd3.slice(cwd3.indexOf("/"));
    };
  }
  return () => cwd();
})();
var posix = {
  // path.resolve([from ...], to)
  resolve(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for (let i = pathSegments.length - 1; i >= 0 && !resolvedAbsolute; i--) {
      const path = pathSegments[i];
      validateString(path, `paths[${i}]`);
      if (path.length === 0) {
        continue;
      }
      resolvedPath = `${path}/${resolvedPath}`;
      resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    if (!resolvedAbsolute) {
      const cwd3 = posixCwd();
      resolvedPath = `${cwd3}/${resolvedPath}`;
      resolvedAbsolute = cwd3.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    resolvedPath = normalizeString(
      resolvedPath,
      !resolvedAbsolute,
      "/",
      isPosixPathSeparator
    );
    if (resolvedAbsolute) {
      return `/${resolvedPath}`;
    }
    return resolvedPath.length > 0 ? resolvedPath : ".";
  },
  normalize(path) {
    validateString(path, "path");
    if (path.length === 0) {
      return ".";
    }
    const isAbsolute3 = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
    path = normalizeString(path, !isAbsolute3, "/", isPosixPathSeparator);
    if (path.length === 0) {
      if (isAbsolute3) {
        return "/";
      }
      return trailingSeparator ? "./" : ".";
    }
    if (trailingSeparator) {
      path += "/";
    }
    return isAbsolute3 ? `/${path}` : path;
  },
  isAbsolute(path) {
    validateString(path, "path");
    return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
  },
  join(...paths) {
    if (paths.length === 0) {
      return ".";
    }
    const path = [];
    for (let i = 0; i < paths.length; ++i) {
      const arg = paths[i];
      validateString(arg, "path");
      if (arg.length > 0) {
        path.push(arg);
      }
    }
    if (path.length === 0) {
      return ".";
    }
    return posix.normalize(path.join("/"));
  },
  relative(from, to) {
    validateString(from, "from");
    validateString(to, "to");
    if (from === to) {
      return "";
    }
    from = posix.resolve(from);
    to = posix.resolve(to);
    if (from === to) {
      return "";
    }
    const fromStart = 1;
    const fromEnd = from.length;
    const fromLen = fromEnd - fromStart;
    const toStart = 1;
    const toLen = to.length - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i < length; i++) {
      const fromCode = from.charCodeAt(fromStart + i);
      if (fromCode !== to.charCodeAt(toStart + i)) {
        break;
      } else if (fromCode === CHAR_FORWARD_SLASH) {
        lastCommonSep = i;
      }
    }
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i + 1);
        }
        if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        out += out.length === 0 ? ".." : "/..";
      }
    }
    return `${out}${to.slice(toStart + lastCommonSep)}`;
  },
  toNamespacedPath(path) {
    return path;
  },
  dirname(path) {
    validateString(path, "path");
    if (path.length === 0) {
      return ".";
    }
    const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
      if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1) {
      return hasRoot ? "/" : ".";
    }
    if (hasRoot && end === 1) {
      return "//";
    }
    return path.slice(0, end);
  },
  basename(path, suffix) {
    if (suffix !== void 0) {
      validateString(suffix, "suffix");
    }
    validateString(path, "path");
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (suffix !== void 0 && suffix.length > 0 && suffix.length <= path.length) {
      if (suffix === path) {
        return "";
      }
      let extIdx = suffix.length - 1;
      let firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === suffix.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) {
        end = firstNonSlashEnd;
      } else if (end === -1) {
        end = path.length;
      }
      return path.slice(start, end);
    }
    for (i = path.length - 1; i >= 0; --i) {
      if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1) {
      return "";
    }
    return path.slice(start, end);
  },
  extname(path) {
    validateString(path, "path");
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
      const char = path[i];
      if (char === "/") {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (char === ".") {
        if (startDot === -1) {
          startDot = i;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: _format2.bind(null, "/"),
  parse(path) {
    validateString(path, "path");
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0) {
      return ret;
    }
    const isAbsolute3 = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    let start;
    if (isAbsolute3) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= start; --i) {
      const code = path.charCodeAt(i);
      if (code === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === CHAR_DOT) {
        if (startDot === -1) {
          startDot = i;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (end !== -1) {
      const start2 = startPart === 0 && isAbsolute3 ? 1 : startPart;
      if (startDot === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        ret.base = ret.name = path.slice(start2, end);
      } else {
        ret.name = path.slice(start2, startDot);
        ret.base = path.slice(start2, end);
        ret.ext = path.slice(startDot, end);
      }
    }
    if (startPart > 0) {
      ret.dir = path.slice(0, startPart - 1);
    } else if (isAbsolute3) {
      ret.dir = "/";
    }
    return ret;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
posix.win32 = win32.win32 = win32;
posix.posix = win32.posix = posix;
var normalize = platformIsWin32 ? win32.normalize : posix.normalize;
var isAbsolute = platformIsWin32 ? win32.isAbsolute : posix.isAbsolute;
var join = platformIsWin32 ? win32.join : posix.join;
var resolve = platformIsWin32 ? win32.resolve : posix.resolve;
var relative = platformIsWin32 ? win32.relative : posix.relative;
var dirname = platformIsWin32 ? win32.dirname : posix.dirname;
var basename = platformIsWin32 ? win32.basename : posix.basename;
var extname = platformIsWin32 ? win32.extname : posix.extname;
var format = platformIsWin32 ? win32.format : posix.format;
var parse = platformIsWin32 ? win32.parse : posix.parse;
var toNamespacedPath = platformIsWin32 ? win32.toNamespacedPath : posix.toNamespacedPath;
var sep = platformIsWin32 ? win32.sep : posix.sep;
var delimiter = platformIsWin32 ? win32.delimiter : posix.delimiter;

// src/vs/base/common/cache.ts
function identity(t) {
  return t;
}
var LRUCachedFunction = class {
  constructor(arg1, arg2) {
    this.lastCache = void 0;
    this.lastArgKey = void 0;
    if (typeof arg1 === "function") {
      this._fn = arg1;
      this._computeKey = identity;
    } else {
      this._fn = arg2;
      this._computeKey = arg1.getCacheKey;
    }
  }
  get(arg) {
    const key = this._computeKey(arg);
    if (this.lastArgKey !== key) {
      this.lastArgKey = key;
      this.lastCache = this._fn(arg);
    }
    return this.lastCache;
  }
};

// src/vs/base/common/lazy.ts
var Lazy = class {
  constructor(executor) {
    this.executor = executor;
    this._state = 0 /* Uninitialized */;
  }
  /**
   * True if the lazy value has been resolved.
   */
  get hasValue() {
    return this._state === 2 /* Completed */;
  }
  /**
   * Get the wrapped value.
   *
   * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
   * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
   */
  get value() {
    if (this._state === 0 /* Uninitialized */) {
      this._state = 1 /* Running */;
      try {
        this._value = this.executor();
      } catch (err) {
        this._error = err;
      } finally {
        this._state = 2 /* Completed */;
      }
    } else if (this._state === 1 /* Running */) {
      throw new Error("Cannot read the value of a lazy that is being initialized");
    }
    if (this._error) {
      throw this._error;
    }
    return this._value;
  }
  /**
   * Get the wrapped value without forcing evaluation.
   */
  get rawValue() {
    return this._value;
  }
};

// src/vs/base/common/strings.ts
function isFalsyOrWhitespace(str) {
  if (!str || typeof str !== "string") {
    return true;
  }
  return str.trim().length === 0;
}
function rtrim(haystack, needle) {
  if (!haystack || !needle) {
    return haystack;
  }
  const needleLen = needle.length, haystackLen = haystack.length;
  if (needleLen === 1) {
    let end = haystackLen;
    const ch = needle.charCodeAt(0);
    while (end > 0 && haystack.charCodeAt(end - 1) === ch) {
      end--;
    }
    return haystack.substring(0, end);
  }
  let offset = haystackLen;
  while (offset > 0 && haystack.endsWith(needle, offset)) {
    offset -= needleLen;
  }
  return haystack.substring(0, offset);
}
function compare(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}
function compareSubstring(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
  for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
    const codeA = a.charCodeAt(aStart);
    const codeB = b.charCodeAt(bStart);
    if (codeA < codeB) {
      return -1;
    } else if (codeA > codeB) {
      return 1;
    }
  }
  const aLen = aEnd - aStart;
  const bLen = bEnd - bStart;
  if (aLen < bLen) {
    return -1;
  } else if (aLen > bLen) {
    return 1;
  }
  return 0;
}
function compareIgnoreCase(a, b) {
  return compareSubstringIgnoreCase(a, b, 0, a.length, 0, b.length);
}
function compareSubstringIgnoreCase(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
  for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
    let codeA = a.charCodeAt(aStart);
    let codeB = b.charCodeAt(bStart);
    if (codeA === codeB) {
      continue;
    }
    if (codeA >= 128 || codeB >= 128) {
      return compareSubstring(a.toLowerCase(), b.toLowerCase(), aStart, aEnd, bStart, bEnd);
    }
    if (isLowerAsciiLetter(codeA)) {
      codeA -= 32;
    }
    if (isLowerAsciiLetter(codeB)) {
      codeB -= 32;
    }
    const diff = codeA - codeB;
    if (diff === 0) {
      continue;
    }
    return diff;
  }
  const aLen = aEnd - aStart;
  const bLen = bEnd - bStart;
  if (aLen < bLen) {
    return -1;
  } else if (aLen > bLen) {
    return 1;
  }
  return 0;
}
function isLowerAsciiLetter(code) {
  return code >= 97 /* a */ && code <= 122 /* z */;
}
function isUpperAsciiLetter(code) {
  return code >= 65 /* A */ && code <= 90 /* Z */;
}
function equalsIgnoreCase(a, b) {
  return a.length === b.length && compareSubstringIgnoreCase(a, b) === 0;
}
function startsWithIgnoreCase(str, candidate) {
  const len = candidate.length;
  return len <= str.length && compareSubstringIgnoreCase(str, candidate, 0, len) === 0;
}
function isHighSurrogate(charCode) {
  return 55296 <= charCode && charCode <= 56319;
}
function isLowSurrogate(charCode) {
  return 56320 <= charCode && charCode <= 57343;
}
function computeCodePoint(highSurrogate, lowSurrogate) {
  return (highSurrogate - 55296 << 10) + (lowSurrogate - 56320) + 65536;
}
var CSI_SEQUENCE = /(?:\x1b\[|\x9b)[=?>!]?[\d;:]*["$#'* ]?[a-zA-Z@^`{}|~]/;
var OSC_SEQUENCE = /(?:\x1b\]|\x9d).*?(?:\x1b\\|\x07|\x9c)/;
var ESC_SEQUENCE = /\x1b(?:[ #%\(\)\*\+\-\.\/]?[a-zA-Z0-9\|}~@])/;
var CONTROL_SEQUENCES = new RegExp("(?:" + [
  CSI_SEQUENCE.source,
  OSC_SEQUENCE.source,
  ESC_SEQUENCE.source
].join("|") + ")", "g");
var UTF8_BOM_CHARACTER = String.fromCharCode(65279 /* UTF8_BOM */);
var GraphemeBreakTree = class _GraphemeBreakTree {
  static {
    this._INSTANCE = null;
  }
  static getInstance() {
    if (!_GraphemeBreakTree._INSTANCE) {
      _GraphemeBreakTree._INSTANCE = new _GraphemeBreakTree();
    }
    return _GraphemeBreakTree._INSTANCE;
  }
  constructor() {
    this._data = getGraphemeBreakRawData();
  }
  getGraphemeBreakType(codePoint) {
    if (codePoint < 32) {
      if (codePoint === 10 /* LineFeed */) {
        return 3 /* LF */;
      }
      if (codePoint === 13 /* CarriageReturn */) {
        return 2 /* CR */;
      }
      return 4 /* Control */;
    }
    if (codePoint < 127) {
      return 0 /* Other */;
    }
    const data = this._data;
    const nodeCount = data.length / 3;
    let nodeIndex = 1;
    while (nodeIndex <= nodeCount) {
      if (codePoint < data[3 * nodeIndex]) {
        nodeIndex = 2 * nodeIndex;
      } else if (codePoint > data[3 * nodeIndex + 1]) {
        nodeIndex = 2 * nodeIndex + 1;
      } else {
        return data[3 * nodeIndex + 2];
      }
    }
    return 0 /* Other */;
  }
};
function getGraphemeBreakRawData() {
  return JSON.parse("[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]");
}
var AmbiguousCharacters = class _AmbiguousCharacters {
  constructor(confusableDictionary) {
    this.confusableDictionary = confusableDictionary;
  }
  static {
    this.ambiguousCharacterData = new Lazy(() => {
      return JSON.parse(
        '{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,1523,96,8242,96,1370,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,118002,50,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,118003,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,118004,52,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,118005,53,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,118006,54,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,118007,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,118008,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,118009,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,117974,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,117975,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71913,67,71922,67,65315,67,8557,67,8450,67,8493,67,117976,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,117977,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,117978,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,117979,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,117980,71,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,117981,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,117983,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,117984,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,118001,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,117982,108,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,117985,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,117986,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,117987,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,118000,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,117988,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,117989,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,117990,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,117991,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,117992,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,117993,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,117994,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,117995,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71910,87,71919,87,117996,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,117997,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,117998,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,71909,90,66293,90,65338,90,8484,90,8488,90,117999,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65283,35,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],"_default":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"cs":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"es":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"fr":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"it":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"ja":[8211,45,8218,44,65281,33,8216,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65292,44,65297,49,65307,59],"ko":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"pt-BR":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"ru":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"zh-hans":[160,32,65374,126,8218,44,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65297,49],"zh-hant":[8211,45,65374,126,8218,44,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89]}'
      );
    });
  }
  static {
    this.cache = new LRUCachedFunction((localesStr) => {
      const locales = localesStr.split(",");
      function arrayToMap(arr) {
        const result = /* @__PURE__ */ new Map();
        for (let i = 0; i < arr.length; i += 2) {
          result.set(arr[i], arr[i + 1]);
        }
        return result;
      }
      function mergeMaps(map1, map2) {
        const result = new Map(map1);
        for (const [key, value] of map2) {
          result.set(key, value);
        }
        return result;
      }
      function intersectMaps(map1, map2) {
        if (!map1) {
          return map2;
        }
        const result = /* @__PURE__ */ new Map();
        for (const [key, value] of map1) {
          if (map2.has(key)) {
            result.set(key, value);
          }
        }
        return result;
      }
      const data = this.ambiguousCharacterData.value;
      let filteredLocales = locales.filter(
        (l) => !l.startsWith("_") && Object.hasOwn(data, l)
      );
      if (filteredLocales.length === 0) {
        filteredLocales = ["_default"];
      }
      let languageSpecificMap = void 0;
      for (const locale of filteredLocales) {
        const map2 = arrayToMap(data[locale]);
        languageSpecificMap = intersectMaps(languageSpecificMap, map2);
      }
      const commonMap = arrayToMap(data["_common"]);
      const map = mergeMaps(commonMap, languageSpecificMap);
      return new _AmbiguousCharacters(map);
    });
  }
  static getInstance(locales) {
    return _AmbiguousCharacters.cache.get(Array.from(locales).join(","));
  }
  static {
    this._locales = new Lazy(
      () => Object.keys(_AmbiguousCharacters.ambiguousCharacterData.value).filter(
        (k) => !k.startsWith("_")
      )
    );
  }
  static getLocales() {
    return _AmbiguousCharacters._locales.value;
  }
  isAmbiguous(codePoint) {
    return this.confusableDictionary.has(codePoint);
  }
  containsAmbiguousCharacter(str) {
    for (let i = 0; i < str.length; i++) {
      const codePoint = str.codePointAt(i);
      if (typeof codePoint === "number" && this.isAmbiguous(codePoint)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns the non basic ASCII code point that the given code point can be confused,
   * or undefined if such code point does note exist.
   */
  getPrimaryConfusable(codePoint) {
    return this.confusableDictionary.get(codePoint);
  }
  getConfusableCodePoints() {
    return new Set(this.confusableDictionary.keys());
  }
};
var InvisibleCharacters = class _InvisibleCharacters {
  static getRawData() {
    return JSON.parse('{"_common":[11,12,13,127,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999],"cs":[173,8203,12288],"de":[173,8203,12288],"es":[8203,12288],"fr":[173,8203,12288],"it":[160,173,12288],"ja":[173],"ko":[173,12288],"pl":[173,8203,12288],"pt-BR":[173,8203,12288],"qps-ploc":[160,173,8203,12288],"ru":[173,12288],"tr":[160,173,8203,12288],"zh-hans":[160,173,8203,12288],"zh-hant":[173,12288]}');
  }
  static {
    this._data = void 0;
  }
  static getData() {
    if (!this._data) {
      this._data = new Set([...Object.values(_InvisibleCharacters.getRawData())].flat());
    }
    return this._data;
  }
  static isInvisibleCharacter(codePoint) {
    return _InvisibleCharacters.getData().has(codePoint);
  }
  static containsInvisibleCharacter(str) {
    for (let i = 0; i < str.length; i++) {
      const codePoint = str.codePointAt(i);
      if (typeof codePoint === "number" && (_InvisibleCharacters.isInvisibleCharacter(codePoint) || codePoint === 32 /* space */)) {
        return true;
      }
    }
    return false;
  }
  static get codePoints() {
    return _InvisibleCharacters.getData();
  }
};

// src/vs/base/common/extpath.ts
function isPathSeparator2(code) {
  return code === 47 /* Slash */ || code === 92 /* Backslash */;
}
function toSlashes(osPath) {
  return osPath.replace(/[\\/]/g, posix.sep);
}
function toPosixPath(osPath) {
  if (osPath.indexOf("/") === -1) {
    osPath = toSlashes(osPath);
  }
  if (/^[a-zA-Z]:(\/|$)/.test(osPath)) {
    osPath = "/" + osPath;
  }
  return osPath;
}
function getRoot(path, sep2 = posix.sep) {
  if (!path) {
    return "";
  }
  const len = path.length;
  const firstLetter = path.charCodeAt(0);
  if (isPathSeparator2(firstLetter)) {
    if (isPathSeparator2(path.charCodeAt(1))) {
      if (!isPathSeparator2(path.charCodeAt(2))) {
        let pos2 = 3;
        const start = pos2;
        for (; pos2 < len; pos2++) {
          if (isPathSeparator2(path.charCodeAt(pos2))) {
            break;
          }
        }
        if (start !== pos2 && !isPathSeparator2(path.charCodeAt(pos2 + 1))) {
          pos2 += 1;
          for (; pos2 < len; pos2++) {
            if (isPathSeparator2(path.charCodeAt(pos2))) {
              return path.slice(0, pos2 + 1).replace(/[\\/]/g, sep2);
            }
          }
        }
      }
    }
    return sep2;
  } else if (isWindowsDriveLetter(firstLetter)) {
    if (path.charCodeAt(1) === 58 /* Colon */) {
      if (isPathSeparator2(path.charCodeAt(2))) {
        return path.slice(0, 2) + sep2;
      } else {
        return path.slice(0, 2);
      }
    }
  }
  let pos = path.indexOf("://");
  if (pos !== -1) {
    pos += 3;
    for (; pos < len; pos++) {
      if (isPathSeparator2(path.charCodeAt(pos))) {
        return path.slice(0, pos + 1);
      }
    }
  }
  return "";
}
function isEqualOrParent(base, parentCandidate, ignoreCase, separator = sep) {
  if (base === parentCandidate) {
    return true;
  }
  if (!base || !parentCandidate) {
    return false;
  }
  if (parentCandidate.length > base.length) {
    return false;
  }
  if (ignoreCase) {
    const beginsWith = startsWithIgnoreCase(base, parentCandidate);
    if (!beginsWith) {
      return false;
    }
    if (parentCandidate.length === base.length) {
      return true;
    }
    let sepOffset = parentCandidate.length;
    if (parentCandidate.charAt(parentCandidate.length - 1) === separator) {
      sepOffset--;
    }
    return base.charAt(sepOffset) === separator;
  }
  if (parentCandidate.charAt(parentCandidate.length - 1) !== separator) {
    parentCandidate += separator;
  }
  return base.indexOf(parentCandidate) === 0;
}
function isWindowsDriveLetter(char0) {
  return char0 >= 65 /* A */ && char0 <= 90 /* Z */ || char0 >= 97 /* a */ && char0 <= 122 /* z */;
}
function isRootOrDriveLetter(path) {
  const pathNormalized = normalize(path);
  if (isWindows) {
    if (path.length > 3) {
      return false;
    }
    return hasDriveLetter(pathNormalized) && (path.length === 2 || pathNormalized.charCodeAt(2) === 92 /* Backslash */);
  }
  return pathNormalized === posix.sep;
}
function hasDriveLetter(path, isWindowsOS = isWindows) {
  if (isWindowsOS) {
    return isWindowsDriveLetter(path.charCodeAt(0)) && path.charCodeAt(1) === 58 /* Colon */;
  }
  return false;
}
var pathChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var windowsSafePathFirstChars = "BDEFGHIJKMOQRSTUVWXYZbdefghijkmoqrstuvwxyz0123456789";
function randomPath(parent, prefix, randomLength = 8) {
  let suffix = "";
  for (let i = 0; i < randomLength; i++) {
    let pathCharsTouse;
    if (i === 0 && isWindows && !prefix && (randomLength === 3 || randomLength === 4)) {
      pathCharsTouse = windowsSafePathFirstChars;
    } else {
      pathCharsTouse = pathChars;
    }
    suffix += pathCharsTouse.charAt(Math.floor(Math.random() * pathCharsTouse.length));
  }
  let randomFileName;
  if (prefix) {
    randomFileName = `${prefix}-${suffix}`;
  } else {
    randomFileName = suffix;
  }
  if (parent) {
    return join(parent, randomFileName);
  }
  return randomFileName;
}

// src/vs/base/common/uri.ts
var _schemePattern = /^\w[\w\d+.-]*$/;
var _singleSlashStart = /^\//;
var _doubleSlashStart = /^\/\//;
function _validateUri(ret, _strict) {
  if (!ret.scheme && _strict) {
    throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${ret.authority}", path: "${ret.path}", query: "${ret.query}", fragment: "${ret.fragment}"}`);
  }
  if (ret.scheme && !_schemePattern.test(ret.scheme)) {
    const matches = [...ret.scheme.matchAll(/[^\w\d+.-]/gu)];
    const detail = matches.length > 0 ? ` Found '${matches[0][0]}' at index ${matches[0].index} (${matches.length} total)` : "";
    throw new Error(`[UriError]: Scheme contains illegal characters.${detail} (len:${ret.scheme.length})`);
  }
  if (ret.path) {
    if (ret.authority) {
      if (!_singleSlashStart.test(ret.path)) {
        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
      }
    } else {
      if (_doubleSlashStart.test(ret.path)) {
        throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
      }
    }
  }
}
function _schemeFix(scheme, _strict) {
  if (!scheme && !_strict) {
    return "file";
  }
  return scheme;
}
function _referenceResolution(scheme, path) {
  switch (scheme) {
    case "https":
    case "http":
    case "file":
      if (!path) {
        path = _slash;
      } else if (path[0] !== _slash) {
        path = _slash + path;
      }
      break;
  }
  return path;
}
var _empty = "";
var _slash = "/";
var _regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
var URI = class _URI {
  static isUri(thing) {
    if (thing instanceof _URI) {
      return true;
    }
    if (!thing || typeof thing !== "object") {
      return false;
    }
    return typeof thing.authority === "string" && typeof thing.fragment === "string" && typeof thing.path === "string" && typeof thing.query === "string" && typeof thing.scheme === "string" && typeof thing.fsPath === "string" && typeof thing.with === "function" && typeof thing.toString === "function";
  }
  /**
   * @internal
   */
  constructor(schemeOrData, authority, path, query, fragment, _strict = false) {
    if (typeof schemeOrData === "object") {
      this.scheme = schemeOrData.scheme || _empty;
      this.authority = schemeOrData.authority || _empty;
      this.path = schemeOrData.path || _empty;
      this.query = schemeOrData.query || _empty;
      this.fragment = schemeOrData.fragment || _empty;
    } else {
      this.scheme = _schemeFix(schemeOrData, _strict);
      this.authority = authority || _empty;
      this.path = _referenceResolution(this.scheme, path || _empty);
      this.query = query || _empty;
      this.fragment = fragment || _empty;
      _validateUri(this, _strict);
    }
  }
  // ---- filesystem path -----------------------
  /**
   * Returns a string representing the corresponding file system path of this URI.
   * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
   * platform specific path separator.
   *
   * * Will *not* validate the path for invalid characters and semantics.
   * * Will *not* look at the scheme of this URI.
   * * The result shall *not* be used for display purposes but for accessing a file on disk.
   *
   *
   * The *difference* to `URI#path` is the use of the platform specific separator and the handling
   * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
   *
   * ```ts
  	const u = URI.parse('file://server/c$/folder/file.txt')
  	u.authority === 'server'
  	u.path === '/shares/c$/file.txt'
  	u.fsPath === '\\server\c$\folder\file.txt'
  ```
   *
   * Using `URI#path` to read a file (using fs-apis) would not be enough because parts of the path,
   * namely the server name, would be missing. Therefore `URI#fsPath` exists - it's sugar to ease working
   * with URIs that represent files on disk (`file` scheme).
   */
  get fsPath() {
    return uriToFsPath(this, false);
  }
  // ---- modify to new -------------------------
  with(change) {
    if (!change) {
      return this;
    }
    let { scheme, authority, path, query, fragment } = change;
    if (scheme === void 0) {
      scheme = this.scheme;
    } else if (scheme === null) {
      scheme = _empty;
    }
    if (authority === void 0) {
      authority = this.authority;
    } else if (authority === null) {
      authority = _empty;
    }
    if (path === void 0) {
      path = this.path;
    } else if (path === null) {
      path = _empty;
    }
    if (query === void 0) {
      query = this.query;
    } else if (query === null) {
      query = _empty;
    }
    if (fragment === void 0) {
      fragment = this.fragment;
    } else if (fragment === null) {
      fragment = _empty;
    }
    if (scheme === this.scheme && authority === this.authority && path === this.path && query === this.query && fragment === this.fragment) {
      return this;
    }
    return new Uri(scheme, authority, path, query, fragment);
  }
  // ---- parse & validate ------------------------
  /**
   * Creates a new URI from a string, e.g. `http://www.example.com/some/path`,
   * `file:///usr/home`, or `scheme:with/path`.
   *
   * @param value A string which represents an URI (see `URI#toString`).
   */
  static parse(value, _strict = false) {
    const match = _regexp.exec(value);
    if (!match) {
      return new Uri(_empty, _empty, _empty, _empty, _empty);
    }
    return new Uri(
      match[2] || _empty,
      percentDecode(match[4] || _empty),
      percentDecode(match[5] || _empty),
      percentDecode(match[7] || _empty),
      percentDecode(match[9] || _empty),
      _strict
    );
  }
  /**
   * Creates a new URI from a file system path, e.g. `c:\my\files`,
   * `/usr/home`, or `\\server\share\some\path`.
   *
   * The *difference* between `URI#parse` and `URI#file` is that the latter treats the argument
   * as path, not as stringified-uri. E.g. `URI.file(path)` is **not the same as**
   * `URI.parse('file://' + path)` because the path might contain characters that are
   * interpreted (# and ?). See the following sample:
   * ```ts
  const good = URI.file('/coding/c#/project1');
  good.scheme === 'file';
  good.path === '/coding/c#/project1';
  good.fragment === '';
  const bad = URI.parse('file://' + '/coding/c#/project1');
  bad.scheme === 'file';
  bad.path === '/coding/c'; // path is now broken
  bad.fragment === '/project1';
  ```
   *
   * @param path A file system path (see `URI#fsPath`)
   */
  static file(path) {
    let authority = _empty;
    if (isWindows) {
      path = path.replace(/\\/g, _slash);
    }
    if (path[0] === _slash && path[1] === _slash) {
      const idx = path.indexOf(_slash, 2);
      if (idx === -1) {
        authority = path.substring(2);
        path = _slash;
      } else {
        authority = path.substring(2, idx);
        path = path.substring(idx) || _slash;
      }
    }
    return new Uri("file", authority, path, _empty, _empty);
  }
  /**
   * Creates new URI from uri components.
   *
   * Unless `strict` is `true` the scheme is defaults to be `file`. This function performs
   * validation and should be used for untrusted uri components retrieved from storage,
   * user input, command arguments etc
   */
  static from(components, strict) {
    const result = new Uri(
      components.scheme,
      components.authority,
      components.path,
      components.query,
      components.fragment,
      strict
    );
    return result;
  }
  /**
   * Join a URI path with path fragments and normalizes the resulting path.
   *
   * @param uri The input URI.
   * @param pathFragment The path fragment to add to the URI path.
   * @returns The resulting URI.
   */
  static joinPath(uri, ...pathFragment) {
    if (!uri.path) {
      throw new Error(`[UriError]: cannot call joinPath on URI without path`);
    }
    let newPath;
    if (isWindows && uri.scheme === "file") {
      newPath = _URI.file(win32.join(uriToFsPath(uri, true), ...pathFragment)).path;
    } else {
      newPath = posix.join(uri.path, ...pathFragment);
    }
    return uri.with({ path: newPath });
  }
  // ---- printing/externalize ---------------------------
  /**
   * Creates a string representation for this URI. It's guaranteed that calling
   * `URI.parse` with the result of this function creates an URI which is equal
   * to this URI.
   *
   * * The result shall *not* be used for display purposes but for externalization or transport.
   * * The result will be encoded using the percentage encoding and encoding happens mostly
   * ignore the scheme-specific encoding rules.
   *
   * @param skipEncoding Do not encode the result, default is `false`
   */
  toString(skipEncoding = false) {
    return _asFormatted(this, skipEncoding);
  }
  toJSON() {
    return this;
  }
  static revive(data) {
    if (!data) {
      return data;
    } else if (data instanceof _URI) {
      return data;
    } else {
      const result = new Uri(data);
      result._formatted = data.external ?? null;
      result._fsPath = data._sep === _pathSepMarker ? data.fsPath ?? null : null;
      return result;
    }
  }
  [/* @__PURE__ */ Symbol.for("debug.description")]() {
    return `URI(${this.toString()})`;
  }
};
var _pathSepMarker = isWindows ? 1 : void 0;
var Uri = class extends URI {
  constructor() {
    super(...arguments);
    this._formatted = null;
    this._fsPath = null;
  }
  get fsPath() {
    if (!this._fsPath) {
      this._fsPath = uriToFsPath(this, false);
    }
    return this._fsPath;
  }
  toString(skipEncoding = false) {
    if (!skipEncoding) {
      if (!this._formatted) {
        this._formatted = _asFormatted(this, false);
      }
      return this._formatted;
    } else {
      return _asFormatted(this, true);
    }
  }
  toJSON() {
    const res = {
      $mid: 1 /* Uri */
    };
    if (this._fsPath) {
      res.fsPath = this._fsPath;
      res._sep = _pathSepMarker;
    }
    if (this._formatted) {
      res.external = this._formatted;
    }
    if (this.path) {
      res.path = this.path;
    }
    if (this.scheme) {
      res.scheme = this.scheme;
    }
    if (this.authority) {
      res.authority = this.authority;
    }
    if (this.query) {
      res.query = this.query;
    }
    if (this.fragment) {
      res.fragment = this.fragment;
    }
    return res;
  }
};
var encodeTable = {
  [58 /* Colon */]: "%3A",
  // gen-delims
  [47 /* Slash */]: "%2F",
  [63 /* QuestionMark */]: "%3F",
  [35 /* Hash */]: "%23",
  [91 /* OpenSquareBracket */]: "%5B",
  [93 /* CloseSquareBracket */]: "%5D",
  [64 /* AtSign */]: "%40",
  [33 /* ExclamationMark */]: "%21",
  // sub-delims
  [36 /* DollarSign */]: "%24",
  [38 /* Ampersand */]: "%26",
  [39 /* SingleQuote */]: "%27",
  [40 /* OpenParen */]: "%28",
  [41 /* CloseParen */]: "%29",
  [42 /* Asterisk */]: "%2A",
  [43 /* Plus */]: "%2B",
  [44 /* Comma */]: "%2C",
  [59 /* Semicolon */]: "%3B",
  [61 /* Equals */]: "%3D",
  [32 /* Space */]: "%20"
};
function encodeURIComponentFast(uriComponent, isPath, isAuthority) {
  let res = void 0;
  let nativeEncodePos = -1;
  for (let pos = 0; pos < uriComponent.length; pos++) {
    const code = uriComponent.charCodeAt(pos);
    if (code >= 97 /* a */ && code <= 122 /* z */ || code >= 65 /* A */ && code <= 90 /* Z */ || code >= 48 /* Digit0 */ && code <= 57 /* Digit9 */ || code === 45 /* Dash */ || code === 46 /* Period */ || code === 95 /* Underline */ || code === 126 /* Tilde */ || isPath && code === 47 /* Slash */ || isAuthority && code === 91 /* OpenSquareBracket */ || isAuthority && code === 93 /* CloseSquareBracket */ || isAuthority && code === 58 /* Colon */) {
      if (nativeEncodePos !== -1) {
        res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
        nativeEncodePos = -1;
      }
      if (res !== void 0) {
        res += uriComponent.charAt(pos);
      }
    } else {
      if (res === void 0) {
        res = uriComponent.substr(0, pos);
      }
      const escaped = encodeTable[code];
      if (escaped !== void 0) {
        if (nativeEncodePos !== -1) {
          res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
          nativeEncodePos = -1;
        }
        res += escaped;
      } else if (nativeEncodePos === -1) {
        nativeEncodePos = pos;
      }
    }
  }
  if (nativeEncodePos !== -1) {
    res += encodeURIComponent(uriComponent.substring(nativeEncodePos));
  }
  return res !== void 0 ? res : uriComponent;
}
function encodeURIComponentMinimal(path) {
  let res = void 0;
  for (let pos = 0; pos < path.length; pos++) {
    const code = path.charCodeAt(pos);
    if (code === 35 /* Hash */ || code === 63 /* QuestionMark */) {
      if (res === void 0) {
        res = path.substr(0, pos);
      }
      res += encodeTable[code];
    } else {
      if (res !== void 0) {
        res += path[pos];
      }
    }
  }
  return res !== void 0 ? res : path;
}
function uriToFsPath(uri, keepDriveLetterCasing) {
  let value;
  if (uri.authority && uri.path.length > 1 && uri.scheme === "file") {
    value = `//${uri.authority}${uri.path}`;
  } else if (uri.path.charCodeAt(0) === 47 /* Slash */ && (uri.path.charCodeAt(1) >= 65 /* A */ && uri.path.charCodeAt(1) <= 90 /* Z */ || uri.path.charCodeAt(1) >= 97 /* a */ && uri.path.charCodeAt(1) <= 122 /* z */) && uri.path.charCodeAt(2) === 58 /* Colon */) {
    if (!keepDriveLetterCasing) {
      value = uri.path[1].toLowerCase() + uri.path.substr(2);
    } else {
      value = uri.path.substr(1);
    }
  } else {
    value = uri.path;
  }
  if (isWindows) {
    value = value.replace(/\//g, "\\");
  }
  return value;
}
function _asFormatted(uri, skipEncoding) {
  const encoder = !skipEncoding ? encodeURIComponentFast : encodeURIComponentMinimal;
  let res = "";
  let { scheme, authority, path, query, fragment } = uri;
  if (scheme) {
    res += scheme;
    res += ":";
  }
  if (authority || scheme === "file") {
    res += _slash;
    res += _slash;
  }
  if (authority) {
    let idx = authority.indexOf("@");
    if (idx !== -1) {
      const userinfo = authority.substr(0, idx);
      authority = authority.substr(idx + 1);
      idx = userinfo.lastIndexOf(":");
      if (idx === -1) {
        res += encoder(userinfo, false, false);
      } else {
        res += encoder(userinfo.substr(0, idx), false, false);
        res += ":";
        res += encoder(userinfo.substr(idx + 1), false, true);
      }
      res += "@";
    }
    authority = authority.toLowerCase();
    idx = authority.lastIndexOf(":");
    if (idx === -1) {
      res += encoder(authority, false, true);
    } else {
      res += encoder(authority.substr(0, idx), false, true);
      res += authority.substr(idx);
    }
  }
  if (path) {
    if (path.length >= 3 && path.charCodeAt(0) === 47 /* Slash */ && path.charCodeAt(2) === 58 /* Colon */) {
      const code = path.charCodeAt(1);
      if (code >= 65 /* A */ && code <= 90 /* Z */) {
        path = `/${String.fromCharCode(code + 32)}:${path.substr(3)}`;
      }
    } else if (path.length >= 2 && path.charCodeAt(1) === 58 /* Colon */) {
      const code = path.charCodeAt(0);
      if (code >= 65 /* A */ && code <= 90 /* Z */) {
        path = `${String.fromCharCode(code + 32)}:${path.substr(2)}`;
      }
    }
    res += encoder(path, true, false);
  }
  if (query) {
    res += "?";
    res += encoder(query, false, false);
  }
  if (fragment) {
    res += "#";
    res += !skipEncoding ? encodeURIComponentFast(fragment, false, false) : fragment;
  }
  return res;
}
function decodeURIComponentGraceful(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    if (str.length > 3) {
      return str.substr(0, 3) + decodeURIComponentGraceful(str.substr(3));
    } else {
      return str;
    }
  }
}
var _rEncodedAsHex = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
function percentDecode(str) {
  if (!str.match(_rEncodedAsHex)) {
    return str;
  }
  return str.replace(_rEncodedAsHex, (match) => decodeURIComponentGraceful(match));
}

// src/vs/base/common/network.ts
var Schemas;
((Schemas2) => {
  Schemas2.inMemory = "inmemory";
  Schemas2.vscode = "vscode";
  Schemas2.internal = "private";
  Schemas2.walkThrough = "walkThrough";
  Schemas2.walkThroughSnippet = "walkThroughSnippet";
  Schemas2.http = "http";
  Schemas2.https = "https";
  Schemas2.file = "file";
  Schemas2.mailto = "mailto";
  Schemas2.untitled = "untitled";
  Schemas2.data = "data";
  Schemas2.command = "command";
  Schemas2.vscodeRemote = "vscode-remote";
  Schemas2.vscodeRemoteResource = "vscode-remote-resource";
  Schemas2.vscodeManagedRemoteResource = "vscode-managed-remote-resource";
  Schemas2.vscodeUserData = "vscode-userdata";
  Schemas2.vscodeCustomEditor = "vscode-custom-editor";
  Schemas2.vscodeNotebookCell = "vscode-notebook-cell";
  Schemas2.vscodeNotebookCellMetadata = "vscode-notebook-cell-metadata";
  Schemas2.vscodeNotebookCellMetadataDiff = "vscode-notebook-cell-metadata-diff";
  Schemas2.vscodeNotebookCellOutput = "vscode-notebook-cell-output";
  Schemas2.vscodeNotebookCellOutputDiff = "vscode-notebook-cell-output-diff";
  Schemas2.vscodeNotebookMetadata = "vscode-notebook-metadata";
  Schemas2.vscodeInteractiveInput = "vscode-interactive-input";
  Schemas2.vscodeSettings = "vscode-settings";
  Schemas2.vscodeWorkspaceTrust = "vscode-workspace-trust";
  Schemas2.vscodeTerminal = "vscode-terminal";
  Schemas2.vscodeImageCarousel = "vscode-image-carousel";
  Schemas2.vscodeChatCodeBlock = "vscode-chat-code-block";
  Schemas2.vscodeChatCodeCompareBlock = "vscode-chat-code-compare-block";
  Schemas2.vscodeChatEditor = "vscode-chat-editor";
  Schemas2.vscodeChatInput = "chatSessionInput";
  Schemas2.vscodeLocalChatSession = "vscode-chat-session";
  Schemas2.webviewPanel = "webview-panel";
  Schemas2.vscodeWebview = "vscode-webview";
  Schemas2.vscodeBrowser = "vscode-browser";
  Schemas2.extension = "extension";
  Schemas2.vscodeFileResource = "vscode-file";
  Schemas2.tmp = "tmp";
  Schemas2.vsls = "vsls";
  Schemas2.vscodeSourceControl = "vscode-scm";
  Schemas2.commentsInput = "comment";
  Schemas2.codeSetting = "code-setting";
  Schemas2.outputChannel = "output";
  Schemas2.accessibleView = "accessible-view";
  Schemas2.chatEditingSnapshotScheme = "chat-editing-snapshot-text-model";
  Schemas2.chatEditingModel = "chat-editing-text-model";
  Schemas2.copilotPr = "copilot-pr";
})(Schemas || (Schemas = {}));
var connectionTokenQueryName = "tkn";
var RemoteAuthoritiesImpl = class {
  constructor() {
    this._hosts = /* @__PURE__ */ Object.create(null);
    this._ports = /* @__PURE__ */ Object.create(null);
    this._connectionTokens = /* @__PURE__ */ Object.create(null);
    this._preferredWebSchema = "http";
    this._delegate = null;
    this._serverRootPath = "/";
  }
  setPreferredWebSchema(schema) {
    this._preferredWebSchema = schema;
  }
  setDelegate(delegate) {
    this._delegate = delegate;
  }
  setServerRootPath(product2, serverBasePath) {
    this._serverRootPath = posix.join(serverBasePath ?? "/", getServerProductSegment(product2));
  }
  getServerRootPath() {
    return this._serverRootPath;
  }
  get _remoteResourcesPath() {
    return posix.join(this._serverRootPath, Schemas.vscodeRemoteResource);
  }
  set(authority, host, port) {
    this._hosts[authority] = host;
    this._ports[authority] = port;
  }
  setConnectionToken(authority, connectionToken) {
    this._connectionTokens[authority] = connectionToken;
  }
  getPreferredWebSchema() {
    return this._preferredWebSchema;
  }
  rewrite(uri) {
    if (this._delegate) {
      try {
        return this._delegate(uri);
      } catch (err) {
        onUnexpectedError(err);
        return uri;
      }
    }
    const authority = uri.authority;
    let host = this._hosts[authority];
    if (host && host.indexOf(":") !== -1 && host.indexOf("[") === -1) {
      host = `[${host}]`;
    }
    const port = this._ports[authority];
    const connectionToken = this._connectionTokens[authority];
    let query = `path=${encodeURIComponent(uri.path)}`;
    if (typeof connectionToken === "string") {
      query += `&${connectionTokenQueryName}=${encodeURIComponent(connectionToken)}`;
    }
    return URI.from({
      scheme: isWeb ? this._preferredWebSchema : Schemas.vscodeRemoteResource,
      authority: `${host}:${port}`,
      path: this._remoteResourcesPath,
      query
    });
  }
};
var RemoteAuthorities = new RemoteAuthoritiesImpl();
function getServerProductSegment(product2) {
  return `${product2.quality ?? "oss"}-${product2.commit ?? "dev"}`;
}
var VSCODE_AUTHORITY = "vscode-app";
var FileAccessImpl = class _FileAccessImpl {
  static {
    this.FALLBACK_AUTHORITY = VSCODE_AUTHORITY;
  }
  /**
   * Returns a URI to use in contexts where the browser is responsible
   * for loading (e.g. fetch()) or when used within the DOM.
   *
   * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
   */
  asBrowserUri(resourcePath) {
    const uri = this.toUri(resourcePath);
    return this.uriToBrowserUri(uri);
  }
  /**
   * Returns a URI to use in contexts where the browser is responsible
   * for loading (e.g. fetch()) or when used within the DOM.
   *
   * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
   */
  uriToBrowserUri(uri) {
    if (uri.scheme === Schemas.vscodeRemote) {
      return RemoteAuthorities.rewrite(uri);
    }
    if (
      // ...only ever for `file` resources
      uri.scheme === Schemas.file && // ...and we run in native environments
      (isNative || // ...or web worker extensions on desktop
      webWorkerOrigin === `${Schemas.vscodeFileResource}://${_FileAccessImpl.FALLBACK_AUTHORITY}`)
    ) {
      return uri.with({
        scheme: Schemas.vscodeFileResource,
        // We need to provide an authority here so that it can serve
        // as origin for network and loading matters in chromium.
        // If the URI is not coming with an authority already, we
        // add our own
        authority: uri.authority || _FileAccessImpl.FALLBACK_AUTHORITY,
        query: null,
        fragment: null
      });
    }
    return uri;
  }
  /**
   * Returns the `file` URI to use in contexts where node.js
   * is responsible for loading.
   */
  asFileUri(resourcePath) {
    const uri = this.toUri(resourcePath);
    return this.uriToFileUri(uri);
  }
  /**
   * Returns the `file` URI to use in contexts where node.js
   * is responsible for loading.
   */
  uriToFileUri(uri) {
    if (uri.scheme === Schemas.vscodeFileResource) {
      return uri.with({
        scheme: Schemas.file,
        // Only preserve the `authority` if it is different from
        // our fallback authority. This ensures we properly preserve
        // Windows UNC paths that come with their own authority.
        authority: uri.authority !== _FileAccessImpl.FALLBACK_AUTHORITY ? uri.authority : null,
        query: null,
        fragment: null
      });
    }
    return uri;
  }
  toUri(uriOrModule) {
    if (URI.isUri(uriOrModule)) {
      return uriOrModule;
    }
    if (globalThis._VSCODE_FILE_ROOT) {
      const rootUriOrPath = globalThis._VSCODE_FILE_ROOT;
      if (/^\w[\w\d+.-]*:\/\//.test(rootUriOrPath)) {
        return URI.joinPath(URI.parse(rootUriOrPath, true), uriOrModule);
      }
      const modulePath = join(rootUriOrPath, uriOrModule);
      return URI.file(modulePath);
    }
    throw new Error("Cannot determine URI for module id!");
  }
};
var FileAccess = new FileAccessImpl();
var CacheControlheaders = Object.freeze({
  "Cache-Control": "no-cache, no-store"
});
var DocumentPolicyheaders = Object.freeze({
  "Document-Policy": "include-js-call-stacks-in-crash-reports"
});
var COI;
((COI2) => {
  const coiHeaders = /* @__PURE__ */ new Map([
    ["1", { "Cross-Origin-Opener-Policy": "same-origin" }],
    ["2", { "Cross-Origin-Embedder-Policy": "require-corp" }],
    ["3", { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" }]
  ]);
  COI2.CoopAndCoep = Object.freeze(coiHeaders.get("3"));
  const coiSearchParamName = "vscode-coi";
  function getHeadersFromQuery(url) {
    let params;
    if (typeof url === "string") {
      params = new URL(url).searchParams;
    } else if (url instanceof URL) {
      params = url.searchParams;
    } else if (URI.isUri(url)) {
      params = new URL(url.toString(true)).searchParams;
    }
    const value = params?.get(coiSearchParamName);
    if (!value) {
      return void 0;
    }
    return coiHeaders.get(value);
  }
  COI2.getHeadersFromQuery = getHeadersFromQuery;
  function addSearchParam(urlOrSearch, coop, coep) {
    if (!globalThis.crossOriginIsolated) {
      return;
    }
    const value = coop && coep ? "3" : coep ? "2" : "1";
    if (urlOrSearch instanceof URLSearchParams) {
      urlOrSearch.set(coiSearchParamName, value);
    } else {
      urlOrSearch[coiSearchParamName] = value;
    }
  }
  COI2.addSearchParam = addSearchParam;
})(COI || (COI = {}));

// src/vs/base/common/resources.ts
function originalFSPath(uri) {
  return uriToFsPath(uri, true);
}
var ExtUri = class {
  constructor(_ignorePathCasing) {
    this._ignorePathCasing = _ignorePathCasing;
  }
  compare(uri1, uri2, ignoreFragment = false) {
    if (uri1 === uri2) {
      return 0;
    }
    return compare(this.getComparisonKey(uri1, ignoreFragment), this.getComparisonKey(uri2, ignoreFragment));
  }
  isEqual(uri1, uri2, ignoreFragment = false) {
    if (uri1 === uri2) {
      return true;
    }
    if (!uri1 || !uri2) {
      return false;
    }
    return this.getComparisonKey(uri1, ignoreFragment) === this.getComparisonKey(uri2, ignoreFragment);
  }
  getComparisonKey(uri, ignoreFragment = false) {
    return uri.with({
      path: this._ignorePathCasing(uri) ? uri.path.toLowerCase() : void 0,
      fragment: ignoreFragment ? null : void 0
    }).toString();
  }
  ignorePathCasing(uri) {
    return this._ignorePathCasing(uri);
  }
  isEqualOrParent(base, parentCandidate, ignoreFragment = false) {
    if (base.scheme === parentCandidate.scheme) {
      if (base.scheme === Schemas.file) {
        return isEqualOrParent(originalFSPath(base), originalFSPath(parentCandidate), this._ignorePathCasing(base)) && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
      }
      if (isEqualAuthority(base.authority, parentCandidate.authority)) {
        return isEqualOrParent(base.path, parentCandidate.path, this._ignorePathCasing(base), "/") && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
      }
    }
    return false;
  }
  // --- path math
  joinPath(resource, ...pathFragment) {
    return URI.joinPath(resource, ...pathFragment);
  }
  basenameOrAuthority(resource) {
    return basename2(resource) || resource.authority;
  }
  basename(resource) {
    return posix.basename(resource.path);
  }
  extname(resource) {
    return posix.extname(resource.path);
  }
  dirname(resource) {
    if (resource.path.length === 0) {
      return resource;
    }
    let dirname3;
    if (resource.scheme === Schemas.file) {
      dirname3 = URI.file(dirname(originalFSPath(resource))).path;
    } else {
      dirname3 = posix.dirname(resource.path);
      if (resource.authority && dirname3.length && dirname3.charCodeAt(0) !== 47 /* Slash */) {
        console.error(`dirname("${resource.toString})) resulted in a relative path`);
        dirname3 = "/";
      }
    }
    return resource.with({
      path: dirname3
    });
  }
  normalizePath(resource) {
    if (!resource.path.length) {
      return resource;
    }
    let normalizedPath;
    if (resource.scheme === Schemas.file) {
      normalizedPath = URI.file(normalize(originalFSPath(resource))).path;
    } else {
      normalizedPath = posix.normalize(resource.path);
    }
    return resource.with({
      path: normalizedPath
    });
  }
  relativePath(from, to) {
    if (from.scheme !== to.scheme || !isEqualAuthority(from.authority, to.authority)) {
      return void 0;
    }
    if (from.scheme === Schemas.file) {
      const relativePath2 = relative(originalFSPath(from), originalFSPath(to));
      return isWindows ? toSlashes(relativePath2) : relativePath2;
    }
    let fromPath = from.path || "/";
    const toPath = to.path || "/";
    if (this._ignorePathCasing(from)) {
      let i = 0;
      for (const len = Math.min(fromPath.length, toPath.length); i < len; i++) {
        if (fromPath.charCodeAt(i) !== toPath.charCodeAt(i)) {
          if (fromPath.charAt(i).toLowerCase() !== toPath.charAt(i).toLowerCase()) {
            break;
          }
        }
      }
      fromPath = toPath.substr(0, i) + fromPath.substr(i);
    }
    return posix.relative(fromPath, toPath);
  }
  resolvePath(base, path) {
    if (base.scheme === Schemas.file) {
      const newURI = URI.file(resolve(originalFSPath(base), path));
      return base.with({
        authority: newURI.authority,
        path: newURI.path
      });
    }
    path = toPosixPath(path);
    return base.with({
      path: posix.resolve(base.path, path)
    });
  }
  // --- misc
  isAbsolutePath(resource) {
    return !!resource.path && resource.path[0] === "/";
  }
  isEqualAuthority(a1, a2) {
    return a1 === a2 || a1 !== void 0 && a2 !== void 0 && equalsIgnoreCase(a1, a2);
  }
  hasTrailingPathSeparator(resource, sep2 = sep) {
    if (resource.scheme === Schemas.file) {
      const fsp = originalFSPath(resource);
      return fsp.length > getRoot(fsp).length && fsp[fsp.length - 1] === sep2;
    } else {
      const p = resource.path;
      return p.length > 1 && p.charCodeAt(p.length - 1) === 47 /* Slash */ && !/^[a-zA-Z]:(\/$|\\$)/.test(resource.fsPath);
    }
  }
  removeTrailingPathSeparator(resource, sep2 = sep) {
    if (hasTrailingPathSeparator(resource, sep2)) {
      return resource.with({ path: resource.path.substr(0, resource.path.length - 1) });
    }
    return resource;
  }
  addTrailingPathSeparator(resource, sep2 = sep) {
    let isRootSep = false;
    if (resource.scheme === Schemas.file) {
      const fsp = originalFSPath(resource);
      isRootSep = fsp !== void 0 && fsp.length === getRoot(fsp).length && fsp[fsp.length - 1] === sep2;
    } else {
      sep2 = "/";
      const p = resource.path;
      isRootSep = p.length === 1 && p.charCodeAt(p.length - 1) === 47 /* Slash */;
    }
    if (!isRootSep && !hasTrailingPathSeparator(resource, sep2)) {
      return resource.with({ path: resource.path + "/" });
    }
    return resource;
  }
};
var extUri = new ExtUri(() => false);
var extUriBiasedIgnorePathCase = new ExtUri((uri) => {
  return uri.scheme === Schemas.file ? !isLinux : true;
});
var extUriIgnorePathCase = new ExtUri((_) => true);
var isEqual = extUri.isEqual.bind(extUri);
var isEqualOrParent2 = extUri.isEqualOrParent.bind(extUri);
var getComparisonKey = extUri.getComparisonKey.bind(extUri);
var basenameOrAuthority = extUri.basenameOrAuthority.bind(extUri);
var basename2 = extUri.basename.bind(extUri);
var extname2 = extUri.extname.bind(extUri);
var dirname2 = extUri.dirname.bind(extUri);
var joinPath = extUri.joinPath.bind(extUri);
var normalizePath = extUri.normalizePath.bind(extUri);
var relativePath = extUri.relativePath.bind(extUri);
var resolvePath = extUri.resolvePath.bind(extUri);
var isAbsolutePath = extUri.isAbsolutePath.bind(extUri);
var isEqualAuthority = extUri.isEqualAuthority.bind(extUri);
var hasTrailingPathSeparator = extUri.hasTrailingPathSeparator.bind(extUri);
var removeTrailingPathSeparator = extUri.removeTrailingPathSeparator.bind(extUri);
var addTrailingPathSeparator = extUri.addTrailingPathSeparator.bind(extUri);
var DataUri;
((DataUri2) => {
  DataUri2.META_DATA_LABEL = "label";
  DataUri2.META_DATA_DESCRIPTION = "description";
  DataUri2.META_DATA_SIZE = "size";
  DataUri2.META_DATA_MIME = "mime";
  function parseMetaData(dataUri) {
    const metadata = /* @__PURE__ */ new Map();
    const meta = dataUri.path.substring(dataUri.path.indexOf(";") + 1, dataUri.path.lastIndexOf(";"));
    meta.split(";").forEach((property) => {
      const [key, value] = property.split(":");
      if (key && value) {
        metadata.set(key, value);
      }
    });
    const mime = dataUri.path.substring(0, dataUri.path.indexOf(";"));
    if (mime) {
      metadata.set(DataUri2.META_DATA_MIME, mime);
    }
    return metadata;
  }
  DataUri2.parseMetaData = parseMetaData;
})(DataUri || (DataUri = {}));

// src/vs/base/common/async.ts
function createCancelablePromise(callback) {
  const source = new CancellationTokenSource();
  const thenable = callback(source.token);
  let isCancelled = false;
  const promise = new Promise((resolve3, reject) => {
    const subscription = source.token.onCancellationRequested(() => {
      isCancelled = true;
      subscription.dispose();
      reject(new CancellationError());
    });
    Promise.resolve(thenable).then((value) => {
      subscription.dispose();
      source.dispose();
      if (!isCancelled) {
        resolve3(value);
      } else if (isDisposable(value)) {
        value.dispose();
      }
    }, (err) => {
      subscription.dispose();
      source.dispose();
      reject(err);
    });
  });
  return new class {
    cancel() {
      source.cancel();
      source.dispose();
    }
    then(resolve3, reject) {
      return promise.then(resolve3, reject);
    }
    catch(reject) {
      return this.then(void 0, reject);
    }
    finally(onfinally) {
      return promise.finally(onfinally);
    }
  }();
}
function timeout(millis, token) {
  if (!token) {
    return createCancelablePromise((token2) => timeout(millis, token2));
  }
  return new Promise((resolve3, reject) => {
    const handle = setTimeout(() => {
      disposable.dispose();
      resolve3();
    }, millis);
    const disposable = token.onCancellationRequested(() => {
      clearTimeout(handle);
      disposable.dispose();
      reject(new CancellationError());
    });
  });
}
var Limiter = class {
  constructor(maxDegreeOfParalellism) {
    this._size = 0;
    this._isDisposed = false;
    this.maxDegreeOfParalellism = maxDegreeOfParalellism;
    this.outstandingPromises = [];
    this.runningPromises = 0;
    this._onDrained = new Emitter();
  }
  /**
   *
   * @returns A promise that resolved when all work is done (onDrained) or when
   * there is nothing to do
   */
  whenIdle() {
    return this.size > 0 ? Event.toPromise(this.onDrained) : Promise.resolve();
  }
  get onDrained() {
    return this._onDrained.event;
  }
  get size() {
    return this._size;
  }
  queue(factory) {
    if (this._isDisposed) {
      throw new Error("Object has been disposed");
    }
    this._size++;
    return new Promise((c, e) => {
      this.outstandingPromises.push({ factory, c, e });
      this.consume();
    });
  }
  consume() {
    while (this.outstandingPromises.length && this.runningPromises < this.maxDegreeOfParalellism) {
      const iLimitedTask = this.outstandingPromises.shift();
      this.runningPromises++;
      const promise = iLimitedTask.factory();
      promise.then(iLimitedTask.c, iLimitedTask.e);
      promise.then(() => this.consumed(), () => this.consumed());
    }
  }
  consumed() {
    if (this._isDisposed) {
      return;
    }
    this.runningPromises--;
    if (--this._size === 0) {
      this._onDrained.fire();
    }
    if (this.outstandingPromises.length > 0) {
      this.consume();
    }
  }
  clear() {
    if (this._isDisposed) {
      throw new Error("Object has been disposed");
    }
    this.outstandingPromises.length = 0;
    this._size = this.runningPromises;
  }
  dispose() {
    this._isDisposed = true;
    this.outstandingPromises.length = 0;
    this._size = 0;
    this._onDrained.dispose();
  }
};
var Queue = class extends Limiter {
  constructor() {
    super(1);
  }
};
var ResourceQueue = class {
  constructor() {
    this.queues = /* @__PURE__ */ new Map();
    this.drainers = /* @__PURE__ */ new Set();
    this.drainListeners = void 0;
    this.drainListenerCount = 0;
  }
  async whenDrained() {
    if (this.isDrained()) {
      return;
    }
    const promise = new DeferredPromise();
    this.drainers.add(promise);
    return promise.p;
  }
  isDrained() {
    for (const [, queue] of this.queues) {
      if (queue.size > 0) {
        return false;
      }
    }
    return true;
  }
  queueSize(resource, extUri2 = extUri) {
    const key = extUri2.getComparisonKey(resource);
    return this.queues.get(key)?.size ?? 0;
  }
  queueFor(resource, factory, extUri2 = extUri) {
    const key = extUri2.getComparisonKey(resource);
    let queue = this.queues.get(key);
    if (!queue) {
      queue = new Queue();
      const drainListenerId = this.drainListenerCount++;
      const drainListener = Event.once(queue.onDrained)(() => {
        queue?.dispose();
        this.queues.delete(key);
        this.onDidQueueDrain();
        this.drainListeners?.deleteAndDispose(drainListenerId);
        if (this.drainListeners?.size === 0) {
          this.drainListeners.dispose();
          this.drainListeners = void 0;
        }
      });
      if (!this.drainListeners) {
        this.drainListeners = new DisposableMap();
      }
      this.drainListeners.set(drainListenerId, drainListener);
      this.queues.set(key, queue);
    }
    return queue.queue(factory);
  }
  onDidQueueDrain() {
    if (!this.isDrained()) {
      return;
    }
    this.releaseDrainers();
  }
  releaseDrainers() {
    for (const drainer of this.drainers) {
      drainer.complete();
    }
    this.drainers.clear();
  }
  dispose() {
    for (const [, queue] of this.queues) {
      queue.dispose();
    }
    this.queues.clear();
    this.releaseDrainers();
    this.drainListeners?.dispose();
  }
};
var runWhenGlobalIdle;
var _runWhenIdle;
(function() {
  const safeGlobal = globalThis;
  if (typeof safeGlobal.requestIdleCallback !== "function" || typeof safeGlobal.cancelIdleCallback !== "function") {
    _runWhenIdle = (_targetWindow, runner, timeout2) => {
      setTimeout0(() => {
        if (disposed) {
          return;
        }
        const end = Date.now() + 15;
        const deadline = {
          didTimeout: true,
          timeRemaining() {
            return Math.max(0, end - Date.now());
          }
        };
        runner(Object.freeze(deadline));
      });
      let disposed = false;
      return {
        dispose() {
          if (disposed) {
            return;
          }
          disposed = true;
        }
      };
    };
  } else {
    _runWhenIdle = (targetWindow, runner, timeout2) => {
      const handle = targetWindow.requestIdleCallback(runner, typeof timeout2 === "number" ? { timeout: timeout2 } : void 0);
      let disposed = false;
      return {
        dispose() {
          if (disposed) {
            return;
          }
          disposed = true;
          targetWindow.cancelIdleCallback(handle);
        }
      };
    };
  }
  runWhenGlobalIdle = (runner, timeout2) => _runWhenIdle(globalThis, runner, timeout2);
})();
var DeferredPromise = class _DeferredPromise {
  static fromPromise(promise) {
    const deferred = new _DeferredPromise();
    deferred.settleWith(promise);
    return deferred;
  }
  get isRejected() {
    return this.outcome?.outcome === 1 /* Rejected */;
  }
  get isResolved() {
    return this.outcome?.outcome === 0 /* Resolved */;
  }
  get isSettled() {
    return !!this.outcome;
  }
  get value() {
    return this.outcome?.outcome === 0 /* Resolved */ ? this.outcome?.value : void 0;
  }
  constructor() {
    this.p = new Promise((c, e) => {
      this.completeCallback = c;
      this.errorCallback = e;
    });
  }
  complete(value) {
    if (this.isSettled) {
      return Promise.resolve();
    }
    return new Promise((resolve3) => {
      this.completeCallback(value);
      this.outcome = { outcome: 0 /* Resolved */, value };
      resolve3();
    });
  }
  error(err) {
    if (this.isSettled) {
      return Promise.resolve();
    }
    return new Promise((resolve3) => {
      this.errorCallback(err);
      this.outcome = { outcome: 1 /* Rejected */, value: err };
      resolve3();
    });
  }
  settleWith(promise) {
    return promise.then(
      (value) => this.complete(value),
      (error) => this.error(error)
    );
  }
  cancel() {
    return this.error(new CancellationError());
  }
};
var Promises;
((Promises3) => {
  async function settled(promises3) {
    let firstError = void 0;
    const result = await Promise.all(promises3.map((promise) => promise.then((value) => value, (error) => {
      if (!firstError) {
        firstError = error;
      }
      return void 0;
    })));
    if (typeof firstError !== "undefined") {
      throw firstError;
    }
    return result;
  }
  Promises3.settled = settled;
  function withAsyncBody(bodyFn) {
    return new Promise(async (resolve3, reject) => {
      try {
        await bodyFn(resolve3, reject);
      } catch (error) {
        reject(error);
      }
    });
  }
  Promises3.withAsyncBody = withAsyncBody;
})(Promises || (Promises = {}));
var AsyncIterableObject = class _AsyncIterableObject {
  static fromArray(items) {
    return new _AsyncIterableObject((writer) => {
      writer.emitMany(items);
    });
  }
  static fromPromise(promise) {
    return new _AsyncIterableObject(async (emitter) => {
      emitter.emitMany(await promise);
    });
  }
  static fromPromisesResolveOrder(promises3) {
    return new _AsyncIterableObject(async (emitter) => {
      await Promise.all(promises3.map(async (p) => emitter.emitOne(await p)));
    });
  }
  static merge(iterables) {
    return new _AsyncIterableObject(async (emitter) => {
      await Promise.all(iterables.map(async (iterable) => {
        for await (const item of iterable) {
          emitter.emitOne(item);
        }
      }));
    });
  }
  static {
    this.EMPTY = _AsyncIterableObject.fromArray([]);
  }
  constructor(executor, onReturn) {
    this._state = 0 /* Initial */;
    this._results = [];
    this._error = null;
    this._onReturn = onReturn;
    this._onStateChanged = new Emitter();
    queueMicrotask(async () => {
      const writer = {
        emitOne: (item) => this.emitOne(item),
        emitMany: (items) => this.emitMany(items),
        reject: (error) => this.reject(error)
      };
      try {
        await Promise.resolve(executor(writer));
        this.resolve();
      } catch (err) {
        this.reject(err);
      } finally {
        writer.emitOne = void 0;
        writer.emitMany = void 0;
        writer.reject = void 0;
      }
    });
  }
  [Symbol.asyncIterator]() {
    let i = 0;
    return {
      next: async () => {
        do {
          if (this._state === 2 /* DoneError */) {
            throw this._error;
          }
          if (i < this._results.length) {
            return { done: false, value: this._results[i++] };
          }
          if (this._state === 1 /* DoneOK */) {
            return { done: true, value: void 0 };
          }
          await Event.toPromise(this._onStateChanged.event);
        } while (true);
      },
      return: async () => {
        this._onReturn?.();
        return { done: true, value: void 0 };
      }
    };
  }
  static map(iterable, mapFn) {
    return new _AsyncIterableObject(async (emitter) => {
      for await (const item of iterable) {
        emitter.emitOne(mapFn(item));
      }
    });
  }
  map(mapFn) {
    return _AsyncIterableObject.map(this, mapFn);
  }
  static filter(iterable, filterFn) {
    return new _AsyncIterableObject(async (emitter) => {
      for await (const item of iterable) {
        if (filterFn(item)) {
          emitter.emitOne(item);
        }
      }
    });
  }
  filter(filterFn) {
    return _AsyncIterableObject.filter(this, filterFn);
  }
  static coalesce(iterable) {
    return _AsyncIterableObject.filter(iterable, (item) => !!item);
  }
  coalesce() {
    return _AsyncIterableObject.coalesce(this);
  }
  static async toPromise(iterable) {
    const result = [];
    for await (const item of iterable) {
      result.push(item);
    }
    return result;
  }
  toPromise() {
    return _AsyncIterableObject.toPromise(this);
  }
  /**
   * The value will be appended at the end.
   *
   * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
   */
  emitOne(value) {
    if (this._state !== 0 /* Initial */) {
      return;
    }
    this._results.push(value);
    this._onStateChanged.fire();
  }
  /**
   * The values will be appended at the end.
   *
   * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
   */
  emitMany(values) {
    if (this._state !== 0 /* Initial */) {
      return;
    }
    this._results = this._results.concat(values);
    this._onStateChanged.fire();
  }
  /**
   * Calling `resolve()` will mark the result array as complete.
   *
   * **NOTE** `resolve()` must be called, otherwise all consumers of this iterable will hang indefinitely, similar to a non-resolved promise.
   * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
   */
  resolve() {
    if (this._state !== 0 /* Initial */) {
      return;
    }
    this._state = 1 /* DoneOK */;
    this._onStateChanged.fire();
  }
  /**
   * Writing an error will permanently invalidate this iterable.
   * The current users will receive an error thrown, as will all future users.
   *
   * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
   */
  reject(error) {
    if (this._state !== 0 /* Initial */) {
      return;
    }
    this._state = 2 /* DoneError */;
    this._error = error;
    this._onStateChanged.fire();
  }
};
var ProducerConsumer = class {
  constructor() {
    this._unsatisfiedConsumers = [];
    this._unconsumedValues = [];
  }
  get hasFinalValue() {
    return !!this._finalValue;
  }
  produce(value) {
    this._ensureNoFinalValue();
    if (this._unsatisfiedConsumers.length > 0) {
      const deferred = this._unsatisfiedConsumers.shift();
      this._resolveOrRejectDeferred(deferred, value);
    } else {
      this._unconsumedValues.push(value);
    }
  }
  produceFinal(value) {
    this._ensureNoFinalValue();
    this._finalValue = value;
    for (const deferred of this._unsatisfiedConsumers) {
      this._resolveOrRejectDeferred(deferred, value);
    }
    this._unsatisfiedConsumers.length = 0;
  }
  _ensureNoFinalValue() {
    if (this._finalValue) {
      throw new BugIndicatingError("ProducerConsumer: cannot produce after final value has been set");
    }
  }
  _resolveOrRejectDeferred(deferred, value) {
    if (value.ok) {
      deferred.complete(value.value);
    } else {
      deferred.error(value.error);
    }
  }
  consume() {
    if (this._unconsumedValues.length > 0 || this._finalValue) {
      const value = this._unconsumedValues.length > 0 ? this._unconsumedValues.shift() : this._finalValue;
      if (value.ok) {
        return Promise.resolve(value.value);
      } else {
        return Promise.reject(value.error);
      }
    } else {
      const deferred = new DeferredPromise();
      this._unsatisfiedConsumers.push(deferred);
      return deferred.p;
    }
  }
};
var AsyncIterableProducer = class _AsyncIterableProducer {
  constructor(executor, _onReturn) {
    this._onReturn = _onReturn;
    this._producerConsumer = new ProducerConsumer();
    this._iterator = {
      next: () => this._producerConsumer.consume(),
      return: () => {
        this._onReturn?.();
        return Promise.resolve({ done: true, value: void 0 });
      },
      throw: async (e) => {
        this._finishError(e);
        return { done: true, value: void 0 };
      }
    };
    queueMicrotask(async () => {
      const p = executor({
        emitOne: (value) => this._producerConsumer.produce({ ok: true, value: { done: false, value } }),
        emitMany: (values) => {
          for (const value of values) {
            this._producerConsumer.produce({ ok: true, value: { done: false, value } });
          }
        },
        reject: (error) => this._finishError(error)
      });
      if (!this._producerConsumer.hasFinalValue) {
        try {
          await p;
          this._finishOk();
        } catch (error) {
          this._finishError(error);
        }
      }
    });
  }
  static fromArray(items) {
    return new _AsyncIterableProducer((writer) => {
      writer.emitMany(items);
    });
  }
  static fromPromise(promise) {
    return new _AsyncIterableProducer(async (emitter) => {
      emitter.emitMany(await promise);
    });
  }
  static fromPromisesResolveOrder(promises3) {
    return new _AsyncIterableProducer(async (emitter) => {
      await Promise.all(promises3.map(async (p) => emitter.emitOne(await p)));
    });
  }
  static merge(iterables) {
    return new _AsyncIterableProducer(async (emitter) => {
      await Promise.all(iterables.map(async (iterable) => {
        for await (const item of iterable) {
          emitter.emitOne(item);
        }
      }));
    });
  }
  static {
    this.EMPTY = _AsyncIterableProducer.fromArray([]);
  }
  static map(iterable, mapFn) {
    return new _AsyncIterableProducer(async (emitter) => {
      for await (const item of iterable) {
        emitter.emitOne(mapFn(item));
      }
    });
  }
  static tee(iterable) {
    let emitter1;
    let emitter2;
    const defer = new DeferredPromise();
    const start = async () => {
      if (!emitter1 || !emitter2) {
        return;
      }
      try {
        for await (const item of iterable) {
          emitter1.emitOne(item);
          emitter2.emitOne(item);
        }
      } catch (err) {
        emitter1.reject(err);
        emitter2.reject(err);
      } finally {
        defer.complete();
      }
    };
    const p1 = new _AsyncIterableProducer(async (emitter) => {
      emitter1 = emitter;
      start();
      return defer.p;
    });
    const p2 = new _AsyncIterableProducer(async (emitter) => {
      emitter2 = emitter;
      start();
      return defer.p;
    });
    return [p1, p2];
  }
  map(mapFn) {
    return _AsyncIterableProducer.map(this, mapFn);
  }
  static coalesce(iterable) {
    return _AsyncIterableProducer.filter(iterable, (item) => !!item);
  }
  coalesce() {
    return _AsyncIterableProducer.coalesce(this);
  }
  static filter(iterable, filterFn) {
    return new _AsyncIterableProducer(async (emitter) => {
      for await (const item of iterable) {
        if (filterFn(item)) {
          emitter.emitOne(item);
        }
      }
    });
  }
  filter(filterFn) {
    return _AsyncIterableProducer.filter(this, filterFn);
  }
  _finishOk() {
    if (!this._producerConsumer.hasFinalValue) {
      this._producerConsumer.produceFinal({ ok: true, value: { done: true, value: void 0 } });
    }
  }
  _finishError(error) {
    if (!this._producerConsumer.hasFinalValue) {
      this._producerConsumer.produceFinal({ ok: false, error });
    }
  }
  [Symbol.asyncIterator]() {
    return this._iterator;
  }
};

// src/vs/base/common/buffer.ts
var hasBuffer = typeof Buffer !== "undefined";
var indexOfTable = new Lazy(() => new Uint8Array(256));
var textEncoder;
var textDecoder;
var VSBuffer = class _VSBuffer {
  /**
   * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
   * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
   */
  static alloc(byteLength) {
    if (hasBuffer) {
      return new _VSBuffer(Buffer.allocUnsafe(byteLength));
    } else {
      return new _VSBuffer(new Uint8Array(byteLength));
    }
  }
  /**
   * When running in a nodejs context, if `actual` is not a nodejs Buffer, the backing store for
   * the returned `VSBuffer` instance might use a nodejs Buffer allocated from node's Buffer pool,
   * which is not transferrable.
   */
  static wrap(actual) {
    if (hasBuffer && !Buffer.isBuffer(actual)) {
      actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
    }
    return new _VSBuffer(actual);
  }
  /**
   * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
   * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
   */
  static fromString(source, options) {
    const dontUseNodeBuffer = options?.dontUseNodeBuffer || false;
    if (!dontUseNodeBuffer && hasBuffer) {
      return new _VSBuffer(Buffer.from(source));
    } else {
      if (!textEncoder) {
        textEncoder = new TextEncoder();
      }
      return new _VSBuffer(textEncoder.encode(source));
    }
  }
  /**
   * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
   * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
   */
  static fromByteArray(source) {
    const result = _VSBuffer.alloc(source.length);
    for (let i = 0, len = source.length; i < len; i++) {
      result.buffer[i] = source[i];
    }
    return result;
  }
  /**
   * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
   * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
   */
  static concat(buffers, totalLength) {
    if (typeof totalLength === "undefined") {
      totalLength = 0;
      for (let i = 0, len = buffers.length; i < len; i++) {
        totalLength += buffers[i].byteLength;
      }
    }
    const ret = _VSBuffer.alloc(totalLength);
    let offset = 0;
    for (let i = 0, len = buffers.length; i < len; i++) {
      const element = buffers[i];
      ret.set(element, offset);
      offset += element.byteLength;
    }
    return ret;
  }
  static isNativeBuffer(buffer) {
    return hasBuffer && Buffer.isBuffer(buffer);
  }
  constructor(buffer) {
    this.buffer = buffer;
    this.byteLength = this.buffer.byteLength;
  }
  /**
   * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
   * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
   */
  clone() {
    const result = _VSBuffer.alloc(this.byteLength);
    result.set(this);
    return result;
  }
  toString() {
    if (hasBuffer) {
      return this.buffer.toString();
    } else {
      if (!textDecoder) {
        textDecoder = new TextDecoder(void 0, { ignoreBOM: true });
      }
      return textDecoder.decode(this.buffer);
    }
  }
  slice(start, end) {
    return new _VSBuffer(this.buffer.subarray(start, end));
  }
  set(array, offset) {
    if (array instanceof _VSBuffer) {
      this.buffer.set(array.buffer, offset);
    } else if (array instanceof Uint8Array) {
      this.buffer.set(array, offset);
    } else if (array instanceof ArrayBuffer) {
      this.buffer.set(new Uint8Array(array), offset);
    } else if (ArrayBuffer.isView(array)) {
      this.buffer.set(new Uint8Array(array.buffer, array.byteOffset, array.byteLength), offset);
    } else {
      throw new Error(`Unknown argument 'array'`);
    }
  }
  readUInt32BE(offset) {
    return readUInt32BE(this.buffer, offset);
  }
  writeUInt32BE(value, offset) {
    writeUInt32BE(this.buffer, value, offset);
  }
  readUInt32LE(offset) {
    return readUInt32LE(this.buffer, offset);
  }
  writeUInt32LE(value, offset) {
    writeUInt32LE(this.buffer, value, offset);
  }
  readUInt8(offset) {
    return readUInt8(this.buffer, offset);
  }
  writeUInt8(value, offset) {
    writeUInt8(this.buffer, value, offset);
  }
  indexOf(subarray, offset = 0) {
    return binaryIndexOf(this.buffer, subarray instanceof _VSBuffer ? subarray.buffer : subarray, offset);
  }
  equals(other) {
    if (this === other) {
      return true;
    }
    if (this.byteLength !== other.byteLength) {
      return false;
    }
    return this.buffer.every((value, index) => value === other.buffer[index]);
  }
};
function binaryIndexOf(haystack, needle, offset = 0) {
  const needleLen = needle.byteLength;
  const haystackLen = haystack.byteLength;
  if (needleLen === 0) {
    return 0;
  }
  if (needleLen === 1) {
    return haystack.indexOf(needle[0], offset);
  }
  if (needleLen > haystackLen - offset) {
    return -1;
  }
  const table = indexOfTable.value;
  table.fill(needle.length);
  for (let i2 = 0; i2 < needle.length; i2++) {
    table[needle[i2]] = needle.length - i2 - 1;
  }
  let i = offset + needle.length - 1;
  let j = i;
  let result = -1;
  while (i < haystackLen) {
    if (haystack[i] === needle[j]) {
      if (j === 0) {
        result = i;
        break;
      }
      i--;
      j--;
    } else {
      i += Math.max(needle.length - j, table[haystack[i]]);
      j = needle.length - 1;
    }
  }
  return result;
}
function readUInt32BE(source, offset) {
  return source[offset] * 2 ** 24 + source[offset + 1] * 2 ** 16 + source[offset + 2] * 2 ** 8 + source[offset + 3];
}
function writeUInt32BE(destination, value, offset) {
  destination[offset + 3] = value;
  value = value >>> 8;
  destination[offset + 2] = value;
  value = value >>> 8;
  destination[offset + 1] = value;
  value = value >>> 8;
  destination[offset] = value;
}
function readUInt32LE(source, offset) {
  return source[offset + 0] << 0 >>> 0 | source[offset + 1] << 8 >>> 0 | source[offset + 2] << 16 >>> 0 | source[offset + 3] << 24 >>> 0;
}
function writeUInt32LE(destination, value, offset) {
  destination[offset + 0] = value & 255;
  value = value >>> 8;
  destination[offset + 1] = value & 255;
  value = value >>> 8;
  destination[offset + 2] = value & 255;
  value = value >>> 8;
  destination[offset + 3] = value & 255;
}
function readUInt8(source, offset) {
  return source[offset];
}
function writeUInt8(destination, value, offset) {
  destination[offset] = value;
}
var hexChars = "0123456789abcdef";
function encodeHex({ buffer }) {
  let result = "";
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    result += hexChars[byte >>> 4];
    result += hexChars[byte & 15];
  }
  return result;
}

// src/vs/base/common/decorators.ts
function memoize(_target, key, descriptor) {
  let fnKey = null;
  let fn = null;
  if (typeof descriptor.value === "function") {
    fnKey = "value";
    fn = descriptor.value;
    if (fn.length !== 0) {
      console.warn("Memoize should only be used in functions with zero parameters");
    }
  } else if (typeof descriptor.get === "function") {
    fnKey = "get";
    fn = descriptor.get;
  }
  if (!fn) {
    throw new Error("not supported");
  }
  const memoizeKey = `$memoize$${key}`;
  descriptor[fnKey] = function(...args) {
    if (!this.hasOwnProperty(memoizeKey)) {
      Object.defineProperty(this, memoizeKey, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: fn.apply(this, args)
      });
    }
    return this[memoizeKey];
  };
}

// src/vs/base/common/marshalling.ts
function revive(obj, depth = 0) {
  if (!obj || depth > 200) {
    return obj;
  }
  if (typeof obj === "object") {
    switch (obj.$mid) {
      // eslint-disable-next-line local/code-no-any-casts
      case 1 /* Uri */:
        return URI.revive(obj);
      // eslint-disable-next-line local/code-no-any-casts
      case 2 /* Regexp */:
        return new RegExp(obj.source, obj.flags);
      // eslint-disable-next-line local/code-no-any-casts
      case 17 /* Date */:
        return new Date(obj.source);
    }
    if (obj instanceof VSBuffer || obj instanceof Uint8Array) {
      return obj;
    }
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; ++i) {
        obj[i] = revive(obj[i], depth + 1);
      }
    } else {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          obj[key] = revive(obj[key], depth + 1);
        }
      }
    }
  }
  return obj;
}

// src/vs/base/parts/ipc/common/ipc.ts
function requestTypeToStr(type) {
  switch (type) {
    case 100 /* Promise */:
      return "req";
    case 101 /* PromiseCancel */:
      return "cancel";
    case 102 /* EventListen */:
      return "subscribe";
    case 103 /* EventDispose */:
      return "unsubscribe";
  }
}
function responseTypeToStr(type) {
  switch (type) {
    case 200 /* Initialize */:
      return `init`;
    case 201 /* PromiseSuccess */:
      return `reply:`;
    case 202 /* PromiseError */:
    case 203 /* PromiseErrorObj */:
      return `replyErr:`;
    case 204 /* EventFire */:
      return `event:`;
  }
}
function readIntVQL(reader) {
  let value = 0;
  for (let n = 0; ; n += 7) {
    const next = reader.read(1);
    value |= (next.buffer[0] & 127) << n;
    if (!(next.buffer[0] & 128)) {
      return value;
    }
  }
}
var vqlZero = createOneByteBuffer(0);
function writeInt32VQL(writer, value) {
  if (value === 0) {
    writer.write(vqlZero);
    return;
  }
  let len = 0;
  for (let v2 = value; v2 !== 0; v2 = v2 >>> 7) {
    len++;
  }
  const scratch = VSBuffer.alloc(len);
  for (let i = 0; value !== 0; i++) {
    scratch.buffer[i] = value & 127;
    value = value >>> 7;
    if (value > 0) {
      scratch.buffer[i] |= 128;
    }
  }
  writer.write(scratch);
}
var BufferReader = class {
  constructor(buffer) {
    this.buffer = buffer;
    this.pos = 0;
  }
  read(bytes) {
    const result = this.buffer.slice(this.pos, this.pos + bytes);
    this.pos += result.byteLength;
    return result;
  }
};
var BufferWriter = class {
  constructor() {
    this.buffers = [];
  }
  get buffer() {
    return VSBuffer.concat(this.buffers);
  }
  write(buffer) {
    this.buffers.push(buffer);
  }
};
function createOneByteBuffer(value) {
  const result = VSBuffer.alloc(1);
  result.writeUInt8(value, 0);
  return result;
}
var BufferPresets = {
  Undefined: createOneByteBuffer(0 /* Undefined */),
  String: createOneByteBuffer(1 /* String */),
  Buffer: createOneByteBuffer(2 /* Buffer */),
  VSBuffer: createOneByteBuffer(3 /* VSBuffer */),
  Array: createOneByteBuffer(4 /* Array */),
  Object: createOneByteBuffer(5 /* Object */),
  Uint: createOneByteBuffer(6 /* Int */)
};
function serialize(writer, data) {
  if (typeof data === "undefined") {
    writer.write(BufferPresets.Undefined);
  } else if (typeof data === "string") {
    const buffer = VSBuffer.fromString(data);
    writer.write(BufferPresets.String);
    writeInt32VQL(writer, buffer.byteLength);
    writer.write(buffer);
  } else if (VSBuffer.isNativeBuffer(data)) {
    const buffer = VSBuffer.wrap(data);
    writer.write(BufferPresets.Buffer);
    writeInt32VQL(writer, buffer.byteLength);
    writer.write(buffer);
  } else if (data instanceof VSBuffer) {
    writer.write(BufferPresets.VSBuffer);
    writeInt32VQL(writer, data.byteLength);
    writer.write(data);
  } else if (Array.isArray(data)) {
    writer.write(BufferPresets.Array);
    writeInt32VQL(writer, data.length);
    for (const el of data) {
      serialize(writer, el);
    }
  } else if (typeof data === "number" && (data | 0) === data) {
    writer.write(BufferPresets.Uint);
    writeInt32VQL(writer, data);
  } else {
    const buffer = VSBuffer.fromString(JSON.stringify(data));
    writer.write(BufferPresets.Object);
    writeInt32VQL(writer, buffer.byteLength);
    writer.write(buffer);
  }
}
function deserialize(reader) {
  const type = reader.read(1).readUInt8(0);
  switch (type) {
    case 0 /* Undefined */:
      return void 0;
    case 1 /* String */:
      return reader.read(readIntVQL(reader)).toString();
    case 2 /* Buffer */:
      return reader.read(readIntVQL(reader)).buffer;
    case 3 /* VSBuffer */:
      return reader.read(readIntVQL(reader));
    case 4 /* Array */: {
      const length = readIntVQL(reader);
      const result = [];
      for (let i = 0; i < length; i++) {
        result.push(deserialize(reader));
      }
      return result;
    }
    case 5 /* Object */:
      return JSON.parse(reader.read(readIntVQL(reader)).toString());
    case 6 /* Int */:
      return readIntVQL(reader);
  }
}
var ChannelServer = class {
  constructor(protocol, ctx, logger = null, timeoutDelay = 1e3) {
    this.protocol = protocol;
    this.ctx = ctx;
    this.logger = logger;
    this.timeoutDelay = timeoutDelay;
    this.channels = /* @__PURE__ */ new Map();
    this.activeRequests = /* @__PURE__ */ new Map();
    // Requests might come in for channels which are not yet registered.
    // They will timeout after `timeoutDelay`.
    this.pendingRequests = /* @__PURE__ */ new Map();
    this.protocolListener = this.protocol.onMessage((msg) => this.onRawMessage(msg));
    this.sendResponse({ type: 200 /* Initialize */ });
  }
  registerChannel(channelName, channel) {
    this.channels.set(channelName, channel);
    setTimeout(() => this.flushPendingRequests(channelName), 0);
  }
  sendResponse(response) {
    switch (response.type) {
      case 200 /* Initialize */: {
        const msgLength = this.send([response.type]);
        this.logger?.logOutgoing(msgLength, 0, 1 /* OtherSide */, responseTypeToStr(response.type));
        return;
      }
      case 201 /* PromiseSuccess */:
      case 202 /* PromiseError */:
      case 204 /* EventFire */:
      case 203 /* PromiseErrorObj */: {
        const msgLength = this.send([response.type, response.id], response.data);
        this.logger?.logOutgoing(msgLength, response.id, 1 /* OtherSide */, responseTypeToStr(response.type), response.data);
        return;
      }
    }
  }
  send(header, body = void 0) {
    const writer = new BufferWriter();
    serialize(writer, header);
    serialize(writer, body);
    return this.sendBuffer(writer.buffer);
  }
  sendBuffer(message) {
    try {
      this.protocol.send(message);
      return message.byteLength;
    } catch (err) {
      return 0;
    }
  }
  onRawMessage(message) {
    const reader = new BufferReader(message);
    const header = deserialize(reader);
    const body = deserialize(reader);
    const type = header[0];
    switch (type) {
      case 100 /* Promise */:
        this.logger?.logIncoming(message.byteLength, header[1], 1 /* OtherSide */, `${requestTypeToStr(type)}: ${header[2]}.${header[3]}`, body);
        return this.onPromise({ type, id: header[1], channelName: header[2], name: header[3], arg: body });
      case 102 /* EventListen */:
        this.logger?.logIncoming(message.byteLength, header[1], 1 /* OtherSide */, `${requestTypeToStr(type)}: ${header[2]}.${header[3]}`, body);
        return this.onEventListen({ type, id: header[1], channelName: header[2], name: header[3], arg: body });
      case 101 /* PromiseCancel */:
        this.logger?.logIncoming(message.byteLength, header[1], 1 /* OtherSide */, `${requestTypeToStr(type)}`);
        return this.disposeActiveRequest({ type, id: header[1] });
      case 103 /* EventDispose */:
        this.logger?.logIncoming(message.byteLength, header[1], 1 /* OtherSide */, `${requestTypeToStr(type)}`);
        return this.disposeActiveRequest({ type, id: header[1] });
    }
  }
  onPromise(request) {
    const channel = this.channels.get(request.channelName);
    if (!channel) {
      this.collectPendingRequest(request);
      return;
    }
    const cancellationTokenSource = new CancellationTokenSource();
    let promise;
    try {
      promise = channel.call(this.ctx, request.name, request.arg, cancellationTokenSource.token);
    } catch (err) {
      promise = Promise.reject(err);
    }
    const id2 = request.id;
    promise.then((data) => {
      this.sendResponse({ id: id2, data, type: 201 /* PromiseSuccess */ });
    }, (err) => {
      if (err instanceof Error) {
        this.sendResponse({
          id: id2,
          data: {
            message: err.message,
            name: err.name,
            stack: err.stack ? err.stack.split("\n") : void 0
          },
          type: 202 /* PromiseError */
        });
      } else {
        this.sendResponse({ id: id2, data: err, type: 203 /* PromiseErrorObj */ });
      }
    }).finally(() => {
      disposable.dispose();
      this.activeRequests.delete(request.id);
    });
    const disposable = toDisposable(() => cancellationTokenSource.cancel());
    this.activeRequests.set(request.id, disposable);
  }
  onEventListen(request) {
    const channel = this.channels.get(request.channelName);
    if (!channel) {
      this.collectPendingRequest(request);
      return;
    }
    const id2 = request.id;
    const event = channel.listen(this.ctx, request.name, request.arg);
    const disposable = event((data) => this.sendResponse({ id: id2, data, type: 204 /* EventFire */ }));
    this.activeRequests.set(request.id, disposable);
  }
  disposeActiveRequest(request) {
    const disposable = this.activeRequests.get(request.id);
    if (disposable) {
      disposable.dispose();
      this.activeRequests.delete(request.id);
    }
  }
  collectPendingRequest(request) {
    let pendingRequests = this.pendingRequests.get(request.channelName);
    if (!pendingRequests) {
      pendingRequests = [];
      this.pendingRequests.set(request.channelName, pendingRequests);
    }
    const timer = setTimeout(() => {
      console.error(`Unknown channel: ${request.channelName}`);
      if (request.type === 100 /* Promise */) {
        this.sendResponse({
          id: request.id,
          data: { name: "Unknown channel", message: `Channel name '${request.channelName}' timed out after ${this.timeoutDelay}ms`, stack: void 0 },
          type: 202 /* PromiseError */
        });
      }
    }, this.timeoutDelay);
    pendingRequests.push({ request, timeoutTimer: timer });
  }
  flushPendingRequests(channelName) {
    const requests = this.pendingRequests.get(channelName);
    if (requests) {
      for (const request of requests) {
        clearTimeout(request.timeoutTimer);
        switch (request.request.type) {
          case 100 /* Promise */:
            this.onPromise(request.request);
            break;
          case 102 /* EventListen */:
            this.onEventListen(request.request);
            break;
        }
      }
      this.pendingRequests.delete(channelName);
    }
  }
  dispose() {
    if (this.protocolListener) {
      this.protocolListener.dispose();
      this.protocolListener = null;
    }
    dispose(this.activeRequests.values());
    this.activeRequests.clear();
  }
};
var ChannelClient = class {
  constructor(protocol, logger = null) {
    this.protocol = protocol;
    this.isDisposed = false;
    this.state = 0 /* Uninitialized */;
    this.activeRequests = /* @__PURE__ */ new Set();
    this.handlers = /* @__PURE__ */ new Map();
    this.lastRequestId = 0;
    this._onDidInitialize = new Emitter();
    this.onDidInitialize = this._onDidInitialize.event;
    this.protocolListener = this.protocol.onMessage((msg) => this.onBuffer(msg));
    this.logger = logger;
  }
  getChannel(channelName) {
    const that = this;
    return {
      call(command, arg, cancellationToken) {
        if (that.isDisposed) {
          return Promise.reject(new CancellationError());
        }
        return that.requestPromise(channelName, command, arg, cancellationToken);
      },
      listen(event, arg) {
        if (that.isDisposed) {
          return Event.None;
        }
        return that.requestEvent(channelName, event, arg);
      }
    };
  }
  requestPromise(channelName, name, arg, cancellationToken = CancellationToken.None) {
    const id2 = this.lastRequestId++;
    const type = 100 /* Promise */;
    const request = { id: id2, type, channelName, name, arg };
    if (cancellationToken.isCancellationRequested) {
      return Promise.reject(new CancellationError());
    }
    let disposable;
    let disposableWithRequestCancel;
    const result = new Promise((c, e) => {
      if (cancellationToken.isCancellationRequested) {
        return e(new CancellationError());
      }
      const doRequest = () => {
        const handler = (response) => {
          switch (response.type) {
            case 201 /* PromiseSuccess */:
              this.handlers.delete(id2);
              c(response.data);
              break;
            case 202 /* PromiseError */: {
              this.handlers.delete(id2);
              const error = new Error(response.data.message);
              error.stack = Array.isArray(response.data.stack) ? response.data.stack.join("\n") : response.data.stack;
              error.name = response.data.name;
              e(error);
              break;
            }
            case 203 /* PromiseErrorObj */:
              this.handlers.delete(id2);
              e(response.data);
              break;
          }
        };
        this.handlers.set(id2, handler);
        this.sendRequest(request);
      };
      let uninitializedPromise = null;
      if (this.state === 1 /* Idle */) {
        doRequest();
      } else {
        uninitializedPromise = createCancelablePromise((_) => this.whenInitialized());
        uninitializedPromise.then(() => {
          uninitializedPromise = null;
          doRequest();
        });
      }
      const cancel = () => {
        if (uninitializedPromise) {
          uninitializedPromise.cancel();
          uninitializedPromise = null;
        } else {
          this.sendRequest({ id: id2, type: 101 /* PromiseCancel */ });
        }
        e(new CancellationError());
      };
      disposable = cancellationToken.onCancellationRequested(cancel);
      disposableWithRequestCancel = {
        dispose: createSingleCallFunction(() => {
          cancel();
          disposable.dispose();
        })
      };
      this.activeRequests.add(disposableWithRequestCancel);
    });
    return result.finally(() => {
      disposable?.dispose();
      this.activeRequests.delete(disposableWithRequestCancel);
    });
  }
  requestEvent(channelName, name, arg) {
    const id2 = this.lastRequestId++;
    const type = 102 /* EventListen */;
    const request = { id: id2, type, channelName, name, arg };
    let uninitializedPromise = null;
    const emitter = new Emitter({
      onWillAddFirstListener: () => {
        const doRequest = () => {
          this.activeRequests.add(emitter);
          this.sendRequest(request);
        };
        if (this.state === 1 /* Idle */) {
          doRequest();
        } else {
          uninitializedPromise = createCancelablePromise((_) => this.whenInitialized());
          uninitializedPromise.then(() => {
            uninitializedPromise = null;
            doRequest();
          });
        }
      },
      onDidRemoveLastListener: () => {
        if (uninitializedPromise) {
          uninitializedPromise.cancel();
          uninitializedPromise = null;
        } else {
          this.activeRequests.delete(emitter);
          this.sendRequest({ id: id2, type: 103 /* EventDispose */ });
        }
        this.handlers.delete(id2);
      }
    });
    const handler = (res) => emitter.fire(res.data);
    this.handlers.set(id2, handler);
    return emitter.event;
  }
  sendRequest(request) {
    switch (request.type) {
      case 100 /* Promise */:
      case 102 /* EventListen */: {
        const msgLength = this.send([request.type, request.id, request.channelName, request.name], request.arg);
        this.logger?.logOutgoing(msgLength, request.id, 0 /* LocalSide */, `${requestTypeToStr(request.type)}: ${request.channelName}.${request.name}`, request.arg);
        return;
      }
      case 101 /* PromiseCancel */:
      case 103 /* EventDispose */: {
        const msgLength = this.send([request.type, request.id]);
        this.logger?.logOutgoing(msgLength, request.id, 0 /* LocalSide */, requestTypeToStr(request.type));
        return;
      }
    }
  }
  send(header, body = void 0) {
    const writer = new BufferWriter();
    serialize(writer, header);
    serialize(writer, body);
    return this.sendBuffer(writer.buffer);
  }
  sendBuffer(message) {
    try {
      this.protocol.send(message);
      return message.byteLength;
    } catch (err) {
      return 0;
    }
  }
  onBuffer(message) {
    const reader = new BufferReader(message);
    const header = deserialize(reader);
    const body = deserialize(reader);
    const type = header[0];
    switch (type) {
      case 200 /* Initialize */:
        this.logger?.logIncoming(message.byteLength, 0, 0 /* LocalSide */, responseTypeToStr(type));
        return this.onResponse({ type: header[0] });
      case 201 /* PromiseSuccess */:
      case 202 /* PromiseError */:
      case 204 /* EventFire */:
      case 203 /* PromiseErrorObj */:
        this.logger?.logIncoming(message.byteLength, header[1], 0 /* LocalSide */, responseTypeToStr(type), body);
        return this.onResponse({ type: header[0], id: header[1], data: body });
    }
  }
  onResponse(response) {
    if (response.type === 200 /* Initialize */) {
      this.state = 1 /* Idle */;
      this._onDidInitialize.fire();
      return;
    }
    const handler = this.handlers.get(response.id);
    handler?.(response);
  }
  get onDidInitializePromise() {
    return Event.toPromise(this.onDidInitialize);
  }
  whenInitialized() {
    if (this.state === 1 /* Idle */) {
      return Promise.resolve();
    } else {
      return this.onDidInitializePromise;
    }
  }
  dispose() {
    this.isDisposed = true;
    if (this.protocolListener) {
      this.protocolListener.dispose();
      this.protocolListener = null;
    }
    dispose(this.activeRequests.values());
    this.activeRequests.clear();
    this._onDidInitialize.dispose();
  }
};
__decorateClass([
  memoize
], ChannelClient.prototype, "onDidInitializePromise", 1);
var IPCServer = class {
  constructor(onDidClientConnect, ipcLogger, timeoutDelay) {
    this.channels = /* @__PURE__ */ new Map();
    this._connections = /* @__PURE__ */ new Set();
    this._onDidAddConnection = new Emitter();
    this.onDidAddConnection = this._onDidAddConnection.event;
    this._onDidRemoveConnection = new Emitter();
    this.onDidRemoveConnection = this._onDidRemoveConnection.event;
    this.disposables = new DisposableStore();
    this.disposables.add(onDidClientConnect(({ protocol, onDidClientDisconnect }) => {
      const onFirstMessage = Event.once(protocol.onMessage);
      this.disposables.add(onFirstMessage((msg) => {
        const reader = new BufferReader(msg);
        const ctx = deserialize(reader);
        const channelServer = new ChannelServer(protocol, ctx, ipcLogger, timeoutDelay);
        const channelClient = new ChannelClient(protocol, ipcLogger);
        this.channels.forEach((channel, name) => channelServer.registerChannel(name, channel));
        const connection = { channelServer, channelClient, ctx };
        this._connections.add(connection);
        this._onDidAddConnection.fire(connection);
        this.disposables.add(onDidClientDisconnect(() => {
          channelServer.dispose();
          channelClient.dispose();
          this._connections.delete(connection);
          this._onDidRemoveConnection.fire(connection);
        }));
      }));
    }));
  }
  get connections() {
    const result = [];
    this._connections.forEach((ctx) => result.push(ctx));
    return result;
  }
  getChannel(channelName, routerOrClientFilter) {
    const that = this;
    return {
      call(command, arg, cancellationToken) {
        let connectionPromise;
        if (isFunction(routerOrClientFilter)) {
          const connection = getRandomElement(that.connections.filter(routerOrClientFilter));
          connectionPromise = connection ? Promise.resolve(connection) : Event.toPromise(Event.filter(that.onDidAddConnection, routerOrClientFilter));
        } else {
          connectionPromise = routerOrClientFilter.routeCall(that, command, arg);
        }
        const channelPromise = connectionPromise.then((connection) => connection.channelClient.getChannel(channelName));
        return getDelayedChannel(channelPromise).call(command, arg, cancellationToken);
      },
      listen(event, arg) {
        if (isFunction(routerOrClientFilter)) {
          return that.getMulticastEvent(channelName, routerOrClientFilter, event, arg);
        }
        const channelPromise = routerOrClientFilter.routeEvent(that, event, arg).then((connection) => connection.channelClient.getChannel(channelName));
        return getDelayedChannel(channelPromise).listen(event, arg);
      }
    };
  }
  getMulticastEvent(channelName, clientFilter, eventName, arg) {
    const that = this;
    let disposables;
    const emitter = new Emitter({
      onWillAddFirstListener: () => {
        disposables = new DisposableStore();
        const eventMultiplexer = new EventMultiplexer();
        const map = /* @__PURE__ */ new Map();
        const onDidAddConnection = (connection) => {
          const channel = connection.channelClient.getChannel(channelName);
          const event = channel.listen(eventName, arg);
          const disposable = eventMultiplexer.add(event);
          map.set(connection, disposable);
        };
        const onDidRemoveConnection = (connection) => {
          const disposable = map.get(connection);
          if (!disposable) {
            return;
          }
          disposable.dispose();
          map.delete(connection);
        };
        that.connections.filter(clientFilter).forEach(onDidAddConnection);
        Event.filter(that.onDidAddConnection, clientFilter)(onDidAddConnection, void 0, disposables);
        that.onDidRemoveConnection(onDidRemoveConnection, void 0, disposables);
        eventMultiplexer.event(emitter.fire, emitter, disposables);
        disposables.add(eventMultiplexer);
      },
      onDidRemoveLastListener: () => {
        disposables?.dispose();
        disposables = void 0;
      }
    });
    that.disposables.add(emitter);
    return emitter.event;
  }
  registerChannel(channelName, channel) {
    this.channels.set(channelName, channel);
    for (const connection of this._connections) {
      connection.channelServer.registerChannel(channelName, channel);
    }
  }
  dispose() {
    this.disposables.dispose();
    for (const connection of this._connections) {
      connection.channelClient.dispose();
      connection.channelServer.dispose();
    }
    this._connections.clear();
    this.channels.clear();
    this._onDidAddConnection.dispose();
    this._onDidRemoveConnection.dispose();
  }
};
function getDelayedChannel(promise) {
  return {
    call(command, arg, cancellationToken) {
      return promise.then((c) => c.call(command, arg, cancellationToken));
    },
    listen(event, arg) {
      const relay = new Relay();
      promise.then((c) => relay.input = c.listen(event, arg));
      return relay.event;
    }
  };
}
var ProxyChannel;
((ProxyChannel2) => {
  function fromService(service, disposables, options) {
    const handler = service;
    const disableMarshalling = options?.disableMarshalling;
    const mapEventNameToEvent = /* @__PURE__ */ new Map();
    for (const key in handler) {
      if (propertyIsEvent(key)) {
        mapEventNameToEvent.set(key, Event.buffer(handler[key], key, true, void 0, disposables));
      }
    }
    return new class {
      listen(_, event, arg) {
        const eventImpl = mapEventNameToEvent.get(event);
        if (eventImpl) {
          return eventImpl;
        }
        const target = handler[event];
        if (typeof target === "function") {
          if (propertyIsDynamicEvent(event)) {
            return target.call(handler, arg);
          }
          if (propertyIsEvent(event)) {
            mapEventNameToEvent.set(event, Event.buffer(handler[event], event, true, void 0, disposables));
            return mapEventNameToEvent.get(event);
          }
        }
        throw new ErrorNoTelemetry(`Event not found: ${event}`);
      }
      call(_, command, args) {
        const target = handler[command];
        if (typeof target === "function") {
          if (!disableMarshalling && Array.isArray(args)) {
            for (let i = 0; i < args.length; i++) {
              args[i] = revive(args[i]);
            }
          }
          let res = target.apply(handler, args);
          if (!(res instanceof Promise)) {
            res = Promise.resolve(res);
          }
          return res;
        }
        throw new ErrorNoTelemetry(`Method not found: ${command}`);
      }
    }();
  }
  ProxyChannel2.fromService = fromService;
  function toService(channel, options) {
    const disableMarshalling = options?.disableMarshalling;
    return new Proxy({}, {
      get(_target, propKey) {
        if (typeof propKey === "string") {
          if (options?.properties?.has(propKey)) {
            return options.properties.get(propKey);
          }
          if (propertyIsDynamicEvent(propKey)) {
            return function(arg) {
              return channel.listen(propKey, arg);
            };
          }
          if (propertyIsEvent(propKey)) {
            return channel.listen(propKey);
          }
          return async function(...args) {
            let methodArgs;
            if (options && !isUndefinedOrNull(options.context)) {
              methodArgs = [options.context, ...args];
            } else {
              methodArgs = args;
            }
            const result = await channel.call(propKey, methodArgs);
            if (!disableMarshalling) {
              return revive(result);
            }
            return result;
          };
        }
        throw new ErrorNoTelemetry(`Property not found: ${String(propKey)}`);
      }
    });
  }
  ProxyChannel2.toService = toService;
  function propertyIsEvent(name) {
    return name[0] === "o" && name[1] === "n" && isUpperAsciiLetter(name.charCodeAt(2));
  }
  function propertyIsDynamicEvent(name) {
    return /^onDynamic/.test(name) && isUpperAsciiLetter(name.charCodeAt(9));
  }
})(ProxyChannel || (ProxyChannel = {}));

// src/vs/base/parts/ipc/node/ipc.cp.ts
import { fork } from "child_process";

// src/vs/base/node/processes.ts
import * as cp from "child_process";
import { promises as promises2 } from "fs";

// src/vs/base/node/pfs.ts
import * as fs from "fs";
import { tmpdir } from "os";
import { promisify } from "util";

// src/vs/base/common/normalization.ts
var nfcCache = new LRUCache(1e4);
function normalizeNFC(str) {
  return normalize2(str, "NFC", nfcCache);
}
var nfdCache = new LRUCache(1e4);
function normalizeNFD(str) {
  return normalize2(str, "NFD", nfdCache);
}
var nonAsciiCharactersPattern = /[^\u0000-\u0080]/;
function normalize2(str, form, normalizedCache) {
  if (!str) {
    return str;
  }
  const cached = normalizedCache.get(str);
  if (cached) {
    return cached;
  }
  let res;
  if (nonAsciiCharactersPattern.test(str)) {
    res = str.normalize(form);
  } else {
    res = str;
  }
  normalizedCache.set(str, res);
  return res;
}
var tryNormalizeToBase = (function() {
  const cache = new LRUCache(1e4);
  const accentsRegex = /[\u0300-\u036f]/g;
  return function(str) {
    const cached = cache.get(str);
    if (cached) {
      return cached;
    }
    const noAccents = normalizeNFD(str).replace(accentsRegex, "");
    const result = (noAccents.length === str.length ? noAccents : str).toLowerCase();
    cache.set(str, result);
    return result;
  };
})();

// src/vs/base/node/pfs.ts
async function rimraf(path, mode = 0 /* UNLINK */, moveToPath) {
  if (isRootOrDriveLetter(path)) {
    throw new Error("rimraf - will refuse to recursively delete root");
  }
  if (mode === 0 /* UNLINK */) {
    return rimrafUnlink(path);
  }
  return rimrafMove(path, moveToPath);
}
async function rimrafMove(path, moveToPath = randomPath(tmpdir())) {
  try {
    try {
      await fs.promises.rename(path, moveToPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        return;
      }
      return rimrafUnlink(path);
    }
    rimrafUnlink(moveToPath).catch(() => {
    });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}
async function rimrafUnlink(path) {
  return fs.promises.rm(path, { recursive: true, force: true, maxRetries: 3 });
}
async function readdir(path, options) {
  try {
    return await doReaddir(path, options);
  } catch (error) {
    if (error.code === "ENOENT" && isWindows && isRootOrDriveLetter(path)) {
      try {
        return await doReaddir(`${path}.`, options);
      } catch {
      }
    }
    throw error;
  }
}
async function doReaddir(path, options) {
  return handleDirectoryChildren(await (options ? safeReaddirWithFileTypes(path) : fs.promises.readdir(path)));
}
async function safeReaddirWithFileTypes(path) {
  try {
    return await fs.promises.readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("[node.js fs] readdir with filetypes failed with error: ", error);
    }
  }
  const result = [];
  const children = await readdir(path);
  for (const child of children) {
    let isFile = false;
    let isDirectory = false;
    let isSymbolicLink = false;
    try {
      const lstat = await fs.promises.lstat(join(path, child));
      isFile = lstat.isFile();
      isDirectory = lstat.isDirectory();
      isSymbolicLink = lstat.isSymbolicLink();
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.warn("[node.js fs] unexpected error from lstat after readdir: ", error);
      }
    }
    result.push({
      name: child,
      isFile: () => isFile,
      isDirectory: () => isDirectory,
      isSymbolicLink: () => isSymbolicLink
    });
  }
  return result;
}
function handleDirectoryChildren(children) {
  return children.map((child) => {
    if (typeof child === "string") {
      return isMacintosh ? normalizeNFC(child) : child;
    }
    child.name = isMacintosh ? normalizeNFC(child.name) : child.name;
    return child;
  });
}
async function readDirsInDir(dirPath) {
  const children = await readdir(dirPath);
  const directories = [];
  for (const child of children) {
    if (await SymlinkSupport.existsDirectory(join(dirPath, child))) {
      directories.push(child);
    }
  }
  return directories;
}
var SymlinkSupport;
((SymlinkSupport2) => {
  async function stat(path) {
    let lstats;
    try {
      lstats = await fs.promises.lstat(path);
      if (!lstats.isSymbolicLink()) {
        return { stat: lstats };
      }
    } catch {
    }
    try {
      const stats = await fs.promises.stat(path);
      return { stat: stats, symbolicLink: lstats?.isSymbolicLink() ? { dangling: false } : void 0 };
    } catch (error) {
      if (error.code === "ENOENT" && lstats) {
        return { stat: lstats, symbolicLink: { dangling: true } };
      }
      if (isWindows && error.code === "EACCES") {
        try {
          const stats = await fs.promises.stat(await fs.promises.readlink(path));
          return { stat: stats, symbolicLink: { dangling: false } };
        } catch (error2) {
          if (error2.code === "ENOENT" && lstats) {
            return { stat: lstats, symbolicLink: { dangling: true } };
          }
          throw error2;
        }
      }
      throw error;
    }
  }
  SymlinkSupport2.stat = stat;
  async function existsFile(path) {
    try {
      const { stat: stat2, symbolicLink } = await SymlinkSupport2.stat(path);
      return stat2.isFile() && symbolicLink?.dangling !== true;
    } catch {
    }
    return false;
  }
  SymlinkSupport2.existsFile = existsFile;
  async function existsDirectory(path) {
    try {
      const { stat: stat2, symbolicLink } = await SymlinkSupport2.stat(path);
      return stat2.isDirectory() && symbolicLink?.dangling !== true;
    } catch {
    }
    return false;
  }
  SymlinkSupport2.existsDirectory = existsDirectory;
})(SymlinkSupport || (SymlinkSupport = {}));
var writeQueues = new ResourceQueue();
function writeFile2(path, data, options) {
  return writeQueues.queueFor(URI.file(path), () => {
    const ensuredOptions = ensureWriteOptions(options);
    return new Promise((resolve3, reject) => doWriteFileAndFlush(path, data, ensuredOptions, (error) => error ? reject(error) : resolve3()));
  }, extUriBiasedIgnorePathCase);
}
var canFlush = true;
function configureFlushOnWrite(enabled) {
  canFlush = enabled;
}
function doWriteFileAndFlush(path, data, options, callback) {
  if (!canFlush) {
    return fs.writeFile(path, data, { mode: options.mode, flag: options.flag }, callback);
  }
  fs.open(path, options.flag, options.mode, (openError, fd) => {
    if (openError) {
      return callback(openError);
    }
    fs.writeFile(fd, data, (writeError) => {
      if (writeError) {
        return fs.close(fd, () => callback(writeError));
      }
      fs.fdatasync(fd, (syncError) => {
        if (syncError) {
          console.warn("[node.js fs] fdatasync is now disabled for this session because it failed: ", syncError);
          configureFlushOnWrite(false);
        }
        return fs.close(fd, (closeError) => callback(closeError));
      });
    });
  });
}
function ensureWriteOptions(options) {
  if (!options) {
    return { mode: 438, flag: "w" };
  }
  return {
    mode: typeof options.mode === "number" ? options.mode : 438,
    flag: typeof options.flag === "string" ? options.flag : "w"
  };
}
async function rename(source, target, windowsRetryTimeout = 6e4) {
  if (source === target) {
    return;
  }
  try {
    if (isWindows && typeof windowsRetryTimeout === "number") {
      await renameWithRetry(source, target, Date.now(), windowsRetryTimeout);
    } else {
      await fs.promises.rename(source, target);
    }
  } catch (error) {
    if (source.toLowerCase() !== target.toLowerCase() && error.code === "EXDEV" || source.endsWith(".")) {
      await copy(source, target, {
        preserveSymlinks: false
        /* copying to another device */
      });
      await rimraf(source, 1 /* MOVE */);
    } else {
      throw error;
    }
  }
}
async function renameWithRetry(source, target, startTime, retryTimeout, attempt = 0) {
  try {
    return await fs.promises.rename(source, target);
  } catch (error) {
    if (error.code !== "EACCES" && error.code !== "EPERM" && error.code !== "EBUSY") {
      throw error;
    }
    if (Date.now() - startTime >= retryTimeout) {
      console.error(`[node.js fs] rename failed after ${attempt} retries with error: ${error}`);
      throw error;
    }
    if (attempt === 0) {
      let abortRetry = false;
      try {
        const { stat } = await SymlinkSupport.stat(target);
        if (!stat.isFile()) {
          abortRetry = true;
        }
      } catch {
      }
      if (abortRetry) {
        throw error;
      }
    }
    await timeout(Math.min(100, attempt * 10));
    return renameWithRetry(source, target, startTime, retryTimeout, attempt + 1);
  }
}
async function copy(source, target, options) {
  return doCopy(source, target, { root: { source, target }, options, handledSourcePaths: /* @__PURE__ */ new Set() });
}
var COPY_MODE_MASK = 511;
async function doCopy(source, target, payload) {
  if (payload.handledSourcePaths.has(source)) {
    return;
  } else {
    payload.handledSourcePaths.add(source);
  }
  const { stat, symbolicLink } = await SymlinkSupport.stat(source);
  if (symbolicLink) {
    if (payload.options.preserveSymlinks) {
      try {
        return await doCopySymlink(source, target, payload);
      } catch {
      }
    }
    if (symbolicLink.dangling) {
      return;
    }
  }
  if (stat.isDirectory()) {
    return doCopyDirectory(source, target, stat.mode & COPY_MODE_MASK, payload);
  } else {
    return doCopyFile(source, target, stat.mode & COPY_MODE_MASK);
  }
}
async function doCopyDirectory(source, target, mode, payload) {
  await fs.promises.mkdir(target, { recursive: true, mode });
  const files = await readdir(source);
  for (const file of files) {
    await doCopy(join(source, file), join(target, file), payload);
  }
}
async function doCopyFile(source, target, mode) {
  await fs.promises.copyFile(source, target);
  await fs.promises.chmod(target, mode);
}
async function doCopySymlink(source, target, payload) {
  let linkTarget = await fs.promises.readlink(source);
  if (isEqualOrParent(linkTarget, payload.root.source, !isLinux)) {
    linkTarget = join(payload.root.target, linkTarget.substr(payload.root.source.length + 1));
  }
  await fs.promises.symlink(linkTarget, target);
}
async function realpath2(path) {
  try {
    return await promisify(fs.realpath)(path);
  } catch {
    const normalizedPath = normalizePath2(path);
    await fs.promises.access(normalizedPath, fs.constants.R_OK);
    return normalizedPath;
  }
}
function normalizePath2(path) {
  return rtrim(normalize(path), sep);
}
var Promises2 = new class {
  //#region Implemented by node.js
  get read() {
    return (fd, buffer, offset, length, position) => {
      return new Promise((resolve3, reject) => {
        fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) {
            return reject(err);
          }
          return resolve3({ bytesRead, buffer: buffer2 });
        });
      });
    };
  }
  get write() {
    return (fd, buffer, offset, length, position) => {
      return new Promise((resolve3, reject) => {
        fs.write(fd, buffer, offset, length, position, (err, bytesWritten, buffer2) => {
          if (err) {
            return reject(err);
          }
          return resolve3({ bytesWritten, buffer: buffer2 });
        });
      });
    };
  }
  get fdatasync() {
    return promisify(fs.fdatasync);
  }
  // not exposed as API in 22.x yet
  get open() {
    return promisify(fs.open);
  }
  // changed to return `FileHandle` in promise API
  get close() {
    return promisify(fs.close);
  }
  // not exposed as API due to the `FileHandle` return type of `open`
  get ftruncate() {
    return promisify(fs.ftruncate);
  }
  // not exposed as API in 22.x yet
  //#endregion
  //#region Implemented by us
  async exists(path) {
    try {
      await fs.promises.access(path);
      return true;
    } catch {
      return false;
    }
  }
  get readdir() {
    return readdir;
  }
  get readDirsInDir() {
    return readDirsInDir;
  }
  get writeFile() {
    return writeFile2;
  }
  get rm() {
    return rimraf;
  }
  get rename() {
    return rename;
  }
  get copy() {
    return copy;
  }
  get realpath() {
    return realpath2;
  }
  // `fs.promises.realpath` will use `fs.realpath.native` which we do not want
  //#endregion
}();

// src/vs/base/parts/ipc/node/ipc.cp.ts
var Server = class extends ChannelServer {
  constructor(ctx) {
    super({
      send: (r) => {
        try {
          process.send?.(r.buffer.toString("base64"));
        } catch (e) {
        }
      },
      onMessage: Event.fromNodeEventEmitter(process, "message", (msg) => VSBuffer.wrap(Buffer.from(msg, "base64")))
    }, ctx);
    process.once("disconnect", () => this.dispose());
  }
};

// src/vs/base/parts/sandbox/node/electronTypes.ts
function isUtilityProcess(process2) {
  return !!process2.parentPort;
}

// src/vs/base/parts/ipc/node/ipc.mp.ts
var Protocol = class {
  constructor(port) {
    this.port = port;
    this.onMessage = Event.fromNodeEventEmitter(this.port, "message", (e) => {
      if (e.data) {
        return VSBuffer.wrap(e.data);
      }
      return VSBuffer.alloc(0);
    });
    port.start();
  }
  send(message) {
    this.port.postMessage(message.buffer);
  }
  disconnect() {
    this.port.close();
  }
};
var Server2 = class _Server extends IPCServer {
  static getOnDidClientConnect(filter) {
    assertType(isUtilityProcess(process), "Electron Utility Process");
    const onCreateMessageChannel = new Emitter();
    process.parentPort.on("message", (e) => {
      if (filter?.handledClientConnection(e)) {
        return;
      }
      const port = e.ports.at(0);
      if (port) {
        onCreateMessageChannel.fire(port);
      }
    });
    return Event.map(onCreateMessageChannel.event, (port) => {
      const protocol = new Protocol(port);
      const result = {
        protocol,
        // Not part of the standard spec, but in Electron we get a `close` event
        // when the other side closes. We can use this to detect disconnects
        // (https://github.com/electron/electron/blob/11-x-y/docs/api/message-port-main.md#event-close)
        onDidClientDisconnect: Event.fromNodeEventEmitter(port, "close")
      };
      return result;
    });
  }
  constructor(filter) {
    super(_Server.getOnDidClientConnect(filter));
  }
};

// src/vs/platform/instantiation/common/instantiation.ts
var _util;
((_util2) => {
  _util2.serviceIds = /* @__PURE__ */ new Map();
  _util2.DI_TARGET = "$di$target";
  _util2.DI_DEPENDENCIES = "$di$dependencies";
  function getServiceDependencies(ctor) {
    return ctor[_util2.DI_DEPENDENCIES] || [];
  }
  _util2.getServiceDependencies = getServiceDependencies;
})(_util || (_util = {}));
var IInstantiationService = createDecorator("instantiationService");
function storeServiceDependency(id2, target, index) {
  if (target[_util.DI_TARGET] === target) {
    target[_util.DI_DEPENDENCIES].push({ id: id2, index });
  } else {
    target[_util.DI_DEPENDENCIES] = [{ id: id2, index }];
    target[_util.DI_TARGET] = target;
  }
}
function createDecorator(serviceId) {
  if (_util.serviceIds.has(serviceId)) {
    return _util.serviceIds.get(serviceId);
  }
  const id2 = function(target, key, index) {
    if (arguments.length !== 3) {
      throw new Error("@IServiceName-decorator can only be used to decorate a parameter");
    }
    storeServiceDependency(id2, target, index);
  };
  id2.toString = () => serviceId;
  _util.serviceIds.set(serviceId, id2);
  return id2;
}

// src/vs/platform/agentHost/common/agentService.ts
var AgentSession;
((AgentSession2) => {
  function uri(provider2, rawSessionId) {
    return URI.from({ scheme: provider2, path: `/${rawSessionId}` });
  }
  AgentSession2.uri = uri;
  function id2(session) {
    return session.path.substring(1);
  }
  AgentSession2.id = id2;
  function provider(session) {
    const scheme = session.scheme;
    if (scheme === "copilot" || scheme === "mock") {
      return scheme;
    }
    return void 0;
  }
  AgentSession2.provider = provider;
})(AgentSession || (AgentSession = {}));
var IAgentService = createDecorator("agentService");
var IAgentHostService = createDecorator("agentHostService");

// src/vs/base/common/observableInternal/debugName.ts
var DebugNameData = class {
  constructor(owner, debugNameSource, referenceFn) {
    this.owner = owner;
    this.debugNameSource = debugNameSource;
    this.referenceFn = referenceFn;
  }
  getDebugName(target) {
    return getDebugName(target, this);
  }
};
var countPerName = /* @__PURE__ */ new Map();
var cachedDebugName = /* @__PURE__ */ new WeakMap();
function getDebugName(target, data) {
  const cached = cachedDebugName.get(target);
  if (cached) {
    return cached;
  }
  const dbgName = computeDebugName(target, data);
  if (dbgName) {
    let count = countPerName.get(dbgName) ?? 0;
    count++;
    countPerName.set(dbgName, count);
    const result = count === 1 ? dbgName : `${dbgName}#${count}`;
    cachedDebugName.set(target, result);
    return result;
  }
  return void 0;
}
function computeDebugName(self, data) {
  const cached = cachedDebugName.get(self);
  if (cached) {
    return cached;
  }
  const ownerStr = data.owner ? formatOwner(data.owner) + `.` : "";
  let result;
  const debugNameSource = data.debugNameSource;
  if (debugNameSource !== void 0) {
    if (typeof debugNameSource === "function") {
      result = debugNameSource();
      if (result !== void 0) {
        return ownerStr + result;
      }
    } else {
      return ownerStr + debugNameSource;
    }
  }
  const referenceFn = data.referenceFn;
  if (referenceFn !== void 0) {
    result = getFunctionName(referenceFn);
    if (result !== void 0) {
      return ownerStr + result;
    }
  }
  if (data.owner !== void 0) {
    const key = findKey(data.owner, self);
    if (key !== void 0) {
      return ownerStr + key;
    }
  }
  return void 0;
}
function findKey(obj, value) {
  for (const key in obj) {
    if (obj[key] === value) {
      return key;
    }
  }
  return void 0;
}
var countPerClassName = /* @__PURE__ */ new Map();
var ownerId = /* @__PURE__ */ new WeakMap();
function formatOwner(owner) {
  const id2 = ownerId.get(owner);
  if (id2) {
    return id2;
  }
  const className = getClassName(owner) ?? "Object";
  let count = countPerClassName.get(className) ?? 0;
  count++;
  countPerClassName.set(className, count);
  const result = count === 1 ? className : `${className}#${count}`;
  ownerId.set(owner, result);
  return result;
}
function getClassName(obj) {
  const ctor = obj.constructor;
  if (ctor) {
    if (ctor.name === "Object") {
      return void 0;
    }
    return ctor.name;
  }
  return void 0;
}
function getFunctionName(fn) {
  const fnSrc = fn.toString();
  const regexp = /\/\*\*\s*@description\s*([^*]*)\*\//;
  const match = regexp.exec(fnSrc);
  const result = match ? match[1] : void 0;
  return result?.trim();
}

// src/vs/base/common/equals.ts
function strictEquals(a, b) {
  return a === b;
}
function strictEqualsC() {
  return (a, b) => a === b;
}
function arrayEquals(a, b, itemEquals) {
  return equals(a, b, itemEquals ?? strictEquals);
}
function arrayEqualsC(itemEquals) {
  return (a, b) => equals(a, b, itemEquals ?? strictEquals);
}
function structuralEquals(a, b) {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!structuralEquals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (a && typeof a === "object" && b && typeof b === "object") {
    if (Object.getPrototypeOf(a) === Object.prototype && Object.getPrototypeOf(b) === Object.prototype) {
      const aObj = a;
      const bObj = b;
      const keysA = Object.keys(aObj);
      const keysB = Object.keys(bObj);
      const keysBSet = new Set(keysB);
      if (keysA.length !== keysB.length) {
        return false;
      }
      for (const key of keysA) {
        if (!keysBSet.has(key)) {
          return false;
        }
        if (!structuralEquals(aObj[key], bObj[key])) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}
function structuralEqualsC() {
  return (a, b) => structuralEquals(a, b);
}
function jsonStringifyEquals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function jsonStringifyEqualsC() {
  return (a, b) => JSON.stringify(a) === JSON.stringify(b);
}
function thisEqualsC() {
  return (a, b) => a.equals(b);
}
function equalsIfDefined(v1, v2, equals3) {
  if (v1 === void 0 || v1 === null || v2 === void 0 || v2 === null) {
    return v2 === v1;
  }
  return equals3(v1, v2);
}
function equalsIfDefinedC(equals3) {
  return (v1, v2) => {
    if (v1 === void 0 || v1 === null || v2 === void 0 || v2 === null) {
      return v2 === v1;
    }
    return equals3(v1, v2);
  };
}
var equals2;
((equals3) => {
  equals3.strict = strictEquals;
  equals3.strictC = strictEqualsC;
  equals3.array = arrayEquals;
  equals3.arrayC = arrayEqualsC;
  equals3.structural = structuralEquals;
  equals3.structuralC = structuralEqualsC;
  equals3.jsonStringify = jsonStringifyEquals;
  equals3.jsonStringifyC = jsonStringifyEqualsC;
  equals3.thisC = thisEqualsC;
  equals3.ifDefined = equalsIfDefined;
  equals3.ifDefinedC = equalsIfDefinedC;
})(equals2 || (equals2 = {}));

// src/vs/base/common/observableInternal/base.ts
function handleBugIndicatingErrorRecovery(message) {
  const err = new Error("BugIndicatingErrorRecovery: " + message);
  onUnexpectedError(err);
  console.error("recovered from an error that indicates a bug", err);
}

// src/vs/base/common/observableInternal/logging/logging.ts
var globalObservableLogger;
function addLogger(logger) {
  if (!globalObservableLogger) {
    globalObservableLogger = logger;
  } else if (globalObservableLogger instanceof ComposedLogger) {
    globalObservableLogger.loggers.push(logger);
  } else {
    globalObservableLogger = new ComposedLogger([globalObservableLogger, logger]);
  }
}
function getLogger() {
  return globalObservableLogger;
}
var globalObservableLoggerFn = void 0;
function setLogObservableFn(fn) {
  globalObservableLoggerFn = fn;
}
function logObservable(obs) {
  if (globalObservableLoggerFn) {
    globalObservableLoggerFn(obs);
  }
}
var ComposedLogger = class {
  constructor(loggers) {
    this.loggers = loggers;
  }
  handleObservableCreated(observable, location) {
    for (const logger of this.loggers) {
      logger.handleObservableCreated(observable, location);
    }
  }
  handleOnListenerCountChanged(observable, newCount) {
    for (const logger of this.loggers) {
      logger.handleOnListenerCountChanged(observable, newCount);
    }
  }
  handleObservableUpdated(observable, info) {
    for (const logger of this.loggers) {
      logger.handleObservableUpdated(observable, info);
    }
  }
  handleAutorunCreated(autorun2, location) {
    for (const logger of this.loggers) {
      logger.handleAutorunCreated(autorun2, location);
    }
  }
  handleAutorunDisposed(autorun2) {
    for (const logger of this.loggers) {
      logger.handleAutorunDisposed(autorun2);
    }
  }
  handleAutorunDependencyChanged(autorun2, observable, change) {
    for (const logger of this.loggers) {
      logger.handleAutorunDependencyChanged(autorun2, observable, change);
    }
  }
  handleAutorunStarted(autorun2) {
    for (const logger of this.loggers) {
      logger.handleAutorunStarted(autorun2);
    }
  }
  handleAutorunFinished(autorun2) {
    for (const logger of this.loggers) {
      logger.handleAutorunFinished(autorun2);
    }
  }
  handleDerivedDependencyChanged(derived2, observable, change) {
    for (const logger of this.loggers) {
      logger.handleDerivedDependencyChanged(derived2, observable, change);
    }
  }
  handleDerivedCleared(observable) {
    for (const logger of this.loggers) {
      logger.handleDerivedCleared(observable);
    }
  }
  handleBeginTransaction(transaction2) {
    for (const logger of this.loggers) {
      logger.handleBeginTransaction(transaction2);
    }
  }
  handleEndTransaction(transaction2) {
    for (const logger of this.loggers) {
      logger.handleEndTransaction(transaction2);
    }
  }
};

// src/vs/base/common/observableInternal/transaction.ts
function transaction(fn, getDebugName2) {
  const tx = new TransactionImpl(fn, getDebugName2);
  try {
    fn(tx);
  } finally {
    tx.finish();
  }
}
function subtransaction(tx, fn, getDebugName2) {
  if (!tx) {
    transaction(fn, getDebugName2);
  } else {
    fn(tx);
  }
}
var TransactionImpl = class {
  constructor(_fn, _getDebugName) {
    this._fn = _fn;
    this._getDebugName = _getDebugName;
    this._updatingObservers = [];
    getLogger()?.handleBeginTransaction(this);
  }
  getDebugName() {
    if (this._getDebugName) {
      return this._getDebugName();
    }
    return getFunctionName(this._fn);
  }
  updateObserver(observer, observable) {
    if (!this._updatingObservers) {
      handleBugIndicatingErrorRecovery("Transaction already finished!");
      transaction((tx) => {
        tx.updateObserver(observer, observable);
      });
      return;
    }
    this._updatingObservers.push({ observer, observable });
    observer.beginUpdate(observable);
  }
  finish() {
    const updatingObservers = this._updatingObservers;
    if (!updatingObservers) {
      handleBugIndicatingErrorRecovery("transaction.finish() has already been called!");
      return;
    }
    for (let i = 0; i < updatingObservers.length; i++) {
      const { observer, observable } = updatingObservers[i];
      observer.endUpdate(observable);
    }
    this._updatingObservers = null;
    getLogger()?.handleEndTransaction(this);
  }
  debugGetUpdatingObservers() {
    return this._updatingObservers;
  }
};

// src/vs/base/common/observableInternal/debugLocation.ts
var DebugLocation;
((DebugLocation2) => {
  let enabled = false;
  function enable() {
    enabled = true;
  }
  DebugLocation2.enable = enable;
  function ofCaller() {
    if (!enabled) {
      return void 0;
    }
    const Err = Error;
    const l = Err.stackTraceLimit;
    Err.stackTraceLimit = 3;
    const stack = new Error().stack;
    Err.stackTraceLimit = l;
    return DebugLocationImpl.fromStack(stack, 2);
  }
  DebugLocation2.ofCaller = ofCaller;
})(DebugLocation || (DebugLocation = {}));
var DebugLocationImpl = class _DebugLocationImpl {
  constructor(fileName, line, column, id2) {
    this.fileName = fileName;
    this.line = line;
    this.column = column;
    this.id = id2;
  }
  static fromStack(stack, parentIdx) {
    const lines = stack.split("\n");
    const location = parseLine(lines[parentIdx + 1]);
    if (location) {
      return new _DebugLocationImpl(
        location.fileName,
        location.line,
        location.column,
        location.id
      );
    } else {
      return void 0;
    }
  }
};
function parseLine(stackLine) {
  const match = stackLine.match(/\((.*):(\d+):(\d+)\)/);
  if (match) {
    return {
      fileName: match[1],
      line: parseInt(match[2]),
      column: parseInt(match[3]),
      id: stackLine
    };
  }
  const match2 = stackLine.match(/at ([^\(\)]*):(\d+):(\d+)/);
  if (match2) {
    return {
      fileName: match2[1],
      line: parseInt(match2[2]),
      column: parseInt(match2[3]),
      id: stackLine
    };
  }
  return void 0;
}

// src/vs/base/common/observableInternal/observables/baseObservable.ts
var _derived;
function _setDerivedOpts(derived2) {
  _derived = derived2;
}
var _recomputeInitiallyAndOnChange;
function _setRecomputeInitiallyAndOnChange(recomputeInitiallyAndOnChange2) {
  _recomputeInitiallyAndOnChange = recomputeInitiallyAndOnChange2;
}
var _keepObserved;
function _setKeepObserved(keepObserved2) {
  _keepObserved = keepObserved2;
}
var _debugGetObservableGraph;
function _setDebugGetObservableGraph(debugGetObservableGraph2) {
  _debugGetObservableGraph = debugGetObservableGraph2;
}
var ConvenientObservable = class {
  get TChange() {
    return null;
  }
  reportChanges() {
    this.get();
  }
  /** @sealed */
  read(reader) {
    if (reader) {
      return reader.readObservable(this);
    } else {
      return this.get();
    }
  }
  map(fnOrOwner, fnOrUndefined, debugLocation = DebugLocation.ofCaller()) {
    const owner = fnOrUndefined === void 0 ? void 0 : fnOrOwner;
    const fn = fnOrUndefined === void 0 ? fnOrOwner : fnOrUndefined;
    return _derived(
      {
        owner,
        debugName: () => {
          const name = getFunctionName(fn);
          if (name !== void 0) {
            return name;
          }
          const regexp = /^\s*\(?\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\)?\s*=>\s*\1(?:\??)\.([a-zA-Z_$][a-zA-Z_$0-9]*)\s*$/;
          const match = regexp.exec(fn.toString());
          if (match) {
            return `${this.debugName}.${match[2]}`;
          }
          if (!owner) {
            return `${this.debugName} (mapped)`;
          }
          return void 0;
        },
        debugReferenceFn: fn
      },
      (reader) => fn(this.read(reader), reader),
      debugLocation
    );
  }
  /**
   * @sealed
   * Converts an observable of an observable value into a direct observable of the value.
  */
  flatten() {
    return _derived(
      {
        owner: void 0,
        debugName: () => `${this.debugName} (flattened)`
      },
      (reader) => this.read(reader).read(reader)
    );
  }
  recomputeInitiallyAndOnChange(store, handleValue) {
    store.add(_recomputeInitiallyAndOnChange(this, handleValue));
    return this;
  }
  /**
   * Ensures that this observable is observed. This keeps the cache alive.
   * However, in case of deriveds, it does not force eager evaluation (only when the value is read/get).
   * Use `recomputeInitiallyAndOnChange` for eager evaluation.
   */
  keepObserved(store) {
    store.add(_keepObserved(this));
    return this;
  }
  get debugValue() {
    return this.get();
  }
  get debug() {
    return new DebugHelper(this);
  }
};
var DebugHelper = class {
  constructor(observable) {
    this.observable = observable;
  }
  getDependencyGraph() {
    return _debugGetObservableGraph(this.observable, { type: "dependencies" });
  }
  getObserverGraph() {
    return _debugGetObservableGraph(this.observable, { type: "observers" });
  }
};
var BaseObservable = class extends ConvenientObservable {
  constructor(debugLocation) {
    super();
    this._observers = /* @__PURE__ */ new Set();
    getLogger()?.handleObservableCreated(this, debugLocation);
  }
  addObserver(observer) {
    const len = this._observers.size;
    this._observers.add(observer);
    if (len === 0) {
      this.onFirstObserverAdded();
    }
    if (len !== this._observers.size) {
      getLogger()?.handleOnListenerCountChanged(this, this._observers.size);
    }
  }
  removeObserver(observer) {
    const deleted = this._observers.delete(observer);
    if (deleted && this._observers.size === 0) {
      this.onLastObserverRemoved();
    }
    if (deleted) {
      getLogger()?.handleOnListenerCountChanged(this, this._observers.size);
    }
  }
  onFirstObserverAdded() {
  }
  onLastObserverRemoved() {
  }
  log() {
    const hadLogger = !!getLogger();
    logObservable(this);
    if (!hadLogger) {
      getLogger()?.handleObservableCreated(this, DebugLocation.ofCaller());
    }
    return this;
  }
  debugGetObservers() {
    return this._observers;
  }
};

// src/vs/base/common/observableInternal/observables/observableValue.ts
function observableValue(nameOrOwner, initialValue, debugLocation = DebugLocation.ofCaller()) {
  let debugNameData;
  if (typeof nameOrOwner === "string") {
    debugNameData = new DebugNameData(void 0, nameOrOwner, void 0);
  } else {
    debugNameData = new DebugNameData(nameOrOwner, void 0, void 0);
  }
  return new ObservableValue(debugNameData, initialValue, strictEquals, debugLocation);
}
var ObservableValue = class extends BaseObservable {
  constructor(_debugNameData, initialValue, _equalityComparator, debugLocation) {
    super(debugLocation);
    this._debugNameData = _debugNameData;
    this._equalityComparator = _equalityComparator;
    this._value = initialValue;
    getLogger()?.handleObservableUpdated(this, { hadValue: false, newValue: initialValue, change: void 0, didChange: true, oldValue: void 0 });
  }
  get debugName() {
    return this._debugNameData.getDebugName(this) ?? "ObservableValue";
  }
  get() {
    return this._value;
  }
  set(value, tx, change) {
    if (change === void 0 && this._equalityComparator(this._value, value)) {
      return;
    }
    let _tx;
    if (!tx) {
      tx = _tx = new TransactionImpl(() => {
      }, () => `Setting ${this.debugName}`);
    }
    try {
      const oldValue = this._value;
      this._setValue(value);
      getLogger()?.handleObservableUpdated(this, { oldValue, newValue: value, change, didChange: true, hadValue: true });
      for (const observer of this._observers) {
        tx.updateObserver(observer, this);
        observer.handleChange(this, change);
      }
    } finally {
      if (_tx) {
        _tx.finish();
      }
    }
  }
  toString() {
    return `${this.debugName}: ${this._value}`;
  }
  _setValue(newValue) {
    this._value = newValue;
  }
  debugGetState() {
    return {
      value: this._value
    };
  }
  debugSetValue(value) {
    this._value = value;
  }
};

// src/vs/base/common/observableInternal/reactions/autorunImpl.ts
function autorunStateToString(state) {
  switch (state) {
    case 1 /* dependenciesMightHaveChanged */:
      return "dependenciesMightHaveChanged";
    case 2 /* stale */:
      return "stale";
    case 3 /* upToDate */:
      return "upToDate";
    default:
      return "<unknown>";
  }
}
var AutorunObserver = class {
  constructor(_debugNameData, _runFn, _changeTracker, debugLocation) {
    this._debugNameData = _debugNameData;
    this._runFn = _runFn;
    this._changeTracker = _changeTracker;
    this._state = 2 /* stale */;
    this._updateCount = 0;
    this._disposed = false;
    this._dependencies = /* @__PURE__ */ new Set();
    this._dependenciesToBeRemoved = /* @__PURE__ */ new Set();
    this._isRunning = false;
    this._iteration = 0;
    this._store = void 0;
    this._delayedStore = void 0;
    this._changeSummary = this._changeTracker?.createChangeSummary(void 0);
    getLogger()?.handleAutorunCreated(this, debugLocation);
    this._run();
    trackDisposable(this);
  }
  get debugName() {
    return this._debugNameData.getDebugName(this) ?? "(anonymous)";
  }
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    for (const o of this._dependencies) {
      o.removeObserver(this);
    }
    this._dependencies.clear();
    if (this._store !== void 0) {
      this._store.dispose();
    }
    if (this._delayedStore !== void 0) {
      this._delayedStore.dispose();
    }
    getLogger()?.handleAutorunDisposed(this);
    markAsDisposed(this);
  }
  _run() {
    const emptySet = this._dependenciesToBeRemoved;
    this._dependenciesToBeRemoved = this._dependencies;
    this._dependencies = emptySet;
    this._state = 3 /* upToDate */;
    try {
      if (!this._disposed) {
        getLogger()?.handleAutorunStarted(this);
        const changeSummary = this._changeSummary;
        const delayedStore = this._delayedStore;
        if (delayedStore !== void 0) {
          this._delayedStore = void 0;
        }
        try {
          this._isRunning = true;
          if (this._changeTracker) {
            this._changeTracker.beforeUpdate?.(this, changeSummary);
            this._changeSummary = this._changeTracker.createChangeSummary(changeSummary);
          }
          if (this._store !== void 0) {
            this._store.dispose();
            this._store = void 0;
          }
          this._runFn(this, changeSummary);
        } catch (e) {
          onBugIndicatingError(e);
        } finally {
          this._isRunning = false;
          if (delayedStore !== void 0) {
            delayedStore.dispose();
          }
        }
      }
    } finally {
      if (!this._disposed) {
        getLogger()?.handleAutorunFinished(this);
      }
      for (const o of this._dependenciesToBeRemoved) {
        o.removeObserver(this);
      }
      this._dependenciesToBeRemoved.clear();
    }
  }
  toString() {
    return `Autorun<${this.debugName}>`;
  }
  // IObserver implementation
  beginUpdate(_observable) {
    if (this._state === 3 /* upToDate */) {
      this._checkIterations();
      this._state = 1 /* dependenciesMightHaveChanged */;
    }
    this._updateCount++;
  }
  endUpdate(_observable) {
    try {
      if (this._updateCount === 1) {
        this._iteration = 1;
        do {
          if (this._checkIterations()) {
            return;
          }
          if (this._state === 1 /* dependenciesMightHaveChanged */) {
            this._state = 3 /* upToDate */;
            for (const d of this._dependencies) {
              d.reportChanges();
              if (this._state === 2 /* stale */) {
                break;
              }
            }
          }
          this._iteration++;
          if (this._state !== 3 /* upToDate */) {
            this._run();
          }
        } while (this._state !== 3 /* upToDate */);
      }
    } finally {
      this._updateCount--;
    }
    assertFn(() => this._updateCount >= 0);
  }
  handlePossibleChange(observable) {
    if (this._state === 3 /* upToDate */ && this._isDependency(observable)) {
      this._checkIterations();
      this._state = 1 /* dependenciesMightHaveChanged */;
    }
  }
  handleChange(observable, change) {
    if (this._isDependency(observable)) {
      getLogger()?.handleAutorunDependencyChanged(this, observable, change);
      try {
        const shouldReact = this._changeTracker ? this._changeTracker.handleChange({
          changedObservable: observable,
          change,
          // eslint-disable-next-line local/code-no-any-casts
          didChange: (o) => o === observable
        }, this._changeSummary) : true;
        if (shouldReact) {
          this._checkIterations();
          this._state = 2 /* stale */;
        }
      } catch (e) {
        onBugIndicatingError(e);
      }
    }
  }
  _isDependency(observable) {
    return this._dependencies.has(observable) && !this._dependenciesToBeRemoved.has(observable);
  }
  // IReader implementation
  _ensureNoRunning() {
    if (!this._isRunning) {
      throw new BugIndicatingError("The reader object cannot be used outside its compute function!");
    }
  }
  readObservable(observable) {
    this._ensureNoRunning();
    if (this._disposed) {
      return observable.get();
    }
    observable.addObserver(this);
    const value = observable.get();
    this._dependencies.add(observable);
    this._dependenciesToBeRemoved.delete(observable);
    return value;
  }
  get store() {
    this._ensureNoRunning();
    if (this._disposed) {
      throw new BugIndicatingError("Cannot access store after dispose");
    }
    if (this._store === void 0) {
      this._store = new DisposableStore();
    }
    return this._store;
  }
  get delayedStore() {
    this._ensureNoRunning();
    if (this._disposed) {
      throw new BugIndicatingError("Cannot access store after dispose");
    }
    if (this._delayedStore === void 0) {
      this._delayedStore = new DisposableStore();
    }
    return this._delayedStore;
  }
  debugGetState() {
    return {
      isRunning: this._isRunning,
      updateCount: this._updateCount,
      dependencies: this._dependencies,
      state: this._state,
      stateStr: autorunStateToString(this._state)
    };
  }
  debugRerun() {
    if (!this._isRunning) {
      this._run();
    } else {
      this._state = 2 /* stale */;
    }
  }
  _checkIterations() {
    if (this._iteration > 100) {
      onBugIndicatingError(new BugIndicatingError(`Autorun '${this.debugName}' is stuck in an infinite update loop.`));
      return true;
    }
    return false;
  }
};

// src/vs/base/common/observableInternal/reactions/autorun.ts
function autorun(fn, debugLocation = DebugLocation.ofCaller()) {
  return new AutorunObserver(
    new DebugNameData(void 0, void 0, fn),
    fn,
    void 0,
    debugLocation
  );
}

// src/vs/base/common/observableInternal/observables/derivedImpl.ts
function derivedStateToString(state) {
  switch (state) {
    case 0 /* initial */:
      return "initial";
    case 1 /* dependenciesMightHaveChanged */:
      return "dependenciesMightHaveChanged";
    case 2 /* stale */:
      return "stale";
    case 3 /* upToDate */:
      return "upToDate";
    default:
      return "<unknown>";
  }
}
var Derived = class extends BaseObservable {
  constructor(_debugNameData, _computeFn, _changeTracker, _handleLastObserverRemoved = void 0, _equalityComparator, debugLocation) {
    super(debugLocation);
    this._debugNameData = _debugNameData;
    this._computeFn = _computeFn;
    this._changeTracker = _changeTracker;
    this._handleLastObserverRemoved = _handleLastObserverRemoved;
    this._equalityComparator = _equalityComparator;
    this._state = 0 /* initial */;
    this._value = void 0;
    this._updateCount = 0;
    this._dependencies = /* @__PURE__ */ new Set();
    this._dependenciesToBeRemoved = /* @__PURE__ */ new Set();
    this._changeSummary = void 0;
    this._isUpdating = false;
    this._isComputing = false;
    this._didReportChange = false;
    this._isInBeforeUpdate = false;
    this._isReaderValid = false;
    this._store = void 0;
    this._delayedStore = void 0;
    this._removedObserverToCallEndUpdateOn = null;
    this._changeSummary = this._changeTracker?.createChangeSummary(void 0);
  }
  get debugName() {
    return this._debugNameData.getDebugName(this) ?? "(anonymous)";
  }
  onLastObserverRemoved() {
    this._state = 0 /* initial */;
    this._value = void 0;
    getLogger()?.handleDerivedCleared(this);
    for (const d of this._dependencies) {
      d.removeObserver(this);
    }
    this._dependencies.clear();
    if (this._store !== void 0) {
      this._store.dispose();
      this._store = void 0;
    }
    if (this._delayedStore !== void 0) {
      this._delayedStore.dispose();
      this._delayedStore = void 0;
    }
    this._handleLastObserverRemoved?.();
  }
  get() {
    const checkEnabled = false;
    if (this._isComputing && checkEnabled) {
      throw new BugIndicatingError("Cyclic deriveds are not supported yet!");
    }
    if (this._observers.size === 0) {
      let result;
      try {
        this._isReaderValid = true;
        let changeSummary = void 0;
        if (this._changeTracker) {
          changeSummary = this._changeTracker.createChangeSummary(void 0);
          this._changeTracker.beforeUpdate?.(this, changeSummary);
        }
        result = this._computeFn(this, changeSummary);
      } finally {
        this._isReaderValid = false;
      }
      this.onLastObserverRemoved();
      return result;
    } else {
      do {
        if (this._state === 1 /* dependenciesMightHaveChanged */) {
          for (const d of this._dependencies) {
            d.reportChanges();
            if (this._state === 2 /* stale */) {
              break;
            }
          }
        }
        if (this._state === 1 /* dependenciesMightHaveChanged */) {
          this._state = 3 /* upToDate */;
        }
        if (this._state !== 3 /* upToDate */) {
          this._recompute();
        }
      } while (this._state !== 3 /* upToDate */);
      return this._value;
    }
  }
  _recompute() {
    let didChange = false;
    this._isComputing = true;
    this._didReportChange = false;
    const emptySet = this._dependenciesToBeRemoved;
    this._dependenciesToBeRemoved = this._dependencies;
    this._dependencies = emptySet;
    try {
      const changeSummary = this._changeSummary;
      this._isReaderValid = true;
      if (this._changeTracker) {
        this._isInBeforeUpdate = true;
        this._changeTracker.beforeUpdate?.(this, changeSummary);
        this._isInBeforeUpdate = false;
        this._changeSummary = this._changeTracker?.createChangeSummary(changeSummary);
      }
      const hadValue = this._state !== 0 /* initial */;
      const oldValue = this._value;
      this._state = 3 /* upToDate */;
      const delayedStore = this._delayedStore;
      if (delayedStore !== void 0) {
        this._delayedStore = void 0;
      }
      try {
        if (this._store !== void 0) {
          this._store.dispose();
          this._store = void 0;
        }
        this._value = this._computeFn(this, changeSummary);
      } finally {
        this._isReaderValid = false;
        for (const o of this._dependenciesToBeRemoved) {
          o.removeObserver(this);
        }
        this._dependenciesToBeRemoved.clear();
        if (delayedStore !== void 0) {
          delayedStore.dispose();
        }
      }
      didChange = this._didReportChange || hadValue && !this._equalityComparator(oldValue, this._value);
      getLogger()?.handleObservableUpdated(this, {
        oldValue,
        newValue: this._value,
        change: void 0,
        didChange,
        hadValue
      });
    } catch (e) {
      onBugIndicatingError(e);
    }
    this._isComputing = false;
    if (!this._didReportChange && didChange) {
      for (const r of this._observers) {
        r.handleChange(this, void 0);
      }
    } else {
      this._didReportChange = false;
    }
  }
  toString() {
    return `LazyDerived<${this.debugName}>`;
  }
  // IObserver Implementation
  beginUpdate(_observable) {
    if (this._isUpdating) {
      throw new BugIndicatingError("Cyclic deriveds are not supported yet!");
    }
    this._updateCount++;
    this._isUpdating = true;
    try {
      const propagateBeginUpdate = this._updateCount === 1;
      if (this._state === 3 /* upToDate */) {
        this._state = 1 /* dependenciesMightHaveChanged */;
        if (!propagateBeginUpdate) {
          for (const r of this._observers) {
            r.handlePossibleChange(this);
          }
        }
      }
      if (propagateBeginUpdate) {
        for (const r of this._observers) {
          r.beginUpdate(this);
        }
      }
    } finally {
      this._isUpdating = false;
    }
  }
  endUpdate(_observable) {
    this._updateCount--;
    if (this._updateCount === 0) {
      const observers = [...this._observers];
      for (const r of observers) {
        r.endUpdate(this);
      }
      if (this._removedObserverToCallEndUpdateOn) {
        const observers2 = [...this._removedObserverToCallEndUpdateOn];
        this._removedObserverToCallEndUpdateOn = null;
        for (const r of observers2) {
          r.endUpdate(this);
        }
      }
    }
    assertFn(() => this._updateCount >= 0);
  }
  handlePossibleChange(observable) {
    if (this._state === 3 /* upToDate */ && this._dependencies.has(observable) && !this._dependenciesToBeRemoved.has(observable)) {
      this._state = 1 /* dependenciesMightHaveChanged */;
      for (const r of this._observers) {
        r.handlePossibleChange(this);
      }
    }
  }
  handleChange(observable, change) {
    if (this._dependencies.has(observable) && !this._dependenciesToBeRemoved.has(observable) || this._isInBeforeUpdate) {
      getLogger()?.handleDerivedDependencyChanged(this, observable, change);
      let shouldReact = false;
      try {
        shouldReact = this._changeTracker ? this._changeTracker.handleChange({
          changedObservable: observable,
          change,
          // eslint-disable-next-line local/code-no-any-casts
          didChange: (o) => o === observable
        }, this._changeSummary) : true;
      } catch (e) {
        onBugIndicatingError(e);
      }
      const wasUpToDate = this._state === 3 /* upToDate */;
      if (shouldReact && (this._state === 1 /* dependenciesMightHaveChanged */ || wasUpToDate)) {
        this._state = 2 /* stale */;
        if (wasUpToDate) {
          for (const r of this._observers) {
            r.handlePossibleChange(this);
          }
        }
      }
    }
  }
  // IReader Implementation
  _ensureReaderValid() {
    if (!this._isReaderValid) {
      throw new BugIndicatingError("The reader object cannot be used outside its compute function!");
    }
  }
  readObservable(observable) {
    this._ensureReaderValid();
    observable.addObserver(this);
    const value = observable.get();
    this._dependencies.add(observable);
    this._dependenciesToBeRemoved.delete(observable);
    return value;
  }
  reportChange(change) {
    this._ensureReaderValid();
    this._didReportChange = true;
    for (const r of this._observers) {
      r.handleChange(this, change);
    }
  }
  get store() {
    this._ensureReaderValid();
    if (this._store === void 0) {
      this._store = new DisposableStore();
    }
    return this._store;
  }
  get delayedStore() {
    this._ensureReaderValid();
    if (this._delayedStore === void 0) {
      this._delayedStore = new DisposableStore();
    }
    return this._delayedStore;
  }
  addObserver(observer) {
    const shouldCallBeginUpdate = !this._observers.has(observer) && this._updateCount > 0;
    super.addObserver(observer);
    if (shouldCallBeginUpdate) {
      if (!this._removedObserverToCallEndUpdateOn?.delete(observer)) {
        observer.beginUpdate(this);
      }
    }
  }
  removeObserver(observer) {
    if (this._observers.has(observer) && this._updateCount > 0) {
      if (!this._removedObserverToCallEndUpdateOn) {
        this._removedObserverToCallEndUpdateOn = /* @__PURE__ */ new Set();
      }
      this._removedObserverToCallEndUpdateOn.add(observer);
    }
    super.removeObserver(observer);
  }
  debugGetState() {
    return {
      state: this._state,
      stateStr: derivedStateToString(this._state),
      updateCount: this._updateCount,
      isComputing: this._isComputing,
      dependencies: this._dependencies,
      value: this._value
    };
  }
  debugSetValue(newValue) {
    this._value = newValue;
  }
  debugRecompute() {
    this.beginUpdate(this);
    try {
      if (!this._isComputing) {
        this._recompute();
      } else {
        this._state = 2 /* stale */;
      }
    } finally {
      this.endUpdate(this);
    }
  }
  setValue(newValue, tx, change) {
    this._value = newValue;
    const observers = this._observers;
    tx.updateObserver(this, this);
    for (const d of observers) {
      d.handleChange(this, change);
    }
  }
};

// src/vs/base/common/observableInternal/observables/derived.ts
function derivedOpts(options, computeFn, debugLocation = DebugLocation.ofCaller()) {
  return new Derived(
    new DebugNameData(options.owner, options.debugName, options.debugReferenceFn),
    computeFn,
    void 0,
    options.onLastObserverRemoved,
    options.equalsFn ?? strictEquals,
    debugLocation
  );
}
_setDerivedOpts(derivedOpts);

// src/vs/base/common/observableInternal/observables/observableFromEvent.ts
function observableFromEvent(...args) {
  let owner;
  let event;
  let getValue;
  let debugLocation;
  if (args.length === 2) {
    [event, getValue] = args;
  } else {
    [owner, event, getValue, debugLocation] = args;
  }
  return new FromEventObservable(
    new DebugNameData(owner, void 0, getValue),
    event,
    getValue,
    () => FromEventObservable.globalTransaction,
    strictEquals,
    debugLocation ?? DebugLocation.ofCaller()
  );
}
var FromEventObservable = class extends BaseObservable {
  constructor(_debugNameData, event, _getValue, _getTransaction, _equalityComparator, debugLocation) {
    super(debugLocation);
    this._debugNameData = _debugNameData;
    this.event = event;
    this._getValue = _getValue;
    this._getTransaction = _getTransaction;
    this._equalityComparator = _equalityComparator;
    this._hasValue = false;
    this.handleEvent = (args) => {
      const newValue = this._getValue(args);
      const oldValue = this._value;
      const didChange = !this._hasValue || !this._equalityComparator(oldValue, newValue);
      let didRunTransaction = false;
      if (didChange) {
        this._value = newValue;
        if (this._hasValue) {
          didRunTransaction = true;
          subtransaction(
            this._getTransaction(),
            (tx) => {
              getLogger()?.handleObservableUpdated(this, { oldValue, newValue, change: void 0, didChange, hadValue: this._hasValue });
              for (const o of this._observers) {
                tx.updateObserver(o, this);
                o.handleChange(this, void 0);
              }
            },
            () => {
              const name = this.getDebugName();
              return "Event fired" + (name ? `: ${name}` : "");
            }
          );
        }
        this._hasValue = true;
      }
      if (!didRunTransaction) {
        getLogger()?.handleObservableUpdated(this, { oldValue, newValue, change: void 0, didChange, hadValue: this._hasValue });
      }
    };
  }
  getDebugName() {
    return this._debugNameData.getDebugName(this);
  }
  get debugName() {
    const name = this.getDebugName();
    return "From Event" + (name ? `: ${name}` : "");
  }
  onFirstObserverAdded() {
    this._subscription = this.event(this.handleEvent);
  }
  onLastObserverRemoved() {
    this._subscription.dispose();
    this._subscription = void 0;
    this._hasValue = false;
    this._value = void 0;
  }
  get() {
    if (this._subscription) {
      if (!this._hasValue) {
        this.handleEvent(void 0);
      }
      return this._value;
    } else {
      const value = this._getValue(void 0);
      return value;
    }
  }
  debugSetValue(value) {
    this._value = value;
  }
  debugGetState() {
    return { value: this._value, hasValue: this._hasValue };
  }
};
((observableFromEvent2) => {
  observableFromEvent2.Observer = FromEventObservable;
  function batchEventsGlobally(tx, fn) {
    let didSet = false;
    if (FromEventObservable.globalTransaction === void 0) {
      FromEventObservable.globalTransaction = tx;
      didSet = true;
    }
    try {
      fn();
    } finally {
      if (didSet) {
        FromEventObservable.globalTransaction = void 0;
      }
    }
  }
  observableFromEvent2.batchEventsGlobally = batchEventsGlobally;
})(observableFromEvent || (observableFromEvent = {}));

// src/vs/base/common/observableInternal/utils/utils.ts
function keepObserved(observable) {
  const o = new KeepAliveObserver(false, void 0);
  observable.addObserver(o);
  return toDisposable(() => {
    observable.removeObserver(o);
  });
}
_setKeepObserved(keepObserved);
function recomputeInitiallyAndOnChange(observable, handleValue) {
  const o = new KeepAliveObserver(true, handleValue);
  observable.addObserver(o);
  try {
    o.beginUpdate(observable);
  } finally {
    o.endUpdate(observable);
  }
  return toDisposable(() => {
    observable.removeObserver(o);
  });
}
_setRecomputeInitiallyAndOnChange(recomputeInitiallyAndOnChange);
var KeepAliveObserver = class {
  constructor(_forceRecompute, _handleValue) {
    this._forceRecompute = _forceRecompute;
    this._handleValue = _handleValue;
    this._counter = 0;
  }
  beginUpdate(observable) {
    this._counter++;
  }
  endUpdate(observable) {
    if (this._counter === 1 && this._forceRecompute) {
      if (this._handleValue) {
        this._handleValue(observable.get());
      } else {
        observable.reportChanges();
      }
    }
    this._counter--;
  }
  handlePossibleChange(observable) {
  }
  handleChange(observable, change) {
  }
};

// src/vs/base/common/observableInternal/logging/consoleObservableLogger.ts
var consoleObservableLogger;
function logObservableToConsole(obs) {
  if (!consoleObservableLogger) {
    consoleObservableLogger = new ConsoleObservableLogger();
    addLogger(consoleObservableLogger);
  }
  consoleObservableLogger.addFilteredObj(obs);
}
var ConsoleObservableLogger = class {
  constructor() {
    this.indentation = 0;
    this.changedObservablesSets = /* @__PURE__ */ new WeakMap();
  }
  addFilteredObj(obj) {
    if (!this._filteredObjects) {
      this._filteredObjects = /* @__PURE__ */ new Set();
    }
    this._filteredObjects.add(obj);
  }
  _isIncluded(obj) {
    return this._filteredObjects?.has(obj) ?? true;
  }
  textToConsoleArgs(text) {
    return consoleTextToArgs([
      normalText(repeat("|  ", this.indentation)),
      text
    ]);
  }
  formatInfo(info) {
    if (!info.hadValue) {
      return [
        normalText(` `),
        styled(formatValue(info.newValue, 60), {
          color: "green"
        }),
        normalText(` (initial)`)
      ];
    }
    return info.didChange ? [
      normalText(` `),
      styled(formatValue(info.oldValue, 70), {
        color: "red",
        strikeThrough: true
      }),
      normalText(` `),
      styled(formatValue(info.newValue, 60), {
        color: "green"
      })
    ] : [normalText(` (unchanged)`)];
  }
  handleObservableCreated(observable) {
    if (observable instanceof Derived) {
      const derived2 = observable;
      this.changedObservablesSets.set(derived2, /* @__PURE__ */ new Set());
      const debugTrackUpdating = false;
      if (debugTrackUpdating) {
        const updating = [];
        derived2.__debugUpdating = updating;
        const existingBeginUpdate = derived2.beginUpdate;
        derived2.beginUpdate = (obs) => {
          updating.push(obs);
          return existingBeginUpdate.apply(derived2, [obs]);
        };
        const existingEndUpdate = derived2.endUpdate;
        derived2.endUpdate = (obs) => {
          const idx = updating.indexOf(obs);
          if (idx === -1) {
            console.error("endUpdate called without beginUpdate", derived2.debugName, obs.debugName);
          }
          updating.splice(idx, 1);
          return existingEndUpdate.apply(derived2, [obs]);
        };
      }
    }
  }
  handleOnListenerCountChanged(observable, newCount) {
  }
  handleObservableUpdated(observable, info) {
    if (!this._isIncluded(observable)) {
      return;
    }
    if (observable instanceof Derived) {
      this._handleDerivedRecomputed(observable, info);
      return;
    }
    console.log(...this.textToConsoleArgs([
      formatKind("observable value changed"),
      styled(observable.debugName, { color: "BlueViolet" }),
      ...this.formatInfo(info)
    ]));
  }
  formatChanges(changes) {
    if (changes.size === 0) {
      return void 0;
    }
    return styled(
      " (changed deps: " + [...changes].map((o) => o.debugName).join(", ") + ")",
      { color: "gray" }
    );
  }
  handleDerivedDependencyChanged(derived2, observable, change) {
    if (!this._isIncluded(derived2)) {
      return;
    }
    this.changedObservablesSets.get(derived2)?.add(observable);
  }
  _handleDerivedRecomputed(derived2, info) {
    if (!this._isIncluded(derived2)) {
      return;
    }
    const changedObservables = this.changedObservablesSets.get(derived2);
    if (!changedObservables) {
      return;
    }
    console.log(...this.textToConsoleArgs([
      formatKind("derived recomputed"),
      styled(derived2.debugName, { color: "BlueViolet" }),
      ...this.formatInfo(info),
      this.formatChanges(changedObservables),
      { data: [{ fn: derived2._debugNameData.referenceFn ?? derived2._computeFn }] }
    ]));
    changedObservables.clear();
  }
  handleDerivedCleared(derived2) {
    if (!this._isIncluded(derived2)) {
      return;
    }
    console.log(...this.textToConsoleArgs([
      formatKind("derived cleared"),
      styled(derived2.debugName, { color: "BlueViolet" })
    ]));
  }
  handleFromEventObservableTriggered(observable, info) {
    if (!this._isIncluded(observable)) {
      return;
    }
    console.log(...this.textToConsoleArgs([
      formatKind("observable from event triggered"),
      styled(observable.debugName, { color: "BlueViolet" }),
      ...this.formatInfo(info),
      { data: [{ fn: observable._getValue }] }
    ]));
  }
  handleAutorunCreated(autorun2) {
    if (!this._isIncluded(autorun2)) {
      return;
    }
    this.changedObservablesSets.set(autorun2, /* @__PURE__ */ new Set());
  }
  handleAutorunDisposed(autorun2) {
  }
  handleAutorunDependencyChanged(autorun2, observable, change) {
    if (!this._isIncluded(autorun2)) {
      return;
    }
    this.changedObservablesSets.get(autorun2).add(observable);
  }
  handleAutorunStarted(autorun2) {
    const changedObservables = this.changedObservablesSets.get(autorun2);
    if (!changedObservables) {
      return;
    }
    if (this._isIncluded(autorun2)) {
      console.log(...this.textToConsoleArgs([
        formatKind("autorun"),
        styled(autorun2.debugName, { color: "BlueViolet" }),
        this.formatChanges(changedObservables),
        { data: [{ fn: autorun2._debugNameData.referenceFn ?? autorun2._runFn }] }
      ]));
    }
    changedObservables.clear();
    this.indentation++;
  }
  handleAutorunFinished(autorun2) {
    this.indentation--;
  }
  handleBeginTransaction(transaction2) {
    let transactionName = transaction2.getDebugName();
    if (transactionName === void 0) {
      transactionName = "";
    }
    if (this._isIncluded(transaction2)) {
      console.log(...this.textToConsoleArgs([
        formatKind("transaction"),
        styled(transactionName, { color: "BlueViolet" }),
        { data: [{ fn: transaction2._fn }] }
      ]));
    }
    this.indentation++;
  }
  handleEndTransaction() {
    this.indentation--;
  }
};
function consoleTextToArgs(text) {
  const styles = new Array();
  const data = [];
  let firstArg = "";
  function process2(t) {
    if ("length" in t) {
      for (const item of t) {
        if (item) {
          process2(item);
        }
      }
    } else if ("text" in t) {
      firstArg += `%c${t.text}`;
      styles.push(t.style);
      if (t.data) {
        data.push(...t.data);
      }
    } else if ("data" in t) {
      data.push(...t.data);
    }
  }
  process2(text);
  const result = [firstArg, ...styles];
  result.push(...data);
  return result;
}
function normalText(text) {
  return styled(text, { color: "black" });
}
function formatKind(kind) {
  return styled(padStr(`${kind}: `, 10), { color: "black", bold: true });
}
function styled(text, options = {
  color: "black"
}) {
  function objToCss(styleObj) {
    return Object.entries(styleObj).reduce(
      (styleString, [propName, propValue]) => {
        return `${styleString}${propName}:${propValue};`;
      },
      ""
    );
  }
  const style = {
    color: options.color
  };
  if (options.strikeThrough) {
    style["text-decoration"] = "line-through";
  }
  if (options.bold) {
    style["font-weight"] = "bold";
  }
  return {
    text,
    style: objToCss(style)
  };
}
function formatValue(value, availableLen) {
  switch (typeof value) {
    case "number":
      return "" + value;
    case "string":
      if (value.length + 2 <= availableLen) {
        return `"${value}"`;
      }
      return `"${value.substr(0, availableLen - 7)}"+...`;
    case "boolean":
      return value ? "true" : "false";
    case "undefined":
      return "undefined";
    case "object":
      if (value === null) {
        return "null";
      }
      if (Array.isArray(value)) {
        return formatArray(value, availableLen);
      }
      return formatObject(value, availableLen);
    case "symbol":
      return value.toString();
    case "function":
      return `[[Function${value.name ? " " + value.name : ""}]]`;
    default:
      return "" + value;
  }
}
function formatArray(value, availableLen) {
  let result = "[ ";
  let first = true;
  for (const val of value) {
    if (!first) {
      result += ", ";
    }
    if (result.length - 5 > availableLen) {
      result += "...";
      break;
    }
    first = false;
    result += `${formatValue(val, availableLen - result.length)}`;
  }
  result += " ]";
  return result;
}
function formatObject(value, availableLen) {
  if (typeof value.toString === "function" && value.toString !== Object.prototype.toString) {
    const val = value.toString();
    if (val.length <= availableLen) {
      return val;
    }
    return val.substring(0, availableLen - 3) + "...";
  }
  const className = getClassName(value);
  let result = className ? className + "(" : "{ ";
  let first = true;
  for (const [key, val] of Object.entries(value)) {
    if (!first) {
      result += ", ";
    }
    if (result.length - 5 > availableLen) {
      result += "...";
      break;
    }
    first = false;
    result += `${key}: ${formatValue(val, availableLen - result.length)}`;
  }
  result += className ? ")" : " }";
  return result;
}
function repeat(str, count) {
  let result = "";
  for (let i = 1; i <= count; i++) {
    result += str;
  }
  return result;
}
function padStr(str, length) {
  while (str.length < length) {
    str += " ";
  }
  return str;
}

// src/vs/base/common/observableInternal/logging/debugger/rpc.ts
var SimpleTypedRpcConnection = class _SimpleTypedRpcConnection {
  constructor(_channelFactory, _getHandler) {
    this._channelFactory = _channelFactory;
    this._getHandler = _getHandler;
    this._channel = this._channelFactory({
      handleNotification: (notificationData) => {
        const m = notificationData;
        const fn = this._getHandler().notifications[m[0]];
        if (!fn) {
          throw new Error(`Unknown notification "${m[0]}"!`);
        }
        fn(...m[1]);
      },
      handleRequest: (requestData) => {
        const m = requestData;
        try {
          const result = this._getHandler().requests[m[0]](...m[1]);
          return { type: "result", value: result };
        } catch (e) {
          return { type: "error", value: e };
        }
      }
    });
    const requests = new Proxy({}, {
      get: (target, key) => {
        return async (...args) => {
          const result = await this._channel.sendRequest([key, args]);
          if (result.type === "error") {
            throw result.value;
          } else {
            return result.value;
          }
        };
      }
    });
    const notifications = new Proxy({}, {
      get: (target, key) => {
        return (...args) => {
          this._channel.sendNotification([key, args]);
        };
      }
    });
    this.api = { notifications, requests };
  }
  static createHost(channelFactory, getHandler) {
    return new _SimpleTypedRpcConnection(channelFactory, getHandler);
  }
  static createClient(channelFactory, getHandler) {
    return new _SimpleTypedRpcConnection(channelFactory, getHandler);
  }
};

// src/vs/base/common/observableInternal/logging/debugger/debuggerRpc.ts
function registerDebugChannel(channelId, createClient) {
  const g = globalThis;
  let queuedNotifications = [];
  let curHost = void 0;
  const { channel, handler } = createChannelFactoryFromDebugChannel({
    sendNotification: (data) => {
      if (curHost) {
        curHost.sendNotification(data);
      } else {
        queuedNotifications.push(data);
      }
    }
  });
  let curClient = void 0;
  (g.$$debugValueEditor_debugChannels ?? (g.$$debugValueEditor_debugChannels = {}))[channelId] = (host) => {
    curClient = createClient();
    curHost = host;
    for (const n of queuedNotifications) {
      host.sendNotification(n);
    }
    queuedNotifications = [];
    return handler;
  };
  return SimpleTypedRpcConnection.createClient(channel, () => {
    if (!curClient) {
      throw new Error("Not supported");
    }
    return curClient;
  });
}
function createChannelFactoryFromDebugChannel(host) {
  let h;
  const channel = (handler) => {
    h = handler;
    return {
      sendNotification: (data) => {
        host.sendNotification(data);
      },
      sendRequest: (data) => {
        throw new Error("not supported");
      }
    };
  };
  return {
    channel,
    handler: {
      handleRequest: (data) => {
        if (data.type === "notification") {
          return h?.handleNotification(data.data);
        } else {
          return h?.handleRequest(data.data);
        }
      }
    }
  };
}

// src/vs/base/common/observableInternal/logging/debugger/utils.ts
var Throttler = class {
  constructor() {
    this._timeout = void 0;
  }
  throttle(fn, timeoutMs) {
    if (this._timeout === void 0) {
      this._timeout = setTimeout(() => {
        this._timeout = void 0;
        fn();
      }, timeoutMs);
    }
  }
  dispose() {
    if (this._timeout !== void 0) {
      clearTimeout(this._timeout);
    }
  }
};
function deepAssign(target, source) {
  for (const key in source) {
    if (!!target[key] && typeof target[key] === "object" && !!source[key] && typeof source[key] === "object") {
      deepAssign(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}
function deepAssignDeleteNulls(target, source) {
  for (const key in source) {
    if (source[key] === null) {
      delete target[key];
    } else if (!!target[key] && typeof target[key] === "object" && !!source[key] && typeof source[key] === "object") {
      deepAssignDeleteNulls(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// src/vs/base/common/observableInternal/logging/debugger/devToolsLogger.ts
var DevToolsLogger = class _DevToolsLogger {
  constructor() {
    this._declarationId = 0;
    this._instanceId = 0;
    this._declarations = /* @__PURE__ */ new Map();
    this._instanceInfos = /* @__PURE__ */ new WeakMap();
    this._aliveInstances = /* @__PURE__ */ new Map();
    this._activeTransactions = /* @__PURE__ */ new Set();
    this._channel = registerDebugChannel("observableDevTools", () => {
      return {
        notifications: {
          setDeclarationIdFilter: (declarationIds) => {
          },
          logObservableValue: (observableId) => {
            console.log("logObservableValue", observableId);
          },
          flushUpdates: () => {
            this._flushUpdates();
          },
          resetUpdates: () => {
            this._pendingChanges = null;
            this._channel.api.notifications.handleChange(this._fullState, true);
          }
        },
        requests: {
          getDeclarations: () => {
            const result = {};
            for (const decl of this._declarations.values()) {
              result[decl.id] = decl;
            }
            return { decls: result };
          },
          getSummarizedInstances: () => {
            return null;
          },
          getObservableValueInfo: (instanceId) => {
            const obs = this._aliveInstances.get(instanceId);
            return {
              observers: [...obs.debugGetObservers()].map((d) => this._formatObserver(d)).filter(isDefined)
            };
          },
          getDerivedInfo: (instanceId) => {
            const d = this._aliveInstances.get(instanceId);
            return {
              dependencies: [...d.debugGetState().dependencies].map((d2) => this._formatObservable(d2)).filter(isDefined),
              observers: [...d.debugGetObservers()].map((d2) => this._formatObserver(d2)).filter(isDefined)
            };
          },
          getAutorunInfo: (instanceId) => {
            const obs = this._aliveInstances.get(instanceId);
            return {
              dependencies: [...obs.debugGetState().dependencies].map((d) => this._formatObservable(d)).filter(isDefined)
            };
          },
          getTransactionState: () => {
            return this.getTransactionState();
          },
          setValue: (instanceId, jsonValue) => {
            const obs = this._aliveInstances.get(instanceId);
            if (obs instanceof Derived) {
              obs.debugSetValue(jsonValue);
            } else if (obs instanceof ObservableValue) {
              obs.debugSetValue(jsonValue);
            } else if (obs instanceof FromEventObservable) {
              obs.debugSetValue(jsonValue);
            } else {
              throw new BugIndicatingError("Observable is not supported");
            }
            const observers = [...obs.debugGetObservers()];
            for (const d of observers) {
              d.beginUpdate(obs);
            }
            for (const d of observers) {
              d.handleChange(obs, void 0);
            }
            for (const d of observers) {
              d.endUpdate(obs);
            }
          },
          getValue: (instanceId) => {
            const obs = this._aliveInstances.get(instanceId);
            if (obs instanceof Derived) {
              return formatValue(obs.debugGetState().value, 200);
            } else if (obs instanceof ObservableValue) {
              return formatValue(obs.debugGetState().value, 200);
            }
            return void 0;
          },
          logValue: (instanceId) => {
            const obs = this._aliveInstances.get(instanceId);
            if (obs && "get" in obs) {
              console.log("Logged Value:", obs.get());
            } else {
              throw new BugIndicatingError("Observable is not supported");
            }
          },
          rerun: (instanceId) => {
            const obs = this._aliveInstances.get(instanceId);
            if (obs instanceof Derived) {
              obs.debugRecompute();
            } else if (obs instanceof AutorunObserver) {
              obs.debugRerun();
            } else {
              throw new BugIndicatingError("Observable is not supported");
            }
          }
        }
      };
    });
    this._pendingChanges = null;
    this._changeThrottler = new Throttler();
    this._fullState = {};
    this._flushUpdates = () => {
      if (this._pendingChanges !== null) {
        this._channel.api.notifications.handleChange(this._pendingChanges, false);
        this._pendingChanges = null;
      }
    };
    DebugLocation.enable();
  }
  static {
    this._instance = void 0;
  }
  static getInstance() {
    if (_DevToolsLogger._instance === void 0) {
      _DevToolsLogger._instance = new _DevToolsLogger();
    }
    return _DevToolsLogger._instance;
  }
  getTransactionState() {
    const affected = [];
    const txs = [...this._activeTransactions];
    if (txs.length === 0) {
      return void 0;
    }
    const observerQueue = txs.flatMap((t) => t.debugGetUpdatingObservers() ?? []).map((o) => o.observer);
    const processedObservers = /* @__PURE__ */ new Set();
    while (observerQueue.length > 0) {
      const observer = observerQueue.shift();
      if (processedObservers.has(observer)) {
        continue;
      }
      processedObservers.add(observer);
      const state = this._getInfo(observer, (d) => {
        if (!processedObservers.has(d)) {
          observerQueue.push(d);
        }
      });
      if (state) {
        affected.push(state);
      }
    }
    return { names: txs.map((t) => t.getDebugName() ?? "tx"), affected };
  }
  _getObservableInfo(observable) {
    const info = this._instanceInfos.get(observable);
    if (!info) {
      onUnexpectedError(new BugIndicatingError("No info found"));
      return void 0;
    }
    return info;
  }
  _getAutorunInfo(autorun2) {
    const info = this._instanceInfos.get(autorun2);
    if (!info) {
      onUnexpectedError(new BugIndicatingError("No info found"));
      return void 0;
    }
    return info;
  }
  _getInfo(observer, queue) {
    if (observer instanceof Derived) {
      const observersToUpdate = [...observer.debugGetObservers()];
      for (const o of observersToUpdate) {
        queue(o);
      }
      const info = this._getObservableInfo(observer);
      if (!info) {
        return;
      }
      const observerState = observer.debugGetState();
      const base = { name: observer.debugName, instanceId: info.instanceId, updateCount: observerState.updateCount };
      const changedDependencies = [...info.changedObservables].map((o) => this._instanceInfos.get(o)?.instanceId).filter(isDefined);
      if (observerState.isComputing) {
        return { ...base, type: "observable/derived", state: "updating", changedDependencies, initialComputation: false };
      }
      switch (observerState.state) {
        case 0 /* initial */:
          return { ...base, type: "observable/derived", state: "noValue" };
        case 3 /* upToDate */:
          return { ...base, type: "observable/derived", state: "upToDate" };
        case 2 /* stale */:
          return { ...base, type: "observable/derived", state: "stale", changedDependencies };
        case 1 /* dependenciesMightHaveChanged */:
          return { ...base, type: "observable/derived", state: "possiblyStale" };
      }
    } else if (observer instanceof AutorunObserver) {
      const info = this._getAutorunInfo(observer);
      if (!info) {
        return void 0;
      }
      const base = { name: observer.debugName, instanceId: info.instanceId, updateCount: info.updateCount };
      const changedDependencies = [...info.changedObservables].map((o) => this._instanceInfos.get(o).instanceId);
      if (observer.debugGetState().isRunning) {
        return { ...base, type: "autorun", state: "updating", changedDependencies };
      }
      switch (observer.debugGetState().state) {
        case 3 /* upToDate */:
          return { ...base, type: "autorun", state: "upToDate" };
        case 2 /* stale */:
          return { ...base, type: "autorun", state: "stale", changedDependencies };
        case 1 /* dependenciesMightHaveChanged */:
          return { ...base, type: "autorun", state: "possiblyStale" };
      }
    }
    return void 0;
  }
  _formatObservable(obs) {
    const info = this._getObservableInfo(obs);
    if (!info) {
      return void 0;
    }
    return { name: obs.debugName, instanceId: info.instanceId };
  }
  _formatObserver(obs) {
    if (obs instanceof Derived) {
      return { name: obs.toString(), instanceId: this._getObservableInfo(obs)?.instanceId };
    }
    const autorunInfo = this._getAutorunInfo(obs);
    if (autorunInfo) {
      return { name: obs.toString(), instanceId: autorunInfo.instanceId };
    }
    return void 0;
  }
  _handleChange(update) {
    deepAssignDeleteNulls(this._fullState, update);
    if (this._pendingChanges === null) {
      this._pendingChanges = update;
    } else {
      deepAssign(this._pendingChanges, update);
    }
    this._changeThrottler.throttle(this._flushUpdates, 10);
  }
  _getDeclarationId(type, location) {
    if (!location) {
      return -1;
    }
    let decInfo = this._declarations.get(location.id);
    if (decInfo === void 0) {
      decInfo = {
        id: this._declarationId++,
        type,
        url: location.fileName,
        line: location.line,
        column: location.column
      };
      this._declarations.set(location.id, decInfo);
      this._handleChange({ decls: { [decInfo.id]: decInfo } });
    }
    return decInfo.id;
  }
  handleObservableCreated(observable, location) {
    const declarationId = this._getDeclarationId("observable/value", location);
    const info = {
      declarationId,
      instanceId: this._instanceId++,
      listenerCount: 0,
      lastValue: void 0,
      updateCount: 0,
      changedObservables: /* @__PURE__ */ new Set()
    };
    this._instanceInfos.set(observable, info);
  }
  handleOnListenerCountChanged(observable, newCount) {
    const info = this._getObservableInfo(observable);
    if (!info) {
      return;
    }
    if (info.listenerCount === 0 && newCount > 0) {
      const type = observable instanceof Derived ? "observable/derived" : "observable/value";
      this._aliveInstances.set(info.instanceId, observable);
      this._handleChange({
        instances: {
          [info.instanceId]: {
            instanceId: info.instanceId,
            declarationId: info.declarationId,
            formattedValue: info.lastValue,
            type,
            name: observable.debugName
          }
        }
      });
    } else if (info.listenerCount > 0 && newCount === 0) {
      this._handleChange({
        instances: { [info.instanceId]: null }
      });
      this._aliveInstances.delete(info.instanceId);
    }
    info.listenerCount = newCount;
  }
  handleObservableUpdated(observable, changeInfo) {
    if (observable instanceof Derived) {
      this._handleDerivedRecomputed(observable, changeInfo);
      return;
    }
    const info = this._getObservableInfo(observable);
    if (info) {
      if (changeInfo.didChange) {
        info.lastValue = formatValue(changeInfo.newValue, 30);
        if (info.listenerCount > 0) {
          this._handleChange({
            instances: { [info.instanceId]: { formattedValue: info.lastValue } }
          });
        }
      }
    }
  }
  handleAutorunCreated(autorun2, location) {
    const declarationId = this._getDeclarationId("autorun", location);
    const info = {
      declarationId,
      instanceId: this._instanceId++,
      updateCount: 0,
      changedObservables: /* @__PURE__ */ new Set()
    };
    this._instanceInfos.set(autorun2, info);
    this._aliveInstances.set(info.instanceId, autorun2);
    if (info) {
      this._handleChange({
        instances: {
          [info.instanceId]: {
            instanceId: info.instanceId,
            declarationId: info.declarationId,
            runCount: 0,
            type: "autorun",
            name: autorun2.debugName
          }
        }
      });
    }
  }
  handleAutorunDisposed(autorun2) {
    const info = this._getAutorunInfo(autorun2);
    if (!info) {
      return;
    }
    this._handleChange({
      instances: { [info.instanceId]: null }
    });
    this._instanceInfos.delete(autorun2);
    this._aliveInstances.delete(info.instanceId);
  }
  handleAutorunDependencyChanged(autorun2, observable, change) {
    const info = this._getAutorunInfo(autorun2);
    if (!info) {
      return;
    }
    info.changedObservables.add(observable);
  }
  handleAutorunStarted(autorun2) {
  }
  handleAutorunFinished(autorun2) {
    const info = this._getAutorunInfo(autorun2);
    if (!info) {
      return;
    }
    info.changedObservables.clear();
    info.updateCount++;
    this._handleChange({
      instances: { [info.instanceId]: { runCount: info.updateCount } }
    });
  }
  handleDerivedDependencyChanged(derived2, observable, change) {
    const info = this._getObservableInfo(derived2);
    if (info) {
      info.changedObservables.add(observable);
    }
  }
  _handleDerivedRecomputed(observable, changeInfo) {
    const info = this._getObservableInfo(observable);
    if (!info) {
      return;
    }
    const formattedValue = formatValue(changeInfo.newValue, 30);
    info.updateCount++;
    info.changedObservables.clear();
    info.lastValue = formattedValue;
    if (info.listenerCount > 0) {
      this._handleChange({
        instances: { [info.instanceId]: { formattedValue, recomputationCount: info.updateCount } }
      });
    }
  }
  handleDerivedCleared(observable) {
    const info = this._getObservableInfo(observable);
    if (!info) {
      return;
    }
    info.lastValue = void 0;
    info.changedObservables.clear();
    if (info.listenerCount > 0) {
      this._handleChange({
        instances: {
          [info.instanceId]: {
            formattedValue: void 0
          }
        }
      });
    }
  }
  handleBeginTransaction(transaction2) {
    this._activeTransactions.add(transaction2);
  }
  handleEndTransaction(transaction2) {
    this._activeTransactions.delete(transaction2);
  }
};

// src/vs/base/common/observableInternal/logging/debugGetDependencyGraph.ts
function debugGetObservableGraph(obs, options) {
  const debugNamePostProcessor = options?.debugNamePostProcessor ?? ((str) => str);
  const info = Info.from(obs, debugNamePostProcessor);
  if (!info) {
    return "";
  }
  const alreadyListed = /* @__PURE__ */ new Set();
  if (options.type === "observers") {
    return formatObservableInfoWithObservers(info, 0, alreadyListed, options).trim();
  } else {
    return formatObservableInfoWithDependencies(info, 0, alreadyListed, options).trim();
  }
}
function formatObservableInfoWithDependencies(info, indentLevel, alreadyListed, options) {
  const indent = "		".repeat(indentLevel);
  const lines = [];
  const isAlreadyListed = alreadyListed.has(info.sourceObj);
  if (isAlreadyListed) {
    lines.push(`${indent}* ${info.type} ${info.name} (already listed)`);
    return lines.join("\n");
  }
  alreadyListed.add(info.sourceObj);
  lines.push(`${indent}* ${info.type} ${info.name}:`);
  lines.push(`${indent}  value: ${formatValue(info.value, 50)}`);
  lines.push(`${indent}  state: ${info.state}`);
  if (info.dependencies.length > 0) {
    lines.push(`${indent}  dependencies:`);
    for (const dep of info.dependencies) {
      const info2 = Info.from(dep, options.debugNamePostProcessor ?? ((name) => name)) ?? Info.unknown(dep);
      lines.push(formatObservableInfoWithDependencies(info2, indentLevel + 1, alreadyListed, options));
    }
  }
  return lines.join("\n");
}
function formatObservableInfoWithObservers(info, indentLevel, alreadyListed, options) {
  const indent = "		".repeat(indentLevel);
  const lines = [];
  const isAlreadyListed = alreadyListed.has(info.sourceObj);
  if (isAlreadyListed) {
    lines.push(`${indent}* ${info.type} ${info.name} (already listed)`);
    return lines.join("\n");
  }
  alreadyListed.add(info.sourceObj);
  lines.push(`${indent}* ${info.type} ${info.name}:`);
  lines.push(`${indent}  value: ${formatValue(info.value, 50)}`);
  lines.push(`${indent}  state: ${info.state}`);
  if (info.observers.length > 0) {
    lines.push(`${indent}  observers:`);
    for (const observer of info.observers) {
      const info2 = Info.from(observer, options.debugNamePostProcessor ?? ((name) => name)) ?? Info.unknown(observer);
      lines.push(formatObservableInfoWithObservers(info2, indentLevel + 1, alreadyListed, options));
    }
  }
  return lines.join("\n");
}
var Info = class _Info {
  constructor(sourceObj, name, type, value, state, dependencies, observers) {
    this.sourceObj = sourceObj;
    this.name = name;
    this.type = type;
    this.value = value;
    this.state = state;
    this.dependencies = dependencies;
    this.observers = observers;
  }
  static from(obs, debugNamePostProcessor) {
    if (obs instanceof AutorunObserver) {
      const state = obs.debugGetState();
      return new _Info(
        obs,
        debugNamePostProcessor(obs.debugName),
        "autorun",
        void 0,
        state.stateStr,
        Array.from(state.dependencies),
        []
      );
    } else if (obs instanceof Derived) {
      const state = obs.debugGetState();
      return new _Info(
        obs,
        debugNamePostProcessor(obs.debugName),
        "derived",
        state.value,
        state.stateStr,
        Array.from(state.dependencies),
        Array.from(obs.debugGetObservers())
      );
    } else if (obs instanceof ObservableValue) {
      const state = obs.debugGetState();
      return new _Info(
        obs,
        debugNamePostProcessor(obs.debugName),
        "observableValue",
        state.value,
        "upToDate",
        [],
        Array.from(obs.debugGetObservers())
      );
    } else if (obs instanceof FromEventObservable) {
      const state = obs.debugGetState();
      return new _Info(
        obs,
        debugNamePostProcessor(obs.debugName),
        "fromEvent",
        state.value,
        state.hasValue ? "upToDate" : "initial",
        [],
        Array.from(obs.debugGetObservers())
      );
    }
    return void 0;
  }
  static unknown(obs) {
    return new _Info(
      obs,
      "(unknown)",
      "unknown",
      void 0,
      "unknown",
      [],
      []
    );
  }
};

// src/vs/base/common/observableInternal/index.ts
_setDebugGetObservableGraph(debugGetObservableGraph);
setLogObservableFn(logObservableToConsole);
var enableLogging = false;
if (enableLogging) {
  addLogger(new ConsoleObservableLogger());
}
if (env && env["VSCODE_DEV_DEBUG_OBSERVABLES"]) {
  addLogger(DevToolsLogger.getInstance());
}

// src/vs/platform/agentHost/common/state/sessionState.ts
var ROOT_STATE_URI = URI.from({ scheme: "agenthost", path: "/root" });
function createRootState() {
  return {
    agents: []
  };
}
function createSessionState(summary) {
  return {
    summary,
    lifecycle: "creating" /* Creating */,
    turns: [],
    activeTurn: void 0
  };
}
function createActiveTurn(id2, userMessage) {
  return {
    id: id2,
    userMessage,
    streamingText: "",
    responseParts: [],
    toolCalls: /* @__PURE__ */ new Map(),
    pendingPermissions: /* @__PURE__ */ new Map(),
    reasoning: "",
    usage: void 0
  };
}

// src/vs/platform/agentHost/node/agentEventMapper.ts
function mapProgressEventToAction(event, session, turnId) {
  switch (event.type) {
    case "delta":
      return {
        type: "session/delta",
        session,
        turnId,
        content: event.content
      };
    case "tool_start": {
      const e = event;
      return {
        type: "session/toolStart",
        session,
        turnId,
        toolCall: {
          toolCallId: e.toolCallId,
          toolName: e.toolName,
          displayName: e.displayName,
          invocationMessage: e.invocationMessage,
          toolInput: e.toolInput,
          toolKind: e.toolKind,
          language: e.language,
          toolArguments: e.toolArguments,
          status: "running" /* Running */
        }
      };
    }
    case "tool_complete": {
      const e = event;
      return {
        type: "session/toolComplete",
        session,
        turnId,
        toolCallId: e.toolCallId,
        result: {
          success: e.success,
          pastTenseMessage: e.pastTenseMessage,
          toolOutput: e.toolOutput,
          error: e.error
        }
      };
    }
    case "idle":
      return {
        type: "session/turnComplete",
        session,
        turnId
      };
    case "error": {
      const e = event;
      return {
        type: "session/error",
        session,
        turnId,
        error: {
          errorType: e.errorType,
          message: e.message,
          stack: e.stack
        }
      };
    }
    case "usage": {
      const e = event;
      return {
        type: "session/usage",
        session,
        turnId,
        usage: {
          inputTokens: e.inputTokens,
          outputTokens: e.outputTokens,
          model: e.model,
          cacheReadTokens: e.cacheReadTokens
        }
      };
    }
    case "title_changed":
      return {
        type: "session/titleChanged",
        session,
        title: event.title
      };
    case "permission_request": {
      const e = event;
      return {
        type: "session/permissionRequest",
        session,
        turnId,
        request: {
          requestId: e.requestId,
          permissionKind: e.permissionKind,
          toolCallId: e.toolCallId,
          path: e.path,
          fullCommandText: e.fullCommandText,
          intention: e.intention,
          serverName: e.serverName,
          toolName: e.toolName,
          rawRequest: e.rawRequest
        }
      };
    }
    case "reasoning":
      return {
        type: "session/reasoning",
        session,
        turnId,
        content: event.content
      };
    case "message":
      return void 0;
    default:
      return void 0;
  }
}

// src/vs/platform/agentHost/node/agentSideEffects.ts
var AgentSideEffects = class extends Disposable {
  constructor(_stateManager, _options, _logService) {
    super();
    this._stateManager = _stateManager;
    this._options = _options;
    this._logService = _logService;
    /** Maps pending permission request IDs to the provider that issued them. */
    this._pendingPermissions = /* @__PURE__ */ new Map();
    this._register(autorun((reader) => {
      const agents = this._options.agents.read(reader);
      this._publishAgentInfos(agents);
    }));
  }
  /**
   * Fetches models from all agents and dispatches `root/agentsChanged`.
   */
  async _publishAgentInfos(agents) {
    const infos = await Promise.all(agents.map(async (a) => {
      const d = a.getDescriptor();
      let models;
      try {
        const rawModels = await a.listModels();
        models = rawModels.map((m) => ({
          id: m.id,
          provider: m.provider,
          name: m.name,
          maxContextWindow: m.maxContextWindow,
          supportsVision: m.supportsVision,
          policyState: m.policyState
        }));
      } catch {
        models = [];
      }
      return { provider: d.provider, displayName: d.displayName, description: d.description, models };
    }));
    this._stateManager.dispatchServerAction({ type: "root/agentsChanged", agents: infos });
  }
  // ---- Agent registration -------------------------------------------------
  /**
   * Registers a progress-event listener on the given agent so that
   * `IAgentProgressEvent`s are mapped to protocol actions and dispatched
   * through the state manager. Returns a disposable that removes the
   * listener.
   */
  registerProgressListener(agent) {
    const disposables = new DisposableStore();
    disposables.add(agent.onDidSessionProgress((e) => {
      if (e.type === "permission_request") {
        this._pendingPermissions.set(e.requestId, agent.id);
      }
      const turnId = this._stateManager.getActiveTurnId(e.session);
      if (turnId) {
        const action = mapProgressEventToAction(e, e.session, turnId);
        if (action) {
          this._stateManager.dispatchServerAction(action);
        }
      }
    }));
    return disposables;
  }
  // ---- IProtocolSideEffectHandler -----------------------------------------
  handleAction(action) {
    switch (action.type) {
      case "session/turnStarted": {
        const agent = this._options.getAgent(action.session);
        if (!agent) {
          this._stateManager.dispatchServerAction({
            type: "session/error",
            session: action.session,
            turnId: action.turnId,
            error: { errorType: "noAgent", message: "No agent found for session" }
          });
          return;
        }
        const attachments = action.userMessage.attachments?.map((a) => ({
          type: a.type,
          path: a.path,
          displayName: a.displayName
        }));
        agent.sendMessage(action.session, action.userMessage.text, attachments).catch((err) => {
          this._logService.error("[AgentSideEffects] sendMessage failed", err);
          this._stateManager.dispatchServerAction({
            type: "session/error",
            session: action.session,
            turnId: action.turnId,
            error: { errorType: "sendFailed", message: String(err) }
          });
        });
        break;
      }
      case "session/permissionResolved": {
        const providerId = this._pendingPermissions.get(action.requestId);
        if (providerId) {
          this._pendingPermissions.delete(action.requestId);
          const agent = this._options.agents.get().find((a) => a.id === providerId);
          agent?.respondToPermissionRequest(action.requestId, action.approved);
        } else {
          this._logService.warn(`[AgentSideEffects] No pending permission request for: ${action.requestId}`);
        }
        break;
      }
      case "session/turnCancelled": {
        const agent = this._options.getAgent(action.session);
        agent?.abortSession(action.session).catch((err) => {
          this._logService.error("[AgentSideEffects] abortSession failed", err);
        });
        break;
      }
      case "session/modelChanged": {
        const agent = this._options.getAgent(action.session);
        agent?.changeModel?.(action.session, action.model).catch((err) => {
          this._logService.error("[AgentSideEffects] changeModel failed", err);
        });
        break;
      }
    }
  }
  async handleCreateSession(command) {
    const provider = command.provider;
    if (!provider) {
      throw new Error("No provider specified for session creation");
    }
    const agent = this._options.agents.get().find((a) => a.id === provider);
    if (!agent) {
      throw new Error(`No agent registered for provider: ${provider}`);
    }
    const session = await agent.createSession({
      provider,
      model: command.model,
      workingDirectory: command.workingDirectory
    });
    const summary = {
      resource: session,
      provider,
      title: "Session",
      status: "idle" /* Idle */,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
    this._stateManager.createSession(summary);
    this._stateManager.dispatchServerAction({ type: "session/ready", session });
  }
  handleDisposeSession(session) {
    const agent = this._options.getAgent(session);
    agent?.disposeSession(session).catch(() => {
    });
    this._stateManager.removeSession(session);
  }
  async handleListSessions() {
    const allSessions = [];
    for (const agent of this._options.agents.get()) {
      const sessions = await agent.listSessions();
      const provider = agent.id;
      for (const s of sessions) {
        allSessions.push({
          resource: s.session,
          provider,
          title: s.summary ?? "Session",
          status: "idle" /* Idle */,
          createdAt: s.startTime,
          modifiedAt: s.modifiedTime
        });
      }
    }
    return allSessions;
  }
  dispose() {
    this._pendingPermissions.clear();
    super.dispose();
  }
};

// src/vs/base/common/errorMessage.ts
function exceptionToErrorMessage(exception, verbose) {
  if (verbose && (exception.stack || exception.stacktrace)) {
    return localize(116, null, detectSystemErrorMessage(exception), stackToString(exception.stack) || stackToString(exception.stacktrace));
  }
  return detectSystemErrorMessage(exception);
}
function stackToString(stack) {
  if (Array.isArray(stack)) {
    return stack.join("\n");
  }
  return stack;
}
function detectSystemErrorMessage(exception) {
  if (exception.code === "ERR_UNC_HOST_NOT_ALLOWED") {
    return `${exception.message}. Please update the 'security.allowedUNCHosts' setting if you want to allow this host.`;
  }
  if (typeof exception.code === "string" && typeof exception.errno === "number" && typeof exception.syscall === "string") {
    return localize(115, null, exception.message);
  }
  return exception.message || localize(113, null);
}
function toErrorMessage(error = null, verbose = false) {
  if (!error) {
    return localize(113, null);
  }
  if (Array.isArray(error)) {
    const errors = coalesce(error);
    const msg = toErrorMessage(errors[0], verbose);
    if (errors.length > 1) {
      return localize(114, null, msg, errors.length);
    }
    return msg;
  }
  if (isString(error)) {
    return error;
  }
  if (error.detail) {
    const detail = error.detail;
    if (detail.error) {
      return exceptionToErrorMessage(detail.error, verbose);
    }
    if (detail.exception) {
      return exceptionToErrorMessage(detail.exception, verbose);
    }
  }
  if (error.stack) {
    return exceptionToErrorMessage(error, verbose);
  }
  if (error.message) {
    return error.message;
  }
  return localize(113, null);
}

// src/vs/base/common/hash.ts
function hash(obj) {
  return doHash(obj, 0);
}
function doHash(obj, hashVal) {
  switch (typeof obj) {
    case "object":
      if (obj === null) {
        return numberHash(349, hashVal);
      } else if (Array.isArray(obj)) {
        return arrayHash(obj, hashVal);
      }
      return objectHash(obj, hashVal);
    case "string":
      return stringHash(obj, hashVal);
    case "boolean":
      return booleanHash(obj, hashVal);
    case "number":
      return numberHash(obj, hashVal);
    case "undefined":
      return numberHash(937, hashVal);
    default:
      return numberHash(617, hashVal);
  }
}
function numberHash(val, initialHashVal) {
  return (initialHashVal << 5) - initialHashVal + val | 0;
}
function booleanHash(b, initialHashVal) {
  return numberHash(b ? 433 : 863, initialHashVal);
}
function stringHash(s, hashVal) {
  hashVal = numberHash(149417, hashVal);
  for (let i = 0, length = s.length; i < length; i++) {
    hashVal = numberHash(s.charCodeAt(i), hashVal);
  }
  return hashVal;
}
function arrayHash(arr, initialHashVal) {
  initialHashVal = numberHash(104579, initialHashVal);
  return arr.reduce((hashVal, item) => doHash(item, hashVal), initialHashVal);
}
function objectHash(obj, initialHashVal) {
  initialHashVal = numberHash(181387, initialHashVal);
  return Object.keys(obj).sort().reduce((hashVal, key) => {
    hashVal = stringHash(key, hashVal);
    return doHash(obj[key], hashVal);
  }, initialHashVal);
}
function leftRotate(value, bits, totalBits = 32) {
  const delta = totalBits - bits;
  const mask = ~((1 << delta) - 1);
  return (value << bits | (mask & value) >>> delta) >>> 0;
}
function toHexString(bufferOrValue, bitsize = 32) {
  if (bufferOrValue instanceof ArrayBuffer) {
    return encodeHex(VSBuffer.wrap(new Uint8Array(bufferOrValue)));
  }
  return (bufferOrValue >>> 0).toString(16).padStart(bitsize / 4, "0");
}
var StringSHA1 = class _StringSHA1 {
  constructor() {
    // 80 * 4 = 320
    this._h0 = 1732584193;
    this._h1 = 4023233417;
    this._h2 = 2562383102;
    this._h3 = 271733878;
    this._h4 = 3285377520;
    this._buff = new Uint8Array(
      64 /* BLOCK_SIZE */ + 3
      /* to fit any utf-8 */
    );
    this._buffDV = new DataView(this._buff.buffer);
    this._buffLen = 0;
    this._totalLen = 0;
    this._leftoverHighSurrogate = 0;
    this._finished = false;
  }
  static {
    this._bigBlock32 = new DataView(new ArrayBuffer(320));
  }
  update(str) {
    const strLen = str.length;
    if (strLen === 0) {
      return;
    }
    const buff = this._buff;
    let buffLen = this._buffLen;
    let leftoverHighSurrogate = this._leftoverHighSurrogate;
    let charCode;
    let offset;
    if (leftoverHighSurrogate !== 0) {
      charCode = leftoverHighSurrogate;
      offset = -1;
      leftoverHighSurrogate = 0;
    } else {
      charCode = str.charCodeAt(0);
      offset = 0;
    }
    while (true) {
      let codePoint = charCode;
      if (isHighSurrogate(charCode)) {
        if (offset + 1 < strLen) {
          const nextCharCode = str.charCodeAt(offset + 1);
          if (isLowSurrogate(nextCharCode)) {
            offset++;
            codePoint = computeCodePoint(charCode, nextCharCode);
          } else {
            codePoint = 65533 /* UNICODE_REPLACEMENT */;
          }
        } else {
          leftoverHighSurrogate = charCode;
          break;
        }
      } else if (isLowSurrogate(charCode)) {
        codePoint = 65533 /* UNICODE_REPLACEMENT */;
      }
      buffLen = this._push(buff, buffLen, codePoint);
      offset++;
      if (offset < strLen) {
        charCode = str.charCodeAt(offset);
      } else {
        break;
      }
    }
    this._buffLen = buffLen;
    this._leftoverHighSurrogate = leftoverHighSurrogate;
  }
  _push(buff, buffLen, codePoint) {
    if (codePoint < 128) {
      buff[buffLen++] = codePoint;
    } else if (codePoint < 2048) {
      buff[buffLen++] = 192 | (codePoint & 1984) >>> 6;
      buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
    } else if (codePoint < 65536) {
      buff[buffLen++] = 224 | (codePoint & 61440) >>> 12;
      buff[buffLen++] = 128 | (codePoint & 4032) >>> 6;
      buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
    } else {
      buff[buffLen++] = 240 | (codePoint & 1835008) >>> 18;
      buff[buffLen++] = 128 | (codePoint & 258048) >>> 12;
      buff[buffLen++] = 128 | (codePoint & 4032) >>> 6;
      buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
    }
    if (buffLen >= 64 /* BLOCK_SIZE */) {
      this._step();
      buffLen -= 64 /* BLOCK_SIZE */;
      this._totalLen += 64 /* BLOCK_SIZE */;
      buff[0] = buff[64 /* BLOCK_SIZE */ + 0];
      buff[1] = buff[64 /* BLOCK_SIZE */ + 1];
      buff[2] = buff[64 /* BLOCK_SIZE */ + 2];
    }
    return buffLen;
  }
  digest() {
    if (!this._finished) {
      this._finished = true;
      if (this._leftoverHighSurrogate) {
        this._leftoverHighSurrogate = 0;
        this._buffLen = this._push(this._buff, this._buffLen, 65533 /* UNICODE_REPLACEMENT */);
      }
      this._totalLen += this._buffLen;
      this._wrapUp();
    }
    return toHexString(this._h0) + toHexString(this._h1) + toHexString(this._h2) + toHexString(this._h3) + toHexString(this._h4);
  }
  _wrapUp() {
    this._buff[this._buffLen++] = 128;
    this._buff.subarray(this._buffLen).fill(0);
    if (this._buffLen > 56) {
      this._step();
      this._buff.fill(0);
    }
    const ml = 8 * this._totalLen;
    this._buffDV.setUint32(56, Math.floor(ml / 4294967296), false);
    this._buffDV.setUint32(60, ml % 4294967296, false);
    this._step();
  }
  _step() {
    const bigBlock32 = _StringSHA1._bigBlock32;
    const data = this._buffDV;
    for (let j = 0; j < 64; j += 4) {
      bigBlock32.setUint32(j, data.getUint32(j, false), false);
    }
    for (let j = 64; j < 320; j += 4) {
      bigBlock32.setUint32(j, leftRotate(bigBlock32.getUint32(j - 12, false) ^ bigBlock32.getUint32(j - 32, false) ^ bigBlock32.getUint32(j - 56, false) ^ bigBlock32.getUint32(j - 64, false), 1), false);
    }
    let a = this._h0;
    let b = this._h1;
    let c = this._h2;
    let d = this._h3;
    let e = this._h4;
    let f, k;
    let temp;
    for (let j = 0; j < 80; j++) {
      if (j < 20) {
        f = b & c | ~b & d;
        k = 1518500249;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 1859775393;
      } else if (j < 60) {
        f = b & c | b & d | c & d;
        k = 2400959708;
      } else {
        f = b ^ c ^ d;
        k = 3395469782;
      }
      temp = leftRotate(a, 5) + f + e + k + bigBlock32.getUint32(j * 4, false) & 4294967295;
      e = d;
      d = c;
      c = leftRotate(b, 30);
      b = a;
      a = temp;
    }
    this._h0 = this._h0 + a & 4294967295;
    this._h1 = this._h1 + b & 4294967295;
    this._h2 = this._h2 + c & 4294967295;
    this._h3 = this._h3 + d & 4294967295;
    this._h4 = this._h4 + e & 4294967295;
  }
};

// src/vs/platform/contextkey/common/scanner.ts
function hintDidYouMean(...meant) {
  switch (meant.length) {
    case 1:
      return localize(1921, null, meant[0]);
    case 2:
      return localize(1922, null, meant[0], meant[1]);
    case 3:
      return localize(1923, null, meant[0], meant[1], meant[2]);
    default:
      return void 0;
  }
}
var hintDidYouForgetToOpenOrCloseQuote = localize(1920, null);
var hintDidYouForgetToEscapeSlash = localize(1919, null);
var Scanner = class _Scanner {
  constructor() {
    this._input = "";
    this._start = 0;
    this._current = 0;
    this._tokens = [];
    this._errors = [];
    // u - unicode, y - sticky // TODO@ulugbekna: we accept double quotes as part of the string rather than as a delimiter (to preserve old parser's behavior)
    this.stringRe = /[a-zA-Z0-9_<>\-\./\\:\*\?\+\[\]\^,#@;"%\$\p{L}-]+/uy;
  }
  static getLexeme(token) {
    switch (token.type) {
      case 0 /* LParen */:
        return "(";
      case 1 /* RParen */:
        return ")";
      case 2 /* Neg */:
        return "!";
      case 3 /* Eq */:
        return token.isTripleEq ? "===" : "==";
      case 4 /* NotEq */:
        return token.isTripleEq ? "!==" : "!=";
      case 5 /* Lt */:
        return "<";
      case 6 /* LtEq */:
        return "<=";
      case 7 /* Gt */:
        return ">=";
      case 8 /* GtEq */:
        return ">=";
      case 9 /* RegexOp */:
        return "=~";
      case 10 /* RegexStr */:
        return token.lexeme;
      case 11 /* True */:
        return "true";
      case 12 /* False */:
        return "false";
      case 13 /* In */:
        return "in";
      case 14 /* Not */:
        return "not";
      case 15 /* And */:
        return "&&";
      case 16 /* Or */:
        return "||";
      case 17 /* Str */:
        return token.lexeme;
      case 18 /* QuotedStr */:
        return token.lexeme;
      case 19 /* Error */:
        return token.lexeme;
      case 20 /* EOF */:
        return "EOF";
      default:
        throw illegalState(`unhandled token type: ${JSON.stringify(token)}; have you forgotten to add a case?`);
    }
  }
  static {
    this._regexFlags = new Set(["i", "g", "s", "m", "y", "u"].map((ch) => ch.charCodeAt(0)));
  }
  static {
    this._keywords = /* @__PURE__ */ new Map([
      ["not", 14 /* Not */],
      ["in", 13 /* In */],
      ["false", 12 /* False */],
      ["true", 11 /* True */]
    ]);
  }
  get errors() {
    return this._errors;
  }
  reset(value) {
    this._input = value;
    this._start = 0;
    this._current = 0;
    this._tokens = [];
    this._errors = [];
    return this;
  }
  scan() {
    while (!this._isAtEnd()) {
      this._start = this._current;
      const ch = this._advance();
      switch (ch) {
        case 40 /* OpenParen */:
          this._addToken(0 /* LParen */);
          break;
        case 41 /* CloseParen */:
          this._addToken(1 /* RParen */);
          break;
        case 33 /* ExclamationMark */:
          if (this._match(61 /* Equals */)) {
            const isTripleEq = this._match(61 /* Equals */);
            this._tokens.push({ type: 4 /* NotEq */, offset: this._start, isTripleEq });
          } else {
            this._addToken(2 /* Neg */);
          }
          break;
        case 39 /* SingleQuote */:
          this._quotedString();
          break;
        case 47 /* Slash */:
          this._regex();
          break;
        case 61 /* Equals */:
          if (this._match(61 /* Equals */)) {
            const isTripleEq = this._match(61 /* Equals */);
            this._tokens.push({ type: 3 /* Eq */, offset: this._start, isTripleEq });
          } else if (this._match(126 /* Tilde */)) {
            this._addToken(9 /* RegexOp */);
          } else {
            this._error(hintDidYouMean("==", "=~"));
          }
          break;
        case 60 /* LessThan */:
          this._addToken(this._match(61 /* Equals */) ? 6 /* LtEq */ : 5 /* Lt */);
          break;
        case 62 /* GreaterThan */:
          this._addToken(this._match(61 /* Equals */) ? 8 /* GtEq */ : 7 /* Gt */);
          break;
        case 38 /* Ampersand */:
          if (this._match(38 /* Ampersand */)) {
            this._addToken(15 /* And */);
          } else {
            this._error(hintDidYouMean("&&"));
          }
          break;
        case 124 /* Pipe */:
          if (this._match(124 /* Pipe */)) {
            this._addToken(16 /* Or */);
          } else {
            this._error(hintDidYouMean("||"));
          }
          break;
        // TODO@ulugbekna: 1) rewrite using a regex 2) reconsider what characters are considered whitespace, including unicode, nbsp, etc.
        case 32 /* Space */:
        case 13 /* CarriageReturn */:
        case 9 /* Tab */:
        case 10 /* LineFeed */:
        case 160 /* NoBreakSpace */:
          break;
        default:
          this._string();
      }
    }
    this._start = this._current;
    this._addToken(20 /* EOF */);
    return Array.from(this._tokens);
  }
  _match(expected) {
    if (this._isAtEnd()) {
      return false;
    }
    if (this._input.charCodeAt(this._current) !== expected) {
      return false;
    }
    this._current++;
    return true;
  }
  _advance() {
    return this._input.charCodeAt(this._current++);
  }
  _peek() {
    return this._isAtEnd() ? 0 /* Null */ : this._input.charCodeAt(this._current);
  }
  _addToken(type) {
    this._tokens.push({ type, offset: this._start });
  }
  _error(additional) {
    const offset = this._start;
    const lexeme = this._input.substring(this._start, this._current);
    const errToken = { type: 19 /* Error */, offset: this._start, lexeme };
    this._errors.push({ offset, lexeme, additionalInfo: additional });
    this._tokens.push(errToken);
  }
  _string() {
    this.stringRe.lastIndex = this._start;
    const match = this.stringRe.exec(this._input);
    if (match) {
      this._current = this._start + match[0].length;
      const lexeme = this._input.substring(this._start, this._current);
      const keyword = _Scanner._keywords.get(lexeme);
      if (keyword) {
        this._addToken(keyword);
      } else {
        this._tokens.push({ type: 17 /* Str */, lexeme, offset: this._start });
      }
    }
  }
  // captures the lexeme without the leading and trailing '
  _quotedString() {
    while (this._peek() !== 39 /* SingleQuote */ && !this._isAtEnd()) {
      this._advance();
    }
    if (this._isAtEnd()) {
      this._error(hintDidYouForgetToOpenOrCloseQuote);
      return;
    }
    this._advance();
    this._tokens.push({ type: 18 /* QuotedStr */, lexeme: this._input.substring(this._start + 1, this._current - 1), offset: this._start + 1 });
  }
  /*
   * Lexing a regex expression: /.../[igsmyu]*
   * Based on https://github.com/microsoft/TypeScript/blob/9247ef115e617805983740ba795d7a8164babf89/src/compiler/scanner.ts#L2129-L2181
   *
   * Note that we want slashes within a regex to be escaped, e.g., /file:\\/\\/\\// should match `file:///`
   */
  _regex() {
    let p = this._current;
    let inEscape = false;
    let inCharacterClass = false;
    while (true) {
      if (p >= this._input.length) {
        this._current = p;
        this._error(hintDidYouForgetToEscapeSlash);
        return;
      }
      const ch = this._input.charCodeAt(p);
      if (inEscape) {
        inEscape = false;
      } else if (ch === 47 /* Slash */ && !inCharacterClass) {
        p++;
        break;
      } else if (ch === 91 /* OpenSquareBracket */) {
        inCharacterClass = true;
      } else if (ch === 92 /* Backslash */) {
        inEscape = true;
      } else if (ch === 93 /* CloseSquareBracket */) {
        inCharacterClass = false;
      }
      p++;
    }
    while (p < this._input.length && _Scanner._regexFlags.has(this._input.charCodeAt(p))) {
      p++;
    }
    this._current = p;
    const lexeme = this._input.substring(this._start, this._current);
    this._tokens.push({ type: 10 /* RegexStr */, lexeme, offset: this._start });
  }
  _isAtEnd() {
    return this._current >= this._input.length;
  }
};

// src/vs/platform/contextkey/common/contextkey.ts
var CONSTANT_VALUES = /* @__PURE__ */ new Map();
CONSTANT_VALUES.set("false", false);
CONSTANT_VALUES.set("true", true);
CONSTANT_VALUES.set("isMac", isMacintosh);
CONSTANT_VALUES.set("isLinux", isLinux);
CONSTANT_VALUES.set("isWindows", isWindows);
CONSTANT_VALUES.set("isWeb", isWeb);
CONSTANT_VALUES.set("isMacNative", isMacintosh && !isWeb);
CONSTANT_VALUES.set("isEdge", isEdge);
CONSTANT_VALUES.set("isFirefox", isFirefox);
CONSTANT_VALUES.set("isChrome", isChrome);
CONSTANT_VALUES.set("isSafari", isSafari);
var hasOwnProperty = Object.prototype.hasOwnProperty;
var defaultConfig = {
  regexParsingWithErrorRecovery: true
};
var errorEmptyString = localize(1900, null);
var hintEmptyString = localize(1901, null);
var errorNoInAfterNot = localize(1903, null);
var errorClosingParenthesis = localize(1899, null);
var errorUnexpectedToken = localize(1906, null);
var hintUnexpectedToken = localize(1907, null);
var errorUnexpectedEOF = localize(1904, null);
var hintUnexpectedEOF = localize(1905, null);
var Parser = class _Parser {
  constructor(_config = defaultConfig) {
    this._config = _config;
    // lifetime note: `_scanner` lives as long as the parser does, i.e., is not reset between calls to `parse`
    this._scanner = new Scanner();
    // lifetime note: `_tokens`, `_current`, and `_parsingErrors` must be reset between calls to `parse`
    this._tokens = [];
    this._current = 0;
    // invariant: 0 <= this._current < this._tokens.length ; any incrementation of this value must first call `_isAtEnd`
    this._parsingErrors = [];
    this._flagsGYRe = /g|y/g;
  }
  static {
    // Note: this doesn't produce an exact syntax tree but a normalized one
    // ContextKeyExpression's that we use as AST nodes do not expose constructors that do not normalize
    this._parseError = new Error();
  }
  get lexingErrors() {
    return this._scanner.errors;
  }
  get parsingErrors() {
    return this._parsingErrors;
  }
  /**
   * Parse a context key expression.
   *
   * @param input the expression to parse
   * @returns the parsed expression or `undefined` if there's an error - call `lexingErrors` and `parsingErrors` to see the errors
   */
  parse(input) {
    if (input === "") {
      this._parsingErrors.push({ message: errorEmptyString, offset: 0, lexeme: "", additionalInfo: hintEmptyString });
      return void 0;
    }
    this._tokens = this._scanner.reset(input).scan();
    this._current = 0;
    this._parsingErrors = [];
    try {
      const expr = this._expr();
      if (!this._isAtEnd()) {
        const peek = this._peek();
        const additionalInfo = peek.type === 17 /* Str */ ? hintUnexpectedToken : void 0;
        this._parsingErrors.push({ message: errorUnexpectedToken, offset: peek.offset, lexeme: Scanner.getLexeme(peek), additionalInfo });
        throw _Parser._parseError;
      }
      return expr;
    } catch (e) {
      if (!(e === _Parser._parseError)) {
        throw e;
      }
      return void 0;
    }
  }
  _expr() {
    return this._or();
  }
  _or() {
    const expr = [this._and()];
    while (this._matchOne(16 /* Or */)) {
      const right = this._and();
      expr.push(right);
    }
    return expr.length === 1 ? expr[0] : ContextKeyExpr.or(...expr);
  }
  _and() {
    const expr = [this._term()];
    while (this._matchOne(15 /* And */)) {
      const right = this._term();
      expr.push(right);
    }
    return expr.length === 1 ? expr[0] : ContextKeyExpr.and(...expr);
  }
  _term() {
    if (this._matchOne(2 /* Neg */)) {
      const peek = this._peek();
      switch (peek.type) {
        case 11 /* True */:
          this._advance();
          return ContextKeyFalseExpr.INSTANCE;
        case 12 /* False */:
          this._advance();
          return ContextKeyTrueExpr.INSTANCE;
        case 0 /* LParen */: {
          this._advance();
          const expr = this._expr();
          this._consume(1 /* RParen */, errorClosingParenthesis);
          return expr?.negate();
        }
        case 17 /* Str */:
          this._advance();
          return ContextKeyNotExpr.create(peek.lexeme);
        default:
          throw this._errExpectedButGot(`KEY | true | false | '(' expression ')'`, peek);
      }
    }
    return this._primary();
  }
  _primary() {
    const peek = this._peek();
    switch (peek.type) {
      case 11 /* True */:
        this._advance();
        return ContextKeyExpr.true();
      case 12 /* False */:
        this._advance();
        return ContextKeyExpr.false();
      case 0 /* LParen */: {
        this._advance();
        const expr = this._expr();
        this._consume(1 /* RParen */, errorClosingParenthesis);
        return expr;
      }
      case 17 /* Str */: {
        const key = peek.lexeme;
        this._advance();
        if (this._matchOne(9 /* RegexOp */)) {
          const expr = this._peek();
          if (!this._config.regexParsingWithErrorRecovery) {
            this._advance();
            if (expr.type !== 10 /* RegexStr */) {
              throw this._errExpectedButGot(`REGEX`, expr);
            }
            const regexLexeme = expr.lexeme;
            const closingSlashIndex = regexLexeme.lastIndexOf("/");
            const flags = closingSlashIndex === regexLexeme.length - 1 ? void 0 : this._removeFlagsGY(regexLexeme.substring(closingSlashIndex + 1));
            let regexp;
            try {
              regexp = new RegExp(regexLexeme.substring(1, closingSlashIndex), flags);
            } catch (e) {
              throw this._errExpectedButGot(`REGEX`, expr);
            }
            return ContextKeyRegexExpr.create(key, regexp);
          }
          switch (expr.type) {
            case 10 /* RegexStr */:
            case 19 /* Error */: {
              const lexemeReconstruction = [expr.lexeme];
              this._advance();
              let followingToken = this._peek();
              let parenBalance = 0;
              for (let i = 0; i < expr.lexeme.length; i++) {
                if (expr.lexeme.charCodeAt(i) === 40 /* OpenParen */) {
                  parenBalance++;
                } else if (expr.lexeme.charCodeAt(i) === 41 /* CloseParen */) {
                  parenBalance--;
                }
              }
              while (!this._isAtEnd() && followingToken.type !== 15 /* And */ && followingToken.type !== 16 /* Or */) {
                switch (followingToken.type) {
                  case 0 /* LParen */:
                    parenBalance++;
                    break;
                  case 1 /* RParen */:
                    parenBalance--;
                    break;
                  case 10 /* RegexStr */:
                  case 18 /* QuotedStr */:
                    for (let i = 0; i < followingToken.lexeme.length; i++) {
                      if (followingToken.lexeme.charCodeAt(i) === 40 /* OpenParen */) {
                        parenBalance++;
                      } else if (expr.lexeme.charCodeAt(i) === 41 /* CloseParen */) {
                        parenBalance--;
                      }
                    }
                }
                if (parenBalance < 0) {
                  break;
                }
                lexemeReconstruction.push(Scanner.getLexeme(followingToken));
                this._advance();
                followingToken = this._peek();
              }
              const regexLexeme = lexemeReconstruction.join("");
              const closingSlashIndex = regexLexeme.lastIndexOf("/");
              const flags = closingSlashIndex === regexLexeme.length - 1 ? void 0 : this._removeFlagsGY(regexLexeme.substring(closingSlashIndex + 1));
              let regexp;
              try {
                regexp = new RegExp(regexLexeme.substring(1, closingSlashIndex), flags);
              } catch (e) {
                throw this._errExpectedButGot(`REGEX`, expr);
              }
              return ContextKeyExpr.regex(key, regexp);
            }
            case 18 /* QuotedStr */: {
              const serializedValue = expr.lexeme;
              this._advance();
              let regex = null;
              if (!isFalsyOrWhitespace(serializedValue)) {
                const start = serializedValue.indexOf("/");
                const end = serializedValue.lastIndexOf("/");
                if (start !== end && start >= 0) {
                  const value = serializedValue.slice(start + 1, end);
                  const caseIgnoreFlag = serializedValue[end + 1] === "i" ? "i" : "";
                  try {
                    regex = new RegExp(value, caseIgnoreFlag);
                  } catch (_e) {
                    throw this._errExpectedButGot(`REGEX`, expr);
                  }
                }
              }
              if (regex === null) {
                throw this._errExpectedButGot("REGEX", expr);
              }
              return ContextKeyRegexExpr.create(key, regex);
            }
            default:
              throw this._errExpectedButGot("REGEX", this._peek());
          }
        }
        if (this._matchOne(14 /* Not */)) {
          this._consume(13 /* In */, errorNoInAfterNot);
          const right = this._value();
          return ContextKeyExpr.notIn(key, right);
        }
        const maybeOp = this._peek().type;
        switch (maybeOp) {
          case 3 /* Eq */: {
            this._advance();
            const right = this._value();
            if (this._previous().type === 18 /* QuotedStr */) {
              return ContextKeyExpr.equals(key, right);
            }
            switch (right) {
              case "true":
                return ContextKeyExpr.has(key);
              case "false":
                return ContextKeyExpr.not(key);
              default:
                return ContextKeyExpr.equals(key, right);
            }
          }
          case 4 /* NotEq */: {
            this._advance();
            const right = this._value();
            if (this._previous().type === 18 /* QuotedStr */) {
              return ContextKeyExpr.notEquals(key, right);
            }
            switch (right) {
              case "true":
                return ContextKeyExpr.not(key);
              case "false":
                return ContextKeyExpr.has(key);
              default:
                return ContextKeyExpr.notEquals(key, right);
            }
          }
          // TODO: ContextKeyExpr.smaller(key, right) accepts only `number` as `right` AND during eval of this node, we just eval to `false` if `right` is not a number
          // consequently, package.json linter should _warn_ the user if they're passing undesired things to ops
          case 5 /* Lt */:
            this._advance();
            return ContextKeySmallerExpr.create(key, this._value());
          case 6 /* LtEq */:
            this._advance();
            return ContextKeySmallerEqualsExpr.create(key, this._value());
          case 7 /* Gt */:
            this._advance();
            return ContextKeyGreaterExpr.create(key, this._value());
          case 8 /* GtEq */:
            this._advance();
            return ContextKeyGreaterEqualsExpr.create(key, this._value());
          case 13 /* In */:
            this._advance();
            return ContextKeyExpr.in(key, this._value());
          default:
            return ContextKeyExpr.has(key);
        }
      }
      case 20 /* EOF */:
        this._parsingErrors.push({ message: errorUnexpectedEOF, offset: peek.offset, lexeme: "", additionalInfo: hintUnexpectedEOF });
        throw _Parser._parseError;
      default:
        throw this._errExpectedButGot(`true | false | KEY 
	| KEY '=~' REGEX 
	| KEY ('==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not' 'in') value`, this._peek());
    }
  }
  _value() {
    const token = this._peek();
    switch (token.type) {
      case 17 /* Str */:
      case 18 /* QuotedStr */:
        this._advance();
        return token.lexeme;
      case 11 /* True */:
        this._advance();
        return "true";
      case 12 /* False */:
        this._advance();
        return "false";
      case 13 /* In */:
        this._advance();
        return "in";
      default:
        return "";
    }
  }
  _removeFlagsGY(flags) {
    return flags.replaceAll(this._flagsGYRe, "");
  }
  // careful: this can throw if current token is the initial one (ie index = 0)
  _previous() {
    return this._tokens[this._current - 1];
  }
  _matchOne(token) {
    if (this._check(token)) {
      this._advance();
      return true;
    }
    return false;
  }
  _advance() {
    if (!this._isAtEnd()) {
      this._current++;
    }
    return this._previous();
  }
  _consume(type, message) {
    if (this._check(type)) {
      return this._advance();
    }
    throw this._errExpectedButGot(message, this._peek());
  }
  _errExpectedButGot(expected, got, additionalInfo) {
    const message = localize(1902, null, expected, Scanner.getLexeme(got));
    const offset = got.offset;
    const lexeme = Scanner.getLexeme(got);
    this._parsingErrors.push({ message, offset, lexeme, additionalInfo });
    return _Parser._parseError;
  }
  _check(type) {
    return this._peek().type === type;
  }
  _peek() {
    return this._tokens[this._current];
  }
  _isAtEnd() {
    return this._peek().type === 20 /* EOF */;
  }
};
var ContextKeyExpr = class {
  static false() {
    return ContextKeyFalseExpr.INSTANCE;
  }
  static true() {
    return ContextKeyTrueExpr.INSTANCE;
  }
  static has(key) {
    return ContextKeyDefinedExpr.create(key);
  }
  static equals(key, value) {
    return ContextKeyEqualsExpr.create(key, value);
  }
  static notEquals(key, value) {
    return ContextKeyNotEqualsExpr.create(key, value);
  }
  static regex(key, value) {
    return ContextKeyRegexExpr.create(key, value);
  }
  static in(key, value) {
    return ContextKeyInExpr.create(key, value);
  }
  static notIn(key, value) {
    return ContextKeyNotInExpr.create(key, value);
  }
  static not(key) {
    return ContextKeyNotExpr.create(key);
  }
  static and(...expr) {
    return ContextKeyAndExpr.create(expr, null, true);
  }
  static or(...expr) {
    return ContextKeyOrExpr.create(expr, null, true);
  }
  static greater(key, value) {
    return ContextKeyGreaterExpr.create(key, value);
  }
  static greaterEquals(key, value) {
    return ContextKeyGreaterEqualsExpr.create(key, value);
  }
  static smaller(key, value) {
    return ContextKeySmallerExpr.create(key, value);
  }
  static smallerEquals(key, value) {
    return ContextKeySmallerEqualsExpr.create(key, value);
  }
  static {
    this._parser = new Parser({ regexParsingWithErrorRecovery: false });
  }
  static deserialize(serialized) {
    if (serialized === void 0 || serialized === null) {
      return void 0;
    }
    const expr = this._parser.parse(serialized);
    return expr;
  }
};
function cmp(a, b) {
  return a.cmp(b);
}
var ContextKeyFalseExpr = class _ContextKeyFalseExpr {
  constructor() {
    this.type = 0 /* False */;
  }
  static {
    this.INSTANCE = new _ContextKeyFalseExpr();
  }
  cmp(other) {
    return this.type - other.type;
  }
  equals(other) {
    return other.type === this.type;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    return false;
  }
  serialize() {
    return "false";
  }
  keys() {
    return [];
  }
  map(mapFnc) {
    return this;
  }
  negate() {
    return ContextKeyTrueExpr.INSTANCE;
  }
};
var ContextKeyTrueExpr = class _ContextKeyTrueExpr {
  constructor() {
    this.type = 1 /* True */;
  }
  static {
    this.INSTANCE = new _ContextKeyTrueExpr();
  }
  cmp(other) {
    return this.type - other.type;
  }
  equals(other) {
    return other.type === this.type;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    return true;
  }
  serialize() {
    return "true";
  }
  keys() {
    return [];
  }
  map(mapFnc) {
    return this;
  }
  negate() {
    return ContextKeyFalseExpr.INSTANCE;
  }
};
var ContextKeyDefinedExpr = class _ContextKeyDefinedExpr {
  constructor(key, negated) {
    this.key = key;
    this.negated = negated;
    this.type = 2 /* Defined */;
  }
  static create(key, negated = null) {
    const constantValue = CONSTANT_VALUES.get(key);
    if (typeof constantValue === "boolean") {
      return constantValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE;
    }
    return new _ContextKeyDefinedExpr(key, negated);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp1(this.key, other.key);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key;
    }
    return false;
  }
  substituteConstants() {
    const constantValue = CONSTANT_VALUES.get(this.key);
    if (typeof constantValue === "boolean") {
      return constantValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE;
    }
    return this;
  }
  evaluate(context) {
    return !!context.getValue(this.key);
  }
  serialize() {
    return this.key;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapDefined(this.key);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyNotExpr.create(this.key, this);
    }
    return this.negated;
  }
};
var ContextKeyEqualsExpr = class _ContextKeyEqualsExpr {
  constructor(key, value, negated) {
    this.key = key;
    this.value = value;
    this.negated = negated;
    this.type = 4 /* Equals */;
  }
  static create(key, value, negated = null) {
    if (typeof value === "boolean") {
      return value ? ContextKeyDefinedExpr.create(key, negated) : ContextKeyNotExpr.create(key, negated);
    }
    const constantValue = CONSTANT_VALUES.get(key);
    if (typeof constantValue === "boolean") {
      const trueValue = constantValue ? "true" : "false";
      return value === trueValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE;
    }
    return new _ContextKeyEqualsExpr(key, value, negated);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp2(this.key, this.value, other.key, other.value);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key && this.value === other.value;
    }
    return false;
  }
  substituteConstants() {
    const constantValue = CONSTANT_VALUES.get(this.key);
    if (typeof constantValue === "boolean") {
      const trueValue = constantValue ? "true" : "false";
      return this.value === trueValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE;
    }
    return this;
  }
  evaluate(context) {
    return context.getValue(this.key) == this.value;
  }
  serialize() {
    return `${this.key} == '${this.value}'`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapEquals(this.key, this.value);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyNotEqualsExpr.create(this.key, this.value, this);
    }
    return this.negated;
  }
};
var ContextKeyInExpr = class _ContextKeyInExpr {
  constructor(key, valueKey) {
    this.key = key;
    this.valueKey = valueKey;
    this.type = 10 /* In */;
    this.negated = null;
  }
  static create(key, valueKey) {
    return new _ContextKeyInExpr(key, valueKey);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp2(this.key, this.valueKey, other.key, other.valueKey);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key && this.valueKey === other.valueKey;
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    const source = context.getValue(this.valueKey);
    const item = context.getValue(this.key);
    if (Array.isArray(source)) {
      if (source.includes(item)) {
        return true;
      }
      if (isWindows && typeof item === "string" && item.startsWith("file:///")) {
        const itemLower = item.toLowerCase();
        return source.some((s) => typeof s === "string" && s.toLowerCase() === itemLower);
      }
      return false;
    }
    if (typeof item === "string" && typeof source === "object" && source !== null) {
      if (hasOwnProperty.call(source, item)) {
        return true;
      }
      if (isWindows && item.startsWith("file:///")) {
        const itemLower = item.toLowerCase();
        return Object.keys(source).some((key) => key.toLowerCase() === itemLower);
      }
      return false;
    }
    return false;
  }
  serialize() {
    return `${this.key} in '${this.valueKey}'`;
  }
  keys() {
    return [this.key, this.valueKey];
  }
  map(mapFnc) {
    return mapFnc.mapIn(this.key, this.valueKey);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyNotInExpr.create(this.key, this.valueKey);
    }
    return this.negated;
  }
};
var ContextKeyNotInExpr = class _ContextKeyNotInExpr {
  constructor(key, valueKey) {
    this.key = key;
    this.valueKey = valueKey;
    this.type = 11 /* NotIn */;
    this._negated = ContextKeyInExpr.create(key, valueKey);
  }
  static create(key, valueKey) {
    return new _ContextKeyNotInExpr(key, valueKey);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return this._negated.cmp(other._negated);
  }
  equals(other) {
    if (other.type === this.type) {
      return this._negated.equals(other._negated);
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    return !this._negated.evaluate(context);
  }
  serialize() {
    return `${this.key} not in '${this.valueKey}'`;
  }
  keys() {
    return this._negated.keys();
  }
  map(mapFnc) {
    return mapFnc.mapNotIn(this.key, this.valueKey);
  }
  negate() {
    return this._negated;
  }
};
var ContextKeyNotEqualsExpr = class _ContextKeyNotEqualsExpr {
  constructor(key, value, negated) {
    this.key = key;
    this.value = value;
    this.negated = negated;
    this.type = 5 /* NotEquals */;
  }
  static create(key, value, negated = null) {
    if (typeof value === "boolean") {
      if (value) {
        return ContextKeyNotExpr.create(key, negated);
      }
      return ContextKeyDefinedExpr.create(key, negated);
    }
    const constantValue = CONSTANT_VALUES.get(key);
    if (typeof constantValue === "boolean") {
      const falseValue = constantValue ? "true" : "false";
      return value === falseValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE;
    }
    return new _ContextKeyNotEqualsExpr(key, value, negated);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp2(this.key, this.value, other.key, other.value);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key && this.value === other.value;
    }
    return false;
  }
  substituteConstants() {
    const constantValue = CONSTANT_VALUES.get(this.key);
    if (typeof constantValue === "boolean") {
      const falseValue = constantValue ? "true" : "false";
      return this.value === falseValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE;
    }
    return this;
  }
  evaluate(context) {
    return context.getValue(this.key) != this.value;
  }
  serialize() {
    return `${this.key} != '${this.value}'`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapNotEquals(this.key, this.value);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyEqualsExpr.create(this.key, this.value, this);
    }
    return this.negated;
  }
};
var ContextKeyNotExpr = class _ContextKeyNotExpr {
  constructor(key, negated) {
    this.key = key;
    this.negated = negated;
    this.type = 3 /* Not */;
  }
  static create(key, negated = null) {
    const constantValue = CONSTANT_VALUES.get(key);
    if (typeof constantValue === "boolean") {
      return constantValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE;
    }
    return new _ContextKeyNotExpr(key, negated);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp1(this.key, other.key);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key;
    }
    return false;
  }
  substituteConstants() {
    const constantValue = CONSTANT_VALUES.get(this.key);
    if (typeof constantValue === "boolean") {
      return constantValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE;
    }
    return this;
  }
  evaluate(context) {
    return !context.getValue(this.key);
  }
  serialize() {
    return `!${this.key}`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapNot(this.key);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyDefinedExpr.create(this.key, this);
    }
    return this.negated;
  }
};
function withFloatOrStr(value, callback) {
  if (typeof value === "string") {
    const n = parseFloat(value);
    if (!isNaN(n)) {
      value = n;
    }
  }
  if (typeof value === "string" || typeof value === "number") {
    return callback(value);
  }
  return ContextKeyFalseExpr.INSTANCE;
}
var ContextKeyGreaterExpr = class _ContextKeyGreaterExpr {
  constructor(key, value, negated) {
    this.key = key;
    this.value = value;
    this.negated = negated;
    this.type = 12 /* Greater */;
  }
  static create(key, _value, negated = null) {
    return withFloatOrStr(_value, (value) => new _ContextKeyGreaterExpr(key, value, negated));
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp2(this.key, this.value, other.key, other.value);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key && this.value === other.value;
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    if (typeof this.value === "string") {
      return false;
    }
    return parseFloat(context.getValue(this.key)) > this.value;
  }
  serialize() {
    return `${this.key} > ${this.value}`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapGreater(this.key, this.value);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeySmallerEqualsExpr.create(this.key, this.value, this);
    }
    return this.negated;
  }
};
var ContextKeyGreaterEqualsExpr = class _ContextKeyGreaterEqualsExpr {
  constructor(key, value, negated) {
    this.key = key;
    this.value = value;
    this.negated = negated;
    this.type = 13 /* GreaterEquals */;
  }
  static create(key, _value, negated = null) {
    return withFloatOrStr(_value, (value) => new _ContextKeyGreaterEqualsExpr(key, value, negated));
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp2(this.key, this.value, other.key, other.value);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key && this.value === other.value;
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    if (typeof this.value === "string") {
      return false;
    }
    return parseFloat(context.getValue(this.key)) >= this.value;
  }
  serialize() {
    return `${this.key} >= ${this.value}`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapGreaterEquals(this.key, this.value);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeySmallerExpr.create(this.key, this.value, this);
    }
    return this.negated;
  }
};
var ContextKeySmallerExpr = class _ContextKeySmallerExpr {
  constructor(key, value, negated) {
    this.key = key;
    this.value = value;
    this.negated = negated;
    this.type = 14 /* Smaller */;
  }
  static create(key, _value, negated = null) {
    return withFloatOrStr(_value, (value) => new _ContextKeySmallerExpr(key, value, negated));
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp2(this.key, this.value, other.key, other.value);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key && this.value === other.value;
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    if (typeof this.value === "string") {
      return false;
    }
    return parseFloat(context.getValue(this.key)) < this.value;
  }
  serialize() {
    return `${this.key} < ${this.value}`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapSmaller(this.key, this.value);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyGreaterEqualsExpr.create(this.key, this.value, this);
    }
    return this.negated;
  }
};
var ContextKeySmallerEqualsExpr = class _ContextKeySmallerEqualsExpr {
  constructor(key, value, negated) {
    this.key = key;
    this.value = value;
    this.negated = negated;
    this.type = 15 /* SmallerEquals */;
  }
  static create(key, _value, negated = null) {
    return withFloatOrStr(_value, (value) => new _ContextKeySmallerEqualsExpr(key, value, negated));
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return cmp2(this.key, this.value, other.key, other.value);
  }
  equals(other) {
    if (other.type === this.type) {
      return this.key === other.key && this.value === other.value;
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    if (typeof this.value === "string") {
      return false;
    }
    return parseFloat(context.getValue(this.key)) <= this.value;
  }
  serialize() {
    return `${this.key} <= ${this.value}`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapSmallerEquals(this.key, this.value);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyGreaterExpr.create(this.key, this.value, this);
    }
    return this.negated;
  }
};
var ContextKeyRegexExpr = class _ContextKeyRegexExpr {
  constructor(key, regexp) {
    this.key = key;
    this.regexp = regexp;
    this.type = 7 /* Regex */;
    this.negated = null;
  }
  static create(key, regexp) {
    return new _ContextKeyRegexExpr(key, regexp);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    if (this.key < other.key) {
      return -1;
    }
    if (this.key > other.key) {
      return 1;
    }
    const thisSource = this.regexp ? this.regexp.source : "";
    const otherSource = other.regexp ? other.regexp.source : "";
    if (thisSource < otherSource) {
      return -1;
    }
    if (thisSource > otherSource) {
      return 1;
    }
    return 0;
  }
  equals(other) {
    if (other.type === this.type) {
      const thisSource = this.regexp ? this.regexp.source : "";
      const otherSource = other.regexp ? other.regexp.source : "";
      return this.key === other.key && thisSource === otherSource;
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    const value = context.getValue(this.key);
    return this.regexp ? this.regexp.test(value) : false;
  }
  serialize() {
    const value = this.regexp ? `/${this.regexp.source}/${this.regexp.flags}` : "/invalid/";
    return `${this.key} =~ ${value}`;
  }
  keys() {
    return [this.key];
  }
  map(mapFnc) {
    return mapFnc.mapRegex(this.key, this.regexp);
  }
  negate() {
    if (!this.negated) {
      this.negated = ContextKeyNotRegexExpr.create(this);
    }
    return this.negated;
  }
};
var ContextKeyNotRegexExpr = class _ContextKeyNotRegexExpr {
  constructor(_actual) {
    this._actual = _actual;
    this.type = 8 /* NotRegex */;
  }
  static create(actual) {
    return new _ContextKeyNotRegexExpr(actual);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    return this._actual.cmp(other._actual);
  }
  equals(other) {
    if (other.type === this.type) {
      return this._actual.equals(other._actual);
    }
    return false;
  }
  substituteConstants() {
    return this;
  }
  evaluate(context) {
    return !this._actual.evaluate(context);
  }
  serialize() {
    return `!(${this._actual.serialize()})`;
  }
  keys() {
    return this._actual.keys();
  }
  map(mapFnc) {
    return new _ContextKeyNotRegexExpr(this._actual.map(mapFnc));
  }
  negate() {
    return this._actual;
  }
};
function eliminateConstantsInArray(arr) {
  let newArr = null;
  for (let i = 0, len = arr.length; i < len; i++) {
    const newExpr = arr[i].substituteConstants();
    if (arr[i] !== newExpr) {
      if (newArr === null) {
        newArr = [];
        for (let j = 0; j < i; j++) {
          newArr[j] = arr[j];
        }
      }
    }
    if (newArr !== null) {
      newArr[i] = newExpr;
    }
  }
  if (newArr === null) {
    return arr;
  }
  return newArr;
}
var ContextKeyAndExpr = class _ContextKeyAndExpr {
  constructor(expr, negated) {
    this.expr = expr;
    this.negated = negated;
    this.type = 6 /* And */;
  }
  static create(_expr, negated, extraRedundantCheck) {
    return _ContextKeyAndExpr._normalizeArr(_expr, negated, extraRedundantCheck);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    if (this.expr.length < other.expr.length) {
      return -1;
    }
    if (this.expr.length > other.expr.length) {
      return 1;
    }
    for (let i = 0, len = this.expr.length; i < len; i++) {
      const r = cmp(this.expr[i], other.expr[i]);
      if (r !== 0) {
        return r;
      }
    }
    return 0;
  }
  equals(other) {
    if (other.type === this.type) {
      if (this.expr.length !== other.expr.length) {
        return false;
      }
      for (let i = 0, len = this.expr.length; i < len; i++) {
        if (!this.expr[i].equals(other.expr[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  substituteConstants() {
    const exprArr = eliminateConstantsInArray(this.expr);
    if (exprArr === this.expr) {
      return this;
    }
    return _ContextKeyAndExpr.create(exprArr, this.negated, false);
  }
  evaluate(context) {
    for (let i = 0, len = this.expr.length; i < len; i++) {
      if (!this.expr[i].evaluate(context)) {
        return false;
      }
    }
    return true;
  }
  static _normalizeArr(arr, negated, extraRedundantCheck) {
    const expr = [];
    let hasTrue = false;
    for (const e of arr) {
      if (!e) {
        continue;
      }
      if (e.type === 1 /* True */) {
        hasTrue = true;
        continue;
      }
      if (e.type === 0 /* False */) {
        return ContextKeyFalseExpr.INSTANCE;
      }
      if (e.type === 6 /* And */) {
        expr.push(...e.expr);
        continue;
      }
      expr.push(e);
    }
    if (expr.length === 0 && hasTrue) {
      return ContextKeyTrueExpr.INSTANCE;
    }
    if (expr.length === 0) {
      return void 0;
    }
    if (expr.length === 1) {
      return expr[0];
    }
    expr.sort(cmp);
    for (let i = 1; i < expr.length; i++) {
      if (expr[i - 1].equals(expr[i])) {
        expr.splice(i, 1);
        i--;
      }
    }
    if (expr.length === 1) {
      return expr[0];
    }
    while (expr.length > 1) {
      const lastElement = expr[expr.length - 1];
      if (lastElement.type !== 9 /* Or */) {
        break;
      }
      expr.pop();
      const secondToLastElement = expr.pop();
      const isFinished = expr.length === 0;
      const resultElement = ContextKeyOrExpr.create(
        lastElement.expr.map((el) => _ContextKeyAndExpr.create([el, secondToLastElement], null, extraRedundantCheck)),
        null,
        isFinished
      );
      if (resultElement) {
        expr.push(resultElement);
        expr.sort(cmp);
      }
    }
    if (expr.length === 1) {
      return expr[0];
    }
    if (extraRedundantCheck) {
      for (let i = 0; i < expr.length; i++) {
        for (let j = i + 1; j < expr.length; j++) {
          if (expr[i].negate().equals(expr[j])) {
            return ContextKeyFalseExpr.INSTANCE;
          }
        }
      }
      if (expr.length === 1) {
        return expr[0];
      }
    }
    return new _ContextKeyAndExpr(expr, negated);
  }
  serialize() {
    return this.expr.map((e) => e.serialize()).join(" && ");
  }
  keys() {
    const result = [];
    for (const expr of this.expr) {
      result.push(...expr.keys());
    }
    return result;
  }
  map(mapFnc) {
    return new _ContextKeyAndExpr(this.expr.map((expr) => expr.map(mapFnc)), null);
  }
  negate() {
    if (!this.negated) {
      const result = [];
      for (const expr of this.expr) {
        result.push(expr.negate());
      }
      this.negated = ContextKeyOrExpr.create(result, this, true);
    }
    return this.negated;
  }
};
var ContextKeyOrExpr = class _ContextKeyOrExpr {
  constructor(expr, negated) {
    this.expr = expr;
    this.negated = negated;
    this.type = 9 /* Or */;
  }
  static create(_expr, negated, extraRedundantCheck) {
    return _ContextKeyOrExpr._normalizeArr(_expr, negated, extraRedundantCheck);
  }
  cmp(other) {
    if (other.type !== this.type) {
      return this.type - other.type;
    }
    if (this.expr.length < other.expr.length) {
      return -1;
    }
    if (this.expr.length > other.expr.length) {
      return 1;
    }
    for (let i = 0, len = this.expr.length; i < len; i++) {
      const r = cmp(this.expr[i], other.expr[i]);
      if (r !== 0) {
        return r;
      }
    }
    return 0;
  }
  equals(other) {
    if (other.type === this.type) {
      if (this.expr.length !== other.expr.length) {
        return false;
      }
      for (let i = 0, len = this.expr.length; i < len; i++) {
        if (!this.expr[i].equals(other.expr[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  substituteConstants() {
    const exprArr = eliminateConstantsInArray(this.expr);
    if (exprArr === this.expr) {
      return this;
    }
    return _ContextKeyOrExpr.create(exprArr, this.negated, false);
  }
  evaluate(context) {
    for (let i = 0, len = this.expr.length; i < len; i++) {
      if (this.expr[i].evaluate(context)) {
        return true;
      }
    }
    return false;
  }
  static _normalizeArr(arr, negated, extraRedundantCheck) {
    let expr = [];
    let hasFalse = false;
    if (arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        const e = arr[i];
        if (!e) {
          continue;
        }
        if (e.type === 0 /* False */) {
          hasFalse = true;
          continue;
        }
        if (e.type === 1 /* True */) {
          return ContextKeyTrueExpr.INSTANCE;
        }
        if (e.type === 9 /* Or */) {
          expr = expr.concat(e.expr);
          continue;
        }
        expr.push(e);
      }
      if (expr.length === 0 && hasFalse) {
        return ContextKeyFalseExpr.INSTANCE;
      }
      expr.sort(cmp);
    }
    if (expr.length === 0) {
      return void 0;
    }
    if (expr.length === 1) {
      return expr[0];
    }
    for (let i = 1; i < expr.length; i++) {
      if (expr[i - 1].equals(expr[i])) {
        expr.splice(i, 1);
        i--;
      }
    }
    if (expr.length === 1) {
      return expr[0];
    }
    if (extraRedundantCheck) {
      for (let i = 0; i < expr.length; i++) {
        for (let j = i + 1; j < expr.length; j++) {
          if (expr[i].negate().equals(expr[j])) {
            return ContextKeyTrueExpr.INSTANCE;
          }
        }
      }
      if (expr.length === 1) {
        return expr[0];
      }
    }
    return new _ContextKeyOrExpr(expr, negated);
  }
  serialize() {
    return this.expr.map((e) => e.serialize()).join(" || ");
  }
  keys() {
    const result = [];
    for (const expr of this.expr) {
      result.push(...expr.keys());
    }
    return result;
  }
  map(mapFnc) {
    return new _ContextKeyOrExpr(this.expr.map((expr) => expr.map(mapFnc)), null);
  }
  negate() {
    if (!this.negated) {
      const result = [];
      for (const expr of this.expr) {
        result.push(expr.negate());
      }
      while (result.length > 1) {
        const LEFT = result.shift();
        const RIGHT = result.shift();
        const all = [];
        for (const left of getTerminals(LEFT)) {
          for (const right of getTerminals(RIGHT)) {
            all.push(ContextKeyAndExpr.create([left, right], null, false));
          }
        }
        result.unshift(_ContextKeyOrExpr.create(all, null, false));
      }
      this.negated = _ContextKeyOrExpr.create(result, this, true);
    }
    return this.negated;
  }
};
var RawContextKey = class _RawContextKey extends ContextKeyDefinedExpr {
  static {
    this._info = [];
  }
  static all() {
    return _RawContextKey._info.values();
  }
  constructor(key, defaultValue, metaOrHide) {
    super(key, null);
    this._defaultValue = defaultValue;
    if (typeof metaOrHide === "object") {
      _RawContextKey._info.push({ ...metaOrHide, key });
    } else if (metaOrHide !== true) {
      _RawContextKey._info.push({ key, description: metaOrHide, type: defaultValue !== null && defaultValue !== void 0 ? typeof defaultValue : void 0 });
    }
  }
  bindTo(target) {
    return target.createKey(this.key, this._defaultValue);
  }
  getValue(target) {
    return target.getContextKeyValue(this.key);
  }
  toNegated() {
    return this.negate();
  }
  isEqualTo(value) {
    return ContextKeyEqualsExpr.create(this.key, value);
  }
  notEqualsTo(value) {
    return ContextKeyNotEqualsExpr.create(this.key, value);
  }
  greater(value) {
    return ContextKeyGreaterExpr.create(this.key, value);
  }
};
var IContextKeyService = createDecorator("contextKeyService");
function cmp1(key1, key2) {
  if (key1 < key2) {
    return -1;
  }
  if (key1 > key2) {
    return 1;
  }
  return 0;
}
function cmp2(key1, value1, key2, value2) {
  if (key1 < key2) {
    return -1;
  }
  if (key1 > key2) {
    return 1;
  }
  if (value1 < value2) {
    return -1;
  }
  if (value1 > value2) {
    return 1;
  }
  return 0;
}
function getTerminals(node) {
  if (node.type === 9 /* Or */) {
    return node.expr;
  }
  return [node];
}

// src/vs/platform/log/common/log.ts
var ILogService = createDecorator("logService");
var ILoggerService = createDecorator("loggerService");
function isLogLevel(thing) {
  return isNumber(thing);
}
var DEFAULT_LOG_LEVEL = 3 /* Info */;
function canLog(loggerLevel, messageLevel) {
  return loggerLevel !== 0 /* Off */ && loggerLevel <= messageLevel;
}
function format2(args, verbose = false) {
  let result = "";
  for (let i = 0; i < args.length; i++) {
    let a = args[i];
    if (a instanceof Error) {
      a = toErrorMessage(a, verbose);
    }
    if (typeof a === "object") {
      try {
        a = JSON.stringify(a);
      } catch (e) {
      }
    }
    result += (i > 0 ? " " : "") + a;
  }
  return result;
}
var AbstractLogger = class extends Disposable {
  constructor() {
    super(...arguments);
    this.level = DEFAULT_LOG_LEVEL;
    this._onDidChangeLogLevel = this._register(new Emitter());
  }
  get onDidChangeLogLevel() {
    return this._onDidChangeLogLevel.event;
  }
  setLevel(level) {
    if (this.level !== level) {
      this.level = level;
      this._onDidChangeLogLevel.fire(this.level);
    }
  }
  getLevel() {
    return this.level;
  }
  checkLogLevel(level) {
    return canLog(this.level, level);
  }
  canLog(level) {
    if (this._store.isDisposed) {
      return false;
    }
    return this.checkLogLevel(level);
  }
};
var AbstractMessageLogger = class extends AbstractLogger {
  constructor(logAlways) {
    super();
    this.logAlways = logAlways;
  }
  checkLogLevel(level) {
    return this.logAlways || super.checkLogLevel(level);
  }
  trace(message, ...args) {
    if (this.canLog(1 /* Trace */)) {
      this.log(1 /* Trace */, format2([message, ...args], true));
    }
  }
  debug(message, ...args) {
    if (this.canLog(2 /* Debug */)) {
      this.log(2 /* Debug */, format2([message, ...args]));
    }
  }
  info(message, ...args) {
    if (this.canLog(3 /* Info */)) {
      this.log(3 /* Info */, format2([message, ...args]));
    }
  }
  warn(message, ...args) {
    if (this.canLog(4 /* Warning */)) {
      this.log(4 /* Warning */, format2([message, ...args]));
    }
  }
  error(message, ...args) {
    if (this.canLog(5 /* Error */)) {
      if (message instanceof Error) {
        const array = Array.prototype.slice.call(arguments);
        array[0] = message.stack;
        this.log(5 /* Error */, format2(array));
      } else {
        this.log(5 /* Error */, format2([message, ...args]));
      }
    }
  }
  flush() {
  }
};
var MultiplexLogger = class extends AbstractLogger {
  constructor(loggers) {
    super();
    this.loggers = loggers;
    if (loggers.length) {
      this.setLevel(loggers[0].getLevel());
    }
  }
  setLevel(level) {
    for (const logger of this.loggers) {
      logger.setLevel(level);
    }
    super.setLevel(level);
  }
  trace(message, ...args) {
    for (const logger of this.loggers) {
      logger.trace(message, ...args);
    }
  }
  debug(message, ...args) {
    for (const logger of this.loggers) {
      logger.debug(message, ...args);
    }
  }
  info(message, ...args) {
    for (const logger of this.loggers) {
      logger.info(message, ...args);
    }
  }
  warn(message, ...args) {
    for (const logger of this.loggers) {
      logger.warn(message, ...args);
    }
  }
  error(message, ...args) {
    for (const logger of this.loggers) {
      logger.error(message, ...args);
    }
  }
  flush() {
    for (const logger of this.loggers) {
      logger.flush();
    }
  }
  dispose() {
    for (const logger of this.loggers) {
      logger.dispose();
    }
    super.dispose();
  }
};
var AbstractLoggerService = class extends Disposable {
  constructor(logLevel, logsHome, loggerResources) {
    super();
    this.logLevel = logLevel;
    this.logsHome = logsHome;
    this._loggers = new ResourceMap();
    this._onDidChangeLoggers = this._register(new Emitter());
    this.onDidChangeLoggers = this._onDidChangeLoggers.event;
    this._onDidChangeLogLevel = this._register(new Emitter());
    this.onDidChangeLogLevel = this._onDidChangeLogLevel.event;
    this._onDidChangeVisibility = this._register(new Emitter());
    this.onDidChangeVisibility = this._onDidChangeVisibility.event;
    if (loggerResources) {
      for (const loggerResource of loggerResources) {
        this._loggers.set(loggerResource.resource, { logger: void 0, info: loggerResource });
      }
    }
  }
  getLoggerEntry(resourceOrId) {
    if (isString(resourceOrId)) {
      return [...this._loggers.values()].find((logger) => logger.info.id === resourceOrId);
    }
    return this._loggers.get(resourceOrId);
  }
  getLogger(resourceOrId) {
    return this.getLoggerEntry(resourceOrId)?.logger;
  }
  createLogger(idOrResource, options) {
    const resource = this.toResource(idOrResource);
    const id2 = isString(idOrResource) ? idOrResource : options?.id ?? hash(resource.toString()).toString(16);
    let logger = this._loggers.get(resource)?.logger;
    const logLevel = options?.logLevel === "always" ? 1 /* Trace */ : options?.logLevel;
    if (!logger) {
      logger = this.doCreateLogger(resource, logLevel ?? this.getLogLevel(resource) ?? this.logLevel, { ...options, id: id2 });
    }
    const loggerEntry = {
      logger,
      info: {
        resource,
        id: id2,
        logLevel,
        name: options?.name,
        hidden: options?.hidden,
        group: options?.group,
        extensionId: options?.extensionId,
        when: options?.when
      }
    };
    this.registerLogger(loggerEntry.info);
    this._loggers.set(resource, loggerEntry);
    return logger;
  }
  toResource(idOrResource) {
    return isString(idOrResource) ? joinPath(this.logsHome, `${idOrResource.replace(/[\\/:\*\?"<>\|]/g, "")}.log`) : idOrResource;
  }
  setLogLevel(arg1, arg2) {
    if (URI.isUri(arg1)) {
      const resource = arg1;
      const logLevel = arg2;
      const logger = this._loggers.get(resource);
      if (logger && logLevel !== logger.info.logLevel) {
        logger.info.logLevel = logLevel === this.logLevel ? void 0 : logLevel;
        logger.logger?.setLevel(logLevel);
        this._loggers.set(logger.info.resource, logger);
        this._onDidChangeLogLevel.fire([resource, logLevel]);
      }
    } else {
      this.logLevel = arg1;
      for (const [resource, logger] of this._loggers.entries()) {
        if (this._loggers.get(resource)?.info.logLevel === void 0) {
          logger.logger?.setLevel(this.logLevel);
        }
      }
      this._onDidChangeLogLevel.fire(this.logLevel);
    }
  }
  setVisibility(resourceOrId, visibility) {
    const logger = this.getLoggerEntry(resourceOrId);
    if (logger && visibility !== !logger.info.hidden) {
      logger.info.hidden = !visibility;
      this._loggers.set(logger.info.resource, logger);
      this._onDidChangeVisibility.fire([logger.info.resource, visibility]);
    }
  }
  getLogLevel(resource) {
    let logLevel;
    if (resource) {
      logLevel = this._loggers.get(resource)?.info.logLevel;
    }
    return logLevel ?? this.logLevel;
  }
  registerLogger(resource) {
    const existing = this._loggers.get(resource.resource);
    if (existing) {
      if (existing.info.hidden !== resource.hidden) {
        this.setVisibility(resource.resource, !resource.hidden);
      }
    } else {
      this._loggers.set(resource.resource, { info: resource, logger: void 0 });
      this._onDidChangeLoggers.fire({ added: [resource], removed: [] });
    }
  }
  deregisterLogger(idOrResource) {
    const resource = this.toResource(idOrResource);
    const existing = this._loggers.get(resource);
    if (existing) {
      if (existing.logger) {
        existing.logger.dispose();
      }
      this._loggers.delete(resource);
      this._onDidChangeLoggers.fire({ added: [], removed: [existing.info] });
    }
  }
  *getRegisteredLoggers() {
    for (const entry of this._loggers.values()) {
      yield entry.info;
    }
  }
  getRegisteredLogger(resource) {
    return this._loggers.get(resource)?.info;
  }
  dispose() {
    this._loggers.forEach((logger) => logger.logger?.dispose());
    this._loggers.clear();
    super.dispose();
  }
};
function getLogLevel(environmentService) {
  if (environmentService.verbose) {
    return 1 /* Trace */;
  }
  if (typeof environmentService.logLevel === "string") {
    const logLevel = parseLogLevel(environmentService.logLevel.toLowerCase());
    if (logLevel !== void 0) {
      return logLevel;
    }
  }
  return DEFAULT_LOG_LEVEL;
}
function LogLevelToString(logLevel) {
  switch (logLevel) {
    case 1 /* Trace */:
      return "trace";
    case 2 /* Debug */:
      return "debug";
    case 3 /* Info */:
      return "info";
    case 4 /* Warning */:
      return "warn";
    case 5 /* Error */:
      return "error";
    case 0 /* Off */:
      return "off";
  }
}
function parseLogLevel(logLevel) {
  switch (logLevel) {
    case "trace":
      return 1 /* Trace */;
    case "debug":
      return 2 /* Debug */;
    case "info":
      return 3 /* Info */;
    case "warn":
      return 4 /* Warning */;
    case "error":
      return 5 /* Error */;
    case "critical":
      return 5 /* Error */;
    case "off":
      return 0 /* Off */;
  }
  return void 0;
}
var CONTEXT_LOG_LEVEL = new RawContextKey("logLevel", LogLevelToString(3 /* Info */));

// src/vs/platform/agentHost/common/state/sessionActions.ts
function isRootAction(action) {
  return action.type.startsWith("root/");
}
function isSessionAction(action) {
  return action.type.startsWith("session/");
}

// src/vs/platform/agentHost/common/state/sessionReducers.ts
function rootReducer(state, action) {
  switch (action.type) {
    case "root/agentsChanged": {
      return { ...state, agents: action.agents };
    }
  }
}
function sessionReducer(state, action) {
  switch (action.type) {
    case "session/ready": {
      return { ...state, lifecycle: "ready" /* Ready */ };
    }
    case "session/creationFailed": {
      return {
        ...state,
        lifecycle: "creationFailed" /* CreationFailed */,
        creationError: action.error
      };
    }
    case "session/turnStarted": {
      const activeTurn = createActiveTurn(action.turnId, action.userMessage);
      return {
        ...state,
        activeTurn,
        summary: { ...state.summary, status: "in-progress" /* InProgress */ }
      };
    }
    case "session/delta": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      return {
        ...state,
        activeTurn: {
          ...state.activeTurn,
          streamingText: state.activeTurn.streamingText + action.content
        }
      };
    }
    case "session/responsePart": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      return {
        ...state,
        activeTurn: {
          ...state.activeTurn,
          responseParts: [...state.activeTurn.responseParts, action.part]
        }
      };
    }
    case "session/toolStart": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      const toolCalls = new Map(state.activeTurn.toolCalls);
      toolCalls.set(action.toolCall.toolCallId, action.toolCall);
      return {
        ...state,
        activeTurn: { ...state.activeTurn, toolCalls }
      };
    }
    case "session/toolComplete": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      const toolCall = state.activeTurn.toolCalls.get(action.toolCallId);
      if (!toolCall) {
        return state;
      }
      const toolCalls = new Map(state.activeTurn.toolCalls);
      toolCalls.set(action.toolCallId, {
        ...toolCall,
        status: action.result.success ? "completed" /* Completed */ : "failed" /* Failed */,
        pastTenseMessage: action.result.pastTenseMessage,
        toolOutput: action.result.toolOutput,
        error: action.result.error
      });
      return {
        ...state,
        activeTurn: { ...state.activeTurn, toolCalls }
      };
    }
    case "session/permissionRequest": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      const pendingPermissions = new Map(state.activeTurn.pendingPermissions);
      pendingPermissions.set(action.request.requestId, action.request);
      let toolCalls = state.activeTurn.toolCalls;
      if (action.request.toolCallId) {
        const toolCall = toolCalls.get(action.request.toolCallId);
        if (toolCall) {
          const mutable = new Map(toolCalls);
          mutable.set(action.request.toolCallId, {
            ...toolCall,
            status: "pending-permission" /* PendingPermission */
          });
          toolCalls = mutable;
        }
      }
      return {
        ...state,
        activeTurn: { ...state.activeTurn, pendingPermissions, toolCalls }
      };
    }
    case "session/permissionResolved": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      const pendingPermissions = new Map(state.activeTurn.pendingPermissions);
      const resolved = pendingPermissions.get(action.requestId);
      pendingPermissions.delete(action.requestId);
      let toolCalls = state.activeTurn.toolCalls;
      if (resolved?.toolCallId) {
        const toolCall = toolCalls.get(resolved.toolCallId);
        if (toolCall && toolCall.status === "pending-permission" /* PendingPermission */) {
          const mutable = new Map(toolCalls);
          mutable.set(resolved.toolCallId, {
            ...toolCall,
            status: action.approved ? "running" /* Running */ : "cancelled" /* Cancelled */,
            confirmed: action.approved ? "user-action" : "denied",
            cancellationReason: action.approved ? void 0 : "denied"
          });
          toolCalls = mutable;
        }
      }
      return {
        ...state,
        activeTurn: { ...state.activeTurn, pendingPermissions, toolCalls }
      };
    }
    case "session/turnComplete": {
      return finalizeTurn(state, action.turnId, "complete" /* Complete */);
    }
    case "session/turnCancelled": {
      return finalizeTurn(state, action.turnId, "cancelled" /* Cancelled */);
    }
    case "session/error": {
      return finalizeTurn(state, action.turnId, "error" /* Error */, action.error);
    }
    case "session/titleChanged": {
      return {
        ...state,
        summary: { ...state.summary, title: action.title, modifiedAt: Date.now() }
      };
    }
    case "session/modelChanged": {
      return {
        ...state,
        summary: { ...state.summary, model: action.model, modifiedAt: Date.now() }
      };
    }
    case "session/usage": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      return {
        ...state,
        activeTurn: {
          ...state.activeTurn,
          usage: action.usage
        }
      };
    }
    case "session/reasoning": {
      if (!state.activeTurn || state.activeTurn.id !== action.turnId) {
        return state;
      }
      return {
        ...state,
        activeTurn: {
          ...state.activeTurn,
          reasoning: state.activeTurn.reasoning + action.content
        }
      };
    }
  }
}
function finalizeTurn(state, turnId, turnState, error) {
  if (!state.activeTurn || state.activeTurn.id !== turnId) {
    return state;
  }
  const active = state.activeTurn;
  const completedToolCalls = [];
  for (const tc of active.toolCalls.values()) {
    completedToolCalls.push({
      toolCallId: tc.toolCallId,
      toolName: tc.toolName,
      displayName: tc.displayName,
      invocationMessage: tc.invocationMessage,
      success: tc.status === "completed" /* Completed */,
      pastTenseMessage: tc.pastTenseMessage ?? tc.invocationMessage,
      toolInput: tc.toolInput,
      toolKind: tc.toolKind,
      language: tc.language,
      toolOutput: tc.toolOutput,
      error: tc.error
    });
  }
  const finalizedTurn = {
    id: active.id,
    userMessage: active.userMessage,
    responseText: active.streamingText,
    responseParts: active.responseParts,
    toolCalls: completedToolCalls,
    usage: active.usage,
    state: turnState,
    error
  };
  return {
    ...state,
    turns: [...state.turns, finalizedTurn],
    activeTurn: void 0,
    summary: { ...state.summary, status: "idle" /* Idle */, modifiedAt: Date.now() }
  };
}

// src/vs/platform/agentHost/node/sessionStateManager.ts
var SessionStateManager = class extends Disposable {
  constructor(_logService) {
    super();
    this._logService = _logService;
    this._serverSeq = 0;
    this._sessionStates = /* @__PURE__ */ new Map();
    /** Tracks which session URI each active turn belongs to, keyed by turnId. */
    this._activeTurnToSession = /* @__PURE__ */ new Map();
    this._onDidEmitEnvelope = this._register(new Emitter());
    this.onDidEmitEnvelope = this._onDidEmitEnvelope.event;
    this._onDidEmitNotification = this._register(new Emitter());
    this.onDidEmitNotification = this._onDidEmitNotification.event;
    this._rootState = createRootState();
  }
  // ---- State accessors ----------------------------------------------------
  get rootState() {
    return this._rootState;
  }
  getSessionState(session) {
    return this._sessionStates.get(session.toString());
  }
  get serverSeq() {
    return this._serverSeq;
  }
  // ---- Snapshots ----------------------------------------------------------
  /**
   * Returns a state snapshot for a given resource URI.
   * The `fromSeq` in the snapshot is the current serverSeq at snapshot time;
   * the client should process subsequent envelopes with serverSeq > fromSeq.
   */
  getSnapshot(resource) {
    const key = resource.toString();
    if (key === ROOT_STATE_URI.toString()) {
      return {
        resource,
        state: this._rootState,
        fromSeq: this._serverSeq
      };
    }
    const sessionState = this._sessionStates.get(key);
    if (!sessionState) {
      return void 0;
    }
    return {
      resource,
      state: sessionState,
      fromSeq: this._serverSeq
    };
  }
  // ---- Session lifecycle --------------------------------------------------
  /**
   * Creates a new session in state with `lifecycle: 'creating'`.
   * Returns the initial session state.
   */
  createSession(summary) {
    const key = summary.resource.toString();
    if (this._sessionStates.has(key)) {
      this._logService.warn(`[SessionStateManager] Session already exists: ${key}`);
      return this._sessionStates.get(key);
    }
    const state = createSessionState(summary);
    this._sessionStates.set(key, state);
    this._logService.trace(`[SessionStateManager] Created session: ${key}`);
    this._onDidEmitNotification.fire({
      type: "notify/sessionAdded",
      summary
    });
    return state;
  }
  /**
   * Removes a session from state and emits a sessionRemoved notification.
   */
  removeSession(session) {
    const key = session.toString();
    const state = this._sessionStates.get(key);
    if (!state) {
      return;
    }
    if (state.activeTurn) {
      this._activeTurnToSession.delete(state.activeTurn.id);
    }
    this._sessionStates.delete(key);
    this._logService.trace(`[SessionStateManager] Removed session: ${key}`);
    this._onDidEmitNotification.fire({
      type: "notify/sessionRemoved",
      session
    });
  }
  // ---- Turn tracking ------------------------------------------------------
  /**
   * Registers a mapping from turnId to session URI so that incoming
   * provider events (which carry only session URI) can be associated
   * with the correct active turn.
   */
  getActiveTurnId(session) {
    const state = this._sessionStates.get(session.toString());
    return state?.activeTurn?.id;
  }
  // ---- Action dispatch ----------------------------------------------------
  /**
   * Dispatch a server-originated action (from the agent backend).
   * The action is applied to state via the reducer and emitted as an
   * envelope with no origin (server-produced).
   */
  dispatchServerAction(action) {
    this._applyAndEmit(action, void 0);
  }
  /**
   * Dispatch a client-originated action (write-ahead from a renderer).
   * The action is applied to state and emitted with the client's origin
   * so the originating client can reconcile.
   */
  dispatchClientAction(action, origin) {
    return this._applyAndEmit(action, origin);
  }
  // ---- Internal -----------------------------------------------------------
  _applyAndEmit(action, origin) {
    let resultingState = void 0;
    if (isRootAction(action)) {
      this._rootState = rootReducer(this._rootState, action);
      resultingState = this._rootState;
    }
    if (isSessionAction(action)) {
      const sessionAction = action;
      const key = sessionAction.session.toString();
      const state = this._sessionStates.get(key);
      if (state) {
        const newState = sessionReducer(state, sessionAction);
        this._sessionStates.set(key, newState);
        if (sessionAction.type === "session/turnStarted") {
          this._activeTurnToSession.set(sessionAction.turnId, key);
        } else if (sessionAction.type === "session/turnComplete" || sessionAction.type === "session/turnCancelled" || sessionAction.type === "session/error") {
          this._activeTurnToSession.delete(sessionAction.turnId);
        }
        resultingState = newState;
      } else {
        this._logService.warn(`[SessionStateManager] Action for unknown session: ${key}, type=${action.type}`);
      }
    }
    const envelope = {
      action,
      serverSeq: ++this._serverSeq,
      origin
    };
    this._logService.trace(`[SessionStateManager] Emitting envelope: seq=${envelope.serverSeq}, type=${action.type}${origin ? `, origin=${origin.clientId}:${origin.clientSeq}` : ""}`);
    this._onDidEmitEnvelope.fire(envelope);
    return resultingState;
  }
};
SessionStateManager = __decorateClass([
  __decorateParam(0, ILogService)
], SessionStateManager);

// src/vs/platform/agentHost/node/agentService.ts
var AgentService = class extends Disposable {
  constructor(_logService) {
    super();
    this._logService = _logService;
    /** Protocol: fires when state is mutated by an action. */
    this._onDidAction = this._register(new Emitter());
    this.onDidAction = this._onDidAction.event;
    /** Protocol: fires for ephemeral notifications (sessionAdded/Removed). */
    this._onDidNotification = this._register(new Emitter());
    this.onDidNotification = this._onDidNotification.event;
    /** Registered providers keyed by their {@link AgentProvider} id. */
    this._providers = /* @__PURE__ */ new Map();
    /** Maps each active session URI (toString) to its owning provider. */
    this._sessionToProvider = /* @__PURE__ */ new Map();
    /** Subscriptions to provider progress events; cleared when providers change. */
    this._providerSubscriptions = this._register(new DisposableStore());
    /** Observable registered agents, drives `root/agentsChanged` via {@link AgentSideEffects}. */
    this._agents = observableValue("agents", []);
    this._logService.info("AgentService initialized");
    this._stateManager = this._register(new SessionStateManager(_logService));
    this._register(this._stateManager.onDidEmitEnvelope((e) => this._onDidAction.fire(e)));
    this._register(this._stateManager.onDidEmitNotification((e) => this._onDidNotification.fire(e)));
    this._sideEffects = this._register(new AgentSideEffects(this._stateManager, {
      getAgent: (session) => this._findProviderForSession(session),
      agents: this._agents
    }, this._logService));
  }
  // ---- provider registration ----------------------------------------------
  registerProvider(provider) {
    if (this._providers.has(provider.id)) {
      throw new Error(`Agent provider already registered: ${provider.id}`);
    }
    this._logService.info(`Registering agent provider: ${provider.id}`);
    this._providers.set(provider.id, provider);
    this._providerSubscriptions.add(this._sideEffects.registerProgressListener(provider));
    if (!this._defaultProvider) {
      this._defaultProvider = provider.id;
    }
    this._updateAgents();
  }
  // ---- auth ---------------------------------------------------------------
  async listAgents() {
    return [...this._providers.values()].map((p) => p.getDescriptor());
  }
  async setAuthToken(token) {
    this._logService.trace("[AgentService] setAuthToken called");
    const promises3 = [];
    for (const provider of this._providers.values()) {
      promises3.push(provider.setAuthToken(token));
    }
    await Promise.all(promises3);
  }
  // ---- session management -------------------------------------------------
  async listSessions() {
    this._logService.trace("[AgentService] listSessions called");
    const results = await Promise.all(
      [...this._providers.values()].map((p) => p.listSessions())
    );
    const flat = results.flat();
    this._logService.trace(`[AgentService] listSessions returned ${flat.length} sessions`);
    return flat;
  }
  /**
   * Refreshes the model list from all providers and publishes the updated
   * agents (with their models) to root state via `root/agentsChanged`.
   */
  async refreshModels() {
    this._logService.trace("[AgentService] refreshModels called");
    this._updateAgents();
  }
  async createSession(config) {
    const providerId = config?.provider ?? this._defaultProvider;
    const provider = providerId ? this._providers.get(providerId) : void 0;
    if (!provider) {
      throw new Error(`No agent provider registered for: ${providerId ?? "(none)"}`);
    }
    this._logService.trace(`[AgentService] createSession: provider=${provider.id} model=${config?.model ?? "(default)"}`);
    const session = await provider.createSession(config);
    this._sessionToProvider.set(session.toString(), provider.id);
    this._logService.trace(`[AgentService] createSession returned: ${session.toString()}`);
    const summary = {
      resource: session,
      provider: provider.id,
      title: "New Session",
      status: "idle" /* Idle */,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
    this._stateManager.createSession(summary);
    this._stateManager.dispatchServerAction({ type: "session/ready", session });
    return session;
  }
  async disposeSession(session) {
    this._logService.trace(`[AgentService] disposeSession: ${session.toString()}`);
    const provider = this._findProviderForSession(session);
    if (provider) {
      await provider.disposeSession(session);
      this._sessionToProvider.delete(session.toString());
    }
    this._stateManager.removeSession(session);
  }
  // ---- Protocol methods ---------------------------------------------------
  async subscribe(resource) {
    this._logService.trace(`[AgentService] subscribe: ${resource.toString()}`);
    const snapshot = this._stateManager.getSnapshot(resource);
    if (!snapshot) {
      throw new Error(`Cannot subscribe to unknown resource: ${resource.toString()}`);
    }
    return snapshot;
  }
  unsubscribe(resource) {
    this._logService.trace(`[AgentService] unsubscribe: ${resource.toString()}`);
  }
  dispatchAction(action, clientId, clientSeq) {
    this._logService.trace(`[AgentService] dispatchAction: type=${action.type}, clientId=${clientId}, clientSeq=${clientSeq}`, action);
    const origin = { clientId, clientSeq };
    const state = this._stateManager.dispatchClientAction(action, origin);
    this._logService.trace(`[AgentService] resulting state:`, state);
    this._sideEffects.handleAction(action);
  }
  async shutdown() {
    this._logService.info("AgentService: shutting down all providers...");
    const promises3 = [];
    for (const provider of this._providers.values()) {
      promises3.push(provider.shutdown());
    }
    await Promise.all(promises3);
    this._sessionToProvider.clear();
  }
  // ---- helpers ------------------------------------------------------------
  _findProviderForSession(session) {
    const providerId = this._sessionToProvider.get(session.toString());
    if (providerId) {
      return this._providers.get(providerId);
    }
    const schemeProvider = AgentSession.provider(session);
    if (schemeProvider) {
      return this._providers.get(schemeProvider);
    }
    if (this._defaultProvider) {
      return this._providers.get(this._defaultProvider);
    }
    return void 0;
  }
  /**
   * Sets the agents observable to trigger model re-fetch and
   * `root/agentsChanged` via the autorun in {@link AgentSideEffects}.
   */
  _updateAgents() {
    this._agents.set([...this._providers.values()], void 0);
  }
  dispose() {
    for (const provider of this._providers.values()) {
      provider.dispose();
    }
    this._providers.clear();
    super.dispose();
  }
};

// src/vs/platform/agentHost/node/copilot/copilotAgent.ts
import { CopilotClient } from "@github/copilot-sdk";

// src/vs/base/common/uuid.ts
var generateUuid = (function() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID.bind(crypto);
  }
  const _data = new Uint8Array(16);
  const _hex = [];
  for (let i = 0; i < 256; i++) {
    _hex.push(i.toString(16).padStart(2, "0"));
  }
  return function generateUuid2() {
    crypto.getRandomValues(_data);
    _data[6] = _data[6] & 15 | 64;
    _data[8] = _data[8] & 63 | 128;
    let i = 0;
    let result = "";
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += "-";
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += "-";
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += "-";
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += "-";
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    result += _hex[_data[i++]];
    return result;
  };
})();

// src/vs/platform/agentHost/node/copilot/copilotToolDisplay.ts
var SHELL_TOOL_NAMES = /* @__PURE__ */ new Set([
  "bash" /* Bash */,
  "powershell" /* PowerShell */
]);
var HIDDEN_TOOL_NAMES = /* @__PURE__ */ new Set([
  "report_intent" /* ReportIntent */
]);
function isHiddenTool(toolName) {
  return HIDDEN_TOOL_NAMES.has(toolName);
}
function truncate(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
}
function getToolDisplayName(toolName) {
  switch (toolName) {
    case "bash" /* Bash */:
      return localize(1865, null);
    case "powershell" /* PowerShell */:
      return localize(1872, null);
    case "read_bash" /* ReadBash */:
    case "read_powershell" /* ReadPowerShell */:
      return localize(1873, null);
    case "write_bash" /* WriteBash */:
    case "write_powershell" /* WritePowerShell */:
      return localize(1877, null);
    case "bash_shutdown" /* BashShutdown */:
      return localize(1866, null);
    case "list_bash" /* ListBash */:
    case "list_powershell" /* ListPowerShell */:
      return localize(1870, null);
    case "view" /* View */:
      return localize(1874, null);
    case "edit" /* Edit */:
      return localize(1867, null);
    case "write" /* Write */:
      return localize(1876, null);
    case "grep" /* Grep */:
      return localize(1869, null);
    case "glob" /* Glob */:
      return localize(1868, null);
    case "patch" /* Patch */:
      return localize(1871, null);
    case "web_search" /* WebSearch */:
      return localize(1875, null);
    case "ask_user" /* AskUser */:
      return localize(1864, null);
    default:
      return toolName;
  }
}
function getInvocationMessage(toolName, displayName, parameters) {
  if (SHELL_TOOL_NAMES.has(toolName)) {
    const args = parameters;
    if (args?.command) {
      const firstLine = args.command.split("\n")[0];
      return localize(1859, null, truncate(firstLine, 80));
    }
    return localize(1858, null, displayName);
  }
  switch (toolName) {
    case "view" /* View */: {
      const args = parameters;
      if (args?.file_path) {
        return localize(1861, null, args.file_path);
      }
      return localize(1860, null);
    }
    case "edit" /* Edit */: {
      const args = parameters;
      if (args?.file_path) {
        return localize(1852, null, args.file_path);
      }
      return localize(1851, null);
    }
    case "write" /* Write */: {
      const args = parameters;
      if (args?.file_path) {
        return localize(1863, null, args.file_path);
      }
      return localize(1862, null);
    }
    case "grep" /* Grep */: {
      const args = parameters;
      if (args?.pattern) {
        return localize(1857, null, truncate(args.pattern, 80));
      }
      return localize(1856, null);
    }
    case "glob" /* Glob */: {
      const args = parameters;
      if (args?.pattern) {
        return localize(1855, null, truncate(args.pattern, 80));
      }
      return localize(1854, null);
    }
    default:
      return localize(1853, null, displayName);
  }
}
function getPastTenseMessage(toolName, displayName, parameters, success) {
  if (!success) {
    return localize(1839, null, displayName);
  }
  if (SHELL_TOOL_NAMES.has(toolName)) {
    const args = parameters;
    if (args?.command) {
      const firstLine = args.command.split("\n")[0];
      return localize(1846, null, truncate(firstLine, 80));
    }
    return localize(1845, null, displayName);
  }
  switch (toolName) {
    case "view" /* View */: {
      const args = parameters;
      if (args?.file_path) {
        return localize(1848, null, args.file_path);
      }
      return localize(1847, null);
    }
    case "edit" /* Edit */: {
      const args = parameters;
      if (args?.file_path) {
        return localize(1838, null, args.file_path);
      }
      return localize(1837, null);
    }
    case "write" /* Write */: {
      const args = parameters;
      if (args?.file_path) {
        return localize(1850, null, args.file_path);
      }
      return localize(1849, null);
    }
    case "grep" /* Grep */: {
      const args = parameters;
      if (args?.pattern) {
        return localize(1844, null, truncate(args.pattern, 80));
      }
      return localize(1843, null);
    }
    case "glob" /* Glob */: {
      const args = parameters;
      if (args?.pattern) {
        return localize(1842, null, truncate(args.pattern, 80));
      }
      return localize(1841, null);
    }
    default:
      return localize(1840, null, displayName);
  }
}
function getToolInputString(toolName, parameters, rawArguments) {
  if (!parameters && !rawArguments) {
    return void 0;
  }
  if (SHELL_TOOL_NAMES.has(toolName)) {
    const args = parameters;
    return args?.command ?? rawArguments;
  }
  switch (toolName) {
    case "grep" /* Grep */: {
      const args = parameters;
      return args?.pattern ?? rawArguments;
    }
    default:
      if (parameters) {
        try {
          return JSON.stringify(parameters, null, 2);
        } catch {
          return rawArguments;
        }
      }
      return rawArguments;
  }
}
function getToolKind(toolName) {
  if (SHELL_TOOL_NAMES.has(toolName)) {
    return "terminal";
  }
  return void 0;
}
function getShellLanguage(toolName) {
  switch (toolName) {
    case "powershell" /* PowerShell */:
      return "powershell";
    default:
      return "shellscript";
  }
}

// src/vs/platform/agentHost/node/copilot/copilotSessionWrapper.ts
var CopilotSessionWrapper = class extends Disposable {
  constructor(session) {
    super();
    this.session = session;
    this._register(toDisposable(() => {
      session.destroy().catch(() => {
      });
    }));
  }
  get sessionId() {
    return this.session.sessionId;
  }
  get onMessageDelta() {
    return this._onMessageDelta ??= this._sdkEvent("assistant.message_delta");
  }
  get onMessage() {
    return this._onMessage ??= this._sdkEvent("assistant.message");
  }
  get onToolStart() {
    return this._onToolStart ??= this._sdkEvent("tool.execution_start");
  }
  get onToolComplete() {
    return this._onToolComplete ??= this._sdkEvent("tool.execution_complete");
  }
  get onIdle() {
    return this._onIdle ??= this._sdkEvent("session.idle");
  }
  get onSessionStart() {
    return this._onSessionStart ??= this._sdkEvent("session.start");
  }
  get onSessionResume() {
    return this._onSessionResume ??= this._sdkEvent("session.resume");
  }
  get onSessionError() {
    return this._onSessionError ??= this._sdkEvent("session.error");
  }
  get onSessionInfo() {
    return this._onSessionInfo ??= this._sdkEvent("session.info");
  }
  get onSessionModelChange() {
    return this._onSessionModelChange ??= this._sdkEvent("session.model_change");
  }
  get onSessionHandoff() {
    return this._onSessionHandoff ??= this._sdkEvent("session.handoff");
  }
  get onSessionTruncation() {
    return this._onSessionTruncation ??= this._sdkEvent("session.truncation");
  }
  get onSessionSnapshotRewind() {
    return this._onSessionSnapshotRewind ??= this._sdkEvent("session.snapshot_rewind");
  }
  get onSessionShutdown() {
    return this._onSessionShutdown ??= this._sdkEvent("session.shutdown");
  }
  get onSessionUsageInfo() {
    return this._onSessionUsageInfo ??= this._sdkEvent("session.usage_info");
  }
  get onSessionCompactionStart() {
    return this._onSessionCompactionStart ??= this._sdkEvent("session.compaction_start");
  }
  get onSessionCompactionComplete() {
    return this._onSessionCompactionComplete ??= this._sdkEvent("session.compaction_complete");
  }
  get onUserMessage() {
    return this._onUserMessage ??= this._sdkEvent("user.message");
  }
  get onPendingMessagesModified() {
    return this._onPendingMessagesModified ??= this._sdkEvent("pending_messages.modified");
  }
  get onTurnStart() {
    return this._onTurnStart ??= this._sdkEvent("assistant.turn_start");
  }
  get onIntent() {
    return this._onIntent ??= this._sdkEvent("assistant.intent");
  }
  get onReasoning() {
    return this._onReasoning ??= this._sdkEvent("assistant.reasoning");
  }
  get onReasoningDelta() {
    return this._onReasoningDelta ??= this._sdkEvent("assistant.reasoning_delta");
  }
  get onTurnEnd() {
    return this._onTurnEnd ??= this._sdkEvent("assistant.turn_end");
  }
  get onUsage() {
    return this._onUsage ??= this._sdkEvent("assistant.usage");
  }
  get onAbort() {
    return this._onAbort ??= this._sdkEvent("abort");
  }
  get onToolUserRequested() {
    return this._onToolUserRequested ??= this._sdkEvent("tool.user_requested");
  }
  get onToolPartialResult() {
    return this._onToolPartialResult ??= this._sdkEvent("tool.execution_partial_result");
  }
  get onToolProgress() {
    return this._onToolProgress ??= this._sdkEvent("tool.execution_progress");
  }
  get onSkillInvoked() {
    return this._onSkillInvoked ??= this._sdkEvent("skill.invoked");
  }
  get onSubagentStarted() {
    return this._onSubagentStarted ??= this._sdkEvent("subagent.started");
  }
  get onSubagentCompleted() {
    return this._onSubagentCompleted ??= this._sdkEvent("subagent.completed");
  }
  get onSubagentFailed() {
    return this._onSubagentFailed ??= this._sdkEvent("subagent.failed");
  }
  get onSubagentSelected() {
    return this._onSubagentSelected ??= this._sdkEvent("subagent.selected");
  }
  get onHookStart() {
    return this._onHookStart ??= this._sdkEvent("hook.start");
  }
  get onHookEnd() {
    return this._onHookEnd ??= this._sdkEvent("hook.end");
  }
  get onSystemMessage() {
    return this._onSystemMessage ??= this._sdkEvent("system.message");
  }
  _sdkEvent(eventType) {
    const emitter = this._register(new Emitter());
    const unsubscribe = this.session.on(eventType, (data) => emitter.fire(data));
    this._register(toDisposable(unsubscribe));
    return emitter.event;
  }
};

// src/vs/platform/agentHost/node/copilot/copilotAgent.ts
function tryStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return void 0;
  }
}
var CopilotAgent = class extends Disposable {
  constructor(_logService) {
    super();
    this._logService = _logService;
    this.id = "copilot";
    this._onDidSessionProgress = this._register(new Emitter());
    this.onDidSessionProgress = this._onDidSessionProgress.event;
    this._sessions = this._register(new DisposableMap());
    /** Tracks active tool invocations so we can produce past-tense messages on completion. Keyed by `sessionId:toolCallId`. */
    this._activeToolCalls = /* @__PURE__ */ new Map();
    /** Pending permission requests awaiting a renderer-side decision. Keyed by requestId. */
    this._pendingPermissions = /* @__PURE__ */ new Map();
    /** Working directory per session, used when resuming. */
    this._sessionWorkingDirs = /* @__PURE__ */ new Map();
  }
  // ---- auth ---------------------------------------------------------------
  getDescriptor() {
    return {
      provider: "copilot",
      displayName: "Agent Host - Copilot",
      description: "Copilot SDK agent running in a dedicated process",
      requiresAuth: true
    };
  }
  async setAuthToken(token) {
    const tokenChanged = this._githubToken !== token;
    this._githubToken = token;
    this._logService.info(`[Copilot] Auth token ${tokenChanged ? "updated" : "unchanged"} (${token.substring(0, 4)}...)`);
    if (tokenChanged && this._client && this._sessions.size === 0) {
      this._logService.info("[Copilot] Restarting CopilotClient with new token");
      const client = this._client;
      this._client = void 0;
      this._clientStarting = void 0;
      await client.stop();
    }
  }
  // ---- client lifecycle ---------------------------------------------------
  async _ensureClient() {
    if (this._client) {
      return this._client;
    }
    if (this._clientStarting) {
      return this._clientStarting;
    }
    this._clientStarting = (async () => {
      this._logService.info(`[Copilot] Starting CopilotClient... ${this._githubToken ? "(with token)" : "(using logged-in user)"}`);
      const env2 = Object.assign({}, process.env, { ELECTRON_RUN_AS_NODE: "1" });
      delete env2["NODE_OPTIONS"];
      delete env2["VSCODE_INSPECTOR_OPTIONS"];
      delete env2["VSCODE_ESM_ENTRYPOINT"];
      delete env2["VSCODE_HANDLES_UNCAUGHT_ERRORS"];
      for (const key of Object.keys(env2)) {
        if (key === "ELECTRON_RUN_AS_NODE") {
          continue;
        }
        if (key.startsWith("VSCODE_") || key.startsWith("ELECTRON_")) {
          delete env2[key];
        }
      }
      env2["COPILOT_CLI_RUN_AS_NODE"] = "1";
      const cliPath = URI.joinPath(FileAccess.asFileUri(""), "..", "node_modules", "@github", "copilot", "index.js").fsPath;
      this._logService.info(`[Copilot] Resolved CLI path: ${cliPath}`);
      const client = new CopilotClient({
        githubToken: this._githubToken,
        useLoggedInUser: !this._githubToken,
        useStdio: true,
        autoStart: true,
        env: env2,
        cliPath
      });
      await client.start();
      this._logService.info("[Copilot] CopilotClient started successfully");
      this._client = client;
      this._clientStarting = void 0;
      return client;
    })();
    return this._clientStarting;
  }
  // ---- session management -------------------------------------------------
  async listSessions() {
    this._logService.info("[Copilot] Listing sessions...");
    const client = await this._ensureClient();
    const sessions = await client.listSessions();
    const result = sessions.map((s) => ({
      session: AgentSession.uri(this.id, s.sessionId),
      startTime: s.startTime.getTime(),
      modifiedTime: s.modifiedTime.getTime(),
      summary: s.summary
    }));
    this._logService.info(`[Copilot] Found ${result.length} sessions`);
    return result;
  }
  async listModels() {
    this._logService.info("[Copilot] Listing models...");
    const client = await this._ensureClient();
    const models = await client.listModels();
    const result = models.map((m) => ({
      provider: this.id,
      id: m.id,
      name: m.name,
      maxContextWindow: m.capabilities.limits.max_context_window_tokens,
      supportsVision: m.capabilities.supports.vision,
      supportsReasoningEffort: m.capabilities.supports.reasoningEffort,
      supportedReasoningEfforts: m.supportedReasoningEfforts,
      defaultReasoningEffort: m.defaultReasoningEffort,
      policyState: m.policy?.state,
      billingMultiplier: m.billing?.multiplier
    }));
    this._logService.info(`[Copilot] Found ${result.length} models`);
    return result;
  }
  async createSession(config) {
    this._logService.info(`[Copilot] Creating session... ${config?.model ? `model=${config.model}` : ""}`);
    const client = await this._ensureClient();
    const raw = await client.createSession({
      model: config?.model,
      sessionId: config?.session ? AgentSession.id(config.session) : void 0,
      streaming: true,
      workingDirectory: config?.workingDirectory,
      onPermissionRequest: (request, invocation) => this._handlePermissionRequest(request, invocation)
    });
    const wrapper = this._trackSession(raw);
    const session = AgentSession.uri(this.id, wrapper.sessionId);
    if (config?.workingDirectory) {
      this._sessionWorkingDirs.set(wrapper.sessionId, config.workingDirectory);
    }
    this._logService.info(`[Copilot] Session created: ${session.toString()}`);
    return session;
  }
  async sendMessage(session, prompt, attachments) {
    const sessionId = AgentSession.id(session);
    this._logService.info(`[Copilot:${sessionId}] sendMessage called: "${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}" (${attachments?.length ?? 0} attachments)`);
    const entry = this._sessions.get(sessionId) ?? await this._resumeSession(sessionId);
    this._logService.info(`[Copilot:${sessionId}] Found session wrapper, calling session.send()...`);
    const sdkAttachments = attachments?.map((a) => {
      if (a.type === "selection") {
        return { type: "selection", filePath: a.path, displayName: a.displayName ?? a.path, text: a.text, selection: a.selection };
      }
      return { type: a.type, path: a.path, displayName: a.displayName };
    });
    if (sdkAttachments?.length) {
      this._logService.trace(`[Copilot:${sessionId}] Attachments: ${JSON.stringify(sdkAttachments.map((a) => ({ type: a.type, path: a.type === "selection" ? a.filePath : a.path })))}`);
    }
    await entry.session.send({ prompt, attachments: sdkAttachments });
    this._logService.info(`[Copilot:${sessionId}] session.send() returned`);
  }
  async getSessionMessages(session) {
    const sessionId = AgentSession.id(session);
    const entry = this._sessions.get(sessionId) ?? await this._resumeSession(sessionId).catch(() => void 0);
    if (!entry) {
      return [];
    }
    const events = await entry.session.getMessages();
    return this._mapSessionEvents(session, events);
  }
  async disposeSession(session) {
    const sessionId = AgentSession.id(session);
    this._sessions.deleteAndDispose(sessionId);
    this._clearToolCallsForSession(sessionId);
    this._sessionWorkingDirs.delete(sessionId);
    this._denyPendingPermissionsForSession(sessionId);
  }
  async abortSession(session) {
    const sessionId = AgentSession.id(session);
    const entry = this._sessions.get(sessionId);
    if (entry) {
      this._logService.info(`[Copilot:${sessionId}] Aborting session...`);
      this._denyPendingPermissionsForSession(sessionId);
      await entry.session.abort();
    }
  }
  async changeModel(session, model) {
    const sessionId = AgentSession.id(session);
    const entry = this._sessions.get(sessionId);
    if (entry) {
      this._logService.info(`[Copilot:${sessionId}] Changing model to: ${model}`);
      await entry.session.setModel(model);
    }
  }
  async shutdown() {
    this._logService.info("[Copilot] Shutting down...");
    this._sessions.clearAndDisposeAll();
    this._activeToolCalls.clear();
    this._sessionWorkingDirs.clear();
    this._denyPendingPermissions();
    await this._client?.stop();
    this._client = void 0;
  }
  respondToPermissionRequest(requestId, approved) {
    const entry = this._pendingPermissions.get(requestId);
    if (entry) {
      this._pendingPermissions.delete(requestId);
      entry.deferred.complete(approved);
    }
  }
  /**
   * Returns true if this provider owns the given session ID.
   */
  hasSession(session) {
    return this._sessions.has(AgentSession.id(session));
  }
  // ---- helpers ------------------------------------------------------------
  /**
   * Handles a permission request from the SDK by firing a progress event
   * and waiting for the renderer to respond via respondToPermissionRequest.
   */
  async _handlePermissionRequest(request, invocation) {
    const session = AgentSession.uri(this.id, invocation.sessionId);
    this._logService.info(`[Copilot:${invocation.sessionId}] Permission request: kind=${request.kind}`);
    if (request.kind === "read") {
      const requestPath = typeof request.path === "string" ? request.path : void 0;
      const workingDir = this._sessionWorkingDirs.get(invocation.sessionId);
      if (requestPath && workingDir && requestPath.startsWith(workingDir)) {
        this._logService.trace(`[Copilot:${invocation.sessionId}] Auto-approving read inside working directory: ${requestPath}`);
        return { kind: "approved" };
      }
    }
    const requestId = generateUuid();
    this._logService.info(`[Copilot:${invocation.sessionId}] Requesting permission from renderer: requestId=${requestId}`);
    const deferred = new DeferredPromise();
    this._pendingPermissions.set(requestId, { sessionId: invocation.sessionId, deferred });
    const permissionKind = ["shell", "write", "mcp", "read", "url"].includes(request.kind) ? request.kind : "read";
    this._onDidSessionProgress.fire({
      session,
      type: "permission_request",
      requestId,
      permissionKind,
      toolCallId: request.toolCallId,
      path: typeof request.path === "string" ? request.path : typeof request.fileName === "string" ? request.fileName : void 0,
      fullCommandText: typeof request.fullCommandText === "string" ? request.fullCommandText : void 0,
      intention: typeof request.intention === "string" ? request.intention : void 0,
      serverName: typeof request.serverName === "string" ? request.serverName : void 0,
      toolName: typeof request.toolName === "string" ? request.toolName : void 0,
      rawRequest: tryStringify(request) ?? "[unserializable permission request]"
    });
    const approved = await deferred.p;
    this._logService.info(`[Copilot:${invocation.sessionId}] Permission response: requestId=${requestId}, approved=${approved}`);
    return { kind: approved ? "approved" : "denied-interactively-by-user" };
  }
  _clearToolCallsForSession(sessionId) {
    const prefix = `${sessionId}:`;
    for (const key of this._activeToolCalls.keys()) {
      if (key.startsWith(prefix)) {
        this._activeToolCalls.delete(key);
      }
    }
  }
  _trackSession(raw, sessionIdOverride) {
    const wrapper = new CopilotSessionWrapper(raw);
    const rawId = sessionIdOverride ?? wrapper.sessionId;
    const session = AgentSession.uri(this.id, rawId);
    wrapper.onMessageDelta((e) => {
      this._logService.trace(`[Copilot:${rawId}] delta: ${e.data.deltaContent}`);
      this._onDidSessionProgress.fire({
        session,
        type: "delta",
        messageId: e.data.messageId,
        content: e.data.deltaContent,
        parentToolCallId: e.data.parentToolCallId
      });
    });
    wrapper.onMessage((e) => {
      this._logService.info(`[Copilot:${rawId}] Full message received: ${e.data.content.length} chars`);
      this._onDidSessionProgress.fire({
        session,
        type: "message",
        role: "assistant",
        messageId: e.data.messageId,
        content: e.data.content,
        toolRequests: e.data.toolRequests?.map((tr) => ({
          toolCallId: tr.toolCallId,
          name: tr.name,
          arguments: tr.arguments !== void 0 ? tryStringify(tr.arguments) : void 0,
          type: tr.type
        })),
        reasoningOpaque: e.data.reasoningOpaque,
        reasoningText: e.data.reasoningText,
        encryptedContent: e.data.encryptedContent,
        parentToolCallId: e.data.parentToolCallId
      });
    });
    wrapper.onToolStart((e) => {
      if (isHiddenTool(e.data.toolName)) {
        this._logService.trace(`[Copilot:${rawId}] Tool started (hidden): ${e.data.toolName}`);
        return;
      }
      this._logService.info(`[Copilot:${rawId}] Tool started: ${e.data.toolName}`);
      const toolArgs = e.data.arguments !== void 0 ? tryStringify(e.data.arguments) : void 0;
      let parameters;
      if (toolArgs) {
        try {
          parameters = JSON.parse(toolArgs);
        } catch {
        }
      }
      const displayName = getToolDisplayName(e.data.toolName);
      const trackingKey = `${rawId}:${e.data.toolCallId}`;
      this._activeToolCalls.set(trackingKey, { toolName: e.data.toolName, displayName, parameters });
      const toolKind = getToolKind(e.data.toolName);
      this._onDidSessionProgress.fire({
        session,
        type: "tool_start",
        toolCallId: e.data.toolCallId,
        toolName: e.data.toolName,
        displayName,
        invocationMessage: getInvocationMessage(e.data.toolName, displayName, parameters),
        toolInput: getToolInputString(e.data.toolName, parameters, toolArgs),
        toolKind,
        language: toolKind === "terminal" ? getShellLanguage(e.data.toolName) : void 0,
        toolArguments: toolArgs,
        mcpServerName: e.data.mcpServerName,
        mcpToolName: e.data.mcpToolName,
        parentToolCallId: e.data.parentToolCallId
      });
    });
    wrapper.onToolComplete((e) => {
      const trackingKey = `${rawId}:${e.data.toolCallId}`;
      const tracked = this._activeToolCalls.get(trackingKey);
      if (!tracked) {
        return;
      }
      this._logService.info(`[Copilot:${rawId}] Tool completed: ${e.data.toolCallId}`);
      this._activeToolCalls.delete(trackingKey);
      const displayName = tracked.displayName;
      const toolOutput = e.data.error?.message ?? e.data.result?.content;
      this._onDidSessionProgress.fire({
        session,
        type: "tool_complete",
        toolCallId: e.data.toolCallId,
        success: e.data.success,
        pastTenseMessage: getPastTenseMessage(tracked?.toolName ?? "", displayName, tracked?.parameters, e.data.success),
        toolOutput,
        isUserRequested: e.data.isUserRequested,
        result: e.data.result,
        error: e.data.error,
        toolTelemetry: e.data.toolTelemetry !== void 0 ? tryStringify(e.data.toolTelemetry) : void 0,
        parentToolCallId: e.data.parentToolCallId
      });
    });
    wrapper.onIdle(() => {
      this._logService.info(`[Copilot:${rawId}] Session idle`);
      this._onDidSessionProgress.fire({ session, type: "idle" });
    });
    wrapper.onSessionError((e) => {
      this._logService.error(`[Copilot:${rawId}] Session error: ${e.data.errorType} - ${e.data.message}`);
      this._onDidSessionProgress.fire({
        session,
        type: "error",
        errorType: e.data.errorType,
        message: e.data.message,
        stack: e.data.stack
      });
    });
    wrapper.onUsage((e) => {
      this._logService.trace(`[Copilot:${rawId}] Usage: model=${e.data.model}, in=${e.data.inputTokens ?? "?"}, out=${e.data.outputTokens ?? "?"}, cacheRead=${e.data.cacheReadTokens ?? "?"}`);
      this._onDidSessionProgress.fire({
        session,
        type: "usage",
        inputTokens: e.data.inputTokens,
        outputTokens: e.data.outputTokens,
        model: e.data.model,
        cacheReadTokens: e.data.cacheReadTokens
      });
    });
    wrapper.onReasoningDelta((e) => {
      this._logService.trace(`[Copilot:${rawId}] Reasoning delta: ${e.data.deltaContent.length} chars`);
      this._onDidSessionProgress.fire({
        session,
        type: "reasoning",
        content: e.data.deltaContent
      });
    });
    this._subscribeForLogging(wrapper, rawId);
    this._sessions.set(rawId, wrapper);
    return wrapper;
  }
  _subscribeForLogging(wrapper, sessionId) {
    wrapper.onSessionStart((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Session started: model=${e.data.selectedModel ?? "default"}, producer=${e.data.producer}`);
    });
    wrapper.onSessionResume((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Session resumed: eventCount=${e.data.eventCount}`);
    });
    wrapper.onSessionInfo((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Session info [${e.data.infoType}]: ${e.data.message}`);
    });
    wrapper.onSessionModelChange((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Model changed: ${e.data.previousModel ?? "(none)"} -> ${e.data.newModel}`);
    });
    wrapper.onSessionHandoff((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Session handoff: sourceType=${e.data.sourceType}, remoteSessionId=${e.data.remoteSessionId ?? "(none)"}`);
    });
    wrapper.onSessionTruncation((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Session truncation: removed ${e.data.tokensRemovedDuringTruncation} tokens, ${e.data.messagesRemovedDuringTruncation} messages`);
    });
    wrapper.onSessionSnapshotRewind((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Snapshot rewind: upTo=${e.data.upToEventId}, eventsRemoved=${e.data.eventsRemoved}`);
    });
    wrapper.onSessionShutdown((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Session shutdown: type=${e.data.shutdownType}, premiumRequests=${e.data.totalPremiumRequests}, apiDuration=${e.data.totalApiDurationMs}ms`);
    });
    wrapper.onSessionUsageInfo((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Usage info: ${e.data.currentTokens}/${e.data.tokenLimit} tokens, ${e.data.messagesLength} messages`);
    });
    wrapper.onSessionCompactionStart(() => {
      this._logService.trace(`[Copilot:${sessionId}] Compaction started`);
    });
    wrapper.onSessionCompactionComplete((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Compaction complete: success=${e.data.success}, tokensRemoved=${e.data.tokensRemoved ?? "?"}`);
    });
    wrapper.onUserMessage((e) => {
      this._logService.trace(`[Copilot:${sessionId}] User message: ${e.data.content.length} chars, ${e.data.attachments?.length ?? 0} attachments`);
    });
    wrapper.onPendingMessagesModified(() => {
      this._logService.trace(`[Copilot:${sessionId}] Pending messages modified`);
    });
    wrapper.onTurnStart((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Turn started: ${e.data.turnId}`);
    });
    wrapper.onIntent((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Intent: ${e.data.intent}`);
    });
    wrapper.onReasoning((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Reasoning: ${e.data.content.length} chars`);
    });
    wrapper.onTurnEnd((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Turn ended: ${e.data.turnId}`);
    });
    wrapper.onAbort((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Aborted: ${e.data.reason}`);
    });
    wrapper.onToolUserRequested((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Tool user-requested: ${e.data.toolName} (${e.data.toolCallId})`);
    });
    wrapper.onToolPartialResult((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Tool partial result: ${e.data.toolCallId} (${e.data.partialOutput.length} chars)`);
    });
    wrapper.onToolProgress((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Tool progress: ${e.data.toolCallId} - ${e.data.progressMessage}`);
    });
    wrapper.onSkillInvoked((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Skill invoked: ${e.data.name} (${e.data.path})`);
    });
    wrapper.onSubagentStarted((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Subagent started: ${e.data.agentName} (${e.data.agentDisplayName})`);
    });
    wrapper.onSubagentCompleted((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Subagent completed: ${e.data.agentName}`);
    });
    wrapper.onSubagentFailed((e) => {
      this._logService.error(`[Copilot:${sessionId}] Subagent failed: ${e.data.agentName} - ${e.data.error}`);
    });
    wrapper.onSubagentSelected((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Subagent selected: ${e.data.agentName}`);
    });
    wrapper.onHookStart((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Hook started: ${e.data.hookType} (${e.data.hookInvocationId})`);
    });
    wrapper.onHookEnd((e) => {
      this._logService.trace(`[Copilot:${sessionId}] Hook ended: ${e.data.hookType} (${e.data.hookInvocationId}), success=${e.data.success}`);
    });
    wrapper.onSystemMessage((e) => {
      this._logService.trace(`[Copilot:${sessionId}] System message [${e.data.role}]: ${e.data.content.length} chars`);
    });
  }
  async _resumeSession(sessionId) {
    this._logService.info(`[Copilot:${sessionId}] Session not in memory, resuming...`);
    const client = await this._ensureClient();
    const raw = await client.resumeSession(sessionId, {
      onPermissionRequest: (request, invocation) => this._handlePermissionRequest(request, invocation),
      workingDirectory: this._sessionWorkingDirs.get(sessionId)
    });
    return this._trackSession(raw, sessionId);
  }
  _mapSessionEvents(session, events) {
    const result = [];
    const toolInfoByCallId = /* @__PURE__ */ new Map();
    for (const e of events) {
      if (e.type === "assistant.message" || e.type === "user.message") {
        const d = e.data;
        result.push({
          session,
          type: "message",
          role: e.type === "user.message" ? "user" : "assistant",
          messageId: d?.messageId ?? "",
          content: d?.content ?? "",
          toolRequests: d?.toolRequests?.map((tr) => ({
            toolCallId: tr.toolCallId,
            name: tr.name,
            arguments: tr.arguments !== void 0 ? tryStringify(tr.arguments) : void 0,
            type: tr.type
          })),
          reasoningOpaque: d?.reasoningOpaque,
          reasoningText: d?.reasoningText,
          encryptedContent: d?.encryptedContent,
          parentToolCallId: d?.parentToolCallId
        });
      } else if (e.type === "tool.execution_start") {
        const d = e.data;
        if (isHiddenTool(d.toolName)) {
          continue;
        }
        const toolArgs = d.arguments !== void 0 ? tryStringify(d.arguments) : void 0;
        let parameters;
        if (toolArgs) {
          try {
            parameters = JSON.parse(toolArgs);
          } catch {
          }
        }
        toolInfoByCallId.set(d.toolCallId, { toolName: d.toolName, parameters });
        const displayName = getToolDisplayName(d.toolName);
        const toolKind = getToolKind(d.toolName);
        result.push({
          session,
          type: "tool_start",
          toolCallId: d.toolCallId,
          toolName: d.toolName,
          displayName,
          invocationMessage: getInvocationMessage(d.toolName, displayName, parameters),
          toolInput: getToolInputString(d.toolName, parameters, toolArgs),
          toolKind,
          language: toolKind === "terminal" ? getShellLanguage(d.toolName) : void 0,
          toolArguments: toolArgs,
          mcpServerName: d.mcpServerName,
          mcpToolName: d.mcpToolName,
          parentToolCallId: d.parentToolCallId
        });
      } else if (e.type === "tool.execution_complete") {
        const d = e.data;
        const info = toolInfoByCallId.get(d.toolCallId);
        if (!info) {
          continue;
        }
        toolInfoByCallId.delete(d.toolCallId);
        const displayName = getToolDisplayName(info.toolName);
        result.push({
          session,
          type: "tool_complete",
          toolCallId: d.toolCallId,
          success: d.success,
          pastTenseMessage: getPastTenseMessage(info.toolName, displayName, info.parameters, d.success),
          toolOutput: d.error?.message ?? d.result?.content,
          isUserRequested: d.isUserRequested,
          result: d.result,
          error: d.error,
          toolTelemetry: d.toolTelemetry !== void 0 ? tryStringify(d.toolTelemetry) : void 0
        });
      }
    }
    return result;
  }
  dispose() {
    this._denyPendingPermissions();
    this._client?.stop().catch(() => {
    });
    super.dispose();
  }
  _denyPendingPermissions() {
    for (const [, entry] of this._pendingPermissions) {
      entry.deferred.complete(false);
    }
    this._pendingPermissions.clear();
  }
  _denyPendingPermissionsForSession(sessionId) {
    for (const [requestId, entry] of this._pendingPermissions) {
      if (entry.sessionId === sessionId) {
        entry.deferred.complete(false);
        this._pendingPermissions.delete(requestId);
      }
    }
  }
};
CopilotAgent = __decorateClass([
  __decorateParam(0, ILogService)
], CopilotAgent);

// src/vs/platform/environment/node/environmentService.ts
import { homedir as homedir2, tmpdir as tmpdir2 } from "os";

// src/vs/base/common/date.ts
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var month = day * 30;
var year = day * 365;
function toLocalISOString(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + "T" + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0") + "." + (date.getMilliseconds() / 1e3).toFixed(3).slice(2, 5) + "Z";
}

// src/vs/platform/environment/common/environmentService.ts
var EXTENSION_IDENTIFIER_WITH_LOG_REGEX = /^([^.]+\..+)[:=](.+)$/;
var AbstractNativeEnvironmentService = class {
  constructor(_args, paths, productService) {
    this._args = _args;
    this.paths = paths;
    this.productService = productService;
  }
  get appRoot() {
    return dirname(FileAccess.asFileUri("").fsPath);
  }
  get userHome() {
    return URI.file(this.paths.homeDir);
  }
  get userDataPath() {
    return this.paths.userDataDir;
  }
  get appSettingsHome() {
    return URI.file(join(this.userDataPath, "User"));
  }
  get tmpDir() {
    return URI.file(this.paths.tmpDir);
  }
  get cacheHome() {
    return URI.file(this.userDataPath);
  }
  get stateResource() {
    return joinPath(this.appSettingsHome, "globalStorage", "storage.json");
  }
  get userRoamingDataHome() {
    return this.appSettingsHome.with({ scheme: Schemas.vscodeUserData });
  }
  get userDataSyncHome() {
    return joinPath(this.appSettingsHome, "sync");
  }
  get logsHome() {
    if (!this.args.logsPath) {
      const key = toLocalISOString(/* @__PURE__ */ new Date()).replace(/-|:|\.\d+Z$/g, "");
      this.args.logsPath = join(this.userDataPath, "logs", key);
    }
    return URI.file(this.args.logsPath);
  }
  get sync() {
    return this.args.sync;
  }
  get workspaceStorageHome() {
    return joinPath(this.appSettingsHome, "workspaceStorage");
  }
  get localHistoryHome() {
    return joinPath(this.appSettingsHome, "History");
  }
  get keyboardLayoutResource() {
    return joinPath(this.userRoamingDataHome, "keyboardLayout.json");
  }
  get argvResource() {
    const vscodePortable = env["VSCODE_PORTABLE"];
    if (vscodePortable) {
      return URI.file(join(vscodePortable, "argv.json"));
    }
    return joinPath(this.userHome, this.productService.dataFolderName, "argv.json");
  }
  get isExtensionDevelopment() {
    return !!this.args.extensionDevelopmentPath;
  }
  get untitledWorkspacesHome() {
    return URI.file(join(this.userDataPath, "Workspaces"));
  }
  get builtinExtensionsPath() {
    const cliBuiltinExtensionsDir = this.args["builtin-extensions-dir"];
    if (cliBuiltinExtensionsDir) {
      return resolve(cliBuiltinExtensionsDir);
    }
    return normalize(join(FileAccess.asFileUri("").fsPath, "..", "extensions"));
  }
  get extensionsDownloadLocation() {
    const cliExtensionsDownloadDir = this.args["extensions-download-dir"];
    if (cliExtensionsDownloadDir) {
      return URI.file(resolve(cliExtensionsDownloadDir));
    }
    return URI.file(join(this.userDataPath, "CachedExtensionVSIXs"));
  }
  get extensionsPath() {
    const cliExtensionsDir = this.args["extensions-dir"];
    if (cliExtensionsDir) {
      return resolve(cliExtensionsDir);
    }
    const vscodeExtensions = env["VSCODE_EXTENSIONS"];
    if (vscodeExtensions) {
      return vscodeExtensions;
    }
    const vscodePortable = env["VSCODE_PORTABLE"];
    if (vscodePortable) {
      return join(vscodePortable, "extensions");
    }
    return joinPath(this.userHome, this.productService.dataFolderName, "extensions").fsPath;
  }
  get extensionDevelopmentLocationURI() {
    const extensionDevelopmentPaths = this.args.extensionDevelopmentPath;
    if (Array.isArray(extensionDevelopmentPaths)) {
      return extensionDevelopmentPaths.map((extensionDevelopmentPath) => {
        if (/^[^:/?#]+?:\/\//.test(extensionDevelopmentPath)) {
          return URI.parse(extensionDevelopmentPath);
        }
        return URI.file(normalize(extensionDevelopmentPath));
      });
    }
    return void 0;
  }
  get extensionDevelopmentKind() {
    return this.args.extensionDevelopmentKind?.map((kind) => kind === "ui" || kind === "workspace" || kind === "web" ? kind : "workspace");
  }
  get extensionTestsLocationURI() {
    const extensionTestsPath = this.args.extensionTestsPath;
    if (extensionTestsPath) {
      if (/^[^:/?#]+?:\/\//.test(extensionTestsPath)) {
        return URI.parse(extensionTestsPath);
      }
      return URI.file(normalize(extensionTestsPath));
    }
    return void 0;
  }
  get disableExtensions() {
    if (this.args["disable-extensions"]) {
      return true;
    }
    const disableExtensions = this.args["disable-extension"];
    if (disableExtensions) {
      if (typeof disableExtensions === "string") {
        return [disableExtensions];
      }
      if (Array.isArray(disableExtensions) && disableExtensions.length > 0) {
        return disableExtensions;
      }
    }
    return false;
  }
  get debugExtensionHost() {
    return parseExtensionHostDebugPort(this.args, this.isBuilt);
  }
  get debugRenderer() {
    return !!this.args.debugRenderer;
  }
  get isBuilt() {
    return !env["VSCODE_DEV"];
  }
  get verbose() {
    return !!this.args.verbose;
  }
  get logLevel() {
    return this.args.log?.find((entry) => !EXTENSION_IDENTIFIER_WITH_LOG_REGEX.test(entry));
  }
  get extensionLogLevel() {
    const result = [];
    for (const entry of this.args.log || []) {
      const matches = EXTENSION_IDENTIFIER_WITH_LOG_REGEX.exec(entry);
      if (matches?.[1] && matches[2]) {
        result.push([matches[1], matches[2]]);
      }
    }
    return result.length ? result : void 0;
  }
  get serviceMachineIdResource() {
    return joinPath(URI.file(this.userDataPath), "machineid");
  }
  get crashReporterId() {
    return this.args["crash-reporter-id"];
  }
  get crashReporterDirectory() {
    return this.args["crash-reporter-directory"];
  }
  get disableTelemetry() {
    return !!this.args["disable-telemetry"];
  }
  get disableExperiments() {
    return !!this.args["disable-experiments"];
  }
  get disableWorkspaceTrust() {
    return !!this.args["disable-workspace-trust"];
  }
  get useInMemorySecretStorage() {
    return !!this.args["use-inmemory-secretstorage"];
  }
  get policyFile() {
    if (this.args["__enable-file-policy"]) {
      const vscodePortable = env["VSCODE_PORTABLE"];
      if (vscodePortable) {
        return URI.file(join(vscodePortable, "policy.json"));
      }
      return joinPath(this.userHome, this.productService.dataFolderName, "policy.json");
    }
    return void 0;
  }
  get agentSessionsWorkspace() {
    return joinPath(this.appSettingsHome, "agent-sessions.code-workspace");
  }
  get editSessionId() {
    return this.args["editSessionId"];
  }
  get exportPolicyData() {
    return this.args["export-policy-data"];
  }
  get continueOn() {
    return this.args["continueOn"];
  }
  set continueOn(value) {
    this.args["continueOn"] = value;
  }
  get args() {
    return this._args;
  }
};
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "appRoot", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "userHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "userDataPath", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "appSettingsHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "tmpDir", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "cacheHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "stateResource", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "userRoamingDataHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "userDataSyncHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "sync", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "workspaceStorageHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "localHistoryHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "keyboardLayoutResource", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "argvResource", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "isExtensionDevelopment", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "untitledWorkspacesHome", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "builtinExtensionsPath", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "extensionsDownloadLocation", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "extensionsPath", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "extensionDevelopmentLocationURI", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "extensionDevelopmentKind", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "extensionTestsLocationURI", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "debugExtensionHost", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "logLevel", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "extensionLogLevel", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "serviceMachineIdResource", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "disableTelemetry", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "disableExperiments", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "disableWorkspaceTrust", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "useInMemorySecretStorage", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "policyFile", 1);
__decorateClass([
  memoize
], AbstractNativeEnvironmentService.prototype, "agentSessionsWorkspace", 1);
function parseExtensionHostDebugPort(args, isBuilt) {
  return parseDebugParams(args["inspect-extensions"], args["inspect-brk-extensions"], 5870, isBuilt, args.debugId, args.extensionEnvironment);
}
function parseDebugParams(debugArg, debugBrkArg, defaultBuildPort, isBuilt, debugId, environmentString) {
  const portStr = debugBrkArg || debugArg;
  const port = Number(portStr) || (!isBuilt ? defaultBuildPort : null);
  const brk = port ? Boolean(!!debugBrkArg) : false;
  let env2;
  if (environmentString) {
    try {
      env2 = JSON.parse(environmentString);
    } catch {
    }
  }
  return { port, break: brk, debugId, env: env2 };
}

// src/vs/platform/environment/node/userDataPath.ts
import { homedir } from "os";
import { resolve as resolve2, isAbsolute as isAbsolute2, join as join2 } from "path";
var cwd2 = process.env["VSCODE_CWD"] || process.cwd();
function getUserDataPath(cliArgs, productName) {
  const userDataPath = doGetUserDataPath(cliArgs, productName);
  const pathsToResolve = [userDataPath];
  if (!isAbsolute2(userDataPath)) {
    pathsToResolve.unshift(cwd2);
  }
  return resolve2(...pathsToResolve);
}
function doGetUserDataPath(cliArgs, productName) {
  if (process.env["VSCODE_DEV"]) {
    if (process.isEmbeddedApp) {
      productName = "sessions-oss-dev";
    } else {
      productName = "code-oss-dev";
    }
  }
  const portablePath = process.env["VSCODE_PORTABLE"];
  if (portablePath) {
    return join2(portablePath, "user-data");
  }
  let appDataPath = process.env["VSCODE_APPDATA"];
  if (appDataPath) {
    return join2(appDataPath, productName);
  }
  const cliPath = cliArgs["user-data-dir"];
  if (cliPath) {
    return cliPath;
  }
  switch (process.platform) {
    case "win32":
      appDataPath = process.env["APPDATA"];
      if (!appDataPath) {
        const userProfile = process.env["USERPROFILE"];
        if (typeof userProfile !== "string") {
          throw new Error("Windows: Unexpected undefined %USERPROFILE% environment variable");
        }
        appDataPath = join2(userProfile, "AppData", "Roaming");
      }
      break;
    case "darwin":
      appDataPath = join2(homedir(), "Library", "Application Support");
      break;
    case "linux":
      appDataPath = process.env["XDG_CONFIG_HOME"] || join2(homedir(), ".config");
      break;
    default:
      throw new Error("Platform not supported");
  }
  return join2(appDataPath, productName);
}

// src/vs/platform/environment/node/environmentService.ts
var NativeEnvironmentService = class extends AbstractNativeEnvironmentService {
  constructor(args, productService) {
    super(args, {
      homeDir: homedir2(),
      tmpDir: tmpdir2(),
      userDataDir: getUserDataPath(args, productService.nameShort)
    }, productService);
  }
};

// src/vs/platform/environment/node/argv.ts
import minimist from "minimist";
var helpCategories = {
  o: localize(1970, null),
  e: localize(1954, null),
  t: localize(1985, null),
  m: localize(1965, null)
};
var OPTIONS = {
  "chat": {
    type: "subcommand",
    description: "Pass in a prompt to run in a chat session in the current working directory.",
    options: {
      "_": { type: "string[]", description: localize(1974, null) },
      "mode": { type: "string", cat: "o", alias: "m", args: "mode", description: localize(1942, null) },
      "add-file": { type: "string[]", cat: "o", alias: "a", args: "path", description: localize(1938, null) },
      "maximize": { type: "boolean", cat: "o", description: localize(1941, null) },
      "reuse-window": { type: "boolean", cat: "o", alias: "r", description: localize(1977, null) },
      "new-window": { type: "boolean", cat: "o", alias: "n", description: localize(1968, null) },
      "profile": { type: "string", "cat": "o", args: "profileName", description: localize(1973, null) },
      "help": { type: "boolean", alias: "h", description: localize(1956, null) }
    }
  },
  "serve-web": {
    type: "subcommand",
    description: "Run a server that displays the editor UI in browsers.",
    options: {
      "cli-data-dir": { type: "string", args: "dir", description: localize(1943, null) },
      "disable-telemetry": { type: "boolean" },
      "telemetry-level": { type: "string" }
    }
  },
  "tunnel": {
    type: "subcommand",
    description: "Make the current machine accessible from vscode.dev or other machines through a secure tunnel.",
    options: {
      "cli-data-dir": { type: "string", args: "dir", description: localize(1943, null) },
      "disable-telemetry": { type: "boolean" },
      "telemetry-level": { type: "string" },
      user: {
        type: "subcommand",
        options: {
          login: {
            type: "subcommand",
            options: {
              provider: { type: "string" },
              "access-token": { type: "string" }
            }
          }
        }
      }
    }
  },
  "diff": { type: "boolean", cat: "o", alias: "d", args: ["file", "file"], description: localize(1946, null) },
  "merge": { type: "boolean", cat: "o", alias: "m", args: ["path1", "path2", "base", "result"], description: localize(1966, null) },
  "add": { type: "boolean", cat: "o", alias: "a", args: "folder", description: localize(1937, null) },
  "remove": { type: "boolean", cat: "o", args: "folder", description: localize(1975, null) },
  "goto": { type: "boolean", cat: "o", alias: "g", args: "file:line[:character]", description: localize(1955, null) },
  "new-window": { type: "boolean", cat: "o", alias: "n", description: localize(1967, null) },
  "reuse-window": { type: "boolean", cat: "o", alias: "r", description: localize(1976, null) },
  "sessions": { type: "boolean", cat: "o", description: localize(1978, null) },
  "wait": { type: "boolean", cat: "o", alias: "w", description: localize(1995, null) },
  "waitMarkerFilePath": { type: "string" },
  "locale": { type: "string", cat: "o", args: "locale", description: localize(1962, null) },
  "user-data-dir": { type: "string", cat: "o", args: "dir", description: localize(1992, null) },
  "profile": { type: "string", "cat": "o", args: "profileName", description: localize(1973, null) },
  "help": { type: "boolean", cat: "o", alias: "h", description: localize(1956, null) },
  "extensions-dir": { type: "string", deprecates: ["extensionHomePath"], cat: "e", args: "dir", description: localize(1953, null) },
  "extensions-download-dir": { type: "string" },
  "builtin-extensions-dir": { type: "string" },
  "list-extensions": { type: "boolean", cat: "e", description: localize(1961, null) },
  "show-versions": { type: "boolean", cat: "e", description: localize(1979, null) },
  "category": { type: "string", allowEmptyValue: true, cat: "e", description: localize(1940, null), args: "category" },
  "install-extension": { type: "string[]", cat: "e", args: "ext-id | path", description: localize(1960, null) },
  "pre-release": { type: "boolean", cat: "e", description: localize(1959, null) },
  "uninstall-extension": { type: "string[]", cat: "e", args: "ext-id", description: localize(1987, null) },
  "update-extensions": { type: "boolean", cat: "e", description: localize(1990, null) },
  "enable-proposed-api": { type: "string[]", allowEmptyValue: true, cat: "e", args: "ext-id", description: localize(1952, null) },
  "add-mcp": { type: "string[]", cat: "m", args: "json", description: localize(1939, null) },
  "version": { type: "boolean", cat: "t", alias: "v", description: localize(1994, null) },
  "verbose": { type: "boolean", cat: "t", global: true, description: localize(1993, null) },
  "log": { type: "string[]", cat: "t", args: "level", global: true, description: localize(1964, null) },
  "status": { type: "boolean", alias: "s", cat: "t", description: localize(1980, null) },
  "prof-startup": { type: "boolean", cat: "t", description: localize(1972, null) },
  "prof-append-timers": { type: "string" },
  "prof-duration-markers": { type: "string[]" },
  "prof-duration-markers-file": { type: "string" },
  "no-cached-data": { type: "boolean" },
  "prof-startup-prefix": { type: "string" },
  "prof-v8-extensions": { type: "boolean" },
  "disable-extensions": { type: "boolean", deprecates: ["disableExtensions"], cat: "t", description: localize(1949, null) },
  "disable-extension": { type: "string[]", cat: "t", args: "ext-id", description: localize(1948, null) },
  "sync": { type: "string", cat: "t", description: localize(1986, null), args: ["on | off"] },
  "inspect-extensions": { type: "string", allowEmptyValue: true, deprecates: ["debugPluginHost"], args: "port", cat: "t", description: localize(1958, null) },
  "inspect-brk-extensions": { type: "string", allowEmptyValue: true, deprecates: ["debugBrkPluginHost"], args: "port", cat: "t", description: localize(1957, null) },
  "disable-lcd-text": { type: "boolean", cat: "t", description: localize(1951, null) },
  "disable-gpu": { type: "boolean", cat: "t", description: localize(1950, null) },
  "disable-chromium-sandbox": { type: "boolean", cat: "t", description: localize(1947, null) },
  "sandbox": { type: "boolean" },
  "locate-shell-integration-path": { type: "string", cat: "t", args: ["shell"], description: localize(1963, null) },
  "telemetry": { type: "boolean", cat: "t", description: localize(1983, null) },
  "remote": { type: "string", allowEmptyValue: true },
  "folder-uri": { type: "string[]", cat: "o", args: "uri" },
  "file-uri": { type: "string[]", cat: "o", args: "uri" },
  "locate-extension": { type: "string[]" },
  "extensionDevelopmentPath": { type: "string[]" },
  "extensionDevelopmentKind": { type: "string[]" },
  "extensionTestsPath": { type: "string" },
  "extensionEnvironment": { type: "string" },
  "debugId": { type: "string" },
  "debugRenderer": { type: "boolean" },
  "inspect-ptyhost": { type: "string", allowEmptyValue: true },
  "inspect-brk-ptyhost": { type: "string", allowEmptyValue: true },
  "inspect-agenthost": { type: "string", allowEmptyValue: true },
  "inspect-brk-agenthost": { type: "string", allowEmptyValue: true },
  "inspect-search": { type: "string", deprecates: ["debugSearch"], allowEmptyValue: true },
  "inspect-brk-search": { type: "string", deprecates: ["debugBrkSearch"], allowEmptyValue: true },
  "inspect-sharedprocess": { type: "string", allowEmptyValue: true },
  "inspect-brk-sharedprocess": { type: "string", allowEmptyValue: true },
  "export-default-configuration": { type: "string" },
  "export-policy-data": { type: "string", allowEmptyValue: true },
  "install-source": { type: "string" },
  "enable-smoke-test-driver": { type: "boolean" },
  "skip-sessions-welcome": { type: "boolean" },
  "logExtensionHostCommunication": { type: "boolean" },
  "skip-release-notes": { type: "boolean" },
  "skip-welcome": { type: "boolean" },
  "disable-telemetry": { type: "boolean" },
  "disable-updates": { type: "boolean" },
  "transient": { type: "boolean", cat: "t", description: localize(1984, null) },
  "use-inmemory-secretstorage": { type: "boolean", deprecates: ["disable-keytar"] },
  "password-store": { type: "string" },
  "disable-workspace-trust": { type: "boolean" },
  "disable-crash-reporter": { type: "boolean" },
  "crash-reporter-directory": { type: "string" },
  "crash-reporter-id": { type: "string" },
  "skip-add-to-recently-opened": { type: "boolean" },
  "open-url": { type: "boolean" },
  "file-write": { type: "boolean" },
  "file-chmod": { type: "boolean" },
  "install-builtin-extension": { type: "string[]" },
  "force": { type: "boolean" },
  "do-not-sync": { type: "boolean" },
  "do-not-include-pack-dependencies": { type: "boolean" },
  "trace": { type: "boolean" },
  "trace-memory-infra": { type: "boolean" },
  "trace-category-filter": { type: "string" },
  "trace-options": { type: "string" },
  "preserve-env": { type: "boolean" },
  "force-user-env": { type: "boolean" },
  "force-disable-user-env": { type: "boolean" },
  "open-devtools": { type: "boolean" },
  "disable-gpu-sandbox": { type: "boolean" },
  "logsPath": { type: "string" },
  "__enable-file-policy": { type: "boolean" },
  "editSessionId": { type: "string" },
  "continueOn": { type: "string" },
  "enable-coi": { type: "boolean" },
  "unresponsive-sample-interval": { type: "string" },
  "unresponsive-sample-period": { type: "string" },
  "enable-rdp-display-tracking": { type: "boolean" },
  "disable-layout-restore": { type: "boolean" },
  "disable-experiments": { type: "boolean" },
  // chromium flags
  "no-proxy-server": { type: "boolean" },
  // Minimist incorrectly parses keys that start with `--no`
  // https://github.com/substack/minimist/blob/aeb3e27dae0412de5c0494e9563a5f10c82cc7a9/index.js#L118-L121
  // If --no-sandbox is passed via cli wrapper it will be treated as --sandbox which is incorrect, we use
  // the alias here to make sure --no-sandbox is always respected.
  // For https://github.com/microsoft/vscode/issues/128279
  "no-sandbox": { type: "boolean", alias: "sandbox" },
  "proxy-server": { type: "string" },
  "proxy-bypass-list": { type: "string" },
  "proxy-pac-url": { type: "string" },
  "js-flags": { type: "string" },
  // chrome js flags
  "inspect": { type: "string", allowEmptyValue: true },
  "inspect-brk": { type: "string", allowEmptyValue: true },
  "nolazy": { type: "boolean" },
  // node inspect
  "force-device-scale-factor": { type: "string" },
  "force-renderer-accessibility": { type: "boolean" },
  "ignore-certificate-errors": { type: "boolean" },
  "allow-insecure-localhost": { type: "boolean" },
  "log-net-log": { type: "string" },
  "vmodule": { type: "string" },
  "_urls": { type: "string[]" },
  "disable-dev-shm-usage": { type: "boolean" },
  "profile-temp": { type: "boolean" },
  "ozone-platform": { type: "string" },
  "enable-tracing": { type: "string" },
  "trace-startup-format": { type: "string" },
  "trace-startup-file": { type: "string" },
  "trace-startup-duration": { type: "string" },
  "xdg-portal-required-version": { type: "string" },
  _: { type: "string[]" }
  // main arguments
};
var ignoringReporter = {
  onUnknownOption: () => {
  },
  onMultipleValues: () => {
  },
  onEmptyValue: () => {
  },
  onDeprecatedOption: () => {
  }
};
function parseArgs(args, options, errorReporter = ignoringReporter) {
  const firstPossibleCommand = args.find((a, i) => a.length > 0 && a[0] !== "-" && options.hasOwnProperty(a) && options[a].type === "subcommand");
  const alias = {};
  const stringOptions = ["_"];
  const booleanOptions = [];
  const globalOptions = {};
  let command = void 0;
  for (const optionId in options) {
    const o = options[optionId];
    if (o.type === "subcommand") {
      if (optionId === firstPossibleCommand) {
        command = o;
      }
    } else {
      if (o.alias) {
        alias[optionId] = o.alias;
      }
      if (o.type === "string" || o.type === "string[]") {
        stringOptions.push(optionId);
        if (o.deprecates) {
          stringOptions.push(...o.deprecates);
        }
      } else if (o.type === "boolean") {
        booleanOptions.push(optionId);
        if (o.deprecates) {
          booleanOptions.push(...o.deprecates);
        }
      }
      if (o.global) {
        globalOptions[optionId] = o;
      }
    }
  }
  if (command && firstPossibleCommand) {
    const options2 = globalOptions;
    for (const optionId in command.options) {
      options2[optionId] = command.options[optionId];
    }
    const newArgs = args.filter((a) => a !== firstPossibleCommand);
    const reporter = errorReporter.getSubcommandReporter ? errorReporter.getSubcommandReporter(firstPossibleCommand) : void 0;
    const subcommandOptions = parseArgs(newArgs, options2, reporter);
    return {
      [firstPossibleCommand]: subcommandOptions,
      _: []
    };
  }
  const parsedArgs = minimist(args, { string: stringOptions, boolean: booleanOptions, alias });
  const cleanedArgs = {};
  const remainingArgs = parsedArgs;
  cleanedArgs._ = parsedArgs._.map((arg) => String(arg)).filter((arg) => arg.length > 0);
  delete remainingArgs._;
  for (const optionId in options) {
    const o = options[optionId];
    if (o.type === "subcommand") {
      continue;
    }
    if (o.alias) {
      delete remainingArgs[o.alias];
    }
    let val = remainingArgs[optionId];
    if (o.deprecates) {
      for (const deprecatedId of o.deprecates) {
        if (remainingArgs.hasOwnProperty(deprecatedId)) {
          if (!val) {
            val = remainingArgs[deprecatedId];
            if (val) {
              errorReporter.onDeprecatedOption(deprecatedId, o.deprecationMessage || localize(1945, null, optionId));
            }
          }
          delete remainingArgs[deprecatedId];
        }
      }
    }
    if (typeof val !== "undefined") {
      if (o.type === "string[]") {
        if (!Array.isArray(val)) {
          val = [val];
        }
        if (!o.allowEmptyValue) {
          const sanitized = val.filter((v) => v.length > 0);
          if (sanitized.length !== val.length) {
            errorReporter.onEmptyValue(optionId);
            val = sanitized.length > 0 ? sanitized : void 0;
          }
        }
      } else if (o.type === "string") {
        if (Array.isArray(val)) {
          val = val.pop();
          errorReporter.onMultipleValues(optionId, val);
        } else if (!val && !o.allowEmptyValue) {
          errorReporter.onEmptyValue(optionId);
          val = void 0;
        }
      }
      cleanedArgs[optionId] = val;
      if (o.deprecationMessage) {
        errorReporter.onDeprecatedOption(optionId, o.deprecationMessage);
      }
    }
    delete remainingArgs[optionId];
  }
  for (const key in remainingArgs) {
    errorReporter.onUnknownOption(key);
  }
  return cleanedArgs;
}

// src/vs/platform/log/common/logService.ts
var LogService = class extends Disposable {
  constructor(primaryLogger, otherLoggers = []) {
    super();
    this.logger = new MultiplexLogger([primaryLogger, ...otherLoggers]);
    this._register(primaryLogger.onDidChangeLogLevel((level) => this.setLevel(level)));
  }
  get onDidChangeLogLevel() {
    return this.logger.onDidChangeLogLevel;
  }
  setLevel(level) {
    this.logger.setLevel(level);
  }
  getLevel() {
    return this.logger.getLevel();
  }
  trace(message, ...args) {
    this.logger.trace(message, ...args);
  }
  debug(message, ...args) {
    this.logger.debug(message, ...args);
  }
  info(message, ...args) {
    this.logger.info(message, ...args);
  }
  warn(message, ...args) {
    this.logger.warn(message, ...args);
  }
  error(message, ...args) {
    this.logger.error(message, ...args);
  }
  flush() {
    this.logger.flush();
  }
};

// src/vs/base/common/ternarySearchTree.ts
var StringIterator = class {
  constructor() {
    this._value = "";
    this._pos = 0;
  }
  reset(key) {
    this._value = key;
    this._pos = 0;
    return this;
  }
  next() {
    this._pos += 1;
    return this;
  }
  hasNext() {
    return this._pos < this._value.length - 1;
  }
  cmp(a) {
    const aCode = a.charCodeAt(0);
    const thisCode = this._value.charCodeAt(this._pos);
    return aCode - thisCode;
  }
  value() {
    return this._value[this._pos];
  }
};
var ConfigKeysIterator = class {
  constructor(_caseSensitive = true) {
    this._caseSensitive = _caseSensitive;
  }
  reset(key) {
    this._value = key;
    this._from = 0;
    this._to = 0;
    return this.next();
  }
  hasNext() {
    return this._to < this._value.length;
  }
  next() {
    this._from = this._to;
    let justSeps = true;
    for (; this._to < this._value.length; this._to++) {
      const ch = this._value.charCodeAt(this._to);
      if (ch === 46 /* Period */) {
        if (justSeps) {
          this._from++;
        } else {
          break;
        }
      } else {
        justSeps = false;
      }
    }
    return this;
  }
  cmp(a) {
    return this._caseSensitive ? compareSubstring(a, this._value, 0, a.length, this._from, this._to) : compareSubstringIgnoreCase(a, this._value, 0, a.length, this._from, this._to);
  }
  value() {
    return this._value.substring(this._from, this._to);
  }
};
var PathIterator = class {
  constructor(_splitOnBackslash = true, _caseSensitive = true) {
    this._splitOnBackslash = _splitOnBackslash;
    this._caseSensitive = _caseSensitive;
  }
  reset(key) {
    this._from = 0;
    this._to = 0;
    this._value = key;
    this._valueLen = key.length;
    for (let pos = key.length - 1; pos >= 0; pos--, this._valueLen--) {
      const ch = this._value.charCodeAt(pos);
      if (!(ch === 47 /* Slash */ || this._splitOnBackslash && ch === 92 /* Backslash */)) {
        break;
      }
    }
    return this.next();
  }
  hasNext() {
    return this._to < this._valueLen;
  }
  next() {
    this._from = this._to;
    let justSeps = true;
    for (; this._to < this._valueLen; this._to++) {
      const ch = this._value.charCodeAt(this._to);
      if (ch === 47 /* Slash */ || this._splitOnBackslash && ch === 92 /* Backslash */) {
        if (justSeps) {
          this._from++;
        } else {
          break;
        }
      } else {
        justSeps = false;
      }
    }
    return this;
  }
  cmp(a) {
    return this._caseSensitive ? compareSubstring(a, this._value, 0, a.length, this._from, this._to) : compareSubstringIgnoreCase(a, this._value, 0, a.length, this._from, this._to);
  }
  value() {
    return this._value.substring(this._from, this._to);
  }
};
var UriIterator = class {
  constructor(_ignorePathCasing, _ignoreQueryAndFragment) {
    this._ignorePathCasing = _ignorePathCasing;
    this._ignoreQueryAndFragment = _ignoreQueryAndFragment;
    this._states = [];
    this._stateIdx = 0;
  }
  reset(key) {
    this._value = key;
    this._states = [];
    if (this._value.scheme) {
      this._states.push(1 /* Scheme */);
    }
    if (this._value.authority) {
      this._states.push(2 /* Authority */);
    }
    if (this._value.path) {
      this._pathIterator = new PathIterator(false, !this._ignorePathCasing(key));
      this._pathIterator.reset(key.path);
      if (this._pathIterator.value()) {
        this._states.push(3 /* Path */);
      }
    }
    if (!this._ignoreQueryAndFragment(key)) {
      if (this._value.query) {
        this._states.push(4 /* Query */);
      }
      if (this._value.fragment) {
        this._states.push(5 /* Fragment */);
      }
    }
    this._stateIdx = 0;
    return this;
  }
  next() {
    if (this._states[this._stateIdx] === 3 /* Path */ && this._pathIterator.hasNext()) {
      this._pathIterator.next();
    } else {
      this._stateIdx += 1;
    }
    return this;
  }
  hasNext() {
    return this._states[this._stateIdx] === 3 /* Path */ && this._pathIterator.hasNext() || this._stateIdx < this._states.length - 1;
  }
  cmp(a) {
    if (this._states[this._stateIdx] === 1 /* Scheme */) {
      return compareIgnoreCase(a, this._value.scheme);
    } else if (this._states[this._stateIdx] === 2 /* Authority */) {
      return compareIgnoreCase(a, this._value.authority);
    } else if (this._states[this._stateIdx] === 3 /* Path */) {
      return this._pathIterator.cmp(a);
    } else if (this._states[this._stateIdx] === 4 /* Query */) {
      return compare(a, this._value.query);
    } else if (this._states[this._stateIdx] === 5 /* Fragment */) {
      return compare(a, this._value.fragment);
    }
    throw new Error();
  }
  value() {
    if (this._states[this._stateIdx] === 1 /* Scheme */) {
      return this._value.scheme;
    } else if (this._states[this._stateIdx] === 2 /* Authority */) {
      return this._value.authority;
    } else if (this._states[this._stateIdx] === 3 /* Path */) {
      return this._pathIterator.value();
    } else if (this._states[this._stateIdx] === 4 /* Query */) {
      return this._value.query;
    } else if (this._states[this._stateIdx] === 5 /* Fragment */) {
      return this._value.fragment;
    }
    throw new Error();
  }
};
var Undef = class _Undef {
  static {
    this.Val = /* @__PURE__ */ Symbol("undefined_placeholder");
  }
  static wrap(value) {
    return value === void 0 ? _Undef.Val : value;
  }
  static unwrap(value) {
    return value === _Undef.Val ? void 0 : value;
  }
};
var TernarySearchTreeNode = class {
  constructor() {
    this.height = 1;
    this.value = void 0;
    this.key = void 0;
    this.left = void 0;
    this.mid = void 0;
    this.right = void 0;
  }
  isEmpty() {
    return !this.left && !this.mid && !this.right && this.value === void 0;
  }
  rotateLeft() {
    const tmp = this.right;
    this.right = tmp.left;
    tmp.left = this;
    this.updateHeight();
    tmp.updateHeight();
    return tmp;
  }
  rotateRight() {
    const tmp = this.left;
    this.left = tmp.right;
    tmp.right = this;
    this.updateHeight();
    tmp.updateHeight();
    return tmp;
  }
  updateHeight() {
    this.height = 1 + Math.max(this.heightLeft, this.heightRight);
  }
  balanceFactor() {
    return this.heightRight - this.heightLeft;
  }
  get heightLeft() {
    return this.left?.height ?? 0;
  }
  get heightRight() {
    return this.right?.height ?? 0;
  }
};
var TernarySearchTree = class _TernarySearchTree {
  static forUris(ignorePathCasing = () => false, ignoreQueryAndFragment = () => false) {
    return new _TernarySearchTree(new UriIterator(ignorePathCasing, ignoreQueryAndFragment));
  }
  static forPaths(ignorePathCasing = false) {
    return new _TernarySearchTree(new PathIterator(void 0, !ignorePathCasing));
  }
  static forStrings() {
    return new _TernarySearchTree(new StringIterator());
  }
  static forConfigKeys() {
    return new _TernarySearchTree(new ConfigKeysIterator());
  }
  constructor(segments) {
    this._iter = segments;
  }
  clear() {
    this._root = void 0;
  }
  fill(values, keys) {
    if (keys) {
      const arr = keys.slice(0);
      shuffle(arr);
      for (const k of arr) {
        this.set(k, values);
      }
    } else {
      const arr = values.slice(0);
      shuffle(arr);
      for (const entry of arr) {
        this.set(entry[0], entry[1]);
      }
    }
  }
  set(key, element) {
    const iter = this._iter.reset(key);
    let node;
    if (!this._root) {
      this._root = new TernarySearchTreeNode();
      this._root.segment = iter.value();
    }
    const stack = [];
    node = this._root;
    while (true) {
      const val = iter.cmp(node.segment);
      if (val > 0) {
        if (!node.left) {
          node.left = new TernarySearchTreeNode();
          node.left.segment = iter.value();
        }
        stack.push([-1 /* Left */, node]);
        node = node.left;
      } else if (val < 0) {
        if (!node.right) {
          node.right = new TernarySearchTreeNode();
          node.right.segment = iter.value();
        }
        stack.push([1 /* Right */, node]);
        node = node.right;
      } else if (iter.hasNext()) {
        iter.next();
        if (!node.mid) {
          node.mid = new TernarySearchTreeNode();
          node.mid.segment = iter.value();
        }
        stack.push([0 /* Mid */, node]);
        node = node.mid;
      } else {
        break;
      }
    }
    const oldElement = Undef.unwrap(node.value);
    node.value = Undef.wrap(element);
    node.key = key;
    for (let i = stack.length - 1; i >= 0; i--) {
      const node2 = stack[i][1];
      node2.updateHeight();
      const bf = node2.balanceFactor();
      if (bf < -1 || bf > 1) {
        const d1 = stack[i][0];
        const d2 = stack[i + 1][0];
        if (d1 === 1 /* Right */ && d2 === 1 /* Right */) {
          stack[i][1] = node2.rotateLeft();
        } else if (d1 === -1 /* Left */ && d2 === -1 /* Left */) {
          stack[i][1] = node2.rotateRight();
        } else if (d1 === 1 /* Right */ && d2 === -1 /* Left */) {
          node2.right = stack[i + 1][1] = stack[i + 1][1].rotateRight();
          stack[i][1] = node2.rotateLeft();
        } else if (d1 === -1 /* Left */ && d2 === 1 /* Right */) {
          node2.left = stack[i + 1][1] = stack[i + 1][1].rotateLeft();
          stack[i][1] = node2.rotateRight();
        } else {
          throw new Error();
        }
        if (i > 0) {
          switch (stack[i - 1][0]) {
            case -1 /* Left */:
              stack[i - 1][1].left = stack[i][1];
              break;
            case 1 /* Right */:
              stack[i - 1][1].right = stack[i][1];
              break;
            case 0 /* Mid */:
              stack[i - 1][1].mid = stack[i][1];
              break;
          }
        } else {
          this._root = stack[0][1];
        }
      }
    }
    return oldElement;
  }
  get(key) {
    return Undef.unwrap(this._getNode(key)?.value);
  }
  _getNode(key) {
    const iter = this._iter.reset(key);
    let node = this._root;
    while (node) {
      const val = iter.cmp(node.segment);
      if (val > 0) {
        node = node.left;
      } else if (val < 0) {
        node = node.right;
      } else if (iter.hasNext()) {
        iter.next();
        node = node.mid;
      } else {
        break;
      }
    }
    return node;
  }
  has(key) {
    const node = this._getNode(key);
    return !(node?.value === void 0 && node?.mid === void 0);
  }
  delete(key) {
    return this._delete(key, false);
  }
  deleteSuperstr(key) {
    return this._delete(key, true);
  }
  _delete(key, superStr) {
    const iter = this._iter.reset(key);
    const stack = [];
    let node = this._root;
    while (node) {
      const val = iter.cmp(node.segment);
      if (val > 0) {
        stack.push([-1 /* Left */, node]);
        node = node.left;
      } else if (val < 0) {
        stack.push([1 /* Right */, node]);
        node = node.right;
      } else if (iter.hasNext()) {
        iter.next();
        stack.push([0 /* Mid */, node]);
        node = node.mid;
      } else {
        break;
      }
    }
    if (!node) {
      return;
    }
    if (superStr) {
      node.left = void 0;
      node.mid = void 0;
      node.right = void 0;
      node.height = 1;
    } else {
      node.key = void 0;
      node.value = void 0;
    }
    if (!node.mid && !node.value) {
      if (node.left && node.right) {
        const stack2 = [[1 /* Right */, node]];
        const min = this._min(node.right, stack2);
        if (min.key) {
          node.key = min.key;
          node.value = min.value;
          node.segment = min.segment;
          const newChild = min.right;
          if (stack2.length > 1) {
            const [dir, parent] = stack2[stack2.length - 1];
            switch (dir) {
              case -1 /* Left */:
                parent.left = newChild;
                break;
              case 0 /* Mid */:
                assert(false);
              case 1 /* Right */:
                assert(false);
            }
          } else {
            node.right = newChild;
          }
          const newChild2 = this._balanceByStack(stack2);
          if (stack.length > 0) {
            const [dir, parent] = stack[stack.length - 1];
            switch (dir) {
              case -1 /* Left */:
                parent.left = newChild2;
                break;
              case 0 /* Mid */:
                parent.mid = newChild2;
                break;
              case 1 /* Right */:
                parent.right = newChild2;
                break;
            }
          } else {
            this._root = newChild2;
          }
        }
      } else {
        const newChild = node.left ?? node.right;
        if (stack.length > 0) {
          const [dir, parent] = stack[stack.length - 1];
          switch (dir) {
            case -1 /* Left */:
              parent.left = newChild;
              break;
            case 0 /* Mid */:
              parent.mid = newChild;
              break;
            case 1 /* Right */:
              parent.right = newChild;
              break;
          }
        } else {
          this._root = newChild;
        }
      }
    }
    this._root = this._balanceByStack(stack) ?? this._root;
  }
  _min(node, stack) {
    while (node.left) {
      stack.push([-1 /* Left */, node]);
      node = node.left;
    }
    return node;
  }
  _balanceByStack(stack) {
    for (let i = stack.length - 1; i >= 0; i--) {
      const node = stack[i][1];
      node.updateHeight();
      const bf = node.balanceFactor();
      if (bf > 1) {
        if (node.right.balanceFactor() >= 0) {
          stack[i][1] = node.rotateLeft();
        } else {
          node.right = node.right.rotateRight();
          stack[i][1] = node.rotateLeft();
        }
      } else if (bf < -1) {
        if (node.left.balanceFactor() <= 0) {
          stack[i][1] = node.rotateRight();
        } else {
          node.left = node.left.rotateLeft();
          stack[i][1] = node.rotateRight();
        }
      }
      if (i > 0) {
        switch (stack[i - 1][0]) {
          case -1 /* Left */:
            stack[i - 1][1].left = stack[i][1];
            break;
          case 1 /* Right */:
            stack[i - 1][1].right = stack[i][1];
            break;
          case 0 /* Mid */:
            stack[i - 1][1].mid = stack[i][1];
            break;
        }
      } else {
        return stack[0][1];
      }
    }
    return void 0;
  }
  findSubstr(key) {
    const iter = this._iter.reset(key);
    let node = this._root;
    let candidate = void 0;
    while (node) {
      const val = iter.cmp(node.segment);
      if (val > 0) {
        node = node.left;
      } else if (val < 0) {
        node = node.right;
      } else if (iter.hasNext()) {
        iter.next();
        candidate = Undef.unwrap(node.value) || candidate;
        node = node.mid;
      } else {
        break;
      }
    }
    return node && Undef.unwrap(node.value) || candidate;
  }
  findSuperstr(key) {
    return this._findSuperstrOrElement(key, false);
  }
  _findSuperstrOrElement(key, allowValue) {
    const iter = this._iter.reset(key);
    let node = this._root;
    while (node) {
      const val = iter.cmp(node.segment);
      if (val > 0) {
        node = node.left;
      } else if (val < 0) {
        node = node.right;
      } else if (iter.hasNext()) {
        iter.next();
        node = node.mid;
      } else {
        if (!node.mid) {
          if (allowValue) {
            return Undef.unwrap(node.value);
          } else {
            return void 0;
          }
        } else {
          return this._entries(node.mid);
        }
      }
    }
    return void 0;
  }
  hasElementOrSubtree(key) {
    return this._findSuperstrOrElement(key, true) !== void 0;
  }
  forEach(callback) {
    for (const [key, value] of this) {
      callback(value, key);
    }
  }
  *[Symbol.iterator]() {
    yield* this._entries(this._root);
  }
  _entries(node) {
    const result = [];
    this._dfsEntries(node, result);
    return result[Symbol.iterator]();
  }
  _dfsEntries(node, bucket) {
    if (!node) {
      return;
    }
    if (node.left) {
      this._dfsEntries(node.left, bucket);
    }
    if (node.value !== void 0) {
      bucket.push([node.key, Undef.unwrap(node.value)]);
    }
    if (node.mid) {
      this._dfsEntries(node.mid, bucket);
    }
    if (node.right) {
      this._dfsEntries(node.right, bucket);
    }
  }
  // for debug/testing
  _isBalanced() {
    const nodeIsBalanced = (node) => {
      if (!node) {
        return true;
      }
      const bf = node.balanceFactor();
      if (bf < -1 || bf > 1) {
        return false;
      }
      return nodeIsBalanced(node.left) && nodeIsBalanced(node.right);
    };
    return nodeIsBalanced(this._root);
  }
};

// src/vs/platform/files/common/files.ts
var IFileService = createDecorator("fileService");
var FileChangesEvent = class _FileChangesEvent {
  constructor(changes, ignorePathCasing) {
    this.ignorePathCasing = ignorePathCasing;
    this.correlationId = void 0;
    this.added = new Lazy(() => {
      const added = TernarySearchTree.forUris(() => this.ignorePathCasing);
      added.fill(this.rawAdded.map((resource) => [resource, true]));
      return added;
    });
    this.updated = new Lazy(() => {
      const updated = TernarySearchTree.forUris(() => this.ignorePathCasing);
      updated.fill(this.rawUpdated.map((resource) => [resource, true]));
      return updated;
    });
    this.deleted = new Lazy(() => {
      const deleted = TernarySearchTree.forUris(() => this.ignorePathCasing);
      deleted.fill(this.rawDeleted.map((resource) => [resource, true]));
      return deleted;
    });
    /**
     * @deprecated use the `contains` or `affects` method to efficiently find
     * out if the event relates to a given resource. these methods ensure:
     * - that there is no expensive lookup needed (by using a `TernarySearchTree`)
     * - correctly handles `FileChangeType.DELETED` events
     */
    this.rawAdded = [];
    /**
    * @deprecated use the `contains` or `affects` method to efficiently find
    * out if the event relates to a given resource. these methods ensure:
    * - that there is no expensive lookup needed (by using a `TernarySearchTree`)
    * - correctly handles `FileChangeType.DELETED` events
    */
    this.rawUpdated = [];
    /**
    * @deprecated use the `contains` or `affects` method to efficiently find
    * out if the event relates to a given resource. these methods ensure:
    * - that there is no expensive lookup needed (by using a `TernarySearchTree`)
    * - correctly handles `FileChangeType.DELETED` events
    */
    this.rawDeleted = [];
    for (const change of changes) {
      switch (change.type) {
        case 1 /* ADDED */:
          this.rawAdded.push(change.resource);
          break;
        case 0 /* UPDATED */:
          this.rawUpdated.push(change.resource);
          break;
        case 2 /* DELETED */:
          this.rawDeleted.push(change.resource);
          break;
      }
      if (this.correlationId !== _FileChangesEvent.MIXED_CORRELATION) {
        if (typeof change.cId === "number") {
          if (this.correlationId === void 0) {
            this.correlationId = change.cId;
          } else if (this.correlationId !== change.cId) {
            this.correlationId = _FileChangesEvent.MIXED_CORRELATION;
          }
        } else {
          if (this.correlationId !== void 0) {
            this.correlationId = _FileChangesEvent.MIXED_CORRELATION;
          }
        }
      }
    }
  }
  static {
    this.MIXED_CORRELATION = null;
  }
  /**
   * Find out if the file change events match the provided resource.
   *
   * Note: when passing `FileChangeType.DELETED`, we consider a match
   * also when the parent of the resource got deleted.
   */
  contains(resource, ...types) {
    return this.doContains(resource, { includeChildren: false }, ...types);
  }
  /**
   * Find out if the file change events either match the provided
   * resource, or contain a child of this resource.
   */
  affects(resource, ...types) {
    return this.doContains(resource, { includeChildren: true }, ...types);
  }
  doContains(resource, options, ...types) {
    if (!resource) {
      return false;
    }
    const hasTypesFilter = types.length > 0;
    if (!hasTypesFilter || types.includes(1 /* ADDED */)) {
      if (this.added.value.get(resource)) {
        return true;
      }
      if (options.includeChildren && this.added.value.findSuperstr(resource)) {
        return true;
      }
    }
    if (!hasTypesFilter || types.includes(0 /* UPDATED */)) {
      if (this.updated.value.get(resource)) {
        return true;
      }
      if (options.includeChildren && this.updated.value.findSuperstr(resource)) {
        return true;
      }
    }
    if (!hasTypesFilter || types.includes(2 /* DELETED */)) {
      if (this.deleted.value.findSubstr(resource)) {
        return true;
      }
      if (options.includeChildren && this.deleted.value.findSuperstr(resource)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns if this event contains added files.
   */
  gotAdded() {
    return this.rawAdded.length > 0;
  }
  /**
   * Returns if this event contains deleted files.
   */
  gotDeleted() {
    return this.rawDeleted.length > 0;
  }
  /**
   * Returns if this event contains updated files.
   */
  gotUpdated() {
    return this.rawUpdated.length > 0;
  }
  /**
   * Returns if this event contains changes that correlate to the
   * provided `correlationId`.
   *
   * File change event correlation is an advanced watch feature that
   * allows to  identify from which watch request the events originate
   * from. This correlation allows to route events specifically
   * only to the requestor and not emit them to all listeners.
   */
  correlates(correlationId) {
    return this.correlationId === correlationId;
  }
  /**
   * Figure out if the event contains changes that correlate to one
   * correlation identifier.
   *
   * File change event correlation is an advanced watch feature that
   * allows to  identify from which watch request the events originate
   * from. This correlation allows to route events specifically
   * only to the requestor and not emit them to all listeners.
   */
  hasCorrelation() {
    return typeof this.correlationId === "number";
  }
};
var ByteSize = class _ByteSize {
  static {
    this.KB = 1024;
  }
  static {
    this.MB = _ByteSize.KB * _ByteSize.KB;
  }
  static {
    this.GB = _ByteSize.MB * _ByteSize.KB;
  }
  static {
    this.TB = _ByteSize.GB * _ByteSize.KB;
  }
  static formatSize(size) {
    if (!isNumber(size)) {
      size = 0;
    }
    if (size < _ByteSize.KB) {
      return localize(2115, null, size.toFixed(0));
    }
    if (size < _ByteSize.MB) {
      return localize(2117, null, (size / _ByteSize.KB).toFixed(2));
    }
    if (size < _ByteSize.GB) {
      return localize(2118, null, (size / _ByteSize.MB).toFixed(2));
    }
    if (size < _ByteSize.TB) {
      return localize(2116, null, (size / _ByteSize.GB).toFixed(2));
    }
    return localize(2119, null, (size / _ByteSize.TB).toFixed(2));
  }
};

// src/vs/platform/log/node/spdlogLog.ts
async function createSpdLogLogger(name, logfilePath, filesize, filecount, donotUseFormatters) {
  try {
    const _spdlog = await import("@vscode/spdlog");
    _spdlog.setFlushOn(0 /* Trace */);
    const logger = await _spdlog.createAsyncRotatingLogger(name, logfilePath, filesize, filecount);
    if (donotUseFormatters) {
      logger.clearFormatters();
    } else {
      logger.setPattern("%Y-%m-%d %H:%M:%S.%e [%l] %v");
    }
    return logger;
  } catch (e) {
    console.error(e);
  }
  return null;
}
function log2(logger, level, message) {
  switch (level) {
    case 1 /* Trace */:
      logger.trace(message);
      break;
    case 2 /* Debug */:
      logger.debug(message);
      break;
    case 3 /* Info */:
      logger.info(message);
      break;
    case 4 /* Warning */:
      logger.warn(message);
      break;
    case 5 /* Error */:
      logger.error(message);
      break;
    case 0 /* Off */:
      break;
    default:
      throw new Error(`Invalid log level ${level}`);
  }
}
function setLogLevel(logger, level) {
  switch (level) {
    case 1 /* Trace */:
      logger.setLevel(0 /* Trace */);
      break;
    case 2 /* Debug */:
      logger.setLevel(1 /* Debug */);
      break;
    case 3 /* Info */:
      logger.setLevel(2 /* Info */);
      break;
    case 4 /* Warning */:
      logger.setLevel(3 /* Warning */);
      break;
    case 5 /* Error */:
      logger.setLevel(4 /* Error */);
      break;
    case 0 /* Off */:
      logger.setLevel(6 /* Off */);
      break;
    default:
      throw new Error(`Invalid log level ${level}`);
  }
}
var SpdLogLogger = class extends AbstractMessageLogger {
  constructor(name, filepath, rotating, donotUseFormatters, level) {
    super();
    this.buffer = [];
    this.setLevel(level);
    this._loggerCreationPromise = this._createSpdLogLogger(name, filepath, rotating, donotUseFormatters);
    this._register(this.onDidChangeLogLevel((level2) => {
      if (this._logger) {
        setLogLevel(this._logger, level2);
      }
    }));
  }
  async _createSpdLogLogger(name, filepath, rotating, donotUseFormatters) {
    const filecount = rotating ? 6 : 1;
    const filesize = 30 / filecount * ByteSize.MB;
    const logger = await createSpdLogLogger(name, filepath, filesize, filecount, donotUseFormatters);
    if (logger) {
      this._logger = logger;
      setLogLevel(this._logger, this.getLevel());
      for (const { level, message } of this.buffer) {
        log2(this._logger, level, message);
      }
      this.buffer = [];
    }
  }
  log(level, message) {
    if (this._logger) {
      log2(this._logger, level, message);
    } else if (this.getLevel() <= level) {
      this.buffer.push({ level, message });
    }
  }
  flush() {
    if (this._logger) {
      this.flushLogger();
    } else {
      this._loggerCreationPromise.then(() => this.flushLogger());
    }
  }
  dispose() {
    if (this._logger) {
      this.disposeLogger();
    } else {
      this._loggerCreationPromise.then(() => this.disposeLogger());
    }
    super.dispose();
  }
  flushLogger() {
    if (this._logger) {
      this._logger.flush();
    }
  }
  disposeLogger() {
    if (this._logger) {
      this._logger.drop();
      this._logger = void 0;
    }
  }
};

// src/vs/platform/log/node/loggerService.ts
var LoggerService = class extends AbstractLoggerService {
  doCreateLogger(resource, logLevel, options) {
    return new SpdLogLogger(generateUuid(), resource.fsPath, !options?.donotRotate, !!options?.donotUseFormatters, logLevel);
  }
};

// src/vs/platform/log/common/logIpc.ts
var LoggerChannel = class {
  constructor(loggerService, getUriTransformer) {
    this.loggerService = loggerService;
    this.getUriTransformer = getUriTransformer;
  }
  listen(context, event) {
    const uriTransformer = this.getUriTransformer(context);
    switch (event) {
      case "onDidChangeLoggers":
        return Event.map(this.loggerService.onDidChangeLoggers, (e) => ({
          added: [...e.added].map((logger) => this.transformLogger(logger, uriTransformer)),
          removed: [...e.removed].map((logger) => this.transformLogger(logger, uriTransformer))
        }));
      case "onDidChangeVisibility":
        return Event.map(this.loggerService.onDidChangeVisibility, (e) => [uriTransformer.transformOutgoingURI(e[0]), e[1]]);
      case "onDidChangeLogLevel":
        return Event.map(this.loggerService.onDidChangeLogLevel, (e) => isLogLevel(e) ? e : [uriTransformer.transformOutgoingURI(e[0]), e[1]]);
    }
    throw new Error(`Event not found: ${event}`);
  }
  async call(context, command, arg) {
    const uriTransformer = this.getUriTransformer(context);
    switch (command) {
      case "setLogLevel":
        return isLogLevel(arg[0]) ? this.loggerService.setLogLevel(arg[0]) : this.loggerService.setLogLevel(URI.revive(uriTransformer.transformIncoming(arg[0][0])), arg[0][1]);
      case "getRegisteredLoggers":
        return Promise.resolve([...this.loggerService.getRegisteredLoggers()].map((logger) => this.transformLogger(logger, uriTransformer)));
    }
    throw new Error(`Call not found: ${command}`);
  }
  transformLogger(logger, transformer) {
    return {
      ...logger,
      resource: transformer.transformOutgoingURI(logger.resource)
    };
  }
};

// src/vs/base/common/uriIpc.ts
var DefaultURITransformer = new class {
  transformIncoming(uri) {
    return uri;
  }
  transformOutgoing(uri) {
    return uri;
  }
  transformOutgoingURI(uri) {
    return uri;
  }
  transformOutgoingScheme(scheme) {
    return scheme;
  }
}();

// src/vs/platform/product/common/product.ts
var product;
var vscodeGlobal2 = globalThis.vscode;
if (typeof vscodeGlobal2 !== "undefined" && typeof vscodeGlobal2.context !== "undefined") {
  const configuration = vscodeGlobal2.context.configuration();
  if (configuration) {
    product = configuration.product;
  } else {
    throw new Error("Sandbox: unable to resolve product configuration from preload script.");
  }
} else if (globalThis._VSCODE_PRODUCT_JSON && globalThis._VSCODE_PACKAGE_JSON) {
  product = globalThis._VSCODE_PRODUCT_JSON;
  if (env["VSCODE_DEV"]) {
    Object.assign(product, {
      nameShort: `${product.nameShort} Dev`,
      nameLong: `${product.nameLong} Dev`,
      dataFolderName: `${product.dataFolderName}-dev`,
      serverDataFolderName: product.serverDataFolderName ? `${product.serverDataFolderName}-dev` : void 0
    });
  }
  if (!product.version) {
    const pkg = globalThis._VSCODE_PACKAGE_JSON;
    Object.assign(product, {
      version: pkg.version
    });
  }
} else {
  product = { "nameShort": "OpenML Code", "nameLong": "OpenML Code", "companyName": "Hyper System SAC", "copyright": "Copyright (C) 2026 Hyper System SAC. All rights reserved", "applicationName": "openml-code", "dataFolderName": ".openml-code", "win32MutexName": "openmlcode", "licenseName": "MIT", "licenseUrl": "https://github.com/microsoft/vscode/blob/main/LICENSE.txt", "serverLicenseUrl": "https://github.com/microsoft/vscode/blob/main/LICENSE.txt", "serverGreeting": [], "serverLicense": [], "serverLicensePrompt": "", "serverApplicationName": "openml-code-server", "serverDataFolderName": ".openml-code-server", "tunnelApplicationName": "openml-code-tunnel", "win32DirName": "OpenML Code", "win32NameVersion": "OpenML Code", "win32RegValueName": "OpenMLCode", "win32x64AppId": "{{7F7F6D7A-60F2-4D1A-9C06-5A8D9C9B1D31}", "win32arm64AppId": "{{EE4B6DA6-3D7D-4A7B-8F3D-A5110A8E97A4}", "win32x64UserAppId": "{{8AB3C6B2-79B0-466A-AE6D-EC4B8CC3CB7A}", "win32arm64UserAppId": "{{D79B2ED9-3A7B-48A6-91B1-2E4FD31D0D6B}", "win32AppUserModelId": "com.hypersystemsac.openml", "win32ExecutableName": "OMLCode", "win32ShellNameShort": "OpenML &Code", "win32TunnelServiceMutex": "openmlcode-tunnelservice", "win32TunnelMutex": "openmlcode-tunnel", "darwinBundleIdentifier": "com.hypersystemsac.openml", "darwinProfileUUID": "4D8C7B8A-5B88-4E02-9ACB-0B1EF50D7C12", "darwinProfilePayloadUUID": "4B2D9B6A-12A4-4A55-A693-F0862A0A3F11", "linuxIconName": "openml-code", "licenseFileName": "LICENSE.txt", "reportIssueUrl": "", "nodejsRepository": "https://nodejs.org", "urlProtocol": "openml-code", "webviewContentExternalBaseUrlTemplate": "https://{{uuid}}.vscode-cdn.net/insider/ef65ac1ba57f57f2a3961bfe94aa20481caca4c6/out/vs/workbench/contrib/webview/browser/pre/", "builtInExtensions": [{ "name": "ms-vscode.js-debug-companion", "version": "1.1.3", "sha256": "7380a890787452f14b2db7835dfa94de538caf358ebc263f9d46dd68ac52de93", "repo": "https://github.com/microsoft/vscode-js-debug-companion", "metadata": { "id": "99cb0b7f-7354-4278-b8da-6cc79972169d", "publisherId": { "publisherId": "5f5636e7-69ed-4afe-b5d6-8d231fb3d3ee", "publisherName": "ms-vscode", "displayName": "Microsoft", "flags": "verified" }, "publisherDisplayName": "Microsoft" } }, { "name": "ms-vscode.js-debug", "version": "1.112.0", "sha256": "c24322931434940938f8cf76ebc3dac1e95a5539b9625b165b6672d7f7eafea8", "repo": "https://github.com/microsoft/vscode-js-debug", "metadata": { "id": "25629058-ddac-4e17-abba-74678e126c5d", "publisherId": { "publisherId": "5f5636e7-69ed-4afe-b5d6-8d231fb3d3ee", "publisherName": "ms-vscode", "displayName": "Microsoft", "flags": "verified" }, "publisherDisplayName": "Microsoft" } }, { "name": "ms-vscode.vscode-js-profile-table", "version": "1.0.10", "sha256": "7361748ddf9fd09d8a2ed1f2a2d7376a2cf9aae708692820b799708385c38e08", "repo": "https://github.com/microsoft/vscode-js-profile-visualizer", "metadata": { "id": "7e52b41b-71ad-457b-ab7e-0620f1fc4feb", "publisherId": { "publisherId": "5f5636e7-69ed-4afe-b5d6-8d231fb3d3ee", "publisherName": "ms-vscode", "displayName": "Microsoft", "flags": "verified" }, "publisherDisplayName": "Microsoft" } }], "quality": "stable", "extensionsGallery": { "serviceUrl": "https://open-vsx.org/vscode/gallery", "itemUrl": "https://open-vsx.org/vscode/item", "resourceUrlTemplate": "https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}", "publisherUrl": "https://open-vsx.org/publisher/{publisher}", "nlsBaseUrl": "https://open-vsx.org/vscode/gallery", "controlUrl": "" }, "updateUrl": "https://updates.openmlcode.dev/api/update", "win32ContextMenu": { "x64": { "clsid": "{2F4E7D5C-97B8-4C14-BB7B-9A9A1C8D2F11}" }, "arm64": { "clsid": "{7E38B7D2-0F8D-4F8C-A4F1-6A0E7E6B4C22}" } }, "win32SetupExeName": "OpenMLCodeSetup", "version": "1.95.0", "commit": "87b1dfc951c9c7d56a84835f8afd3dbb3660108c", "date": "2026-03-21T01:38:30-05:00" };
  if (Object.keys(product).length === 0) {
    Object.assign(product, {
      version: "1.104.0-dev",
      nameShort: "Code - OSS Dev",
      nameLong: "Code - OSS Dev",
      applicationName: "code-oss",
      dataFolderName: ".vscode-oss",
      urlProtocol: "code-oss",
      reportIssueUrl: "",
      licenseName: "MIT",
      licenseUrl: "https://github.com/microsoft/vscode/blob/main/LICENSE.txt",
      serverLicenseUrl: "https://github.com/microsoft/vscode/blob/main/LICENSE.txt",
      defaultChatAgent: {
        extensionId: "GitHub.copilot",
        chatExtensionId: "GitHub.copilot-chat",
        provider: {
          default: {
            id: "github",
            name: "GitHub"
          },
          enterprise: {
            id: "github-enterprise",
            name: "GitHub Enterprise"
          }
        },
        providerScopes: []
      }
    });
  }
}
var product_default = product;

// src/vs/platform/agentHost/node/agentHostMain.ts
startAgentHost();
function startAgentHost() {
  let server;
  if (isUtilityProcess(process)) {
    server = new Server2();
  } else {
    server = new Server("agentHost" /* AgentHost */);
  }
  const disposables = new DisposableStore();
  const productService = { _serviceBrand: void 0, ...product_default };
  const environmentService = new NativeEnvironmentService(parseArgs(process.argv, OPTIONS), productService);
  const loggerService = new LoggerService(getLogLevel(environmentService), environmentService.logsHome);
  server.registerChannel("agentHostLogger" /* Logger */, new LoggerChannel(loggerService, () => DefaultURITransformer));
  const logger = loggerService.createLogger("agenthost", { name: localize(1836, null) });
  const logService = new LogService(logger);
  logService.info("Agent Host process started successfully");
  let agentService;
  try {
    agentService = new AgentService(logService);
    agentService.registerProvider(new CopilotAgent(logService));
  } catch (err) {
    logService.error("Failed to create AgentService", err);
    throw err;
  }
  const agentChannel = ProxyChannel.fromService(agentService, disposables);
  server.registerChannel("agentHost" /* AgentHost */, agentChannel);
  process.once("exit", () => {
    agentService.dispose();
    logService.dispose();
    disposables.dispose();
  });
}
//# sourceMappingURL=agentHostMain.js.map
