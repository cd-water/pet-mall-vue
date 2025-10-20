import request from '@/utils/request'

export const addGoodsTypeApi = (goodsType) => {
  return request.post('/manager/goodsType/add', goodsType)
}

export const removeGoodsTypeApi = (id) => {
  return request.delete(`/manager/goodsType/remove/${id}`)
}

export const removeBatchGoodsTypeApi = (ids) => {
  return request.delete('/manager/goodsType/remove/batch', { data: ids })
}

export const editGoodsTypeApi = (goodsType) => {
  return request.put('/manager/goodsType/edit', goodsType)
}

export const queryGoodsTypeApi = (id) => {
  return request.get(`/manager/goodsType/query/${id}`)
}

export const pageGoodsTypeApi = (goodsType, pageNum, pageSize) => {
  return request.get('/manager/goodsType/page', {
    params: {
      ...goodsType,
      pageNum,
      pageSize,
    },
  })
}

export const listGoodsTypeApi = () => {
  return request.get('/manager/goodsType/list')
}
