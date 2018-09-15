/*
 * router
 */

module.exports = app => {
  const { router, controller, config } = app;

  // page route
  router.get('/', controller.page.index);
  router.get('/404', controller.page.error);
  router.get('/article', controller.page.article);
  router.get('/photo', controller.page.photo);
  router.get('/test', controller.page.test);
  
  // api control
  router.get('/api/articles/README', controller.api.getREADME);

  router.post('/api/cloverHook', controller.api.cloverHook);
  router.post('/api/saveBase64', controller.api.saveBase64);
  router.post('/api/saveFormData', controller.api.saveFormData);
}