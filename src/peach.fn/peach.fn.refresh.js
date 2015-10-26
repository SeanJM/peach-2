Peach.fn.refresh = function (name, object) {
  var dataBinding = this._protected.dataBinding;
  var nodeList    = _.uniq(dataBinding[name].sort(function (a, b) {
    if (a === b) { return 1; }
    return -1;
  }), true);
  var newList  = [];
  var self     = this;
  for (var i = 0, n = nodeList.length; i < n; i++) {
    if (document.body.contains(nodeList[i])) {
      newList.push(nodeList[i]);
    }
  }
  dataBinding[name] = newList;
  _.forEach(dataBinding[name], function (oldNode, i) {
    var newNode = peach.renderNode(name, object);
    oldNode.parentNode.replaceChild(newNode, oldNode);
    self.bind(name, newNode);
  });
  return dataBinding[name];
};
