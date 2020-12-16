import axios from 'axios'
// import router from '../router'
// import QS from 'qs'
import { Message} from 'element-ui';

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
var instance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  // timeout: 1000*10
})

//设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

//请求拦截器，每次请求如果token存在则在请求头中携带token
instance.interceptors.request.use(
  config=>{
    // console.log(config.params)
    // if (config.method == 'post') {
    //   config.data = QS.stringify(config.data)
    // }
    // console.log(config.data)
    // const token = localStorage.getItem('token')
    // if(token && (config.headers.Authorization = token)){
    //   return config
    // }
    return config
  },error =>Promise.error(error)
)

//响应拦截器

instance.interceptors.response.use(
  res=>{
    if (res.data.code && res.data.code != 200) {
      Message.error(res.data.message)
    }
    return Promise.resolve(res.data)
  },
  error => {
    return Promise.reject(error);
   
  })

  /* 统一封装get请求 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url,
      params,
      ...config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

  // export default instance