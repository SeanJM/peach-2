(function () {
  var routerKeys = false;
  function removeHtml (s) {
    return s.toString().replace(/<[^>]+>/g, '');
  }
  function getName (settings, name) {
    var attrName = settings.router[name];
    return typeof attrName === 'object' ? attrName.value : _.kebabCase(name);
  }
  function getValue (settings, attrName, attrValue) {
    var attrRouter  = settings.router[attrName];
    var attrProcess = typeof attrRouter === 'object' ? attrRouter.process : false;
    if (typeof attrProcess === 'function') {
      attrValue = attrProcess(attrValue);
    } else if (typeof attrValue !== 'undefined') {
      return attrValue.toString();
    }
    if (typeof attrValue === 'string' && attrValue.length) {
      return attrValue;
    }
    return false;
  }
  function setAttr (options, settings) {
    var out = [];
    _.forEach(settings.attr, function (attrValue, attrName) {
      var name   = getName(settings, attrName);
      var value  = getValue(settings, attrName, attrValue);
      var render = name + '="' + removeHtml(value) + '"';
      if (value) {
        options['attr_' + attrName] = render;
        out.push(render);
      }
    });
    options.attr = out.join(' ');
  }
  Peach.setAttr = function (options) {
    var router = this._protected.attr;
    var attr   = _.pick(options, function (a, k) {
      return typeof router[k] === 'object' || /^data/.test(k);
    });
    if (!routerKeys) {
      routerKeys = _.keys(router);
    }
    var settings = {
      router     : router,
      routerKeys : routerKeys,
      attr       : attr,
      list       : {},
      attrKeys   : _.keys(attr).sort(function (a, b) {
        if (routerKeys.indexOf(a) > routerKeys.indexOf(b)) {
          return 1;
        }
        return -1;
      }),
    };
    setAttr(options, settings);
  };
})();
