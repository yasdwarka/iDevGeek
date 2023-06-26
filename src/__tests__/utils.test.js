const utils = require('../modules/utils');

const parentMarkup = '<div id="parent">Parent mock element</div>'
const childMarkup = '<span id="child">Child mock element</span>'

const storageMock = () => {
  let store = {};

  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
}

Object.defineProperty(window, 'localStorage', {
  value: (storageMock)()
});

Object.defineProperty(window, 'sessionStorage', {
  value: (storageMock)()
});

describe("Utils", function() {
  describe("tplReplace", function() {
    it("should place JSON key values in string", () => {
      const data = {
        mockKey: 'mock'
      }
      const result = utils.tplReplace('<b>${mockKey}</b>', data)
      expect(result).toBe('<b>mock</b>');
    })
    it("should ignore placeholder when JSON key is not set", () => {
      const data = {}
      const result = utils.tplReplace('<b>${mockKey}</b>', data)
      expect(result).toBe('<b>${mockKey}</b>');
    })
  })
  describe("getLang", function() {
    it("should return en as default language", () => {
      const result = utils.getLang()
      expect(result).toBe('en');
    })
    it("should return es when lang attribute is set to es", () => {
      document.querySelector('html').setAttribute('lang', 'es');
      const result = utils.getLang()
      expect(result).toBe('es');
    })
  })
  describe("insertAfter", function() {
    it("should insert string as element after selected element", () => {
      document.querySelector('html').innerHTML = parentMarkup
      const parent = document.getElementById('parent')
      utils.insertAfter(parent, childMarkup)
      expect(document.querySelector('#parent + #child').innerHTML).toBe('Child mock element');
      expect(document.querySelector('#child + #parent')).toBe(null);
    })
    it("should move DOM element after selected element", () => {
      document.querySelector('html').innerHTML = `${childMarkup}${parentMarkup}`
      const parent = document.getElementById('parent')
      const child = document.getElementById('child')
      expect(document.querySelector('#child + #parent').innerHTML).toBe('Parent mock element');
      expect(document.querySelector('#parent + #child')).toBe(null);
      utils.insertAfter(parent, child)
      expect(document.querySelector('#parent + #child').innerHTML).toBe('Child mock element');
      expect(document.querySelector('#child + #parent')).toBe(null);
    })
    it("should do nothing when elements are not set", () => {
      document.querySelector('html').innerHTML = parentMarkup
      const parent = document.getElementById('parent')
      utils.insertAfter(parent, '')
      expect(document.querySelector('#parent + #child')).toBe(null);
      expect(document.querySelector('#child + #parent')).toBe(null);
    })
  })
  describe("insertBefore", function() {
    it("should insert string as element before selected element", () => {
      document.querySelector('html').innerHTML = parentMarkup
      const parent = document.getElementById('parent')
      utils.insertBefore(parent, childMarkup)
      expect(document.querySelector('#child + #parent').innerHTML).toBe('Parent mock element');
      expect(document.querySelector('#parent + #child')).toBe(null);
    })
    it("should move DOM element before selected element", () => {
      document.querySelector('html').innerHTML = `${childMarkup}${parentMarkup}`
      const parent = document.getElementById('parent')
      const child = document.getElementById('child')
      expect(document.querySelector('#child + #parent').innerHTML).toBe('Parent mock element');
      expect(document.querySelector('#parent + #child')).toBe(null);
      utils.insertBefore(parent, child)
      expect(document.querySelector('#child + #parent').innerHTML).toBe('Parent mock element');
      expect(document.querySelector('#parent + #child')).toBe(null);
    })
    it("should do nothing when elements are not set", () => {
      document.querySelector('html').innerHTML = parentMarkup
      const parent = document.getElementById('parent')
      utils.insertBefore(parent, '')
      expect(document.querySelector('#parent + #child')).toBe(null);
      expect(document.querySelector('#child + #parent')).toBe(null);
    })
  })
  describe("numberWithSep", function() {
    it("should add thousands separators to a number", () => {
      expect(utils.numberWithSep(100)).toBe('100');
      expect(utils.numberWithSep(1000)).toBe('1,000');
      expect(utils.numberWithSep(10000)).toBe('10,000');
      expect(utils.numberWithSep(1000000)).toBe('1,000,000');
      expect(utils.numberWithSep(null)).toBe('');
      expect(utils.numberWithSep(undefined)).toBe('');
    })
  })
  describe("getAccountName", function() {
    it("should return correct account name based on URL", () => {
      const useWindow = {
        location: {
          href: 'https://www.paysafecard.com/en/'
        }
      }

      expect(utils.getAccountName(useWindow)).toBe('paysafecard');
      useWindow.location.href = 'https://www.skrill.com/en/business/'
      expect(utils.getAccountName(useWindow)).toBe('skrill');
      useWindow.location.href = 'https://www.skrill.com/en/?optimizely_token=442dcb639a367d697c194b484fb4c9579f7247df2b9cbf4be05c1462b4cbea69&optimizely_x=24338000829&optimizely_x_audiences=&optimizely_preview_layer_ids=24321810893&optimizely_snippet=s3-19453582680&optimizely_preview_mode_CAMPAIGN=24321810893'
      expect(utils.getAccountName(useWindow)).toBe('skrill');
      useWindow.location.href = 'https://www.neteller.com/es'
      expect(utils.getAccountName(useWindow)).toBe('neteller');
    })
    it("should return null when run on unknown domain", () => {
      const useWindow = {
        location: {
          href: 'https://www.bbc.co.uk/news'
        }
      }
      expect(utils.getAccountName(useWindow)).toBe(null);
    })
  })
  describe("setItem", function() {
    it("should write an item to local storage ", () => {
      window.localStorage.clear();
      jest.restoreAllMocks();  
      utils.setItem('test', 'test-value')
      expect(window.localStorage.getItem('test')).toBe(JSON.stringify('test-value'));
      utils.setItem('test', {test: "value"})
      expect(window.localStorage.getItem('test')).toBe(JSON.stringify({test: "value"}));
      utils.setItem('test', 123)
      expect(window.localStorage.getItem('test')).toBe(JSON.stringify(123));
    })
    it("should write an item to session storage ", () => {
      window.sessionStorage.clear();
      jest.restoreAllMocks();  
      utils.setItem('test', 'test-value', true)
      expect(window.sessionStorage.getItem('test')).toBe(JSON.stringify('test-value'));
      utils.setItem('test', {test: "value"}, true)
      expect(window.sessionStorage.getItem('test')).toBe(JSON.stringify({test: "value"}));
      utils.setItem('test', 123, true)
      expect(window.sessionStorage.getItem('test')).toBe(JSON.stringify(123));
    })
  })
  describe("getItem", function() {
    it("should write an item to local storage ", () => {
      window.localStorage.clear();
      jest.restoreAllMocks();
      utils.setItem('test', 'test-value')
      expect(utils.getItem('test')).toBe('test-value');
      utils.setItem('test', {test: "value"})
      expect(utils.getItem('test')).toEqual({test: "value"});
      utils.setItem('test', 123)
      expect(utils.getItem('test')).toBe(123);
    })
    it("should write an item to session storage ", () => {
      window.sessionStorage.clear();
      jest.restoreAllMocks();
      utils.setItem('test', 'test-value', true)
      expect(utils.getItem('test', true)).toBe('test-value');
      utils.setItem('test', {test: "value"}, true)
      expect(utils.getItem('test', true)).toEqual({test: "value"});
      utils.setItem('test', 123, true)
      expect(utils.getItem('test', true)).toBe(123);
    })
  })
})
