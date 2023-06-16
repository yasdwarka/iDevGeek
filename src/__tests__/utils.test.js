const utils = require('../modules/utils');

const parentMarkup = '<div id="parent">Parent mock element</div>'
const childMarkup = '<span id="child">Child mock element</span>'

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
    it("should add thousands separators to a nubmer", () => {
      expect(utils.numberWithSep(100)).toBe('100');
      expect(utils.numberWithSep(1000)).toBe('1,000');
      expect(utils.numberWithSep(10000)).toBe('10,000');
      expect(utils.numberWithSep(1000000)).toBe('1,000,000');
      expect(utils.numberWithSep(null)).toBe('');
      expect(utils.numberWithSep(undefined)).toBe('');
    })
  })  
})
