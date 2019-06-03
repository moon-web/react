import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import Authority from './index'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_PERMISSION_LIST_SUCCESS } from '../../../contants/commonTypes'
import { GET_AUTHORITY_SUCCESS } from '../../../contants/system/authorityTypes'

function eachData(data) {
    if (data.length) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            const element = data[i];
            if (element.subList) {
                element.children = element.subList;
                eachData(element.subList)
            }
            if (i === length - 1) {
                let permName = '';
                if (element.level === 1) {
                    permName = '一级菜单';
                } else if (element.level === 2) {
                    permName = '二级菜单'
                } else if (element.level === 3) {
                    permName = '三级菜单'
                }
                data.push({
                    status: -1,
                    permId: element.permId + '1',
                    parentId: element.parentId,
                    permName: permName,
                    children: '',
                    level: element.level
                })
            }
        }
        return data;
    }
}

function mapStateToProps(state, ownProps) {
    const { permissionList } = state.commonReducer
    const { oldAuthorityList, newAuthorityList, isFetch } = state.authorityReducer
    const authorityList = union(oldAuthorityList, newAuthorityList)
    return {
        permissionList,
        authorityList,
        isFetch
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        // 获取权限列表
        getAuthTree: (data, callback) => {
            dispatch(actionCreator(GET_AUTHORITY_SUCCESS, { isFetch: true }))
            Api.authorityPages(data).then(res => {
                typeof callback === 'function' && callback()
                if (res.success) {
                    let data = eachData(res.dataObject, []);
                    dispatch(actionCreator(GET_AUTHORITY_SUCCESS, { newAuthorityList: data, isFetch: false }))
                } else {
                    dispatch(actionCreator(GET_AUTHORITY_SUCCESS, { newAuthorityList: [], isFetch: false }))
                }
            })
        },
        // 添加权限功能
        addAuthority: (data, callback) => {
            Api.addAuthority(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info(res.msg)
                }
            })
        },
        // 删除权限功能
        deleteAuthority: (data, callback) => {
            Api.deleteAuthority(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info(res.msg)
                }
            })
        },
        // 编辑权限功能
        editAuthority: (data, callback) => {
            Api.editAuthority(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info(res.msg)
                }
            })
        },
        // 编辑权限排序
        editAuthoritySort: (data, callback) => {
            Api.editAuthoritySort(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info(res.msg)
                }
            })
        },
        getPermissionList: () => {
            Api.permissionList().then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_PERMISSION_LIST_SUCCESS, { permissionList: res.dataObject || [] }))
                }
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Authority))
