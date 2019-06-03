import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Login from './index'
import Api from '../../../api/index'
import { message } from 'antd'
function mapStateToProps(state, props) {
    return {
    
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
		login: (data) => {
			Api.login(data).then(res => {
				if(res.success===true){
					const info = {
                        id: res.dataObject.userId,
                        pass: res.dataObject.userPassword
                    }
					localStorage.setItem("userId", res.dataObject.userId);
                    localStorage.setItem('Login', JSON.stringify(info));
                    localStorage.setItem('type', res.dataObject.userType);
                    localStorage.setItem('userAccount', res.dataObject.userAccount);
                    //获取版本号判断是否一致
                    Api.judgingVersion({type:1}).then((res)=>{
                        if(res.success){
                            var scriptWrapper = document.getElementsByTagName('script');
                            if(res.dataObject && res.dataObject.length){
                                for(let i=0;i<res.dataObject.length;i++){
                                    if(scriptWrapper && scriptWrapper.length){
                                        for(let j=0; j<scriptWrapper.length; j++){
                                            if(scriptWrapper[j].src.indexOf('app')>0){
                                                let src = scriptWrapper[j].src.slice(window.location.origin.length,scriptWrapper[j].src.length)
                                                if(src !== res.dataObject[i].versionStr){
                                                    window.location.href('/')
                                                }else{
                                                    props.history.push('/')
                                                }
                                            }else{
                                                props.history.push('/')
                                            }
                                        }
                                    }
                                }
                            }
                        }else{
                            props.history.push('/')
                        }
                    })
                }else{
                    message.warning(res.msg)
                }
			})
        },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Login))
