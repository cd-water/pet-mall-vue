import request from '@/utils/request'

export const addGoodsApi = (goods) => {
  return request.post('/manager/goods/add', goods)
}

export const removeGoodsApi = (id) => {
  return request.delete(`/manager/goods/remove/${id}`)
}

export const removeBatchGoodsApi = (ids) => {
  return request.delete('/manager/goods/remove/batch', { data: ids })
}

export const editGoodsApi = (goods) => {
  return request.put('/manager/goods/edit', goods)
}

export const queryGoodsApi = (id) => {
  return request.get(`/manager/goods/query/${id}`)
}

export const pageGoodsApi = (pageParam, pageNum, pageSize) => {
  return request.get('/manager/goods/page', {
    params: {
      ...pageParam,
      pageNum,
      pageSize,
    },
  })
}
