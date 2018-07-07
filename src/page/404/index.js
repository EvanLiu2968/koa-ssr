/*
 * there are some eggs for users with all pages
 */
import Vue from 'vue';
import App from './app';
import axios from 'libs/axios';
import ssrLoader from 'entry/vue-ssr-loader'

// Vue.use(ElementUI,{size:'small'});

const vm = new Vue({
  // router,
  // store,
  render: h => h(App)
})

ssrLoader(vm)