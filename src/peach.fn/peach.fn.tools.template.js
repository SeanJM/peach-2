Peach.fn.tools.template = function (string, options) {
  return string.replace(this._protected.variable, function (m, key) {
    if (options.hasOwnProperty(key)) {
      return options[key];
    } else {
      return '';
    }
  })
};
