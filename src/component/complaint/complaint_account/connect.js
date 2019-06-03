import { connect } from 'react-redux'
import ComponentAccount from './index'
import { injectIntl } from 'react-intl'
import Api from '../../../api/index'
import { message } from 'antd'
import { actionCreator, union } from '../../../utils/util'
import { GET_COMPLAINT_ACCOUNT_LIST_SUCCESS, GET_COMPLAINT_ACCOUNT_ADD_SUCCESS, UPDATE_COMPLAINT_ACCOUNT_SUCCESS, UPDATE_COMPLAINT_ACCOUNT_ERROR } from '../../../contants/system/complaintAccountTypes'
function mapStateToProps(state, props) {
	// 属性 
    const { complaintPlatfromList = [], permissionList, brandMerchant  } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldComplaintAccountList, newComplaintAccountList, pageNo, pageSize = 10, total, isFetchBtag } = state.complaintAccountReducer;
    const complaintAccountList = union(oldComplaintAccountList, newComplaintAccountList)
    return {
        permissionList,
        complaintPlatfromList,
        isFetch,
        pageNo,
        pageSize,
        total,
        complaintAccountList,
        userInfo,
        isFetchBtag,
        brandMerchant
    }
}
function mapDispatchToProps(dispatch, props) {
	return {
		getComplaintAccountList: (data, oldComplaintAccountList) => {
            dispatch(actionCreator(GET_COMPLAINT_ACCOUNT_LIST_SUCCESS, { isFetch: true }))
            Api.complaintList(data).then(res => {
                if(res.success){
                    dispatch(actionCreator(GET_COMPLAINT_ACCOUNT_LIST_SUCCESS, { oldComplaintAccountList, newComplaintAccountList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
                }else {
                    dispatch(actionCreator(GET_COMPLAINT_ACCOUNT_LIST_SUCCESS, { isFetch: false }))
                }
            })
		},
        complaintAccountEdit: (data, oldComplaintAccountList, callback) => {
            Api.complaintEdit(data).then(res => {
                if(res.success) {                    
					let newComplaintAccountList = []
					for(let i = 0; i < oldComplaintAccountList.length; i ++){
						const element = oldComplaintAccountList[i]
						if(element.accountId === data.id){
                                element.cookie = data.cookie
                                element.platformIdList = data.platformId
                                element.platformName = data.platform
                                element.platform = data.platformEn
						}
						newComplaintAccountList.push(element)
                    }
                    typeof callback === 'function' && callback()
					dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_SUCCESS, { newComplaintAccountList }))
				}else {
					dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_ERROR, { oldComplaintAccountList }))
				}
            })
        },
        deleteAccount: (data, callback) => {
            Api.complaintDel(data).then(res => {
                if(res.success){
                    message.success("操作成功")
                    typeof callback === 'function' && callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        addAccount: (data, callback) => {
            Api.complaintAdd(data).then(res => {
                dispatch(actionCreator(GET_COMPLAINT_ACCOUNT_ADD_SUCCESS, { isFetchBtag: false }))  
                if(res.success) {
                    dispatch(actionCreator(GET_COMPLAINT_ACCOUNT_ADD_SUCCESS, { isFetchBtag: true }))   
                    typeof callback === 'function' && callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        //立即下拉线上投诉数据
        complaintPullData: (data, oldComplaintAccountList) => {
            Api.complaintPullData(data).then(res => {
                if(res.success) {                    
					let newComplaintAccountList = []
					for(let i = 0; i < oldComplaintAccountList.length; i ++){
						const element = oldComplaintAccountList[i]
						if(element.id === data.id){
                                element.signName = '拉取中'
                                element.signNameEn = 'Pull in'
                                element.sign = 1
						}
						newComplaintAccountList.push(element)
                    }
                    message.info('拉取线上数据成功！')
					dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_SUCCESS, { newComplaintAccountList }))
				}else {
                    message.info(res.msg)
					dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_ERROR, { oldComplaintAccountList }))
				}
            })
        },
        //关联品牌商
        complaintBindBrand: (data, callback) => {
            Api.complaintBindBrand(data).then(res => {
                if(res.success) {
                    message.success("操作成功")
                    typeof callback === 'function' && callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        //获取自动投诉Cookie
        getCookitNumData:(data,oldComplaintAccountList) =>{
            Api.getCookitNum(data).then(res => {
                if(res.success) {     
                    let newComplaintAccountList = []
					for(let i = 0; i < oldComplaintAccountList.length; i ++){
						const element = oldComplaintAccountList[i]
						if(element.id === data.ids){
                                element.autoCookiesStatusName = '获取中'
                                element.autoCookiesStatusNameEn = 'Acquisition'
                                element.autoCookiesStatus = 1
						}
						newComplaintAccountList.push(element)
                    }              
                    message.info('拉取自动投诉Cookie成功！')
                    dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_SUCCESS, { newComplaintAccountList }))
				}else {
                    message.info(res.msg)
                    dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_ERROR, { oldComplaintAccountList }))
				}
            })
        },
        //获取自动投诉
        getAutomatedComplaintData: (data, oldComplaintAccountList) => {
            Api.getAutomatedComplaint(data).then(res => {
                if(res.success) {
                    let newComplaintAccountList = []
					for(let i = 0; i < oldComplaintAccountList.length; i ++){
						const element = oldComplaintAccountList[i]
						if(element.id === data.id){
                            if(data.isAllowedAutoComplaint === 0){
                                element.isAllowedAutoComplaintName = '否'
                                element.isAllowedAutoComplaintNameEn = 'No'
                            }else {                                
                                element.isAllowedAutoComplaintName = '是'
                                element.isAllowedAutoComplaintNameEn = 'Yes'
                            }
                                element.isAllowedAutoComplaint = data.isAllowedAutoComplaint
						}
						newComplaintAccountList.push(element)
                    }    
                    if(data.isAllowedAutoComplaint === 0) {
                        message.info('自动投诉关闭成功')
                    }else {
                        message.info('自动投诉开启成功')
                    }        
                    dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_SUCCESS, { newComplaintAccountList }))
				}else {
                    message.info(res.msg)
                    dispatch(actionCreator(UPDATE_COMPLAINT_ACCOUNT_ERROR, { oldComplaintAccountList }))
				}
            })
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ComponentAccount))