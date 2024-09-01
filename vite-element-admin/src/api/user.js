// import http from '@/utils/request'
import request from '@/utils/request'

// 用户列表
export function UserList(data) {
  return request({
    url: '/v1/user/list',
    data
  })
}

export function login(data) {
  console.log('data ------> ', data);

  return request({
    url: '/userInfo/login',
    params: data
  })
}

export function getInfo(data) {
  return request({
    url: '/getUserInfo',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
  })
}

export function loginHistory() {
  return request({
    url: '/login/history',
  })
}

export function testRequest() {
  return request({
    url: '/test',
  })
}
