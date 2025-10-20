import request from '@/utils/request'

export const hotGoodsApi = () => {
  return request.get('/customer/goods/visitor/hot')
}

export const pageGoodsApi = (searchForm, pageNum, pageSize) => {
  return request.get('/customer/goods/visitor/page', {
    params: {
      ...searchForm,
      pageNum,
      pageSize,
    },
  })
}
