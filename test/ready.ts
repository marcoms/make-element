import { assert } from 'chai';

import me from 'src/index';
import { customElName } from './tools';

describe('ready', () => {
	it('should call ready after template and properties are done', () => {
		const El = me({
			props: {
				propA: {
					init: 24,
				},

				propB: {
					init: 32,
				},

				propC: {
					init: 48,
					attr: 'prop-c',
					fromAttr: Number,
				},
			},

			shadowDom: true,
			template: 'template',

			ready() {
				assert.strictEqual(this.propA, 24);
				assert.strictEqual(this.propB, 32);
				assert.strictEqual(this.propC, 64);

				assert.strictEqual(el.shadowRoot.innerHTML, 'template');
			},
		});

		const elName = customElName();
		const el = document.createElement(elName);
		el.setAttribute('prop-c', '64');
		document.body.appendChild(el);
		customElements.define(elName, El);
	});

	it('should call ready with element context', () => {
		const El = me({
			ready() {
				assert.instanceOf(this, El);
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
	});

	it('should call ready after DOMContentLoaded', () => {
		const El = me({
			ready() {
				assert.notStrictEqual(document.readyState, 'complete');
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		document.body.appendChild(el);
	});
});
