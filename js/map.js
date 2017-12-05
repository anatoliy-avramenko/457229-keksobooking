'use strict';

var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPE = ['flat', 'house', 'bungalo'];
var OFFER_TYPE_RUS = ['Квартира', 'Дом', 'Бунгало'];
var OFFER_CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

// сгенерировать индексы аватаров
var avatarIndexes = [];
var generateAvatarIndexes = function (length) {
  for (var i = 0; i < length; i++) {
    avatarIndexes[i] = '0' + (i + 1);
  }
  return avatarIndexes;
};


// сгенерировать случайное число в диапазоне bottom - top
var randomizeNumber = function (bottom, top) {
  return Math.floor((Math.random() * top) + bottom);
};


// выбрать случайное уникальное наименование из массива
var pickArrayItem = function (array) {
  var currentIndex = randomizeNumber(0, array.length);
  var arrayItem = array[currentIndex];
  array.splice(currentIndex, 1);
  return arrayItem;
};


// выбрать случайное НЕ уникальное наименование из массива
var pickAnyArrayItem = function (array) {
  var currentIndex = randomizeNumber(0, array.length);
  return array[currentIndex];
};


// перемешать массив и задать рандомную длину
var cutArrayRandomly = function (array) {
  var clonedItems = array.slice(0);
  var shuffledItems = [];
  var arrayLength = randomizeNumber(1, clonedItems.length);
  for (var i = 0; i < arrayLength; i++) {
    shuffledItems.push(pickArrayItem(clonedItems));
  }
  return shuffledItems;
};


// сгенерировать уникальный путь к аватару
generateAvatarIndexes(8);
var generateAvatarPath = function () {
  return 'img/avatars/user' + pickArrayItem(avatarIndexes) + '.png';
};


// сгенерировать координаты X и Y
var adsCoordinates = [];
var generateCoordinates = function () {
  adsCoordinates[0] = randomizeNumber(300, 900);
  adsCoordinates[1] = randomizeNumber(100, 500);
  return adsCoordinates;
};


// сгенерировать массив из 8 объявлений
var genericRealties = [];
for (var n = 0; n < 8; n++) {
  generateCoordinates();
  genericRealties.push({
    'author': {
      'avatar': generateAvatarPath()
    },

    'offer': {
      'title': pickArrayItem(OFFER_TITLES),
      'address': adsCoordinates[0] + ', ' + adsCoordinates[1],
      'price': randomizeNumber(1000, 1000000),
      'type': pickAnyArrayItem(OFFER_TYPE),
      'rooms': randomizeNumber(1, 5),
      'guests': randomizeNumber(1, 7),
      'checkin': pickAnyArrayItem(OFFER_CHECK_TIME),
      'checkout': pickAnyArrayItem(OFFER_CHECK_TIME),
      'features': cutArrayRandomly(OFFER_FEATURES),
      'description': '',
      'photos': []
    },

    'location': {
      'x': adsCoordinates[0],
      'y': adsCoordinates[1]
    }
  });
}

// переменная на случай нового источника с недвижимостями
var realties = genericRealties;

// -----------------------------------------------------------
// СОЗДАТЬ ПИНЫ
// -----------------------------------------------------------

// темплейт пина с аватаром
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

// блок для складывания пинов
var pinsSection = document.querySelector('.map__pins');


// задать пинам параметры из сгенерированных объектов
var pinRad = 23;
var pinArrowHeight = 18;
var createPin = function (index) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = (realties[index].location.x) + 'px';
  pinElement.style.top = (realties[index].location.y - (pinRad + pinArrowHeight)) + 'px';
  pinElement.setAttribute('id', index);
  pinElement.querySelector('img').setAttribute('src', realties[index].author.avatar);
  return pinElement;
};


var appendFragment = function (createElement, path, mod) {
  var fragment = document.createDocumentFragment();

  // записать свежие элементы во fragment (буферная зона)
  for (var j = 0; j < realties.length; j++) {
    fragment.appendChild(createElement(j));
  }

  // добавить фрагмент в разметку
  if (mod) {
    path.insertBefore(fragment, mod);
  } else {
    path.appendChild(fragment);
  }
};


appendFragment(createPin, pinsSection);

// -----------------------------------------------------------
// ВЫВЕСТИ КАРТОЧКУ С ОБЪЯВЛЕНИЕМ
// -----------------------------------------------------------

// перевести тип жилья на русский
var translateOfferType = function (entity) {
  for (var i = 0; i < 3; i++) {
    if (entity.offer.type === OFFER_TYPE[i]) {
      break;
    }
  }
  return OFFER_TYPE_RUS[i];
};


