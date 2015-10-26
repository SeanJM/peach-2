Peach.fn.add = function (arg) {
  function string() {
    var names  = arg.match(/^[a-zA-Z0-9\-\_\:\.]+/gm) || [];
    var groups = arg.split(/^[a-zA-Z0-9\-\_\:\.]+/gm) || [];
    var _this  = this;
    var match;

    function getTab(group) {
      var tab = group.match(/\n(\s+)/);
      if (tab !== null) {
        return new RegExp('\\n(' + tab[1] + ')', 'g');
      }
      return false;
    }

    function add(index, name) {
      var tab   = getTab(groups[index]);
      var obj   = {};
      if (/:/.test(name)) {
        throw 'Peach illegal: \":\" in template name "' + name + '"';
      }
      obj[name] = {
        value: groups[index].replace(/\s+$/,'')
      };
      if (tab) {
        obj[name].value = obj[name].value.replace(tab, function (m, t, index) {
          if (index > 0) {
            return '\n';
          } else {
            return '';
          }
        });
      } else {
        obj[name].value = obj[name].value.trim();
      }
      _this.add(obj);
    }

    groups.splice(0, 1);

    for (var i = 0; i < names.length; i++) {
      add(i, names[i]);
    }
  }

  function object() {
    for (var k in arg) {
      if (typeof this._protected.store[k] !== 'undefined') {
        throw Peach.exception('Cannot add template \"' + k + '\", this template already exists.');
      }
      this._protected.store[k] = arg[k];
    }
  }

  if (typeof arg === 'string') {
    string.call(this);
  } else if (typeof arg === 'object') {
    object.call(this);
  } else if (typeof arg === 'undefined') {
    throw 'Peach.fn.add requires either a string or an object as an argument.';
  }
};
