import axios from 'axios';
import { ElLoading } from 'element-plus';
import router from '@/router';
import Message from '../utils/Message';

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8';
const contentTypeJson = 'application/json';
const responseTypeJson = "json";

let loading = null;
const instance = axios.create({
    baseURL: '/api',
    timeout: 10 * 1000,
});

// 请求前拦截器
instance.interceptors.request.use(
    (config) => {
        if (config.showLoading) {
            loading = ElLoading.service({
                lock: true,
                text: '加载中......',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        }
        return config;
    },
    (error) => {
        if (error.config?.showLoading && loading) {
            loading.close();
        }
        Message.error("请求发送失败");
        return Promise.reject({ showError: true, msg: "请求发送失败" });
    }
);

// 请求后拦截器
instance.interceptors.response.use(
    (response) => {
        const { showLoading, errorCallback, showError = true, responseType } = response.config;
        if (showLoading && loading) {
            loading.close();
        }
        const responseData = response.data;
        if (responseType === "arraybuffer" || responseType === "blob") {
            return responseData;
        }
        // 正常请求
        if (responseData.code === 200) {
            return responseData;
        } else if (responseData.code === 901) {
            // 登录超时
            router.push("/login?redirectUrl=" + encodeURI(router.currentRoute.value.path));
            return Promise.reject({ showError: false, msg: "登录超时" });
        } else {
            // 其他错误
            if (errorCallback) {
                errorCallback(responseData.message);
            }
            return Promise.reject({ showError: showError, msg: responseData.message });
        }
    },
    (error) => {
        if (error.config?.showLoading && loading) {
            loading.close();
        }
        return Promise.reject({ showError: true, msg: "网络异常" });
    }
);

const handleRequestError = (error) => {
    console.log(error);
    if (error.showError) {
        Message.error(error.msg);
    }
    return null;
};

const request = (config) => {
    const { method = 'post', url, params, dataType, showLoading = true, responseType = responseTypeJson } = config;
    let contentType = contentTypeForm;
    let data = params;

    if (dataType === 'json') {
        contentType = contentTypeJson;
        data = JSON.stringify(params);
    } else {
        let formData = new FormData();
        for (let key in params) {
            formData.append(key, params[key] == undefined ? "" : params[key]);
        }
        data = formData;
    }

    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    };

    const requestConfig = {
        url,
        method,
        data,
        headers,
        responseType,
        showLoading,
        errorCallback: config.errorCallback,
        showError: config.showError,
    };

    if (method.toLowerCase() === 'get') {
        requestConfig.params = params;
        delete requestConfig.data;
    }

    return instance(requestConfig).catch(handleRequestError);
};

export default request;
