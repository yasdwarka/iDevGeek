

function tplReplace(stringToReplace, data) {
  return stringToReplace.replace(/\${([^{}]*)}/g,
    function (a, b) {
      var r = data[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
}

function insertAfter(existingNode, newNode) {
  if (!existingNode || !newNode) {
    return;
  }
  // convert string to a fragment
  if (typeof newNode === 'string') {
    newNode = document.createRange().createContextualFragment(newNode);
  }
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function insertBefore(existingNode, newNode) {
  if (!existingNode || !newNode) {
    return;
  }
  // convert string to a fragment
  if (typeof newNode === 'string') {
    newNode = document.createRange().createContextualFragment(newNode);
  }
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

var content = {
    EN:{
    	title:'Spend and earn with your Net+ Card',
      copy:'Spend at least R$50 with your physical Net+ Mastercard® online or in-store and get up to R$100 back.',
      note:'*Offer valid until 27th August. Terms and conditions apply.',
      cta:'Learn more',
      url: '#'
    },
    "PT-BR": {
    	title: 'Gaste e ganhe com seu Cartão Net+',
      copy:'Gaste pelo menos R$50 com seu cartão físico Net+ Mastercard® online ou em lojas físicas e receba até R$100 de volta.  *',
      note:'*Oferta válida até 27 de Agosto. Termos e condições aplicáveis.',
      cta:'Saiba mais',
      url: '#'
  	},
  };


var template = '<h1>${title}</h1><p>${copy}</p><p><a href="${url}" target="_blank" class="btn" rel="noreferrer">${cta}</a></p><p class="cta_disclaimer">${note}</p>';
var utils = optimizely.get('utils');
utils.waitForElement('body').then(function() { 
  var lang = document.querySelector('html').getAttribute('lang') || 'en';
  lang = lang.toUpperCase();
  var useContent = content.EN;
  if (content.hasOwnProperty(lang)) {
    useContent = content[lang];
  }

  var bannerContent = tplReplace(template, useContent)
  var container = document.querySelector('main > section > div:nth-child(2) > div')
  if (container) {
    container.innerHTML = bannerContent
  }
});
  
  	
                                              
