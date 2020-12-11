import request from './request'
const ide = {
  ideList(data){
    return request.post(`asddd/getOrderList`, data)
  }
}
export default ide;