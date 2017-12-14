'use strict';

// -----------------------------------------------------------
// СОЗДАТЬ ПИНЫ
// -----------------------------------------------------------

(function () {

  // темплейт пина с аватаром
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');


  // задать пинам параметры из сгенерированных объектов
  var pinRad = 23;
  var pinArrowHeight = 18;
  var createPin = function (array, index) {
    var pinElement = pinTemplate.cloneNode(true);

    // базовая точка пина - это центр его окружности, в то время, как пин должен указывать на координаты не своим центром, а концом своей "иголки"
    // поправка (y - (pinRad + pinArrowHeight)) учитывает расположение базовой точки и как-бы смещает ее на наконечник "иголки"
    // горизоатальная поправка не требуется, т.к. базовая точка находится на вертикальной оси пина
    pinElement.style.left = (array[index].location.x) + 'px';
    pinElement.style.top = (array[index].location.y - (pinRad + pinArrowHeight)) + 'px';
    pinElement.setAttribute('id', index);
    pinElement.querySelector('img').setAttribute('src', array[index].author.avatar);
    return pinElement;
  };


  // записать вновь добавленные пины во fragment
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < window.data.ads.length; j++) {
    fragment.appendChild(createPin(window.data.ads, j));
  }


  // ЭКСПОРТ
  window.pin = {

    // добавить fragment с пинами в разметку
    renderPins: function () {
      window.global.pinsSection.appendChild(fragment);
    }

  };

})();


