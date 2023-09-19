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

// condition to show banner
(!_hasEnrolled && _isNewUser)