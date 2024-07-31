import request from '@/utils/requ.js'


export default {

    getTest(data) {
        return request({
            url: '/userInfo/str',
            params: data
        })
    }

}