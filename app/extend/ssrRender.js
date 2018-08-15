const path = require('path');
const React = require('react')
const ReactDOM = require('react-dom/server')

module.exports = async function(file, props){
  const ctx = this;
  const { config } = ctx;
  const App = require(path.join(config.views.dir, file));
  const root = ReactDOM.renderToString(React.createElement(App, props))
  await ctx.render(file, Object.assign({}, props, {
    root: root,
    rootProps: `<script id="rootProps"> window.__ROOT_PROPS__= ${JSON.stringify(props)}</script>`
  }))
}