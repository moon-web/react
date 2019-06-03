import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import commonRulesDetiles from './picturerule'
import { actionCreator } from '../../../utils/util'
import API from '../../../api/index'
import { GET_MONITOR_DETAILS_SUCCESS } from '../../../contants/monitoring/monitoringDetailsTypes'
import { message } from 'antd'

function mapStateToProps(state,props) {    
    const { monitorDetailsList } = state.monitorDetailsListRedcer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
        monitorDetailsList,
        userInfo
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        pictureRulesDetiles: (data) => {
            API.monitorDetails(data).then(res=>{
                if (res.success) {
                    dispatch(actionCreator(GET_MONITOR_DETAILS_SUCCESS, { monitorDetailsList: res.dataObject }))
                }else{
                    message.warn(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(commonRulesDetiles))
