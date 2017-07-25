import { assert } from 'chai';

import me from 'src/index';
import { customElName } from './tools';

describe('cacheIds', () => {
	it('should store elements with ids in $', () => {
		const El = me({
			template: `
				<div id="a"></div>
				<div id="b"></div>
				<div id="c"></div>
			`,
		});

		customElements.define(customElName(), El);
		const el = new El();

		assert.strictEqual(el.$['a'].id, 'a');
		assert.strictEqual(el.$['b'].id, 'b');
		assert.strictEqual(el.$['c'].id, 'c');
	});

	it('should store elements with ids in $, with shadow DOM enabled', () => {
		const El = me({
			shadowDom: true,
			template: `
				<div id="a"></div>
				<div id="b"></div>
				<div id="c"></div>
			`,
		});

		customElements.define(customElName(), El);
		const el = new El();

		assert.strictEqual(el.$['a'].id, 'a');
		assert.strictEqual(el.$['b'].id, 'b');
		assert.strictEqual(el.$['c'].id, 'c');
	});
});
