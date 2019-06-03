import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import PictureRules from './index'
import API from '../../../api/index'
import { message } from 'antd'

function mapStateToProps(state,props) {
    const userInfo = state.loginReducer.userInfo || {};
    const { brandList = [], filterList = [], typeList = [] } = state.commonReducer;    
    return {
        brandList,
        userInfo,
        typeList,
        filterList
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        createpicturerules: (data,callback) => {
            API.createImageMonitor(data).then(res=>{
                if(res.success===true){
                    callback()
                    props.history.push('/monitor/rule')
                }else{
                    message.warn(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PictureRules))
