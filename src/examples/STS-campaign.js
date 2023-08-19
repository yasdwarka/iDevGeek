var CAMPAIGN_ID = 'STS-123';
var CAMPAIGN_START_DATE = '1/7/2023';
var CAMPAIGN_DAYS_TO_ACTION = 3;
var CAMPAIGN_SESSION_KEY = 'sts-clicked-banner';

function getCookie(name) {
  function escape(s) { 
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); 
  }
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

function setItem(key, value, useSessionStorage = false) {
  var storageKey = useSessionStorage ? 'sessionStorage' : 'localStorage'
  if (Object.prototype.hasOwnProperty.call(window, storageKey)) {
    window[storageKey].setItem(key, JSON.stringify(value));
  }  
}

function getItem(key, useSessionStorage = false) {
  var storageKey = useSessionStorage ? 'sessionStorage' : 'localStorage';
  if (Object.prototype.hasOwnProperty.call(window, storageKey)) {
    var result = window[storageKey].getItem(key);
    return result !== null ? JSON.parse(result) : null;  
  }
  return null;
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

function isNewUser(dateRegistered) {
  return !!(dateRegistered && dateRegistered >= CAMPAIGN_START_DATE)
}
function getDaysBetweenDates(dateOne, dateTwo) {
  if (dateOne !== null && dateTwo !== null) {
    var oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    return Math.round(Math.abs((dateOne - dateTwo) / oneDay));  
  }
  return null;
}
function hasDeposited(dateRegistered, lastDepositDate) {
  var daysBetween = getDaysBetweenDates(dateRegistered, lastDepositDate)
  return !!(lastDepositDate && daysBetween !== null && daysBetween >= 0 && daysBetween <= CAMPAIGN_DAYS_TO_ACTION)
}

function hasClickedBanner() {
  // Add local storage read value
  var clickedBanner = getItem(CAMPAIGN_SESSION_KEY) || false
  return clickedBanner
  // Add bTag option if local storage value is set to null
  // this will be a cookie value option
}

function hasSeenCampaign() {
  var walletCookie = getCookie('wallet_utm');
  if (walletCookie && typeof walletCookie === 'string') {
    var params = new URLSearchParams(walletCookie);
    var campaign = params.get('utm_campaign') || null;
    return !!(campaign === CAMPAIGN_ID)
  }
  return false;
}

var visitor = Object.values(window.optimizely.get('visitor').custom);
var customerId = getValue(visitor, 'customer_id').value || getItem('customerId');
var lang = getValue(visitor, 'language').value || getLang().toUpperCase();
var createdOn = getValue(visitor, 'registration_date').value || null;
if (createdOn !== null) {
  createdOn = new Date(createdOn)
}
var lastDepositDate = getValue(visitor, 'last_deposit_date').value || null;
if (lastDepositDate !== null) {
  lastDepositDate = new Date(lastDepositDate)
}

var _isNewUser = isNewUser(createdOn);
var _hasSeenCampaign = hasSeenCampaign();
var _hasDeposited = hasDeposited(createdOn, lastDepositDate);
var _hasClickedBanner = !hasClickedBanner();

// Record click on the banner in a session storage
var main = document.querySelector('main');
if (main) {
  main.addEventListener('click', function (event) {
    var parentBanner = document.querySelector('#tt-dashboardTop__container');
    // We need to check for click of the banner in this way because it is with inline onClick attribute
    if (parentBanner 
      && parentBanner.contains(event.target)
      && !event.target.matches('#tt-dashboardTop__closeButton')
    ) {
      setItem(CAMPAIGN_SESSION_KEY, true);
    };  
  }, true);  
}

if (_hasSeenCampaign && _isNewUser && _hasDeposited && !_hasClickedBanner) {
  // show banner
  return true;
}
return false;