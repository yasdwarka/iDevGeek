function tplReplace(stringToReplace, data) {
  return stringToReplace.replace(/\${([^{}]*)}/g,
    function (a, b) {
      var r = data[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
}

function getLang() {
  var lang = document.querySelector('html').getAttribute('lang') || 'en';
  return lang.toLowerCase();
}

function insertAfter(existingNode, newNode) {
  if (!existingNode || !newNode) {
    return;
  }
  // convert string to a fragment
  if (typeof newNode === 'string') {
    newNode = document.createRange().createContextualFragment(newNode);
  }
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function insertBefore(existingNode, newNode) {
  if (!existingNode || !newNode) {
    return;
  }
  // convert string to a fragment
  if (typeof newNode === 'string') {
    newNode = document.createRange().createContextualFragment(newNode);
  }
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

var pageData = {
  en: {
    title: 'Thank you for participating.',
    link1: '/en/crypto/?_optimizely=true'
  },
  de: {
    title: 'Vielen Dank für Ihre Teilnahme.',
    link1: '/de/geld-ueberweisen/skrill-kryptowaehrung/?_optimizely=true'
  },   
};

var utils = optimizely.get('utils');
utils.waitForElement('main')
  .then(function(elem) {
    var lang = getLang()
    var modal = '<div><h2>${title}</h2><a href="${link1}" class"_js-track-link">Lorem</a></div>'
    var translatedModal = tplReplace(modal, pageData[lang])
    console.log(translatedModal)
    insertBefore(document.querySelector('#main-content'), translatedModal)

    wrapper.addEventListener('click', function (event) {
      if (event.target.matches('._js-track-link')) {
        // Track modal link
        window['optimizely'] = window['optimizely'] || [];
        window['optimizely'].push({
          type: "event",
          eventName: "exitModalCTA",
          tags: {
            revenue: 0, // Optional in cents as integer (500 == $5.00)
            value: 0.00 // Optional as float
          }
        });
      };  
    }, false);

  }
)
