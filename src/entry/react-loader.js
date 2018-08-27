/*
 * webpack react middleware loader
 */
module.exports = function() {
  this.cacheable && this.cacheable();
  return `
    import React, { Component } from 'react';
    import Layout from 'entry/layout.js';
    import App from '${this.resourcePath.replace(/\\/g, '\\\\')}';
    export default class Page extends Component {
      render() {
        return <Layout {...this.props}><App {...this.props} /></Layout>;
      }
    }
  `;
};