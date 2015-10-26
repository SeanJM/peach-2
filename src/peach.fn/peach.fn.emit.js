Peach.fn.emit = function (emitter, _arguments) {
  // template:caller1:caller2:caller3
  // template:caller3
  // template:caller2
  // template:caller1
  var args = Array.prototype.slice.call(arguments, 2, arguments.length);
  var n;
  function emit(composed) {
    if (Array.isArray(emitter[composed])) {
      for (var i = 0, n = emitter[composed].length; i < n; i++) {
        emitter[composed][i].apply(_arguments.object, args);
      }
    }
  }
  if (Array.isArray(_arguments.caller)) {
    for (n = _arguments.caller.length; n > 1; n--) {
      emit(_arguments.name + ':' + _arguments.caller.slice(0, n).join(':'));
    }
    for (n = _arguments.caller.length - 1; n >= 0; n--) {
      emit(_arguments.name + ':' + _arguments.caller[n]);
    }
    if (_arguments.caller.length > 1) {
      emit([_arguments.name].concat(_arguments.caller).join(':'));
    }
  }
  emit(_arguments.name);
};
