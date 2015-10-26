(function () {
  var namePattern   = /^[a-zA-Z0-9\-\_\.]+/;
  var callerPattern = /:[a-zA-Z0-9\-\_\.:]+/;
  var objectPattern = /@[a-zA-Z0-9\_\.@]+/;
  function getArgs(string) {
    var nameMatch   = string.match(namePattern);
    var callerMatch = string.match(callerPattern);
    var objectMatch = string.match(objectPattern);
    var _arguments  = {
      caller : [],
      render : string
    };
    if (!!nameMatch && typeof this._protected.store[nameMatch[0]] !== 'undefined') {
      _arguments.name = nameMatch[0];
      if (!!callerMatch) {
        _arguments.caller = callerMatch[0].substring(1, callerMatch[0].length).split(':');
      }
      _arguments.caller.has = function () {
        for (var i = 0, n = arguments.length; i < n; i++) {
          if (_arguments.caller.indexOf(arguments[i]) < 0) {
            return false;
          }
        }
        return true;
      }
      if (!!objectMatch) {
        _arguments.object = objectMatch[0].substring(1, objectMatch[0].length);
      }
    } else {
      _arguments.name = string;
    }
    return _arguments;
  }
  Peach.getArguments = function () {
    var args       = [].slice.call(arguments);
    var _arguments = {};
    if (typeof args[0] === 'object') {
      _arguments = args[0];
    } else {
      _arguments = getArgs.call(this, args[0]);
    }
    if (typeof _arguments.object === 'string') {
      // this.render('template.name@objectString');
      _arguments.objectName = _arguments.object;
      _arguments.object     = _.cloneDeep(this.get(_arguments.object));
      if (typeof _arguments.object === 'undefined') {
        _arguments.objectName = false;
      }
    } else if (typeof _arguments.object === 'undefined') {
      _arguments.object = {};
    }
    if (typeof args[1] === 'object') {
      // this.render('template.name', {});
      _arguments.object = _.assign(args[1], _arguments.object);
    }
    if (typeof _arguments.object === 'undefined') {
      throw Peach.exception('Rendering of \'' + _arguments.render + '\' failed because the object is \'undefined\'.');
    } else if (_arguments.object === window) {
      throw Peach.exception('Rendering of \'' + _arguments.render + '\' failed because the object passed is \'window\'');
    }
    if (typeof this._protected.store[_arguments.name] === 'object') {
      _arguments.object.string = this._protected.store[_arguments.name].value;
      _arguments.object.self   = _arguments.name;
      // Create empty class
      if (typeof _arguments.object.class === 'undefined') {
        _arguments.object.class = [];
      } else if (typeof _arguments.object.class === 'string') {
        _arguments.object.class = _arguments.object.class.split(' ');
      }
      if (_arguments.object.class.indexOf(_arguments.object.self) < 0) {
        _arguments.object.class.push(_arguments.object.self);
      }
    } else {
      _arguments.object.string = _arguments.name;
      _arguments.object.self   = _arguments.object.self || 'template';
    }
    return _arguments;
  };
})();
