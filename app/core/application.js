/*
 * 扩展koa原型
 */
const Koa = require('koa');

module.exports = class Core extends Koa {
  constructor() {
    super()
    
    /**
     * extend context
     */
    const ctx = this.context
    const matchFile = require('./matchFile')
    let extend = matchFile('extend')
    Object.keys(extend).forEach((item)=>{
      ctx[item] = extend[item]
    })
    this.context = Object.create(ctx)

    /**
     * 将app挂载到context
     */
    
    this.context.app = this;

  }

  /**
   * Controller
   */
  get Controller() {
    const baseController = require('./controller');
    return baseController
  }
  
  /**
   * Service
   */
  get Service() {
    const baseService = require('./service');
    return baseService
  }
}