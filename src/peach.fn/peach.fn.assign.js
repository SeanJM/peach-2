Peach.fn.assign = function () {
  var value = [].slice.call(arguments, -1)[0];
  var path  = [].slice.call(arguments, 0, -1).join('.');
  _.assign(this.get(path), value);
};
