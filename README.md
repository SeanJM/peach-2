# Peach 2.0

Peach is a template engine with subscribers and emitters

Basic usage:

## Loading a template
You can load as many templates you want.

```javascript
peach = Peach();
peach.load(['template.html'], callback);
```

## A template file

```html
button
  <div class={{self}}>{{text}}</div>
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
