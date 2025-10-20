import request from '@/utils/request'

export const joinCollectApi = (collect) => {
  return request.post('/customer/collect/join', collect)
}

export const outCollectApi = (userId, petId) => {
  return request.delete('/customer/collect/out', {
    params: { userId, petId },
  })
}

export const listCollectApi = () => {
  return request.get('/customer/collect/list')
}
