import request from '@/utils/request'

export const pagePetOrdersApi = (pageParam, pageNum, pageSize) => {
  return request.get('/manager/petOrders/page', {
    params: {
      ...pageParam,
      pageNum,
      pageSize,
    },
  })
}

export const acceptPetOrdersApi = (orderNo) => {
  return request.post(`/manager/petOrders/accept/${orderNo}`)
}

export const deliveryPetOrdersApi = (orderNo) => {
  return request.post(`/manager/petOrders/delivery/${orderNo}`)
}

export const cancelPetOrdersApi = (orderNo) => {
  return request.post(`/manager/petOrders/cancel/${orderNo}`)
}

export const refundPetOrdersApi = (orderNo) => {
  return request.post(`/manager/petOrders/refund/${orderNo}`)
}

export const getPetOrderNumApi = (shopId) => {
  return request.get(`/manager/petOrders/count/${shopId}`)
}