// вывести списко features в объявление
var generateFeaturesMarkup = function (entity) {
  var featuresMarkup = '';
  for (var i = 0; i < entity.offer.features.length; i++) {
    featuresMarkup += ('<li class="feature feature--' + entity.offer.features[i] + '"></li>');
  }
  return featuresMarkup;
};


// темплейт пина с аватаром
var advertTemplate = document.querySelector('template').content.querySelector('.map__card');

// блок для складывания пинов
var advertSibling = document.querySelector('.map__filters-container');
var map = document.querySelector('.map');


// задать попапу параметры из объекта
var createAdvert = function (index) {
  var advertElement = advertTemplate.cloneNode(true);
  advertElement.querySelector('h3').textContent = realties[index].offer.title;
  advertElement.querySelector('p small').textContent = realties[index].offer.address;
  advertElement.querySelector('.popup__price').innerHTML = realties[index].offer.price + ' &#x20bd;/ночь';
  advertElement.querySelector('h4').textContent = translateOfferType(realties[index]);
  advertElement.querySelector('p:nth-of-type(3)').textContent = realties[index].offer.rooms + ' комнаты для ' + realties[index].offer.guests + ' гостей';
  advertElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + realties[index].offer.checkin + ', выезд до ' + realties[index].offer.checkout;
  advertElement.querySelector('.popup__features').innerHTML = generateFeaturesMarkup(realties[index]);
  advertElement.querySelector('p:nth-of-type(5)').textContent = realties[index].offer.description;
  advertElement.querySelector('.popup__avatar').setAttribute('src', realties[index].author.avatar);
  advertElement.setAttribute('id', index);

  return advertElement;
};


appendFragment(createAdvert, map, advertSibling);

// ------------------------------------------------------------
// ОБРАБОТЧИКИ СОБЫТИЙ
// ------------------------------------------------------------


var noticeForm = document.querySelector('.notice__form');
var mapPinMain = document.querySelector('.map__pin--main');
var fieldsets = document.querySelectorAll('fieldset');
var mapPinItems = pinsSection.querySelectorAll('.map__pin:not(:first-of-type)');
var mapCards = document.querySelectorAll('.map__card');


// получить ID элемента
var getElementId = function (element) {
  return element.getAttribute('id');
};


// добавить или удалить класс у группы элементов, forEach
var modifyClassForEach = function (elementsArray, mod, className) {
  elementsArray.forEach(function (el) {
    if (mod === 'toggle') {
      el.classList.toggle(className);
    } else if (mod === 'add') {
      el.classList.add(className);
    } else if (mod === 'remove') {
      el.classList.remove(className);
    }
  });
};


// спрятать все ненужное при загрузке страницы
modifyClassForEach(fieldsets, 'add', 'disabled');
modifyClassForEach(mapPinItems, 'add', 'hidden');
modifyClassForEach(mapCards, 'add', 'hidden');


// активировать страницу
var activatePage = function () {

  // убрать fade
  map.classList.remove('map--faded');

  // активировать форму
  noticeForm.classList.remove('notice__form--disabled');

  // убрать с инпутов класс disabled
  modifyClassForEach(fieldsets, 'remove', 'disabled');
  modifyClassForEach(mapPinItems, 'remove', 'hidden');

  // выключить обработчик на главной кнопке
  mapPinMain.removeEventListener('mouseup', activatePage);

  // включить обработчики на всех пинах
  parseAllPins();
};


// обработчик по событию mouseup
mapPinMain.addEventListener('mouseup', activatePage);


var closeCard = function () {
  modifyClassForEach(mapCards, 'add', 'hidden');
  modifyClassForEach(mapPinItems, 'remove', 'map__pin--active');
};


var openCard = function (el) {
  modifyClassForEach(mapCards, 'add', 'hidden');
  modifyClassForEach(mapPinItems, 'remove', 'map__pin--active');
  mapCards[getElementId(el)].classList.remove('hidden');
  el.classList.add('map__pin--active');

  mapCards[getElementId(el)].querySelector('.popup__close').addEventListener('click', function () {
    closeCard();
  });

  document.addEventListener('keyDown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      modifyClassForEach(mapCards, 'add', 'hidden');
      modifyClassForEach(mapPinItems, 'remove', 'map__pin--active');
    }
  });
};


// обратиться к каждому пину
var parseAllPins = function () {

  mapPinItems.forEach(function (el) {

    el.addEventListener('click', function () {
      openCard(el);
    });
  });
};

