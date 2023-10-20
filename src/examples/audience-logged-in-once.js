function getValue(visitor, key) {
  var accountName =
    window.location.href.indexOf("skrill.com") !== -1 ? "skrill" : "neteller";
  var def = { value: undefined };
  if (Array.isArray(visitor)) {
    var find = visitor.find(function (item) {
      return item.name === accountName + "_" + key;
    });
    return find || def;
  }
  return def;
}

var visitor = Object.values(window.optimizely.get("visitor").custom || []);
var loginCount = Number(getValue(visitor, "loginFrequency").value || 0);
loginCount === 1;
