import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import OfflineCaseList from './index'
import { actionCreator, union } from '../../../../utils/util'
import { GET_OFFLINE_CASE_LIST_SUCCESS } from '../../../../contants/offlineCase/offlineCaseTypes'
import { message } from 'antd'
import Api from '../../../../api/index'
function mapStateToProps(state, props) {
    const { oldOfflineCaseList, newOfflineCaseList, total, isFetch, pageNo, pageSize, searchData } = state.offlineCaseReducer
    const { permissionList = [], lawyerBrand = [], offlineCaseType = [], offlineCaseClueType, offlineCaseStatusList } = state.commonReducer
    const offlineCaseList = union(oldOfflineCaseList, newOfflineCaseList)
    // 属性 
    return {
        offlineCaseList,
        total,
        isFetch,
        pageNo,
        pageSize,
        searchData,
        lawyerBrand,
        permissionList,
        offlineCaseType,
        offlineCaseClueType,
        offlineCaseStatusList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getOfflineCaseListData: (data, oldOfflineCaseList) => {
            dispatch(actionCreator(GET_OFFLINE_CASE_LIST_SUCCESS, { isFetch: true }))
            Api.queryOfflineList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_OFFLINE_CASE_LIST_SUCCESS, { oldOfflineCaseList, newOfflineCaseList: res.result ? res.result : [], total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false, searchData: data }))
                } else {
                    message.error(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OfflineCaseList))
