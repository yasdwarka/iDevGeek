var PROMO_ID_COOKIE_NAME = 'promo_id';
var CAMPAIGN_ID_NAME = 'promo_id';
var CAMPAIGN_ID = '16284950';
var CAMPAIGN_START_DATE = '2023/09/20';

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

function getCookie(name) {
  function escape(s) { 
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); 
  }
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

function hasSeenCampaign() {
  var promoCookie = getCookie(PROMO_ID_COOKIE_NAME);
  if (promoCookie === null) {
    var walletCookie = getCookie('wallet_utm');
    if (walletCookie && typeof walletCookie === 'string') {
      var params = new URLSearchParams(walletCookie);
      var campaign = params.get(CAMPAIGN_ID_NAME) || null;
      return !!(String(campaign) === CAMPAIGN_ID)
    }
    return false;
  }
  return !!(promoCookie && String(promoCookie) === CAMPAIGN_ID) 
}


function isNewUser(dateRegistered) {
  return !!(dateRegistered && dateRegistered >= new Date(CAMPAIGN_START_DATE))
}

var visitor = Object.values(window.optimizely.get('visitor').custom);
var createdOn = getValue(visitor, 'registration_date').value || null;
if (createdOn !== null) {
  createdOn = new Date(createdOn)
}
var _hasEnrolled = getValue(visitor, 'loyalty_enrolled').value || false;
var _isNewUser = isNewUser(createdOn);
var _hasSeenCampaign = hasSeenCampaign();

// condition to show banner
(!_hasEnrolled && _isNewUser && _hasSeenCampaign)
