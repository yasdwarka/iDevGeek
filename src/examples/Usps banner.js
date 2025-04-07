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
var utils = optimizely.get("utils");

var copy = ""; 
var copy1 = "";
var copy2 = "";
var title = "";
var title1 = "";
var title2 = "";
// Declare it globally so it can be used in both functions


var href = window.location.href;

if (href.includes("/en/")) {
  title="Global";
 copy= "Accepted by the world’s leading gaming sites";
  title1="Instant";
 copy1= "Make secure, fast online payments with only your Skrill credentials";
  title2="Convenient";
 copy2= "Fund your account by card, bank transfer or local payment options. Pay with your card and deposit for free.";
} 
else if (href.includes("/de/")) {
   title="Weltweit";
 copy= "Von den weltweit führenden Spieleseiten akzeptiert";
  title1="Sofort";
 copy1= "Sichere und schnelle Online-Zahlungen nur mit Ihren Skrill-Zugangsdaten";
  title2="Praktisch";
 copy2= "Laden Sie Ihr Konto per Karte, Banküberweisung oder lokalen Zahlungsoptionen auf";
}
else if (href.includes("/pl/")) {
  title="Globalny zasięg";
 copy= "Usługa akceptowana przez wiodące światowe serwisy gier hazardowych";
  title1="Błyskawicznie";
 copy1= "Dokonuj bezpiecznych, szybkich płatności online tylko za pomocą swoich danych uwierzytelniających Skrill";
  title2="Wygoda";
 copy2= "Zasilenie konta za pomocą karty, przelewu bankowego lub lokalnych opcji płatności";
}
else if (href.includes("/pt/")) {
  title="Global";
 copy= "Pague sem problemas num grande número de plataformas. A Skrill é aceite pelos sites de jogos mais populares do mundo virtual.";
  title1="Imediato";
 copy1= "Efetue pagamentos numa plataforma de pagamentos online rápida e segura, usando apenas os seus dados Skrill. Desfrute ainda de uma funcionalidade de pagamento em que nem sequer tem de pausar o seu jogo para pagar!";
  title2="Conveniente";
 copy2= "Depositar fundos na sua conta através de cartão, transferência bancária ou opções locais de pagamento. Pague com MULTIBANCO e deposite gratuitamente.";
}

if (copy) {
  utils
    .waitForElement("#c512591 ,#c512721,#c513041 ,#c513391")
    .then(function (elem) {
      var template = `
        <section class="benefits">
    <div class="benefit">
      <img src="fingerprint-icon.png" alt="Global" class="icon">
      <p><strong>${title}</strong></p><br><p>${copy}</p>
    </div>
    <div class="benefit">
      <img src="fingerprint-icon.png" alt="Instant" class="icon">
       <p><strong>${title1}</strong></p><br><p>${copy1}</p>
    </div>
    <div class="benefit">
      <img src="fingerprint-icon.png" alt="Convenient" class="icon">
      <p><strong>${title2}</strong></p><br><p>${copy2}</p>
    </div>
  </section>
        </section>`;
      insertBefore(elem, template);
    });
  
}
