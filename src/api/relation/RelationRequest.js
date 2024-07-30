import request from '@/utils/requ.js'

export default {

    getTest() {
        return request({
            url: '/userInfo/str',
            method: 'get',
        })
    }

}