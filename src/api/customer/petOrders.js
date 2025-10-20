import request from '@/utils/request'

export const placePetOrdersApi = (orderMsg) => {
  return request.post('/customer/petOrders/place', orderMsg)
}

export const cancelPetOrdersApi = (orderNo) => {
  return request.post(`/customer/petOrders/cancel/${orderNo}`)
}

export const completedPetOrdersApi = (orderNo) => {
  return request.post(`/customer/petOrders/completed/${orderNo}`)
}

export const paymentPetOrdersApi = (orderNo) => {
  return request.post(`/customer/petOrders/payment/${orderNo}`)
}

export const listPetOrdersApi = () => {
  return request.get('/customer/petOrders/list')
}
