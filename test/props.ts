import {assert} from 'chai';

import me from 'src/index';
import {customElName} from './tools';

describe('makeElement', () => {
	describe('props', () => {
		it('should work with an empty definition', () => {
			const El = me({
				props: {},
			});
		});

		it('should work with one property defined', () => {
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

		it('should call the setter function after updating the value', () => {
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

		it('should use the getter function when retrieving the value', () => {
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

		it('should flow to a linked attribute', () => {
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

		it('should be initialized from a linked attribute', () => {
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

		it('should properly reflect truthiness for a boolean attribute', () => {
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

		it('should properly reflect falsiness for a boolean attribute', () => {
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

		it('should serialize the property value with the toAttr function', () => {
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

			el.prop = 'hello';
			assert.strictEqual(el.getAttribute('prop'), 'hello-toAttr');
		});

		it('should deserialize the attribute value with the fromAttr function', () => {
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

		it('should use the coerce function return value as the property value', () => {
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

		it('should initialize the property value with init', () => {
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

		it('should be prefer a linked attribute initialization value over one from init', () => {
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

		it('should coerce the initial property value', () => {
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
});
