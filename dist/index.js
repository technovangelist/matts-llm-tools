var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/whatwg-fetch/dist/fetch.umd.js
var require_fetch_umd = __commonJS((exports, module) => {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global2.WHATWGFetch = {});
  })(exports, function(exports2) {
    var g = typeof globalThis !== "undefined" && globalThis || typeof self !== "undefined" && self || typeof global !== "undefined" && global || {};
    var support = {
      searchParams: "URLSearchParams" in g,
      iterable: "Symbol" in g && "iterator" in Symbol,
      blob: "FileReader" in g && "Blob" in g && function() {
        try {
          new Blob;
          return true;
        } catch (e) {
          return false;
        }
      }(),
      formData: "FormData" in g,
      arrayBuffer: "ArrayBuffer" in g
    };
    function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    }
    if (support.arrayBuffer) {
      var viewClasses = [
        "[object Int8Array]",
        "[object Uint8Array]",
        "[object Uint8ClampedArray]",
        "[object Int16Array]",
        "[object Uint16Array]",
        "[object Int32Array]",
        "[object Uint32Array]",
        "[object Float32Array]",
        "[object Float64Array]"
      ];
      var isArrayBufferView = ArrayBuffer.isView || function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
      };
    }
    function normalizeName(name) {
      if (typeof name !== "string") {
        name = String(name);
      }
      if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
        throw new TypeError('Invalid character in header field name: "' + name + '"');
      }
      return name.toLowerCase();
    }
    function normalizeValue(value) {
      if (typeof value !== "string") {
        value = String(value);
      }
      return value;
    }
    function iteratorFor(items) {
      var iterator = {
        next: function() {
          var value = items.shift();
          return { done: value === undefined, value };
        }
      };
      if (support.iterable) {
        iterator[Symbol.iterator] = function() {
          return iterator;
        };
      }
      return iterator;
    }
    function Headers(headers) {
      this.map = {};
      if (headers instanceof Headers) {
        headers.forEach(function(value, name) {
          this.append(name, value);
        }, this);
      } else if (Array.isArray(headers)) {
        headers.forEach(function(header) {
          if (header.length != 2) {
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + header.length);
          }
          this.append(header[0], header[1]);
        }, this);
      } else if (headers) {
        Object.getOwnPropertyNames(headers).forEach(function(name) {
          this.append(name, headers[name]);
        }, this);
      }
    }
    Headers.prototype.append = function(name, value) {
      name = normalizeName(name);
      value = normalizeValue(value);
      var oldValue = this.map[name];
      this.map[name] = oldValue ? oldValue + ", " + value : value;
    };
    Headers.prototype["delete"] = function(name) {
      delete this.map[normalizeName(name)];
    };
    Headers.prototype.get = function(name) {
      name = normalizeName(name);
      return this.has(name) ? this.map[name] : null;
    };
    Headers.prototype.has = function(name) {
      return this.map.hasOwnProperty(normalizeName(name));
    };
    Headers.prototype.set = function(name, value) {
      this.map[normalizeName(name)] = normalizeValue(value);
    };
    Headers.prototype.forEach = function(callback, thisArg) {
      for (var name in this.map) {
        if (this.map.hasOwnProperty(name)) {
          callback.call(thisArg, this.map[name], name, this);
        }
      }
    };
    Headers.prototype.keys = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push(name);
      });
      return iteratorFor(items);
    };
    Headers.prototype.values = function() {
      var items = [];
      this.forEach(function(value) {
        items.push(value);
      });
      return iteratorFor(items);
    };
    Headers.prototype.entries = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
      });
      return iteratorFor(items);
    };
    if (support.iterable) {
      Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
    }
    function consumed(body) {
      if (body._noBody)
        return;
      if (body.bodyUsed) {
        return Promise.reject(new TypeError("Already read"));
      }
      body.bodyUsed = true;
    }
    function fileReaderReady(reader) {
      return new Promise(function(resolve, reject) {
        reader.onload = function() {
          resolve(reader.result);
        };
        reader.onerror = function() {
          reject(reader.error);
        };
      });
    }
    function readBlobAsArrayBuffer(blob) {
      var reader = new FileReader;
      var promise = fileReaderReady(reader);
      reader.readAsArrayBuffer(blob);
      return promise;
    }
    function readBlobAsText(blob) {
      var reader = new FileReader;
      var promise = fileReaderReady(reader);
      var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
      var encoding = match ? match[1] : "utf-8";
      reader.readAsText(blob, encoding);
      return promise;
    }
    function readArrayBufferAsText(buf) {
      var view = new Uint8Array(buf);
      var chars = new Array(view.length);
      for (var i = 0;i < view.length; i++) {
        chars[i] = String.fromCharCode(view[i]);
      }
      return chars.join("");
    }
    function bufferClone(buf) {
      if (buf.slice) {
        return buf.slice(0);
      } else {
        var view = new Uint8Array(buf.byteLength);
        view.set(new Uint8Array(buf));
        return view.buffer;
      }
    }
    function Body() {
      this.bodyUsed = false;
      this._initBody = function(body) {
        this.bodyUsed = this.bodyUsed;
        this._bodyInit = body;
        if (!body) {
          this._noBody = true;
          this._bodyText = "";
        } else if (typeof body === "string") {
          this._bodyText = body;
        } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
          this._bodyBlob = body;
        } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
          this._bodyFormData = body;
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this._bodyText = body.toString();
        } else if (support.arrayBuffer && support.blob && isDataView(body)) {
          this._bodyArrayBuffer = bufferClone(body.buffer);
          this._bodyInit = new Blob([this._bodyArrayBuffer]);
        } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
          this._bodyArrayBuffer = bufferClone(body);
        } else {
          this._bodyText = body = Object.prototype.toString.call(body);
        }
        if (!this.headers.get("content-type")) {
          if (typeof body === "string") {
            this.headers.set("content-type", "text/plain;charset=UTF-8");
          } else if (this._bodyBlob && this._bodyBlob.type) {
            this.headers.set("content-type", this._bodyBlob.type);
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
          }
        }
      };
      if (support.blob) {
        this.blob = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }
          if (this._bodyBlob) {
            return Promise.resolve(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as blob");
          } else {
            return Promise.resolve(new Blob([this._bodyText]));
          }
        };
      }
      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          var isConsumed = consumed(this);
          if (isConsumed) {
            return isConsumed;
          } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
            return Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset, this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength));
          } else {
            return Promise.resolve(this._bodyArrayBuffer);
          }
        } else if (support.blob) {
          return this.blob().then(readBlobAsArrayBuffer);
        } else {
          throw new Error("could not read as ArrayBuffer");
        }
      };
      this.text = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }
        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
        } else if (this._bodyFormData) {
          throw new Error("could not read FormData body as text");
        } else {
          return Promise.resolve(this._bodyText);
        }
      };
      if (support.formData) {
        this.formData = function() {
          return this.text().then(decode);
        };
      }
      this.json = function() {
        return this.text().then(JSON.parse);
      };
      return this;
    }
    var methods = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
    function normalizeMethod(method) {
      var upcased = method.toUpperCase();
      return methods.indexOf(upcased) > -1 ? upcased : method;
    }
    function Request(input, options) {
      if (!(this instanceof Request)) {
        throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
      }
      options = options || {};
      var body = options.body;
      if (input instanceof Request) {
        if (input.bodyUsed) {
          throw new TypeError("Already read");
        }
        this.url = input.url;
        this.credentials = input.credentials;
        if (!options.headers) {
          this.headers = new Headers(input.headers);
        }
        this.method = input.method;
        this.mode = input.mode;
        this.signal = input.signal;
        if (!body && input._bodyInit != null) {
          body = input._bodyInit;
          input.bodyUsed = true;
        }
      } else {
        this.url = String(input);
      }
      this.credentials = options.credentials || this.credentials || "same-origin";
      if (options.headers || !this.headers) {
        this.headers = new Headers(options.headers);
      }
      this.method = normalizeMethod(options.method || this.method || "GET");
      this.mode = options.mode || this.mode || null;
      this.signal = options.signal || this.signal || function() {
        if ("AbortController" in g) {
          var ctrl = new AbortController;
          return ctrl.signal;
        }
      }();
      this.referrer = null;
      if ((this.method === "GET" || this.method === "HEAD") && body) {
        throw new TypeError("Body not allowed for GET or HEAD requests");
      }
      this._initBody(body);
      if (this.method === "GET" || this.method === "HEAD") {
        if (options.cache === "no-store" || options.cache === "no-cache") {
          var reParamSearch = /([?&])_=[^&]*/;
          if (reParamSearch.test(this.url)) {
            this.url = this.url.replace(reParamSearch, "$1_=" + new Date().getTime());
          } else {
            var reQueryString = /\?/;
            this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + new Date().getTime();
          }
        }
      }
    }
    Request.prototype.clone = function() {
      return new Request(this, { body: this._bodyInit });
    };
    function decode(body) {
      var form = new FormData;
      body.trim().split("&").forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split("=");
          var name = split.shift().replace(/\+/g, " ");
          var value = split.join("=").replace(/\+/g, " ");
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
      return form;
    }
    function parseHeaders(rawHeaders) {
      var headers = new Headers;
      var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
      preProcessedHeaders.split("\r").map(function(header) {
        return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
      }).forEach(function(line) {
        var parts = line.split(":");
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(":").trim();
          try {
            headers.append(key, value);
          } catch (error) {
            console.warn("Response " + error.message);
          }
        }
      });
      return headers;
    }
    Body.call(Request.prototype);
    function Response(bodyInit, options) {
      if (!(this instanceof Response)) {
        throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
      }
      if (!options) {
        options = {};
      }
      this.type = "default";
      this.status = options.status === undefined ? 200 : options.status;
      if (this.status < 200 || this.status > 599) {
        throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
      }
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = options.statusText === undefined ? "" : "" + options.statusText;
      this.headers = new Headers(options.headers);
      this.url = options.url || "";
      this._initBody(bodyInit);
    }
    Body.call(Response.prototype);
    Response.prototype.clone = function() {
      return new Response(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: new Headers(this.headers),
        url: this.url
      });
    };
    Response.error = function() {
      var response = new Response(null, { status: 200, statusText: "" });
      response.ok = false;
      response.status = 0;
      response.type = "error";
      return response;
    };
    var redirectStatuses = [301, 302, 303, 307, 308];
    Response.redirect = function(url, status) {
      if (redirectStatuses.indexOf(status) === -1) {
        throw new RangeError("Invalid status code");
      }
      return new Response(null, { status, headers: { location: url } });
    };
    exports2.DOMException = g.DOMException;
    try {
      new exports2.DOMException;
    } catch (err) {
      exports2.DOMException = function(message, name) {
        this.message = message;
        this.name = name;
        var error = Error(message);
        this.stack = error.stack;
      };
      exports2.DOMException.prototype = Object.create(Error.prototype);
      exports2.DOMException.prototype.constructor = exports2.DOMException;
    }
    function fetch2(input, init) {
      return new Promise(function(resolve, reject) {
        var request = new Request(input, init);
        if (request.signal && request.signal.aborted) {
          return reject(new exports2.DOMException("Aborted", "AbortError"));
        }
        var xhr = new XMLHttpRequest;
        function abortXhr() {
          xhr.abort();
        }
        xhr.onload = function() {
          var options = {
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders() || "")
          };
          if (request.url.indexOf("file://") === 0 && (xhr.status < 200 || xhr.status > 599)) {
            options.status = 200;
          } else {
            options.status = xhr.status;
          }
          options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
          var body = "response" in xhr ? xhr.response : xhr.responseText;
          setTimeout(function() {
            resolve(new Response(body, options));
          }, 0);
        };
        xhr.onerror = function() {
          setTimeout(function() {
            reject(new TypeError("Network request failed"));
          }, 0);
        };
        xhr.ontimeout = function() {
          setTimeout(function() {
            reject(new TypeError("Network request timed out"));
          }, 0);
        };
        xhr.onabort = function() {
          setTimeout(function() {
            reject(new exports2.DOMException("Aborted", "AbortError"));
          }, 0);
        };
        function fixUrl(url) {
          try {
            return url === "" && g.location.href ? g.location.href : url;
          } catch (e) {
            return url;
          }
        }
        xhr.open(request.method, fixUrl(request.url), true);
        if (request.credentials === "include") {
          xhr.withCredentials = true;
        } else if (request.credentials === "omit") {
          xhr.withCredentials = false;
        }
        if ("responseType" in xhr) {
          if (support.blob) {
            xhr.responseType = "blob";
          } else if (support.arrayBuffer) {
            xhr.responseType = "arraybuffer";
          }
        }
        if (init && typeof init.headers === "object" && !(init.headers instanceof Headers || g.Headers && init.headers instanceof g.Headers)) {
          var names = [];
          Object.getOwnPropertyNames(init.headers).forEach(function(name) {
            names.push(normalizeName(name));
            xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
          });
          request.headers.forEach(function(value, name) {
            if (names.indexOf(name) === -1) {
              xhr.setRequestHeader(name, value);
            }
          });
        } else {
          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });
        }
        if (request.signal) {
          request.signal.addEventListener("abort", abortXhr);
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              request.signal.removeEventListener("abort", abortXhr);
            }
          };
        }
        xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
      });
    }
    fetch2.polyfill = true;
    if (!g.fetch) {
      g.fetch = fetch2;
      g.Headers = Headers;
      g.Request = Request;
      g.Response = Response;
    }
    exports2.Headers = Headers;
    exports2.Request = Request;
    exports2.Response = Response;
    exports2.fetch = fetch2;
    Object.defineProperty(exports2, "__esModule", { value: true });
  });
});

