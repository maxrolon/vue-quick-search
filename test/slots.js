import test from 'ava'
import { mount } from '@vue/test-utils'
import Component from '../src/vue-quick-search.vue'

test.beforeEach(t => {
  global.returnResults = false
  global.hangResults = false
})

test('Test: no-results slot is passed data correctly', t => {
  const wrapper = mount(Component, {
    scopedSlots: {
      'no-results': '<div class="bar" slot-scope="props">{{ props.searchTerm }}</div>'
    }
  })
  wrapper.setProps({isActive: true})
  wrapper.setData({searchTerm: 'foo'})
  const slotText = wrapper.find('.bar').text()
  t.true(slotText === 'foo')
})

test('results-footer slot is passed data correctly', t => {
  global.returnResults = true
  const wrapper = mount(Component, {
    scopedSlots: {
      'results-footer': `
        <template slot-scope="props">
          <a :href="props.activeSearchUrl" class="foo">{{props.resultsCount}}</a>
        </template>`
    }
  })
  wrapper.setProps({
    isActive: true,
    resultLimit: 0
  })
  wrapper.setData({searchTerm: 'foo'})
  const slotText = wrapper.find('.foo').text()
  t.true(Number(slotText) === 1)
})

test('submit-button slot is passed data correctly', t => {
  const wrapper = mount(Component, {
    scopedSlots: {
      'submit-button': `<i class="foo">Icon</i>`
    }
  })
  wrapper.setProps({isActive: true})
  const slotText = wrapper.find('i.foo').text()
  t.true(slotText === 'Icon')
})

test('result slot is passed data correctly', t => {
  const wrapper = mount(Component, {
    scopedSlots: {
      'result': `
        <template item-scope="props">
          <p class="result-title">{{props.item.title}}</p>
        </template>`
    }
  })
  wrapper.setProps({
    isActive: true
  })
  wrapper.setData({searchTerm: 'foo'})
  const slotText = wrapper.find('p.result-title').text()
  t.true(slotText === 'bar')
})

test('loading slot is rendered correctly', t => {
  global.hangResults = true
  const wrapper = mount(Component, {
    scopedSlots: {
      'loading': `<p>I am loading!</p>`
    }
  })
  wrapper.setProps({
    isActive: true
  })
  wrapper.setData({searchTerm: 'foo'})
  const slotText = wrapper.find('.vue-qs__sans-results-loading p').text()
  t.true(slotText === 'I am loading!')
})

test('form-inputs is rendered correctly', t => {
  const wrapper = mount(Component, {
    scopedSlots: {
      'form-inputs': `
      <input type="hidden" name="type" value="foo" />
      `
    }
  })
  wrapper.setProps({isActive: true})
  const slot = wrapper.findAll('[type="hidden"]')
  t.true(slot.length === 1)
})
