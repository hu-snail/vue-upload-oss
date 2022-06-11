import axios from 'axios'
import { Message } from 'element-ui'

const SUCCESS_CODE = 200

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// request interceptor
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  (response) => {
    const res = response.data
    if (res.status !== SUCCESS_CODE) {
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    Message({
      message: '请求出错了',
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default instance
