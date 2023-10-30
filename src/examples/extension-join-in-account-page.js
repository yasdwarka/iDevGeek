var utils = optimizely.get('utils');

utils.waitForElement('.mbox-sign-up-icons')
  .then(function() {
    // Prepend the extension html to the body
    //elem.insertAdjacentHTML('afterbegin', extension.$html);
    //Translations
  	window.optimizelyLangUpdate = function(){  
        var el = document.querySelector("ps-select-trigger.ng-tns-c11-1")
        var fullLang = el ? el.innerText : 'English';
        var lang;
        switch(fullLang){
          case "English":
            lang = "EN";
            break;
          case "Deutsch":
            lang = "DE";
            break;
          case "Español":
            lang = "ES";
            break;
          case "Français":
            lang = "FR";
            break;
          case "Italiano":
            lang = "IT";
            break;
          case "Polski":
            lang = "PL";
            break;
          case "Português":
            lang = "PT";
            break;
          case "Português Brasileiro":
            lang = "BR";
            break;
          case "Român":
            lang = "RO";
            break;
          case "USA - English":
            lang = "EN";
            break;
          case "USA - Español":
            lang = "ES";
            break;
          case "Český":
            lang = "CZ";
            break;
          case "Ελληνικά":
            lang = "GR";
            break;
          case "Русский":
            lang = "RU";
            break;
          case "中文":
            lang = "CN";
            break;
          default:
            lang = "EN";
            break;
        } 

        window["optimizely"].push({
          "type": "user",
          "attributes": {
            "neteller_language": lang
          }
        });
        if(extension.translations.indexOf(lang) > -1){
          document.querySelector(".features__icon").src=extension.banner_image;
          document.querySelector(".features__title").innerText=extension.copy;
          document.querySelector(".mbox-sign-up-title>.ps-title-1").innerText=extension.registration_title;
          document.querySelector(".mbox-sign-up-subtitle>.ps-title-1").innerText=extension.registration_subtitle;
        }
        var title, subtitle, copy;

        if(extension.translations.indexOf("None") == -1){

        if(extension.translations.length > ((extension.translated_copy.match(/:/g) !== null) ? extension.translated_copy.match(/:/g).length : 0) || extension.translations.length > ((extension.translated_copy.match(/\n/g) !== null) ? extension.translated_copy.match(/\n/g).length : 0) + 1){

            document.getElementById("tt-signupCopy").innerText = "There is an issue with your 'Copy translations' field. You selected " + extension.translations.length + " language translations, but fewer were provided. Make sure they follow the format, e.g. for German: 'DE: [Your copy]' on its own line.";

          }else{

            if(extension.translations.indexOf(lang) > -1){

              title = extension.translated_title.split(lang + ": ")[1] || false;
              subtitle = extension.translated_subtitle.split(lang + ": ")[1] || false;
              copy = extension.translated_copy.split(lang + ": ")[1] || false;
              document.querySelector(".features__title").innerHTML = (copy) ? copy.split("\n")[0] : document.getElementById(".features__title").innerHTML;
              document.querySelector(".mbox-sign-up-title>.ps-title-1").innerText=(title) ? title.split("\n")[0] : document.getElementById(".mbox-sign-up-title>.ps-title-1").innerHTML;
        			document.querySelector(".mbox-sign-up-subtitle>.ps-title-1").innerText= (subtitle) ? subtitle.split("\n")[0] : document.getElementById(".mbox-sign-up-subtitle>.ps-title-1").innerHTML;
            }
          } 
        }
    };
    
		optimizelyLangUpdate();
    var el = document.querySelector("ps-select-trigger.ng-tns-c11-1")
    if (el) {
      el.addEventListener("DOMCharacterDataModified", function() {
        utils.waitForElement('.mbox-sign-up-icons')
       .then(function() {
         optimizelyLangUpdate();
        });
         console.log("language update");
      }); 
    }
  
  	//Banner is clicked
  	/*
    window.signupBanner_linkClick = function(){
      window['optimizely'].push({
        type: "event",
        eventName: "skrill_signupBaner_linkClick"
      });
      if(typeof optimizelyDwhClicks !== "undefined" && optimizelyDwhClicks["signup_banner"]){
        optimizelyDwhClicks["signup_banner"]();
      }
    };
		*/

    if(extension.impressions=="true"){
      //Impression logic
      /*
       * Usage
       *   The following allows you to set a limit on the number of times a Code Block will execute for any given visitor.
       */
      // the number of days the evaluation limit should last
      var days = 30;
      // name of the cookie we use as the counter
      var cookieName = extension.cookie_counter_name;

      // function to fetch cookie values
      var getCookie = function(name) {
        var match = document.cookie.match(name+'=([^;]*)');
        return match ? match[1] : undefined;
      };

      // function to create cookies
      var setCookie = function(c_name,value,exdays,c_domain) {
        c_domain = (typeof c_domain === "undefined") ? "" : "domain=" + c_domain + ";";
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value + ";" + c_domain + "path=/";
      };
      // logic that counts and limits number of times code can evaluate for given visitor
      if (!getCookie(cookieName)) {
        setCookie(cookieName, 1, days, window.location.hostname);
        sessionStorage.setItem(extension.cookie_counter_name, 'true');
      } else {
        if(!window.sessionStorage[extension.cookie_counter_name]){
          var numberPops = parseInt(getCookie(cookieName)) + 1;
          setCookie(cookieName, numberPops, days, window.location.hostname);
          sessionStorage.setItem(extension.cookie_counter_name, 'true');
        }
      }
    }  
  });
