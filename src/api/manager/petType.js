import request from '@/utils/request'

export const addPetTypeApi = (petType) => {
  return request.post('/manager/petType/add', petType)
}

export const removePetTypeApi = (id) => {
  return request.delete(`/manager/petType/remove/${id}`)
}

export const removeBatchPetTypeApi = (ids) => {
  return request.delete('/manager/petType/remove/batch', { data: ids })
}

export const editPetTypeApi = (petType) => {
  return request.put('/manager/petType/edit', petType)
}

export const queryPetTypeApi = (id) => {
  return request.get(`/manager/petType/query/${id}`)
}

export const pagePetTypeApi = (petType, pageNum, pageSize) => {
  return request.get('/manager/petType/page', {
    params: {
      ...petType,
      pageNum,
      pageSize,
    },
  })
}

export const listPetTypeApi = () => {
  return request.get('/manager/petType/list')
}
