Peach.fn.clone = function () {
  var a = Array.prototype.slice.call(arguments);
  var r = this._protected.model;
  return _.cloneDeep(Peach.get.apply(this, [r].concat(a)));
};
