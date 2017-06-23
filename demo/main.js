import makeElement from '../build/make-element.js';


const CounterElement = makeElement({
	props: {
		counter: {
			init: 1,
			set(counter) {
				console.log('counter: setting counter text content');
				this.$['counter'].textContent = counter;
			},
		},
	},

	methods: {
		increment() {
			console.log('counter: incrementing counter by 1');
			++this.counter;
		},
	},

	ready() {
		console.log('counter: setting click listener');
		this.$['increment-button'].onclick = () => { this.increment() };
	},

	shadowDom: true,
	template: `
	<div id="counter"></div>
	<button id="increment-button">Increment</button>
	`,
});

customElements.define('counter-element', CounterElement);
