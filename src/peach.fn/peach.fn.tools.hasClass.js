Peach.fn.tools.hasClass = function (options, classMatch) {
  if (typeof classMatch.test === 'function') {
    return classMatch.test(options.class.join(' '));
  }
  return options.class.indexOf(classMatch) > -1;
};
