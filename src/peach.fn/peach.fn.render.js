Peach.fn.render = function (_arguments) {
  _arguments = Peach.getArguments.apply(this, arguments);
  if (Array.isArray(_arguments.object)) {
    throw Peach.exception('Peach.fn.render of "' + _arguments.name + '" failed. An array was passed as an argument, instead of an object. Use "Peach.fn.renderEach" instead.');
  }
  Peach.fn.emit.call(this, this._protected.on.render, _arguments, _arguments.caller);
  Peach.setAttr.call(this, _arguments.object);
  return Peach.fn.fill.call(this, _arguments);
};
