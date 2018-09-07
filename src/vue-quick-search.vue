<script>
import nanoajax from 'nanoajax'

function getResults (url, callback) {
  nanoajax.ajax({url}, callback)
}

export default {
  name: 'vue-quick-search',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: '/search/term/|val|'
    },
    formAction: {
      type: String,
      default: '/search'
    },
    formInputName: {
      type: String,
      default: 'q'
    },
    formInputLabel: {
      type: String,
      default: 'Search by keyword, style, etc...'
    },
    formSubmitTitle: {
      type: String,
      default: 'Fetch search results'
    },
    formInputType: {
      type: String,
      default: 'text'
    },
    filterResults: {
      type: Function,
      default (result) {
        return result
      }
    },
    filterAJAXUrl: {
      type: Function,
      default (endpoint) {
        return endpoint
      }
    },
    getResults: {
      type: Function,
      default: getResults
    },
    resultLimit: {
      type: Number,
      default: 5
    },
    exitDelay: {
      type: Number,
      default: 300
    },
    hijackSubmit: {
      type: Function,
      default (el) {
        el.submit()
      }
    },
    decodeResponse: {
      type: Function,
      default (response) {
        if (typeof response === 'string') {
          response = JSON.parse(response)
        }
        return {
          results: response.results || [],
          total: response['total'] || 0
        }
      }
    }
  },
  data () {
    return {
      initialState: true,
      searchTerm: '',
      resultsCount: 0,
      results: [],
      activeAjaxRequest: false,
      inputFocused: false,
      isLoading: false,
      isSubmitting: false
    }
  },
  watch: {
    searchTerm () {
      this.prepareGetResults()
    }
  },
  computed: {
    activeSearchUrl () {
      const regex = new RegExp('(.[^?]*)[?](.*)')
      const url = this.url.replace('|val|', this.searchTerm)
      const matches = url.match(regex)
      if (!matches) {
        return url
      }
      return `${matches[1] ? matches[1] : ''}${matches[2] ? `?${encodeURIComponent(matches[2])}` : ''}`
    },
    filteredResults () {
      let filtered = []
      for (let i = 0; i < this.results.length; i++) {
        if (this.filterResults(this.results[i])) {
          filtered.push(this.results[i])
        }
      }
      return filtered
    },
    stubbedResults () {
      if (this.resultLimit === 0) {
        return this.filteredResults
      }
      return this.filteredResults.slice(0, this.resultLimit)
    },
    shouldShowLabel () {
      return !this.searchTerm
    },
    fullSearchQuery () {
      const url = this.url.replace('|val|', this.searchTerm)
      const regex = new RegExp(`${this.formInputName}=(.[^&]*)`)
      const match = url.match(regex)
      return match[1]
    }
  },
  methods: {
    prepareGetResults () {
      this.isLoading = true
      this.initialState && (this.initialState = false)
      this.activeAjaxRequest && this.activeAjaxRequest.abort()
      const url = `${this.url.replace('|val|', this.searchTerm)}`
      this.getResults(this.filterAJAXUrl(url), this.onResponse)
    },
    onResponse (code, res) {
      if (res !== 'Abort' && res !== 'Error') {
        this.isLoading = false
      }
      if (Number(code) !== 200) {
        return
      }
      try {
        const {results = [], total = 0} = this.decodeResponse(res)
        this.results = results
        this.resultsCount = total
      } catch (e) {
        this.$emit('error', e)
      }
    },
    onExit (e, eventType = false, href = false) {
      this.$emit('exit', this.searchTerm)

      if (eventType) {
        setTimeout(() => {
          if (eventType === 'submit') {
            this.isSubmitting = true
            this.$nextTick(() => {
              this.hijackSubmit(
                this.$refs['form'],
                this.activeSearchUrl
              )
            })
          }
          if (eventType === 'href') {
            window.location.href = href
          }
        }, this.exitDelay)
      }
    },
    onInputFocus (e) {
      this.$emit('focus', e)
      this.inputFocused = true
    },
    onInputBlur (e) {
      this.$emit('blur', e)
      this.inputFocused = false
    },
    onClickOutside (e) {
      if (
        !this.$el.contains(e.target) &&
        this.$el !== e.target
      ) {
        this.$emit('hide', true)
      }
    },
    stopPropagation () {
      return false
    }
  },
  updated () {
    if (this.isActive) {
      this.$nextTick(() => {
        this.$refs.input && this.$refs.input.focus()
      })
    }
  },
  mounted () {
    document.addEventListener('click', this.onClickOutside)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.onClickOutside)
  }
}
</script>

