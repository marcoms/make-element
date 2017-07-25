import { assert } from 'chai';

import me from 'src/index';
import { customElName } from './tools';

describe('templateUrl', () => {
	it('should write contents of local template file to element', () => {
		const El = me({
			templateUrl: '/base/test/template.html',
		});

		customElements.define(customElName(), El);
		const el = new El();

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				assert.strictEqual(el.innerHTML.trim(), 'remote-template');
				resolve();
			}, 500);
		});
	}).timeout(1000);

	it('should write contents of remote template file to element', () => {
		if (!navigator.onLine) {
			throw new Error('network connectivity is required');
		}

		const El = me({
			templateUrl: 'https://httpbin.org/get?makeElement=true',
		});

		customElements.define(customElName(), El);
		const el = new El();

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const response = el.innerHTML;
				const jsonResponse = JSON.parse(response);
				assert.strictEqual(jsonResponse.args.makeElement, 'true');

				resolve();
			}, 2000);
		});
	}).timeout(5000);

	it('should write contents of template file to shadow DOM, if enabled', () => {
		const El = me({
			template: 'template',
			shadowDom: true,
		});

		customElements.define(customElName(), El);
		const el = new El();

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				assert.strictEqual(el.shadowRoot.innerHTML, 'template');
				resolve();
			}, 500);
		});
	}).timeout(1000);
});
