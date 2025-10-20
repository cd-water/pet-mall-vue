import request from '@/utils/request'

export const addPetApi = (pet) => {
  return request.post('/manager/pet/add', pet)
}

export const removePetApi = (id) => {
  return request.delete(`/manager/pet/remove/${id}`)
}

export const removeBatchPetApi = (ids) => {
  return request.delete('/manager/pet/remove/batch', { data: ids })
}

export const editPetApi = (pet) => {
  return request.put('/manager/pet/edit', pet)
}

export const queryPetApi = (id) => {
  return request.get(`/manager/pet/query/${id}`)
}

export const pagePetApi = (pageParam, pageNum, pageSize) => {
  return request.get('/manager/pet/page', {
    params: {
      ...pageParam,
      pageNum,
      pageSize,
    },
  })
}

export const groupPetApi = () => {
  return request.get('/manager/pet/group')
}
