import { assert } from 'chai';

import me from 'src/index';
import { customElName } from './tools';

describe('props', () => {
	it('should work with empty definition', () => {
		const El = me({
			props: {},
		});
	});

	it('should work with property defined', () => {
		const El = me({
			props: {
				prop: {},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		el.prop = 24;
		assert.strictEqual(el.prop, 24);
	});

	it('should call setter after updating value', () => {
		const El = me({
			props: {
				prop: {
					set(val) {
						assert.strictEqual(val, 24);
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		el.prop = 24;
	});

	it('should call setter with element context', () => {
		const El = me({
			props: {
				prop: {
					set() {
						assert.instanceOf(this, El);
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		el.prop = 24;
	});

	it('should use getter when retrieving value', () => {
		const El = me({
			props: {
				prop: {
					get(val) {
						return val + 24;
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		el.prop = 24;
		assert.strictEqual(el.prop, 48);
	});

	it('should call getter with element context', () => {
		const El = me({
			props: {
				prop: {
					get() {
						assert.instanceOf(this, El);
						return 24;
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		// tslint:disable-next-line no-unused-expression
		el.prop;
	});

	it('should flow to linked attribute', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		document.body.appendChild(el);

		assert.isNull(el.getAttribute('prop'));

		el.prop = 24;
		assert.strictEqual(el.prop, 24);
		assert.strictEqual(el.getAttribute('prop'), '24');
	});

	it('should be initialized from linked attribute', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
				},
			},
		});

		const elName = customElName();
		const el = document.createElement(elName);
		el.setAttribute('prop', '24');
		document.body.appendChild(el);

		customElements.define(elName, El);
		assert.strictEqual((el as any).prop, '24');
	});

	it('should properly reflect truthiness for boolean attribute', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
					boolAttr: true,
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		el.prop = 24;
		assert.strictEqual(el.getAttribute('prop'), '');
	});

	it('should properly reflect falsiness for boolean attribute', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
					boolAttr: true,
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		el.prop = 0;
		assert.strictEqual(el.getAttribute('prop'), null);
	});

	it('should serialize value with toAttr', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
					toAttr(val) {
						return String(val) + '-toAttr';
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		el.prop = 24;
		assert.strictEqual(el.getAttribute('prop'), '24-toAttr');
	});

	it('should call toAttr with element context', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
					toAttr() {
						assert.instanceOf(this, El);
						return '24';
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		el.prop = 24;
	});

	it('should deserialize attribute value with fromAttr', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
					fromAttr(val) {
						return Number.parseInt(val, 10);
					},
				},
			},
		});

		const elName = customElName();
		const el = document.createElement(elName);
		el.setAttribute('prop', '24');
		document.body.appendChild(el);

		customElements.define(elName, El);

		assert.strictEqual((el as any).prop, 24);
	});

	it('should call fromAttr with element context', () => {
		const El = me({
			props: {
				prop: {
					attr: 'prop',
					fromAttr() {
						assert.instanceOf(this, El);
						return 24;
					},
				},
			},
		});

		const elName = customElName();
		const el = document.createElement(elName);
		el.setAttribute('prop', '24');
	});

	it('should use coerce return value as property value', () => {
		const El = me({
			props: {
				prop: {
					coerce(val) {
						return String(val) + '-coerce';
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();

		el.prop = 24;
		assert.strictEqual(el.prop, '24-coerce');
	});

	it('should initialize property value with init', () => {
		const El = me({
			props: {
				prop: {
					init: 24,
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		assert.strictEqual(el.prop, 24);
	});

	it('should prefer initialization from linked attribute vs init', () => {
		const El = me({
			props: {
				prop: {
					init: 24,
					attr: 'prop',
				},
			},
		});

		const elName = customElName();
		const el = document.createElement(elName);

		el.setAttribute('prop', '48');

		document.body.appendChild(el);
		customElements.define(elName, El);

		assert.strictEqual((el as any).prop, '48');
	});

	it('should coerce initial value', () => {
		const El = me({
			props: {
				prop: {
					init: 24,
					coerce(val) {
						return String(val) + '-coerce';
					},
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		document.body.appendChild(el);
		assert.strictEqual(el.prop, '24-coerce');
	});
});
