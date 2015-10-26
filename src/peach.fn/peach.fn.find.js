Peach.fn.find = function (match) {
  var matches = {};
  if (typeof match.test === 'function') {
    for (var key in this._protected.store) {
      if (match.test(key)) {
        matches[key] = this._protected.store[key];
      }
    }
    return matches;
  } else {
    throw Peach.exception('Required a regular expression to find matches');
  }
  return false;
};