// node_modules/@stdlib/utils-define-property/lib/define_property.js
var require_define_property = __commonJS((exports, module) => {
  var main = typeof Object.defineProperty === "function" ? Object.defineProperty : null;
  module.exports = main;
});

// node_modules/@stdlib/utils-define-property/lib/has_define_property_support.js
var require_has_define_property_support = __commonJS((exports, module) => {
  var hasDefinePropertySupport = function() {
    try {
      defineProperty({}, "x", {});
      return true;
    } catch (err) {
      return false;
    }
  };
  var defineProperty = require_define_property();
  module.exports = hasDefinePropertySupport;
});

// node_modules/@stdlib/utils-define-property/lib/builtin.js
var require_builtin = __commonJS((exports, module) => {
  var defineProperty = Object.defineProperty;
  module.exports = defineProperty;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/is_number.js
var require_is_number = __commonJS((exports, module) => {
  var isNumber = function(value) {
    return typeof value === "number";
  };
  module.exports = isNumber;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/zero_pad.js
var require_zero_pad = __commonJS((exports, module) => {
  var startsWithMinus = function(str) {
    return str[0] === "-";
  };
  var zeros = function(n) {
    var out = "";
    var i;
    for (i = 0;i < n; i++) {
      out += "0";
    }
    return out;
  };
  var zeroPad = function(str, width, right) {
    var negative = false;
    var pad = width - str.length;
    if (pad < 0) {
      return str;
    }
    if (startsWithMinus(str)) {
      negative = true;
      str = str.substr(1);
    }
    str = right ? str + zeros(pad) : zeros(pad) + str;
    if (negative) {
      str = "-" + str;
    }
    return str;
  };
  module.exports = zeroPad;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/format_integer.js
var require_format_integer = __commonJS((exports, module) => {
  var formatInteger = function(token) {
    var base;
    var out;
    var i;
    switch (token.specifier) {
      case "b":
        base = 2;
        break;
      case "o":
        base = 8;
        break;
      case "x":
      case "X":
        base = 16;
        break;
      case "d":
      case "i":
      case "u":
      default:
        base = 10;
        break;
    }
    out = token.arg;
    i = parseInt(out, 10);
    if (!isFinite(i)) {
      if (!isNumber(out)) {
        throw new Error("invalid integer. Value: " + out);
      }
      i = 0;
    }
    if (i < 0 && (token.specifier === "u" || base !== 10)) {
      i = 4294967295 + i + 1;
    }
    if (i < 0) {
      out = (-i).toString(base);
      if (token.precision) {
        out = zeroPad(out, token.precision, token.padRight);
      }
      out = "-" + out;
    } else {
      out = i.toString(base);
      if (!i && !token.precision) {
        out = "";
      } else if (token.precision) {
        out = zeroPad(out, token.precision, token.padRight);
      }
      if (token.sign) {
        out = token.sign + out;
      }
    }
    if (base === 16) {
      if (token.alternate) {
        out = "0x" + out;
      }
      out = token.specifier === uppercase.call(token.specifier) ? uppercase.call(out) : lowercase.call(out);
    }
    if (base === 8) {
      if (token.alternate && out.charAt(0) !== "0") {
        out = "0" + out;
      }
    }
    return out;
  };
  var isNumber = require_is_number();
  var zeroPad = require_zero_pad();
  var lowercase = String.prototype.toLowerCase;
  var uppercase = String.prototype.toUpperCase;
  module.exports = formatInteger;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/is_string.js
var require_is_string = __commonJS((exports, module) => {
  var isString = function(value) {
    return typeof value === "string";
  };
  module.exports = isString;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/format_double.js
var require_format_double = __commonJS((exports, module) => {
  var formatDouble = function(token) {
    var digits;
    var out;
    var f = parseFloat(token.arg);
    if (!isFinite(f)) {
      if (!isNumber(token.arg)) {
        throw new Error("invalid floating-point number. Value: " + out);
      }
      f = token.arg;
    }
    switch (token.specifier) {
      case "e":
      case "E":
        out = f.toExponential(token.precision);
        break;
      case "f":
      case "F":
        out = f.toFixed(token.precision);
        break;
      case "g":
      case "G":
        if (abs(f) < 0.0001) {
          digits = token.precision;
          if (digits > 0) {
            digits -= 1;
          }
          out = f.toExponential(digits);
        } else {
          out = f.toPrecision(token.precision);
        }
        if (!token.alternate) {
          out = replace.call(out, RE_ZERO_BEFORE_EXP, "$1e");
          out = replace.call(out, RE_PERIOD_ZERO_EXP, "e");
          out = replace.call(out, RE_TRAILING_PERIOD_ZERO, "");
        }
        break;
      default:
        throw new Error("invalid double notation. Value: " + token.specifier);
    }
    out = replace.call(out, RE_EXP_POS_DIGITS, "e+0$1");
    out = replace.call(out, RE_EXP_NEG_DIGITS, "e-0$1");
    if (token.alternate) {
      out = replace.call(out, RE_ONLY_DIGITS, "$1.");
      out = replace.call(out, RE_DIGITS_BEFORE_EXP, "$1.e");
    }
    if (f >= 0 && token.sign) {
      out = token.sign + out;
    }
    out = token.specifier === uppercase.call(token.specifier) ? uppercase.call(out) : lowercase.call(out);
    return out;
  };
  var isNumber = require_is_number();
  var abs = Math.abs;
  var lowercase = String.prototype.toLowerCase;
  var uppercase = String.prototype.toUpperCase;
  var replace = String.prototype.replace;
  var RE_EXP_POS_DIGITS = /e\+(\d)$/;
  var RE_EXP_NEG_DIGITS = /e-(\d)$/;
  var RE_ONLY_DIGITS = /^(\d+)$/;
  var RE_DIGITS_BEFORE_EXP = /^(\d+)e/;
  var RE_TRAILING_PERIOD_ZERO = /\.0$/;
  var RE_PERIOD_ZERO_EXP = /\.0*e/;
  var RE_ZERO_BEFORE_EXP = /(\..*[^0])0*e/;
  module.exports = formatDouble;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/space_pad.js
var require_space_pad = __commonJS((exports, module) => {
  var spaces = function(n) {
    var out = "";
    var i;
    for (i = 0;i < n; i++) {
      out += " ";
    }
    return out;
  };
  var spacePad = function(str, width, right) {
    var pad = width - str.length;
    if (pad < 0) {
      return str;
    }
    str = right ? str + spaces(pad) : spaces(pad) + str;
    return str;
  };
  module.exports = spacePad;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/main.js
var require_main = __commonJS((exports, module) => {
  var initialize = function(token) {
    var out = {};
    out.specifier = token.specifier;
    out.precision = token.precision === undefined ? 1 : token.precision;
    out.width = token.width;
    out.flags = token.flags || "";
    out.mapping = token.mapping;
    return out;
  };
  var formatInterpolate = function(tokens) {
    var hasPeriod;
    var flags;
    var token;
    var flag;
    var num;
    var out;
    var pos;
    var i;
    var j;
    if (!isArray(tokens)) {
      throw new TypeError("invalid argument. First argument must be an array. Value: `" + tokens + "`.");
    }
    out = "";
    pos = 1;
    for (i = 0;i < tokens.length; i++) {
      token = tokens[i];
      if (isString(token)) {
        out += token;
      } else {
        hasPeriod = token.precision !== undefined;
        token = initialize(token);
        if (!token.specifier) {
          throw new TypeError("invalid argument. Token is missing `specifier` property. Index: `" + i + "`. Value: `" + token + "`.");
        }
        if (token.mapping) {
          pos = token.mapping;
        }
        flags = token.flags;
        for (j = 0;j < flags.length; j++) {
          flag = flags.charAt(j);
          switch (flag) {
            case " ":
              token.sign = " ";
              break;
            case "+":
              token.sign = "+";
              break;
            case "-":
              token.padRight = true;
              token.padZeros = false;
              break;
            case "0":
              token.padZeros = flags.indexOf("-") < 0;
              break;
            case "#":
              token.alternate = true;
              break;
            default:
              throw new Error("invalid flag: " + flag);
          }
        }
        if (token.width === "*") {
          token.width = parseInt(arguments[pos], 10);
          pos += 1;
          if (isnan(token.width)) {
            throw new TypeError("the argument for * width at position " + pos + " is not a number. Value: `" + token.width + "`.");
          }
          if (token.width < 0) {
            token.padRight = true;
            token.width = -token.width;
          }
        }
        if (hasPeriod) {
          if (token.precision === "*") {
            token.precision = parseInt(arguments[pos], 10);
            pos += 1;
            if (isnan(token.precision)) {
              throw new TypeError("the argument for * precision at position " + pos + " is not a number. Value: `" + token.precision + "`.");
            }
            if (token.precision < 0) {
              token.precision = 1;
              hasPeriod = false;
            }
          }
        }
        token.arg = arguments[pos];
        switch (token.specifier) {
          case "b":
          case "o":
          case "x":
          case "X":
          case "d":
          case "i":
          case "u":
            if (hasPeriod) {
              token.padZeros = false;
            }
            token.arg = formatInteger(token);
            break;
          case "s":
            token.maxWidth = hasPeriod ? token.precision : -1;
            break;
          case "c":
            if (!isnan(token.arg)) {
              num = parseInt(token.arg, 10);
              if (num < 0 || num > 127) {
                throw new Error("invalid character code. Value: " + token.arg);
              }
              token.arg = isnan(num) ? String(token.arg) : fromCharCode(num);
            }
            break;
          case "e":
          case "E":
          case "f":
          case "F":
          case "g":
          case "G":
            if (!hasPeriod) {
              token.precision = 6;
            }
            token.arg = formatDouble(token);
            break;
          default:
            throw new Error("invalid specifier: " + token.specifier);
        }
        if (token.maxWidth >= 0 && token.arg.length > token.maxWidth) {
          token.arg = token.arg.substring(0, token.maxWidth);
        }
        if (token.padZeros) {
          token.arg = zeroPad(token.arg, token.width || token.precision, token.padRight);
        } else if (token.width) {
          token.arg = spacePad(token.arg, token.width, token.padRight);
        }
        out += token.arg || "";
        pos += 1;
      }
    }
    return out;
  };
  var formatInteger = require_format_integer();
  var isString = require_is_string();
  var formatDouble = require_format_double();
  var spacePad = require_space_pad();
  var zeroPad = require_zero_pad();
  var fromCharCode = String.fromCharCode;
  var isnan = isNaN;
  var isArray = Array.isArray;
  module.exports = formatInterpolate;
});

// node_modules/@stdlib/string-base-format-interpolate/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var main = require_main();
  module.exports = main;
});

// node_modules/@stdlib/string-base-format-tokenize/lib/main.js
var require_main2 = __commonJS((exports, module) => {
  var parse = function(match) {
    var token = {
      mapping: match[1] ? parseInt(match[1], 10) : undefined,
      flags: match[2],
      width: match[3],
      precision: match[5],
      specifier: match[6]
    };
    if (match[4] === "." && match[5] === undefined) {
      token.precision = "1";
    }
    return token;
  };
  var formatTokenize = function(str) {
    var content;
    var tokens;
    var match;
    var prev;
    tokens = [];
    prev = 0;
    match = RE.exec(str);
    while (match) {
      content = str.slice(prev, RE.lastIndex - match[0].length);
      if (content.length) {
        tokens.push(content);
      }
      tokens.push(parse(match));
      prev = RE.lastIndex;
      match = RE.exec(str);
    }
    content = str.slice(prev);
    if (content.length) {
      tokens.push(content);
    }
    return tokens;
  };
  var RE = /%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;
  module.exports = formatTokenize;
});

// node_modules/@stdlib/string-base-format-tokenize/lib/index.js
var require_lib2 = __commonJS((exports, module) => {
  var main = require_main2();
  module.exports = main;
});

// node_modules/@stdlib/string-format/lib/is_string.js
var require_is_string2 = __commonJS((exports, module) => {
  var isString = function(value) {
    return typeof value === "string";
  };
  module.exports = isString;
});

// node_modules/@stdlib/string-format/lib/main.js
var require_main3 = __commonJS((exports, module) => {
  var format = function(str) {
    var args;
    var i;
    if (!isString(str)) {
      throw new TypeError(format("invalid argument. First argument must be a string. Value: `%s`.", str));
    }
    args = [tokenize(str)];
    for (i = 1;i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return interpolate.apply(null, args);
  };
  var interpolate = require_lib();
  var tokenize = require_lib2();
  var isString = require_is_string2();
  module.exports = format;
});

// node_modules/@stdlib/string-format/lib/index.js
var require_lib3 = __commonJS((exports, module) => {
  var main = require_main3();
  module.exports = main;
});

// node_modules/@stdlib/utils-define-property/lib/polyfill.js
var require_polyfill = __commonJS((exports, module) => {
  var defineProperty = function(obj, prop, descriptor) {
    var prototype;
    var hasValue;
    var hasGet;
    var hasSet;
    if (typeof obj !== "object" || obj === null || toStr.call(obj) === "[object Array]") {
      throw new TypeError(format("invalid argument. First argument must be an object. Value: `%s`.", obj));
    }
    if (typeof descriptor !== "object" || descriptor === null || toStr.call(descriptor) === "[object Array]") {
      throw new TypeError(format("invalid argument. Property descriptor must be an object. Value: `%s`.", descriptor));
    }
    hasValue = "value" in descriptor;
    if (hasValue) {
      if (lookupGetter.call(obj, prop) || lookupSetter.call(obj, prop)) {
        prototype = obj.__proto__;
        obj.__proto__ = objectProtoype;
        delete obj[prop];
        obj[prop] = descriptor.value;
        obj.__proto__ = prototype;
      } else {
        obj[prop] = descriptor.value;
      }
    }
    hasGet = "get" in descriptor;
    hasSet = "set" in descriptor;
    if (hasValue && (hasGet || hasSet)) {
      throw new Error("invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.");
    }
    if (hasGet && defineGetter) {
      defineGetter.call(obj, prop, descriptor.get);
    }
    if (hasSet && defineSetter) {
      defineSetter.call(obj, prop, descriptor.set);
    }
    return obj;
  };
  var format = require_lib3();
  var objectProtoype = Object.prototype;
  var toStr = objectProtoype.toString;
  var defineGetter = objectProtoype.__defineGetter__;
  var defineSetter = objectProtoype.__defineSetter__;
  var lookupGetter = objectProtoype.__lookupGetter__;
  var lookupSetter = objectProtoype.__lookupSetter__;
  module.exports = defineProperty;
});

// node_modules/@stdlib/utils-define-property/lib/index.js
var require_lib4 = __commonJS((exports, module) => {
  var hasDefinePropertySupport = require_has_define_property_support();
  var builtin = require_builtin();
  var polyfill = require_polyfill();
  var defineProperty;
  if (hasDefinePropertySupport()) {
    defineProperty = builtin;
  } else {
    defineProperty = polyfill;
  }
  module.exports = defineProperty;
});

// node_modules/@stdlib/utils-define-nonenumerable-read-only-property/lib/main.js
var require_main4 = __commonJS((exports, module) => {
  var setNonEnumerableReadOnly = function(obj, prop, value) {
    defineProperty(obj, prop, {
      configurable: false,
      enumerable: false,
      writable: false,
      value
    });
  };
  var defineProperty = require_lib4();
  module.exports = setNonEnumerableReadOnly;
});

// node_modules/@stdlib/utils-define-nonenumerable-read-only-property/lib/index.js
var require_lib5 = __commonJS((exports, module) => {
  var main = require_main4();
  module.exports = main;
});

// node_modules/@stdlib/assert-is-string/lib/primitive.js
var require_primitive = __commonJS((exports, module) => {
  var isString = function(value) {
    return typeof value === "string";
  };
  module.exports = isString;
});

// node_modules/@stdlib/assert-has-symbol-support/lib/main.js
var require_main5 = __commonJS((exports, module) => {
  var hasSymbolSupport = function() {
    return typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
  };
  module.exports = hasSymbolSupport;
});

// node_modules/@stdlib/assert-has-symbol-support/lib/index.js
var require_lib6 = __commonJS((exports, module) => {
  var main = require_main5();
  module.exports = main;
});

// node_modules/@stdlib/assert-has-tostringtag-support/lib/main.js
var require_main6 = __commonJS((exports, module) => {
  var hasToStringTagSupport = function() {
    return FLG && typeof Symbol.toStringTag === "symbol";
  };
  var hasSymbols = require_lib6();
  var FLG = hasSymbols();
  module.exports = hasToStringTagSupport;
});

// node_modules/@stdlib/assert-has-tostringtag-support/lib/index.js
var require_lib7 = __commonJS((exports, module) => {
  var main = require_main6();
  module.exports = main;
});

// node_modules/@stdlib/utils-native-class/lib/tostring.js
var require_tostring = __commonJS((exports, module) => {
  var toStr = Object.prototype.toString;
  module.exports = toStr;
});

// node_modules/@stdlib/utils-native-class/lib/main.js
var require_main7 = __commonJS((exports, module) => {
  var nativeClass = function(v) {
    return toStr.call(v);
  };
  var toStr = require_tostring();
  module.exports = nativeClass;
});

// node_modules/@stdlib/assert-has-own-property/lib/main.js
var require_main8 = __commonJS((exports, module) => {
  var hasOwnProp = function(value, property) {
    if (value === undefined || value === null) {
      return false;
    }
    return has.call(value, property);
  };
  var has = Object.prototype.hasOwnProperty;
  module.exports = hasOwnProp;
});

// node_modules/@stdlib/assert-has-own-property/lib/index.js
var require_lib8 = __commonJS((exports, module) => {
  var main = require_main8();
  module.exports = main;
});

// node_modules/@stdlib/symbol-ctor/lib/main.js
var require_main9 = __commonJS((exports, module) => {
  var Sym = typeof Symbol === "function" ? Symbol : undefined;
  module.exports = Sym;
});

// node_modules/@stdlib/symbol-ctor/lib/index.js
var require_lib9 = __commonJS((exports, module) => {
  var main = require_main9();
  module.exports = main;
});

// node_modules/@stdlib/utils-native-class/lib/tostringtag.js
var require_tostringtag = __commonJS((exports, module) => {
  var Symbol2 = require_lib9();
  var toStrTag = typeof Symbol2 === "function" ? Symbol2.toStringTag : "";
  module.exports = toStrTag;
});

// node_modules/@stdlib/utils-native-class/lib/polyfill.js
var require_polyfill2 = __commonJS((exports, module) => {
  var nativeClass = function(v) {
    var isOwn;
    var tag;
    var out;
    if (v === null || v === undefined) {
      return toStr.call(v);
    }
    tag = v[toStringTag];
    isOwn = hasOwnProp(v, toStringTag);
    try {
      v[toStringTag] = undefined;
    } catch (err) {
      return toStr.call(v);
    }
    out = toStr.call(v);
    if (isOwn) {
      v[toStringTag] = tag;
    } else {
      delete v[toStringTag];
    }
    return out;
  };
  var hasOwnProp = require_lib8();
  var toStringTag = require_tostringtag();
  var toStr = require_tostring();
  module.exports = nativeClass;
});

// node_modules/@stdlib/utils-native-class/lib/index.js
var require_lib10 = __commonJS((exports, module) => {
  var hasToStringTag = require_lib7();
  var builtin = require_main7();
  var polyfill = require_polyfill2();
  var main;
  if (hasToStringTag()) {
    main = polyfill;
  } else {
    main = builtin;
  }
  module.exports = main;
});

// node_modules/@stdlib/assert-is-string/lib/valueof.js
var require_valueof = __commonJS((exports, module) => {
  var valueOf = String.prototype.valueOf;
  module.exports = valueOf;
});

// node_modules/@stdlib/assert-is-string/lib/try2valueof.js
var require_try2valueof = __commonJS((exports, module) => {
  var test = function(value) {
    try {
      valueOf.call(value);
      return true;
    } catch (err) {
      return false;
    }
  };
  var valueOf = require_valueof();
  module.exports = test;
});

// node_modules/@stdlib/assert-is-string/lib/object.js
var require_object = __commonJS((exports, module) => {
  var isString = function(value) {
    if (typeof value === "object") {
      if (value instanceof String) {
        return true;
      }
      if (FLG) {
        return test(value);
      }
      return nativeClass(value) === "[object String]";
    }
    return false;
  };
  var hasToStringTag = require_lib7();
  var nativeClass = require_lib10();
  var test = require_try2valueof();
  var FLG = hasToStringTag();
  module.exports = isString;
});

// node_modules/@stdlib/assert-is-string/lib/main.js
var require_main10 = __commonJS((exports, module) => {
  var isString = function(value) {
    return isPrimitive(value) || isObject(value);
  };
  var isPrimitive = require_primitive();
  var isObject = require_object();
  module.exports = isString;
});

// node_modules/@stdlib/assert-is-string/lib/index.js
var require_lib11 = __commonJS((exports, module) => {
  var setReadOnly = require_lib5();
  var main = require_main10();
  var isPrimitive = require_primitive();
  var isObject = require_object();
  setReadOnly(main, "isPrimitive", isPrimitive);
  setReadOnly(main, "isObject", isObject);
  module.exports = main;
});

// node_modules/@stdlib/assert-is-boolean/lib/primitive.js
var require_primitive2 = __commonJS((exports, module) => {
  var isBoolean = function(value) {
    return typeof value === "boolean";
  };
  module.exports = isBoolean;
});

// node_modules/@stdlib/boolean-ctor/lib/main.js
var require_main11 = __commonJS((exports, module) => {
  var Bool = Boolean;
  module.exports = Bool;
});

// node_modules/@stdlib/boolean-ctor/lib/index.js
var require_lib12 = __commonJS((exports, module) => {
  var main = require_main11();
  module.exports = main;
});

// node_modules/@stdlib/assert-is-boolean/lib/tostring.js
var require_tostring2 = __commonJS((exports, module) => {
  var toString = Boolean.prototype.toString;
  module.exports = toString;
});

// node_modules/@stdlib/assert-is-boolean/lib/try2serialize.js
var require_try2serialize = __commonJS((exports, module) => {
  var test = function(value) {
    try {
      toString.call(value);
      return true;
    } catch (err) {
      return false;
    }
  };
  var toString = require_tostring2();
  module.exports = test;
});

// node_modules/@stdlib/assert-is-boolean/lib/object.js
var require_object2 = __commonJS((exports, module) => {
  var isBoolean = function(value) {
    if (typeof value === "object") {
      if (value instanceof Boolean2) {
        return true;
      }
      if (FLG) {
        return test(value);
      }
      return nativeClass(value) === "[object Boolean]";
    }
    return false;
  };
  var hasToStringTag = require_lib7();
  var nativeClass = require_lib10();
  var Boolean2 = require_lib12();
  var test = require_try2serialize();
  var FLG = hasToStringTag();
  module.exports = isBoolean;
});

// node_modules/@stdlib/assert-is-boolean/lib/main.js
var require_main12 = __commonJS((exports, module) => {
  var isBoolean = function(value) {
    return isPrimitive(value) || isObject(value);
  };
  var isPrimitive = require_primitive2();
  var isObject = require_object2();
  module.exports = isBoolean;
});

// node_modules/@stdlib/assert-is-boolean/lib/index.js
var require_lib13 = __commonJS((exports, module) => {
  var setReadOnly = require_lib5();
  var main = require_main12();
  var isPrimitive = require_primitive2();
  var isObject = require_object2();
  setReadOnly(main, "isPrimitive", isPrimitive);
  setReadOnly(main, "isObject", isObject);
  module.exports = main;
});

// node_modules/@stdlib/nlp-tokenize/lib/abbreviations.json
var require_abbreviations = __commonJS((exports, module) => {
  module.exports = {
    "i.e.": ["i.e."],
    "I.e.": ["I.e."],
    "I.E.": ["I.E."],
    "e.g.": ["e.g."],
    "E.g.": ["E.g."],
    "E.G.": ["E.G."],
    "et al.": ["et al."],
    "etc.": ["etc."],
    "vs.": ["vs."],
    "A.S.A.P": ["A.S.A.P"],
    "E.T.A.": ["E.T.A."],
    "D.I.Y": ["D.I.Y"],
    "R.S.V.P": ["R.S.V.P"],
    "P.S.": ["P.S."],
    "B.Y.O.B": ["B.Y.O.B"],
    "Ms.": ["Ms."],
    "Mr.": ["Mr."],
    "Dr.": ["Dr."],
    "Prof.": ["Prof."],
    "Mrs.": ["Mrs."],
    "Messrs.": ["Messrs."],
    "Gov.": ["Gov."],
    "Gen.": ["Gen."],
    "Lt.": ["Lt."],
    "Col.": ["Col."],
    "Mt.": ["Mt."],
    "Bros.": ["Bros."],
    "Corp.": ["Corp."],
    "Co.": ["Co."],
    "co.": ["co."],
    "Inc.": ["Inc."],
    "Ltd.": ["Ltd."],
    "Rep.": ["Rep."],
    "Sen.": ["Sen."],
    "Jr.": ["Jr."],
    "Sr.": ["Sr."],
    "Ph.D.": ["Ph.D."],
    "J.D.": ["J.D."],
    "M.D.": ["M.D."],
    "Rev.": ["Rev."],
    "Adm.": ["Adm."],
    "St.": ["St."],
    "a.m.": ["a.m."],
    "p.m.": ["p.m."],
    "b.c.": ["b.c."],
    "B.C.": ["B.C."],
    "a.d.": ["a.d."],
    "A.D.": ["A.D."],
    "b.c.e.": ["b.c.e."],
    "B.C.E.": ["B.C.E."],
    "Jan.": ["Jan."],
    "Feb.": ["Feb."],
    "Mar.": ["Mar."],
    "Apr.": ["Apr."],
    "May.": ["May."],
    "Jun.": ["Jun."],
    "Jul.": ["Jul."],
    "Aug.": ["Aug."],
    "Sep.": ["Sep."],
    "Sept.": ["Sept."],
    "Oct.": ["Oct."],
    "Nov.": ["Nov."],
    "Dec.": ["Dec."],
    "Ala.": ["Ala."],
    "Ariz.": ["Ariz."],
    "Ark.": ["Ark."],
    "Calif.": ["Calif."],
    "Colo.": ["Colo."],
    "Conn.": ["Conn."],
    "Del.": ["Del."],
    "D.C.": ["D.C."],
    "Fla.": ["Fla."],
    "Ga.": ["Ga."],
    "Ill.": ["Ill."],
    "Ind.": ["Ind."],
    "Kans.": ["Kans."],
    "Kan.": ["Kan."],
    "Ky.": ["Ky."],
    "La.": ["La."],
    "Md.": ["Md."],
    "Mass.": ["Mass."],
    "Mich.": ["Mich."],
    "Minn.": ["Minn."],
    "Miss.": ["Miss."],
    "Mo.": ["Mo."],
    "Mont.": ["Mont."],
    "Nebr.": ["Nebr."],
    "Neb.": ["Neb."],
    "Nev.": ["Nev."],
    "N.H.": ["N.H."],
    "N.J.": ["N.J."],
    "N.M.": ["N.M."],
    "N.Y.": ["N.Y."],
    "N.C.": ["N.C."],
    "N.D.": ["N.D."],
    "Okla.": ["Okla."],
    "Ore.": ["Ore."],
    "Pa.": ["Pa."],
    "Tenn.": ["Tenn."],
    "Va.": ["Va."],
    "Wash.": ["Wash."],
    "Wis.": ["Wis."]
  };
});

// node_modules/@stdlib/nlp-tokenize/lib/emojis.json
var require_emojis = __commonJS((exports, module) => {
  module.exports = {
    "^_^": ["^_^"],
    "=D": ["=D"],
    ";-p": [";-p"],
    ":O": [":O"],
    ":-/": [":-/"],
    xD: ["xD"],
    V_V: ["V_V"],
    ";(": [";("],
    "(:": ["(:"],
    "\")": ["\")"],
    ":Y": [":Y"],
    ":]": [":]"],
    ":3": [":3"],
    ":(": [":("],
    ":-)": [":-)"],
    "=3": ["=3"],
    ":))": [":))"],
    ":>": [":>"],
    ";p": [";p"],
    ":p": [":p"],
    "=[[": ["=[["],
    xDD: ["xDD"],
    "<333": ["<333"],
    "<33": ["<33"],
    ":P": [":P"],
    "o.O": ["o.O"],
    "<3": ["<3"],
    ";-)": [";-)"],
    ":)": [":)"],
    "-_-": ["-_-"],
    ":')": [":')"],
    o_O: ["o_O"],
    ";)": [";)"],
    "=]": ["=]"],
    "(=": ["(="],
    "-__-": ["-__-"],
    ":/": [":/"],
    ":0": [":0"],
    "(^_^)": ["(^_^)"],
    ";D": [";D"],
    o_o: ["o_o"],
    ":((": [":(("],
    "=)": ["=)"]
  };
});

// node_modules/@stdlib/nlp-tokenize/lib/contractions.json
var require_contractions = __commonJS((exports, module) => {
  module.exports = {
    "'s": ["'s"],
    "'S": ["'S"],
    "ain't": ["ai", "n't"],
    aint: ["ai", "nt"],
    "Ain't": ["Ai", "n't"],
    "aren't": ["are", "n't"],
    arent: ["are", "nt"],
    "Aren't": ["Are", "n't"],
    "can't": ["ca", "n't"],
    cant: ["ca", "nt"],
    "Can't": ["Ca", "n't"],
    "can't've": ["ca", "n't", "'ve"],
    "'cause": ["'cause'"],
    cannot: ["can", "not"],
    Cannot: ["Can", "not"],
    "could've": ["could", "'ve"],
    couldve: ["could", "ve"],
    "Could've": ["Could", "'ve"],
    "couldn't": ["could", "n't"],
    couldnt: ["could", "nt"],
    "Couldn't": ["Could", "n't"],
    "couldn't've": ["could", "n't", "'ve"],
    couldntve: ["could", "nt", "ve"],
    "Couldn't've": ["Could", "n't", "'ve"],
    "didn't": ["did", "n't"],
    didnt: ["did", "nt"],
    "Didn't": ["Did", "n't"],
    "doesn't": ["does", "n't"],
    doesnt: ["does", "nt"],
    "Doesn't": ["Does", "n't"],
    "don't": ["do", "n't"],
    dont: ["do", "nt"],
    "Don't": ["Do", "n't"],
    "hadn't": ["had", "n't"],
    hadnt: ["had", "nt"],
    "Hadn't": ["Had", "n't"],
    "hadn't've": ["had", "n't", "'ve"],
    "hasn't": ["has", "n't"],
    hasnt: ["has", "nt"],
    "haven't": ["have", "n't"],
    havent: ["have", "nt"],
    "he'd": ["he", "'d"],
    hed: ["he", "d"],
    "he'd've": ["he", "'d", "'ve"],
    hedve: ["he", "d", "ve"],
    "he'll": ["he", "'ll"],
    "he'll've": ["he", "'ll", "'ve"],
    "he's": ["he", "'s"],
    hes: ["he", "s"],
    "how'd": ["how", "'d"],
    howd: ["how", "d"],
    "how'd'y": ["how", "'d", "'y"],
    "how'll": ["how", "'ll"],
    howll: ["how", "ll"],
    "how's": ["how", "'s"],
    hows: ["how", "s"],
    "I'd": ["I", "'d"],
    "I'd've": ["I", "'d", "'ve"],
    "I'll": ["I", "'ll"],
    "i'll": ["i", "'ll"],
    "I'll've": ["I", "'ll", "'ve"],
    "i'll've": ["i", "'ll", "'ve"],
    "I'm": ["I", "'m"],
    "i'm": ["i", "'m"],
    Im: ["I", "m"],
    im: ["i", "m"],
    "I'ma": ["I", "'ma"],
    "i'ma": ["i", "'ma"],
    "I've": ["I", "'ve"],
    "i've": ["i", "'ve"],
    "isn't": ["is", "n't"],
    isnt: ["is", "nt"],
    "Isn't": ["Is", "n't"],
    "It'd": ["It", "'d"],
    "it'd": ["it", "'d"],
    "it'd've": ["it", "'d", "'ve"],
    "it'll've": ["it", "'ll", "'ve"],
    "it'll": ["it", "'ll"],
    itll: ["it", "ll"],
    "it's": ["it", "'s"],
    "let's": ["let", "'s"],
    lets: ["let", "s"],
    "ma'am": ["ma'am"],
    "mayn't": ["may", "n't"],
    "mightn't": ["might", "n't"],
    "mightn't've": ["might", "n't", "'ve"],
    "might've": ["might", "'ve"],
    "mustn't": ["must", "n't"],
    "mustn't've": ["must", "n't", "'ve"],
    "must've": ["must", "'ve"],
    "needn't": ["need", "n't"],
    "needn't've": ["need", "n't", "'ve"],
    "not've": ["not", "'ve"],
    "o'clock": ["o'clock"],
    "oughtn't": ["ought", "n't"],
    "oughtn't've": ["ought", "n't", "'ve"],
    "so've": ["so", "'ve"],
    "so's": ["so", "'s"],
    "shan't": ["sha", "n't"],
    "sha'n't": ["sha'", "n't"],
    "shan't've": ["sha", "n't", "'ve"],
    "she'd": ["she", "'d"],
    "she'd've": ["she", "'d", "'ve"],
    "she'll": ["she", "'ll"],
    "she'll've": ["she", "'ll", "'ve"],
    "she's": ["she", "'s"],
    "should've": ["should", "'ve"],
    "shouldn't": ["should", "n't"],
    "shouldn't've": ["should", "n't", "'ve"],
    "that'd": ["that", "'d"],
    "that'd've": ["that", "'d", "'ve"],
    "that's": ["that", "'s"],
    thats: ["that", "s"],
    "there'd": ["there", "'d"],
    "there'd've": ["there", "'d", "'ve"],
    "there's": ["there", "'s"],
    "they'd": ["they", "'d"],
    "They'd": ["They", "'d"],
    "they'd've": ["they", "'d", "'ve"],
    "They'd've": ["They", "'d", "'ve"],
    "they'll": ["they", "'ll"],
    "They'll": ["They", "'ll"],
    "they'll've": ["they", "'ll", "'ve"],
    "They'll've": ["They", "'ll", "'ve"],
    "they're": ["they", "'re"],
    "They're": ["They", "'re"],
    "they've": ["they", "'ve"],
    "They've": ["They", "'ve"],
    "to've": ["to", "'ve"],
    "wasn't": ["was", "n't"],
    "we'd": ["we", "'d"],
    "We'd": ["We", "'d"],
    "we'd've": ["we", "'d", "'ve"],
    "we'll": ["we", "'ll"],
    "We'll": ["We", "'ll"],
    "we'll've": ["we", "'ll", "'ve"],
    "We'll've": ["We", "'ll", "'ve"],
    "we're": ["we", "'re"],
    "We're": ["We", "'re"],
    "we've": ["we", "'ve"],
    "We've": ["We", "'ve"],
    "weren't": ["were", "n't"],
    "what'll": ["what", "'ll"],
    "what'll've": ["what", "'ll", "'ve"],
    "what're": ["what", "'re"],
    "what's": ["what", "'s"],
    "what've": ["what", "'ve"],
    "when's": ["when", "'s"],
    "when've": ["when", "'ve"],
    "where'd": ["where", "'d"],
    "where's": ["where", "'s"],
    "where've": ["where", "'ve"],
    "who'd": ["who", "'d"],
    "who'll": ["who", "'ll"],
    "who'll've": ["who", "'ll'", "'ve'"],
    "who're": ["who", "'re"],
    "who's": ["who", "'s"],
    "who've": ["who", "'ve"],
    "why've": ["why", "'ve"],
    "why'll": ["why", "'ll"],
    "why're": ["why", "'re"],
    "why's": ["why", "'s"],
    "will've": ["will", "'ve"],
    "won't": ["wo", "n't"],
    wont: ["wo", "nt"],
    "won't've": ["wo", "n't", "'ve"],
    "would've": ["would", "'ve"],
    "wouldn't": ["would", "n't"],
    "wouldn't've": ["would", "n't", "'ve"],
    "y'all": ["y'", "all"],
    "y'all'd": ["y'", "all", "'d"],
    "y'all'd've": ["y'", "all", "'d", "'ve"],
    "y'all're": ["y'", "all", "'re'"],
    "y'all've": ["y'", "all", "ve"],
    "you'd": ["you", "'d"],
    "You'd": ["You", "'d"],
    "you'd've": ["you", "'d", "'ve"],
    "You'd've": ["You", "'d", "'ve"],
    "you'll": ["you", "'ll"],
    "You'll": ["You", "'ll"],
    "you'll've": ["you", "'ll", "'ve"],
    "You'll've": ["You", "'ll", "'ve"],
    "you're": ["you", "'re"],
    "You're": ["You", "'re"],
    "you've": ["you", "'ve"],
    "You've": ["You", "'ve"]
  };
});

// node_modules/@stdlib/nlp-tokenize/lib/main.js
var require_main13 = __commonJS((exports, module) => {
  var extend = function(arr, ext) {
    var i;
    for (i = 0;i < ext.length; i++) {
      arr.push(ext[i]);
    }
    return arr;
  };
  var tokenizeSubstring = function(substr) {
    var prefixes = [];
    var suffixes = [];
    var match;
    var done;
    var res;
    do {
      if (!EMOJIS[substr] && !ABBRS[substr] && !CONTRACT[substr]) {
        match = substr.split(REGEXP_PREFIXES);
        if (match.length > 1) {
          prefixes.push(match[1]);
          substr = match[2];
        } else {
          match = substr.split(REGEXP_SUFFIXES);
          if (match.length > 1) {
            substr = match[0];
            suffixes.unshift(match[1]);
          } else {
            done = true;
          }
        }
      } else {
        done = true;
      }
    } while (!done);
    res = prefixes;
    if (substr) {
      res.push(substr);
    }
    if (suffixes[suffixes.length - 1] === "...") {
      suffixes.pop();
      suffixes.unshift("...");
    }
    extend(res, suffixes);
    return res;
  };
  var tokenize = function(str, keepWhitespace) {
    var subtkns;
    var substrs;
    var tokens;
    var substr;
    var cache;
    var i;
    if (!isString(str)) {
      throw new TypeError(format("invalid argument. First argument must be a string. Value: `%s`.", str));
    }
    if (arguments.length > 1) {
      if (!isBoolean(keepWhitespace)) {
        throw new TypeError(format("invalid argument. Second argument must be a boolean. Value: `%s`.", keepWhitespace));
      }
    }
    if (!str) {
      return [];
    }
    if (keepWhitespace) {
      substrs = str.split(/(\s+)/);
    } else {
      substrs = str.split(/\s+/);
    }
    cache = {};
    tokens = [];
    for (i = 0;i < substrs.length; i++) {
      substr = substrs[i];
      if (hasOwnProp(cache, substr)) {
        extend(tokens, cache[substr]);
      } else {
        subtkns = tokenizeSubstring(substr);
        extend(tokens, subtkns);
        cache[substr] = subtkns;
      }
    }
    return tokens;
  };
  var isBoolean = require_lib13().isPrimitive;
  var isString = require_lib11().isPrimitive;
  var hasOwnProp = require_lib8();
  var format = require_lib3();
  var ABBRS = require_abbreviations();
  var EMOJIS = require_emojis();
  var CONTRACT = require_contractions();
  var REGEXP_PREFIXES = /^([,([{*<"“'`‘]|\.{1,3})/gi;
  var REGEXP_SUFFIXES = /([,.!?%*>:;"'”`)\]}]|\.\.\.)$/gi;
  module.exports = tokenize;
});

// node_modules/@stdlib/nlp-tokenize/lib/index.js
var require_lib14 = __commonJS((exports, module) => {
  var main = require_main13();
  module.exports = main;
});

// node_modules/@stdlib/string-base-trim/lib/has_builtin.js
var require_has_builtin = __commonJS((exports, module) => {
  var bool = typeof String.prototype.trim !== "undefined";
  module.exports = bool;
});

// node_modules/@stdlib/string-base-trim/lib/builtin.js
var require_builtin2 = __commonJS((exports, module) => {
  var trim = String.prototype.trim;
  module.exports = trim;
});

// node_modules/@stdlib/string-base-trim/lib/check.js
var require_check = __commonJS((exports, module) => {
  var test = function() {
    return trim.call(str1) === "" && trim.call(str2) === str2;
  };
  var trim = require_builtin2();
  var str1 = ` 
	\r
\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF`;
  var str2 = "\u180E";
  module.exports = test;
});

// node_modules/@stdlib/string-base-replace/lib/main.js
var require_main14 = __commonJS((exports, module) => {
  var replace = function(str, search, newval) {
    return str.replace(search, newval);
  };
  module.exports = replace;
});

// node_modules/@stdlib/string-base-replace/lib/index.js
var require_lib15 = __commonJS((exports, module) => {
  var main = require_main14();
  module.exports = main;
});

// node_modules/@stdlib/string-base-trim/lib/polyfill.js
var require_polyfill3 = __commonJS((exports, module) => {
  var trim = function(str) {
    return replace(str, RE, "$1");
  };
  var replace = require_lib15();
  var RE = /^[\u0020\f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*([\S\s]*?)[\u0020\f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*$/;
  module.exports = trim;
});

// node_modules/@stdlib/string-base-trim/lib/main.js
var require_main15 = __commonJS((exports, module) => {
  var trim = function(str) {
    return builtin.call(str);
  };
  var builtin = require_builtin2();
  module.exports = trim;
});

// node_modules/@stdlib/string-base-trim/lib/index.js
var require_lib16 = __commonJS((exports, module) => {
  var HAS_BUILTIN = require_has_builtin();
  var check = require_check();
  var polyfill = require_polyfill3();
  var main = require_main15();
  var trim;
  if (HAS_BUILTIN && check()) {
    trim = main;
  } else {
    trim = polyfill;
  }
  module.exports = trim;
});

// node_modules/@stdlib/nlp-sentencize/lib/main.js
var require_main16 = __commonJS((exports, module) => {
  var isEndOfSentence = function(tokens, i) {
    var token;
    var im1 = i - 1;
    var ip1 = i + 1;
    token = tokens[i];
    if (token === "." && !RE_CAPITALIZED.test(tokens[im1]) && !RE_CAPITALIZED_PERIOD.test(tokens[im1]) && !RE_NUMBER.test(tokens[im1]) && !RE_PREFIXES.test(tokens[im1]) && !RE_SUFFIXES.test(tokens[ip1])) {
      return true;
    }
    if ((token === "!" || token === "?") && !RE_PREFIXES.test(tokens[im1]) && !RE_SUFFIXES.test(tokens[ip1])) {
      return true;
    }
    if (RE_SUFFIXES.test(token) && (tokens[im1] === "." || tokens[im1] === "!" || tokens[im1] === "?")) {
      return true;
    }
    return false;
  };
  var sentencize = function(str) {
    var current;
    var tokens;
    var out;
    var i;
    if (!isString(str)) {
      throw new TypeError("invalid argument. Must provide a string. Value: `" + str + "`.");
    }
    tokens = tokenize(str, true);
    current = "";
    out = [];
    for (i = 0;i < tokens.length; i++) {
      current += tokens[i];
      if (isEndOfSentence(tokens, i)) {
        out.push(trim(current));
        current = "";
      }
    }
    if (current !== "") {
      out.push(trim(current));
    }
    return out;
  };
  var isString = require_lib11().isPrimitive;
  var tokenize = require_lib14();
  var trim = require_lib16();
  var RE_CAPITALIZED = /^[A-Z][a-z]{0,4}$/;
  var RE_CAPITALIZED_PERIOD = /^([A-Z]\.)*[A-Z]$/;
  var RE_NUMBER = /^[0-9]$/;
  var RE_PREFIXES = /^[{[(<:;"'”`]/;
  var RE_SUFFIXES = /[})\]>:;"'”`]$/;
  module.exports = sentencize;
});

// node_modules/@stdlib/nlp-sentencize/lib/index.js
var require_lib17 = __commonJS((exports, module) => {
  var main = require_main16();
  module.exports = main;
});

// src/index.ts
import fs2 from "fs";

// node_modules/ollama/dist/shared/ollama.be8fd0da.mjs
var import_whatwg_fetch = __toESM(require_fetch_umd(), 1);
var getPlatform = function() {
  if (typeof window !== "undefined" && window.navigator) {
    return `${window.navigator.platform.toLowerCase()} Browser/${navigator.userAgent};`;
  } else if (typeof process !== "undefined") {
    return `${process.arch} ${process.platform} Node.js/${process.version}`;
  }
  return "";
};
var version = "0.5.0";

class ResponseError extends Error {
  constructor(error, status_code) {
    super(error);
    this.error = error;
    this.status_code = status_code;
    this.name = "ResponseError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
  }
}
var checkOk = async (response) => {
  if (!response.ok) {
    let message = `Error ${response.status}: ${response.statusText}`;
    let errorData = null;
    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        errorData = await response.json();
        message = errorData.error || message;
      } catch (error) {
        console.log("Failed to parse error response as JSON");
      }
    } else {
      try {
        console.log("Getting text from response");
        const textResponse = await response.text();
        message = textResponse || message;
      } catch (error) {
        console.log("Failed to get text from error response");
      }
    }
    throw new ResponseError(message, response.status);
  }
};
var fetchWithHeaders = async (fetch2, url, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": `ollama-js/${version} (${getPlatform()})`
  };
  if (!options.headers) {
    options.headers = {};
  }
  options.headers = {
    ...defaultHeaders,
    ...options.headers
  };
  return fetch2(url, options);
};
var get = async (fetch2, host) => {
  const response = await fetchWithHeaders(fetch2, host);
  await checkOk(response);
  return response;
};
var head = async (fetch2, host) => {
  const response = await fetchWithHeaders(fetch2, host, {
    method: "HEAD"
  });
  await checkOk(response);
  return response;
};
var post = async (fetch2, host, data, options) => {
  const isRecord = (input) => {
    return input !== null && typeof input === "object" && !Array.isArray(input);
  };
  const formattedData = isRecord(data) ? JSON.stringify(data) : data;
  const response = await fetchWithHeaders(fetch2, host, {
    method: "POST",
    body: formattedData,
    signal: options?.signal
  });
  await checkOk(response);
  return response;
};
var del = async (fetch2, host, data) => {
  const response = await fetchWithHeaders(fetch2, host, {
    method: "DELETE",
    body: JSON.stringify(data)
  });
  await checkOk(response);
  return response;
};
var parseJSON = async function* (itr) {
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const reader = itr.getReader();
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(chunk);
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      try {
        yield JSON.parse(part);
      } catch (error) {
        console.warn("invalid json: ", part);
      }
    }
  }
  for (const part of buffer.split("\n").filter((p) => p !== "")) {
    try {
      yield JSON.parse(part);
    } catch (error) {
      console.warn("invalid json: ", part);
    }
  }
};
var formatHost = (host) => {
  if (!host) {
    return "http://127.0.0.1:11434";
  }
  let isExplicitProtocol = host.includes("://");
  if (host.startsWith(":")) {
    host = `http://127.0.0.1${host}`;
    isExplicitProtocol = false;
  }
  if (!isExplicitProtocol) {
    host = `http://${host}`;
  }
  const url = new URL(host);
  let port = url.port;
  if (!port) {
    if (!isExplicitProtocol) {
      port = "11434";
    } else {
      port = url.protocol === "https:" ? "443" : "80";
    }
  }
  let formattedHost = `${url.protocol}//${url.hostname}:${port}${url.pathname}`;
  if (formattedHost.endsWith("/")) {
    formattedHost = formattedHost.slice(0, -1);
  }
  return formattedHost;
};
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var Ollama$1 = class Ollama {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "fetch");
    __publicField(this, "abortController");
    this.config = {
      host: ""
    };
    if (!config?.proxy) {
      this.config.host = formatHost(config?.host ?? "http://127.0.0.1:11434");
    }
    this.fetch = fetch;
    if (config?.fetch != null) {
      this.fetch = config.fetch;
    }
    this.abortController = new AbortController;
  }
  abort() {
    this.abortController.abort();
    this.abortController = new AbortController;
  }
  async processStreamableRequest(endpoint, request) {
    request.stream = request.stream ?? false;
    const response = await post(this.fetch, `${this.config.host}/api/${endpoint}`, {
      ...request
    }, { signal: this.abortController.signal });
    if (!response.body) {
      throw new Error("Missing body");
    }
    const itr = parseJSON(response.body);
    if (request.stream) {
      return async function* () {
        for await (const message of itr) {
          if ("error" in message) {
            throw new Error(message.error);
          }
          yield message;
          if (message.done || message.status === "success") {
            return;
          }
        }
        throw new Error("Did not receive done or success response in stream.");
      }();
    } else {
      const message = await itr.next();
      if (!message.value.done && message.value.status !== "success") {
        throw new Error("Expected a completed response.");
      }
      return message.value;
    }
  }
  async encodeImage(image) {
    if (typeof image !== "string") {
      const uint8Array = new Uint8Array(image);
      const numberArray = Array.from(uint8Array);
      const base64String = btoa(String.fromCharCode.apply(null, numberArray));
      return base64String;
    }
    return image;
  }
  async generate(request) {
    if (request.images) {
      request.images = await Promise.all(request.images.map(this.encodeImage.bind(this)));
    }
    return this.processStreamableRequest("generate", request);
  }
  async chat(request) {
    if (request.messages) {
      for (const message of request.messages) {
        if (message.images) {
          message.images = await Promise.all(message.images.map(this.encodeImage.bind(this)));
        }
      }
    }
    return this.processStreamableRequest("chat", request);
  }
  async create(request) {
    return this.processStreamableRequest("create", {
      name: request.model,
      stream: request.stream,
      modelfile: request.modelfile
    });
  }
  async pull(request) {
    return this.processStreamableRequest("pull", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  async push(request) {
    return this.processStreamableRequest("push", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  async delete(request) {
    await del(this.fetch, `${this.config.host}/api/delete`, {
      name: request.model
    });
    return { status: "success" };
  }
  async copy(request) {
    await post(this.fetch, `${this.config.host}/api/copy`, { ...request });
    return { status: "success" };
  }
  async list() {
    const response = await get(this.fetch, `${this.config.host}/api/tags`);
    const listResponse = await response.json();
    return listResponse;
  }
  async show(request) {
    const response = await post(this.fetch, `${this.config.host}/api/show`, {
      ...request
    });
    const showResponse = await response.json();
    return showResponse;
  }
  async embeddings(request) {
    const response = await post(this.fetch, `${this.config.host}/api/embeddings`, {
      ...request
    });
    const embeddingsResponse = await response.json();
    return embeddingsResponse;
  }
};
var browser = new Ollama$1;

// node_modules/ollama/dist/index.mjs
var import_whatwg_fetch2 = __toESM(require_fetch_umd(), 1);
import fs, {promises, createReadStream} from "fs";
import {resolve, join, dirname} from "path";
import {createHash} from "crypto";
import {homedir} from "os";

class Ollama2 extends Ollama$1 {
  async encodeImage(image) {
    if (typeof image !== "string") {
      const result = Buffer.from(image).toString("base64");
      return result;
    }
    try {
      if (fs.existsSync(image)) {
        const fileBuffer = await promises.readFile(resolve(image));
        return Buffer.from(fileBuffer).toString("base64");
      }
    } catch {
    }
    return image;
  }
  async parseModelfile(modelfile, mfDir = process.cwd()) {
    const out = [];
    const lines = modelfile.split("\n");
    for (const line of lines) {
      const [command, args] = line.split(" ", 2);
      if (["FROM", "ADAPTER"].includes(command.toUpperCase())) {
        const path = this.resolvePath(args.trim(), mfDir);
        if (await this.fileExists(path)) {
          out.push(`${command} @${await this.createBlob(path)}`);
        } else {
          out.push(`${command} ${args}`);
        }
      } else {
        out.push(line);
      }
    }
    return out.join("\n");
  }
  resolvePath(inputPath, mfDir) {
    if (inputPath.startsWith("~")) {
      return join(homedir(), inputPath.slice(1));
    }
    return resolve(mfDir, inputPath);
  }
  async fileExists(path) {
    try {
      await promises.access(path);
      return true;
    } catch {
      return false;
    }
  }
  async createBlob(path) {
    if (typeof ReadableStream === "undefined") {
      throw new Error("Streaming uploads are not supported in this environment.");
    }
    const fileStream = createReadStream(path);
    const sha256sum = await new Promise((resolve2, reject) => {
      const hash = createHash("sha256");
      fileStream.on("data", (data) => hash.update(data));
      fileStream.on("end", () => resolve2(hash.digest("hex")));
      fileStream.on("error", reject);
    });
    const digest = `sha256:${sha256sum}`;
    try {
      await head(this.fetch, `${this.config.host}/api/blobs/${digest}`);
    } catch (e) {
      if (e instanceof Error && e.message.includes("404")) {
        const readableStream = new ReadableStream({
          start(controller) {
            fileStream.on("data", (chunk) => {
              controller.enqueue(chunk);
            });
            fileStream.on("end", () => {
              controller.close();
            });
            fileStream.on("error", (err) => {
              controller.error(err);
            });
          }
        });
        await post(this.fetch, `${this.config.host}/api/blobs/${digest}`, readableStream);
      } else {
        throw e;
      }
    }
    return digest;
  }
  async create(request) {
    let modelfileContent = "";
    if (request.path) {
      modelfileContent = await promises.readFile(request.path, { encoding: "utf8" });
      modelfileContent = await this.parseModelfile(modelfileContent, dirname(request.path));
    } else if (request.modelfile) {
      modelfileContent = await this.parseModelfile(request.modelfile);
    } else {
      throw new Error("Must provide either path or modelfile to create a model");
    }
    request.modelfile = modelfileContent;
    if (request.stream) {
      return super.create(request);
    } else {
      return super.create(request);
    }
  }
}
var index = new Ollama2;

// src/index.ts
var nlp_sentencize = __toESM(require_lib17(), 1);
import {createHash as createHash2} from "crypto";
async function getFileNames(filepath, namePattern, sortFunction = (a, b) => a.localeCompare(b)) {
  const outFiles = [];
  fs2.readdir(filepath, (err, files) => {
    if (err) {
      return `Unable to scan directory: ${err}`;
    }
    files.forEach((file) => {
      outFiles.push(file);
    });
  });
  return outFiles.sort(sortFunction);
}
function chunkTextBySentences(sourceText, sentencesPerChunk, overlap) {
  if (sentencesPerChunk < 2) {
    throw new Error("The number of sentences per chunk must be 2 or more.");
  }
  if (overlap < 0 || overlap >= sentencesPerChunk - 1) {
    throw new Error("Overlap must be 0 or more and less than the number of sentences per chunk.");
  }
  const sentences = nlp_sentencize.default(sourceText);
  if (!sentences) {
    console.log("Nothing to chunk");
    return [];
  }
  const chunks = [];
  let i = 0;
  while (i < sentences.length) {
    let end = Math.min(i + sentencesPerChunk, sentences.length);
    let chunk = sentences.slice(i, end).join(" ");
    if (overlap > 0 && i > 1) {
      const overlapStart = Math.max(0, i - overlap);
      const overlapEnd = i;
      const overlapChunk = sentences.slice(overlapStart, overlapEnd).join(" ");
      chunk = overlapChunk + " " + chunk;
    }
    chunks.push(chunk.trim());
    i += sentencesPerChunk;
  }
  return chunks;
}
async function latestModelGetter(modelName) {
  let [repo, tag] = modelName.split(":");
  const localModels = (await index.list()).models.map((m) => ({ name: m.name, digest: m.digest }));
  if (!repo.includes("/")) {
    repo = `library/${repo}`;
  }
  const localdigest = localModels.find((m) => m.name === modelName)?.digest;
  if (localdigest) {
    const remoteModelInfo = await fetch(`https://ollama.ai/v2/${repo}/manifests/${tag}`, {
      headers: {
        Accept: "application/vnd.docker.distribution.manifest.v2+json"
      }
    });
    if (remoteModelInfo.status === 200) {
      const remoteModelInfoJson = await remoteModelInfo.json();
      const hash = await jsonhash(remoteModelInfoJson);
      if (localdigest !== hash) {
        await index.pull({ model: modelName, stream: false });
      }
    }
  } else {
    await index.pull({ model: modelName, stream: false });
  }
}
async function jsonhash(json) {
  const jsonstring = JSON.stringify(json).replace(/\s+/g, "");
  const hash = createHash2("sha256");
  hash.update(jsonstring);
  const hexString = hash.digest("hex");
  return hexString;
}
export {
  latestModelGetter,
  jsonhash,
  getFileNames,
  chunkTextBySentences
};
