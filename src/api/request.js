import axios from 'axios'
// import router from '../router'
// import QS from 'qs'
// import { Message} from 'element-ui';

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
console.log(process.env)
var instace = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  timeout: 1000*10
})

//设置post请求头
instace.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

//请求拦截器，每次请求如果token存在则在请求头中携带token
instace.interceptors.request.use(
  
  config=>{
    // console.log(config.data)
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

instace.interceptors.response.use(
  res=>{
    res.status === 200 ? Promise.resolve(res) :Promise.reject(res)
  },
  error => {
    console.log(error, 22)
    // const {response} = error
    // if(response){
    // //请求发出，但是不是2x
    // errorHandle(response.status,response.data.message)
    // return Promise.reject(response)
    // }else{
    //    // 处理断网的情况
    //   // eg:请求超时或断网时，更新state的network状态
    //  // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
    //  // 关于断网组件中的刷新重新获取数据，会在断网组件中说
    //  if(!window.navigator.onLine){
    //      //处理断网的操作
    //  }else{
    //     return Promise.reject(error)
    //  }
    // }
    return Promise.reject(error);
   
  })

  export default instace