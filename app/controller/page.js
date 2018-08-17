'use strict';
const fs = require('fs');
const path = require('path');

module.exports = app => {
  const { config } = app;
  return class PageController extends app.Controller {
    async index(ctx) {
      
      await ctx.render('index', {
        title: `首页 - ${config.siteName}`,
        keywords: `首页`,
        description: `首页`,
      })
    }
    async photo(ctx) {
      await ctx.render('photo', {
        title: `照片 - ${config.siteName}`,
        keywords: `照片`,
        description: `照片`,
        isMobile: ctx.validate.isMobile.call(ctx)
      })
    }
    async article(ctx) {
      await ctx.render('article', {
        title: `文章 - ${config.siteName}`,
        keywords: `文章`,
        description: `文章`,
      })
    }
    async error(ctx) {
      await ctx.render('404', {
        title: `404 - ${config.siteName}`,
        keywords: `404`,
        description: `404`,
      })
    }
    async test(ctx) {
      await ctx.render('test', {
        title: `test - ${config.siteName}`,
        keywords: `test`,
        description: `test`,
        isMobile: ctx.validate.isMobile.call(ctx)
      })
    }
  };
};