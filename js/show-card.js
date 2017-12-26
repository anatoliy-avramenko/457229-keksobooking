'use strict';

(function () {

  var mapCard = document.querySelector('.map__card');

  // обработчик на крестик по Enter
  var onEscDown = function (evt) {
    var activePin = window.global.map.querySelector('.map__pin--active');
    if (evt.keyCode === window.global.ESC_KEYCODE) {
      mapCard.remove();
      activePin.classList.remove('map__pin--active');

      document.removeEventListener('keydown', onEscDown);
    }
  };

  window.showCard = function (el) {

    // добавить новое объявление
    // window.card.renderAdvert(window.global.getElementId(el));


    window.card.renderAdvert(el.card);

    // объявить крестик для закрытия
    var popupClose = document.querySelector('.popup__close');
    // переобъявить card, т.к. прошлая была удалена
    mapCard = document.querySelector('.map__card');

    // обработчик на крестик по клику
    popupClose.addEventListener('click', function () {
      mapCard.remove();
      el.classList.remove('map__pin--active');
    });

    document.addEventListener('keydown', onEscDown);
  };

})();
