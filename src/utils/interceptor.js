/**
 * [interceptor Http请求拦截，如果无权限的情况，或者登陆失效的情况，跳转登录页。]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
export function interceptor(response) {
	// console.log(response)
    // store.dispatch(setReqState('success'));
    if (response.status === 302) {
        // message.warning("登录过期，请重新登录！");
        // browserHistory.replace(`/login`);
        // console.log(response)
        return Promise.reject(response)
    } else return response;
}