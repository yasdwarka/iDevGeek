function redirectToLanguageSpecificURL() {
  var hasBeenRedirected = window.location.pathname.match(/004germanyv1/gi) !== null;
  var siteIsDe = window.location.href.match(/(\.com\/de)/gi) !== null;
  var siteIsEn = window.location.href.match(/(\.com\/en)/gi) !== null;
  if (!hasBeenRedirected || (!siteIsEn && !siteIsDe)) {
    // Define your language-specific URLs
    var englishURL = 'https://www.skrill.com/en/pay-online/004germanyv1/';
    var germanURL = 'https://www.skrill.com/de/online-bezahlen/004germanyv1/';
    var tail = window.location.search + window.location.hash;
    var newUrl = (siteIsDe ? germanURL : englishURL) + tail
    window.location.assign(newUrl)
    // window.location.href = newUrl;
  }
}
