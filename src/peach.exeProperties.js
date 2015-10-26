Peach.exeProperties = function () {
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push(arguments[i]);
  }
  for (var k in arguments[0]) {
    if (typeof arguments[0][k] === 'function') {
      arguments[0][k].apply(this, args);
    }
  }
};