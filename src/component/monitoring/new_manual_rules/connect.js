import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import NewManualRules from './index'
import API from '../../../api/index'
import { message } from 'antd'

function mapStateToProps(state,props) {
    const { brandList = [], filterList = [] } = state.commonReducer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
        brandList,
        userInfo,
        filterList
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        newManualMonitor: (data,callback) => {
            API.newManualMonitor(data).then(res => {
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewManualRules))
