// Project JavaScript
// This JavaScript code will run before the Optimizely snippet on every page, regardless of whether or not there is a running experiment.

window.optimizely = window.optimizely || [];
function getVisitorValue(visitor, key) {
  var accountName = window.location.href
    .replace(/(www.)|(.com)|(https:\/\/)/gi, "")
    .split("/")
    .shift();
  var def = { value: undefined };
  var useArray = Array.isArray(visitor) ? visitor : Object.values(visitor);
  var find = useArray.find(function (item) {
    return item.name === accountName + "_" + key;
  });
  return find || def;
}

function init() {
  var custom = optimizely.get("visitor")["custom"];
  var loginFrequency = getVisitorValue(custom, "login_frequency");
  var frequency = parseInt(loginFrequency.value) || 0;

  window.optimizely.push({
    type: "user",
    attributes: {
      paysafe_login_frequency: frequency,
    },
  });
}

function addOnPageListeners(wrapper) {
  wrapper.addEventListener(
    "click",
    function (event) {
      if (
        event.target.matches(
          '.tab-content > div:nth-child(2) a.btn-secondary[href*="/login"]'
        )
      ) {
        var custom = optimizely.get("visitor")["custom"];
        var loginFrequency = getVisitorValue(custom, "login_frequency");
        var frequency = parseInt(loginFrequency.value) || 0;

        window.optimizely.push({
          type: "user",
          attributes: {
            paysafe_login_frequency: frequency + 1,
          },
        });
      }
    },
    true
  );
}

window.optimizely.push({
  type: "addListener",
  filter: {
    type: "lifecycle",
    name: "originsSynced",
  },
  handler: function profileUpdates(event) {
    var body = document.querySelector("body");
    if (body) {
      addOnPageListeners(body)
    }
    init();
  },
});

