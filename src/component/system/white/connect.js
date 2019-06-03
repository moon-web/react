import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import WhiteList from './index'
import { actionCreator, union } from '../../../utils/util'
import { message } from 'antd'
import { GET_WHITE_LIST_SUCCESS } from '../../../contants/system/whiteListTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { platfromList, brandList, complaintSourceList, complaintStatusList, permissionList } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldWhiteList, newWhiteList, searchData, pageNo, pageSize = 10, total } = state.whiteReducer;
    const whiteList = union(oldWhiteList, newWhiteList)
    return {
        platfromList,
        brandList,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        whiteList,
        userInfo,
        complaintStatusList,
        complaintSourceList,
        permissionList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getWhiteList: (data, oldWhiteList) => {
            dispatch(actionCreator(GET_WHITE_LIST_SUCCESS, { isFetch: true }))
            Api.whiteList(data).then(res => {
                dispatch(actionCreator(GET_WHITE_LIST_SUCCESS, { oldWhiteList, newWhiteList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
            })
        },
        updateWhiteList: (data, callback) => {
            Api.delWhite(data).then(res => {
                if(res.success){
                    callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        saveExcelData: (data) => {
            Api.createExportExcel(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        importExcelAppendOrCover: (data, callback) => {
            Api.appendOrCover(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(WhiteList))
