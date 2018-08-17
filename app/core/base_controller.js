/*
 * Controller base class
 */
const BaseContext = require('./base_context');
// 参考dubbo接口返回类型的设计
const codeMsg = {
  '00': '请求成功',
  // 系统异常错误 01-10
  '01': '服务异常',
  // 请求参数错误 11-20
  '11': '请求参数为空',
  '12': '请求参数错误',
  // 权限错误 21-30
  '21': '您尚未登录，请登录后继续操作',
  '22': '您没有权限访问',
  '23': '签名验证错误',
  '24': 'Token已失效',
  '25': 'Session已失效',
  '26': '您的账号在其它地方登录，请重新登录或者修改密码',
  // 预留错误类型 31-50
  '31': '未知错误',
  // 表单/参数校验错误 51+
  '51': '用户信息不存在',
  '52': '用户名已存在',
  '53': '手机号已存在',
  '54': '邮箱已存在',
  '55': '用户未激活',
  '56': '用户未激活',
  '57': '用户已禁用',
  '58': '用户已冻结',
  '59': '用户已注销',
  '61': '用户名或密码错误',
  '62': '验证码错误',
  '63': '两次输入密码不一致',
  '64': '姓名与身份证号码不匹配',
}

module.exports = class Controller extends BaseContext {
  constructor(){
    super()
  }
  response(code, body, message) {
    code = code || "01";
    message = message || codeMsg[code];
    body = body || null;
    this.ctx.status = 200;
    this.ctx.body = {
      code: code,
      message: message,
      data: body
    };
  }
  success(body) {
    this.response("00", body);
  }
  error(e) {
    this.response("01");
    if(e){
      console.log(e.stack)
      this.logger.error(e.stack);
    }
  }
  deny() {
    this.response("22");
  }
}