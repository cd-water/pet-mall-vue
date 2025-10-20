import request from '@/utils/request'

export const placeGoodsOrdersApi = (orderMsg) => {
  return request.post('/customer/goodsOrders/place', orderMsg)
}

export const cancelGoodsOrdersApi = (orderNo) => {
  return request.post(`/customer/goodsOrders/cancel/${orderNo}`)
}

export const completedGoodsOrdersApi = (orderNo) => {
  return request.post(`/customer/goodsOrders/completed/${orderNo}`)
}

export const paymentGoodsOrdersApi = (orderNoArray) => {
  return request.post('/customer/goodsOrders/payment', orderNoArray)
}

export const listGoodsOrdersApi = () => {
  return request.get('/customer/goodsOrders/list')
}
