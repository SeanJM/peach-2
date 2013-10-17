// ------------- Templating */
// Templating
// on develop
// Small Ideas
// The ctrl+7 key combination will bring up a menu allowing you to compile a template

// Big Ideas
// Allow people access to this tool somehow, so they can create templates online
// Don't store any of their data and offer it as a trully free service
// on production

/* Global Stuff */

var peach = {
  template: {},
  dataFilter: {},
  options: function (object) {
    object.data["index"]     = 1;
    object.data["oddOrEven"] = 'odd';
    object.data["isLast"]    = true;
    object.data["isFirst"]   = true;

    return object;
  },
  cloneObj: function (object) {
    for (k in object.destination) {
      object.source[k] = object.destination[k];
    }
    return object;
  },
  _fn: {},
  _error: function (options) {
    var error = {
      template:'<span class="peach-error"><span class="peach-error_text">%text</span></span>',
      code: options.code
    }
    var out = '';
    if (error.code === 1) {
      error.text = 'Template file: <strong>'+options.file+'</strong> does not exists.';
    } else if (error.code === 2) {
      error.text = 'Template: <strong>'+options.name+'</strong> does not exist.';
    } else if (error.code === 3) {
      error.text = 'Template: '+peach.find(options.name).src+' : '+options.name+'<br/>Variable: <strong>'+options.variable+'</strong> is undefined.';
    } else if (error.code === 4) {
      error.text = 'Unmatched Brackets: the <strong>'+options.name+'</strong> template has a bad nest.';
    } else if (error.code === 5) {
      error.text = 'Undefined Function: <strong>'+options.fn+'</strong><br/>Please define this function using: peach._fn.'+options.fn;
    }
    if (peach.debug) {
      out = error.template.replace(/%[a-z]+/g,function (m) {
        return error[m.match(/%([a-z]+)/)[1]];
      });
    }
    return out;
  },
  ifeval: function (string,data) {
    var eval = peach.eval(string,data);
    if (string.match(/^!/)) {
      if (eval.length > 0) {
        return false;
      }
    } else if (eval.length < 1) {
      return false;
    }
    return true;
  },
  eval: function (string,data) {
    string      = string.replace(/^\s+|\s+$/g,'');
    var pattern = '(?:!|)%([a-zA-Z0-9-]+)(?:\\|\\{([\\s\\S]*?)\\}|)(?:(?:\\.)([a-zA-Z0-9]+(?:=>([a-zA-Z0-9_]+)|=&gt;([a-zA-Z0-9_]+)|))|)';
    var _match  = string.match(pattern);


    function hasPattern() {
      var _var    = _match[1];
      var _alt    = _match[2];
      var _prop   = _match[3];
      var result;
      if (data.hasOwnProperty(_var) && data[_var].length > 0) {
        result = data[_var].replace(/^\s+|\s+$/g,'');
        if (typeof _prop === 'string') {
          return peach._toProp(result,_prop);
        } else {
          return result;
        }
      } else if (typeof _alt === 'string') {
        return peach.it({template: _alt,data: data}).template;
      } else {
        return '';
      }
    }

    if (_match) {
      return hasPattern();
    } else {
      return string;
    }
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
  find: function (name) {
    var options = {};
    var template;
    var val;

    if (peach.template.hasOwnProperty(name)) {
      options.template = peach.template[name].template;
      options.src      = peach.template[name].src;
      options.file     = peach.template[name].src.split('/')[peach.template[name].src.split('/').length-1];

      return options;
    }

    return false;
  },
  get: function (name,data) {
    var find = peach.find(name);
    var comment = '';
    if (find) {
      if (peach.debug) {
        var tn_spacer = (new Array((26-name.length > 0)?26-name.length:1)).join(' ');
        var tf_spacer = (new Array(16-find.file.length)).join(' ');
        var comment   = '<!-- {Peach} '+find.file+tf_spacer+': '+name+tn_spacer+'-->\n';
      }
      return comment+peach.js.iterate(name,data);
    } else {
      return peach._error({code: 2,name: name});
    }
  },
  js: {
    iterate: function (name,data) {
      var iterData = {};
      var arr      = [];
      var find     = peach.find(name);
      var template = find.template;
      var out;
      function ifString_convertToObject(unknown) {
        if (typeof unknown === 'object') {
          return unknown;
        } else {
          return peach._stringToObject(unknown);
        }
      }
      // is an Array
      if ($.isArray(data)) {
        for (var i=0;i<data.length;i++) {
          iterData              = ifString_convertToObject(data[i]);
          iterData['index']     = (i+1).toString();
          iterData['oddOrEven'] = (i%2 === 0) ? 'odd' : 'even';
          iterData['isLast']    = (i+1 === data.length) ? 'true' : 'false';
          iterData['isFirst']   = (i < 1) ? 'true' : 'false';
          iterData['length']    = data.length.toString();
          arr.push(peach.it({name: name,template: template,data: iterData}).template);
        }
        return arr.join('');
      } else {
        // is an Object
        return peach.it({name: name,template: template,data: data}).template;
      }
    },
  },
  _getNest: function (pattern,string) {
    var start = pattern.substr(pattern.length-2,1);
    var end   = pattern.substr(pattern.length-1,1);
    pattern   = [pattern.substr(0,pattern.length-2),'(?:\\s+|)\\',start,'[\\s\\S]*?',end];
    var match = string.match(pattern.join(''));
    if (match) {
      while (match && match[0].match(new RegExp('\\'+start,'g')).length > match[0].match(new RegExp(end,'g')).length) {
        pattern.push('[\\s\\S]*?',end);
        match = string.match(pattern.join(''));
      }
      pattern.splice(3,0,'(?:\\s+|)(');
      pattern.splice(pattern.length-1,0,')(?:\\s+|)');
      return pattern.join('');
    }
    return false;
  },
  _stringToJavaScript: function (string) {
    var js;

    // Objects
    function toObject(string) {
      var property;
      var obj = {};
      while (string.match(/[a-zA-Z0-9-]+(\s+|)\{/)) {
        property  = peach._getNest('('+string.match(/([a-zA-Z0-9-]+)(\s+|)\{/)[1]+'){}',string);
        string    = string.replace(new RegExp(property),function (m) {
          match = m.match(property);
          obj[match[1]] = match[2];
          return '';
        });
      }
      return obj;
    }

    // Arrays
    function isArray(string) {
      /*
        Clean leading and trailing spaces from the string
        to determine whether or not it satisfies the con-
        dition of being an array
      */
      string = string.replace(/^\s+|\s+$/g,'');
      if (string.match(/^\[[\S\s]*?\]$/m)) {
        return true;
      } else {
        return false;
      }
    }

    function toArray(string) {
      var arr  = [];
      var nest;
      while (string.match(/^\[/)) {
        nest = peach._getNest('^[]',string);
        arr.push(peach._stringToJavaScript(string.match(nest)[1]));
        string = string.replace(new RegExp(nest),'');
      }
      return arr;
    }

    if (isArray(string)) {
      js = toArray(string);
    } else {
      js = toObject(string);
    }
    return js;
  },
  _toProp: function (unknown,prop) {
    function propFn(unknown) {
      return {
        toLower: function () {
          return unknown.toLowerCase();
        },
        toUpper: function () {
          return unknown.toUpperCase();
        },
        length: function () {
          return unknown.length;
        },
        toDash: function () {
          return unknown.toLowerCase().replace(/\s+/g,'-');
        }
      }
    }
    if (prop) { // For IE 8
      var isFn = prop.match(/=>([a-zA-Z0-9+]+)/);
      if (isFn) {
        if (typeof peach._fn[isFn[1]] === 'function') {
          return peach._fn[isFn[1]](unknown);
        } else {
          return peach._error({code: 5,fn: isFn[1]});
        }
      } else {
        if (typeof propFn()[prop] === 'function') {
          return propFn(unknown)[prop]();
        } else {
          return unknown+'.'+prop;
        }
      }
    } else {
      return unknown;
    }
  },
  script: {
    comments: function (options) {
      options.template = options.template.replace(/^[\s+]+\/\*[\S\s]*?\*\/(\s+|)[\n]+|[\s+]+\/\/[\S\s]*?$/gm,'');
      return options;
    },
    ifmatch: function (options) {
      function bool(string,data) {
        // Match 'string'|variable <>!== 'string'|variable|number
        string = string.replace(/^\s+|\s+$/g,'');
        var match = string.match(/([\s\S]*?)(?:\s+|)([!=<>]+)(?:\s+|)([\s\S]*?)$/);
        var left,right,condition,out;
        if (match) { // There are conditions
          left      = peach.eval(match[1],data);
          condition = match[2];
          right     = peach.eval(match[3],data);
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
          return (peach.ifeval(string,data)) ? true : false;
        }
      }

      function hasElse(string,pattern) {
        var hasElse = string.match(pattern+'(?:\\s+|)([a-zA-Z]{4}|)')[2];
        if (hasElse == 'else') {
          return true;
        } else {
          return false;
        }
      }

      function getWholeIf(string) {
        var pattern       = peach._getNest('if(?:\\s+|)\\([\\s\\S]*?\\){}',string);
        if (hasElse(string,pattern)) {
          while (peach._getNest(pattern+'else if(?:\\s+|)\\([\\s\\S]*?\\){}',string)) {
            pattern = peach._getNest(pattern+'else if(?:\\s+|)\\([\\s\\S]*?\\){}',string);
          }
          if (peach._getNest(pattern+'(?:\\s+|)(else){}',string)) {
            pattern = peach._getNest(pattern+'(?:\\s+|)(else){}',string);
          }
        }
        return new RegExp(pattern);
      }

      function group(arr) {
        var out = arr;
        out.splice(1,0,'(');
        out.splice(arr.length-1,0,')');
        out.push('((?:\\s+|)else(?:\\s+|)|)')
        return out;
      }

      function ifmatch(ternian) {
        var clean      = ternian.replace(/&amp;/g,'&').replace(/&lt;/,'<').replace(/&gt;/,'>');
        var compare    = clean.split(/&&|\|\|/);
        var boolReturn = true;
        var op; // Operation type
        var eval;

        if (clean.match(/&/)) {
          op = 'and';
        } else if (clean.match(/\|\|/)) {
          op = 'or';
        }

        for (var i=0;i<compare.length;i++) {
          boolReturn = bool(compare[i],options.data);
          if (op === 'or' && boolReturn === true) {
            i=compare.length;
          } else if (op === 'and' && boolReturn === false) {
            i=compare.length;
          }
        }
        return boolReturn;
      }

      function getIf(string) {
        var _if = peach._getNest('^if(?:\\s+|)\\(([\\s\\S]*?)\\){}',string);
        if (_if) { _if += '((\\s+|)else(\\s+|)|)'; }
        return _if;
      }

      function ifProcess(string) {
        // Get the if
        /*
          1. Process if statement -- if true, replace entire string with contents
          2. If statement is false, remove it and a possible 'else' and reprocess
        */
        function doIf () {
          var _if        = getIf(string);
          var _ifmatch   = string.match(_if);
          var _else      = peach._getNest('^{}',string);
          var _elsematch = string.match(_else);

          if (_if) {
            if (ifmatch(_ifmatch[1])) {
              string = _ifmatch[2];
            } else {
              string = string.replace(new RegExp(_if),'');
              doIf();
            }
          } else if (_else) {
            string = _elsematch[1];
          } else {
            string = "";
          }
        }
        doIf();
        return string;
      }

      function execute() {
        while (options.template.match(/if(\s+|)\([\s\S]*?\)/)) {
          options.template = options.template.replace(getWholeIf(options.template),function (m) {
            return ifProcess(m);
          });
        }
      }

      execute();

      return options;
    },
    insert: function (options) {
      var pattern = '%([a-zA-Z0-9-]+)(?:\\|\\{([\\s\\S]*?)\\}|)(?:(?:\\.)([a-zA-Z0-9]+(?:=>([a-zA-Z0-9_]+)|=&gt;([a-zA-Z0-9_]+)|))|)';
      var eval;
      options.template = options.template.replace(new RegExp(pattern,'g'),function (m) {
        return peach.eval(m,options.data);
      });
      return options;
    },
    get: function (options) {
      function execute() {
        var pattern = '`([a-zA-Z0-9-_]+)';

        while (options.template.match(pattern)) {
          var templateMatch      = options.template.match(pattern);
          var templateName       = templateMatch[1];
          var templateNest       = peach._getNest('('+templateMatch[0]+'){}',options.template);
          var templateProperties = {};
          var nest;


          if (templateNest) {
            nest = options.template.match(templateNest);
            if (nest) {
              templateProperties = peach._stringToJavaScript(nest[2]);
            } else {
              $('body').append(peach._error({code: 4,name: templateName}));
              break;
            }
          } else {
            templateNest = pattern;
          }

          peach.cloneObj({source: options.data, destination: templateProperties});

          options.template = options.template.replace(new RegExp(templateNest),function (m) {
            return peach.get(templateName,templateProperties);
          });
        }
      }

      execute();

      return options;
    },
    atGet: function (string) {
      string = string.replace(/@\{[a-zA-Z0-9-]+\}/g,function (m) {
        var find = peach.find(m.match(/@\{([a-zA-Z0-9-]+)\}/)[1]);
        if (find) {
          return find.template;
        } else {
          return m;
        }
      });
      return string;
    }
  }, /* FN */
  it: function (options) {
    peach.script['comments'](options);
    peach.script['ifmatch'](options);
    peach.script['insert'](options);
    peach.script['get'](options);
    return options;
  },
  setTime: function (timeStart) {
    var timeEnd = new Date();
    if (peach.debug) {
      $('body').append('<!-- peach template render time: '+((timeEnd.getTime()-timeStart.getTime())/1000)+'s -->');
    }
  },
  start: function (options) {
    var _options = $.extend(options,{});
    return options.template.replace(/~![\s\S]*?!~/g,function (m) {
      _options.template = m.match(/~!([\s\S]*?)!~/)[1];
      return peach.script['atGet'](peach.it(_options).template.replace());
    });
  },
  init:function (data,options) {
    var defaults          = {directory: 'templates/'};
    var peachData         = $('div[data-peach]'); // Check to see if the data-peach is present, if not, throw an error
    var template          = peachData.html();
    var peachAttr         = peachData.attr('data-peach');
    var directory         = options.directory||defaults.directory;
    var templates         = toTemplateFile(peach._clear(peachAttr.match(/templates:([\t\r\n\.\/a-zA-Z0-9_, ]+)(;|)/)[1]).replace(/ /g,'').split(','),directory);
    var timeStart         = new Date();
    var container;

    peach.initTemplate = template;
    peach.initData     = data;
    peach.debug        = (peachAttr.match(/debug(\s+|);/)) ? true : false;
    peach.autoRefresh  = (peachAttr.match(/autoRefresh(\s+|);/)) ? true : false;

    function toTemplateFile(files,directory) {
      var arr = [];
      for (var i=0;i<files.length;i++) {
        arr.push(directory+files[i]+'.ptl');
      }
      return arr;
    }

    function add (file,template) {
      var match         = peach._getNest('`([a-zA-Z0-9-_]+){}',template);
      if (match) {
        var templateMatch = template.match(match);
        var name          = templateMatch[1];
        var content       = templateMatch[2];

        peach.template[name] = {
          src: file,
          template: content
        }

        template = template.replace(new RegExp(match),function (m) {
          return '';
        });

        add(file,template);
      }
    }

    function load (filesArray,index,callback) {
      function execute() {
        $('<div/>').load(filesArray[index],function (d,k) {
          if (k === 'success') {
            add(filesArray[index],d);
            load(filesArray,index+1,callback);
          } else {
            $('body').append(peach._error({code: 1,file: filesArray[index]}));
          }
          if ((index+1) === filesArray.length && typeof callback === 'function') {
            callback();
          }
        });
      }
      if (typeof filesArray[index] !== 'undefined') {
        execute();
      }
    }

    load(templates,0,function () {
      template = peach.start({template:template,data:data});
      if ($('.peach-container').size() < 1) {
        container = $('<div class="peach-container"></div>');
        $('div[data-peach]').after(container);
        $('div[data-peach]').remove();
      }
      $('.peach-container').html(template);
      peach.setTime(timeStart);
      if (typeof options.onload === 'function') {
        options.onload();
      }
    });

  }
}