var DAYS_SINCE_CREATED_ACCOUNT = 20

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

function hasBeenDaysSince(dateRegistered, daysSince) {
  const today = new Date()
  const dateInPast = new Date(today)

  dateInPast.setDate(dateInPast.getDate() - daysSince)

  return !!(dateRegistered && dateRegistered <= dateInPast)
}

if (Object.prototype.hasOwnProperty.call(window, 'optimizely')
      && Object.prototype.hasOwnProperty.call(window.optimizely, 'get')) {
  var visitor = Object.values(window.optimizely.get('visitor').custom);
  var createdOn = getValue(visitor, 'registration_date').value || null;
  if (createdOn !== null) {
    createdOn = new Date(createdOn)
  }
  var hasBeenDaysSinceAccountCreated = hasBeenDaysSince(createdOn, DAYS_SINCE_CREATED_ACCOUNT);
  
  return hasBeenDaysSinceAccountCreated
}

return false

