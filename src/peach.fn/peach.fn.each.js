Peach.fn.each = function (collection, callback) {
  if (Array.isArray(collection)) {
    for (var i = 0, n = collection.length; i < n; i++) {
      callback(collection[i], i, n, collection);
    }
  } else {
    for (var key in collection) {
      if (this._protected.unsafe.indexOf(key) < 0) {
        callback(collection[key], key);
      }
    }
  }
  return collection;
};
