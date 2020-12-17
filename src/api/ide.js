import {get, post} from './request'
const ide = {
  getsdk(data){
    return get(`getsdk`, data)
  },
  run(data) {
    return post(`run`, data)
  },
  build(data) {
    return post(`towasm`, data)
  },
  projectList() {
    return get(`getlanguage`)
  }
}
export default ide;