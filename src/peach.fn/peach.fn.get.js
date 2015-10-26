Peach.fn.get = function () {
  var a = Array.prototype.slice.call(arguments);
  var r = this._protected.model;
  return Peach.get.apply(this, [r].concat(a));
};
