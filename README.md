# Code share for Optimizely and Paysafe
This a small collection of useful scripts and snippets used to build Optimizely A/B tests. `modules` contains code snippets, `examples` folder contains example code, `__mocks__` and `__tests__` are unit test related folders.

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
getLang()
```

## insertAfter
Inserts an element before parent element. When element is a string, it converts it into DOM.

```javascript
var parent = document.getElementById('parent')
insertAfter(parent, '<p>Hello Kitty</p>');

// OR

var parent = document.getElementById('parent')
var child = document.getElementById('child')
insertAfter(parent, child);
```


## insertBefore
Inserts an element after parent element. When element is a string, it converts it into DOM.

```javascript
var parent = document.getElementById('parent')
insertBefore(parent, '<p>Hello Kitty</p>');

// OR

var parent = document.getElementById('parent')
var child = document.getElementById('child')
insertbefore(parent, child);
```

## numberWithSep
Format number with thousands separator.

````javascript
var formatted = numberWithSep(1000); // -> 1,000
````

## getAccountName
Returns current website name. This is useful when we run the same code for Neteller and Skrill.

````javascript
var siteName = getAccountName();  // -> 'skrill' | 'neteller' | 'paysafecard' | null
````
## setItem
Save value to session or local storage.

````javascript
setItem('test', {test: "value"});   // Saves object to localStorage
setItem('test', {test: "value"}, true); // Saves object to sessionStorage
setItem('test', 123, true); // Saves number to sessionStorage
setItem('test', 'lorem ipsum', true); // Saves string to sessionStorage
````

## getItem
Get value from session or local storage. Returns `null` when not found

````javascript
getItem('test');   // Get value from  localStorage
setItem('test', true); // Get value from sessionStorage
````

