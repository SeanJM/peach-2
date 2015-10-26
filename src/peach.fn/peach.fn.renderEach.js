(function () {
  function augment (i, n, object, name) {
    object.index  = i;
    object.length = n;
    if (typeof object.class === 'undefined') {
      object.class = [];
    } else if (typeof object.class === 'string') {
      object.class = object.class.split(' ');
    }
    // Odd or Even
    if (i % 2) {
      object.class.push(name + '--even');
    } else {
      object.class.push(name + '--odd');
    }
    // Position
    if (i === 0 && n === 1) {
      object.class.push(name + '--first-and-last');
    } else if (i === 0) {
      object.class.push(name + '--first');
    } else if (i > 0 && i < n - 1) {
      object.class.push(name + '--member');
    } else {
      object.class.push(name + '--last');
    }
    return object;
  }
  Peach.fn.renderEach = function (_arguments) {
    var each       = [];
    var _arguments = Peach.getArguments.apply(this, arguments);
    if (!Array.isArray(_arguments.object)) {
      throw Peach.exception('Peach.fn.renderEach of "' + _arguments.name + '" failed. An array is required as an argument, not a type of: ' + typeof _arguments.object + '.');
    }
    for (var i = 0, n = _arguments.object.length; i < n; i++) {
      each.push(Peach.fn.render.call(this, {
        name   : _arguments.name,
        caller : _arguments.caller,
        object : augment(i, n, _arguments.object[i], _arguments.name)
      }));
    }
    return each.join('\n');
  };
})();
