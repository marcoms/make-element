import { assert } from 'chai';

import me from 'src/index';
import { customElName } from './tools';

describe('methods', () => {
	it('should attach method to prototype', () => {
		let calledMethod = false;

		const El = me({
			methods: {
				method() {
					calledMethod = true;
				},
			},
		});

		assert.isFunction(El.prototype.method);

		customElements.define(customElName(), El);
		const el = new El();

		el.method();
		assert.isTrue(calledMethod);
	});

	it('should attach multiple methods to prototype', () => {
		let calledMethodA = false;
		let calledMethodB = false;
		let calledMethodC = false;

		const El = me({
			methods: {
				methodA() {
					calledMethodA = true;
				},

				methodB() {
					calledMethodB = true;
				},

				methodC() {
					calledMethodC = true;
				},
			},
		});

		assert.isFunction(El.prototype.methodA);
		assert.isFunction(El.prototype.methodB);
		assert.isFunction(El.prototype.methodC);

		customElements.define(customElName(), El);
		const el = new El();

		el.methodA();
		el.methodB();
		el.methodC();

		assert.isTrue(calledMethodA);
		assert.isTrue(calledMethodB);
		assert.isTrue(calledMethodC);
	});

	it('should run methods with element context', () => {
		const El = me({
			methods: {
				method() {
					assert.instanceOf(this, El);
				},
			},
		});

		customElements.define(customElName(), El);
		const el = new El();
		el.method();
	});
});
