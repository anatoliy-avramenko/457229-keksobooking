'use strict';

(function () {

  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var OFFER_TYPE = ['flat', 'house', 'bungalo'];
  var OFFER_TYPE_RUS = ['Квартира', 'Дом', 'Бунгало'];
  var OFFER_CHECK_TIME = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];


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


  // ЭКСПОРТ
  window.data = {

    // генерируемый массив данных о недвижимости
    ads: [],


    // сгенерировать массив из 8 объявлений
    generateAds: function () {
      for (var n = 0; n < 8; n++) {
        generateCoordinates();
        this.ads.push({
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
    },


    // перевести тип жилья на русский
    translateOfferType: function (entity) {
      for (var i = 0; i < 3; i++) {
        if (entity.offer.type === OFFER_TYPE[i]) {
          break;
        }
      }
      return OFFER_TYPE_RUS[i];
    }

  };

})();