<template>
  <transition name="vue-qs">
    <div
      class="vue-qs"
      v-if="isActive"
      @click.stop="stopPropagation">
      <div class="vue-qs__inner">
        <form
          ref="form"
          class="vue-qs__form"
          :action="formAction"
          @submit.prevent="onExit($event, 'submit')">
          <button
            type="submit"
            class="vue-qs__submit"
            :title="formSubmitTitle"
            :aria-label="formSubmitTitle">
            <slot name="submit-button">
              <i class="vue-qs__submit-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 14.9 14.9"
                  class="vue-qs__svg">
                  <path
                    fill="currentColor"
                    d="M14.9 13.7c0 .3-.1.6-.3.8s-.5.3-.8.3c-.3 0-.6-.1-.8-.3l-3.1-3.1c-1.1.7-2.3 1.1-3.6 1.1-.9 0-1.7-.2-2.4-.5-.8-.3-1.4-.8-2-1.3s-1-1.2-1.3-2C.2 8 0 7.1 0 6.3c0-.9.2-1.7.5-2.4.3-.8.8-1.4 1.3-2S3 .9 3.8.6C4.6.2 5.4 0 6.3 0S8 .2 8.7.5c.8.3 1.4.8 2 1.3s1 1.2 1.3 2c.3.8.5 1.6.5 2.4 0 1.3-.4 2.5-1.1 3.6l3.1 3.1c.2.2.4.5.4.8zM9.1 9.1c.8-.8 1.2-1.7 1.2-2.8 0-1.1-.4-2-1.2-2.8-.8-.8-1.7-1.2-2.8-1.2s-2 .4-2.8 1.2c-.8.7-1.2 1.7-1.2 2.8 0 1.1.4 2 1.2 2.8.8.8 1.7 1.2 2.8 1.2s2-.4 2.8-1.2z" />
                </svg>
              </i>
            </slot>
          </button>
          <slot name="form-inputs"></slot>
          <div
            class="vue-qs__input-wrapper">
            <label
              class="vue-qs__input-label"
              v-if="shouldShowLabel"
              :for="formInputName"
              v-text="formInputLabel" />
            <input
              v-if="!isSubmitting"
              ref="input"
              v-model="searchTerm"
              class="vue-qs__input-el"
              :type="formInputType"
              :name="formInputName"
              @focus="onInputFocus"
              @blur="onInputBlur"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false" />
            <input
              v-if="isSubmitting"
              type="hidden"
              :name="formInputName"
              :value="fullSearchQuery" />
          </div>
        </form>
        <div class="vuwe-is__dropdown" v-if="isActive && !initialState">
          <div
            class="vue-qs__results-wrapper">
            <div class="vue-qs__results-overflow">
              <ul
                class="vue-qs__results">
                <li
                  class="vue-qs__result"
                  v-for="(item, index) in stubbedResults"
                  :key="'vue-qs-'+index"
                  @click.prevent="onExit($event, 'href', item.url)">
                  <slot name="result" :item="item">
                    <a
                      class="vue-qs__result-link"
                      :href="item.url">
                      <div class="vue-qs__result-image">
                        <img
                          :src="item.image"
                          class="vue-qs__result-image-el" />
                      </div>
                      <span
                        class="vue-qs__result-title"
                        v-html="item.title" />
                    </a>
                  </slot>
                </li>
              </ul>
            </div>
            <div
              v-if="filteredResults.length > resultLimit"
              class="vue-qs__results-footer"
              @click.prevent="onExit($event, 'href', activeSearchUrl)">
              <slot
                name="results-footer"
                :activeSearchUrl="activeSearchUrl"
                :resultsCount="resultsCount">
                <a :href="activeSearchUrl">
                  See all results {{resultsCount}}
                </a>
              </slot>
            </div>
          </div>
          <div
            v-if="filteredResults.length == 0 && searchTerm"
            class="vue-qs__sans-results">
            <p
              v-if="!isLoading"
              class="vue-qs__sans-results-empty">
              <slot name="no-results" :searchTerm="searchTerm">
                Your search for <strong>{{ searchTerm }}</strong> did not yield any results.
              </slot>
            </p>
            <p
              v-else
              class="vue-qs__sans-results-loading">
              <slot name="loading">Loading..</slot>
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style src="./styles.css"></style>
