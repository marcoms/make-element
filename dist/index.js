(function(a,b){'object'==typeof exports&&'undefined'!=typeof module?module.exports=b():'function'==typeof define&&define.amd?define(b):a.makeElement=b()})(this,function(){'use strict';function a(){}function b(h){return h}function c(h={}){const i=h.props;let j=!1,k=a;'function'==typeof h.ready&&(k=h.ready);const l={},m={};for(const p of Object.keys(i)){const q=i[p];let r=null;void 0!==q.init&&(r=q.init);let s='string'==typeof q.attr,t=null;s&&(t=q.attr,m[t]={val:null,prop:p,needsPropagation:!0});let u=b;'function'==typeof q.toAttr&&(u=q.toAttr);let v=b;'function'==typeof q.fromAttr&&(v=q.fromAttr);let w=b;'function'==typeof q.get&&(w=q.get);let x=a;'function'==typeof q.set&&(x=q.set);let y=b;'function'==typeof q.coerce&&(y=q.coerce),l[p]={val:r,attr:t,toAttr:u,fromAttr:v,get:w,set:x,coerce:y,hasSet:!1}}const n=Object.keys(m),o=class extends HTMLElement{constructor(){super(),k=k.bind(this);for(const r of Object.keys(l)){const s=l[r],t='string'==typeof s.attr,u=s.attr,v=m[u];s.toAttr=s.toAttr.bind(this),s.fromAttr=s.fromAttr.bind(this),s.get=s.get.bind(this),s.set=s.set.bind(this),s.coerce=s.coerce.bind(this),Object.defineProperty(this,r,{set(w){let x=w;s.settingInitialValue?s.settingInitialValue=!1:x=s.coerce(w),s.val=x,s.set(x);const y=!s.hasSet&&this.hasAttribute(u);if(t&&!y){const z=s.toAttr(x);v.needsPropagation=!1,this.setAttribute(u,z)}s.hasSet=!0},get(){const w=s.get(s.val);return w}})}const p='string'==typeof h.template,q='string'==typeof h.templateUrl;if(h.shadowDom&&this.attachShadow({mode:'open'}),p?h.shadowDom?this.shadowRoot.innerHTML=h.template:this.innerHTML=h.template:q&&fetch(h.templateUrl).then(r=>{if(r.ok)return r.text();throw new Error(`Couldn't fetch template at ${templateUrl}. `+`Got HTTP status code ${status}`)}).then(r=>{h.shadowDom?this.shadowRoot.innerHTML=r:this.innerHTML=r}),!1!==h.cacheIds){this.$={};let r=this;h.shadowDom&&(r=this.shadowRoot);const s=r.querySelectorAll('[id]');for(const t of s)this.$[t.id]=t}}connectedCallback(){if(!j){for(const p of Object.keys(i)){const q=l[p];void 0===q.val||null===q.val||q.hasSet||(q.settingInitialValue=!0,this[p]=q.val)}k.call(this),j=!0}}attributeChangedCallback(p,q,r){if(r!==q){const s=m[p];if(s.val=r,s.needsPropagation){s.needsPropagation=!1;const t=s.prop,u=l[t],v=u.fromAttr(r);this[t]=v}}}static get observedAttributes(){return n}};for(const p of Object.keys(h.methods)){const q=h.methods[p];if('function'!=typeof q)throw new TypeError(`${p} must be a function (got ${q})`);o.prototype[p]=q}return o}const[e,f,g]='2.1.0'.split('.');return c.version={major:Number.parseInt(e,10),minor:Number.parseInt(f,10),patch:Number.parseInt(g,10)},c});
