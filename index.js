/*
 * starter
 */

if(process.env.APP_ENV == 'dev') require('./build');

require('./app/core/init')