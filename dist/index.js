(function(a,b){'object'==typeof exports&&'undefined'!=typeof module?module.exports=b():'function'==typeof define&&define.amd?define(b):a.makeElement=b()})(this,function(){'use strict';function a(d){return d}function b(){}return function(d={}){const e=d.props;let f=!1,g=b;'function'==typeof d.ready&&(g=d.ready);const h={},i={};for(const l of Object.keys(e)){const m=e[l];let n=null;m.init!==void 0&&(n=m.init);let o='string'==typeof m.attr,p=null;o&&(p=m.attr,i[p]={val:null,prop:l,needsPropagation:!0});let q=a;'function'==typeof m.toAttr&&(q=m.toAttr);let r=a;'function'==typeof m.fromAttr&&(r=m.fromAttr);let s=a;'function'==typeof m.get&&(s=m.get);let t=a;'function'==typeof m.set&&(t=m.set),h[l]={val:n,attr:p,toAttr:q,fromAttr:r,get:s,set:t,hasSet:!1}}const j=Object.keys(i),k=class extends HTMLElement{constructor(){super(),g=g.bind(this);for(const n of Object.keys(h)){const o=h[n],p='string'==typeof o.attr,q=o.attr,r=i[q];o.toAttr=o.toAttr.bind(this),o.fromAttr=o.fromAttr.bind(this),o.get=o.get.bind(this),o.set=o.set.bind(this),Object.defineProperty(this,n,{set(s){const t=o.set(s);o.val=t;const u=!o.hasSet&&this.hasAttribute(q);if(p&&!u){const v=o.toAttr(t);r.needsPropagation=!1,this.setAttribute(q,v)}o.hasSet=!0},get(){const s=o.get(o.val);return s}})}const l='string'==typeof d.template,m='string'==typeof d.templateUrl;d.shadowDom&&this.attachShadow({mode:'open'}),l?d.shadowDom?this.shadowRoot.innerHTML=d.template:this.innerHTML=d.template:m&&fetch(d.templateUrl).then(n=>{if(n.ok)return n.text();throw new Error(`Couldn't fetch template at ${templateUrl}. `+`Got HTTP status code ${status}`)}).then(n=>{d.shadowDom?this.shadowRoot.innerHTML=n:this.innerHTML=n})}connectedCallback(){if(!f){for(const l of Object.keys(e)){const m=h[l];void 0===m.val||null===m.val||m.hasSet||(this[l]=m.val)}g.call(this),f=!0}}attributeChangedCallback(l,m,n){if(n!==m){const o=i[l],p=o.prop,q=h[p];if(o.val=n,o.needsPropagation){o.needsPropagation=!1;const r=q.fromAttr(n);this[p]=r}}}static get observedAttributes(){return j}};for(const l of Object.keys(d.methods)){const m=d.methods[l];if('function'!=typeof m)throw new TypeError(`${l} must be a function (got ${m})`);k.prototype[l]=m}return k}});
