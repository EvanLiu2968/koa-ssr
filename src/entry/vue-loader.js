/*
 * webpack vue middleware loader
 */
module.exports = function() {
  this.cacheable && this.cacheable();
  return `
    import Vue from 'vue';
    import App from '${this.resourcePath.replace(/\\/g, '\\\\')}';
    export default new Vue({
      render: h => h(App)
    })
  `;
};