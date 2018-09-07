import test from 'ava'
import { mount } from '@vue/test-utils'
import Component from '../src/vue-quick-search.vue'

test.beforeEach(t => {
  global.returnResults = false
  global.ajaxUrl = false
})

test('test isActive updates render', t => {
  const wrapper = mount(Component)
  wrapper.setProps({isActive: true})
  const isActive = wrapper.isVisible()
  t.true(isActive)
})

test('test filter endpoint', t => {
  const wrapper = mount(Component, {
    propsData: {
      filterAJAXUrl (endpoint) {
        return `${endpoint}&view=foo`
      }
    }
  })
  wrapper.setData({searchTerm: 'foo'})
  t.true(!!~global.ajaxUrl.indexOf('view=foo'))
})
