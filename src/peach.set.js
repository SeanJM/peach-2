(function (Peach) {
  // Closure body
  Peach.set = function () {
    var model     = arguments[0],
        value     = _.last(arguments),
        target    = Array.prototype.slice.call(arguments, 1, arguments.length - 1).join('.'),
        getTarget = _.get(target);
    if (['function', 'object'].indexOf(typeof getTarget) === -1) {
      return _.set(model, target, value);
    }
    return _.set(model, target, _.assign(value, getTarget));
  };
})(Peach);
