# Peach 2.0

Peach is a template engine with subscribers and emitters

## Function list
- [Peach.fn.add](#peach_fn_add)
- [Peach.fn.load](#peach_fn_load)
- [Peach.fn.render](#peach_fn_render)
- [Peach.fn.renderEach](#peach_fn_renderEach)
- [Peach.fn.node](#peach_fn_node)
- [Peach.fn.nodeEach](#peach_fn_nodeEach)
- [Peach.fn.set](#peach_fn_set)
- [Peach.fn.get](#peach_fn_get)
- [Peach.fn.on](#peach_fn_on)
- [Peach.fn.tools](#peach_fn_tools)
- [Peach.fn.bind](#peach_fn_bind)
- [Peach.fn.update](#peach_fn_update)

## Examples
- [A Template file](#example_template-file)

<a id="peach_fn_add"></a>
### Peach.fn.add

```javascript
var peach = Peach();
peach.add({
  button : {
    value : '<div {{attr}}>{{text}}</div>'
  }
});
```

<a id="peach_fn_load"></a>
## Peach.fn.load

You can load as many templates you want.

```javascript
var peach = Peach();
peach.load(['template.html'], callbackFunction);
```
<a id="peach_fn_render"></a>
## Peach.fn.render

```javascript
var peach = Peach();
peach.render('button', { text : 'My Button' });
// -> <div class="button">My Button</div>
```

<a id="peach_fn_renderEach"></a>
## Peach.fn.renderEach

Takes an array as second argument to render templates

```javascript
var peach      = Peach();
var buttonList = [{
  text : 'My Button'
}, {
  text : 'My Second Button'
}];
peach.render('button', buttonList);
// -> <div class="button">My Button</div>
//    <div class="button">My Second Button</div>
```

<a id="peach_fn_set"></a>
## Peach.fn.set

A function which adds storage which can be passed to the renderer as a string. It uses `lodash.set`.

```javascript
var peach = Peach();
peach.set('buttonList', {
  myButton : {
    text : 'My Button '
  },
  mySecondButton : {
    text : 'My Second Button'
  }
});
```

Second example with setting object paths

```javascript
var peach = Peach();
peach.set('buttonList.myButton', {
  text : 'My Button '
});
peach.set('buttonList.mySecondButton', {
  text : 'My Second Button '
});
```

<a id="peach_fn_get"></a>
## Peach.fn.get

A function which retrieves storage which can set. It uses `lodash.get`.

```javascript
peach.get('buttonList.myButton');
// -> { text : 'My Button ' }
```

<a id="peach_fn_on"></a>
## Peach.fn.on

There are two events you can bind to, `render` & `node`

```javascript
peach.on('render', 'button', function (mixinList) {
  // mixinList is an array of strings passed to the renderer with Peach.fn.render
  // eg : peach.render('button:mixin1:mixin2') would pass the mixinList of ['mixin1', 'mixin2'];
  ...
});
```

It's important to note, that `peach.on('render')` passes `this` to the function containing all values in a passed object as well as default values.

An example of the value of `this` when simply executing `peach.render('button');`

```
attr: "class="button""
attr_class: "class="button""
class: [
  0: "button"
],
self: "button"
string: "<div {{attr}}>{{text}}</div>"
```

Each one of the preceding values that are strings can be included in your template.

<a id="peach_fn_node"></a>
## Peach.fn.node

Works the same as `[Peach.fn.render](#peach_fn_render)` and returns a `Node` or `nodeList` instead of a string.

```javascript
var peach      = Peach();
var buttonNode = peach.node('button', {
  text : 'My Button'
});
// -> [object HTMLBodyElement] : <div class="button">My Button</div>
```

<a id="peach_fn_nodeEach"></a>
## Peach.fn.nodeEach

Takes an array as second argument to render templates as a nodeList

```javascript
var peach      = Peach();
var buttonList = [{
  text : 'My Button'
}, {
  text : 'My Second Button'
}];
var buttonNodes = peach.nodeEach('button', buttonList);
// -> [object NodeList] :
//    [
//      0: <div class="button">My Button</div>],
//      1: <div class="button">My Second Button</div>
//    ]
```

<a id="example_template-file"></a>
### A template file

```html
button
  <div class={{self}}>{{text}}</div>
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
