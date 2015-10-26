Peach.fn.get = function () {
  var ref    = this._protected.model;
  var object = [];
  function end(i) {
    if (typeof ref[object[i]] !== 'undefined') {
      ref[object[i]].object = object.join('.');
      return Peach.compose.type(ref[object[i]]);
    } else {
      console.log(arguments);
      throw 'Error: ' + object.join('.') + ' is undefined';
    }
  }
  for (var i = 0; i < arguments.length; i++) {
    object = object.concat(arguments[i].toString().split('.'))
  }
  for (var i = 0; i < object.length; i++) {
    if (/^[0-9]+$/.test(object[i])) {
      object[i] = parseInt(object[i]);
    }
    if (i === object.length - 1) {
      return end(i);
    } else {
      if (typeof ref[object[i]] === 'undefined') {
        return false;
      } else {
        ref = ref[object[i]];
      }
    }
  }
};