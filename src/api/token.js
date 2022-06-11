import request from '@/utils/request'

export function getToken(params) {
    return request({
      url: '/getToken/',
      method: 'get',
      params,
    })
}
