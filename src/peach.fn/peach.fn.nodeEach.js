(function (Peach) {
  function getNodeList(render) {
    var div       = document.createElement('div');
    div.innerHTML = render;
    return Array.prototype.slice.call(div.children);
  }
  Peach.fn.nodeEach = function () {
    var _arguments = Peach.getArguments.apply(this, arguments);
    var nodeList   = getNodeList(this.renderEach(_arguments));
    var self       = this;
    _.forEach(nodeList, function (node) {
      self.emit(self._protected.on.node, _arguments, node);
    });
    return nodeList;
  };
})(Peach);
