# Peach 2.0

Peach is a template engine with subscribers and emitters

## Requirements
- [Lodash](https://raw.githubusercontent.com/lodash/lodash/3.10.1/lodash.min.js)


### Reference List
- [Peach.fn.add](#peach_fn_add)
- [Peach.fn.load](#peach_fn_load)
- [Peach.fn.render](#peach_fn_render)
- [Peach.fn.renderEach](#peach_fn_renderEach)
- [Peach.fn.node](#peach_fn_node)
- [Peach.fn.nodeEach](#peach_fn_nodeEach)
- [Peach.fn.set](#peach_fn_set)
- [Peach.fn.get](#peach_fn_get)
- [Peach.fn.on](#peach_fn_on)
  - [render](#peach_fn_on_render)
  - [node](#peach_fn_on_node)
- [Peach.fn.tools](#peach_fn_tools)
  - [addClass](#peach_fn_tools)
  - [removeClass](#peach_fn_tools)
  - [hasClass](#peach_fn_tools)
  - [css](#peach_fn_tools)
- [Peach.fn.bind](#peach_fn_bind)
- [Peach.fn.update](#peach_fn_update)

### Examples
- [A Todo list](#example_todo-list)
- [Setting custom options at initialization](#example_custom-init)
- [DOM rendering](#example_dom-rendering)

# Function List

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
### Peach.fn.load

Peach also allows the loading of templates from HTML files. These files are loaded in an array, you can load as many templates you want and include a callback function once they are loaded and the DOM has been rendered.

```javascript
var peach = Peach();
peach.load(['template.html'], callbackFunction);
```

It is important to note that template files are whitespace active, this is an example of `template.html`.

```html
button
  <div class="{{self}}">{{text}}</div>

input
  <div class="{{self}}">
    <input {{attr_value}} {{attr_placeholder}}>
  </div>
```

<a id="peach_fn_render"></a>
### Peach.fn.render

```javascript
var peach = Peach();
peach.render('button', { text : 'My Button' });
// -> <div class="button">My Button</div>
```

<a id="peach_fn_renderEach"></a>
### Peach.fn.renderEach

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

<a id="peach_fn_node"></a>
### Peach.fn.node

Works the same as [`Peach.fn.render`](#peach_fn_render) and returns a `Node` or `nodeList` instead of a string.

```javascript
var peach      = Peach();
var buttonNode = peach.node('button', {
  text : 'My Button'
});
// -> [object HTMLBodyElement] : <div class="button">My Button</div>
```

<a id="peach_fn_nodeEach"></a>
### Peach.fn.nodeEach

Takes an array as second argument to render a `nodeList`

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

<a id="peach_fn_set"></a>
### Peach.fn.set

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
### Peach.fn.get

A function which retrieves storage which can set. It uses `lodash.get`.

```javascript
peach.get('buttonList.myButton');
// -> { text : 'My Button ' }
```

<a id="peach_fn_on"></a>
### Peach.fn.on

There are two events you can bind to, `render` & `node`

<a id="peach_fn_on_render"></a>
#### render

`mixinList` is an `Array` of strings passed to the renderer.
Eg : `peach.render('button:mixin1:mixin2')` would pass the mixinList of `['mixin1', 'mixin2'];`

```javascript
peach.on('render', 'button', function (mixinList) {
  ...
});
```

Here is an example where I listen for `mixin1` on `button`

```javascript
peach.on('render', 'button:mixin1', function (mixinList) {
  // Do stuff
});
```

In this example, I check the presence of `mixin2` and `mixin3`.

```javascript
peach.on('render', 'button:mixin1', function (mixinList) {
  if (mixinList.has('mixin2', 'mixin3')) {
    // Do stuff
  } else if (mixinList.has('mixin2')) {
    // Do this stuff
  }
});
```

It's important to note, that `peach.on('render')` passes `this` to the function as an `object`.

Here are the two ways in which you can add key values to `this`

1. Passing an `object` literal to the renderer. This object will augment `this` with its values.

```javascript
peach.render('button', { text : 'My Button' });
```

2. Passing a reference to an `object` created with [`Peach.fn.set`](#peach_fn_set)

```javascript
peach.render('button@myButton');
```

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

An example of the value of the agumented `this` when pasing an `object`

```
attr: "class="button""
attr_class: "class="button""
class: [
  0: "button"
],
self: "button"
string: "<div {{attr}}>{{text}}</div>",
text: "My Button"
```

Each one of the preceding values that are strings can be included in your template.

<a id="peach_fn_on_node"></a>
#### node

- The value of 'nodeElement' can be a `Node` or `NodeList`
- `mixinList` is an `Array` of strings passed to the renderer

```javascript
peach.on('node', 'button', function (nodeElement, mixinList) {
  // eg : peach.node('button:mixin1:mixin2') would pass the mixinList
  // of ['mixin1', 'mixin2'];
  ...
});
```

<a id="peach_fn_tools"></a>
#### Peach.fn.tools

```javascript
peach.on('render', 'button', function () {
  var tools = peach.tools(this);
  // Add Class
  tools.addClass('a-class');
  tools.addClass('b-class');
  // Remove Class
  tools.removeClass('a-class');
  // Remove Class with RegExp support
  tools.removeClass(/class/);
  // Has Class
  tools.hasClass('b-class');
  // CSS
  // Note : CSS key values must be the JavaScript `camelCase` version of the CSS attribute
  // CSS also supports automatically adding vendor prefixes when they are requried
  tools.css({
    paddingLeft : '50px',
    paddingTop  : '10px',
    zIndex      : 3,
    width       : (100 / 6) + '%'
  });
});
```

To take advantage of `peach.tools(this).addClass`, `peach.tools(this).removeClass` my template will require:
- `{{attr_class}}`
- `{{attr}}`

To take advantage of `peach.tools(this).css` my template will require:
- `{{attr_style}}`
- `{{attr}}`

<a id="peach_fn_bind"></a>
### Peach.fn.bind

Attaches a subscriber to a `node` which will be updated via `Peach.fn.update`

```javascript
var peach = Peach();
var node  = peach.node('button', { text : 'button1' });
document.body.appendChild(node);
peach.bind('button', node);
```

<a id="peach_fn_update"></a>
### Peach.fn.update

Updates a node in the DOM with an updated version of that node by rendering it with the passed object properties.

```javascript
peach.update('button', { text : 'button2' });
```

# Examples

<a id="example_todo-list"></a>
### A todo list
[JSFiddle](http://jsfiddle.net/SeanJM/eeL23xdf/21/)

```html
<div id="todo-container"></div>
```

```javascript
var peach = Peach();
var todos = [{
    text : 'My first todo'
}];
function initTodoTemplates() {
	peach.add({
        'button' : {
            value : '<div {{attr}}>{{text}}</div>'
        },
        'todo-list' : {
            value : '<div {{attr}}>'+
               	'<div class="todo-control">' +
            		'<input class="todo-input" id="todo-input" placeholder="Enter todo text here">' +
		            '<x-peach render="button:add"></x-peach>' +
            	'</div>' +
            	'<div class="todo-container">{{todoItems}}</div>' +
            '</div>'
        },
        'todo-item' : {
            value : '<div {{attr}}>' +
            	'<div class="{{self}}-text">{{text}}</div>' +
               	'<div class="{{self}}-control">' +
            		'<x-peach render="button:remove"></x-peach>' +
            	'</div>' +
            '</div>'
        }
	});
}
function appendTodoList() {
    var todoNode = peach.node('todo-list');
	document.querySelector('#todo-container').appendChild(todoNode);
    peach.bind('todo-list', todoNode);
}
function addTodo() {
    var val = {
    	text : document.querySelector('#todo-input').value.trim()
    };
    if (val.text.length) {
		todos.push(val);
    	peach.update('todo-list');
    }
}
function removeTodo(e) {
    var index = Number(e.target.closest('.todo-item').id.split('-').slice(-1)[0]);
    todos.splice(index, 1);
    peach.update('todo-list');
}
peach.on('render', 'todo-item', function () {
	this.id = 'todo-item-' + this.index;
});
peach.on('render', 'todo-list', function () {
    this.todoItems = peach.renderEach('todo-item', todos);
});
peach.on('render', 'button', function (mixin) {
	var tools = peach.tools(this);
    tools.addClass('{{self}}-' + mixin.join('-'));
    this.text = mixin[0][0].toUpperCase() + mixin[0].slice(1);
});
peach.on('node', 'todo-list', function (node) {
	var addButton = node.querySelector('.button-add');
    var removeButton = node.querySelector('.button-remove');
    addButton.addEventListener('click', addTodo, false);
    removeButton.addEventListener('click', removeTodo, false);
});
initTodoTemplates();
appendTodoList();
```

<a id="example_custom-init"></a>
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

Here I have a short hand key named `dingo` which also requires a `processor` named `dingo.flatten` -- it's value can optionally be preprocessed before rendering. _The preprocessor must return a string._

<a href="example_dom-rendering"></a>
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
