'use strict';

// -----------------------------------------------------------
// ВЫВЕСТИ КАРТОЧКУ С ОБЪЯВЛЕНИЕМ
// -----------------------------------------------------------

(function () {

  // вывести список features в объявление
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


  // задать попапу параметры из объекта
  var createAdvert = function (entity) {
    var advertElement = advertTemplate.cloneNode(true);
    advertElement.querySelector('h3').textContent = entity.offer.title;
    advertElement.querySelector('p small').textContent = entity.offer.address;
    advertElement.querySelector('.popup__price').innerHTML = entity.offer.price + ' &#x20bd;/ночь';
    advertElement.querySelector('h4').textContent = window.data.translateOfferType(entity);
    advertElement.querySelector('p:nth-of-type(3)').textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';
    advertElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout;
    advertElement.querySelector('.popup__features').innerHTML = generateFeaturesMarkup(entity);
    advertElement.querySelector('p:nth-of-type(5)').textContent = entity.offer.description;
    advertElement.querySelector('.popup__avatar').setAttribute('src', entity.author.avatar);
    return advertElement;
  };


  // ЭКСПОРТ
  window.card = {

    // // задать попапу параметры из объекта
    // createAdvert: function (entity) {
    //   var advertElement = advertTemplate.cloneNode(true);
    //   advertElement.querySelector('h3').textContent = entity.offer.title;
    //   advertElement.querySelector('p small').textContent = entity.offer.address;
    //   advertElement.querySelector('.popup__price').innerHTML = entity.offer.price + ' &#x20bd;/ночь';
    //   advertElement.querySelector('h4').textContent = window.data.translateOfferType(entity);
    //   advertElement.querySelector('p:nth-of-type(3)').textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';
    //   advertElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout;
    //   advertElement.querySelector('.popup__features').innerHTML = generateFeaturesMarkup(entity);
    //   advertElement.querySelector('p:nth-of-type(5)').textContent = entity.offer.description;
    //   advertElement.querySelector('.popup__avatar').setAttribute('src', entity.author.avatar);
    //   return advertElement;
    // }

    // добавить объявление в разметку
    renderAdvert: function (entity) {
      window.global.map.insertBefore(createAdvert(window.data.ads[entity]), advertSibling);
    }

  };

})();


