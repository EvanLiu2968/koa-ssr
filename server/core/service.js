/*
 * Service base class
 */

module.exports = app => {
  return class Service {
    constructor(){
      this.config = app.config
    }
  }
}