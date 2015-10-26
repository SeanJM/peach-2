/**
* Peach.fn.bind({
*   'model.name.path' : [{
*     node    : node,
*     template: 'templateName',
*   }]
* });
*/

Peach.fn.bind = function (name, node) {
  var array = this._protected.dataBinding[name];
  _.remove(array, function (_node_) {
    return !document.body.contains(_node_);
  });
  if (Array.isArray(array)) {
    if (array.indexOf(node) === -1) {
      array.push(node);
    }
  } else {
    this._protected.dataBinding[name] = [node];
  }
};
