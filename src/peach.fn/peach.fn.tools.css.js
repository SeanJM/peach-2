(function () {
  var vendor      = [ 'Moz', 'webkit', 'ms', 'o' ];
  var prefixMatch = [ 'transform', 'userSelect', 'linearGradient' ];
  function toDomName(property) {
    return property.replace(/(?:(Moz|webkit|ms|o)([A-Z][a-zA-Z]+)|([a-zA-Z]+))/, function () {
      if (typeof arguments[1] === 'undefined') {
        return _.kebabCase(arguments[0]);
      }
      return '-' + arguments[1].toLowerCase() + '-' + _.kebabCase(arguments[2]);
    });
  }
  function prefix(styles, name) {
    var match = prefixMatch[prefixMatch.indexOf(name)];
    var temp;
    if (typeof match === 'string') {
      if (typeof styles[match] === 'string') {
        return toDomName(match);
      }
      for (var i = 0, n = vendor.length; i < n; i++) {
        temp = vendor[i] + match[0].toUpperCase() + match.substring(1, match.length);
        if (typeof styles[temp] === 'string') {
          return toDomName(temp);
        }
      }
    }
    return toDomName(name);
  }
  function toType(s) {
    return /^[0-9\.]+$/.test(s) ? s += 'px' : s;
  }
  function format(styles, styleObject) {
    var newStyle = {};
    for (var name in styleObject) {
      if (typeof styleObject[name] !== 'undefined') {
        newStyle[prefix(styles, name)] = toType(styleObject[name]);
      }
    }
    return newStyle;
  }
  function stringStyleToObject(style) {
    var styleObj = {};
    style        = style.split(';');
    for (var i = 0, n = style.length; i < n; i++) {
      if (/:/.test(style[i])) {
        styleObj[style[i].split(':')[0].trim()] = style[i].split(':')[1].trim();
      }
    }
    return styleObj;
  }
  Peach.fn.tools.css = function (options, styleObject) {
    var self = this;
    if (typeof options.style === 'undefined') {
      options.style = {};
    } else if (typeof options.style === 'string') {
      options.style = stringStyleToObject(options.style);
    }
    _.assign(options.style, format(self.styles, styleObject));
  };
})();
