import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import BrandOfflineCaseList from './index'
import { actionCreator,union } from '../../../../utils/util'
import { GET_BRABD_OFFLINE_CASE_LIST_SUCCESS } from '../../../../contants/offlineCase/brandOfflineCaseTypes'
import { message } from 'antd'
import Api from '../../../../api/index'
function mapStateToProps(state, props) {
    const { oldBrandOfflineCaseList, newBrandOfflineCaseList, total, isFetch, pageNo, pageSize, searchData } = state.brandOfflineCaseReducer
    const { permissionList = [], lawyerBrand = [], offlineCaseType = [], offlineCaseClueType = [], brandOffLineCaseStatusList = []} =state.commonReducer
    const brandOfflineCaseList = union(oldBrandOfflineCaseList, newBrandOfflineCaseList)
    // 属性 
    return {
        brandOfflineCaseList,
        total,
        isFetch,
        pageNo,
        pageSize,
        searchData,
        lawyerBrand,
        permissionList,
        offlineCaseType,
        offlineCaseClueType,
        brandOffLineCaseStatusList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getBarndOfflineCaseList: (data,oldBrandOfflineCaseList) => {
            dispatch(actionCreator(GET_BRABD_OFFLINE_CASE_LIST_SUCCESS, { isFetch: true }))
            Api.caseConfirmPage(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_BRABD_OFFLINE_CASE_LIST_SUCCESS, { oldBrandOfflineCaseList, newBrandOfflineCaseList: res.result ?  res.result : [], total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false, searchData: data }))
                }else{
                    message.error(res.msg)
                }
            })
        }       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BrandOfflineCaseList))
