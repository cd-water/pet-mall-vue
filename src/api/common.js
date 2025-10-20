import request from '@/utils/request'

//文件上传接口
export const uploadApi = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload', formData)
}

//管理员前台数据相关接口
export const adminCountApi = () => {
  return request.get('/admin/count')
}
export const petPieApi = () => {
  return request.get('/admin/petPie')
}
export const petOrdersBarApi = () => {
  return request.get('/admin/petOrdersBar')
}
export const goodsPieApi = () => {
  return request.get('/admin/goodsPie')
}
export const goodsOrdersBarApi = () => {
  return request.get('/admin/goodsOrdersBar')
}

//宠物店前台数据相关接口
export const shopTodayApi = (id) => {
  return request.get(`/shop/today/${id}`)
}
export const amountLineApi = (id, begin, end) => {
  return request.get(`/shop/amountLine/${id}`, {
    params: { begin, end },
  })
}
export const numberLineApi = (id, begin, end) => {
  return request.get(`/shop/numberLine/${id}`, {
    params: { begin, end },
  })
}
