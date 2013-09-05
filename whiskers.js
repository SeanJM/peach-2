// ------------- Templating */
// Templating
// on develop
// Small Ideas
// The ctrl+7 key combination will bring up a menu allowing you to compile a template

// Big Ideas
// Allow people access to this tool somehow, so they can create templates online
// Don't store any of their data and offer it as a trully free service
// on production
var whiskers = {
  template: {},
  dataFilter: {},
  options: function (object) {
    object.data["index"]     = 1;
    object.data["oddOrEven"] = 'odd';
    object.data["isLast"]    = true;
    object.data["isFirst"]   = true;

    return object;
  },
  _throwError: function (options) {
    var find    = whiskers._find('whiskers-error-window_'+options.code);
    var template  = find.template;
    var data = {};

    data['template-name'] = options.templateName;
    data['file']          = options.file;
    data['url']           = options.src;
    data['data']          = JSON.stringify(options.data);
    data['iterator']      = options.iterator;

    if (options.code === 4) {
      data['error'] = JSON.stringify(options.data).replace(regex,function(m,key) {
        return "<span class='whiskersError-highlight'>"+m+"</span>";
      });
    }

    else if (options.code === 8) {
      data['error'] = JSON.stringify(options.data).replace(regex,function(m,key) {
        return "<span class='whiskersError-highlight'>"+m+"</span>";
      });
    }

    else if (options.code === 9) {
      var regex = new RegExp(options.iterator,'ig');
      data['error'] = JSON.stringify(options.data).replace(regex,function(m,key) {
        return "<span class='whiskersError-highlight'>"+m+"</span>";
      });
    }

    function execute() {
      console.log('exe');
      var options = whiskers.options({file: find.file,template: template,data: data});
      var out     = whiskers.it(options).template;
      return false;
      console.log(out);
      $('body').append(out);
    }

    execute();

    return false;
  },
  _eval: function (string,data) {
    var stringPattern = new RegExp(whiskers._string());
    var variable      = new RegExp(whiskers._var);
    var isVar         = string.match(variable);
    var isInt         = string.match(/^[0-9-]+/);
    var isString      = string.match(stringPattern);
    var out           = '';

    if (isVar) {
      if (data.hasOwnProperty(isVar[6])) {
        if (isVar[0].match(/^!/)) {
          return false;
        } else {
          return data[isVar[6]];
        }
      } else {
        if (isVar[0].match(/^!/)) {
          return true;
        } else {
          return false;
        }
      }
    } else if (isInt) {
      return string;
    } else {
      return isString[0];
    }
    return out;
  },
  _clear: function (string) {
    return string.replace(/(\r\n|\n|\r)/gm,'');
  },
  _match: function (b,r) {
    if (typeof r !== 'undefined') {
      r = new RegExp(b,r);
    } else r = b;
    return r;
  },
  _var        : '((?:!%|%)([a-zA-Z0-9-]+))(`([a-zA-Z-]+))|((?:!%|%)([a-zA-Z0-9-]+))',
  _each       : '%([a-zA-Z0-9-]+)`([a-zA-Z0-9-]+)(?:\\s+|)(?:{([^}]+)}|)',
  _propAll    : '([a-zA-Z0-9-]+)(\\s+|):(\\s+|)\\[([^\\]]+)\\]|([a-zA-Z0-9-]+)(\\s+|):([^;}]+)(?=;|}|$)',
  _prop       : '([a-zA-Z0-9-]+)(?:\\s+|):([^*]+)',
  _iterator   : '\\[([^\\]]+)\\]',
  _string: function (r) {
    return whiskers._match('[\\w=\\/@#%~`:,;\^\&\\.\"\'_\\-<>\\*\\n\\r\\t\\(\\)\\[\\]\\{\\}\\|\\?\\!\\$\\\\\ ]+',r);
  },
  _find: function (string) {
    var options = {};
    var template;
    var val;

    if (whiskers.template.hasOwnProperty(string)) {
      options.template = whiskers.template[string].template;
      options.src      = whiskers.template[string].src;

      if (whiskers.debug) {
        options.template = '<!-- whiskers: '+options.src+' : '+string+' -->\r\n'+options.template;
      }

      return options;
    }

    return false;
  },
  _path: function (path,templateName) {
    var out = templateName;
    if (typeof path !== 'undefined') {
      out = path+'_'+templateName
    }
    return out;
  },
  _getProperties: function (data,string) {
    out          = '';
    properties   = string.match(whiskers._match(whiskers._propAll,'g'));

    if (properties) {
      for (var i=0;i<properties.length;i++) {
        var k          = properties[i];
        var _propGroup = k.match(whiskers._match(whiskers._prop));
        data[_propGroup[1]] = _propGroup[2].replace(/^[ ]+/,'');
      }
    }
    return data;
  },
  _toObj: function (string) {
    var obj = {};
    console.log(string);

    function toProp(string,obj) {
      var out = string.replace(/[\s]+$/,'').match(/([a-zA-Z0-9-]+)(?:\s+|):(?:\s+|)([\s\S]*?)(?=;|$)/);
      obj[out[1]] = out[2];
    }

    function getNest(_string) {
      var _obj = {};
      //var each = _string.match(/[a-zA-Z0-9-]+(\s+|):(\s+|)(\{[\S\s]*?}|[\S\s]*?)(;(?!}|(\s+)}|[\s\S]*?}(;))|$)/g);
      var each = _string.match(/[a-zA-Z0-9-]+(\s+|):(\s+|)(\{[\S\s]*?}|[\S\s]*?)(;|$)/g);
      var nested = /([a-z]+)(?:\s+|):(?:\s+|)({[\s\S]*?}(?!,\{))/;
      var isNested;
      var nestedMatch;
      for (var i=0;i<each.length;i++) {
        isNested = each[i].match(nested);
        if (isNested) {
          _obj[isNested[1]] = [];
          nestedMatch = isNested[2].match(/\{[\s\S]*?}/g);
          for (var j=0;j<nestedMatch.length;j++) {
            _obj[isNested[1]].push(getNest(nestedMatch[j]));
          }
        }
        else {
          toProp(each[i],_obj);
        }
      }
      return _obj;
    }

    obj = getNest(string);
    return obj;
  },
  _get: function (name,options) {
    var find,template,options,out;
    options          = whiskers.options(options);
    find             = whiskers._find(name);
    options.template = find.template;
    out              = whiskers.it(options);
    return out.template;
  },
  _fn: {
    comments: function (options) {
      var options = $.extend({},options);
      var pattern = /^[\s+]+\/\*[\S\s]*?\*\/|^[\s+]+\/\/[\S\s]*?$/gm;
      options.template = options.template.replace(pattern,'');
      return options;
    },
    ifmatch: function (options) {
      options = $.extend({},options);
      var pattern  = /if(\s+|)[\s\S]*?:[\s\S]*?endif/gm;
      var data     = options.data;

      function ifmatch(ternian) {
        var clean      = ternian.replace(/&amp;/g,'&').replace(/&lt;/,'<').replace(/&gt;/,'>');
        var compare    = clean.split(/&&|\|\|/);
        var boolReturn = true;
        var op; // Operation type
        var eval;

        function bool(string) {
          // Match 'string'|variable <>!== 'string'|variable|number
          var match = string.match(/([a-zA-Z0-9-% ]+)(?:[ ]+|)([!=<>]+)(?:[ ]+|)([a-zA-Z0-9-% ]+)/);
          var left,right,condition,out;
          if (match) { // There are conditions
            left      = whiskers._eval(match[1],data);
            condition = match[2];
            right     = whiskers._eval(match[3],data);
            if (condition === '==') out = (left == right);
            else if (condition === '===') out = (left === right);
            else if (condition === '!=')  out = (left != right);
            else if (condition === '!==') out = (left !== right);
            else if (condition === '<=')  out = (left <= right);
            else if (condition === '>=')  out = (left >= right);
            else if (condition === '>')   out = (left > right);
            else if (condition === '<')   out = (left < right);
            return out;
          } else {
            return (whiskers._eval(ternian,data)) ? true : false;
          }
        }

        if (clean.match(/&/)) {
          op = 'and';
        } else if (clean.match(/\|\|/)) {
          op = 'or';
        }

        for (var i=0;i<compare.length;i++) {
          boolReturn = bool(compare[i]);
          if (op === 'or' && boolReturn === true) {
            i=compare.length;
          } else if (op === 'and' && boolReturn === false) {
            i=compare.length;
          }
        }
        return boolReturn;
      }

      function execute() {
        var boolGroup,left,condition,right,bool,content,ifgroup;

        options.template = options.template.replace(pattern,function (m) {
          var ifPattern      = /if(?:\s+|)(.*?):(?:\s+|)(.*?)(?:\s+|)(endif|else)/m;
          var elsePattern    = /^(?:[\s+ ]+|):(?:\s+|)([\s\S]*?)(?:\s+|)(endif)/m;
          var contentPattern = /(.*?)(else|endif)/;
          var ifgroup        = m.match(ifPattern);
          var elsegroup      = m.match(elsePattern);
          var condition,content;

          while (ifgroup) {
            ifgroup   = m.match(ifPattern);
            elsegroup = m.match(elsePattern);
            // if Statement
            if (ifgroup) {
              condition = ifmatch(ifgroup[1]);
              content   = ifgroup[2];
            } else {
              if (elsegroup) {
                condition = true;
                content   = elsegroup[1];
              }
            }
            if (condition) {
              return content;
            }
            m = m.replace(ifPattern,'');
          }
          return '';
        });
      }

      if (options.template.match(pattern)) {
        execute();
      }

      return options;
    },
    insert: function (options) {
      var data = options.data;
      var pattern = whiskers._match(whiskers._var,'g');
      options.template = options.template.replace(pattern,function (m) {
        var _out   = m;
        var _match = m.match(whiskers._var);
        // Not attached
        if (typeof _match[2] === 'undefined') {
          if (data.hasOwnProperty(_match[6])) {
            _out = data[_match[6]];
          } else {
            _out = '';
          }
        }
        return _out;
      });
      return options;
    },
    get: function (options) {
      options = $.extend({},options);
      var properties,templateName,_match,data,pattern,_obj,iterator,arr,iteratorData,index,oddOrEven,newData,isLast,isFirst,tmpOptions;
      data    = options.data;
      pattern = /(?:%([a-zA-Z0-9-]+)|)(?:(`[a-zA-Z0-9-]+))(?:\s+|)({([\s\S]*?)}(?!,|\s+}|;)|)/g;
      arr     = [];

      options.template = options.template.replace(pattern,function (m) {
        _match         = m.match(/(?:%([a-zA-Z0-9-]+)|)(?:`([a-zA-Z0-9-]+))(?:\s+|)(?:({[\s\S]*?})(?!,|\s+}|;)|)/);
        iterator       = _match[1];
        templateName   = _match[2];
        properties     = _match[3];
        options.inside = true;

        if (typeof properties !== 'undefined') {
          _obj = whiskers._toObj(properties);
          $.extend(options.data,_obj);
        }

        if (typeof iterator === 'string') {
          if (options.data.hasOwnProperty(iterator)) {
            for (var i=0;i<options.data[iterator].length;i++) {
              iteratorData              = $.extend({},options.data[iterator][i]);
              iteratorData['index']     = (i+1);
              iteratorData['oddOrEven'] = (i%2 === 0) ? 'odd' : 'even';
              iteratorData['isLast']    = (i+1 === options.data[iterator].length) ? 'true' : 'false';
              iteratorData['isFirst']   = (i < 1) ? 'true' : 'false';
              tmpOptions                = {inside: true,data: iteratorData};

              arr.push(whiskers._get(templateName,tmpOptions));
            }
            return arr.join('');
          }
        } else {
          return whiskers._get(templateName,options);
        }
      });
      return options;
    },
    clean: function (options) {
      options = $.extend({},options);
      var pattern = /\{:([\S\s]*?):\}/gm;
      var match;
      options.template = options.template.replace(pattern,function (m) {
        match = m.match(/\{:([\S\s]*?):\}/);
        if (match) {
          return match[1];
        } else {
          return m;
        }
      });
      return options;
    }
  }, /* FN */
  it: function (options) {
    var pattern  = new RegExp('(?:\\s+|){:[\\S\\s]*?:}','gm');

    if (options.template.match(pattern) || options.inside) {
      options = whiskers._fn['comments'](options);
      options = whiskers._fn['ifmatch'](options);
      options = whiskers._fn['insert'](options);
      options = whiskers._fn['get'](options);
      options = whiskers._fn['clean'](options);
    }

    return options;
  },
  setTime: function (timeStart) {
    var timeEnd = new Date();
    console.log(((timeEnd.getTime()-timeStart.getTime())/1000)+'s');
  },
  init:function (data,callback) {
    var whisker     = $('template[whiskers]');
    var template    = whisker.html();
    var whiskerAttr = whisker.attr('whiskers');
    var templates   = whiskers._clear(whiskerAttr.match(/[ ]+templates:([\t\r\n\.\/a-zA-Z0-9_, ]+)(;|)/)[1]).replace(/ /g,'').split(',');
    var timeStart   = new Date();

    whiskers.debug  = (whiskerAttr.match(/debug([ ]+|);/)) ? true : false;

    function add (file,template) {
      var _match, k, match, name, pattern, content;
      pattern = /<template [a-zA-Z0-9-_]+>[\S\s]*?<\/template>/g;
      match   = template.match(pattern);

      for (var i=0;i<match.length;i++) {
        _match  = match[i].match(/<template ([a-zA-Z0-9-_]+)>([\S\s]*?)<\/template>/);
        name    = _match[1]
        content = _match[2];

        whiskers.template[name] = {
          src: file,
          template: content
        }
      }
    }

    function load (arr,index,callback) {
      function execute() {
        $('<div/>').load(arr[index],function (d,k) {
          if (k === 'success') {
            add(arr[index],d);
            load(arr,index+1,callback);
          } else {
            whiskers._throwError({code: 2,file: arr[index]});
          }
          if ((index+1) === arr.length && typeof callback === 'function') {
            callback();
          }
        });
      }
      if (typeof arr[index] !== 'undefined') {
        execute();
      }
    }

    load(templates,0,function () {
      if (typeof callback === 'function') {
        callback();
      }
      template = whiskers.it({template:template,data:data}).template;
      $('body').prepend(template);
      whiskers.setTime(timeStart);
    });

  }
}