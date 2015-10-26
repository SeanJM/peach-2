(function () {
  function replace(oldNode) {
    function init(node) {
      if (typeof node === 'object' && node.nodeType === 1) {
        oldNode.parentNode.insertBefore(node, oldNode);
      }
    }
    return {
      with: function (newNode) {
        if (typeof newNode === 'undefined') {
          throw Peach.exception('The rendering of \"' + oldNode.getAttribute('render') + '\" failed because the template did not return valid HTML');
        } else if (typeof newNode.length === 'number') {
          _.forEach(newNode, init);
        } else {
          init(newNode);
        }
        oldNode.parentNode.removeChild(oldNode);
        return newNode;
      }
    }
  }
  Peach.fn.loop = function (nodeList, callback) {
    var self      = this;
    var nodeArray = Array.prototype.slice.call(nodeList);
    _.forEach(nodeArray, function (node) {
      replace(node).with(self.renderNode(node.getAttribute('render')));
    });
    if (typeof callback === 'function') {
      callback(nodeArray);
    }
  };
})();
