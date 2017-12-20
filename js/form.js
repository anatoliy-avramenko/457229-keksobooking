'use strict';

// ---------------------------------------------
// ВАЛИДАЦИ ФОРМЫ
// ---------------------------------------------

(function () {

  // сделать все инпуты неактивными disabled
  window.global.modifyClassForEach(window.global.fieldsets, 'add', 'disabled');


  var checkinTime = document.querySelector('#timein');
  var checkoutTime = document.querySelector('#timeout');


  // задать зависимости checkin / checkout друг от друга
  var onCheckFocus = function (subject) {
    subject.addEventListener('focus', function () {
      var target;
      if (subject === checkinTime) {
        target = checkoutTime;
      } else if (subject === checkoutTime) {
        target = checkinTime;
      }
      subject.addEventListener('change', function () {
        for (var i = 0; i < subject.options.length; i++) {
          var option = subject.options[i];
          if (option.selected) {
            target.selectedIndex = i;
          }
        }
      });
    });
  };

  onCheckFocus(checkinTime);
  onCheckFocus(checkoutTime);


  // -------------------------------------------------------
  // -------------------------------------------------------
  // менять минимальную цену в зависмости от типа жилья
  var entityType = document.querySelector('#type');
  var price = document.querySelector('#price');


  // список возможных зависимостей - тип жилья: цена
  var typeMinPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };


  // функция изменения атрибута min для price
  var parsePrices = function (arr) {
    price.setAttribute('min', arr);
  };


  // изменить атрибут min для price одныжды в начале
  var currentTypeValue = entityType.options[entityType.selectedIndex].value;
  parsePrices(currentTypeValue);

  window.synchronizeFields(entityType, price, typeMinPrice, parsePrices);


  // -------------------------------------------------------
  // -------------------------------------------------------
  // менять вместимость в зависимости от количества комнат
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');


  // объект со списком доступных зависимостей Rooms: Capacity
  var roomCapacity = {
    100: ['0'],
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3']
  };


  // перебор всех опций Capacity и выключение не релевантных
  var parseCapacities = function (arr) {
    for (var i = 0; i < capacity.options.length; i++) {

      // обращение к текущей опции capacity в цикле
      var capacityCurrentOption = capacity.options[i];

      // если значение capacity, выбранное циклом, содержится в выбранном currentCapacitySet, то ...
      if (arr.indexOf(capacityCurrentOption.value) > -1) {
        capacityCurrentOption.disabled = false;
        capacityCurrentOption.selected = true;
      } else {
        capacityCurrentOption.disabled = true;
      }
    }
  };


  // отсылка в выбранному значению Rooms
  var currentRoomValue = roomNumber.options[roomNumber.selectedIndex].value;

  // изменить capacity зависимо от Rooms только однажды в начале
  parseCapacities(roomCapacity[currentRoomValue]);

  window.synchronizeFields(roomNumber, capacity, roomCapacity, parseCapacities);


  // -------------------------------------------------------
  // -------------------------------------------------------
  // валидировать данные из формы
  var inputs = document.querySelectorAll('input');
  var submit = document.querySelector('.form__submit');


  var validateForm = function () {
    submit.addEventListener('click', function () {
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.checkValidity() === false) {
          input.style.borderColor = 'red';
        } else if (input.checkValidity() === true) {
          input.style.borderColor = '#d9d9d3';
        }
      }
    });
  };

  validateForm();

})();

