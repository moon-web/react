/**
 * fetch data
 * 可用 axios 代替
 */

import 'whatwg-fetch'

class Http {
    // get方法
    get(url, params) {
        params = this.obj2Params(params);
        let options = {
            method: 'GET'
        }
        const header = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        options.headers = new Headers(header);
        url = url.indexOf('?') === -1 ? url + '?' : url + '&';
        return this.request(`${url}${params}`, options, 'json')
    }

    // post方法 - json形式
    post(url, body) { // POST请求
        let options = {
            method: 'POST'
        };
        const header = {
            'Content-Type': 'application/json;charset=UTF-8'
        }
        options.headers = new Headers(header);
        if (body) options.body = this.obj2String(body)
        return this.request(url, options, 'json')
    }

    // post方法 - 表单形式
    postFormData(url, body) {
        let options = {
            method: 'POST'
        };
        const header = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        options.headers = new Headers(header);
        if (body) options.body = this.obj2Params(body)
        return this.request(url, options, 'json')
    }

    // 上传方法
    upload(url, body) {
        let options = {
            method: 'POST'
        };
        const header = {
            'Content-Type': 'multipart/form-data;'
        }
        options.headers = new Headers(header);
        if (body) options.body = this.obj2String(body)
        return this.request(url, options, 'json')
    }

    // 下载方法
    downloadExcel(url, params) { // 下载
        params = this.obj2Params(params);
        let options = {
            method: 'GET'
        };
        const header = {
            'Content-Type': 'application/json;charset=UTF-8'
        }
        options.headers = new Headers(header);
        return this.request(`${url}?${params}`, options, 'blob')
    }

    // 封装请求
    request(url, options, returnType) { // 根请求
        options.credentials = 'include';
        return new Promise((resolve, reject) => {
            fetch(url, options)
                .then(res => this.checkStatus(res))
                .then(res => {
                    if (returnType === 'json') {
                        return res.json()
                    } else if (returnType === 'blob') {
                        return res.blob()
                    }
                })
                .then(json => {
                    if (!json.success && json.msgCode === 'token_001') {
                        localStorage.removeItem('userId')
                        localStorage.removeItem('userAccount')
                        localStorage.removeItem('type')
                        localStorage.removeItem('Login')
                        window.location.href = '/login'
                    } else {
                        resolve(json)
                    }
                })
        })
    }

    // 校验请求状态
    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

    // 对象转params ?aaa=1&bbb=2
    obj2Params(params) { // URL构建方法
        var ps = []
        if (params) {
            for (var p in params) {
                if (p) {
                    ps.push(p + '=' + encodeURIComponent(params[p]));
                }
            }
        }
        ps.push(`time=${Date.now()}`)
        return ps.join('&')
    }

    // 对象转字符串 '{a:1,b:2}'
    obj2String(body) {
        return JSON.stringify(body)
    }
    /**
     * 下载文件 - 带进度监控
     * @param url: 文件请求路径
     * @param params: 请求参数
     * @param name: 保存的文件名
     * @param progress: 进度处理回调函数
     * @param success: 下载完成回调函数
     * eg: progressDownLoad({url:'http://loacalhost:8080/downLoad.action',name:'file.rar',progress:function(evt){
     *        console.log(evt);
     *     }});
    **/
    progressDownLoad({ url, filename, params, progress, success }) {
        var xhr = new XMLHttpRequest();
        //监听进度事件
        xhr.addEventListener("progress", function (evt) {
            if (progress) try { progress(evt); } catch (e) { console.log(e) }
        }, false);

        var paramsStr = '';
        if (params) for (var key in params) paramsStr += '&' + key + '=' + params[key];
        if (paramsStr) paramsStr = paramsStr.substring(1);
        paramsStr = '?' + paramsStr;
        xhr.open("GET", url + paramsStr, true);

        xhr.responseType = "blob";
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (typeof window.chrome !== 'undefined') {
                    // Chrome version
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(xhr.response);
                    link.download = filename;
                    link.click();
                } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE version
                    var blob = new Blob([xhr.response], { type: 'application/force-download' });
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    // Firefox version
                    var file = new File([xhr.response], filename, { type: 'application/force-download' });
                    window.open(URL.createObjectURL(file));
                }
                if (success) try { success(xhr); } catch (e) { }
            }
        };

        xhr.send();
    }
}

export default new Http()