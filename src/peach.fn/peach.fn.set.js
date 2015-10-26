Peach.fn.set = function () {
  return Peach.set.apply(this, [this._protected.model].concat(Array.prototype.slice.call(arguments)));
};
