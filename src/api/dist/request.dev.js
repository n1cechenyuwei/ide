"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.post = exports.get = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _elementUi = require("element-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//跳转到登录的方法
// const goLogin = ()=>{
//   router.replace({
//     path:'/login',
//     query:{
//       redirect:router.currentRoute.fullPath
//     }
//   })
// }
// //定义请求失败统一处理
// const errorHandle = (status,other)=>{
//   switch(status){
//     //未登录，跳转登录页
//     case 401:
//       goLogin()
//       break;
//       //token过期,请出token并跳转到登录页
//       case 403:
//         tip('登录过期请重新登录')
//         localStorage.removeItem('token')
//         setTimeout(() => {
//           goLogin()
//         }, 1000);
//         break;
//         //404请求不存在
//         case 404:
//         tip('请求资源不存')
//         break;
//         default:
//           console.log(other)
//   }
// }
//创建axios实例
// console.log(process.env)
var instance = _axios["default"].create({
  baseURL: process.env.VUE_APP_BASEURL // timeout: 1000*10

}); //设置post请求头


instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; //请求拦截器，每次请求如果token存在则在请求头中携带token

instance.interceptors.request.use(function (config) {
  // console.log(config.params)
  // if (config.method == 'post') {
  //   config.data = QS.stringify(config.data)
  // }
  // console.log(config.data)
  // const token = localStorage.getItem('token')
  // if(token && (config.headers.Authorization = token)){
  //   return config
  // }
  return config;
}, function (error) {
  return Promise.error(error);
}); //响应拦截器

instance.interceptors.response.use(function (res) {
  if (res.data.code && res.data.code != 200) {
    _elementUi.Message.error(res.data.message);
  }

  return Promise.resolve(res.data);
}, function (error) {
  return Promise.reject(error);
});
/* 统一封装get请求 */

var get = function get(url, params) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    instance(_objectSpread({
      method: 'get',
      url: url,
      params: params
    }, config)).then(function (response) {
      resolve(response);
    })["catch"](function (error) {
      reject(error);
    });
  });
};
/* 统一封装post请求  */


exports.get = get;

var post = function post(url, data) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    instance(_objectSpread({
      method: 'post',
      url: url,
      data: data
    }, config)).then(function (response) {
      resolve(response);
    })["catch"](function (error) {
      reject(error);
    });
  });
}; // export default instance


exports.post = post;