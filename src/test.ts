import {assert} from 'chai';

import me from '../src/index';

let customElId = 0;

function customElName() {
	++customElId;
	return `x-${customElId}`;
}

describe('makeElement', () => {
	it('should run with no definition', () => {
		const El = me();
	});

	it('should run with an empty definition', () => {
		const El = me({});
	});

	it('should run with an empty props definition', () => {
		const El = me({
			props: {},
		});
	});

	it('should run with one property defined', () => {
		const El = me({
			props: {
				prop: {},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		el.prop = 24;
		assert.equal(el.prop, 24);
	});
});
