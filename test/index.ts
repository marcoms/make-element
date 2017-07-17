import {assert} from 'chai';

import me from 'src/index';
import {customElName} from './tools';

describe('makeElement', () => {
	it('should run with no definition', () => {
		const El = me();
	});

	it('should run with an empty definition', () => {
		const El = me({});
	});
});
