function tplReplace(stringToReplace, data) {
  return stringToReplace.replace(/\${([^{}]*)}/g,
    function (a, b) {
      var r = data[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
}

function getLang() {
  var lang = document.querySelector('html').getAttribute('lang') || 'en';
  return lang.toLowerCase();
}

function insertBefore(existingNode, newNode) {
  if (!existingNode || !newNode) {
    return;
  }
  // convert string to a fragment
  if (typeof newNode === "string") {
    newNode = document.createRange().createContextualFragment(newNode);
  }
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

var content = {
  "en": {
    "title": "Global",
    "copy": "Accepted by the world’s leading gaming sites",
    "title1": "Instant",
    "copy1": "Make secure, fast online payments with only your Skrill credentials",
    "title2": "Convenient",
    "copy2": "Fund your account by card, bank transfer or local payment options. Pay with your card and deposit for free."
  },
  "de": {
    "title": "Weltweit",
    "copy": "Von den weltweit führenden Spieleseiten akzeptiert",
    "title1": "Sofort",
    "copy1": "Sichere und schnelle Online-Zahlungen nur mit Ihren Skrill-Zugangsdaten",
    "title2": "Praktisch",
    "copy2": "Laden Sie Ihr Konto per Karte, Banküberweisung oder lokalen Zahlungsoptionen auf"
  },
  "pl": {
    "title": "Globalny zasięg",
    "copy": "Usługa akceptowana przez wiodące światowe serwisy gier hazardowych",
    "title1": "Błyskawicznie",
    "copy1": "Dokonuj bezpiecznych, szybkich płatności online tylko za pomocą swoich danych uwierzytelniających Skrill",
    "title2": "Wygoda",
    "copy2": "Zasilenie konta za pomocą karty, przelewu bankowego lub lokalnych opcji płatności"
  },
  "pt": {
    "title": "Global",
    "copy": "Pague sem problemas num grande número de plataformas. A Skrill é aceite pelos sites de jogos mais populares do mundo virtual.",
    "title1": "Imediato",
    "copy1": "Efetue pagamentos numa plataforma de pagamentos online rápida e segura, usando apenas os seus dados Skrill. Desfrute ainda de uma funcionalidade de pagamento em que nem sequer tem de pausar o seu jogo para pagar!",
    "title2": "Conveniente",
    "copy2": "Depositar fundos na sua conta através de cartão, transferência bancária ou opções locais de pagamento. Pague com MULTIBANCO e deposite gratuitamente."
  }
}

var lang = getLang();
var useContent = content[lang];
var utils = optimizely.get("utils");

// Only run if the content exists
if (useContent && utils) {
  utils
    .waitForElement("section.cards.cards-icons.mobile-stack")
    .then(function (elem) {
      var template = '<section class="benefits"><div class="benefit"><img src="fingerprint-icon.png" alt="Global" class="icon"><p><strong>${title}</strong></p><br><p>${copy}</p></div><div class="benefit"><img src="fingerprint-icon.png" alt="Instant" class="icon"><p><strong>${title1}</strong></p><br><p>${copy1}</p></div><div class="benefit"><img src="fingerprint-icon.png" alt="Convenient" class="icon"><p><strong>${title2}</strong></p><br><p>${copy2}</p></div></section></section>';
      var content = tplReplace(template, useContent);
      insertBefore(elem, content);
    });
}
