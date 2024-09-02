function tplReplace(stringToReplace, data) {
  return stringToReplace.replace(/\${([^{}]*)}/g,
    function (a, b) {
      var r = data[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
}

var template = '<div><h1 class="">${title}</h1><p>${copy}</p><p><a href="/en/pay-online/?uniqueLink=1" target="_top" class="btn btn__teal" data-optly-68dd6ab3-c37a-4ab1-af62-9ade03ec6da3="" data-optly-df57536c-31ed-45af-ba58-3cd618a4d53e="">${cta}</a><br data-optly-df57536c-31ed-45af-ba58-3cd618a4d53e=""><span id="para2" data-optly-df57536c-31ed-45af-ba58-3cd618a4d53e="">${terms}</span></p></div>'
var content = {
    EN: {
        title: 'Make your move and win up to €10,000*',
        copy: 'Use the Skrill digital wallet to pay online, send money and join the competition to win big.',
        cta: 'Discover more',
        terms: '*Terms and conditions apply',
    },
    FR: {
        title: 'Faites votre transfert et gagnez jusqu’à €10,000*',
        copy: 'Utilisez le portefeuille numérique Skrill pour payer en ligne, envoyez de l’argent et rejoignez le concours pour gagner gros.',
        cta: 'En savoir plus',
        terms: '*Les conditions générales s’appliquent',
    }
};

var utils = optimizely.get('utils');
utils.waitForElement("main").then(function (elem) {
    var lang = document.querySelector('html').getAttribute('lang') || 'EN'; // Default to 'EN'
    lang = lang.toUpperCase();
    var useContent = content[lang] || content.EN; // Fallback to English if the lang key doesn't exist in content
    
    var bannerContent = tplReplace(template, useContent)
    var container = document.querySelector('main > section > div:nth-child(2) > div')
    if (container) {
      // insertAfter(document.querySelector('#main-content'), translatedModal)
      container.innerHTML = bannerContent
    }


    // var title = document.querySelector(" h1");
    // if (title) {
    //     title.innerHTML = useContent.title;
    // }
    // var copy = document.querySelector("#c513401 p");
    // if (copy) {
    //     copy.innerHTML = useContent.copy;
    // }
    // var cta = document.querySelector(".btn__teal ");
    // if (cta) {
    //     cta.innerHTML = useContent.cta;
    // }
    // var terms = document.querySelector("#para2");
    // if (terms) {
    //     terms.innerHTML = useContent.terms;
    // }
});



