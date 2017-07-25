import { assert } from 'chai';

import me from 'src/index';
import { customElName } from './tools';

describe('shadowDom', () => {
	it('should attach shadow root if true', () => {
		const El = me({
			shadowDom: true,
		});

		customElements.define(customElName(), El);
		const el = new El();
		assert.instanceOf(el.shadowRoot, window.ShadowRoot);
	});

	it('should not attach shadow root if false', () => {
		const El = me({
			shadowDom: false,
		});

		customElements.define(customElName(), El);
		const el = new El();
		assert.isNull(el.shadowRoot);
	});
});
