var CAMPAIGN_SESSION_KEY = 'sts-clicked-banner';

function setItem(key, value, useSessionStorage = false) {
  var storageKey = useSessionStorage ? 'sessionStorage' : 'localStorage'
  if (Object.prototype.hasOwnProperty.call(window, storageKey)) {
    window[storageKey].setItem(key, JSON.stringify(value));
  }  
}

var utils = optimizely.get('utils');
utils.waitForElement('main').then(function(main) {
  // TODO: add banner check for correct banner
  // Record click on the banner in a session storage
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
})
