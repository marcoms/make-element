import { assert } from 'chai';

import me from 'src/index';
import { customElName } from './tools';

describe('template', () => {
	it('should write template to element', () => {
		const El = me({
			template: 'template',
		});

		customElements.define(customElName(), El);
		const el = new El();
		assert.strictEqual(el.innerHTML, 'template');
	});

	it('should write template to shadow DOM, if enabled', () => {
		const El = me({
			shadowDom: true,
			template: 'template',
		});

		customElements.define(customElName(), El);
		const el = new El();
		assert.strictEqual(el.innerHTML, '');
		assert.strictEqual(el.shadowRoot.innerHTML, 'template');
	});

	it('should override templateUrl', () => {
		const El = me({
			template: 'template',
			templateUrl: './template.html',
		});

		customElements.define(customElName(), El);
		const el = new El();

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				assert.strictEqual(el.innerHTML, 'template');
				resolve();
			}, 500);
		});
	}).timeout(1000);
});
