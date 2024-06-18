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


function getItem(key, storageType) {
  storageType = storageType || 'localStorage'
  if (storageType === 'localStorage' || storageType === 'sessionStorage') {
    var result = window[storageType].getItem(key);
    return result !== null ? JSON.parse(result) : null;  
  } else if (storageType === 'cookie') {
    var _escape = function(s) { 
      return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); 
    }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + _escape(key) + '=([^;]*)'));
    return (match && match[1]) ? JSON.parse(match[1]) : null;
  }
  return null
}

function setItem(key, value, storageType, daysToExpire) {
  daysToExpire = daysToExpire || 365
  storageType = storageType || 'localStorage'
  var stringified = JSON.stringify(value);
  if (storageType === 'localStorage' || storageType === 'sessionStorage') {
    window[storageType].setItem(key, stringified);
  } else if (storageType === 'cookie') {
    var date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); // Calculate the expiration date
    var expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + stringified + "; " + expires + "; path=/";
  }
}

function removeItem(key, storageType) {
  storageType = storageType || 'localStorage'
  if (storageType === 'localStorage' || storageType === 'sessionStorage') {
    window[storageType].removeItem(key);
  } else if (storageType === 'cookie') {
    var expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = key + "=" + "; " + expires + "; path=/";
  }
}

function getVisitorValue(visitor, key) {
  var accountName = window.location.href.replace(/(www.)|(.com)|(https:\/\/)/gi, '').split('/').shift()
  var def = {value: undefined};
  var useArray = Array.isArray(visitor) ? visitor : Object.values(visitor);
  var find = useArray.find(function(item) {
    return item.name === accountName + '_' + key;
  });
  return find || def;
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
    getItem,
    setItem,
    getVisitorValue,
    removeItem,
  }
}
