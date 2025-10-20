import request from '@/utils/request'

export const pageGoodsOrdersApi = (pageParam, pageNum, pageSize) => {
  return request.get('/manager/goodsOrders/page', {
    params: {
      ...pageParam,
      pageNum,
      pageSize,
    },
  })
}

export const acceptGoodsOrdersApi = (orderNo) => {
  return request.post(`/manager/goodsOrders/accept/${orderNo}`)
}

export const deliveryGoodsOrdersApi = (orderNo) => {
  return request.post(`/manager/goodsOrders/delivery/${orderNo}`)
}

export const cancelGoodsOrdersApi = (orderNo) => {
  return request.post(`/manager/goodsOrders/cancel/${orderNo}`)
}

export const refundGoodsOrdersApi = (orderNo) => {
  return request.post(`/manager/goodsOrders/refund/${orderNo}`)
}

export const getGoodsOrderNumApi = (shopId) => {
  return request.get(`/manager/goodsOrders/count/${shopId}`)
}
