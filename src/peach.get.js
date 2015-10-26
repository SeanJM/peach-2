Peach.get = function (object) {
  var path = [].slice.call(arguments, 1, arguments.length).join('.');
  return _.get(object, path);
};
