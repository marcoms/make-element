import {assert} from 'chai';

import me from 'src/index';
import {customElName} from './tools';

describe('ready', () => {
	it('should run the ready function after the template and properties have been set up', () => {
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
});
