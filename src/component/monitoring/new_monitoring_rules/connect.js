import { connect } from 'react-redux'
import { actionCreator } from '../../../utils/util'
import { injectIntl } from 'react-intl'
import MonitoringRules from './index'
import API from '../../../api/index'
import { message } from 'antd'
import { GET_MONITOR_MONITORING_SUCCESS } from '../../../contants/monitoring/monitoringAddTypes'

function mapStateToProps(state,props) {
    const { brandList, filterList, platfromList, monitorRulesQueryParamsSort} = state.commonReducer;    
    const userInfo = state.loginReducer.userInfo || {};
    const isFetch = state.monitorAdd.isFetch
    return {
        brandList,
        filterList,
        platfromList,
        userInfo,
        isFetch,
        monitorRulesQueryParamsSort
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        createMonitor: (data) => {               
            dispatch(actionCreator(GET_MONITOR_MONITORING_SUCCESS, { isFetch: false }))         
            API.createCycleMonitor(data).then(res => {
                if(res.success===true){
                    dispatch(actionCreator(GET_MONITOR_MONITORING_SUCCESS, { isFetch: true }))
                    props.history.push('/monitor/rule')                    
                }else{
                    message.warn(res.msg)
                }
            })            
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MonitoringRules))
