Peach.fn.tools = function (target) {
  var self  = this;
  var tools = {};
  if (typeof target.class === 'undefined') {
    target.class = [];
  } else if (typeof target.class === 'string') {
    target.class = target.class.split(' ');
  }
  for (var k in Peach.fn.tools) {
    tools[k] = (function (k) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(target);
        return Peach.fn.tools[k].apply(self, args);
      }
    })(k);
  }
  return tools;
};
