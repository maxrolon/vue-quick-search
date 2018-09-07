import { addHook } from 'pirates'

function matcher (filename) {
  return !!~filename.indexOf('nanoajax')
}

function mutate (code, filename) {
  return `
  module.exports = {
    abort: function () {},
    ajax: function (options, callback) {
      global.ajaxUrl = options.url
      const empty = {
        results: [],
        total: 1
      }
      const full = {
        results: [{
          title: 'bar'
        }],
        total: 1
      }
      if (global.hangResults) {
        return
      }
      if (global.returnResults) {
        callback(200, full)
      } else {
        callback(200, empty)
      }
    }
  }`
}

addHook(mutate, {
  exts: ['.js'],
  ignoreNodeModules: false,
  matcher
})
