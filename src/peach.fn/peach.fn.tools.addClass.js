Peach.fn.tools.addClass = function (options) {
  var className;
  for (var i = 1, len = arguments.length; i < len; i++) {
    className = Peach.fn.tools.template.call(this, arguments[i], options);
    if (options.class.lastIndexOf(className) < 0) {
      options.class.push(className);
    }
  }
};
