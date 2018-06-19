/* 
 * prod enviroment config
 */
module.exports = {
  redis: {
    url: '//127.0.0.1:16379'
  },
  mongoose: {
    url: '//127.0.0.1:27017'
  },
  api: "https://api.test.evanliu2968.com.cn",
  domain: 'evanliu2968.com.cn',
  siteList: {
    cdn: 'https://cdn.test.evanliu2968.com.cn/',
    www: 'https://www.test.evanliu2968.com.cn/',
  }
}