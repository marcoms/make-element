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

(function(a,b){ true?module.exports=b():'function'==typeof define&&define.amd?define([],b):'object'==typeof exports?exports.makeElement=b():a.makeElement=b()})(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.i=function(a){return a},b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=0)}([function(a,b){'use strict';function c(){}function d(){}function e(a){return a}Object.defineProperty(b,'__esModule',{value:!0}),b['default']=function(a={}){const b=a.props;let f=!1,g=c;'function'==typeof a.ready&&(g=a.ready);const h={},i={};for(const c of Object.keys(b)){const a=b[c];let f=null;a.init!==void 0&&(f=a.init);let g='string'==typeof a.attr,j=null;g&&(j=a.attr,i[j]={val:null,propName:c,needsPropagation:!0});let k=e;'function'==typeof a.toAttr&&(k=a.toAttr);let l=e;'function'==typeof a.fromAttr&&(l=a.fromAttr);let m=e;'function'==typeof a.get&&(m=a.get);let n=d;'function'==typeof a.set&&(n=a.set);let o=e;'function'==typeof a.coerce&&(o=a.coerce),h[c]={val:f,attr:j,toAttr:k,fromAttr:l,get:m,set:n,coerce:o,hasSet:!1}}const j=Object.keys(i),k=class extends HTMLElement{constructor(){super(),g=g.bind(this);for(const a of Object.keys(h)){const b=h[a],c='string'==typeof b.attr,d=b.attr,e=i[d];b.toAttr=b.toAttr.bind(this),b.fromAttr=b.fromAttr.bind(this),b.get=b.get.bind(this),b.set=b.set.bind(this),b.coerce=b.coerce.bind(this),Object.defineProperty(this,a,{set(a){let f=a;b.settingInitialValue?b.settingInitialValue=!1:f=b.coerce(a),b.val=f,b.set(f);const g=!b.hasSet&&this.hasAttribute(d);if(c&&!g){const a=b.toAttr(f);e.needsPropagation=!1,this.setAttribute(d,a)}b.hasSet=!0},get(){const a=b.get(b.val);return a}})}const b='string'==typeof a.template,c='string'==typeof a.templateUrl;if(a.shadowDom&&this.attachShadow({mode:'open'}),b?a.shadowDom?this.shadowRoot.innerHTML=a.template:this.innerHTML=a.template:c&&fetch(a.templateUrl).then((b)=>{if(b.ok)return b.text();throw new Error(`Couldn't fetch template at ${a.templateUrl}. `+`Got HTTP status code ${status}`)}).then((b)=>{a.shadowDom?this.shadowRoot.innerHTML=b:this.innerHTML=b}),!1!==a.cacheIds){console.log('caching ids'),this.$={};let b;b=a.shadowDom?this.shadowRoot.querySelectorAll('[id]'):this.querySelectorAll('[id]'),console.log(b);for(const a of b){const b=a;console.log('castEl',b),this.$[b.id]=b}}}connectedCallback(){if(!f){for(const a of Object.keys(b)){const b=h[a];void 0===b.val||null===b.val||b.hasSet||(b.settingInitialValue=!0,this[a]=b.val)}g.call(this),f=!0}}attributeChangedCallback(a,b,c){if(c!==b){const b=i[a];if(b.val=c,b.needsPropagation){console.log('setting prop'),b.needsPropagation=!1;const a=b.propName,d=h[a],e=d.fromAttr(c);this[a]=e}}}static get observedAttributes(){return j}};for(const b of Object.keys(a.methods)){const c=a.methods[b];if('function'!=typeof c)throw new TypeError(`${b} must be a function (got ${c})`);k.prototype[b]=c}return k}}])});

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