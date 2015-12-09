function Peach(options) {
  /*
    Initialize the prototypes with 'settings' as 'this' value, so that when we
    assign the prototype to the object/array -- it will still hold the settings
    value

    Store unsafe & unavailable terms in:
    settings._protected.unsafe / this._protected.unsafe

    this._protected._prototype.array
    this._protected._prototype.object
  */
  var settings =  {
    _protected: {
      register    : true,
      store       : {},
      on          : {
        node   : {},
        render : {},
        var    : {},
      },
      model       : {},
      dataBinding : {},
      variable    : /\{\{([a-zA-Z0-9_\.]+)\}\}/g,
      template    : /<x-peach(?:\s+)render=(?:\"|\')([^\]]+?)(?:\"|\')><\/x-peach>/g,
      tagName     : 'peach',
      attr        : {
        href        : {
          value  : 'href'
        },
        class: {
          value: 'class',
          process: function (value) {
            if (Array.isArray(value)) {
              return value.join(' ');
            } else if (typeof value === 'string') {
              return value;
            }
            return '';
          }
        },
        style: {
          value: 'style',
          process: function (value) {
            var style = [];
            if (typeof value === 'string') {
              return value;
            }
            for (var k in value) {
              style.push(k + ': ' + value[k]);
            }
            return style.join('; ');
          }
        },
        id: {
          value: 'id'
        },
        for: {
          value: 'for'
        },
        name: {
          value: 'name'
        },
        type: {
          value: 'type'
        },
        value: {
          value: 'value'
        },
        checked: {
          value: 'checked'
        },
        tabindex: {
          value: 'tabindex'
        },
        title: {
          value: 'title'
        },
        placeholder: {
          value: 'placeholder'
        },
        selected: {
          value: 'selected'
        },
        disabled: {
          value: 'disabled'
        },
      },
      styles : typeof window === 'object' ? window.getComputedStyle(document.body) : {},
      unsafe : [
        '_compose',
        'addClass',
        'class',
        'css',
        'hasClass',
        'object',
        'objectName',
        'parent',
        'removeClass',
        'self',
        'string',
        'style',
        'set',
        'get',
        'tag',
        'jquery'
      ]
    },
  };
  // Extend the prototype
  _.merge(settings._protected, options);
  // Register tag name
  if (!/^x-/.test(settings._protected.tagName)) {
    settings._protected.tagName = 'x-' + settings._protected.tagName;
  }
  if (settings._protected.register) {
    if (typeof document.registerElement === 'function') {
      document.registerElement(settings._protected.tagName, {
        prototype: Object.create(HTMLElement.prototype),
        extends  : 'div'
      });
    } else if (typeof document.register === 'function') {
      document.register(settings._protected.tagName, {
        prototype: Object.create(HTMLElement.prototype)
      });
    }
  }
  return Peach.fn.compose(settings, Peach.fn);
}
