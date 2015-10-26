Peach.compose.object = function (value) {
  for (var k in value) {
    value[k] = Peach.compose.type(value[k]);
  }
  Peach.compose(value, Peach.prototype.object);
};