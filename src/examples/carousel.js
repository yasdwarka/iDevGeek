// 1 - sliding carousel with buttons
// 2 - static 5 images only with buttons
// 3 - sliding only no buttons
window.CAROUSEL_OPTION = 2;

function tplReplace(stringToReplace, data) {
  return stringToReplace.replace(/\${([^{}]*)}/g, function (a, b) {
    var r = data[b];
    return typeof r === "string" || typeof r === "number" ? r : a;
  });
}

function insertAfter(existingNode, newNode) {
  if (!existingNode || !newNode) {
    return;
  }
  // convert string to a fragment
  if (typeof newNode === "string") {
    newNode = document.createRange().createContextualFragment(newNode);
  }
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function createSlider(
  container,
  slidesData,
  idClass,
  carouselVersion,
  speed,
  button
) {
  var slideTemplate =
    '<div class="slide"><img src="${src}" height="${height}" width="${width}" alt="${alt}" /></div>';

  var slides = "";
  var useData = slidesData.slice();
  var dataCounter = useData.length;

  useData.forEach(function (slideData) {
    slides += tplReplace(slideTemplate, slideData);
  });

  // shadow copy of the slides
  useData.forEach(function (slideData) {
    slides += tplReplace(slideTemplate, slideData);
  });
  useData.forEach(function (slideData) {
    slides += tplReplace(slideTemplate, slideData);
  });
  useData.forEach(function (slideData) {
    slides += tplReplace(slideTemplate, slideData);
  });
  dataCounter = slidesData.length * 2;

  var slideWidth = 132;

  var containerTemplate =
    '<div class="ab-test-slider-container ' +
    idClass +
    '"><div class="ab-test-slider"><div class="slide-track">${slides}</div></div><div class="slider-button">' +
    button +
    "</div></div>" +
    "<style>@keyframes scroll-" +
    idClass +
    " {0% { transform: translateX(0); }100% { transform: translateX(calc(-" +
    slideWidth +
    "px * " +
    dataCounter / 2 +
    "))}}." +
    idClass +
    "	.slide-track {width: calc(" +
    slideWidth +
    "px * " +
    dataCounter +
    ");} ." +
    idClass +
    " .slide-track {animation: scroll-" +
    idClass +
    " " +
    speed +
    "s linear infinite;}</style>";

  var carousel = tplReplace(containerTemplate, { slides: slides });
  return carousel;
}

function getDataObject(data) {
  var res = [];
  data.forEach(function (el) {
    var src = el.getAttribute("src");
    res.push({
      src: src,
      width: 100,
      height: 50,
      alt: "",
    });
  });
  return res;
}

var utils = optimizely.get("utils");
utils.waitForElement("section.image-cards-2-col").then(function (elem) {
  const hero = document.querySelector("section.decoration.homepage-hero-tabs");
  if (hero) {
    var firstRowData = elem.querySelectorAll(
      ".col-12.col-md-6:nth-child(1) .image-cards__block img"
    );
    var secondRowData = elem.querySelectorAll(
      ".col-12.col-md-6:nth-child(2) .image-cards__block img"
    );
    var buttonPurchase = elem.querySelector(
      ".col-12.col-md-6:nth-child(1) .image-cards__block p:last-child a"
    );
    var buttonUse = elem.querySelector(
      ".col-12.col-md-6:nth-child(2) .image-cards__block p:last-child a"
    );

    var buttonA = buttonPurchase.cloneNode(true).outerHTML;
    var buttonB = buttonUse.cloneNode(true).outerHTML;

    var carousels = "";
    if (firstRowData) {
      carousels += createSlider(
        carouselWrapper,
        getDataObject(firstRowData),
        "first-carousel",
        window.CAROUSEL_OPTION,
        30,
        buttonA
      );
    }
    if (secondRowData) {
      carousels += createSlider(
        carouselWrapper,
        getDataObject(secondRowData),
        "second-carousel",
        window.CAROUSEL_OPTION,
        40,
        buttonB
      );
    }

    var carouselWrapper =
      '<div id="carousel-wrapper" class="carousel_option_' +
      window.CAROUSEL_OPTION +
      '"><div class="carousel-inner-wrapper">' +
      carousels +
      '</div><div class="carousel-buttons">' +
      buttonA +
      buttonB +
      "</div></div>";

    insertAfter(hero, carouselWrapper);
  }
});
