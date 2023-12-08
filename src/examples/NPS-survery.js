// the number of days since the user saw/interacted with the campaign for the last time
var startAgainAfterDays = 90; 
var version = 'B';    // 'A' | 'B'
var maxOpens = 2;
var isNetller = (window.location.href.indexOf('neteller.com') !== -1);
var feedbackMaxCharLength = 1000;   // maximum length of the feedback field

function getItem(key) {
  var result = window.localStorage.getItem(key);
  return result !== null ? JSON.parse(result) : null;
}

function setItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function tplReplace(stringToReplace, JSON) {
  return stringToReplace.replace(/\${([^{}]*)}/g,
    function (a, b) {
      var r = JSON[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
}

var modalTemplate = '<div class="_ab-test-modal"><div class="_ab-test-modal-header"><a href="#close" class="_ab-test-modal-close" title="${close}"><svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"/><path stroke="#5C5C5C" stroke-linecap="round" stroke-width="2" d="M17 7 7 17M7 7l10 10"/></g></svg></a></div><div class="_ab-test-modal-body"></div></div><div class="_ab-test-modal-overlay"></div>';

function createModal(content, onClose, onOpen, lang) {
  var modalExists = document.querySelector('._ab-test-modal-wrapper');
  if (modalExists) {
    return null;
  }

  var wrapper = document.createElement('div');
  wrapper.classList.add('_ab-test-modal-wrapper');
  wrapper.classList.add('_ab-test-modal--hide');
  if (isNetller) {
    wrapper.classList.add('_ab-test-modal--neteller');
  }
  wrapper.innerHTML = tplReplace(modalTemplate, lang);

  var modalBody = wrapper.querySelector('._ab-test-modal-body');
  modalBody.append(content);

  document.body.appendChild(wrapper);

  // var onEscKeyPress = function(e) {
  //   if (e.key === "Escape") {
  //     closeModal()
  //   }
  // }

  var closeModal = function() {
    wrapper.classList.add('_ab-test-modal--hide');
    // document.body.removeEventListener('keypress', onEscKeyPress);
    if (onClose) {
      onClose();
    }
  }


  var openModal = function() {
    // document.body.addEventListener('keypress', onEscKeyPress);
    wrapper.classList.remove('_ab-test-modal--hide');
    if (onOpen) {
      onOpen();
    }
  }

  wrapper.addEventListener('click', function (event) {
    if (event.target.matches('._ab-test-modal-close') || event.target.matches('#_ab-test-close') || event.target.matches('._ab-test-modal-overlay')) {
      event.preventDefault();
      closeModal();
    };  
    if (event.target.matches('._ab-test-modal-open')) {
      event.preventDefault();
      openModal();
    };  
  }, false);
  

  var modal = {
    _self: wrapper,
    close: function() {
      closeModal();
    },
    open: function() {
      openModal();
    },
    update: function(newContent) {
      modalBody.innerHTML = '';
      modalBody.append(newContent);
    }
  }
  return modal;
}

function submitForm(formDataObject, onComplete) {
  var form_data = new URLSearchParams();
  for ( var key in formDataObject ) {
      form_data.append(key, formDataObject[key]);
  }
  var url = isNetller ? 'https://news.neteller.com/pub/rf' : 'https://news.skrill.com/pub/rf';

  // please this line in the shared code experiment setup
  // window.windowFetch = window.fetch;
  // var useFetch = typeof windowFetch !== 'undefined' ? windowFetch : fetch;
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    redirect: 'follow',
    body: form_data
  }).then(function(response) {
    return response;
  }).then(function(data) {
    onComplete()
  }).catch(function(err) {
    onComplete();
    console.error('ERROR', err);
  });
}

function getValue(visitor, key) {
  var accountName = window.location.href.indexOf('skrill.com') !== -1? 'skrill' : 'neteller';
  var def = {value: undefined};
  if (Array.isArray(visitor)) {
    var find = visitor.find(function(item) {
      return item.name === accountName + '_' + key;
    });
    return find || def;
  }
  return def;
}

function insertAfter(existingNode, newNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function insertBefore(existingNode, newNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

var lang = {
  EN: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Thank you for participating.',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Considering your experience so far, how likely are you to recommend ${brand} to someone like you?',
    messageB: 'How likely are you to recommend ${brand}?',
    close: 'Close',
    submit: 'Submit',
    feedbackText: {
      low: 'What can we do better?',
      medium: 'What should we do to WOW you?',
      high: 'What did we do well?'
    },
  },
  DE: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Vielen Dank für Ihre Teilnahme.',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'In Anbetracht Ihrer bisherigen Erfahrungen, wie wahrscheinlich ist es, dass Sie ${brand} jemandem wie Ihnen weiterempfehlen würden?',
    messageB: 'Wie wahrscheinlich ist es, dass Sie ${brand} weiterempfehlen werden?',
    close: 'Schließen',
    submit: 'Absenden',
    feedbackText: {
      low: 'Was können wir besser machen?',
      medium: 'Was können wir tun, um Sie zu beeindrucken?',
      high: 'Was haben wir gut gemacht?'
    },
  },
  "ES-US": {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Gracias por participar',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Teniendo en cuenta su experiencia hasta el momento, ¿qué probabilidad hay de que recomiende ${brand} a alguien como usted?',
    messageB: '¿Qué probabilidad hay que recomiende ${brand}?',
    close: 'Cerrar',
    submit: 'Enviar',
    feedbackText: {
      low: 'Qué podemos hacer mejor?',
      medium: '¿Qué debemos hacer para sorprenderle?',
      high: '¿Qué hicimos bien?'
    },      
  },
  ES: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Gracias por participar',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Teniendo en cuenta su experiencia hasta el momento, ¿qué posibilidades hay de que recomiende ${brand} a alguien como usted?',
    messageB: '¿Qué probabilidad hay que recomiende ${brand}?',
    close: 'Cerrar',
    submit: 'Enviar',
    feedbackText: {
      low: '¿Qué podemos hacer mejor?',
      medium: '¿Qué debemos hacer para SORPRENDERLE?',
      high: '¿Qué hicimos bien?'
    },
  },
  FR: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: "Merci d'avoir participé",
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'En tenant compte de votre expérience jusqu’ici, quelles sont les probabilités que vous recommandiez ${brand} à une personne comme vous?',
    messageB: 'Dans quelle mesure pourriez-vous recommander ${brand}?',
    close: 'Fermer',
    submit: 'Envoyer',
    feedbackText: {
      low: 'Que pouvons-nous améliorer?',
      medium: 'Que devrions-nous faire pour vous impressionner?',
      high: 'Qu’avons-nous fait de bien?'
    },
  },
  IT: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Grazie per aver partecipato',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Considerando la tua esperienza finora, con quanta probabilità consiglieresti ${brand} a qualcuno come te?',
    messageB: 'Con quanta probabilità consiglieresti ${brand}?',
    close: 'Chiudi',
    submit: 'Invia',
    feedbackText: {
      low: 'Che cosa possiamo fare meglio?',
      medium: 'Che cosa dovremmo fare per sorprenderti?',
      high: 'Che cosa facciamo bene?'
    },      
  },
  PL: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Dziękujemy za wzięcie udziału',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Biorąc pod uwagę Twoje dotychczasowe doświadczenia, jak bardzo prawdopodobne jest, że polecisz ${brand} komuś podobnemu do Ciebie?',
    messageB: 'Jak duże jest prawdopodobieństwo, że polecisz ${brand}?',
    close: 'Zamknij',
    submit: 'Wyślij',
    feedbackText: {
      low: 'Co możemy zrobić lepiej?',
      medium: 'Co powinniśmy zrobić, żeby Cię zachwycić?',
      high: 'Co udało nam się zrobić dobrze?'
    },      
  },
  RU: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Спасибо за участие.',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Учитывая Ваш опыт, какова вероятность того, что Вы бы кому-нибудь порекомендовали ${brand}?',
    messageB: 'Насколько вероятно, что Вы порекомендуете ${brand}?',
    close: 'Закрыть',
    submit: 'Отправить',
    feedbackText: {
      low: 'Что мы можем улучшить?',
      medium: 'Что нам сделать, чтобы поразить Вас?',
      high: 'Что Вам нравится?'
    },      
  },
  EL: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Ευχαριστούμε για τη συμμετοχή σας',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Λαμβάνοντας υπόψη την μέχρι τώρα εμπειρία σας, πόσο πιθανό είναι να προτείνετε τις ${brand} σε κάποιον σαν εσάς;',
    messageB: 'Πόσο πιθανό είναι να συ στήσετε τη ${brand}',
    close: 'Κλείσιμο',
    submit: 'Υποβολή',
    feedbackText: {
      low: 'Τι μπορούμε να κάνουμε καλύτερα;',
      medium: 'Τι πρέπει να κάνουμε για να σας ΚΑΤΑΠΛΗΞΟΥΜΕ;',
      high: 'Τι κάναμε καλά;'
    },      
  },
  KO: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: '참여해주셔서 감사합니다',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: '지금까지의 경험상 귀하와 같은 누군가에게${brand}를 추천할 가능성은 얼마나 됩니까?',
    messageB: '귀하가 ${brand}을 추천할 가능성은 얼마나 됩니까?',
    close: '닫기',
    submit: '제출',
    feedbackText: {
      low: '어떻게 하면 서비스를 개선할 수 있을까요?',
      medium: '귀하를 감동시키려면 어떻게 해야 할까요?',
      high: '저희가 잘했던 부분은 무엇입니까?'
    },      
  },
  PT: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Obrigado por participar.',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'Tendo em consideração a sua experiência até este momento, qual é a probabilidade de recomendar a ${brand} a outra pessoa parecida consigo?',
    messageB: 'Qual é a probabilidade de recomendar a ${brand}?',
    close: 'Fechar',
    submit: 'Enviar',
    feedbackText: {
      low: 'O que podemos fazer melhor?',
      medium: 'O que devemos fazer para surpreendê-lo?',
      high: 'O que fizemos bem?'
    },      
  },
  "BR-PT": {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Obrigado por participar.',
    skrill: 'Skrill para',
    neteller: 'NETELLER da',
    message: 'Considerando sua experiência até o momento, qual a probabilidade de você recomendar a ${brand} alguém como você?',
    messageB: 'Qual é a probabilidade de você recomendar a ${brand}?',
    close: 'Fechar',
    submit: 'Enviar',
    feedbackText: {
      low: 'O que podemos fazer melhor?',
      medium: 'O que devemos fazer para você ter uma experiência incrível?',
      high: 'O que fizemos bem?'
    },      
  },
  CN: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: '谢谢您的参与',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: '根据您目前的体验，您有多大可能将 ${brand} 推荐给向您这样的人？',
    messageB: '您推荐 ${brand} 的可能性有多大？',
    close: '关闭',
    submit: '提交',
    feedbackText: {
      low: '我们怎样才能做得更好？',
      medium: '我们该怎样做才能让您感到惊艳？',
      high: '我们在哪些方面做得不错？'
    },      
  },
  CZ: {
    topMenuTitle: '',
    bottomMenuTitle: '',
    thankYou: 'Děkujeme za účast',
    skrill: 'Skrill',
    neteller: 'NETELLER',
    message: 'S ohledem na tvoji dosavadní zkušenost, jak moc bys doporučil/a ${brand} někomu s podobnými zájmy?',
    messageB: 'S jakou pravděpodobností byste doporučili ${brand}?',
    close: 'Zavřít',
    submit: 'Odeslat',
    feedbackText: {
      low: 'Co můžeme zlepšit?',
      medium: 'Co bychom měli udělat, abychom tě více zaujali?',
      high: 'Co jsme udělali dobře?'
    },      
  }
};

