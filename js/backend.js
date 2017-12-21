'use strict';

(function () {
  var URL_INCOME = 'https://js.dump.academy/keksobooking';
  var URL_OUTCOME = 'https://js.dump.academy/keksobooking';


  var manipulateXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr.response);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    return xhr;
  };


  window.backend = {
    upload: function (data, onLoad, onError) {
      var xhr = manipulateXhr(onLoad, onError);

      xhr.open('POST', URL_OUTCOME);
      xhr.send(data);
    },

    download: function (onLoad, onError) {
      var xhr = manipulateXhr(onLoad, onError);

      xhr.open('GET', URL_INCOME + '/data');
      xhr.send();
    }
  };

})();
