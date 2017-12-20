'use strict';

(function () {

  window.synchronizeFields = function (e1, e2, dependencyObj, cb) {

    var callbackListener = function (e) {
      cb(dependencyObj[e.target.value]);
    };

    e1.addEventListener('change', callbackListener);
  };

})();
