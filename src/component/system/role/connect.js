import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import RoleList from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_ROLE_LIST_SUCCESS , GET_ROLE_STATUS_SUCCESS, GET_ROLE_ERROR_SUCCESS} from '../../../contants/system/roleListTypes'
import { message } from 'antd'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { userInfo } = state.loginReducer;
    const { permissionList=[],systemRoleStatusType=[] } = state.commonReducer;
    const { isFetch, oldRoleList, newRoleList, pageNo, pageSize = 10, total } = state.roleListReducer;
    const rolelist = union(oldRoleList, newRoleList)
    return {
        userInfo,
        rolelist,
        pageNo,
        pageSize,
        total,
        isFetch,
        permissionList,
        systemRoleStatusType
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //获取列表数据
        getRoleList:(data,oldRoleList) =>{
            dispatch(actionCreator(GET_ROLE_LIST_SUCCESS, { isFetch: true }))
            Api.roleList(data).then(res =>{
                if(res.success){
                    dispatch(actionCreator(GET_ROLE_LIST_SUCCESS, { oldRoleList, newRoleList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
                }
            })
        },
        //0禁用  1启用
        editRoleStatus:(data, oldRoleList, callback) =>{
            if( data.status === 0 ){
                Api.roleDeleteId(data).then((res)=>{
                    if (res.success) {
                        let result = [];
                        for (let i = 0; i < oldRoleList.length; i++) {
                            const element = oldRoleList[i];
                            if (element.roleId=== data.roleId) {
                                element.status = data.status
                                element.statusName = data.statusName
                                element.statusNameEn = data.statusNameEn
                            }
                            result.push(element)
                        }
                        dispatch(actionCreator(GET_ROLE_STATUS_SUCCESS, {newRoleList: result}))
                        typeof callback === 'function' && callback()
                    } else {
                        dispatch(actionCreator(GET_ROLE_ERROR_SUCCESS, {oldRoleList: oldRoleList}))
                        message.error(res.msg)
                    }
                })
            }else if( data.status === 1) {
                Api.roleEnable(data).then((res)=>{
                    if (res.success) {
                        let result = [];
                        for (let i = 0; i < oldRoleList.length; i++) {
                            const element = oldRoleList[i];
                            if (element.roleId=== data.roleId) {
                                element.status = data.status
                                element.statusName = data.statusName
                                element.statusNameEn = data.statusNameEn
                            }
                            result.push(element)
                        }
                        dispatch(actionCreator(GET_ROLE_STATUS_SUCCESS, {newRoleList: result}))
                        typeof callback === 'function' && callback()
                    } else {
                        dispatch(actionCreator(GET_ROLE_ERROR_SUCCESS, {oldRoleList: oldRoleList}))
                        message.error(res.msg)
                    }
                })
            }
        },
        //删除角色
        editRoleDel:(data, callback) =>{
            Api.roleDel(data).then((res)=>{
                if (res.success) {
                    message.success(res.msg)
                    callback()
                } else {
                    message.error(res.msg)
                }
            })
        },
        //新增角色
        roleAdd: (data, callback) => {
            Api.roleAdd(data).then(res => {
                if(res.success) {
                    typeof callback === 'function' && callback()
                }else {
                    message.error(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RoleList))
