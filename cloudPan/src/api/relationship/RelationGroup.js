import request from '@/utils/Request.js'

const api = {
    getAllGroups: "/groups/getAllGroups",
};

export default {

    getTableData(data, show) {
        return request({
            url: api.getAllGroups,
            showLoading: show,
            params: data
        })
    }
}