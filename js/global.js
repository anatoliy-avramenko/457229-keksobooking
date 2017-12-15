'use strict';

(function () {

  window.global = {
    ESC_KEYCODE: 27,
    mapPinMain: document.querySelector('.map__pin--main'),
    map: document.querySelector('.map'),
    pinsSection: document.querySelector('.map__pins'),
    fieldsets: document.querySelectorAll('fieldset'),


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

