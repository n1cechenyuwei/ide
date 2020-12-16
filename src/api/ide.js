import {get, post} from './request'
const ide = {
  getsdk(data){
    return get(`getsdk`, data)
  },
  run(data) {
    return post(`run`, data)
  }
}
export default ide;