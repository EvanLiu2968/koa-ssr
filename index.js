/*
 * starter
 */

if(process.env.APP_ENV == 'dev') require('./build');

require('./server/core/init')