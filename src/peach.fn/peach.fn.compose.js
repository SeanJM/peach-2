Peach.fn.compose = function (target, prototype) {
  function addTo(k, _target, _prototype) {
    return function () {
      return _prototype[k].apply(_target, arguments);
    }
  }
  function compose(_target, _prototype) {
    var valid = _target !== null && typeof _target === 'object' &&  typeof _target.jquery === 'undefined';
    if (valid) {
      for (var k in _prototype) {
        _target[k] = addTo(k, _target, _prototype);
        compose(_target[k], _prototype[k]);
      }
    }
    return _target;
  }
  return compose(target, prototype);
};
