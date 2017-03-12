# make-element

make-element provides a simple and ergonomic system for creating Web Components. It is lightweight, imperative<sup>1</sup>,
supports Shadow DOM, and supports property/attribute binding.

## Example

### JS

```js
const CounterElement = makeElement({
    props: {
        counter: {
            init: 1,
            set(counter) {
                this.$['counter'].textContent = counter;
            },
        },
    },

    methods: {
        increment() {
            ++this.counter;
        },
    },

    ready() {
        this.$['increment-button'].onclick = () => {
            this.increment()
        };
    },

    shadowDom: true,
    template: `
        <div id="counter"></div>
        <button id="increment-button">Increment</button>
    `,
});

customElements.define('counter-element', CounterElement);
```

### HTML

```html
<counter-element></counter-element>
```

### Result

![Counter demo](res/counter-demo.gif)

## API

### `makeElement(definition={})`

Produces a custom element class that can be passed to `customElements.define`.

#### `props`

Collection of properties to register for the custom element. All configuration fields (`attr`, `get`, `set`, &hellip;) are optional.

##### `attr`

*Default: (none)*

Attribute name to bind to

Every time the property is set, the value will flow into the attribute name specified here via `coerce()`, then `toAttr()`

A property can be initialised through markup by supplying an attribute value, but subsequent changes to the attribute will *not* flow back to the property -- binding is therefore *one-way* from property to attribute

###### Example

```js
myProp: {
    attr: 'my-attr',
}
```

```html
<my-element my-attr="24"></my-element>
```

```js
myElement.myProp;  // -> 24 (initialised from attribute)

myElement.myProp = 32;
myElement.getAttribute('my-attr');  // -> 32 (flowed from property)

myElement.setAttribute('my-attr', 48);
myElement.myProp;  // -> 32 (no change)
```

##### `get(val)`

Getter function

###### Example

```js
get(fullName) {
    const [firstName, lastName] = fullName.split(' ');
    return {firstName, lastName};
}
```

##### `set(val)`

Setter function

###### Example

```js
set(val) {
    console.log('property was set to', val);
}
```

##### `coerce(val)`

Function to modify a property's value before it is passed to `set()` and stored

###### Example

```js
coerce(val) {
    return Number.parseInt(val, 10);
}
```

##### `toAttr(val)`

Function to modify the value to store as an attribute

##### `fromAttr(val)`

Function to modify the value retreived initially from the attribute

#### `methods`

Collection of methods to assign to the custom element prototype

##### Example

```js
methods: {
    myMethod() {
        console.log('hello from myMethod');
    },
}
```

```js
myElement.myMethod();  // -> hello from myMethod
```

#### `shadowDom`

*Default: `false`*

If true, shadow DOM will be used for templating

#### `template`

HTML template to initialise the custom element with

If `templateUrl` is also defined, `template` will be used

#### `templateUrl`

Like `template`, but fetches the template from this URL

If `template` is also defined, `template` will be used.

#### `cacheIds`

*Default: `true`*

If true, elements in the template with an `id` attribute will be stored in the `$` property for easy and fast referencing.

##### Example

```js
cacheIds: true,
template: `<p id="hello">hello</p>`,

ready() {
    this.$['hello'].onclick = () => {
        console.log('hello');
    };
},
```

#### `ready()`

Function invoked once the custom element has initialised its template and connected to the DOM

## License

MIT (see `license.txt`)

## Notes

1: For a functional-style custom elements library, see [skatejs](https://github.com/skatejs/skatejs)
