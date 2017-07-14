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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["makeElement"] = factory();
	else
		root["makeElement"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
// utility functions
function noop() { }
function consume(val) { }
function identity(val) {
    return val;
}
function convertToBoolAttr(val) {
    if (Boolean(val)) {
        return '';
    }
    else {
        return undefined;
    }
}
function makeElement(def = {}) {
    const props = def.props || {};
    const methods = def.methods || {};
    let readyFn = noop;
    if (typeof def.ready === 'function') {
        readyFn = def.ready;
    }
    // used to keep track of registered properties/attributes
    const registeredProps = {};
    const registeredAttrs = {};
    // we need to access the property name through Object.keys
    for (const propName of Object.keys(props)) {
        // populated registeredProps/Attrs objects
        const propDef = props[propName];
        let val = null;
        if (propDef.init !== undefined) {
            // initial value for the property
            val = propDef.init;
        }
        let hasAttr = typeof propDef.attr === 'string';
        let attrName = null;
        if (hasAttr) {
            attrName = propDef.attr;
            // register attribute internally
            registeredAttrs[attrName] = {
                // internal value
                val: null,
                // linked property name
                propName,
                // whether the attribute needs to be propagated to the
                // property
                needsPropagation: true,
            };
        }
        let boolAttr = false;
        if (typeof propDef.boolAttr === 'boolean') {
            boolAttr = propDef.boolAttr;
        }
        let toAttr = identity;
        if (boolAttr) {
            toAttr = convertToBoolAttr;
        }
        else if (typeof propDef.toAttr === 'function') {
            toAttr = propDef.toAttr;
        }
        let fromAttr = identity;
        if (typeof propDef.fromAttr === 'function') {
            fromAttr = propDef.fromAttr;
        }
        let get = identity;
        if (typeof propDef.get === 'function') {
            get = propDef.get;
        }
        let set = consume;
        if (typeof propDef.set === 'function') {
            set = propDef.set;
        }
        let coerce = identity;
        if (typeof propDef.coerce === 'function') {
            coerce = propDef.coerce;
        }
        registeredProps[propName] = {
            // internal value
            val,
            // linked attribute name
            attr: attrName,
            boolAttr,
            // function used to produce an attribute value from a
            // property value
            toAttr,
            // function used to produce a property value from an
            // attribute value
            fromAttr,
            // getter function
            get,
            // setter function
            set,
            // function to modify the value passed to the setter function
            coerce,
            // if the property has been set before
            hasSet: false,
        };
    }
    const observedAttrs = Object.keys(registeredAttrs);
    const DefinableCustomElement = (_a = class extends HTMLElement {
            constructor() {
                super();
                this._hasConnected = false;
                this._readyFn = readyFn;
                this._props = registeredProps;
                this._attrs = registeredAttrs;
                for (const propName of Object.keys(this._props)) {
                    // convenience aliases
                    const internalProp = this._props[propName];
                    const hasLinkedAttr = typeof internalProp.attr === 'string';
                    const attrName = internalProp.attr;
                    const internalAttr = this._attrs[attrName];
                    // bind property methods to element context
                    internalProp.toAttr = internalProp.toAttr.bind(this);
                    internalProp.fromAttr = internalProp.fromAttr.bind(this);
                    internalProp.get = internalProp.get.bind(this);
                    internalProp.set = internalProp.set.bind(this);
                    internalProp.coerce = internalProp.coerce.bind(this);
                    Object.defineProperty(this, propName, {
                        set(val) {
                            let propVal = val;
                            propVal = internalProp.coerce(propVal);
                            if (internalProp.settingInitialValue) {
                                internalProp.settingInitialValue = false;
                            }
                            internalProp.val = propVal;
                            internalProp.set(propVal);
                            /*
                            We only propagate from the property to the attribute if:
                                - A linked attribute was defined
                                - The property setter is not being triggered by attributeChangedCallback
                            */
                            const beingInitialized = (this.hasAttribute(attrName)
                                && !internalProp.hasSet);
                            if (hasLinkedAttr && !beingInitialized) {
                                const attrVal = internalProp.toAttr(propVal);
                                // prevent the attribute from reflowing back to the
                                // property in attributeChangedCallback
                                internalAttr.needsPropagation = false;
                                if (attrVal !== undefined) {
                                    // invoke attributeChangedCallback
                                    this.setAttribute(attrName, attrVal);
                                }
                                else {
                                    this.removeAttribute(attrName);
                                }
                            }
                            internalProp.hasSet = true;
                        },
                        get() {
                            const propVal = internalProp.get(internalProp.val);
                            return propVal;
                        },
                    });
                }
                // insert element template
                const hasLocalTemplate = typeof def.template === 'string';
                const hasRemoteTemplate = typeof def.templateUrl === 'string';
                if (def.shadowDom) {
                    this.attachShadow({ mode: 'open' });
                }
                if (hasLocalTemplate) {
                    if (def.shadowDom) {
                        this.shadowRoot.innerHTML = def.template;
                    }
                    else {
                        this.innerHTML = def.template;
                    }
                }
                else if (hasRemoteTemplate) {
                    fetch(def.templateUrl).then((resp) => {
                        if (resp.ok) {
                            // 200 OK
                            return resp.text();
                        }
                        else {
                            // 404 et al
                            throw new Error(`Couldn't fetch template at ${def.templateUrl}. ` +
                                `Got HTTP status code ${status}`);
                        }
                    }).then((template) => {
                        if (def.shadowDom) {
                            this.shadowRoot.innerHTML = template;
                        }
                        else {
                            this.innerHTML = template;
                        }
                    });
                }
                // id caching enabled by default
                if (def.cacheIds !== false) {
                    this.$ = {};
                    let elsWithIds;
                    if (def.shadowDom) {
                        elsWithIds = this.shadowRoot.querySelectorAll('[id]');
                    }
                    else {
                        elsWithIds = this.querySelectorAll('[id]');
                    }
                    for (const el of elsWithIds) {
                        const castEl = el;
                        this.$[castEl.id] = castEl;
                    }
                }
            }
            connectedCallback() {
                if (this._hasConnected) {
                    return;
                }
                // only run once
                for (const propName of Object.keys(this._props)) {
                    const internalProp = this._props[propName];
                    // if there is a value but the setter has not run
                    if (internalProp.val !== undefined
                        && internalProp.val !== null
                        && !internalProp.hasSet) {
                        internalProp.settingInitialValue = true;
                        // kick off property setter
                        this[propName] = internalProp.val;
                    }
                }
                this._readyFn();
                this._hasConnected = true;
            }
            attributeChangedCallback(attrName, oldVal, val) {
                // only do work if the new value differs
                if (val !== oldVal) {
                    // convenience aliases
                    const internalAttr = this._attrs[attrName];
                    internalAttr.val = val;
                    if (internalAttr.needsPropagation) {
                        // propagation should only occur once
                        internalAttr.needsPropagation = false;
                        const propName = internalAttr.propName;
                        const internalProp = this._props[propName];
                        const propVal = internalProp.fromAttr(val);
                        this[propName] = propVal;
                    }
                }
            }
        },
        _a.observedAttributes = observedAttrs,
        _a);
    for (const fnName of Object.keys(methods)) {
        const fn = methods[fnName];
        if (typeof fn !== 'function') {
            throw new TypeError(`${fnName} must be a function (got ${fn})`);
        }
        DefinableCustomElement.prototype[fnName] = fn;
    }
    return DefinableCustomElement;
    var _a;
}
/* harmony default export */ __webpack_exports__["default"] = (makeElement);


/***/ })
/******/ ]);
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build_make_element_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build_make_element_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__build_make_element_js__);



const CounterElement = __WEBPACK_IMPORTED_MODULE_0__build_make_element_js___default()({
	props: {
		counter: {
			init: 1,
			set(counter) {
				console.log('counter: setting counter text content');
				this.$['counter'].textContent = counter;
			},
		},
	},

	methods: {
		increment() {
			console.log('counter: incrementing counter by 1');
			++this.counter;
		},
	},

	ready() {
		console.log('counter: setting click listener');
		this.$['increment-button'].onclick = () => { this.increment() };
	},

	shadowDom: true,
	template: `
	<div id="counter"></div>
	<button id="increment-button">Increment</button>
	`,
});

customElements.define('counter-element', CounterElement);


/***/ })
/******/ ]);