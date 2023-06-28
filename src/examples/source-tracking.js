// This script records traffic source and saves it to localStorage
function getPlatformAndSource() {
	var platform = ''
	var source = ''
  var timestamp = Date.now();

	var search = new URLSearchParams(window.location.search)
	var utmMedium = search.get('utm_medium')
	var utmSource = search.get('utm_source')
  var trafficSource = search.get('traffic-source')

  if (utmSource) {
		platform = utmSource
	}
	if (utmMedium) {
		source = utmMedium.toLowerCase()
	}

  if (trafficSource && typeof trafficSource === 'string') {
    try {
      var parsed = JSON.parse(decodeURI(trafficSource))
      if ( parsed.hasOwnProperty('timestamp')  && parsed.hasOwnProperty('source') && parsed.hasOwnProperty('platform')) {
        platform = parsed.platform;
        source = parsed.source;
        timestamp = parsed.timestamp;
      }
    } catch {

    }
  }
	
	if (source === '') {
		source = 'organic'
		var ref = document.referrer
		var isPaidLink = (window.location.href.search(/(gclid)|(fbclid)/gi) !== -1)
		if (ref.search(/(google)/gi) !== -1) {
			if (isPaidLink) {
				source = 'paid'
			} else {
				source = 'organic'	
			}
		} else if (ref.search(/(facebook)|(linkedin)|(linktr)|(youtube)/gi) !== -1) {
			source = 'social';
		} else if (ref !== '') {
			source = 'unknown';
		}
	
	}
	if (platform === '' && ref !== '') {
		platform = ref.replace(/(https:\/\/)|(http:\/\/)|(www.)/gi, '').split('/')[0]
	}
	return {
		platform, source, timestamp
	}	
}

function getItem(key, useSessionStorage = false) {
  var storageKey = useSessionStorage ? 'sessionStorage' : 'localStorage'
  if (Object.prototype.hasOwnProperty.call(window, storageKey)) {
    var result = window[storageKey].getItem(key);
    return result !== null ? JSON.parse(result) : null;  
  }
  return null
}

function setItem(key, value, useSessionStorage = false) {
  var storageKey = useSessionStorage ? 'sessionStorage' : 'localStorage'
  if (Object.prototype.hasOwnProperty.call(window, storageKey)) {
    window[storageKey].setItem(key, JSON.stringify(value));
  }  
}

function appendTrafficSourceToUrl(href, trafficSource) {
  var valuesTopPreserve = JSON.stringify(trafficSource)
  var url = new URL(href);
  url.searchParams.append('traffic-source', valuesTopPreserve);
  return url.toString()
}

var pageObject = getPlatformAndSource();
var platform = pageObject.platform
var source = pageObject.source
var platform = pageObject.platform
var timestamp = pageObject.timestamp
var doNotUpdate = (platform === '' || platform.search(/(paysafecard.com)|(skrill.com)|(neteller.com)/gi) !== -1)

if (!doNotUpdate) {
  var record = {
    timestamp: timestamp,
    source: source,
    platform: platform
  }
  setItem('traffic-source', record)
}

var trafficSource = getItem('traffic-source');
var isPublicDomain = (window.location.hostname.search(/(www.paysafecard.com)|(www.skrill.com)|(www.neteller.com)/gi) !== -1)
if (isPublicDomain && trafficSource) {
  if ( trafficSource.hasOwnProperty('timestamp') 
    && trafficSource.hasOwnProperty('source') 
    && trafficSource.hasOwnProperty('platform')
  ) {
    var externalLinks = document.querySelectorAll('a[href^="https://account."],a[href^="https://member."],a[href^="https://my."]')
    externalLinks.forEach(function(link) {
      var oldHref = link.getAttribute('href')
      var newHref = appendTrafficSourceToUrl(oldHref, trafficSource)
      link.setAttribute('href', newHref)
    })
    
  }
}
