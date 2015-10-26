(function () {
  function request (file, callback) {
    var newRequest = new XMLHttpRequest();
    newRequest.open('get', file, true);
    newRequest.send();
    newRequest.addEventListener('error', function () {
      callback.apply(this, arguments);
    });
    newRequest.addEventListener('load', function () {
      callback(newRequest.response);
    });
  }
  function getContent (fileList, completeCallback) {
    function get (i) {
      request(fileList[i], function (fileContent) {
        fileList[i] = fileContent;
        if (i < fileList.length - 1) {
          get(i + 1);
        } else {
          completeCallback(fileList.join('\n'), new Date().getTime());
        }
      });
    }
    get(0);
  }
  Peach.fn.load = function (fileList, callback) {
    var add       = this.add;
    var loop      = this.loop;
    var startTime = new Date().getTime();
    var nodeList  = document.querySelectorAll(this._protected.tagName);
    getContent([].concat(fileList), function (string, endTime) {
      var renderTime = (endTime - startTime) / 1000;
      console.log('* Peach render time: ' + renderTime + 's');
      add(string);
      loop(nodeList, callback);
    });
  };
})();
