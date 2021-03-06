export interface ArbitraryFn { (...args: any[]): any; }
export interface BoundArbitraryFn {
	(this: CustomElement, ...args: any[]): any;

}
export interface GetFn { (this: CustomElement, val: any): void; }
export interface SetFn { (this: CustomElement, val: any): any; }
export interface CoerceFn { (this: CustomElement, val: any): any; }
export interface FromAttrFn { (this: CustomElement, val: string): any; }
export interface ToAttrFn { (this: CustomElement, val: any): string; }

export type ReadyFn = BoundArbitraryFn;

export interface ElementDef {
	props?: PropDefs;
	shadowDom?: boolean;
	template?: string;
	templateUrl?: string;
	cacheIds?: boolean;
	methods?: MethodsDef;
	ready?: ReadyFn;
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

export interface MethodsDef {
	[index: string]: BoundArbitraryFn;
}

export interface IdMap {
	[index: string]: IdentifiedElement;
}

export interface CustomElementClass extends Function {
	new (): CustomElement;
}

export interface CustomElement extends HTMLElement {
	$?: IdMap;
	[index: string]: any;
}

// includes HTMLElement and CustomElement possibilities
// `interface` is used instead of `type` so that the interface alias is used
// by code intelligence tools
export interface IdentifiedElement extends CustomElement {}

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
function identity<T>(val: T): T {
	return val;
}

type BoolAttr = string | undefined;

function convertToBoolAttr(val: any): BoolAttr {
	if (Boolean(val)) {
		return '';
	} else {
		return undefined;
	}
}

// returns true if the work was deferred

export function defer(work: ArbitraryFn): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				work();
				resolve(true);
			});
		} else {
			work();
			resolve(false);
		}
	});
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

		let init = null;
		if (propDef.init !== undefined) {
			// initial value for the property
			init = propDef.init;
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

		let toAttr: ToAttrFn = identity;
		if (boolAttr) {
			toAttr = convertToBoolAttr;
		} else if (typeof propDef.toAttr === 'function') {
			toAttr = propDef.toAttr;
		}

		let fromAttr: FromAttrFn = identity;
		if (typeof propDef.fromAttr === 'function') {
			fromAttr = propDef.fromAttr;
		}

		let get: GetFn = identity;
		if (typeof propDef.get === 'function') {
			get = propDef.get;
		}

		let set: SetFn = consume;
		if (typeof propDef.set === 'function') {
			set = propDef.set;
		}

		let coerce: CoerceFn = identity;
		if (typeof propDef.coerce === 'function') {
			coerce = propDef.coerce;
		}

		registeredProps[propName] = {
			// initial value
			init,

			// internal value
			val: null,

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
		static observedAttributes = observedAttrs;

		$: IdMap;

		private _hasConnected: boolean = false;
		private _readyFn: ReadyFn = readyFn;
		private _props: RegisteredProps = {};
		private _attrs: RegisteredAttrs = {};

		constructor() {
			super();

			Object.keys(registeredProps).map((prop) => {
				this._props[prop] = Object.assign({}, registeredProps[prop]);
			});

			Object.keys(registeredAttrs).map((attr) => {
				this._attrs[attr] = Object.assign({}, registeredAttrs[attr]);
			});

			for (const propName of Object.keys(this._props)) {
				// convenience aliases
				const internalProp = this._props[propName] as InternalProp;
				const hasLinkedAttr = typeof internalProp.attr === 'string';
				const attrName = internalProp.attr;
				const internalAttr = this._attrs[attrName] as InternalAttr;

				Object.defineProperty(this, propName, {
					set(val) {
						let propVal = val;

						propVal = internalProp.coerce.call(this, propVal);

						defer(() => {
							if (internalProp.settingInitialValue) {
								internalProp.settingInitialValue = false;
							}

							internalProp.val = propVal;
							internalProp.set.call(this, propVal);

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
								const attrVal = internalProp.toAttr.call(this, propVal);

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
						});
					},

					get() {
						const propVal = internalProp.get.call(this, internalProp.val);
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

			defer(() => {
				// only run once

				for (const propName of Object.keys(this._props)) {
					const internalProp = this._props[propName] as InternalProp;

					// if there is a defined initial value but the setter has not run

					if (
						internalProp.init !== undefined
						&& internalProp.init !== null
						&& !internalProp.hasSet
					) {
						internalProp.settingInitialValue = true;

						// kick off property setter
						this[propName] = internalProp.init;
					}
				}

				this._readyFn();
			});

			this._hasConnected = true;
		}

		attributeChangedCallback(attrName, oldVal, val) {
			// only do work if the new value differs
			if (val !== oldVal) {
				// convenience aliases
				const internalAttr = this._attrs[attrName] as InternalAttr;
				internalAttr.val = val;

				if (internalAttr.needsPropagation) {
					defer(() => {
						// propagation should only occur once
						internalAttr.needsPropagation = false;

						const propName = internalAttr.propName;
						const internalProp = this._props[propName] as InternalProp;

						const propVal = internalProp.fromAttr.call(this, val);
						this[propName] = propVal;
					});
				}
			}
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
