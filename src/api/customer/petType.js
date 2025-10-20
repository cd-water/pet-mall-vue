import request from '@/utils/request'

export const allPetTypeApi = () => {
  return request.get('/customer/petType/visitor/all')
}

export const hotPetTypeApi = () => {
  return request.get('/customer/petType/visitor/hot')
}
