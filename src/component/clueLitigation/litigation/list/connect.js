import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Litigation from './index'
import { actionCreator,union } from '../../../../utils/util'
import { GET_LITIGATION_LIST_SUCCESS } from '../../../../contants/litigation/litigationTypes.js'
import { message } from 'antd'
import Api from '../../../../api/index'
function mapStateToProps(state, props) {
    const { oldLigiationList, newLigiationList, total, isFetch, pageNo, pageSize, searchData } = state.ligitaionReducer
    const { permissionList=[], lawyerBrand=[], ligiationStatus=[]} =state.commonReducer
    const ligitaionList = union(oldLigiationList, newLigiationList)
    // 属性 
    return {
        ligitaionList,
        total,
        isFetch,
        pageNo,
        pageSize,
        searchData,
        lawyerBrand,
        permissionList,
        ligiationStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getLitigationListData: (data,oldLigiationList) => {
            dispatch(actionCreator(GET_LITIGATION_LIST_SUCCESS, { isFetch: true }))
            Api.getSuitPage(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_LITIGATION_LIST_SUCCESS, { oldLigiationList, newLigiationList: res.result ?  res.result : [], total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false, searchData: data }))
                }else{
                    message.error(res.msg)
                }
            })
        }       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Litigation))
