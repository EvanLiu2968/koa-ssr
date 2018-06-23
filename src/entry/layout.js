import React, { Component } from 'react';

export default class Layout extends Component {
  render() {
    return (
      <html lang="zh-cn">
        <head>
          <title>{this.props.title}</title>
          <meta charSet="utf-8"></meta>
          <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"></meta>
          <meta http-equiv="X-UA-Compatible" content="ie=edge"></meta>
          <meta name="keywords" content={this.props.keywords}></meta>
          <meta name="description" content={this.props.description}></meta>
          <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon"></link>
        </head>
        <body>
          <div id="app">{this.props.children}</div>
        </body>
      </html>
    )
  }
}