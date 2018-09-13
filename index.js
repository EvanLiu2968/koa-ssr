/*
 * starter
 */

if(process.env.APP_ENV == 'dev'){
  require('./build')
}else{
  require('./app/core')
}