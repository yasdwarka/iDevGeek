// utils.js
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
utils.waitForElement('section.text-media.text-media--limit.theme-white').then(function(discoverElement) {
  var partners = document.querySelector('section.image-cards-2-col');
  if (partners) {
    insertAfter(partners, discoverElement);
  }
});