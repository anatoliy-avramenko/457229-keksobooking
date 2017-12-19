'use strict';

// ------------------------------------------------------------
// ОБРАБОТЧИКИ СОБЫТИЙ
// ------------------------------------------------------------


(function () {

  var MAIN_PIN_RAD = 31;
  var MAIN_PIN_ARROW = 22;
  var UPPER_MAP_LIMIT = 100;
  var LOWER_MAP_LIMIT = 500;
  var noticeForm = document.querySelector('.notice__form');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinsSection = document.querySelector('.map__pins');
  var addressField = document.querySelector('#address');

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

    // нижняя и верхняя граница рассчитываются исходя из лимита от 100 до 500 и учитывая размер пина
    var HORIZON = UPPER_MAP_LIMIT + MAIN_PIN_RAD;
    var LOWER_BORDER = LOWER_MAP_LIMIT - MAIN_PIN_RAD - MAIN_PIN_ARROW;

    evt.preventDefault();

    // коордимнаты начала перетягивания
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };


    // функция обработчика по движению мыши
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // рассчет величины смещения крусора со стартовой точки
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // присвоение новых стартовых координат
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // рассчет новых координат пина (расстояние_от_края_карты - величина_смещения_курсора)
      var newCoords = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };

      // условие выполнится, если место перетаскивания не выходит за границы лимитов
      if ((mapPinMain.offsetTop - shift.y > HORIZON) && (mapPinMain.offsetTop - shift.y < LOWER_BORDER)) {

        // свойствам top и left присваиваются новые координаты
        mapPinMain.style.top = newCoords.y + 'px';
        mapPinMain.style.left = newCoords.x + 'px';
      }

      // динамическое обновление координат пина в поле Address формы
      // для Y учитывается радиус пина и высота стрелки
      var pinArrowY = newCoords.y + MAIN_PIN_RAD + MAIN_PIN_ARROW;
      addressField.setAttribute('value', 'x: {{' + newCoords.x + '}}, y: {{' + pinArrowY + '}}');

      // вызов обработчика по mouseup
      pinsSection.addEventListener('mouseup', onMouseUp);
    };


    // функция обработчика по mouseup
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      // удаляет обработчик по движению мыши, по отпусканию кнопки, и активирует страницу
      pinsSection.removeEventListener('mousemove', onMouseMove);
      pinsSection.removeEventListener('mouseup', onMouseUp);
      activatePage();
    };


    // вызов обработчика по движению мыши
    pinsSection.addEventListener('mousemove', onMouseMove);

  });

})();


