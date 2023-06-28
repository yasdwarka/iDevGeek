var template = {
  skrill: {
    bannerUrl: 'https://news.skrill.com/pub/rf?_ri_=X0Gzc2X%3DAQpglLjHJlTQGzeXIcWgzdkzbtyzgyqGUifyhzdeMu13yC5sYXuW0VwjpnpgHlpgneHmgJoXX0Gzc2X%3DAQpglLjHJlTQGze7tvFIoDDzdLK7SNzeMGJ2T9Mu13yC5sYXuW0&CUSTOMER_ID_=${customerId}&LANG_LOCALE=${lang}&ENTRY_SOURCE=${source}&ENTRY_DATE=${date}&HOURS_CONVERT=${hours}&SOURCE_PLATFORM=${platform}'
  },
  neteller: {
    bannerUrl: 'https://news.neteller.com/pub/rf?_ri_=X0Gzc2X%3DAQpglLjHJlTQG1TkX0eseJwzbSmmhuHFzbYyKzaeR7oIbgEHUrJpfVwjpnpgHlpgneHmgJoXX0Gzc2X%3DAQpglLjHJlTQG2RCCryE4wgWzdoLPt51AhUlzaeR7oIbgEHUrJpf&CUSTOMER_ID_=${customerId}&LANG_LOCALE=${lang}&ENTRY_SOURCE=${source}&ENTRY_DATE=${date}&HOURS_CONVERT=${hours}&SOURCE_PLATFORM=${platform}'
  }
}

function getValue(visitor, key) {
  var accountName = window.location.href.indexOf('skrill.com') !== -1? 'skrill' : 'neteller';
  var def = {value: undefined};
  if (Array.isArray(visitor)) {
    var find = visitor.find(function(item) {
      return item.name === accountName + '_' + key;
    });
    return find || def;
  }
  return def;
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

function getItem(key, useSessionStorage = false) {
  var storageKey = useSessionStorage ? 'sessionStorage' : 'localStorage'
  if (Object.prototype.hasOwnProperty.call(window, storageKey)) {
    var result = window[storageKey].getItem(key);
    return result !== null ? JSON.parse(result) : null;  
  }
  return null
}

var utils = optimizely.get('utils');
utils.waitForElement('#grid-main').then(function(elem) {
  var visitor = Object.values(window.optimizely.get('visitor').custom);
  var customerId = getValue(visitor, 'customer_id').value || 0;
  var lang = getLang()
  var now = new Date()
  var date = now.toISOString().split('T')[0]
  var source = ''
  var platform = ''
  var hours = 0

  var trafficSource = getItem('traffic-source');
  var isPublicDomain = (window.location.hostname.search(/(www.paysafecard.com)|(www.skrill.com)|(www.neteller.com)/gi) !== -1)
  if (!isPublicDomain && trafficSource) {
    if ( trafficSource.hasOwnProperty('timestamp') 
      && trafficSource.hasOwnProperty('source') 
      && trafficSource.hasOwnProperty('platform')
    ) {
      var timestamp = trafficSource.timestamp
      var timestampNow = Date.now()
      hours = Math.abs(timestamp - timestampNow) / 36e5;
      // for less than 1 hour, go decimal, 2 places
      if (hours < 1) {
        hours = Math.round(hours*100)/100
      } else {
        hours = Math.round(hours)
      }
      source = trafficSource.source
      platform = trafficSource.platform
    }
  }

  var data = {
    date,
    customerId,
    lang,
    source,
    platform,
    hours
  }

  var currentAccount = getAccountName()
  if (template.hasOwnProperty(currentAccount)) {
    var useTemplate = template[currentAccount]
    var bannerUrl = tplReplace(useTemplate.bannerUrl, data)
    console.log(bannerUrl)
  }
})