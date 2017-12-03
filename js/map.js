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
var ads = [];
for (var n = 0; n < 8; n++) {
  generateCoordinates();
  ads.push({
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
for (var j = 0; j < ads.length; j++) {
  fragment.appendChild(createPin(ads, j));
}

// добавить fragment с пинами в разметку
var renderPins = function () {
  pinsSection.appendChild(fragment);
};


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
var createAdvert = function (entity) {
  var advertElement = advertTemplate.cloneNode(true);
  advertElement.querySelector('h3').textContent = entity.offer.title;
  advertElement.querySelector('p small').textContent = entity.offer.address;
  advertElement.querySelector('.popup__price').innerHTML = entity.offer.price + ' &#x20bd;/ночь';
  advertElement.querySelector('h4').textContent = translateOfferType(entity);
  advertElement.querySelector('p:nth-of-type(3)').textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';
  advertElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout;
  advertElement.querySelector('.popup__features').innerHTML = generateFeaturesMarkup(entity);
  advertElement.querySelector('p:nth-of-type(5)').textContent = entity.offer.description;
  advertElement.querySelector('.popup__avatar').setAttribute('src', entity.author.avatar);
  return advertElement;
};


// добавить объявление в разметку
var renderAdvert = function (entity) {
  map.insertBefore(createAdvert(ads[entity]), advertSibling);
};

// ------------------------------------------------------------
// ОБРАБОТЧИКИ СОБЫТИЙ
// ------------------------------------------------------------


var noticeForm = document.querySelector('.notice__form');
var mapPinMain = document.querySelector('.map__pin--main');
var fieldsets = document.querySelectorAll('fieldset');


// получить ID элемента
var getElementId = function (element) {
  return element.getAttribute('id');
};


// добавить или удалить класс у группы элементов, forEach
var modifyClassForEach = function (elementsArray, mod, className) {
  elementsArray.forEach(function (el) {
    if (mod === 'remove') {
      el.classList.remove(className);
    } else if (mod === 'add') {
      el.classList.add(className);
    }
  });
};


// сделать все инпуты неактивными disabled
modifyClassForEach(fieldsets, 'add', 'disabled');


// обработчик по событию mouseup
mapPinMain.addEventListener('mouseup', function () {

  // убрать fade
  map.classList.remove('map--faded');

  // активировать форму
  noticeForm.classList.remove('notice__form--disabled');

  // убрать с инпутов класс disabled
  modifyClassForEach(fieldsets, 'remove', 'disabled');

  // добавить пины
  renderPins();
  parseAllPins();
});


// ставить обработчики на пины по клику
var onPinClick = function (pinItem, pinParent) {
  pinItem.addEventListener('click', function () {

    // предварительно выключить везде active
    modifyClassForEach(pinParent, 'remove', 'map__pin--active');

    // включить active, запилить объявление
    pinItem.classList.add('map__pin--active');
    renderAdvert(getElementId(pinItem));
  });
};





// ставить обработчики на пины по нажатию на Enter
var onPinEnterDown = function (pinItem, pinParent) {
  if (evt.keyCode === ENTER_KEYCODE) {
    pinItem.addEventListener('keyDown', function () {

      // предварительно выключить везде active
      modifyClassForEach(pinParent, 'remove', 'map__pin--active');

      // включить active, запилить объявление
      pinItem.classList.add('map__pin--active');
      renderAdvert(getElementId(pinItem));
    });
  }
};



var mapCard = pinsSection.querySelector('.popup');

var closePopup = function () {
  mapCard.classList.add('hidden');
};






// обратиться к каждому пину
var parseAllPins = function () {
  var mapPinItem = pinsSection.querySelectorAll('.map__pin');
  mapPinItem.forEach(function (el) {

    // исключить большой главный пин (с кексиком)
    if (!el.classList.contains('map__pin--main')) {
      onPinClick(el, mapPinItem);
    }
  });
};
