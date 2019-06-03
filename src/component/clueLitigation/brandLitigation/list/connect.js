import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Litigation from './index'
import { actionCreator,union } from '../../../../utils/util'
import { GET_BRAND_LITIGATION_LIST_SUCCESS } from '../../../../contants/litigation/litigationTypes.js'
import { message } from 'antd'
import Api from '../../../../api/index'
function mapStateToProps(state, props) {
    const { oldBrandLigiationList, newBrandLigiationList, total, isFetch, pageNo, pageSize, searchData } = state.brandLitigationReducer
    const { permissionList=[], lawyerBrand=[], ligiationStatus=[]} =state.commonReducer
    const brandLigitaionList = union(oldBrandLigiationList, newBrandLigiationList)
    // 属性 
    return {
        brandLigitaionList,
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
        getLitigationListData: (data,oldBrandLigiationList) => {
            dispatch(actionCreator(GET_BRAND_LITIGATION_LIST_SUCCESS, { isFetch: true }))
            Api.brandSuitList(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_BRAND_LITIGATION_LIST_SUCCESS, { oldBrandLigiationList, newBrandLigiationList: res.result ?  res.result : [], total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false, searchData: data }))
                }else{
                    message.error(res.msg)
                }
            })
        }       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Litigation))
