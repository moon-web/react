/**
 * fetch data
 * 可用 axios 代替
 */

import 'whatwg-fetch'

class Http {
    get(url, params) { // GET请求
        url = params ? this.build(url, params) : url;
        return this.request(url, {
            method: 'GET'
        })
    }

    post(url, body) { // POST请求
        let options = {
            method: 'POST',
        };
        if (body) options.body = this.build2(body)
        return this.request(url, options)
    }

    request(url, options) { // 根请求
        options.headers = this.defaultHeader()
        options.credentials = 'include'
        return fetch(url, options)
            .then(this.checkStatus)
            .then(response => response.json())
        //.catch(err => browserHistory.replace(`/login`))
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            console.error(response)
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }


    defaultHeader() { // 默认头
        let header = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            //'Accept': 'application/json',
            //'Content-Type': 'application/json'
        };
        return header
    }

    build(url, params) { // URL构建方法
        var ps = []
        if (params) {
            for (var p in params) {
                if (p) {
                    ps.push(p + '=' + encodeURIComponent(params[p]));
                }
            }
        }
        return url + (url.indexOf("?")===-1 ? "?":"&") + ps.join('&')
    }

    build2(body){
        var ps = []
        if (body) {
            for (var p in body) {
                if (p) {
                    ps.push(p + '=' + encodeURIComponent(body[p]));
                }
            }
        }
        return ps.join('&')
    }
}

export default new Http()