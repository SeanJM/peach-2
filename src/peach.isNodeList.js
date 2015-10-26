Peach.isNodeList = function (nodes) {
  var str      = Object.prototype.toString.call(nodes),
      nodeList = /^\[object (HTMLCollection|NodeList)\]$/.test(str),
      len      = nodes.hasOwnProperty('length'),
      nodeHas  = len && typeof nodes[0] === 'object' && nodes[0].nodeType && nodes[0].nodeType > 0,
      out;
  if (nodeHas) {
    return true;
  } else if (nodeList && len) {
    return true;
  } else {
    return false;
  }
};
