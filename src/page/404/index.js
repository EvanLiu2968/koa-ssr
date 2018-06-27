/*
 * there are some eggs for users with all pages
 */
import Vue from 'vue';
import ssrLoader from 'entry/vue-ssr-loader'

const vm = new Vue({
  render: function (createElement) { 
    return createElement('h1', {
      // attrs: { id: 'egg' },
      // 'class': { egg: true },
      // style: { display: 'none' },
      domProps: { innerHTML: '要docker不要bug' }
    })
  }
})

ssrLoader(vm)