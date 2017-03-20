import {version} from '../package.json';

function noop() {}

function identity(val) {
	// nothing special here
	return val;
}

function makeElement(def={}) {
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

	for (const prop of Object.keys(props)) {
		// populated registeredProps/Attrs objects

		const propDef = props[prop];

		let val = null;
		if (propDef.init !== undefined) {
			// initial value for the property
			val = propDef.init;
		}

		let hasAttr = typeof propDef.attr === 'string';

		let attr = null;
		if (hasAttr) {
			attr = propDef.attr;

			// register attribute internally

			registeredAttrs[attr] = {
				// internal value
				val: null,

				// linked property name
				prop,

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

		let set = noop;
		if (typeof propDef.set === 'function') {
			set = propDef.set;
		}

		let coerce = identity;
		if (typeof propDef.coerce === 'function') {
			coerce = propDef.coerce;
		}

		registeredProps[prop] = {
			// internal value
			val,

			// linked attribute name
			attr,

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

	const CustomElement = class extends HTMLElement {
		constructor() {
			super();

			readyFn = readyFn.bind(this);

			for (const prop of Object.keys(registeredProps)) {
				// convenience aliases
				const internalProp = registeredProps[prop];
				const hasAttr = typeof internalProp.attr === 'string';
				const attrName = internalProp.attr;
				const internalAttr = registeredAttrs[attrName];

				// bind property methods to element context
				internalProp.toAttr = internalProp.toAttr.bind(this);
				internalProp.fromAttr = internalProp.fromAttr.bind(this);
				internalProp.get = internalProp.get.bind(this);
				internalProp.set = internalProp.set.bind(this);
				internalProp.coerce = internalProp.coerce.bind(this);

				Object.defineProperty(this, prop, {
					set(val) {
						let propVal = val;

						// we don't coerce the user-defined initial value

						if (!internalProp.settingInitialValue) {
							propVal = internalProp.coerce(val);
						} else {
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

						const initializedFromAttribute = (
							!internalProp.hasSet
							&& this.hasAttribute(attrName)
						);

						if (hasAttr && !initializedFromAttribute) {
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
				this.attachShadow({mode: 'open'});
			}

			const cacheIds = (context) => {
				this.$ = {};

				// let's hope no-one has empty id attributes
				const elsWithIds = context.querySelectorAll('[id]');
				for (const el of elsWithIds) {
					this.$[el.id] = el;
				}
			};

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
							`Couldn't fetch template at ${templateUrl}. ` +
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

			if (def.cacheIds !== false) {
				if (def.shadowDom) {
					cacheIds(this.shadowRoot);
				} else {
					cacheIds(this);
				}
			}
		}

		connectedCallback() {
			if (hasConnected) {
				return;
			}

			// only run once

			for (const prop of Object.keys(props)) {
				const internalProp = registeredProps[prop];

				if (
					internalProp.val !== undefined
					&& internalProp.val !== null
					&& !internalProp.hasSet
				) {
					internalProp.settingInitialValue = true;

					// kick off property setter
					this[prop] = internalProp.val;
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

					const propName = internalAttr.prop;
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
			throw new TypeError(
				`${fnName} must be a function (got ${fn})`,
			);
		}

		CustomElement.prototype[fnName] = fn;
	}

	return CustomElement;
}

const [versionMajor, versionMinor, versionPatch] = version.split('.');
makeElement.version = {
	major: Number.parseInt(versionMajor, 10),
	minor: Number.parseInt(versionMinor, 10),
	patch: Number.parseInt(versionPatch, 10),
};

export default makeElement;
