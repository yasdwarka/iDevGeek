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

var utils = optimizely.get('utils');
utils.waitForElement('section.image-cards-2-col div.col-12')
  .then(function(elem) {
    var slidesData = [
      {
        src: "/fileadmin/_processed_/7/a/csm_asda_e17a14ff64.png",
        width: 250,
        height: 100,
        alt: ""
      },
      {
        src: "/fileadmin/B2C/Images/partner/logo/distributors/epay_110x55.svg",
        width: 250,
        height: 100,
        alt: ""
      },
      {
        src: "/fileadmin/_processed_/f/5/csm_mc-colls_622949722d.png",
        width: 250,
        height: 100,
        alt: ""
      },
      {
        src: "/fileadmin/_processed_/d/5/csm_oneStop_68b03a3860.png",
        width: 250,
        height: 100,
        alt: ""
      },
      {
        src: "/fileadmin/_processed_/0/0/csm_aion_7713c4b5d1.png",
        width: 250,
        height: 100,
        alt: ""
      },
      {
        src: "/fileadmin/B2C/Images/partner/logo/brand/vertical_Games/bigpoint_bigpoint_110x55.svg",
        width: 250,
        height: 100,
        alt: ""
      },
      {
        src: "/fileadmin/B2C/Images/partner/logo/brand/vertical_Games/microsoft_xbox_110x55.svg",
        width: 250,
        height: 100,
        alt: ""
      }
    ]

    var slideTemplate = '<div class="slide"><img src="${src}" height="${height}" width="${width}" alt="${alt}" /></div>'
    var containerTemplate = '<div class="ab-test-slider-container"><div class="ab-test-slider"><div class="slide-track">${slides}</div></div></div>'

    var slides = ''

    slidesData.forEach( function (slideData) {
      slides += tplReplace(slideTemplate, slideData)
    })
    // shadow copy of the slides
    slidesData.forEach( function (slideData) {
      slides += tplReplace(slideTemplate, slideData)
    })

    var carousel = tplReplace(containerTemplate, {slides: slides})
    
    insertAfter(elem, carousel)
  })