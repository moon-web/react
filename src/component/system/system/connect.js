import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import SystemList from './index'
import { actionCreator, union } from '../../../utils/util'
import { message } from 'antd'
import { GET_SYSTEM_LIST_SUCCESS, UPDATE_SYSTEM_LIST_SUCCESS, UPDATE_SYSTEM_LIST_ERROR, GET_SYSTEM_ROLE_SUCCESS, GET_SYSTEM_ADD_SUCCESS } from '../../../contants/system/systemListTypes'
import { GET_OWNER_BRAND_LIST_SUCCESS }  from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { platfromList, brandList, systemUserType, permissionList ,brandMerchant=[], systemUserStatusType } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldSyatemList, newSystemList, searchData, pageNo, pageSize = 10, total, systemRoleList } = state.systemReducer;
    const systemList = union(oldSyatemList, newSystemList)
    return {
        permissionList,
        platfromList,
        brandList,
        systemUserType,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        systemList,
        userInfo,
        systemRoleList,
        brandMerchant,
        systemUserStatusType
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getSystemList: (data, oldSyatemList) => {
            dispatch(actionCreator(GET_SYSTEM_LIST_SUCCESS, { isFetch: true }))
            Api.systemList(data).then(res => {
                if(res.success){
                    dispatch(actionCreator(GET_SYSTEM_LIST_SUCCESS, { oldSyatemList, newSystemList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
                }else {
                    dispatch(actionCreator(GET_SYSTEM_LIST_SUCCESS, { isFetch: false }))
                }
            })
        },
        systemPass: (data, oldSyatemList, callback) => {
            Api.systemPass(data).then(res => {
                if(res.success) {                    
					let newSystemList = []
					for(let i = 0; i < oldSyatemList.length; i ++){
						const element = oldSyatemList[i]
						if(element.userId === data.adminUserId){
                            if(data.adminStatus === 'on'){
                                element.userStatus = 0
                            }else {
                                element.userStatus = 1
                            }  
                            element.userStatusName = data.userStatusName
                            element.userStatusNameEn = data.userStatusNameEn                         
						}
						newSystemList.push(element)
                    }
                    typeof callback === 'function' && callback()
					dispatch(actionCreator(UPDATE_SYSTEM_LIST_SUCCESS, { newSystemList }))
				}else {
					dispatch(actionCreator(UPDATE_SYSTEM_LIST_ERROR, { oldSyatemList }))
				}
            })
        },
        getSystemRole: (data) => {
            Api.systemRole(data).then(res => {
                if(res.success){
                    dispatch(actionCreator(GET_SYSTEM_ROLE_SUCCESS, {systemRoleList: res.dataObject || []}))
                }
            })
        },
        systemChangePw: (data, callback) => {
            Api.systemChangePw(data).then(res => {
                if(res.success) {
                    message.success("操作成功")
                    typeof callback === 'function' && callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        systemAdd: (data, callback) => {
            dispatch(actionCreator(GET_SYSTEM_ADD_SUCCESS, { isFetchBtag: false }))   
            Api.systemCreate(data).then(res => {
                if(res.success) {
                     message.success("操作成功")
                     dispatch(actionCreator(GET_SYSTEM_ADD_SUCCESS, { isFetchBtag: true })) 
                     typeof callback === 'function' && callback()  
                     //新增品牌商后更新品牌商数据
                     Api.getOwnedBrandList().then(res => {
                        if (res.success) {
                            dispatch(actionCreator(GET_OWNER_BRAND_LIST_SUCCESS, { brandMerchant: res.dataObject }))
                        }
                    })
                }else {
                    message.info(res.msg)
                }
            })
        },
        updateUserRole: (data, result, oldList, callback) => {
            Api.systemUserRole(data).then(res => {
                if (res.success) {
                    for (let i = 0; i < oldList.length; i++) {
                        const element = oldList[i];
                        if (element.userId === result.userId) {
                            element.roleIdList = result.roleIdList;
                            element.roleStr = result.roleStr
                        }
                    }
                    message.success('更新成功');
                    dispatch(actionCreator(UPDATE_SYSTEM_LIST_SUCCESS, {newSystemList: oldList}))
                    typeof callback === 'function' && callback()
                } else {
                    message.info(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SystemList))
