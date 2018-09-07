import test from 'ava'
import { mount } from '@vue/test-utils'
import Component from '../src/vue-quick-search.vue'

test.beforeEach(t => {
  global.returnResults = false
})

test('active search url replaces |val|', t => {
  global.returnResults = true
  const wrapper = mount(Component, {
    propsData: {
      url: '--|val|--'
    }
  })
  wrapper.setProps({
    isActive: true,
    resultLimit: 0
  })
  wrapper.setData({searchTerm: 'foo'})
  const footerLink = wrapper.find('.vue-qs__results-footer a')
  t.true(footerLink.attributes().href === '--foo--')
})
