// storageType = 'localStorage' | 'sessionStorage' | 'cookie'
function getItem(key, storageType = 'localStorage') {
  if (storageType === 'localStorage' || storageType === 'sessionStorage') {
    var result = window[storageType].getItem(key);
    return result !== null ? JSON.parse(result) : null;  
  } else if (storageType === 'cookie') {
    function _escape(s) { 
      return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); 
    }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + _escape(key) + '=([^;]*)'));
    return (match && match[1]) ? JSON.parse(match[1]) : null;
  }
  return null
}

// storageType = 'localStorage' | 'sessionStorage' | 'cookie'
function setItem(key, value, storageType = false, daysToExpire = 365) {
  var stringified = JSON.stringify(value);
  if (storageType === 'localStorage' || storageType === 'sessionStorage') {
    window[storageType].setItem(key, stringified);
  } else if (storageType === 'cookie') {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); // Calculate the expiration date
    const expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + stringified + "; " + expires + "; path=/";
  }
}

(function _execute(){
  var promoIdCookie = getItem('promo_id', 'cookie');
  var promoIdHistoryCookie = getItem('promo_id-history', 'cookie') || [];
  if (promoIdCookie && promoIdHistoryCookie.indexOf(String(promoIdCookie)) === -1) {
    promoIdHistoryCookie.push(String(promoIdCookie))
    setItem('promo_id-history', promoIdHistoryCookie, 'cookie')
  }
})()

function hasSeenCampaign(promoId) {
  var promoIdHistoryCookie = getItem('promo_id-history', 'cookie') || [];
  return (promoId !== null && promoIdHistoryCookie.indexOf(String(promoId)) !== -1)
}

hasSeenCampaign(16284942)