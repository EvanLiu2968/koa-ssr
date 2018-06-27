/*
 * BaseContextClass
 */

'use strict';

module.exports = class BaseContext {

  constructor(ctx) {

    this.ctx = ctx;

    this.app = ctx.app;

    this.config = ctx.app.config;

    this.service = ctx.service;
  }
}
