import { GET_LAWYER_LIST_SUCCESS, UPDATE_LAWYER_LIST_SUCCESS, UPDATE_LAWYER_LIST_ERROR } from '../../contants/users/lawyerListTypes.js'
export default function(state = {}, action) {
    switch(action.type) {
        case GET_LAWYER_LIST_SUCCESS:
            return Object.assign({}, state, {                
                isFetch: action.isFetch,
                oldLawyerList: action.oldLawyerList,
                newLawyerList: action.newLawyerList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_LAWYER_LIST_SUCCESS:
            return Object.assign({}, state, {
                oldLawyerList: action.oldLawyerList,
                newLawyerList: action.newLawyerList,
            })
        case UPDATE_LAWYER_LIST_ERROR:
            return Object.assign({}, state, {
                oldLawyerList: action.oldLawyerList,
                newLawyerList: action.newLawyerList,
            })
        default:
            return state
    }
}