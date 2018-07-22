/* 
 * local dev enviroment config
 */
module.exports = {
  webpackPort: 8000,
  browserSync: {
    reloadDelay: 1000,
    port: 3000,
  },
  redis: {
    url: '//127.0.0.1:16379'
  },
  mongoose: {
    url: '//127.0.0.1:27017'
  },
  api: "http://api.test.evanliu2968.com.cn",
  domain: 'localhost',
  siteList: {
    cdn: 'http://127.0.0.1:8080/',
    www: 'http://www.test.evanliu2968.com.cn/',
  }
}