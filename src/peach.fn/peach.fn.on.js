Peach.fn.on = function (_event_, name, callback) {
  if (typeof this._protected.on[_event_][name] === 'undefined') {
    this._protected.on[_event_][name] = [];
  }
  this._protected.on[_event_][name].push(callback);
};

Peach.fn.off = function (_event_, name) {
  this._protected.on[_event_][name] = [];
};
