import request from '@/utils/request'

export const addPetShopApi = (petShop) => {
  return request.post('/manager/petShop/add', petShop)
}

export const removePetShopApi = (id) => {
  return request.delete(`/manager/petShop/remove/${id}`)
}

export const removeBatchPetShopApi = (ids) => {
  return request.delete('/manager/petShop/remove/batch', { data: ids })
}

export const editPetShopApi = (petShop) => {
  return request.put('/manager/petShop/edit', petShop)
}

export const queryPetShopApi = (id) => {
  return request.get(`/manager/petShop/query/${id}`)
}

export const pagePetShopApi = (petShop, pageNum, pageSize) => {
  return request.get('/manager/petShop/page', {
    params: {
      ...petShop,
      pageNum,
      pageSize,
    },
  })
}
