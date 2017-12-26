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
    pinElement.card = array[index];
    console.log(pinElement.card);
    return pinElement;
  };


  // var fragment = document.createDocumentFragment();
  // // записать вновь добавленные пины во fragment
  // for (var j = 0; j < window.data.ads.length; j++) {
  //   fragment.appendChild(createPin(window.data.ads, j));
  // }


  var fragment = document.createDocumentFragment();

  var successHandler = function (pinsData) {
    // записать вновь добавленные пины во fragment
    for (var j = 0; j < pinsData.length; j++) {
      fragment.appendChild(createPin(pinsData, j));
    }
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

  window.backend.download(successHandler, errorHandler);


  // ЭКСПОРТ
  window.pin = {

    // добавить fragment с пинами в разметку
    renderPins: function () {
      window.global.pinsSection.appendChild(fragment);
    }

  };

})();


