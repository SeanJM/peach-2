Peach.fn.fill.preprocess = function (options) {
  Peach.exeProperties.call(this, Peach.fn.fill.preprocess, options);
};

Peach.fn.fill.preprocess.attr = function (options) {
  var attr = this._protected.attr;
  for (var k in attr) {
    if (typeof attr[k].preprocess === 'function') {
      attr[k].preprocess.call(this, options);
    }
  }
};

Peach.fn.fill.preprocess.type = function (options) {
  for (var k in options) {
    Peach.compose.type(options[k]);
  }
};