## Vue Quick Search

A Vue component for adding a search overlay with instant search results to your site. ~8.09 kb gzipped.

![Vue Quick Search Example](images/faZQMHBsWT.gif)


#### Install

```bash
npm i vue-quick-search --save
```

#### Usage

``` javascript
import vueQuickSearch from 'vue-quick-search'

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
        results: [Object, Object],
        total: 2
      })
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
      @hide="(isActive = false)">
      <template slot="no-results" slot-scope="props">
        <div>No results available for {{props.searchTerm}}</div>
      </template>
    </vue-quick-search>
  </div>
</template>
```

#### Props

|key|description|default|options|
|:---|---|---|---|
| `isActive`|Is the search overlay active? Use this to toggle active state.|`false`|`Boolean`|
|`url`|The URL to call to fetch instant results. This URL is also sent a POST request on form submission unless the `hijackSubmit` method is used. The `\|val\|` merge tag is replaced with the search term.|`/search/term/\|val\|`|`String`
|`formAction`|The `action=""` attribute value of the search form.|`/search`|`String`|
|`formInputName`|The `name=""` attribute value of the search input.|`q`|`String`|
|`formInputType`|The `type=""` attribute value of the search input.|`Text`| `String` |
|`formInputLabel`|The `<label>` text for the search input.|`Search by keyword, style, etc...`| `String` |
|`formSubmitTitle`| The `title=""` and `aria-label=""` attribute values for the form submit button. |`Fetch search results`| `String` |
|`filterResults`| A method to filter results before rendering them. |`(result) => result`| `Function` |
|`filterAJAXUrl`| A method to mutate the AJAX url before a request is started. |`(endpoint) => endpoint`| `Function` |
|`getResults`| A method to get requests from a data source of choice. This method is called whenever the search term changes. If not supplied, a AJAX call will be requested to `url`. |`(url, callback) => nanoajax.ajax({url}, callback)`| `Function` |
|`resultLimit`| The amount of results to show. |`5`| `Number` |
|`exitDelay`| A time delay before the user navigates away from the page via form submission or a click on a result listing. Helpful if you need to fire tracking events. |`300`| `Number` |
|`hijackSubmit`| A method called when the form gets submitted. Helpful if you need to send the user to a different location. |`form => form.submit()`| `Function` |
|`decodeResults`| A method called when the AJAX request has completed. Use this to decode the AJAX response, returning a `{total: Number, results: Array}` object. |* See below *| `Function` |

##### The default `decodeResults` method:

```javascript
function decodeResults (response) {
  if (typeof response === 'string') {
    response = JSON.parse(response)
  }
  return {
    results: response.results || [],
      total: response['total'] || 0
  }
}
```


#### Events

|event|description|output
|:---|---|---|
| `exit`|The user is about to leave the page (called immediately, irrespective of `exitDelay`).|The current search term|
| `focus`|A focus event was fired on the form input.|Event|
| `blur`|A blur event was fired on the form input.|Event|
| `hide`|The overlay should be hidden by changing the `isActive` prop on the parent component.|Event|

#### Slots

```
<vue-quick-search>
  
  <!-- Props: None -->
  <template slot="submit-button" slot-scope="props">
    <i class="foo">Submit Icon</i>
  </template>
  
  <!-- Props: {item} -->
  <template slot="result" slot-scope="props">
  	<img :src="props.item.image" :alt="props.item.title" />
    <p class="result-title">{{props.item.title}}</p>
  </template>
  
  <!-- Props: {searchTerm} -->
  <template slot="no-results" slot-scope="props">
    <div>No results available for {{props.searchTerm}}</div>
  </template>
  
  <!-- Props: None -->
  <template slot="loading" slot-scope="props">
    <p>Loading Results</p>
  </template>
  
  <!-- Props: None -->
  <template slot="form-inputs" slot-scope="props">
    <input type="hidden" name="type" value="foo" />
    <input type="hidden" name="filter" value="bar" />
  </template>
  
  <!-- Props: {activeSearchUrl, resultsCount} -->
  <template slot="results-footer" slot-scope="props">
    <a :href="props.activeSearchUrl">{{props.resultsCount}}</a>
    <span> results returned</span>
  </template>

</vue-quick-search>
```

### CSS

Add the following to your stylesheet for basic styles
> Styles are minimal so that they don't interfere with your project-specific system
```
@import "vue-quick-search/dist/vueQuickSearch.css";
```
