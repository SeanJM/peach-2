Peach.fn.objectIsEmpty = function (object) {
  for (var k in object) {
    if (object.hasOwnProperty(k)) {
      return true;
    }
  }
  return false;
};
