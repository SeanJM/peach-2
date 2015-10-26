(function (Peach) {
  function getNodeList(render) {
    var div      = document.createElement('div');
    div.innerHTML = render;
    return div.children.length > 1 ? Array.prototype.slice.call(div.children) : div.children[0];
  }
  Peach.fn.renderNode = function () {
    var _arguments = Peach.getArguments.apply(this, arguments);
    var nodeList   = getNodeList(this.render(_arguments));
    this.emit(this._protected.on.node, _arguments, nodeList, _arguments.caller);
    return nodeList;
  };
})(Peach);
