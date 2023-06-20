
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

function numberWithSep(num) {
  return (num || '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getAccountName(useWindow = window) {
  var account = null;
  var href = useWindow.location.href
  if (href.indexOf('skrill.com') !== -1) {
    account = 'skrill';
  } else if (href.indexOf('neteller.com') !== -1) {
    account = 'neteller';
  } else if (href.indexOf('paysafecard.com') !== -1) {
    account = 'paysafecard';
  }
  return account;
}


// The code below is to support test
if (typeof module !== 'undefined') {
  module.exports = {
    tplReplace,
    getLang,
    insertAfter,
    insertBefore,
    numberWithSep,
    getAccountName,
  }
}
