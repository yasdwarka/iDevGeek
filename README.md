# Code share for Optimizely and Paysafe

## Installing project and running unit tests project
Run `npm install` first. To run unit tests, please run `npm run test`.

## tplReplace
Simple templating mini-engine. Use JSON object with key to place values in a string.

```javascript
var exampleElement = tplReplace('<p>Hello ${name} ${surname}!</p>', {
  name: 'Kitty',
  surname: 'Cat'
});
```

## getPageLanguage
Get langauge of the page based on the value of html lang attribute. Defaults to `en`.

```javascript
utils.getLang()
```

## insertBefore
Inserts an element before parent element. When element is a string, it converts it into DOM.

```javascript
const parent = document.getElementById('parent')
utils.insertAfter(parent, '<p>Hello Kitty</p>');

// OR

const parent = document.getElementById('parent')
const child = document.getElementById('child')
utils.insertAfter(parent, child);
```


## insertBefore
Inserts an element after parent element. When element is a string, it converts it into DOM.

```javascript
const parent = document.getElementById('parent')
utils.insertBefore(parent, '<p>Hello Kitty</p>');

// OR

const parent = document.getElementById('parent')
const child = document.getElementById('child')
utils.insertbefore(parent, child);
```

