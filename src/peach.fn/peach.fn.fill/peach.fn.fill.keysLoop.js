Peach.fn.fill.keysLoop = function (options) {
  var _this = this;
  var val;
  function inheritOptions(to, from) {
    var match;
    var hasNot;
    for (var k in from) {
      match  = ['class', 'self', 'style', 'attr', 'object'].lastIndexOf(k) < 0;
      hasNot = typeof to[k] === 'undefined';
      if (match && hasNot) {
        to[k] = from[k];
      }
    }
  }
  function replaceTemplateObject(variable) {
    var _options = {};
    if (typeof variable === 'string') {
      _options = _this.get(variable); 
      if ($.isArray(_options)) {
        for (var i = 0; i < _options.length; i++) {
          inheritOptions(_options[i], options);
          _options[i]['parent'] = options.self;
        }
      }
    }
    inheritOptions(_options, options);
    _options['parent'] = options.self;
    return _options;
  }
  function replaceTemplate(name, variable) {
    var _options = replaceTemplateObject(variable);
    return _this.fill(name, _options);
  }
  function math(match) {
    match = match.replace(/[a-zA-Z_]+([a-zA-Z0-9_]+|)/g, function (m) {
      var type = typeof options[m];
      if (['string', 'number'].lastIndexOf(type) > -1) {
        return options[m];
      }
      return m;
    });
    if (/[a-zA-Z_]+/.test(match)) {
      return '';
    } else {
      return eval(match);
    }
  }
  function replaceKey(match) {
    var type = typeof options[match];
    if (/\-|\+|\//.test(match)) {
      return math(match);
    } else if (/\./.test(match)) {
      return _this.get(match);
    } else if (['string','number'].lastIndexOf(type) > -1) {
      return replaceVariables(options[match].toString());
    } else {
      return '';
    }
  }
  function replaceVariables(string) {
    var variable = _this._protected.variable;
    var template = _this._protected.template;
    string = string.replace(variable, function (n, match) {
      return replaceKey(match);
    });
    string = string.replace(template, function (n, name, variable) {
      return replaceTemplate(name, variable);
    });
    string = string.replace(variable, function (n, match) {
      return replaceKey(match);
    });
    return string;
  }
  options.string = replaceVariables(options.string);
};