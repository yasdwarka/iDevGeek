// Targeting RegEx match: 
// skrill.com\/(|en|de|fr|es|it|pl|gr|ru|cn|cz|es-us|en-us|en-in|pt|pt-br)\/(?:\?((?:.)*))?$

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
    	titlePrivacy: 'Privacy',
    	copyPrivacy: 'Pay without sharing bank details or personal information.',
    	titleSecurity: 'Security',
    	copySecurity: 'Your money is protected by fraud prevention technology and Skrill is regulated by the Financial Conduct Authority (FCA).',
      titleSpeed: 'Speed',
      copySpeed: 'Access and move your money quickly and easily.'
    },
    DE: {
      titlePrivacy: 'Datenschutz',
      copyPrivacy: 'Sie bezahlen, ohne Bankdaten oder personenbezogene Informationen zu übermitteln.',
      titleSecurity: 'Sicherheit',
      copySecurity: 'Ihr Geld ist durch Betrugspräventionstechnologie geschützt und Skrill wird von der FCS (Financial Conduct Authority) reguliert.',
      titleSpeed: 'Geschwindigkeit',
      copySpeed: 'Sie können schnell und einfach auf Ihr Geld zugreifen und Geldtransfers tätigen.',
    },
    ES: {
      titlePrivacy: 'Privacidad',
      copyPrivacy: 'Pague sin compartir datos bancarios ni información personal.',
      titleSecurity: 'Seguridad',
      copySecurity: 'Su dinero está protegido por tecnología de prevención de fraudes y Skrill está regulada por la Financial Conduct Authority (FCA).',
      titleSpeed: 'Velocidad',
      copySpeed: 'Acceda y transfiera su dinero de forma rápida y sencilla.',
    },
    FR: {
      titlePrivacy: 'Confidentialité',
      copyPrivacy: 'Payez sans partager vos coordonnées bancaires ni vos informations personnelles.',
      titleSecurity: 'Sécurité',
      copySecurity: "Votre argent est protégé par une technologie de prévention des fraudes et Skrill est régulé par l'Autorité de conduite financière (FCA).",
      titleSpeed: 'Vitesse',
      copySpeed: 'Accédez à votre argent et transférez-le rapidement et facilement.',
    },
    IT: {
      titlePrivacy: 'Riservatezza',
      copyPrivacy: 'Paga senza condividere dati bancari né informazioni personali.',
      titleSecurity: 'Sicurezza',
      copySecurity: 'Il tuo denaro è protetto dalla tecnologia di rilevamento e prevenzione delle frodi e Skrill è regolamentato dalla Financial Conduct Authority (FCA).',
      titleSpeed: 'Velocità',
      copySpeed: 'Accedi e sposta il tuo denaro in modo facile e veloce.',
    },
    PL: {
      titlePrivacy: 'Prywatność',
      copyPrivacy: 'Płać bez podawania danych bankowych i osobowych.',
      titleSecurity: 'Bezpieczeństwo',
      copySecurity: 'Twoje pieniądze są chronione za pomocą technologii zapobiegania oszustwom finansowym, a Skrill podlega nadzorowi Financial Conduct Authority (FCA).',
      titleSpeed: 'Szybkość',
      copySpeed: 'Dysponuj swoimi pieniędzmi szybko i łatwo.',
    },
    PT: {
      titlePrivacy: 'Privacidade',
      copyPrivacy: 'Pague sem partilhar dados bancários ou informações pessoais.',
      titleSecurity: 'Segurança',
      copySecurity: 'O seu dinheiro está protegido por tecnologia de prevenção de fraudes, e a Skrill é regulamentada pela Autoridade de Conduta Financeira (FCA).',
      titleSpeed: 'Rapidez',
      copySpeed: 'Aceda ao seu dinheiro e movimente-o de forma rápida e fácil.',
    },
    "PT-BR": {
      titlePrivacy: 'Privacidade',
      copyPrivacy: 'Faça pagamentos sem compartilhar seus dados bancários ou informações pessoais.',
      titleSecurity: 'Segurança',
      copySecurity: 'Seu dinheiro é protegido por tecnologia de ponta de prevenção de fraudes e a Skrill é regulamentada pela Autoridade de Conduta Financeira (Financial Conduct Authority).',
      titleSpeed: 'Velocidade',
      copySpeed: 'Gerencie e transfira seu dinheiro de maneira rápida e simples.',
    },
    CZ: {
      titlePrivacy: 'Soukromí',
      copyPrivacy: 'Plaťte bez sdílení bankovních údajů a osobních informací.',
      titleSecurity: 'Bezpečnost',
      copySecurity: 'Vaše peníze jsou chráněny technologií pro prevenci podvodů a společnost Skrill je regulována Úřadem pro finanční etiku (FCA).',
      titleSpeed: 'Rychlost',
      copySpeed: 'Přistupujte k penězům a přesouvejte je snadno a rychle.',
    },
    GR: {
      titlePrivacy: 'Ιδιωτικότητα',
      copyPrivacy: 'Πλήρωσε χωρίς να κοινοποιήσεις τραπεζικά ή προσωπικά στοιχεία.',
      titleSecurity: 'Ασφάλεια',
      copySecurity: 'Τα χρήματά σου προστατεύονται από τεχνολογία πρόληψης της απάτης και η Skrill υπόκειται στις ρυθμίσεις της Αρχής Χρηματοπιστωτικής Συμπεριφοράς (FCA).',
      titleSpeed: 'Ταχύτητα',
      copySpeed: 'Διατήρησε την πρόσβαση και μετακίνησε τα χρήματά σου εύκολα και γρήγορα.',
    },
    RU: {
      titlePrivacy: 'Конфиденциальность',
      copyPrivacy: 'Расплачивайтесь без раскрытия банковских реквизитов или персональных данных.',
      titleSecurity: 'Безопасность',
      copySecurity: 'Ваши деньги защищены технологиями предупреждения мошенничества, а деятельность Skrill регулируется Financial Conduct Authority (FCA).',
      titleSpeed: 'Скорость',
      copySpeed: 'Получайте доступ к своим деньгам и переводите их быстро и просто.',
    },
    
  };


var templatePrivacy = '<div><img src="https://www.skrill.com/fileadmin/Personal/homepage/testing/make-your-move/fingerptint_light.svg" alt="${titlePrivacy}" /><h3>${titlePrivacy}</h3><p>${copyPrivacy}</p></div>';
var templateSecurity = '<div><img src="https://www.skrill.com/fileadmin/Personal/homepage/testing/make-your-move/privacy_light.svg" alt="${titleSecurity}" /><h3>${titleSecurity}</h3><p>${copySecurity}</p></div>';
var templateSpeed = '<div><img src="https://www.skrill.com/fileadmin/Personal/homepage/testing/make-your-move/time.svg" alt="${titleSpeed}" /><h3>${titleSpeed}</h3><p>${copySpeed}</p></div>';
var template = '<section class="text-media text-media--contain  brand-credibility-banner">' + templatePrivacy + templateSecurity + templateSpeed + '</section>';

var utils = optimizely.get('utils');
utils.waitForElement('.download-app').then(function( appBannerContainer ) { 
  if (appBannerContainer) {
    var lang = document.querySelector('html').getAttribute('lang') || 'en';
    lang = lang.toUpperCase();
    var useContent = content.EN;
    if (content.hasOwnProperty(lang)) {
      useContent = content[lang];
    }
  
    var bannerContent = tplReplace(template, useContent)
    insertBefore(appBannerContainer, bannerContent)
  }
});