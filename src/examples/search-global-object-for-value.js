// Search all global variables for value
const search = 'stanislav'
const keys = Object.keys(window)
const found = []
const ignoreKeys = []
keys.forEach( key => {
  try {
    const str = JSON.stringify(window[key])
    if (str.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
      found.push(key)
    }
  } catch (e) {
    ignoreKeys.push(key)
  }
})
console.log({found})