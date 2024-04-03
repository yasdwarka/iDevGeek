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
  },
  de: {
    title: 'Vielen Dank für Ihre Teilnahme.',
  },   
};

var utils = optimizely.get('utils');
utils.waitForElement('main')
  .then(function(elem) {
    var lang = getLang()
    var modal = '<div><h2>${title}</h2></div>'
    var translatedModal = tplReplace(modal, pageData[lang])
    console.log(translatedModal)
    insertBefore(document.querySelector('#main-content'), translatedModal)
  }
)