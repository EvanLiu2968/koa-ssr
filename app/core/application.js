/*
 * 扩展koa原型
 */
const Koa = require('koa');
const { matchFile } = require('./tool');

module.exports = class Core extends Koa {
  constructor() {
    super()
    
    /**
     * extend context
     */
    const ctx = this.context
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
    const baseController = require('./base_controller');
    return baseController
  }
  
  /**
   * Service
   */
  get Service() {
    const baseService = require('./base_service');
    return baseService
  }
}