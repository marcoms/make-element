export interface ElementDef {
	props?: PropDefs;
	shadowDom?: boolean;
	template?: string;
	templateUrl?: string;
	cacheIds?: boolean;
	methods?: MethodsDef;
	ready?: ArbitraryFn;
}

export interface PropDefs {
	[index: string]: PropDef;
}

export interface PropDef {
	attr?: string;
	boolAttr?: boolean;
	set?: SetFn;
	get?: GetFn;
	toAttr?: ToAttrFn;
	fromAttr?: FromAttrFn;
	coerce?: CoerceFn;
	init?: any;
}

export interface ArbitraryFn { (...args: any[]): any; }
export interface GetFn { (val: any): void; }
export interface SetFn { (val: any): any; }
export interface CoerceFn { (val: any): any; }
export interface FromAttrFn { (val: string): any; }
export interface ToAttrFn { (val: any): string; }

export interface MethodsDef {
	[index: string]: ArbitraryFn;
}

export interface IdMap {
	[index: string]: HTMLElement;
}

export interface CustomElementClass extends Function {
	new (): CustomElement;
}

export interface CustomElement extends HTMLElement {
	$: IdMap;
	_hasConnected: boolean;
	_readyFn: ReadyFn;
	_props: RegisteredProps;
	_attrs: RegisteredAttrs;
}

// private interfaces

interface RegisteredProp extends PropDef {
	boolAttr: boolean;
	set: SetFn;
	get: GetFn;
	toAttr: ToAttrFn;
	fromAttr: FromAttrFn;
	coerce: CoerceFn;

	val: any;
	hasSet: boolean;
}

interface RegisteredProps {
	[index: string]: RegisteredProp;
}

interface InternalProp extends RegisteredProp {
	settingInitialValue: boolean;
}

interface RegisteredAttr {
	val: string | null;
	propName: string;
	needsPropagation: boolean;
}

interface RegisteredAttrs {
	[index: string]: RegisteredAttr;
}

type InternalAttr = RegisteredAttr;

// utility functions

function noop() {}
function consume(val: any) {}
function identity(val: any) {
	// nothing special here
	return val;
}

function convertToBoolAttr(val) {
	if (Boolean(val)) {
		return '';
	} else {
		return undefined;
	}
}

function makeElement(def: ElementDef = {}): CustomElementClass {
	const props: PropDefs = def.props || {};
	const methods: MethodsDef = def.methods || {};

	let readyFn = noop;
	if (typeof def.ready === 'function') {
		readyFn = def.ready;
	}

	// used to keep track of registered properties/attributes
	const registeredProps: RegisteredProps = {};
	const registeredAttrs: RegisteredAttrs = {};

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
		} else if (typeof propDef.toAttr === 'function') {
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

	const DefinableCustomElement: CustomElementClass = class extends HTMLElement {
		$: IdMap;
		_hasConnected = false;
		_readyFn = readyFn;
		_props = registeredProps;
		_attrs = registeredAttrs;

		constructor() {
			super();

			for (const propName of Object.keys(this._props)) {
				// convenience aliases
				const internalProp = this._props[propName] as InternalProp;
				const hasLinkedAttr = typeof internalProp.attr === 'string';
				const attrName = internalProp.attr;
				const internalAttr = this._attrs[attrName] as InternalAttr;

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

						const beingInitialized = (
							this.hasAttribute(attrName)
							&& !internalProp.hasSet
						);

						if (hasLinkedAttr && !beingInitialized) {
							const attrVal = internalProp.toAttr(propVal);

							// prevent the attribute from reflowing back to the
							// property in attributeChangedCallback
							internalAttr.needsPropagation = false;

							if (attrVal !== undefined) {
								// invoke attributeChangedCallback
								this.setAttribute(attrName, attrVal);
							} else {
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
				this.attachShadow({mode: 'open'});
			}

			if (hasLocalTemplate) {
				if (def.shadowDom) {
					this.shadowRoot.innerHTML = def.template;
				} else {
					this.innerHTML = def.template;
				}
			} else if (hasRemoteTemplate) {
				fetch(def.templateUrl).then((resp) => {
					if (resp.ok) {
						// 200 OK
						return resp.text();
					} else {
						// 404 et al
						throw new Error(
							`Couldn't fetch template at ${def.templateUrl}. ` +
							`Got HTTP status code ${status}`,
						);
					}
				}).then((template) => {
					if (def.shadowDom) {
						this.shadowRoot.innerHTML = template;
					} else {
						this.innerHTML = template;
					}
				});
			}

			// id caching enabled by default
			if (def.cacheIds !== false) {
				this.$ = {};

				let elsWithIds: NodeList;
				if (def.shadowDom) {
					elsWithIds = this.shadowRoot.querySelectorAll('[id]');
				} else {
					elsWithIds = this.querySelectorAll('[id]');
				}

				for (const el of elsWithIds) {
					const castEl = el as HTMLElement;
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
				const internalProp = this._props[propName] as InternalProp;

				// if there is a value but the setter has not run

				if (
					internalProp.val !== undefined
					&& internalProp.val !== null
					&& !internalProp.hasSet
				) {
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
				const internalAttr = this._attrs[attrName] as InternalAttr;
				internalAttr.val = val;

				if (internalAttr.needsPropagation) {
					// propagation should only occur once
					internalAttr.needsPropagation = false;

					const propName = internalAttr.propName;
					const internalProp = this._props[propName] as InternalProp;

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

	for (const fnName of Object.keys(methods)) {
		const fn = methods[fnName];

		if (typeof fn !== 'function') {
			throw new TypeError(
				`${fnName} must be a function (got ${fn})`,
			);
		}

		DefinableCustomElement.prototype[fnName] = fn;
	}

	return DefinableCustomElement;
}

export default makeElement;
