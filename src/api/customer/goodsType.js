import request from '@/utils/request'

export const allGoodsTypeApi = () => {
  return request.get('/customer/goodsType/visitor/all')
}

export const hotGoodsTypeApi = () => {
  return request.get('/customer/goodsType/visitor/hot')
}
