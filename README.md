# Peach 2.0

Peach is a template engine with subscribers and emitters

## Function list
- [Peach.fn.add](#peach_fn_add)
- Peach.fn.load
- Peach.fn.render
- Peach.fn.renderEach
- Peach.fn.renderNode
- Peach.fn.renderEachNode
- Peach.fn.set
- Peach.fn.get
- Peach.fn.tools
- Peach.fn.on

Basic usage:

## Loading a template
You can load as many templates you want.

### Loading from a file

### A template file

```html
button
  <div class={{self}}>{{text}}</div>
```

```javascript
peach = Peach();
peach.load(['template.html'], callbackFunction);
```

### Loading using `Peach.fn.add`<a id="peach_fn_add"></a>

```javascript
peach = Peach();
peach.add({
  button : {
    value : '<div {{attr}}>{{text}}</div>'
  }
});
```

## Rendering a button

```javascript
peach.render('button', { text : 'My Button '});
// -> <div class="button">My Button</div>
```

## Adding a subscriber to perform prerendering operations

### The template file with a new variable named `color`

```html
button
  <div class="{{self}}--{{color}} {{self}}">{{text}}</div>
```

```javascript
peach.on('render', 'button', function () {
  if (typeof this.color === 'undefined') {
    this.color = 'blue';
  }
});
```

### Rendering the new template
```javascript
peach.render('button', { text : 'My Blue Button '});
// -> <div class="button--blue button">My Blue Button</div>

peach.render('button', { text : 'My Red Button ', color : 'red' });
// -> <div class="button--red button">My Red Button</div>
```

## Setting custom options at initialization (introduction to another default variable named `attr`)

### What is the `attr` variable?

HTML template

```html
button
  <div {{attr}}>{{text}}</div>
```

Rendering the template

```javascript
peach.render('button', {
  text     : 'My Button',
  class    : 'my-class-name',
  disabled : 'disabled',
  id       : 'my-button-id'
});
```

Resulting HTML

```html
<div class="button my-class-name" disabled="disabled" id="my-button-id">My Button</div>
```

To summarize it, there are certain object keys which will automatically be converted to attributes and their values:

- href
- class
- style
- id
- for
- name
- type
- value
- checked
- tabindex
- title
- placeholder
- selected
- disabled
- data* (eg dataValue -> data-value)

You can augment the defaults during initialization:

```javascript
var peach = Peach({
  attr : {
    dingo : {
      value   : 'data-dingo',
      process : dingo.flatten
    }
  }
});
```

Here we have a short hand key named `dingo` which also requires a `processor` named `dingo.flatten` -- this is so your key and it's value can optionally be preprocessed before rendering. The preprocessor must return a string.

## DOM rendering

There is a DOM interface for rendering templates. The tag is `<x-peach render="button"></x-peach>`

```html
<HTML>
  <body>
    <x-peach render="button"><x-peach>
    <script src="peach.min.js"></script>
  </body>
</HTML>
```

Everything inside the `render` attribute is symmetric to the first argument in `peach.render()` this important because of the ability to pass `objects` and `mixins` to the renderer.

## Setting an object that can be passed

```javascript
peach.set('hello', {
  text : 'Hello'
});
```

## Passing a `set` object to the renderer

```javascript
peach.render('button@hello');
// -> <div class="button">Hello</div>
```

You can have more complex objects as `peach.set` uses `lodash`, it uses `_.set` for setting.

```javascript
peach.set('buttonModels', {
  hello : {
    text : 'Hello'
  },
  world : {
    world : 'World'
  }
});
```

```javascript
peach.render('button@buttonModels.hello');
// -> <div class="button">Hello</div>

peach.render('button@buttonModels.world');
// -> <div class="button">World</div>
```
