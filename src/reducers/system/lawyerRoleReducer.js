
import { GET_LAWYER_ROLE_LIST_SUCCESS, GET_LAWYER_ROLE_ERROR_SUCCESS, GET_LAWYER_ROLE_STATUS_SUCCESS, GET_LAWYER_USER_ROLE_AUTH_TREE_SUCCESS, UPDATE_LAWYER_USER_ROLE_AUTH_TREE_SUCCESS, UPDATE_USER_ROLE_AUTH_TREE_ERROR } from '../../contants/system/lawyerRoleTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_LAWYER_ROLE_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldRoleList: action.oldRoleList,
                newRoleList: action.newRoleList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_LAWYER_ROLE_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newRoleList: action.newRoleList
            })
        case GET_LAWYER_ROLE_ERROR_SUCCESS:
            return Object.assign({}, state, {
                oldRoleList: action.oldRoleList
            })
        case GET_LAWYER_USER_ROLE_AUTH_TREE_SUCCESS:
            return Object.assign({}, state, {
                userRoleAuthTree: action.userRoleAuthTree
            })
        case UPDATE_LAWYER_USER_ROLE_AUTH_TREE_SUCCESS:
            return Object.assign({}, state, {
                userRoleAuthTree: action.newAuthTree
            })
        case UPDATE_USER_ROLE_AUTH_TREE_ERROR:
            return Object.assign({}, state, {
                userRoleAuthTree: action.oldAuthTree
            })
        default:
            return state
    }
}