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

		it('should work with a setter function', () => {
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

		it('should work with a getter function', () => {
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

		it('should work with a linked attribute', () => {
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
	});
});
