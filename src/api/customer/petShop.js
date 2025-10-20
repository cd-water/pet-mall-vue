import request from '@/utils/request'

export const hotPetShopApi = () => {
  return request.get('/customer/petShop/visitor/hot')
}

export const pagePetShopApi = (searchForm, pageNum, pageSize) => {
  return request.get('/customer/petShop/visitor/page', {
    params: {
      ...searchForm,
      pageNum,
      pageSize,
    },
  })
}

export const detailPetShopApi = (id) => {
  return request.get(`/customer/petShop/visitor/detail/${id}`)
}
