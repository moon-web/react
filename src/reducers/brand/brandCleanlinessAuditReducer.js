
import { GET_CLEAN_TYPE_LIST_SUCCESS, GET_CLEANAUDIT_PROD_LIST_SUCCESS } from '../../contants/brand/brandCleanlinessAuditType'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_CLEAN_TYPE_LIST_SUCCESS:
            return Object.assign({}, state, {
                auditbrandCleanTypeList: action.auditbrandCleanTypeList
            })
        case GET_CLEANAUDIT_PROD_LIST_SUCCESS:
            return Object.assign({}, state, {
                auditbrandCleanProdList: action.auditbrandCleanProdList
            })
        default:
            return state
    }
}