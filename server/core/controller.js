/*
 * Controller base class
 */

module.exports = app => {
  return class Controller {
    constructor(){
      this.config = app.config
    }
  }
}