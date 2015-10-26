(function (window) {
  function isObject (_arguments) {
    var self   = this;
    var keys   = _.keys(this._protected.attr);
    var unsafe = ['self', 'attr', 'string', 'class', 'style'].concat(keys);
    function extend (to, from) {
      if (from !== window) {
        for (var k in from) {
          // Will not extend underscored values
          if (unsafe.indexOf(k) < 0 && typeof to[k] === 'undefined' && k[0] !== '_') {
            to[k] = from[k];
          }
        }
      }
    }
    function replaceTemplate(node) {
      var _newArguments = Peach.getArguments.call(self, node);
      if (Array.isArray(_newArguments.object)) {
        for (var i = 0; i < _newArguments.object.length; i++) {
          extend(_newArguments.object[i], _arguments.object);
        }
      } else {
        extend(_newArguments.object, _arguments.object);
      }
      return Peach.fn.render.call(self, _newArguments);
    }
    function replaceKey(match) {
      var type = typeof _arguments.object[match];
      function objectRef() {
        var local = _.get(_arguments.object, match);
        if (typeof local !== 'undefined') {
          return local;
        }
        return _.get(self._protected.model, match);
      }
      function ref() {
        if (['string' , 'number'].indexOf(type) > -1) {
          return replaceVariables(_arguments.object[match].toString());
        } else {
          return '';
        }
      }
      if (typeof onVar === 'function') {
        match = onVar.call(_arguments.object, match);
        type  = typeof match;
        if (type === 'undefined') {
          throw onVarError;
        }
        return match;
      } else if (match.indexOf('.') > -1) {
        return objectRef();
      } else {
        return ref();
      }
    }
    function replaceVariables(string) {
      string = string.replace(self._protected.variable, function (n, match) {
        return replaceKey(match);
      });
      string = string.replace(self._protected.template, function (n, node) {
        return replaceTemplate(node);
      });
      string = string.replace(self._protected.variable, function (n, match) {
        return replaceKey(match);
      });
      return string;
    }
    return replaceVariables(_arguments.object.string);
  }
  function isArray (_arguments) {
  	var each = [];
  	for (var i = 0; i < _arguments.object.length; i++) {
  		each.push(Peach.fn.fill(_arguments.object[i]));
  	}
  	return each.join('');
  }
  Peach.fn.fill = function (_arguments) {
    _arguments  = Peach.getArguments.apply(this, arguments);
    if (Array.isArray(_arguments.object)) {
      return isArray.call(this, _arguments);
    } else {
      return isObject.call(this, _arguments);
    }
  };
})(window);
