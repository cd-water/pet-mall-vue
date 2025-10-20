import request from '@/utils/request'

export const recommendPetApi = () => {
  return request.get('/customer/pet/visitor/recommend')
}

export const pagePetApi = (searchForm, pageNum, pageSize) => {
  return request.get('/customer/pet/visitor/page', {
    params: {
      ...searchForm,
      pageNum,
      pageSize,
    },
  })
}

export const detailPetApi = (id, userId, role) => {
  return request.get(`/customer/pet/visitor/detail/${id}`, {
    params: { userId, role },
  })
}
