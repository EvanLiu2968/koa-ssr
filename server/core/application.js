/*
 * 扩展koa原型
 */
const Koa = require('koa');

module.exports = class Core extends Koa {
  constructor() {
    super()
    this.context = require('./context')(this.context)
    // this.Controller = require('./controller')(this)
    // this.Service = require('./service')(this)
  }
}