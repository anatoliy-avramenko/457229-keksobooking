'use strict';

// ------------------------------------------------------------
// ОБРАБОТЧИКИ СОБЫТИЙ
// ------------------------------------------------------------


(function () {

  var MAIN_PIN_WIDTH = 62;
  var noticeForm = document.querySelector('.notice__form');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinsSection = document.querySelector('.map__pins');

  window.data.generateAds();

  var activatePage = function () {

    // убрать fade
    window.global.map.classList.remove('map--faded');

    // активировать форму
    noticeForm.classList.remove('notice__form--disabled');

    // убрать с инпутов класс disabled
    window.global.modifyClassForEach(window.global.fieldsets, 'remove', 'disabled');

    // создать пины и отрисовать их
    window.pin.renderPins();
    makePinsClickable();

    // ВЫЗОВ ЭТОЙ ФУНКЦИИ ПРЕПЯТСТВУЕТ ПЕРЕТЯГИВАНИЮ
    // window.form.trackAddress();

    window.global.mapPinMain.removeEventListener('mouseup', activatePage);
  };


  window.global.mapPinMain.setAttribute('tabindex', '1');


  // // обработчик по событию mouseup
  // window.global.mapPinMain.addEventListener('mouseup', activatePage);


  var mapCard = document.querySelector('.map__card');


  // обработчик на крестик по Enter
  var onEscDown = function (evt) {
    var activePin = window.global.map.querySelector('.map__pin--active');
    if (evt.keyCode === window.global.ESC_KEYCODE) {
      mapCard.remove();
      activePin.classList.remove('map__pin--active');

      // document.removeEventListener('keydown', onEscDown);
    }
  };


  // обратиться к каждому пину
  var makePinsClickable = function () {

    // переменная-селектор для псевдопинов (созданные из js)
    var mapPinItems = window.global.pinsSection.querySelectorAll('.map__pin:not(.map__pin--main)');

    mapPinItems.forEach(function (el) {

      el.setAttribute('tabindex', '1');

      // поставить обработчики на пины
      el.addEventListener('click', function () {

        // предварительно выключить везде active
        window.global.modifyClassForEach(mapPinItems, 'remove', 'map__pin--active');

        // включить active
        el.classList.add('map__pin--active');

        // убрать старое объявление
        mapCard = document.querySelector('.map__card');
        if (mapCard) {
          mapCard.remove();
        }


        var renderCardWithListeners = function () {

          // добавить новое объявление
          window.card.renderAdvert(window.global.getElementId(el));

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

        renderCardWithListeners();
      });
    });
  };


  // -------------
  // draggable пин
  // -------------

  mapPinMain.addEventListener('mousedown', function (evt) {

    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };


    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (mapPinMain.offsetTop - shift.y > 100 && mapPinMain.offsetTop - shift.y < 500) {
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      pinsSection.removeEventListener('mousemove', onMouseMove);
      pinsSection.removeEventListener('mouseup', onMouseUp);
      activatePage();
    };

    pinsSection.addEventListener('mousemove', onMouseMove);
    pinsSection.addEventListener('mouseup', onMouseUp);

  });




  // pinsSection.addEventListener('dragstart', function (evt) {
  //   if (evt.target.matches('.map__pin--main')) {
  //     // window.form.trackAddress();
  //   }
  // });
  //
  // pinsSection.addEventListener('dragover', function (evt) {
  //   evt.preventDefault();
  //   return false;
  // });
  //
  // pinsSection.addEventListener('drop', function (evt) {
  //   // evt.preventDefault();
  //   mapPinMain.style.top = (evt.clientY) + 'px';
  //   mapPinMain.style.left = (evt.clientX - MAIN_PIN_WIDTH * 1.5) + 'px';
  //
  //   // MOUSEUP НЕ СРАБАТЫВАЕТ ПОСЛЕ ПЕРЕТЯГИВАНИЯ
  //   window.global.mapPinMain.addEventListener('mouseup', activatePage);
  // });


})();


