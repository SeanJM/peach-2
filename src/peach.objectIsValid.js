Peach.objectIsValid = function(o) {
  return o !== null && typeof o === 'object' && o !== window && typeof o.jquery === 'undefined' && !(o instanceof HTMLElement) && o.view !== window;
};