'use strict';

(function () {

  var entities = {};

  window.backend.download(successHandler, errorHandler);

  var successHandler = function (pinsData) {
    entities = pinsData;
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.global = {
    ESC_KEYCODE: 27,
    mapPinMain: document.querySelector('.map__pin--main'),
    map: document.querySelector('.map'),
    pinsSection: document.querySelector('.map__pins'),
    fieldsets: document.querySelectorAll('fieldset'),

    allEntities: entities,


    // получить ID элемента
    getElementId: function (element) {
      return element.getAttribute('id');
    },


    // добавить или удалить класс у группы элементов, forEach
    modifyClassForEach: function (elementsArray, mod, className) {
      elementsArray.forEach(function (el) {
        if (mod === 'remove') {
          el.classList.remove(className);
        } else if (mod === 'add') {
          el.classList.add(className);
        }
      });
    }
  };

})();

