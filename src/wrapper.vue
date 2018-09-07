<script>
import vueQuickSearch from './vue-quick-search'

export default {
  name: 'wrapper',
  components: {
    'vue-quick-search': vueQuickSearch
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    getResults (url, callback) {
      callback(200, {
        results: [{
          url: 'http://www.docwinebar.com/',
          title: 'DOC Winebar',
          image: 'https://static1.squarespace.com/static/5388d91ae4b0813d34318751/t/54270232e4b08dba836b4f6e/1411842612762/IMG_4431.jpg'
        },
        {
          url: 'http://www.docwinebar.com/',
          title: 'DOC Restaurant',
          image: 'https://static1.squarespace.com/static/5388d91ae4b0813d34318751/t/54270232e4b08dba836b4f6e/1411842612762/IMG_4431.jpg'
        },
        {
          url: 'http://www.docwinebar.com/',
          title: 'DOC Beer Hall',
          image: 'https://static1.squarespace.com/static/5388d91ae4b0813d34318751/t/54270232e4b08dba836b4f6e/1411842612762/IMG_4431.jpg'
        },
        {
          url: 'http://www.docwinebar.com/',
          title: 'DOC Winebar',
          image: 'https://static1.squarespace.com/static/5388d91ae4b0813d34318751/t/54270232e4b08dba836b4f6e/1411842612762/IMG_4431.jpg'
        },
        {
          url: 'http://www.docwinebar.com/',
          title: 'DOC Winebar',
          image: 'https://static1.squarespace.com/static/5388d91ae4b0813d34318751/t/54270232e4b08dba836b4f6e/1411842612762/IMG_4431.jpg'
        }],
        total: 2
      })
    },
    hijackSubmit(el, url) {
      window.location = url
    }
  }
}
</script>

<template>
  <div>
    <header class="header">
      <button @click.prevent.stop="(isActive = !isActive)" class="btn">
        <span v-if="!isActive">Search</span>
        <span v-else>Close</span>
      </button>
    </header>
    <vue-quick-search
      :is-active="isActive"
      :get-results="getResults"
      :result-limit="0"
      :hijack-submit="hijackSubmit"
      @hide="(isActive = false)">
      <template slot="noResults" slot-scope="props">
        <div>{{props.searchTerm}}</div>
      </template>
      <template slot="submit-button" slot-scope="props">
        <i class="foo">Submit Icon</i>
      </template>

      <template slot="result" slot-scope="props">
        <img :src="props.item.image" :alt="props.item.title" />
        <p class="result-title">{{props.item.title}}</p>
      </template>

      <template slot="no-results" slot-scope="props">
        <div>No results available for {{props.searchTerm}}</div>
      </template>

      <template slot="loading" slot-scope="props">
        <p>Loading Results</p>
      </template>

      <template slot="form-inputs" slot-scope="props">
        <input type="hidden" name="type" value="foo" />
        <input type="hidden" name="filter" value="bar" />
      </template>

      <template slot="results-footer" slot-scope="props">
        <a :href="props.activeSearchUrl">{{props.resultsCount}}</a>
        <span> Results returned</span>
      </template>

    </vue-quick-search>
  </div>
</template>

<style src="./wrapper.css"></style>
