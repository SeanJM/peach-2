Peach.fn.tools.removeClass = function (options) {
  var classNames = Array.prototype.slice.call(arguments, 1, arguments.length);
  var index;
  function removeRegExp(regexp) {
    for (var i = 0, n = options.class.length; i < n; i++) {
      if (regexp.test(options.class[i])) {
        options.class.splice(i, 1);
      }
    }
  }
  for (var i = 0, n = classNames.length; i < n; i++) {
    index = options.class.indexOf(classNames[i]);
    if (typeof classNames[i] === 'string' && index > -1) {
      classNames[i] = Peach.fn.tools.template.call(this, classNames[i], self);
      options.class.splice(options.class.indexOf(classNames[i]), 1);
    } else if (typeof classNames[i].test === 'function') {
      removeRegExp(classNames[i]);
    }
  }
  return options.class;
};
