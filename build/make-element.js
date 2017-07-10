(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
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
    // nothing special here
    return val;
}
function makeElement(def = {}) {
    const props = def.props;
    // whether the connectedCallback has been run
    let hasConnected = false;
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
        let toAttr = identity;
        if (typeof propDef.toAttr === 'function') {
            // this === element instance
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
    const DefinableCustomElement = class extends HTMLElement {
        constructor() {
            super();
            readyFn = readyFn.bind(this);
            for (const propName of Object.keys(registeredProps)) {
                // convenience aliases
                const internalProp = registeredProps[propName];
                const hasLinkedAttr = typeof internalProp.attr === 'string';
                const attrName = internalProp.attr;
                const internalAttr = registeredAttrs[attrName];
                // bind property methods to element context
                internalProp.toAttr = internalProp.toAttr.bind(this);
                internalProp.fromAttr = internalProp.fromAttr.bind(this);
                internalProp.get = internalProp.get.bind(this);
                internalProp.set = internalProp.set.bind(this);
                internalProp.coerce = internalProp.coerce.bind(this);
                Object.defineProperty(this, propName, {
                    set(val) {
                        let propVal = val;
                        // we don't coerce the user-defined initial value from the attribute
                        if (!internalProp.settingInitialValue) {
                            propVal = internalProp.coerce(val);
                        }
                        else {
                            internalProp.settingInitialValue = false;
                        }
                        internalProp.val = propVal;
                        internalProp.set(propVal);
                        /*
                        We only propagate from the property to the attribute if:
                            - There is an attribute to propagate to
                            - It is not the case where the property has not
                            propagated and yet the attribute exists

                        In the latter case the attribute has already been
                        defined in the markup, so there is no need to propagate
                        the property's value. Instead, the attribute value
                        should propagate to the property in
                        attributeChangedCallback.
                        */
                        const beingInitialized = (this.hasAttribute(attrName)
                            && !internalProp.hasSet);
                        if (hasLinkedAttr && !beingInitialized) {
                            const attrVal = internalProp.toAttr(propVal);
                            // prevent the attribute from reflowing back to the
                            // property in attributeChangedCallback
                            internalAttr.needsPropagation = false;
                            // invoke attributeChangedCallback
                            this.setAttribute(attrName, attrVal);
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
            if (hasConnected) {
                return;
            }
            // only run once
            for (const propName of Object.keys(props)) {
                const internalProp = registeredProps[propName];
                if (internalProp.val !== undefined
                    && internalProp.val !== null
                    && !internalProp.hasSet) {
                    internalProp.settingInitialValue = true;
                    // kick off property setter
                    this[propName] = internalProp.val;
                }
            }
            // invoke ready function with element context
            readyFn.call(this);
            hasConnected = true;
        }
        attributeChangedCallback(attrName, oldVal, val) {
            // only do work if the new value differs
            if (val !== oldVal) {
                // convenience aliases
                const internalAttr = registeredAttrs[attrName];
                internalAttr.val = val;
                if (internalAttr.needsPropagation) {
                    // propagation should only occur once
                    internalAttr.needsPropagation = false;
                    const propName = internalAttr.propName;
                    const internalProp = registeredProps[propName];
                    const propVal = internalProp.fromAttr(val);
                    this[propName] = propVal;
                }
            }
        }
        static get observedAttributes() {
            // required for attributeChangedCallback to be called
            return observedAttrs;
        }
    };
    for (const fnName of Object.keys(def.methods)) {
        const fn = def.methods[fnName];
        if (typeof fn !== 'function') {
            throw new TypeError(`${fnName} must be a function (got ${fn})`);
        }
        DefinableCustomElement.prototype[fnName] = fn;
    }
    return DefinableCustomElement;
}
/* harmony default export */ __webpack_exports__["default"] = (makeElement);


/***/ })
/******/ ]);
});