var utils = optimizely.get('utils');
utils.waitForElement('#grid-main > pw-dashboard > div.pw-dashboard-spacing > div:nth-child(1)')
  .then(function(elem) {
    var isDebug = document.querySelector('optly-preview') !== null;
    var visitor = Object.values(window.optimizely.get('visitor').custom);
    var customerId = getValue(visitor, 'customer_id').value || 0;
    // Do not execute any further if we unknown customer
    if (customerId === 0) {
      return;
    }
    var language = getValue(visitor, 'language').value || 'EN';

    var siteCopy = lang[language];
    if (isNetller) {
      siteCopy.brand = siteCopy.neteller;
    } else {
      siteCopy.brand = siteCopy.skrill;
    }
    if (version === 'B') {
      siteCopy.message = tplReplace(siteCopy.messageB, siteCopy);
    } else {
      siteCopy.message = tplReplace(siteCopy.message, siteCopy);  
    }

    var formDataObject = {
      CUSTOMER_ID_: customerId,
      CUSTOMER_ID: customerId,
      FORM_SOURCE: "MY ACCOUNT_" + version,
      LANG_LOCALE: language,
      FEEDBACK: '',
      CAMPAIGN_: "NPS_SURVEY",
      charset_: "UTF-8",
      _Sent_: '',
      _LID_: "4171855",
      _ri_: "X0Gzc2X%3DAQpglLjHJlTQGzccff3seLgg37YN3MBzgPIrzdhXkHTLC37acGYVwjpnpgHlpgneHmgJoXX0Gzc2X%3DAQpglLjHJlTQGq2LzcrWavJXhuOj1mzeLzbjizdhXkHTLC37acGY",
      _ei_: "EUVN12Qed-LkusYMDrBQfto",
      _di_: "mh5tircrrgnko0i4kghp5hd06mvfvov55d5perbc6c7splu61icg",
      __HIDDEN_FIELD_NAMES__: "CAMPAIGN_;charset_;_Sent_;_LID_;_ri_;_ei_;_di_;__HIDDEN_FIELD_NAMES__",
    };
    
    if (isNetller) {
      formDataObject._ri_ = "X0Gzc2X%3DAQpglLjHJlTQGfFTlG0uttArczbKzg4OrfvdzdaJpUaLUN197zfWBfVwjpnpgHlpgneHmgJoXX0Gzc2X%3DAQpglLjHJlTQGzdDzfzeIKXGK01zfyFFrzf9BzfhtaJpUaLUN197zfWBf";
      formDataObject._di_ = "g766809e1ams49irknjfolj8q61192thcsv8e9sqq97g5931esug";
      formDataObject._ei_ = "ENIGJGOUGfZ_NE_N4tLHhgg";
      formDataObject._LID_ = "190485182";
      formDataObject.NETELLER_RECOMMEND = 999;
    } else {
      formDataObject.SKRILL_RECOMMEND = 999;
    }

    var menuButtonTemplate = '<a id="_ab-test-open-modal" href="#open-modal" class="_ab-test-modal-open"><span class="_ab-test-inner"><span class="_ab-test-icon"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="800" height="800" viewBox="0 0 217.929 217.929"><path d="M212.39 101.703c5.023-4.897 6.797-12.083 4.629-18.755s-7.827-11.443-14.769-12.452l-52.969-7.697a.296.296 0 0 1-.223-.162L125.371 14.64c-3.104-6.291-9.391-10.2-16.407-10.2s-13.302 3.909-16.406 10.2L68.87 62.637a.298.298 0 0 1-.223.162l-52.968 7.697C8.737 71.505 3.078 76.276.91 82.948s-.394 13.858 4.629 18.755l38.328 37.361c.07.068.102.166.085.262l-9.048 52.755c-1.186 6.914 1.604 13.771 7.279 17.894 5.676 4.125 13.059 4.657 19.268 1.393l47.376-24.907a.296.296 0 0 1 .276 0l47.376 24.907a18.304 18.304 0 0 0 8.531 2.121c3.777 0 7.53-1.184 10.736-3.514 5.675-4.123 8.464-10.98 7.279-17.895l-9.048-52.754a.297.297 0 0 1 .085-.262l38.328-37.361zm-56.155 40.665 9.048 52.754c.024.14.031.182-.118.29-.149.108-.187.088-.312.022l-47.377-24.908a18.301 18.301 0 0 0-17.027 0l-47.376 24.907c-.125.065-.163.086-.312-.022-.149-.108-.142-.15-.118-.289l9.048-52.755a18.294 18.294 0 0 0-5.262-16.194l-38.326-37.36c-.101-.099-.132-.128-.075-.303.057-.175.099-.181.239-.202l52.968-7.697a18.29 18.29 0 0 0 13.776-10.008l23.688-47.998c.063-.126.081-.165.265-.165s.203.039.265.165l23.688 47.998a18.29 18.29 0 0 0 13.776 10.008l52.968 7.697c.14.021.182.027.239.202.057.175.026.205-.075.303l-38.328 37.361a18.298 18.298 0 0 0-5.262 16.194z"/></svg></span><span class="_ab-test-right-column"><span class="_ab-test-right-column-top">${topMenuTitle}</span><span class="_ab-test-right-column-bottom">${bottomMenuTitle}</span></span></span></a>';
    var closeButton = '<button id="_ab-test-close" class="add-email-button ps-stroked-button ps-primary ps-button-base ng-star-inserted">${close}</button>';
    var thankYouTemplate = '<h2 class="balances-label ps-subtitle-2 ps-margin-bottom-tiny ng-star-inserted">${thankYou}</h2><div class="_ab-test-buttons-row _ab-test-buttons-row--center">' + closeButton + '</div>';
    var starsTemplate = '<input type="radio" id="star${rating}" class="rate" name="rate" value="${rating}" /><label class="__rating-label" for="star${rating}" title="text">${rating}</label>';
    var rateTemplate = '<div class="rating-wrapper">${stars}</div>';
    var formTemplate = '<div class="__user-rating narrow-content-width ng-star-inserted"><div class="nav-container"><h2 class="balances-label ps-subtitle-2 ps-margin-bottom-tiny ng-star-inserted">${message}</h2><form>${content}${feedback}</form></div></div>';
    var feedbackTemplate = '<div class="step-two"><textarea rows="4" value="" placeholder="" id="FEEDBACK" name="FEEDBACK"></textarea><div class="_ab-test-buttons-row">' + closeButton + '<input type="submit" id="_ab-test-SUBMIT" value="${submit}" class="ps-flat-button ps-primary ps-button-base" disabled></div></div>'


    var addFormListeners = function(form) {
      form.addEventListener('change', function (event) {
        var formObject = new FormData(form);
        var rating = parseInt(formObject.get('rate'));
        if (isNaN(rating)) {
          return;
        }
        var container = document.querySelector('.__user-rating');
        container.classList.add('_user-has-rated');
        var feedback = document.getElementById('FEEDBACK');
        var placeholder = siteCopy.feedbackText.low;
        if (rating > 6 && rating < 9) {
          placeholder = siteCopy.feedbackText.medium;
        } else if (rating >= 9) {
          placeholder = siteCopy.feedbackText.high;
        }
        feedback.setAttribute('placeholder', placeholder);
  
        if (isNetller) {
          formDataObject.NETELLER_RECOMMEND = rating;
        } else {
          formDataObject.SKRILL_RECOMMEND = rating;
        }
        var button = document.querySelector('#_ab-test-SUBMIT');
        if (button) {
          button.removeAttribute('disabled');
        }
      }, false);
  
      form.addEventListener('keyup', function (event) {
        var feedback = document.getElementById('FEEDBACK');
        var feedbackValue = feedback.value;
        feedback.value = feedbackValue.slice(0,feedbackMaxCharLength);
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var container = document.querySelector('.__user-rating');
        var formObject = new FormData(form);
        var feedback = formObject.get('FEEDBACK');
        formDataObject.FEEDBACK = feedback ? feedback.replace(/[\t\n"]/g, '.') : feedback;
        var currentDate = new Date().toISOString().replace(/[TZ]/gi, ' ').trim();
        formDataObject._Sent_ = currentDate;
        submitForm(formDataObject, function() {
          container.querySelector('h2').remove();
          form.innerHTML = tplReplace(thankYouTemplate, siteCopy);
          formDataObject.SKRILL_RECOMMEND = 999;
          formDataObject._Sent_ = '';
          formDataObject.FEEDBACK = '';
          setItem('_ab-test-nps-submitted', true);
          var accountName = !isNetller ? 'skrill' : 'neteller';
          window.optimizely = window.optimizely || [];
          window.optimizely.push({
            "type": "user",
            "attributes": {
              [accountName + "_completed_nps_customer_id"]: customerId
            }
          });
        });
      });
    }

    var createModalContent = function() {
      var stars = 11;
      var starsElements = '';
      for (let index = 0; index < stars; index++) {
        starsElements += tplReplace(starsTemplate, {rating: index});
      }
      starsElements = tplReplace(rateTemplate, {stars: starsElements});
      formElements = tplReplace(formTemplate, {content: starsElements, feedback: feedbackTemplate});
      var modalContent = document.createElement('div');
      modalContent.innerHTML = tplReplace(formElements, siteCopy);
      return modalContent;
    }
    
    var modal = createModal(createModalContent(), function() {
      var accountName = !isNetller ? 'skrill' : 'neteller';
      var val = getItem('_ab-test-nps-views') || 0;
      setItem('_ab-test-nps-views', val + 1);
      setItem('_ab-test-nps-last-seen', new Date().getTime());

      if (val + 1 >= maxOpens) {
        window.optimizely = window.optimizely || [];
        window.optimizely.push({
          "type": "user",
          "attributes": {
            [accountName + "_dismissed_nps_customer_id"]: customerId
          }
        }); 
      }
      
    }, null, siteCopy);

    var seenCounter = getItem('_ab-test-nps-views') || 0;
    var lastSeenTimeStamp = getItem('_ab-test-nps-last-seen') || 0;
    var timeStampYesterday = new Date().getTime() - (24 * 60 * 60 * 1000);
    var hasBeenOver24Hours = (lastSeenTimeStamp <= timeStampYesterday);

    var timeStampInThePast = new Date().getTime() - (startAgainAfterDays * 24 * 60 * 60 * 1000);
    var hasBeenOverPast = (lastSeenTimeStamp <= timeStampInThePast);

    var hasSubmitted = getItem('_ab-test-nps-submitted') || false;
    // var showModalNow = (!hasSubmitted && hasBeenOver24Hours && seenCounter < maxOpens)
    var showModalNow = (!hasSubmitted && seenCounter < maxOpens)
    if (isDebug || showModalNow) {
      modal.open();
    } else if (hasBeenOverPast) {
      setItem('_ab-test-nps-last-seen', 0);
      setItem('_ab-test-nps-views', 0);
      setItem('_ab-test-nps-submitted', false);
      modal.open();
    }

    var menuItem = document.querySelector('.user-space-item.expandable-header-element');
    if (menuItem) {
      var menuButton = document.createElement('div');
      menuButton.innerHTML = tplReplace(menuButtonTemplate, siteCopy);
      insertBefore(menuItem, menuButton);
  
      menuButton.addEventListener('click', function (event) {
        event.preventDefault();
  
        modal.update(createModalContent());      
        addFormListeners(document.querySelector('.__user-rating form'));
        
        modal.open();
      }, false);  
    }

    addFormListeners(document.querySelector('.__user-rating form'));
    
});
